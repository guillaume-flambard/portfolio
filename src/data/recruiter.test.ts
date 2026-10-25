import { describe, expect, it } from "vitest";
import { CASE_STUDIES } from "./caseStudies";
import { EXPERIENCES } from "./experience";
import { FEATURED } from "./projects";

describe("Recruiter-facing evidence", () => {
  it("features exactly three unique case studies backed by project entries", () => {
    const expected = ["echo-travel", "paykit", "blueowl"];
    expect(CASE_STUDIES.map((study) => study.slug)).toEqual(expected);
    expect(new Set(CASE_STUDIES.map((study) => study.slug)).size).toBe(3);
    for (const slug of expected) {
      expect(FEATURED.some((project) => project.slug === slug)).toBe(true);
    }
  });

  it("separates three explained case studies from four supporting projects", () => {
    const explained = FEATURED.filter((project) => CASE_STUDIES.some((study) => study.slug === project.slug));
    const supporting = FEATURED.filter((project) => !CASE_STUDIES.some((study) => study.slug === project.slug));
    expect(explained.map((project) => project.slug)).toEqual(["echo-travel", "paykit", "blueowl"]);
    expect(supporting.map((project) => project.slug)).toEqual(["emargo", "weave", "n8n-nodes-opn", "largo"]);
    expect(new Set([...explained, ...supporting].map((project) => project.slug)).size).toBe(FEATURED.length);
  });

  it("does not leave untranslated or empty evidence fields", () => {
    const fields = ["preview", "role", "context", "ownership", "constraint", "decision", "result", "caveat"] as const;
    for (const study of CASE_STUDIES) {
      for (const field of fields) {
        expect(study[field].fr.trim().length).toBeGreaterThan(25);
        expect(study[field].en.trim().length).toBeGreaterThan(25);
      }
    }
  });

  it("contains a bilingual career timeline with public employer names", () => {
    expect(EXPERIENCES.length).toBeGreaterThanOrEqual(5);
    expect(new Set(EXPERIENCES.map((item) => item.organization)).size).toBe(EXPERIENCES.length);
    for (const item of EXPERIENCES) {
      for (const locale of ["fr", "en"] as const) {
        expect(item.role[locale].trim()).not.toBe("");
        expect(item.dates[locale].trim()).not.toBe("");
        expect(item.description[locale].trim().length).toBeGreaterThan(30);
      }
    }
  });
});
