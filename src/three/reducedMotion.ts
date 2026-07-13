/**
 * Detects whether the user has requested reduced motion. SSR-safe and never
 * throws — used to gate 3D animation intensity/mounting.
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return false;
  }

  try {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch {
    return false;
  }
}
