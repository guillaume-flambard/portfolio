import { describe, expect, it } from "vitest";
import {
  selectMergedContributions,
  validateSnapshot,
  preferSnapshot,
  chooseSnapshotOrLive,
  isFreshSnapshotSection,
  selectExternalContributions,
  selectNewPublicProjects,
  selectShowcaseProjects,
  type GithubPullRequest,
  type GithubRepository,
} from "./githubActivity";

const NOW = Date.parse("2026-10-26T09:00:00Z");

function repository(overrides: Partial<GithubRepository> = {}): GithubRepository {
  return {
    name: "drop",
    full_name: "memolabs-dev/drop",
    html_url: "https://github.com/memolabs-dev/drop",
    description: "Local-first tools built for macOS",
    language: "TypeScript",
    pushed_at: "2026-10-25T10:00:00Z",
    created_at: "2026-10-20T10:00:00Z",
    topics: [],
    fork: false,
    archived: false,
    private: false,
    size: 120,
    ...overrides,
  };
}

function pr(overrides: Partial<GithubPullRequest> = {}): GithubPullRequest {
  return {
    title: "Fix keyboard navigation",
    html_url: "https://github.com/nextcloud/text/pull/9159",
    repository_url: "https://api.github.com/repos/nextcloud/text",
    state: "closed",
    created_at: "2026-09-10T10:00:00Z",
    closed_at: "2026-10-25T10:00:00Z",
    pull_request: { merged_at: "2026-10-25T10:00:00Z" },
    user: { login: "guillaume-flambard" },
    ...overrides,
  };
}

describe("credential-free VPS snapshot fallback", () => {
  const snapshot = (generatedAt: string) => ({
    version: 1,
    generatedAt,
    sections: {
      repositories: { items: [], healthy: true, syncedAt: generatedAt },
      merged: { items: [], healthy: true, syncedAt: generatedAt },
      open: { items: [], healthy: true, syncedAt: generatedAt },
    },
  });

  it("chooses the newer valid snapshot without relying on the GitHub cron", () => {
    const oldGithub = validateSnapshot(snapshot("2026-10-26T09:48:18.642Z"));
    const newerVps = validateSnapshot(snapshot("2026-10-26T12:47:10.000Z"));
    expect(preferSnapshot(newerVps, oldGithub)).toBe(newerVps);
    expect(preferSnapshot(oldGithub, newerVps)).toBe(newerVps);
    expect(preferSnapshot(null, oldGithub)).toBe(oldGithub);
    expect(preferSnapshot(newerVps, null)).toBe(newerVps);
    expect(preferSnapshot(null, null)).toBeNull();
  });

  it("keeps the GitHub last-known-good when a VPS file fails validation", () => {
    const saved = validateSnapshot(snapshot("2026-10-26T09:48:18.642Z"));
    const invalid = validateSnapshot({ ...snapshot("2026-10-26T14:47:10.000Z"), version: 42 });
    expect(invalid).toBeNull();
    expect(preferSnapshot(invalid, saved)).toBe(saved);
  });
});

describe("public repository discovery", () => {
  it("includes editorially approved work and newly opted-in public projects", () => {
    const projects = selectShowcaseProjects([
      repository(),
      repository({
        name: "new-tool",
        full_name: "memolabs-dev/new-tool",
        html_url: "https://github.com/memolabs-dev/new-tool",
        topics: ["memo-showcase"],
        pushed_at: "2026-10-26T08:00:00Z",
      }),
      repository({
        name: "private-notes",
        full_name: "memolabs-dev/private-notes",
        html_url: "https://github.com/memolabs-dev/private-notes",
      }),
    ], NOW);
    expect(projects.map((project) => project.fullName)).toEqual([
      "memolabs-dev/drop", "memolabs-dev/new-tool",
    ]);
  });

  it("keeps a deliberate evidence-backed editorial order even when pushes move around", () => {
    const names = [
      "guillaume-flambard/foldready",
      "memolabs-dev/drop",
      "memolabs-dev/mediterranean-rescue",
      "memolabs-dev/memo-bridge",
      "guillaume-flambard/algo-observatory",
      "guillaume-flambard/paykit",
    ];
    const repos = names.map((full_name, index) => repository({
      name: full_name.split("/")[1],
      full_name,
      html_url: "https://github.com/" + full_name,
      // Push recency intentionally opposes editorial order.
      pushed_at: "2026-10-" + String(25 - index).padStart(2, "0") + "T10:00:00Z",
    }));
    expect(selectShowcaseProjects(repos, NOW).map((p) => p.fullName)).toEqual([
      "memolabs-dev/mediterranean-rescue",
      "guillaume-flambard/algo-observatory",
      "memolabs-dev/memo-bridge",
      "memolabs-dev/drop",
      "guillaume-flambard/foldready",
    ]);
    // Full archives / build routes are still allowed to retrieve every eligible project.
    expect(selectShowcaseProjects(repos, NOW, 100)).toHaveLength(6);
  });

  it("keeps private, forks, archived, stale and explicitly hidden repositories out", () => {
    const base = repository({ topics: ["memo-showcase"] });
    const variants = [
      repository({ ...base, private: true }),
      repository({ ...base, fork: true }),
      repository({ ...base, archived: true }),
      repository({ ...base, size: 0 }),
      repository({ ...base, pushed_at: "2025-01-01T00:00:00Z" }),
      repository({ ...base, topics: ["memo-showcase", "memo-hide"] }),
      repository({ ...base, html_url: "https://example.com/fake" }),
    ];
    expect(selectShowcaseProjects(variants, NOW)).toEqual([]);
  });

  it("deduplicates and caps the number of projects", () => {
    const repos = Array.from({ length: 9 }, (_, index) => repository({
      name: `tool-${index}`,
      full_name: `memolabs-dev/tool-${index}`,
      html_url: `https://github.com/memolabs-dev/tool-${index}`,
      topics: ["memo-showcase"],
    }));
    expect(selectShowcaseProjects([repos[0], ...repos], NOW)).toHaveLength(5);
  });
});

describe("accepted external contributions", () => {
  it("preserves multiple accepted PRs in the same upstream", () => {
    const result = selectMergedContributions([
      pr(),
      pr({ html_url: "https://github.com/nextcloud/text/pull/9161" }),
      pr({ html_url: "https://github.com/twentyhq/twenty/pull/24919",
        repository_url: "https://api.github.com/repos/twentyhq/twenty" }),
      pr({ html_url: "https://github.com/memolabs-dev/drop/pull/20",
        repository_url: "https://api.github.com/repos/memolabs-dev/drop" }),
      pr({ html_url: "https://github.com/another/project/pull/20",
        repository_url: "https://api.github.com/repos/another/project",
        user: { login: "someone-else" } }),
    ]);
    expect(result.map((entry) => entry.repository)).toEqual([
      "nextcloud/text", "nextcloud/text", "twentyhq/twenty",
    ]);
  });

  it("rejects untrusted external URLs", () => {
    expect(selectMergedContributions([
      pr({ html_url: "https://evil.example/pull/123" }),
      pr({ html_url: "https://github.com/nextcloud/text/issues/123" }),
      pr({ repository_url: "https://evil.example/repos/nextcloud/text" }),
    ])).toHaveLength(0);
  });
});


describe("newly published repositories appear without a manual topic", () => {
  it("automatically finds fresh public work but not archives, forks or private/internal repos", () => {
    const good = repository({
      name: "my-new-app",
      full_name: "guillaume-flambard/my-new-app",
      html_url: "https://github.com/guillaume-flambard/my-new-app",
      topics: [],
      created_at: "2026-10-26T07:30:00Z",
    });
    const repos = [
      good,
      repository({ ...good, full_name: "guillaume-flambard/old-app", name: "old-app",
        html_url: "https://github.com/guillaume-flambard/old-app",
        created_at: "2026-01-01T00:00:00Z" }),
      repository({ ...good, private: true }),
      repository({ ...good, fork: true }),
      repository({ ...good, archived: true }),
      repository({ ...good, name: "lab-infra", full_name: "guillaume-flambard/lab-infra",
        html_url: "https://github.com/guillaume-flambard/lab-infra" }),
      repository({ ...good, topics: ["memo-internal"] }),
    ];
    expect(selectNewPublicProjects(repos, NOW).map((p) => p.fullName)).toEqual([
      "guillaume-flambard/my-new-app",
    ]);
  });

  it("does not promote freshly published repositories into the featured editorial selection", () => {
    const repo = repository({
      full_name: "memolabs-dev/new-project",
      name: "new-project",
      html_url: "https://github.com/memolabs-dev/new-project",
    });
    expect(selectShowcaseProjects([repo], NOW)).toEqual([]);
    expect(selectNewPublicProjects([repo], NOW)).toHaveLength(1);
  });
});

describe("upstream status and source validation", () => {
  it("treats closed-but-unmerged PRs as neither merged nor open", () => {
    const closed = pr({ state: "closed", pull_request: { merged_at: null } });
    expect(selectExternalContributions([closed], "merged")).toEqual([]);
    expect(selectExternalContributions([closed], "open")).toEqual([]);
  });

  it("shows open upstream PRs as proposals and never as accepted", () => {
    const open = pr({ state: "open", pull_request: { merged_at: null },
      closed_at: null, created_at: "2026-10-22T00:00:00Z" });
    expect(selectExternalContributions([open], "open")).toMatchObject([{
      status: "open", mergedAt: null, repository: "nextcloud/text",
    }]);
    expect(selectMergedContributions([open])).toEqual([]);
  });

  it("rejects mismatched upstream URL and handles duplicate API results", () => {
    const mismatch = pr({ html_url: "https://github.com/twentyhq/twenty/pull/1" });
    const merged = pr();
    expect(selectMergedContributions([mismatch, merged, merged])).toHaveLength(1);
  });

  it("sorts by actual merge date rather than GitHub issue updated date", () => {
    const older = pr({ html_url: "https://github.com/nextcloud/text/pull/9000",
      pull_request: { merged_at: "2026-09-01T00:00:00Z" } });
    const newer = pr({ html_url: "https://github.com/nextcloud/text/pull/9001",
      pull_request: { merged_at: "2026-10-26T00:00:00Z" } });
    expect(selectMergedContributions([older, newer]).map((p) => p.url)).toEqual([
      "https://github.com/nextcloud/text/pull/9001",
      "https://github.com/nextcloud/text/pull/9000",
    ]);
  });
});


describe("durable GitHub snapshot input validation", () => {
  const valid = {
    version: 1,
    generatedAt: "2026-10-26T08:00:00Z",
    sections: {
      repositories: { items: [], syncedAt: "2026-10-26T08:00:00Z", healthy: true },
      merged: { items: [], syncedAt: "2026-10-26T08:00:00Z", healthy: true },
      open: { items: [], syncedAt: "2026-10-26T08:00:00Z", healthy: false },
    },
  };
  it("accepts a versioned, section-by-section persisted snapshot", () => {
    expect(validateSnapshot(valid)?.sections.open.healthy).toBe(false);
  });
  it("rejects corruption, oversized data and missing dates", () => {
    expect(validateSnapshot({ ...valid, version: 999 })).toBeNull();
    expect(validateSnapshot({ ...valid, sections: { ...valid.sections, open: {
      items: Array(251).fill({}), syncedAt: "2026-10-26T08:00:00Z", healthy: true,
    } } })).toBeNull();
    expect(validateSnapshot({ ...valid, sections: { ...valid.sections, merged: {
      items: [], healthy: true,
    } } })).toBeNull();
  });
});


describe("stale snapshot recovery", () => {
  const now = Date.parse("2026-10-26T13:00:00Z");

  it("keeps fresh healthy evidence without touching the live API", async () => {
    let calls = 0;
    const result = await chooseSnapshotOrLive([1, 2], true, async () => {
      calls += 1;
      return [3];
    });
    expect(result).toEqual({ data: [1, 2], source: "snapshot" });
    expect(calls).toBe(0);
  });

  it("re-fetches stale data and marks its source as live", async () => {
    const result = await chooseSnapshotOrLive([1], false, async () => [2, 3]);
    expect(result).toEqual({ data: [2, 3], source: "live" });
  });

  it("retains last known good sections when GitHub becomes unavailable", async () => {
    expect(await chooseSnapshotOrLive([1], false, async () => null))
      .toEqual({ data: [1], source: "snapshot" });
    expect(await chooseSnapshotOrLive([1], false, async () => {
      throw new Error("rate limited");
    })).toEqual({ data: [1], source: "snapshot" });
    expect(await chooseSnapshotOrLive<number[]>(null, false, async () => null))
      .toBeNull();
  });

  it("treats old, unhealthy and implausibly future-dated sections as stale", () => {
    const fresh = { healthy: true, syncedAt: "2026-10-26T12:00:00Z" };
    expect(isFreshSnapshotSection(fresh, now)).toBe(true);
    expect(isFreshSnapshotSection({ ...fresh, syncedAt: "2026-10-26T10:00:00Z" }, now)).toBe(false);
    expect(isFreshSnapshotSection({ ...fresh, healthy: false }, now)).toBe(false);
    expect(isFreshSnapshotSection({ ...fresh, syncedAt: "2026-10-26T13:07:00Z" }, now)).toBe(false);
  });
});
