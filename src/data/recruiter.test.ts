import { describe, expect, it } from "vitest";
import { CASE_STUDIES } from "./caseStudies";
import { EXPERIENCES } from "./experience";
import { FEATURED } from "./projects";
import { SERVICES } from "./services";

describe("Recruiter-facing evidence", () => {
  it("keeps Flylooping aligned with the owner's confirmed frontend contribution", () => {
    const study = CASE_STUDIES.find(p => p.slug === "flylooping")!;
    const project = FEATURED.find(p => p.slug === "flylooping")!;
    const experience = EXPERIENCES.find(p => p.organization === "Symbyoz")!;
    const proof = SERVICES.flatMap(p => p.proofs).find(p => p.href === "/work/flylooping")!;
    for (const locale of ["fr", "en"] as const) {
      for (const text of [study.ownership[locale], project.tagline[locale], experience.description[locale], proof.label[locale]]) {
        expect(text).toMatch(/frontend/i);
        expect(text).not.toMatch(/API sécurisées|secure APIs|secure.feature|fonctionnalités sécurisées/i);
      }
      expect(study.ownership[locale]).toMatch(/HTML.*CSS.*JavaScript/);
    }
    expect(project.stack).toEqual(expect.arrayContaining(["HTML", "CSS", "JavaScript"]));
  });
  it("features six unique case studies backed by project entries", () => {
    const expected = ["medsharing", "flylooping", "echo-travel", "paykit", "blueowl", "twenty-crm"];
    expect(CASE_STUDIES.map((study) => study.slug)).toEqual(expected);
    expect(new Set(CASE_STUDIES.map((study) => study.slug)).size).toBe(6);
    for (const slug of expected) {
      expect(FEATURED.some((project) => project.slug === slug)).toBe(true);
    }
  });

  it("separates six explained case studies from four supporting projects", () => {
    const explained = FEATURED.filter((project) => CASE_STUDIES.some((study) => study.slug === project.slug));
    const supporting = FEATURED.filter((project) => !CASE_STUDIES.some((study) => study.slug === project.slug));
    expect(explained.map((project) => project.slug)).toEqual(["medsharing", "flylooping", "echo-travel", "paykit", "blueowl", "twenty-crm"]);
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
