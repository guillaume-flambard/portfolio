import { describe, expect, it } from "vitest";
import { createRouteMetadata, routeUrls } from "./seo";
import sitemap from "@/app/sitemap";
import { ALL_PROJECTS } from "@/data/projects";

describe("Bilingual SEO URLs", () => {
  it("builds self canonical and reciprocal hreflang for each page, not the homepage", () => {
    for (const segment of ["", "/about", "/contact", "/work", "/legal", "/cv", "/work/echo-travel", "/work/paykit"]) {
      const fr = routeUrls("fr", segment);
      const en = routeUrls("en", segment);
      expect(fr.canonical).toBe(`https://memolabs.dev/fr${segment}`);
      expect(en.canonical).toBe(`https://memolabs.dev/en${segment}`);
      expect(fr.languages["fr-FR"]).toBe(fr.canonical);
      expect(en.languages["en-US"]).toBe(en.canonical);
      expect(fr.languages["en-US"]).toBe(en.canonical);
      expect(en.languages["fr-FR"]).toBe(fr.canonical);
    }
  });

  it("ties social metadata to the exact route and locale", () => {
    const meta = createRouteMetadata("en", "/work/echo-travel", "Echo Travel", "Bookable website");
    expect(meta.alternates?.canonical).toBe("https://memolabs.dev/en/work/echo-travel");
    expect(meta.openGraph?.url).toBe("https://memolabs.dev/en/work/echo-travel");
    expect(meta.openGraph?.locale).toBe("en_US");
    expect(meta.twitter).toMatchObject({ card: "summary_large_image" });
  });

  it("does not accept a malformed locale or unnormalized pathname", () => {
    expect(() => routeUrls("de", "/about")).toThrow();
    expect(() => routeUrls("fr", "about")).toThrow();
    expect(() => routeUrls("fr", "/about/")).toThrow();
  });

  it("lists all locale routes including the CV and featured case studies", () => {
    const entries = sitemap();
    const wantedRoutes = ["", "/about", "/contact", "/legal", "/work", "/cv",
      ...ALL_PROJECTS.map((p) => `/work/${p.slug}`)];
    expect(entries.length).toBe(wantedRoutes.length * 2);
    const map = new Map(entries.map((e) => [e.url, e]));
    expect(map.size).toBe(entries.length);
    for (const path of wantedRoutes) {
      const fr = `https://memolabs.dev/fr${path}`;
      const en = `https://memolabs.dev/en${path}`;
      expect(map.get(fr)?.alternates?.languages?.["en-US"]).toBe(en);
      expect(map.get(en)?.alternates?.languages?.["fr-FR"]).toBe(fr);
      expect(map.get(fr)?.lastModified).toBeUndefined();
    }
  });
});
