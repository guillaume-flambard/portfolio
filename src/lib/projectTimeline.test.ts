import { describe, expect, it } from "vitest";
import { buildProjectTimeline, type GithubProjectPull, type GithubProjectRelease } from "./projectTimeline";
import type { ShowcaseProject } from "./githubActivity";

const project: ShowcaseProject = {
  name: "drop",
  fullName: "memolabs-dev/drop",
  url: "https://github.com/memolabs-dev/drop",
  description: "Mac transfer app",
  language: "TypeScript",
  pushedAt: "2026-10-25T12:00:00Z",
  createdAt: "2026-01-01T00:00:00Z",
};

const pull = (overrides: Partial<GithubProjectPull> = {}): GithubProjectPull => ({
  title: "feat: add local file transfers",
  html_url: "https://github.com/memolabs-dev/drop/pull/20",
  merged_at: "2026-10-24T11:00:00Z",
  user: { login: "guillaume-flambard" },
  ...overrides,
});

const release = (overrides: Partial<GithubProjectRelease> = {}): GithubProjectRelease => ({
  name: "v0.2",
  tag_name: "v0.2",
  html_url: "https://github.com/memolabs-dev/drop/releases/tag/v0.2",
  published_at: "2026-10-23T10:00:00Z",
  draft: false,
  ...overrides,
});

describe("verifiable project timeline", () => {
  it("orders published releases and merged changes and retains repository creation last", () => {
    const history = buildProjectTimeline(project, [pull()], [release()]);
    expect(history.incomplete).toBe(false);
    expect(history.events.map((event) => event.kind)).toEqual(["feature", "release", "origin"]);
    expect(history.events[0]).toMatchObject({
      title: "feat: add local file transfers",
      url: "https://github.com/memolabs-dev/drop/pull/20",
    });
    expect(history.events[2].date).toBe("2026-01-01T00:00:00Z");
  });

  it("rejects unmerged, unrelated, automated or maintenance PRs", () => {
    const history = buildProjectTimeline(project, [
      pull({ merged_at: null }),
      pull({ html_url: "https://github.com/evil/repo/pull/20" }),
      pull({ user: { login: "someone-else" } }),
      pull({ user: { login: "dependabot[bot]" } }),
      pull({ title: "ci: update workflow" }),
      pull({ title: "fix: avoid UI crash", html_url: "https://github.com/memolabs-dev/drop/pull/33" }),
      pull({ title: "fix: avoid UI crash", html_url: "https://github.com/memolabs-dev/drop/pull/33" }),
    ], []);
    expect(history.events.map((event) => event.kind)).toEqual(["fix", "origin"]);
  });

  it("excludes drafts, invalid dates and releases from other repositories", () => {
    const history = buildProjectTimeline(project, [], [
      release({ draft: true }),
      release({ published_at: null }),
      release({ html_url: "https://github.com/attacker/repo/releases/tag/v0.2" }),
    ]);
    expect(history.events.map((event) => event.kind)).toEqual(["origin"]);
  });

  it("uses existing verified landing-page evidence without calling it a functional demo", () => {
    const paykit: ShowcaseProject = {
      ...project, name: "PayKit", fullName: "guillaume-flambard/paykit",
      url: "https://github.com/guillaume-flambard/paykit",
    };
    const history = buildProjectTimeline(paykit, [], []);
    const site = history.events.find((event) => event.kind === "public-page");
    expect(site).toMatchObject({
      url: "https://paykit-landing.vercel.app",
      date: "2026-10-25",
    });
  });

  it("survives partial GitHub outage without inventing releases", () => {
    const history = buildProjectTimeline(project, null, null);
    expect(history.incomplete).toBe(true);
    expect(history.events.map((event) => event.kind)).toEqual(["origin"]);
  });
});


describe("source-linked product storytelling", () => {
  it("retains a documented prototype even if frequent PR merges fill recent history", () => {
    const prs = Array.from({ length: 20 }, (_, index) => pull({
      html_url: "https://github.com/memolabs-dev/drop/pull/" + (200 + index),
      merged_at: "2026-10-24T11:00:00Z",
    }));
    const history = buildProjectTimeline(project, prs, [], [{
      kind: "prototype",
      date: "2026-02-01",
      title: { fr: "Premier prototype documenté", en: "Documented first prototype" },
      detail: { fr: "Un test simple", en: "A focused test" },
      evidenceUrl: "https://github.com/memolabs-dev/drop/pull/100",
    }], "en");
    expect(history.events.find((event) => event.kind === "prototype")).toEqual({
      kind: "prototype", date: "2026-02-01", title: "Documented first prototype",
      detail: "A focused test", url: "https://github.com/memolabs-dev/drop/pull/100",
    });
    expect(history.events.at(-1)?.kind).toBe("origin");
  });
});
