import type { MetadataRoute } from "next";
import { ALL_PROJECTS } from "@/data/projects";

const SITE = "https://memolabs.dev";
const LOCALES = ["fr", "en"] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of LOCALES) {
    // Pages statiques
    const staticPaths = ["", "/about", "/contact", "/legal", "/work"];
    for (const path of staticPaths) {
      entries.push({
        url: `${SITE}/${locale}${path}`,
        lastModified: now,
        changeFrequency: "monthly",
        priority: path === "" ? 1 : 0.8,
      });
    }

    // Pages détail projets (FEATURED)
    for (const project of ALL_PROJECTS) {
      entries.push({
        url: `${SITE}/${locale}/work/${project.slug}`,
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.9,
      });
    }
  }

  return entries;
}
