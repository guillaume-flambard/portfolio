import { describe, expect, it } from "vitest";
import { FEATURED, ALL_MAP_ITEMS, getProject, MAP } from "./projects";

describe("projects data integrity", () => {
  it("FEATURED has unique slugs", () => {
    const slugs = FEATURED.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("every FEATURED project has a name, category, status and stack", () => {
    for (const p of FEATURED) {
      expect(p.name).toBeTruthy();
      expect(p.category).toBeTruthy();
      expect(p.status).toBeTruthy();
      expect(p.stack.length).toBeGreaterThan(0);
    }
  });

  it("every FEATURED project has fr and en taglines", () => {
    for (const p of FEATURED) {
      expect(p.tagline.fr).toBeTruthy();
      expect(p.tagline.en).toBeTruthy();
    }
  });

  it("all project links are http(s) urls", () => {
    const links = FEATURED.flatMap((p) => p.links.map((l) => l.url));
    for (const url of links) {
      expect(url).toMatch(/^https?:\/\//);
    }
  });

  it("MAP groups are non-empty and category keys are valid", () => {
    const validCategories = ["produits", "echo", "ia", "web", "mobile", "reference"];
    for (const group of MAP) {
      expect(validCategories).toContain(group.key);
      expect(group.items.length).toBeGreaterThan(0);
    }
  });

  it("ALL_MAP_ITEMS flattens MAP with unique slugs", () => {
    const slugs = ALL_MAP_ITEMS.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("getProject returns a FEATURED project by slug", () => {
    expect(getProject("largo")?.name).toBeTruthy();
    expect(getProject("does-not-exist")).toBeUndefined();
  });

  it("getProject returns undefined for non-featured slugs", () => {
    // MAP items like stasis are not in FEATURED
    const stasis = ALL_MAP_ITEMS.find((p) => p.slug === "stasis");
    if (stasis) {
      expect(getProject("stasis")).toBeUndefined();
    }
  });
});
