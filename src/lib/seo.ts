import type { Metadata } from "next";

const SITE = "https://memolabs.dev";
const OG_IMAGE = `${SITE}/og.png`;
const LOCALE_MAP = { fr: "fr_FR", en: "en_US" } as const;

/**
 * Canonical and reciprocal hreflang URLs always reference the exact same route.
 * Never put home-only alternates in a shared layout.
 */
export function routeUrls(locale: string, pathname = "") {
  if (locale !== "fr" && locale !== "en") {
    throw new Error(`Unsupported locale: ${locale}`);
  }
  if (pathname && (!pathname.startsWith("/") || pathname.endsWith("/"))) {
    throw new Error(`Expected a normalized route suffix: ${pathname}`);
  }
  const segment = pathname || "";
  return {
    canonical: `${SITE}/${locale}${segment}`,
    languages: {
      "fr-FR": `${SITE}/fr${segment}`,
      "en-US": `${SITE}/en${segment}`,
      "x-default": `${SITE}/fr${segment}`,
    },
  };
}

export function createRouteMetadata(
  locale: string,
  pathname: string,
  title: string,
  description: string,
): Metadata {
  const urls = routeUrls(locale, pathname);
  const lang = locale as keyof typeof LOCALE_MAP;

  return {
    title,
    description,
    alternates: urls,
    openGraph: {
      title,
      description,
      url: urls.canonical,
      siteName: "Memo Labs",
      type: "website",
      locale: LOCALE_MAP[lang],
      alternateLocale: [LOCALE_MAP[locale === "fr" ? "en" : "fr"]],
      images: [{
        url: OG_IMAGE,
        width: 1440,
        height: 900,
        alt: "Memo Labs — Guillaume Flambard",
      }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [OG_IMAGE],
    },
  };
}
