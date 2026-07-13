"use client";

import { forwardRef, useImperativeHandle, useMemo, useRef } from "react";
import { extend, useFrame } from "@react-three/fiber";
import { shaderMaterial } from "@react-three/drei";
import * as THREE from "three";

/**
 * A phosphor-green (`#39ffcf`) bioluminescent wake that trails the
 * pointer across the sea. `Canvas3D` wires `Sea`'s `onPointerMove` (an
 * r3f pointer event, unifying mouse + touch — see `useHover.ts` for the
 * same reasoning) to call `WakeHandle.addPoint(point)` on every move;
 * this component owns the fading trail buffer and renders it as a small
 * `THREE.Points` cloud with a custom shader for a soft, glowing falloff.
 *
 * Trail state lives in a plain ref + a mutable `BufferGeometry`, updated
 * inside `useFrame` rather than via React state — pointer moves and the
 * render loop can both be high-frequency, and pushing them through
 * `setState` would re-render the whole scene subtree every frame.
 */

const MAX_POINTS = 48;
const FADE_SECONDS = 1.0;
// Minimum spacing (world units, squared) between consecutively recorded
// points — keeps the trail from oversampling when the pointer sits still.
const MIN_SPACING_SQ = 0.09;

type TrailPoint = { x: number; z: number; t: number };

export type WakeHandle = {
  /** Record a new pointer-on-sea position (world x/z). */
  addPoint: (point: THREE.Vector3) => void;
};

const WakeMaterial = shaderMaterial(
  { uColor: new THREE.Color("#39ffcf") },
  // vertex shader
  /* glsl */ `
    attribute float aAlpha;
    attribute float aSize;
    varying float vAlpha;

    void main() {
      vAlpha = aAlpha;
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      gl_PointSize = aSize * (200.0 / -mvPosition.z);
      gl_Position = projectionMatrix * mvPosition;
    }
  `,
  // fragment shader
  /* glsl */ `
    uniform vec3 uColor;
    varying float vAlpha;

    void main() {
      // Soft circular falloff so points read as glowing motes, not
      // hard-edged squares.
      vec2 uv = gl_PointCoord - 0.5;
      float glow = smoothstep(0.5, 0.0, length(uv));
      gl_FragColor = vec4(uColor, glow * vAlpha);
    }
  `,
);

extend({ WakeMaterial });

declare module "@react-three/fiber" {
  interface ThreeElements {
    wakeMaterial: THREE.ShaderMaterialParameters & {
      ref?: React.Ref<THREE.ShaderMaterial>;
      uColor?: THREE.Color;
    };
  }
}

const Wake = forwardRef<WakeHandle>(function Wake(_props, ref) {
  const trail = useRef<TrailPoint[]>([]);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array(MAX_POINTS * 3), 3),
    );
    geo.setAttribute(
      "aAlpha",
      new THREE.BufferAttribute(new Float32Array(MAX_POINTS), 1),
    );
    geo.setAttribute(
      "aSize",
      new THREE.BufferAttribute(new Float32Array(MAX_POINTS), 1),
    );
    geo.setDrawRange(0, 0);
    return geo;
  }, []);

  useImperativeHandle(
    ref,
    () => ({
      addPoint(point: THREE.Vector3) {
        const points = trail.current;
        const last = points[points.length - 1];
        const dx = last ? point.x - last.x : Infinity;
        const dz = last ? point.z - last.z : Infinity;
        if (last && dx * dx + dz * dz < MIN_SPACING_SQ) {
          return;
        }
        points.push({ x: point.x, z: point.z, t: performance.now() / 1000 });
        if (points.length > MAX_POINTS) {
          points.shift();
        }
      },
    }),
    [],
  );

  useFrame(() => {
    const now = performance.now() / 1000;

    // Prune points older than the fade window. The trail itself only
    // grows on `addPoint` calls (driven by Sea's `onPointerMove`), so
    // once the pointer stops moving or leaves the sea it naturally stops
    // growing and just ages out here.
    trail.current = trail.current.filter((p) => now - p.t < FADE_SECONDS);

    const positions = geometry.getAttribute("position") as THREE.BufferAttribute;
    const alphas = geometry.getAttribute("aAlpha") as THREE.BufferAttribute;
    const sizes = geometry.getAttribute("aSize") as THREE.BufferAttribute;

    trail.current.forEach((p, i) => {
      const age = (now - p.t) / FADE_SECONDS; // 0 = fresh, 1 = fully faded
      positions.setXYZ(i, p.x, 0.06, p.z);
      alphas.setX(i, Math.max(0, 1 - age) * 0.55);
      sizes.setX(i, 0.4 + (1 - age) * 0.35);
    });

    positions.needsUpdate = true;
    alphas.needsUpdate = true;
    sizes.needsUpdate = true;
    geometry.setDrawRange(0, trail.current.length);
  });

  return (
    <points geometry={geometry}>
      <wakeMaterial transparent depthWrite={false} blending={THREE.AdditiveBlending} />
    </points>
  );
});

export default Wake;
