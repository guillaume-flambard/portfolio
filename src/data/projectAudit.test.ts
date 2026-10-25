import { describe, expect, it } from "vitest";
import { ALL_MAP_ITEMS, FEATURED, MAP } from "./projects";

describe("Project type, access and evidence separation", () => {
  it("keeps a complete audited evidence record for every featured project", () => {
    expect(FEATURED.length).toBe(7);
    for (const project of FEATURED) {
      expect(project.verification.checkedAt).toMatch(/^\\d{4}-\\d{2}-\\d{2}$/);
      expect(project.verification.note.fr.trim().length).toBeGreaterThan(30);
      expect(project.verification.note.en.trim().length).toBeGreaterThan(30);
      expect(["client", "independent", "collaboration", "open-source", "experimental"])
        .toContain(project.verification.kind);
      expect(["reported-operation", "public-website", "early-access", "source-only", "published-package"])
        .toContain(project.verification.proof);
      if (["public-website", "reported-operation", "early-access"].includes(project.verification.proof)) {
        expect(project.links.some((link) => link.label === "live")).toBe(true);
      }
      if (project.verification.proof === "source-only") {
        expect(project.links.every((link) => link.label !== "live")).toBe(true);
      }
      if (project.verification.proof === "published-package") {
        expect(project.links.some((link) => link.label === "npm")).toBe(true);
      }
    }
  });

  it("does not present Weave as an operational demo or PayKit as shipped billing", () => {
    const weave = FEATURED.find((p) => p.slug === "weave");
    const paykit = FEATURED.find((p) => p.slug === "paykit");
    expect(weave?.status).toBe("repo");
    expect(weave?.verification.proof).toBe("source-only");
    expect(weave?.links.some((link) => link.url.includes("weave.memolabs.dev"))).toBe(false);
    expect(paykit?.verification.proof).toBe("early-access");
  });

  it("keeps live, source and private labels consistent with their actual links", () => {
    const items = [...FEATURED, ...ALL_MAP_ITEMS];
    expect(MAP.flatMap((g) => g.items).length).toBe(ALL_MAP_ITEMS.length);
    const slugs = items.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const item of items) {
      if (item.status === "live") expect(item.links.some((link) => link.label === "live")).toBe(true);
      if (item.status === "repo") expect(item.links.some((link) => link.label === "repo" || link.label === "npm")).toBe(true);
      if (item.status === "offline") expect(item.links.length).toBe(0);
      for (const link of item.links) {
        expect(() => new URL(link.url)).not.toThrow();
        expect(link.url.startsWith("https://")).toBe(true);
      }
    }
  });

  it("never links publicly to the private archived lab-hub repository", () => {
    const lab = ALL_MAP_ITEMS.find((p) => p.slug === "lab-hub");
    expect(lab?.links.some((l) => l.url.endsWith("/guillaume-flambard/lab-hub"))).toBe(false);
  });
});
