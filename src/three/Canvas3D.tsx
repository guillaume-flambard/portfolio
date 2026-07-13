"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import Sea from "@/three/Sea";
import Island from "@/three/Island";
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
 * locale-aware label.
 */
export default function Canvas3D({ islands, locale }: Canvas3DProps) {
  return (
    <Canvas
      camera={{ position: [0, 6, 16], fov: 45 }}
      dpr={[1, 2]}
      style={{ width: "100%", height: "100%" }}
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 10, 5]} intensity={0.8} />
      <Sea />
      {islands.map((island) => (
        <Island island={island} locale={locale} key={island.slug} />
      ))}
      <OrbitControls enablePan={false} />
    </Canvas>
  );
}
