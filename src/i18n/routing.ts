import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["fr", "en"],
  // English for every browser that does not ask for French (Thai, Chinese, unknown).
  defaultLocale: "en",
  localePrefix: "always",
  // hreflang is declared in each page's metadata and in sitemap.xml. The middleware's
  // Link header used other codes and an x-default that redirects: Google saw conflicts.
  alternateLinks: false,
});
