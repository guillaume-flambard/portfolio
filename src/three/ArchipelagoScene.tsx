"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { detectWebGL } from "@/three/webgl";
import { prefersReducedMotion } from "@/three/reducedMotion";
import type { Island, Locale } from "@/content/islands";

const Canvas3D = dynamic(() => import("@/three/Canvas3D"), {
  ssr: false,
  // Lightweight placeholder shown while the R3F/three.js chunk downloads.
  // Just a paper-toned div — matches the page background, so there's no
  // flash and no layout shift (the parent wrapper below is already
  // `fixed inset-0`, so this fills the same box the canvas will occupy).
  loading: () => <div aria-hidden className="h-full w-full bg-[var(--paper)]" />,
});

type ArchipelagoSceneProps = {
  islands: Island[];
  locale: Locale;
};

/**
 * Client-only mount point for the R3F scene sitting behind the Home Port
 * hero. Renders `null` on the server and on first client render (so
 * server and client markup match — no hydration mismatch), then decides
 * post-mount whether WebGL is available and reduced-motion isn't
 * requested. If either guard fails, it stays `null` and the SSR hero
 * content remains the whole experience.
 *
 * The actual `<Canvas>` subtree lives in `./Canvas3D` and is loaded via
 * `next/dynamic` with `ssr: false` so three.js / @react-three/fiber never
 * ship in the server-rendered or initial JS bundle.
 */
export default function ArchipelagoScene({ islands, locale }: ArchipelagoSceneProps) {
  const [canMount, setCanMount] = useState(false);

  useEffect(() => {
    setCanMount(detectWebGL() && !prefersReducedMotion());
  }, []);

  if (!canMount) {
    return null;
  }

  return (
    // `pointer-events-auto` here (Task 11) lets mouse/touch reach the
    // canvas for island hover raycasting and the sea wake trail. This
    // relies on `HomePage`'s `<main>` being `pointer-events-none` with
    // only its actual interactive children (`pointer-events-auto`) —
    // see src/app/[locale]/page.tsx — so hero links stay clickable while
    // empty chart area still passes pointer events through to the canvas.
    <div aria-hidden className="pointer-events-auto fixed inset-0 z-0">
      <Canvas3D islands={islands} locale={locale} />
    </div>
  );
}
