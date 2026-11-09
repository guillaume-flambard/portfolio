import { describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import middleware from "./middleware";

// hreflang lives in each page's <head> and in sitemap.xml (fr-FR, en-US, x-default).
// next-intl's default Link header repeated it with other codes and an unprefixed
// x-default that redirects, which Search Console read as conflicting signals.
describe("middleware", () => {
  it("does not send a Link hreflang header", () => {
    const res = middleware(new NextRequest("https://memolabs.dev/fr/open-source"));
    expect(res.headers.get("link")).toBeNull();
  });
});
