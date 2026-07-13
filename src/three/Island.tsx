"use client";

import { useMemo, useRef } from "react";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import type { Island as IslandData, Locale } from "@/content/islands";

type IslandProps = {
  island: IslandData;
  locale: Locale;
};

/**
 * One low-poly island: a small stack of tapering cylinders evoking
 * extruded bathymetric contour rings on a nautical chart, topped with a
 * low cone "peak". Positioned so `island.pos` (chart x/y) maps to the
 * scene's X/Z plane, sitting just above the flat sea plane (y ≈ 0).
 *
 * A drei `<Html>` label floats above the island with the title (mono,
 * uppercase, chart style) and a fake coordinate string derived from
 * `pos` — same "N/S / E/W degrees" convention used by `IslandDetail`.
 */
export default function Island({ island, locale }: IslandProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [x, z] = island.pos;

  const coords = useMemo(() => {
    const [lat, lng] = island.pos;
    const ns = lat >= 0 ? "N" : "S";
    const ew = lng >= 0 ? "E" : "W";
    return `${ns} ${Math.abs(lat).toFixed(2)}° / ${ew} ${Math.abs(lng).toFixed(2)}°`;
  }, [island.pos]);

  return (
    <group
      ref={groupRef}
      position={[x, 0, z]}
      userData={{ slug: island.slug, name: island.titles[locale] }}
    >
      {/* Base contour ring — widest, lowest. */}
      <mesh
        position={[0, 0.15, 0]}
        userData={{ slug: island.slug, name: island.titles[locale] }}
        castShadow
        receiveShadow
      >
        <cylinderGeometry args={[1.6, 2, 0.3, 6]} />
        <meshStandardMaterial color="#9c8f6e" flatShading />
      </mesh>
      {/* Mid contour ring. */}
      <mesh
        position={[0, 0.45, 0]}
        userData={{ slug: island.slug, name: island.titles[locale] }}
        castShadow
        receiveShadow
      >
        <cylinderGeometry args={[1.05, 1.6, 0.3, 6]} />
        <meshStandardMaterial color="#78716C" flatShading />
      </mesh>
      {/* Peak — low cone, on-register with the ring stack. */}
      <mesh
        position={[0, 0.85, 0]}
        userData={{ slug: island.slug, name: island.titles[locale] }}
        castShadow
        receiveShadow
      >
        <coneGeometry args={[0.6, 0.5, 6]} />
        <meshStandardMaterial color="#FFFBEB" flatShading />
      </mesh>

      <Html position={[0, 1.5, 0]} center distanceFactor={12} occlude={false}>
        <div
          className="pointer-events-none flex flex-col items-center gap-0.5 whitespace-nowrap font-mono uppercase select-none"
          style={{ color: "#0F172A" }}
        >
          <span className="text-[11px] tracking-[0.2em]">
            {island.titles[locale]}
          </span>
          <span className="text-[9px] tracking-[0.1em]" style={{ color: "#78716C" }}>
            {coords}
          </span>
        </div>
      </Html>
    </group>
  );
}
