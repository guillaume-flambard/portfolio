"use client";

import { useMemo, useRef } from "react";
import { Html } from "@react-three/drei";
import type { ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";
import type { Island as IslandData, Locale } from "@/content/islands";

type IslandProps = {
  island: IslandData;
  locale: Locale;
  /** Called when the pointer starts hovering this island's meshes. */
  onHoverStart?: () => void;
  /** Called when the pointer stops hovering this island's meshes. */
  onHoverEnd?: () => void;
  /**
   * Called when this island is "activated" — a click on its meshes, or a
   * click/Enter/Space on its label's focusable button (Task 12: sails the
   * camera there, then navigates to its detail route).
   */
  onActivate?: () => void;
};

/**
 * Fixed ratio between a terrace's top and bottom radius (its own slight
 * "batter", the way a single stepped terrace wall slopes inward). Kept
 * constant across every terrace of every island so all terraces can share
 * one unit `CylinderGeometry` — each mesh instance just scales it via
 * `mesh.scale`, rather than allocating a bespoke geometry per terrace.
 */
const TERRACE_TAPER = 0.94;
/** High radial segment count so terraces read as round survey contours,
 * never hexagonal. */
const TERRACE_RADIAL_SEGMENTS = 64;

/**
 * Shared unit terrace: bottom radius 1, top radius `TERRACE_TAPER`, unit
 * height. Every `<Island>` instance reuses this exact `BufferGeometry` —
 * see the per-terrace `scale` prop below for how it becomes a specific
 * terrace's actual radius/height.
 */
const unitTerraceGeometry = new THREE.CylinderGeometry(
  TERRACE_TAPER,
  1,
  1,
  TERRACE_RADIAL_SEGMENTS,
);

/** Thin shared geometries for the leader line + peak dot marking each
 * island's label anchor point (unit height/radius, scaled per-use). */
const leaderLineGeometry = new THREE.CylinderGeometry(0.01, 0.01, 1, 6);
const leaderDotGeometry = new THREE.SphereGeometry(0.035, 12, 12);

/**
 * Small deterministic string hash (`Math.random`/`Date.now` are banned in
 * this scene — every render, every environment, must derive the same
 * terraces from the same slug). Good enough to scatter terrace count/scale
 * across islands without ever repeating an obviously identical shape.
 */
function hashSlug(slug: string): number {
  let hash = 0;
  for (let i = 0; i < slug.length; i += 1) {
    hash = (hash * 31 + slug.charCodeAt(i)) >>> 0;
  }
  return hash;
}

/** Ease-in curve: radius shrinks slowly near the wide base and faster near
 * the peak, so the stack reads as a natural mound rather than a linear
 * wedge or a "wedding cake". */
function easeInRadius(t: number): number {
  return Math.pow(t, 1.6);
}

/** Height-based colour ramp: deep stone at the base rising through the
 * chart's contour tone to warm paper at the peak. A handful of stops
 * interpolated with `THREE.Color.lerp` — simple, cheap, and avoids needing
 * per-vertex colour attributes for a look this subtle. */
const COLOR_STOPS: Array<{ t: number; color: THREE.Color }> = [
  { t: 0, color: new THREE.Color("#78716C") },
  { t: 0.55, color: new THREE.Color("#9c8f6e") },
  { t: 0.85, color: new THREE.Color("#e9dcc0") },
  { t: 1, color: new THREE.Color("#FFFBEB") },
];

function terraceColor(t: number): THREE.Color {
  const clamped = Math.min(1, Math.max(0, t));
  for (let i = 1; i < COLOR_STOPS.length; i += 1) {
    const prev = COLOR_STOPS[i - 1];
    const next = COLOR_STOPS[i];
    if (clamped <= next.t) {
      const span = next.t - prev.t || 1;
      return prev.color.clone().lerp(next.color, (clamped - prev.t) / span);
    }
  }
  return COLOR_STOPS[COLOR_STOPS.length - 1].color.clone();
}

type Terrace = {
  /** Radius applied to both X and Z scale (the terrace's bottom radius —
   * `unitTerraceGeometry`'s top radius is baked in at `TERRACE_TAPER`). */
  radius: number;
  height: number;
  y: number;
  color: THREE.Color;
};

/**
 * Builds the N-terrace stack for one island, parameterised deterministically
 * from its slug so every island is a related but distinct landform:
 * terrace count (7–9), base radius and overall height all vary with the
 * hash, never with `Math.random`.
 */
function buildTerraces(slug: string): Terrace[] {
  const hash = hashSlug(slug);
  const terraceCount = 7 + (hash % 3); // 7, 8 or 9
  const baseRadius = 1.7 + ((hash >> 3) % 5) * 0.08; // 1.70 .. 2.02
  const heightScale = 0.85 + ((hash >> 6) % 4) * 0.05; // 0.85 .. 1.00
  const peakRadiusRatio = 0.32; // peak radius as a fraction of the base

  const terraces: Terrace[] = [];
  let y = 0;
  for (let i = 0; i < terraceCount; i += 1) {
    const t = i / (terraceCount - 1);
    const radius = baseRadius * (1 - (1 - peakRadiusRatio) * easeInRadius(t));
    // Height steps grow very slightly toward the peak so the silhouette
    // keeps a gentle taper instead of uniform "wedding cake" tiers.
    const height = heightScale * (0.16 + 0.05 * t);
    terraces.push({ radius, height, y: y + height / 2, color: terraceColor(t) });
    y += height;
  }
  return terraces;
}

export default function Island({
  island,
  locale,
  onHoverStart,
  onHoverEnd,
  onActivate,
}: IslandProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [x, z] = island.pos;

  const terraces = useMemo(() => buildTerraces(island.slug), [island.slug]);
  const peakY = terraces.length > 0
    ? terraces[terraces.length - 1].y + terraces[terraces.length - 1].height / 2
    : 1.2;
  const labelY = peakY + 0.9;

  const coords = useMemo(() => {
    const [lat, lng] = island.pos;
    const ns = lat >= 0 ? "N" : "S";
    const ew = lng >= 0 ? "E" : "W";
    return `${ns} ${Math.abs(lat).toFixed(2)}° / ${ew} ${Math.abs(lng).toFixed(2)}°`;
  }, [island.pos]);

  const userData = useMemo(
    () => ({ slug: island.slug, name: island.titles[locale] }),
    [island.slug, island.titles, locale],
  );

  return (
    <group
      ref={groupRef}
      position={[x, 0, z]}
      userData={userData}
      // Pointer events are r3f's unified mouse+touch raycast path (see
      // `useHover.ts`). `stopPropagation` on both handlers keeps the ray
      // from continuing on to the Sea plane behind/below the island —
      // without it, hovering an island would also fire Sea's
      // `onPointerMove` (used by `Wake`) at the point where the ray
      // re-emerges past the island, producing a wake trail that jumps
      // around under the island instead of freezing.
      onPointerOver={(event: ThreeEvent<PointerEvent>) => {
        event.stopPropagation();
        onHoverStart?.();
      }}
      onPointerOut={(event: ThreeEvent<PointerEvent>) => {
        event.stopPropagation();
        onHoverEnd?.();
      }}
      onPointerMove={(event: ThreeEvent<PointerEvent>) => {
        event.stopPropagation();
      }}
      onClick={(event: ThreeEvent<MouseEvent>) => {
        event.stopPropagation();
        onActivate?.();
      }}
    >
      {/*
        Concentric contour terraces: a smooth stepped bathymetric mound
        built from `terraces.length` (7–9) thin round cylinders sharing
        one unit geometry (`unitTerraceGeometry`, 64 radial segments — the
        thing that used to look like a hex wedding cake now reads as a
        survey chart's rounded contour rings). No `flatShading`: smooth
        normals + a matte, low-metalness material read as paper-like
        terrain rather than faceted plastic.
      */}
      {terraces.map((terrace, i) => (
        <mesh
          key={i}
          geometry={unitTerraceGeometry}
          position={[0, terrace.y, 0]}
          scale={[terrace.radius, terrace.height, terrace.radius]}
          userData={userData}
          castShadow
          receiveShadow
        >
          <meshStandardMaterial color={terrace.color} roughness={0.88} metalness={0.04} />
        </mesh>
      ))}

      {/* Thin leader line + dot marking the island's label anchor point. */}
      <mesh
        geometry={leaderLineGeometry}
        position={[0, peakY + (labelY - peakY) / 2, 0]}
        scale={[1, labelY - peakY, 1]}
      >
        <meshBasicMaterial color="#78716C" transparent opacity={0.35} />
      </mesh>
      <mesh geometry={leaderDotGeometry} position={[0, peakY, 0]}>
        <meshStandardMaterial color="#D97706" roughness={0.4} metalness={0.1} />
      </mesh>

      <Html position={[0, labelY, 0]} center distanceFactor={13} occlude={false}>
        <div
          className="pointer-events-none flex flex-col items-center gap-0.5 whitespace-nowrap font-mono uppercase select-none"
        >
          {/*
            A real `<button>` for mouse/touch activation only. It lives
            inside the canvas wrapper's `aria-hidden` subtree (see
            `ArchipelagoScene.tsx`), so screen readers never see it —
            keyboard/AT users reach islands via the SSR baseline instead
            (SkipToList → /list → /isle/[slug], which fully covers every
            island). `tabIndex={-1}` keeps it out of the Tab order so
            sighted keyboard users don't land on a focusable control that
            assistive tech announces nothing for (WCAG aria-hidden-focus).
            It re-enables `pointer-events` (the wrapping label div opts
            out so hover labels never intercept clicks meant for the
            sea/Wake behind them) so it's clickable too, and
            `stopPropagation` keeps a click here from also bubbling to
            the canvas' own raycast path.
          */}
          <button
            type="button"
            tabIndex={-1}
            onClick={(event) => {
              event.stopPropagation();
              onActivate?.();
            }}
            className="pointer-events-auto cursor-pointer rounded-sm border-none bg-transparent p-0 text-[10px] font-medium tracking-[0.22em] text-[var(--ink)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--phosphor)]"
          >
            {island.titles[locale]}
          </button>
          <span className="text-[9px] font-normal tracking-[0.08em] text-[var(--stone)]">
            {coords}
          </span>
        </div>
      </Html>
    </group>
  );
}
