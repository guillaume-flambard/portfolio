/**
 * Detects whether a WebGL2 (or WebGL1 fallback) rendering context can be
 * created in the current environment. SSR-safe and never throws — used to
 * gate whether the R3F <Canvas> mounts.
 */
export function detectWebGL(): boolean {
  if (typeof document === "undefined") {
    return false;
  }

  try {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("webgl2") || canvas.getContext("webgl");
    return Boolean(context);
  } catch {
    return false;
  }
}
