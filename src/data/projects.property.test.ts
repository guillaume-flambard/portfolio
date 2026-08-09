import { describe, expect, it } from "vitest";
import fc from "fast-check";
import { FEATURED, ALL_MAP_ITEMS } from "./projects";

const names = FEATURED.map((p) => p.name);
const urls = FEATURED.flatMap((p) => p.links.map((l) => l.url));

describe("projects — property-based invariants (fast-check)", () => {
  it("generated arrays of names are all non-empty strings", () => {
    fc.assert(
      fc.property(
        fc.array(fc.constantFrom(...names.slice(0, 4)), { minLength: 1, maxLength: 10 }),
        (arr) => {
          for (const n of arr) {
            expect(typeof n).toBe("string");
            expect(n.length).toBeGreaterThan(0);
          }
          return true;
        }
      ),
      { numRuns: 50 }
    );
  });

  it("every url in the featured set is http(s) without spaces", () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...urls),
        (url) => /^https?:\/\/\S+$/.test(url)
      ),
      { numRuns: 50 }
    );
  });

  it("a picked featured project keeps its invariant shape", () => {
    fc.assert(
      fc.property(
        fc.constant(FEATURED[0]),
        (p) => {
          expect(typeof p.slug).toBe("string");
          expect(p.stack.length).toBeGreaterThan(0);
          expect(p.tagline.fr.length).toBeGreaterThan(0);
          expect(p.tagline.en.length).toBeGreaterThan(0);
          return true;
        }
      ),
      { numRuns: 5 }
    );
  });

  it("no duplicate slugs across the whole map", () => {
    const slugs = ALL_MAP_ITEMS.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("every FEATURED stack array is non-empty", () => {
    for (const p of FEATURED) {
      expect(p.stack.length).toBeGreaterThan(0);
      for (const s of p.stack) expect(typeof s).toBe("string");
    }
  });
});
