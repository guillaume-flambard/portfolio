import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["fr", "en"],
  defaultLocale: "fr",
  localePrefix: "always",
  // hreflang is declared in each page's metadata and in sitemap.xml. The middleware's
  // Link header used other codes and an x-default that redirects: Google saw conflicts.
  alternateLinks: false,
});
