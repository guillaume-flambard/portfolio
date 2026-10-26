import { describe, it, expect } from "vitest";
import { validateProductMilestones } from "./productMilestones";
import type { ShowcaseProject } from "./githubActivity";

const project: ShowcaseProject = {
  name: "drop", fullName: "memolabs-dev/drop", url: "https://github.com/memolabs-dev/drop",
  createdAt: "2026-01-01T00:00:00Z", pushedAt: "2026-10-25T12:00:00Z",
  description: null, language: "TypeScript",
};
const source = "https://github.com/memolabs-dev/drop/commit/" + "a".repeat(40);
const milestone = (changes: Record<string, unknown> = {}) => ({
  kind: "prototype",
  date: "2026-09-01",
  title: { fr: "Premier prototype", en: "First prototype" },
  detail: { fr: "Prototype public documenté", en: "Public prototype source" },
  evidenceUrl: source,
  ...changes,
});

describe("versioned public product milestones", () => {
  it("accepts a bilingual documented milestone backed by a repo-local source", () => {
    const events = validateProductMilestones({ version: 1, milestones: [milestone()] }, project);
    expect(events).toHaveLength(1);
    expect(events[0].title.fr).toBe("Premier prototype");
    expect(events[0].evidenceUrl).toBe(source);
  });

  it("allows an explicit demo video and a reported deployment-run link", () => {
    const events = validateProductMilestones({ version: 1, milestones: [
      milestone({ kind: "demo", date: "2026-09-02", evidenceUrl: "https://youtu.be/abCDEfg123_" }),
      milestone({ kind: "deployment", date: "2026-09-04",
        evidenceUrl: "https://github.com/memolabs-dev/drop/actions/runs/100" }),
    ] }, project);
    expect(events.map((entry) => entry.kind)).toEqual(["deployment", "demo"]);
  });

  it("rejects malicious redirects, another repository and invalid or invented dates", () => {
    const events = validateProductMilestones({ version: 1, milestones: [
      milestone({ evidenceUrl: "https://github.com/memolabs-dev/other/commit/" + "a".repeat(40) }),
      milestone({ evidenceUrl: "https://github.com/memolabs-dev/drop.evil/commit/" + "a".repeat(40) }),
      milestone({ evidenceUrl: "javascript:alert(1)" }),
      milestone({ evidenceUrl: "https://private.example/secret" }),
      milestone({ date: "2026-02-30" }),
      milestone({ date: "2030-01-01" }),
      milestone({ date: "2025-01-01" }),
    ] }, project);
    expect(events).toEqual([]);
  });

  it("rejects unsupported versions, bad translations, duplicate sources and excessive entries", () => {
    expect(validateProductMilestones({ version: 2, milestones: [milestone()] }, project)).toEqual([]);
    expect(validateProductMilestones({ version: 1, milestones: [
      milestone({ title: { fr: "", en: "English" } }),
    ] }, project)).toEqual([]);
    const items = Array.from({ length: 8 }, (_, i) => milestone({
      evidenceUrl: "https://github.com/memolabs-dev/drop/pull/" + (100 + i),
    }));
    expect(validateProductMilestones({ version: 1, milestones: items }, project)).toHaveLength(6);
    expect(validateProductMilestones({ version: 1, milestones: [milestone(), milestone()] }, project)).toHaveLength(1);
  });

  it("permits an exact repository-owned GitHub Pages demo with a separate documented source PR", () => {
    const results = validateProductMilestones({ version: 1, milestones: [
      milestone({
        kind: "demo",
        evidenceUrl: "https://github.com/memolabs-dev/drop/pull/7",
        demoUrl: "https://memolabs-dev.github.io/drop/",
      }),
    ] }, project);
    expect(results).toMatchObject([{
      kind: "demo",
      evidenceUrl: "https://github.com/memolabs-dev/drop/pull/7",
      demoUrl: "https://memolabs-dev.github.io/drop/",
    }]);
  });

  it("does not allow other domains, repositories or kinds to impersonate a demo", () => {
    const urls = [
      "https://memolabs-dev.github.io/drop.evil/",
      "https://evil.github.io/drop/",
      "https://memolabs-dev.github.io/other/",
      "https://memolabs-dev.github.io/drop/?redirect=evil",
      "http://memolabs-dev.github.io/drop/",
    ];
    for (const demoUrl of urls) {
      expect(validateProductMilestones({ version: 1, milestones: [
        milestone({ kind: "demo", demoUrl, evidenceUrl: "https://github.com/memolabs-dev/drop/pull/7" }),
      ] }, project)).toEqual([]);
    }
    expect(validateProductMilestones({ version: 1, milestones: [
      milestone({ kind: "deployment", demoUrl: "https://memolabs-dev.github.io/drop/" }),
    ] }, project)).toEqual([]);
  });


  it("accepts a matching Memo Labs homepage only for a labeled public demo", () => {
    const rescue: ShowcaseProject = {
      ...project,
      name: "mediterranean-rescue",
      fullName: "memolabs-dev/mediterranean-rescue",
      url: "https://github.com/memolabs-dev/mediterranean-rescue",
      createdAt: "2026-10-25T11:23:59Z",
    };
    const payload = { version: 1, milestones: [{
      kind: "demo", date: "2026-10-26",
      title: { fr: "Carte publique", en: "Public map" },
      evidenceUrl: "https://github.com/memolabs-dev/mediterranean-rescue/pull/6",
      demoUrl: "https://rescue.memolabs.dev/",
    }] };
    const accepted = validateProductMilestones(payload, rescue, Date.parse("2026-10-26T12:00:00Z"), "https://rescue.memolabs.dev");
    expect(accepted).toHaveLength(1);
    expect(accepted[0].demoUrl).toBe("https://rescue.memolabs.dev/");
    expect(validateProductMilestones(payload, rescue, Date.parse("2026-10-26T12:00:00Z"))).toEqual([]);
  });

  it("rejects untrusted or deceptive site URLs even when a repo claims them as homepage", () => {
    const badUrls = [
      "https://rescue.memolabs.dev.evil.com/",
      "https://memolabs.dev.evil.com/",
      "https://evil.com/",
      "https://rescue.memolabs.dev:8443/",
      "http://rescue.memolabs.dev/",
      "https://rescue.memolabs.dev/redirect",
      "https://rescue.memolabs.dev/?redirect=evil",
      "https://rescue.memolabs.dev/#external",
      "https://alice:pw@rescue.memolabs.dev/",
    ];
    for (const bad of badUrls) {
      expect(validateProductMilestones({
        version: 1, milestones: [{
          kind: "demo", date: "2026-10-26",
          title: { fr: "Carte publique", en: "Public map" },
          evidenceUrl: "https://github.com/memolabs-dev/drop/pull/6",
          demoUrl: bad,
        }],
      }, project, Date.parse("2026-10-26T12:00:00Z"), bad)).toEqual([]);
    }
  });

});
