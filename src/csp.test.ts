import { describe, expect, it } from "vitest";
import nextConfig from "../next.config";

// Umami (stats.memolabs.dev, self-hosted on the lab) loads its tracker and posts
// page views there. Only those two directives may name it.
describe("Content-Security-Policy", () => {
  it("allows the Umami host for scripts and beacons, nothing else", async () => {
    const rules = await nextConfig.headers!();
    const csp = rules
      .flatMap((rule) => rule.headers)
      .find((header) => header.key === "Content-Security-Policy")!.value;
    const directive = (name: string) => csp.split("; ").find((d) => d.startsWith(`${name} `)) ?? "";

    expect(directive("script-src")).toContain("https://stats.memolabs.dev");
    expect(directive("connect-src")).toContain("https://stats.memolabs.dev");
    expect(directive("default-src")).toBe("default-src 'self'");
  });
});
