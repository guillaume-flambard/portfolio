"use client";

import { Link } from "@/i18n/navigation";
import { useExplore } from "@/three/explore-context";

type HeroPanelProps = {
  portTitle: string;
  name: string;
  tagline: string;
  blurb?: string;
  enterLabel: string;
  listLabel: string;
};

/**
 * The hero copy + CTAs, split out of `HomePage` (a server component) so it
 * can read `useExplore()` and react to entering explore mode. `HomePage`
 * still does all the i18n resolution server-side (`getTranslations`) and
 * passes plain strings down — only the interactive bits (the fade, the
 * button handler) need to be client-side.
 *
 * Clicking "Enter the archipelago" used to be a dead `<Link href="/">` — a
 * no-op. It now calls `enterExplore()`, which (a) fades this whole panel
 * out via a CSS transition and makes it `inert` (no longer focusable or
 * hit-testable — screen readers and keyboard users skip straight past it),
 * and (b) is read by `Canvas3D`'s `useExploreCamera` (same `ExploreProvider`
 * context) to ease the camera from the hero vantage into a closer
 * exploring position. When there's no canvas at all (reduced motion / no
 * WebGL, see `ArchipelagoScene`), the fade still happens — there's just no
 * camera to move, which is fine since the SSR/list fallback never depended
 * on the canvas.
 */
export default function HeroPanel({
  portTitle,
  name,
  tagline,
  blurb,
  enterLabel,
  listLabel,
}: HeroPanelProps) {
  const { exploring, enterExplore } = useExplore();

  return (
    <main className="pointer-events-none relative z-[1] flex min-h-screen flex-col items-center justify-center gap-8 overflow-hidden px-6 text-center">
      <div
        // `inert` (not just `aria-hidden`) once faded out: it also drops the
        // panel from the tab order and blocks pointer events natively, so a
        // keyboard user tabbing through the page can't land on an invisible
        // "Enter the archipelago" button that screen readers skip anyway.
        inert={exploring}
        className={`relative flex flex-col items-center gap-6 px-6 py-10 transition-all duration-700 ease-out sm:px-12 ${
          exploring ? "-translate-y-3 opacity-0" : "translate-y-0 opacity-100"
        }`}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 rounded-[3rem] backdrop-blur-[2px]"
          style={{
            background:
              "radial-gradient(ellipse at center, var(--paper) 0%, color-mix(in srgb, var(--paper) 65%, transparent) 55%, transparent 80%)",
          }}
        />

        <p className="font-mono text-xs tracking-[0.3em] text-[var(--stone)] uppercase">
          {portTitle}
        </p>

        <h1 className="font-display text-5xl text-[var(--ink)] sm:text-6xl md:text-7xl">
          {name}
        </h1>

        <p className="font-mono max-w-xl text-sm text-[var(--stone)] sm:text-base">
          {tagline}
        </p>

        {blurb && <p className="font-body max-w-xl text-[var(--ink)]/80">{blurb}</p>}

        <div className="mt-4 flex flex-wrap items-center justify-center gap-6">
          <button
            type="button"
            onClick={enterExplore}
            className="font-mono pointer-events-auto rounded-sm border border-[var(--beacon)] bg-[var(--beacon)] px-5 py-3 text-sm tracking-wide text-[var(--paper)] transition-colors hover:bg-[var(--ink)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--beacon)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--paper)]"
          >
            {enterLabel}
          </button>

          <Link
            href="/list"
            className="font-mono pointer-events-auto rounded-sm border border-[var(--ink)] px-5 py-3 text-sm tracking-wide text-[var(--ink)] underline decoration-[var(--contour)] decoration-2 underline-offset-4 transition-colors hover:bg-[var(--ink)] hover:text-[var(--paper)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--beacon)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--paper)]"
          >
            {listLabel}
          </Link>
        </div>
      </div>
    </main>
  );
}
