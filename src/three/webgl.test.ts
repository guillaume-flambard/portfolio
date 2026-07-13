import { describe, expect, it } from "vitest";
import { detectWebGL } from "./webgl";
import { prefersReducedMotion } from "./reducedMotion";

describe("detectWebGL", () => {
  it("returns a boolean and does not throw", () => {
    expect(() => detectWebGL()).not.toThrow();
    expect(typeof detectWebGL()).toBe("boolean");
  });

  it("returns false in jsdom (no real WebGL context available)", () => {
    expect(detectWebGL()).toBe(false);
  });
});

describe("prefersReducedMotion", () => {
  it("returns a boolean and does not throw when matchMedia is absent", () => {
    expect(() => prefersReducedMotion()).not.toThrow();
    expect(typeof prefersReducedMotion()).toBe("boolean");
  });
});
