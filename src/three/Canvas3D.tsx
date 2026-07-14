"use client";

import { useCallback, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import type { ThreeEvent } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import Sea from "@/three/Sea";
import Island from "@/three/Island";
import Wake, { type WakeHandle } from "@/three/Wake";
import { useHover } from "@/three/useHover";
import { useCameraSail } from "@/three/useCameraSail";
import { useExploreCamera } from "@/three/useExploreCamera";
import { useExplore } from "@/three/explore-context";
import type { Island as IslandData } from "@/content/islands";
import type { Locale } from "@/content/islands";

type Canvas3DProps = {
  islands: IslandData[];
  locale: Locale;
};

/**
 * The actual R3F scene subtree. Kept in its own module so it can be
 * lazy-loaded via `next/dynamic` with `{ ssr: false }` — this keeps
 * three.js / @react-three/fiber out of the server-rendered / initial
 * JS bundle entirely.
 *
 * Task 8 added the camera/lights placeholder; Task 9 added the nautical
 * sea shader plane (`./Sea`). Task 10 maps the island registry to one
 * `<Island>` per entry, positioned at its chart coordinates with a
 * locale-aware label. Task 11 wires up `useHover` (island hover →
 * `pointer` cursor) and `Wake` (a phosphor trail following the pointer
 * across the sea).
 *
 * `<Canvas>` itself has to stay a thin wrapper: hooks like `useThree`
 * (which `useCameraSail` needs, to reach the r3f camera) only work
 * inside the fiber tree `<Canvas>` creates, not in the component that
 * renders `<Canvas>`. So the actual scene contents — and Task 12's sail
 * wiring — live in the nested `Scene` component below.
 */
export default function Canvas3D({ islands, locale }: Canvas3DProps) {
  return (
    <Canvas
      camera={{ position: [0, 6, 16], fov: 45 }}
      // Soft shadows: islands/Sea opt in per-mesh via castShadow/
      // receiveShadow; the key light below carries the actual shadow map.
      shadows
      // Cap device pixel ratio at 1.5 (Task 13 perf budget) so retina/
      // hi-dpi screens don't multiply fragment-shader cost for no visual
      // gain on this background scene.
      dpr={[1, 1.5]}
      // Deliberately NOT `frameloop="demand"`: `Sea` and `Wake` animate
      // continuously via `useFrame` (shader time uniform, wake decay).
      // `demand` only re-renders on explicit `invalidate()` calls, which
      // would freeze both animations. Default (`"always"`) is required.
      style={{ width: "100%", height: "100%" }}
    >
      <Scene islands={islands} locale={locale} />
    </Canvas>
  );
}

function Scene({ islands, locale }: Canvas3DProps) {
  const { onPointerOver, onPointerOut } = useHover();
  const wakeRef = useRef<WakeHandle>(null);
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const { sailTo } = useCameraSail(controlsRef);
  const { exploring } = useExplore();
  useExploreCamera(exploring, controlsRef);

  const handleSeaPointerMove = useCallback((event: ThreeEvent<PointerEvent>) => {
    wakeRef.current?.addPoint(event.point);
  }, []);

  return (
    <>
      {/* Paper-coloured fog: distant islands melt into the horizon instead
          of hard-clipping, a cheap but premium depth cue. Tuned so all 5
          islands (chart coords roughly within a 6-unit radius) read clearly
          while the far edge of the sea plane fades out. */}
      <fog attach="fog" args={["#FFFBEB", 18, 48]} />

      {/* Soft cinematic lighting: low ambient fill, one warm key light
          (upper-side, casts the shadows), and a sky/ground hemisphere light
          for a gentle bounce instead of flat, harsh shading. */}
      <ambientLight intensity={0.5} />
      <hemisphereLight args={["#FFFBEB", "#78716C", 0.35]} />
      <directionalLight
        position={[6, 11, 4]}
        intensity={0.85}
        color="#FFE8C2"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-left={-14}
        shadow-camera-right={14}
        shadow-camera-top={14}
        shadow-camera-bottom={-14}
        shadow-camera-near={1}
        shadow-camera-far={40}
        shadow-bias={-0.0015}
      />

      <Sea onPointerMove={handleSeaPointerMove} />
      <Wake ref={wakeRef} />
      {islands.map((island) => (
        <Island
          island={island}
          locale={locale}
          key={island.slug}
          onHoverStart={() => onPointerOver(island.slug)}
          onHoverEnd={() => onPointerOut(island.slug)}
          onActivate={() => sailTo(island)}
        />
      ))}
      {/* `autoRotate` is OrbitControls' own built-in idle drift — very slow
          here so the scene feels alive before any interaction. It naturally
          stops contributing whenever `controls.enabled` is false (see
          `useCameraSail`/`useExploreCamera`: both disable controls for the
          duration of a GSAP tween), so it never fights a sail or the
          enter-explore camera ease. */}
      <OrbitControls
        ref={controlsRef}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.3}
      />
    </>
  );
}
