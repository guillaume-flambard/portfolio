import { describe, expect, it } from "vitest";
import { FEATURED } from "./projects";
import { PROJECT_VISUALS, projectVisualLabel } from "./projectVisuals";

describe("Public portfolio screenshot evidence", () => {
  it("provides a specific bilingual caption for every published featured project visual", () => {
    const assets = FEATURED.flatMap((p) => p.gallery);
    expect(assets).toHaveLength(14);
    expect(new Set(assets).size).toBe(assets.length);
    expect(Object.keys(PROJECT_VISUALS).sort()).toEqual([...assets].sort());
    for (const asset of assets) {
      expect(asset.startsWith("/work/")).toBe(true);
      for (const locale of ["fr", "en"] as const) {
        const caption = projectVisualLabel(asset, "Project", locale);
        expect(caption.length).toBeGreaterThan(20);
        expect(caption.toLowerCase()).not.toMatch(/proved|verified|transaction completed|payment confirmed/);
      }
    }
  });

  it("uses a neutral fallback instead of inventing what unknown media depicts", () => {
    expect(projectVisualLabel("/work/other/unknown.png", "Example", "fr"))
      .toBe("Visuel de présentation — Example");
    expect(projectVisualLabel("/work/other/unknown.png", "Example", "en"))
      .toBe("Project visual — Example");
  });
});
