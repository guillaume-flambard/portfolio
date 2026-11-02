import { describe, expect, it } from "vitest";
import { llmsFullTxt, llmsTxt } from "./llms";
import { SERVICES } from "@/data/services";

describe("llms.txt", () => {
  it("states the current offer and links every service page", () => {
    const text = llmsTxt();
    expect(text).toContain("builds AI and automation into web products");
    for (const service of SERVICES) expect(text).toContain(`https://memolabs.dev/en/services/${service.slug}`);
  });

  it("never features projects without users, nor typographic dashes", () => {
    for (const text of [llmsTxt(), llmsFullTxt()]) {
      expect(text).not.toMatch(/PayKit|Largo|Émargo|Emargo/);
      expect(text).not.toMatch(/[—–]/);
    }
  });
});
