import { describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import middleware from "./middleware";

// hreflang lives in each page's <head> and in sitemap.xml (fr-FR, en, x-default).
// next-intl's default Link header repeated it with other codes and an unprefixed
// x-default that redirects, which Search Console read as conflicting signals.
describe("middleware", () => {
  it("does not send a Link hreflang header", () => {
    const res = middleware(new NextRequest("https://memolabs.dev/fr/open-source"));
    expect(res.headers.get("link")).toBeNull();
  });
});

describe("locale detection on the bare domain", () => {
  const target = (acceptLanguage?: string) => {
    const headers = acceptLanguage ? { "accept-language": acceptLanguage } : undefined;
    const res = middleware(new NextRequest("https://memolabs.dev/", { headers }));
    return new URL(res.headers.get("location") ?? "", "https://memolabs.dev").pathname;
  };

  it("sends French browsers to /fr", () => {
    expect(target("fr-FR,fr;q=0.9")).toBe("/fr");
  });

  it("sends every other browser to /en, Thai and Chinese included", () => {
    expect(target("th-TH,th;q=0.9")).toBe("/en");
    expect(target("zh-CN,zh;q=0.9")).toBe("/en");
    expect(target()).toBe("/en");
  });
});
