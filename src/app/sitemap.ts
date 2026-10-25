import type { MetadataRoute } from "next";
import { ALL_PROJECTS } from "@/data/projects";
import { routeUrls } from "@/lib/seo";

const LOCALES = ["fr", "en"] as const;
const STATIC_PATHS = ["", "/about", "/contact", "/legal", "/work", "/cv"];
const PROJECT_PATHS = ALL_PROJECTS.map((project) => `/work/${project.slug}`);

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];
  for (const pathname of [...STATIC_PATHS, ...PROJECT_PATHS]) {
    for (const locale of LOCALES) {
      const urls = routeUrls(locale, pathname);
      entries.push({
        url: urls.canonical,
        alternates: { languages: urls.languages },
        changeFrequency: "monthly",
        priority: pathname === "" ? 1 : pathname.startsWith("/work/") ? 0.8 : 0.7,
      });
    }
  }
  // Do not invent lastModified=now on every request; a fresh crawl is not a content revision.
  return entries;
}
