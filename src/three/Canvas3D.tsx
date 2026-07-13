"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import type { Island } from "@/content/islands";
import type { Locale } from "@/content/islands";

type Canvas3DProps = {
  islands: Island[];
  locale: Locale;
};

/**
 * The actual R3F scene subtree. Kept in its own module so it can be
 * lazy-loaded via `next/dynamic` with `{ ssr: false }` — this keeps
 * three.js / @react-three/fiber out of the server-rendered / initial
 * JS bundle entirely.
 *
 * Placeholder for Task 8: empty scene with a camera and OrbitControls.
 * `islands` and `locale` are threaded through now for later tasks
 * (sea + island meshes, locale-aware labels) but are unused here — YAGNI.
 */
export default function Canvas3D({ islands: _islands, locale: _locale }: Canvas3DProps) {
  return (
    <Canvas
      camera={{ position: [0, 8, 14], fov: 45 }}
      dpr={[1, 2]}
      style={{ width: "100%", height: "100%" }}
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 10, 5]} intensity={0.8} />
      <OrbitControls enablePan={false} />
    </Canvas>
  );
}
