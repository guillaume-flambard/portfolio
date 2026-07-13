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
      dpr={[1, 2]}
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

  const handleSeaPointerMove = useCallback((event: ThreeEvent<PointerEvent>) => {
    wakeRef.current?.addPoint(event.point);
  }, []);

  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 10, 5]} intensity={0.8} />
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
      <OrbitControls ref={controlsRef} enablePan={false} />
    </>
  );
}
