"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";

type ExploreContextValue = {
  /** Whether the visitor has clicked "Enter the archipelago" — drives the
   * hero copy fade-out (`HeroPanel`) and the camera ease into a closer
   * exploring vantage (`useExploreCamera`, used inside `Canvas3D`). */
  exploring: boolean;
  /** Flips `exploring` to true. Idempotent — calling it again is a no-op. */
  enterExplore: () => void;
};

const ExploreContext = createContext<ExploreContextValue | null>(null);

/**
 * Shares "has the visitor entered explore mode" state between the hero
 * (`HeroPanel`, a plain DOM client component) and the R3F scene
 * (`Canvas3D`, mounted separately via `next/dynamic` inside
 * `ArchipelagoScene`). Both are rendered as children of this provider from
 * the server component `HomePage`, so a React context is the simplest
 * robust way to connect a DOM button click to a Three.js camera tween
 * without a global event bus or prop-drilling through the server/client
 * boundary.
 *
 * Deliberately has no `canvasMounted` awareness: when there's no WebGL
 * canvas (reduced motion / no WebGL — see `ArchipelagoScene`), calling
 * `enterExplore` still flips the flag and still fades the hero copy; there
 * is just no camera to move. That's fine — the SSR/list fallback never
 * depends on the canvas existing.
 */
export function ExploreProvider({ children }: { children: ReactNode }) {
  const [exploring, setExploring] = useState(false);

  const enterExplore = useCallback(() => {
    setExploring(true);
  }, []);

  const value = useMemo(() => ({ exploring, enterExplore }), [exploring, enterExplore]);

  return <ExploreContext.Provider value={value}>{children}</ExploreContext.Provider>;
}

/** Reads the shared explore-mode state. Must be used within an
 * `ExploreProvider` (see `HomePage`). */
export function useExplore(): ExploreContextValue {
  const ctx = useContext(ExploreContext);
  if (!ctx) {
    throw new Error("useExplore must be used within an ExploreProvider");
  }
  return ctx;
}
