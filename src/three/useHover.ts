"use client";

import { useCallback, useEffect, useState } from "react";

/**
 * Tracks which island (by slug) currently has the pointer over it, and
 * mirrors that onto `document.body.style.cursor` — `'pointer'` the
 * instant any island is hovered, reset to `'auto'` the instant none is
 * (the Three.js-DB rule: always resync the cursor on both raycast hit
 * *and* miss, never leave it stale).
 *
 * Hover detection itself is *not* done with a manual `THREE.Raycaster`
 * here. The `onPointerOver` / `onPointerOut` callbacks returned below are
 * meant to be wired onto the Island group's r3f pointer props
 * (`<group onPointerOver={...} onPointerOut={...}>`). react-three-fiber's
 * pointer events are backed by the browser's unified Pointer Events API
 * (`pointerover`/`pointerout`/`pointermove`), which already covers mouse,
 * pen *and* touch in one code path, and r3f does the per-frame
 * raycasting for us — so this single hook satisfies the "works for both
 * mouse and touch" requirement without extra touch listeners.
 */
export function useHover() {
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);

  // Sync the DOM cursor whenever the hovered slug changes (covers both
  // the "hit" transition, i.e. null -> slug, and the "miss" transition,
  // slug -> null).
  useEffect(() => {
    document.body.style.cursor = hoveredSlug ? "pointer" : "auto";
  }, [hoveredSlug]);

  // Belt-and-braces: never leave the cursor stuck as 'pointer' if this
  // scene unmounts mid-hover.
  useEffect(() => {
    return () => {
      document.body.style.cursor = "auto";
    };
  }, []);

  const onPointerOver = useCallback((slug: string) => {
    setHoveredSlug(slug);
  }, []);

  // Only clear when the island losing the pointer is the one we think is
  // hovered — guards against an out-of-order out/over pair when the
  // pointer crosses directly from one island's mesh to another's.
  const onPointerOut = useCallback((slug: string) => {
    setHoveredSlug((current) => (current === slug ? null : current));
  }, []);

  return { hoveredSlug, onPointerOver, onPointerOut };
}
