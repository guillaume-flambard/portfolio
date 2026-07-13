"use client";

import { useMemo, useRef } from "react";
import { extend, useFrame } from "@react-three/fiber";
import type { ThreeEvent } from "@react-three/fiber";
import { shaderMaterial } from "@react-three/drei";
import * as THREE from "three";

/**
 * Nautical-chart "sea": a large flat plane with a custom shader.
 *
 * This is deliberately not an ocean simulation — it's a chart. The vertex
 * shader applies a few summed sine waves (low amplitude, slow) for a gentle
 * shimmer, and the fragment shader blends a warm paper tone in the
 * "shallows" toward a deeper stone/contour tone further from the center,
 * banded with faint `fract()`-based lines to evoke bathymetric contours.
 */

const SeaMaterial = shaderMaterial(
  {
    uTime: 0,
    // Warm paper (shallows) -> contour/stone (deeper).
    uColorShallow: new THREE.Color("#FFFBEB"),
    uColorDeep: new THREE.Color("#9c8f6e"),
    uContourColor: new THREE.Color("#9c8f6e"),
  },
  // vertex shader
  /* glsl */ `
    uniform float uTime;
    varying float vElevation;
    varying float vDist;

    void main() {
      vec3 pos = position;

      // position.xy are the plane's local axes before rotation; treat them
      // as our "world" x/z since the plane is rotated flat in the scene.
      float dist = length(pos.xy);

      // Subtle, slow, layered sine waves — a gentle chart shimmer, not surf.
      float wave = 0.0;
      wave += sin(pos.x * 0.35 + uTime * 0.35) * 0.12;
      wave += sin(pos.y * 0.45 - uTime * 0.28) * 0.09;
      wave += sin((pos.x + pos.y) * 0.2 + uTime * 0.18) * 0.06;

      pos.z += wave;

      vElevation = wave;
      vDist = dist;

      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `,
  // fragment shader
  /* glsl */ `
    uniform float uTime;
    uniform vec3 uColorShallow;
    uniform vec3 uColorDeep;
    uniform vec3 uContourColor;
    varying float vElevation;
    varying float vDist;

    void main() {
      // Radial gradient: warm paper near the center, deeper tone further out.
      float depthT = smoothstep(0.0, 22.0, vDist);
      vec3 base = mix(uColorShallow, uColorDeep, depthT);

      // Faint bathymetric contour bands, based on radial distance plus a
      // slow time drift so they feel alive without being distracting.
      float bandInput = vDist * 0.6 - uTime * 0.05;
      float band = fract(bandInput);
      // Thin line centered where fract() wraps around 0 (both near 0 and near 1).
      float line = smoothstep(0.0, 0.035, band) * smoothstep(1.0, 0.965, band);
      float contour = 1.0 - line;

      vec3 color = mix(base, uContourColor, contour * 0.16);

      // A whisper of extra shading from the wave elevation, kept subtle.
      color += vElevation * 0.08;

      gl_FragColor = vec4(color, 1.0);
    }
  `,
);

extend({ SeaMaterial });

declare module "@react-three/fiber" {
  interface ThreeElements {
    seaMaterial: THREE.ShaderMaterialParameters & {
      ref?: React.Ref<THREE.ShaderMaterial>;
      uTime?: number;
      uColorShallow?: THREE.Color;
      uColorDeep?: THREE.Color;
      uContourColor?: THREE.Color;
    };
  }
}

type SeaProps = {
  /**
   * Forwarded onto the sea mesh's r3f `onPointerMove`. Used by `Wake` (via
   * `Canvas3D`) to sample where the pointer projects onto the sea plane —
   * r3f hands back the world-space raycast intersection as
   * `event.point`, so no separate manual raycaster is needed.
   */
  onPointerMove?: (event: ThreeEvent<PointerEvent>) => void;
};

/** Large flat plane rendering the nautical-chart sea. */
export default function Sea({ onPointerMove }: SeaProps) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const geometryArgs = useMemo<[number, number, number, number]>(
    () => [80, 80, 128, 128],
    [],
  );

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  return (
    <mesh
      rotation={[-Math.PI / 2, 0, 0]}
      receiveShadow
      onPointerMove={onPointerMove}
    >
      <planeGeometry args={geometryArgs} />
      <seaMaterial ref={materialRef} uTime={0} />
    </mesh>
  );
}
