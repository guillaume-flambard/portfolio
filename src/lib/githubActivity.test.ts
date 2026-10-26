import { describe, expect, it } from "vitest";
import {
  selectMergedContributions,
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
    closed_at: "2026-10-25T10:00:00Z",
    user: { login: "guillaume-flambard" },
    ...overrides,
  };
}

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
      "memolabs-dev/new-tool", "memolabs-dev/drop",
    ]);
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
    expect(selectShowcaseProjects([repos[0], ...repos], NOW)).toHaveLength(4);
  });
});

describe("accepted external contributions", () => {
  it("shows only authored external PRs, once per upstream repository", () => {
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
      "nextcloud/text", "twentyhq/twenty",
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
