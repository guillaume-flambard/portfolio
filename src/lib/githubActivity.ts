import { cache } from "react";

/** Public evidence: curated work, newly-created repositories and external PRs. */
const GITHUB_USER = "guillaume-flambard";
const GITHUB_ORG = "memolabs-dev";
const SHOWCASE_TOPIC = "memo-showcase";
const HIDE_TOPICS = new Set(["memo-hide", "memo-internal", "internal"]);
const REVALIDATE_SECONDS = 3600;
const RECENT_DAYS = 120;
const NEW_REPO_DAYS = 90;

const EDITORIAL_REPOS = new Set([
  "guillaume-flambard/algo-observatory",
  "guillaume-flambard/foldready",
  "guillaume-flambard/paykit",
  "memolabs-dev/drop",
  "memolabs-dev/mediterranean-rescue",
  "memolabs-dev/memo-bridge",
]);

export type GithubRepository = {
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  pushed_at: string | null;
  created_at?: string | null;
  topics: string[];
  fork: boolean;
  archived: boolean;
  private: boolean;
  size: number;
};

export type ShowcaseProject = {
  name: string;
  fullName: string;
  url: string;
  description: string | null;
  language: string | null;
  pushedAt: string;
  createdAt: string | null;
};

export type GithubPullRequest = {
  title: string;
  html_url: string;
  repository_url: string;
  state?: string;
  created_at?: string | null;
  closed_at: string | null;
  pull_request?: { merged_at?: string | null };
  user?: { login?: string };
};

export type OpenSourceContribution = {
  title: string;
  url: string;
  repository: string;
  status: "merged" | "open";
  createdAt: string | null;
  mergedAt: string | null;
};

export type GithubSync = {
  source: "snapshot" | "live";
  updatedAt: string | null;
  degraded: boolean;
};

export type GithubSnapshot = {
  version: number;
  generatedAt: string;
  sections: {
    repositories: { items: GithubRepository[]; syncedAt: string; healthy: boolean };
    merged: { items: GithubPullRequest[]; syncedAt: string; healthy: boolean };
    open: { items: GithubPullRequest[]; syncedAt: string; healthy: boolean };
  };
};

export type GithubActivity = {
  projects: ShowcaseProject[];
  newProjects: ShowcaseProject[];
  contributions: OpenSourceContribution[];
  openContributions: OpenSourceContribution[];
  sync: GithubSync;
};

function isDate(value: unknown): value is string {
  return typeof value === "string" && Number.isFinite(Date.parse(value));
}

function isPublicGithubRepoUrl(value: unknown): value is string {
  return typeof value === "string" &&
    /^https:\/\/github\.com\/[a-zA-Z0-9_.-]+\/[a-zA-Z0-9_.-]+$/.test(value);
}

function isEligibleRepo(repo: GithubRepository, now: number): boolean {
  if (!repo || typeof repo.full_name !== "string" || typeof repo.name !== "string") return false;
  const name = repo.full_name.toLowerCase();
  const owner = name.split("/")[0];
  if (owner !== GITHUB_USER && owner !== GITHUB_ORG) return false;
  if (!isPublicGithubRepoUrl(repo.html_url) ||
      repo.html_url.toLowerCase() !== "https://github.com/" + name) return false;
  if (repo.private || repo.archived || repo.fork || !Number.isFinite(repo.size) || repo.size < 1) return false;
  if (!isDate(repo.pushed_at) || Date.parse(repo.pushed_at) > now + 86400000) return false;
  const topics = Array.isArray(repo.topics) ? repo.topics : [];
  if (topics.some((topic) => HIDE_TOPICS.has(topic.toLowerCase()))) return false;
  if (repo.name === ".github" || repo.name.startsWith(".") ||
      /(^|[-_])(infra|backups|vault|jobs|secrets)([-_]|$)/i.test(repo.name)) return false;
  return true;
}

function presentRepo(repo: GithubRepository): ShowcaseProject {
  return {
    name: repo.name,
    fullName: repo.full_name,
    url: repo.html_url,
    description: typeof repo.description === "string" && repo.description.trim()
      ? repo.description.trim().slice(0, 240) : null,
    language: typeof repo.language === "string" ? repo.language : null,
    pushedAt: repo.pushed_at!,
    createdAt: isDate(repo.created_at) ? repo.created_at : null,
  };
}

/** Existing editorial feature set; activity is not proof of production readiness. */
export function selectShowcaseProjects(
  repositories: GithubRepository[],
  now = Date.now(),
  limit = 4,
): ShowcaseProject[] {
  const threshold = now - RECENT_DAYS * 86400000;
  const seen = new Set<string>();
  return repositories
    .filter((repo) => {
      if (!isEligibleRepo(repo, now) || Date.parse(repo.pushed_at!) < threshold) return false;
      const key = repo.full_name.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      const topics = Array.isArray(repo.topics) ? repo.topics : [];
      return EDITORIAL_REPOS.has(key) || topics.includes(SHOWCASE_TOPIC);
    })
    .sort((a, b) => Date.parse(b.pushed_at!) - Date.parse(a.pushed_at!))
    .slice(0, Math.max(0, Math.min(limit, 100)))
    .map(presentRepo);
}

/** Automatically discovered work, clearly labeled as recently published public code. */
export function selectNewPublicProjects(
  repositories: GithubRepository[],
  now = Date.now(),
  limit = 4,
): ShowcaseProject[] {
  const threshold = now - NEW_REPO_DAYS * 86400000;
  const seen = new Set<string>();
  return repositories
    .filter((repo) => {
      if (!isEligibleRepo(repo, now) ||
          !isDate(repo.created_at) ||
          Date.parse(repo.created_at) < threshold ||
          Date.parse(repo.created_at) > now + 86400000) return false;
      const key = repo.full_name.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      const topics = Array.isArray(repo.topics) ? repo.topics : [];
      return !EDITORIAL_REPOS.has(key) && !topics.includes(SHOWCASE_TOPIC);
    })
    .sort((a, b) => Date.parse(b.created_at!) - Date.parse(a.created_at!))
    .slice(0, Math.max(0, Math.min(limit, 100)))
    .map(presentRepo);
}

/** Preserve all PRs, even when several belong to the same upstream. */
export function selectExternalContributions(
  items: GithubPullRequest[],
  status: "merged" | "open",
  limit = 100,
): OpenSourceContribution[] {
  const seen = new Set<string>();
  return items.flatMap((pr) => {
    if (!pr || pr.user?.login?.toLowerCase() !== GITHUB_USER) return [];
    const match = pr.repository_url?.match(
      /^https:\/\/api\.github\.com\/repos\/([a-zA-Z0-9_.-]+)\/([a-zA-Z0-9_.-]+)$/,
    );
    if (!match) return [];
    const owner = match[1].toLowerCase();
    if (owner === GITHUB_USER || owner === GITHUB_ORG) return [];
    const repository = match[1] + "/" + match[2];
    const prUrl = pr.html_url;
    if (typeof prUrl !== "string" ||
        !/^https:\/\/github\.com\/[a-zA-Z0-9_.-]+\/[a-zA-Z0-9_.-]+\/pull\/[0-9]+$/.test(prUrl) ||
        !prUrl.toLowerCase().startsWith("https://github.com/" + repository.toLowerCase() + "/pull/") ||
        seen.has(prUrl.toLowerCase())) return [];
    const mergedAt = pr.pull_request?.merged_at;
    if (status === "merged" && !isDate(mergedAt)) return [];
    if (status === "open" && (pr.state !== "open" || isDate(mergedAt))) return [];
    const title = typeof pr.title === "string" ? pr.title.trim() : "";
    if (!title) return [];
    seen.add(prUrl.toLowerCase());
    return [{
      title: title.slice(0, 180),
      url: prUrl,
      repository,
      status,
      createdAt: isDate(pr.created_at) ? pr.created_at : null,
      mergedAt: status === "merged" && isDate(mergedAt) ? mergedAt : null,
    }];
  }).sort((a, b) =>
    Date.parse((b.mergedAt ?? b.createdAt) || "1970-01-01") -
    Date.parse((a.mergedAt ?? a.createdAt) || "1970-01-01"),
  ).slice(0, Math.max(0, Math.min(limit, 100)));
}

/** Closed-but-unmerged PRs are deliberately excluded. */
export function selectMergedContributions(items: GithubPullRequest[]): OpenSourceContribution[] {
  return selectExternalContributions(items, "merged", 100);
}

export async function githubJson<T>(url: string): Promise<T | null> {
  const token = process.env.GITHUB_READ_TOKEN;
  try {
    const response = await fetch(url, {
      headers: {
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
        "User-Agent": "MemoLabsPortfolio",
        ...(token ? { Authorization: "Bearer " + token } : {}),
      },
      next: { revalidate: REVALIDATE_SECONDS },
      signal: AbortSignal.timeout(5500),
    });
    if (!response.ok) return null;
    return await response.json() as T;
  } catch {
    return null;
  }
}

const SNAPSHOT_URL =
  "https://raw.githubusercontent.com/guillaume-flambard/portfolio/github-activity/data/github-snapshot.json";

/** A separate, versioned branch is the durable last-known-good store. */
export function validateSnapshot(input: unknown): GithubSnapshot | null {
  if (!input || typeof input !== "object") return null;
  const obj = input as Record<string, unknown>;
  if (obj.version !== 1 || !isDate(obj.generatedAt) ||
      !obj.sections || typeof obj.sections !== "object") return null;
  const sections = obj.sections as Record<string, unknown>;
  for (const key of ["repositories", "merged", "open"]) {
    const item = sections[key] as Record<string, unknown> | undefined;
    if (!item || !Array.isArray(item.items) || item.items.length > 250 ||
        !isDate(item.syncedAt) || typeof item.healthy !== "boolean") return null;
  }
  return input as GithubSnapshot;
}

const getSnapshot = cache(async (): Promise<GithubSnapshot | null> => {
  try {
    const response = await fetch(SNAPSHOT_URL, {
      next: { revalidate: 15 * 60 },
      signal: AbortSignal.timeout(5500),
    });
    if (!response.ok) return null;
    return validateSnapshot(await response.json());
  } catch {
    return null;
  }
});

async function liveRepositories(): Promise<GithubRepository[] | null> {
  const urls = [
    "https://api.github.com/users/" + GITHUB_USER + "/repos?type=owner&sort=pushed&direction=desc&per_page=100",
    "https://api.github.com/users/" + GITHUB_USER + "/repos?type=owner&sort=created&direction=desc&per_page=100",
    "https://api.github.com/orgs/" + GITHUB_ORG + "/repos?type=public&sort=pushed&direction=desc&per_page=100",
    "https://api.github.com/orgs/" + GITHUB_ORG + "/repos?type=public&sort=created&direction=desc&per_page=100",
  ];
  const batches = await Promise.all(urls.map((url) => githubJson<GithubRepository[]>(url)));
  if (batches.some((batch) => !Array.isArray(batch))) return null;
  const seen = new Set<string>();
  return batches.flatMap((batch) => batch as GithubRepository[]).filter((repo) => {
    if (typeof repo?.full_name !== "string") return false;
    const key = repo.full_name.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

const loadPublicRepositories = cache(async (): Promise<GithubRepository[]> => {
  const snapshot = await getSnapshot();
  if (snapshot) return snapshot.sections.repositories.items;
  const repos = await liveRepositories();
  if (repos === null) {
    // Fail the regeneration instead of overwriting the last cached HTML with an empty feed.
    throw new Error("No usable GitHub snapshot or repository data");
  }
  return repos;
});

export async function getGithubSync(): Promise<GithubSync> {
  const snapshot = await getSnapshot();
  if (!snapshot) return { source: "live", updatedAt: null, degraded: false };
  const oldest = [
    snapshot.sections.repositories.syncedAt,
    snapshot.sections.merged.syncedAt,
    snapshot.sections.open.syncedAt,
  ].sort()[0];
  return {
    source: "snapshot",
    updatedAt: oldest,
    degraded: Object.values(snapshot.sections).some((section) => !section.healthy) ||
      Date.now() - Date.parse(oldest) > 2 * 60 * 60 * 1000,
  };
}

export async function getShowcaseProjects(limit = 4): Promise<ShowcaseProject[]> {
  const repos = await loadPublicRepositories();
  const selected = selectShowcaseProjects(repos, Date.now(), limit);
  const discovered = selectNewPublicProjects(repos, Date.now(), limit);
  return [...selected, ...discovered].slice(0, Math.max(0, Math.min(limit, 100)));
}

export const getExternalContributions = cache(async (): Promise<{
  merged: OpenSourceContribution[];
  open: OpenSourceContribution[];
}> => {
  const snapshot = await getSnapshot();
  if (snapshot) {
    return {
      merged: selectExternalContributions(snapshot.sections.merged.items, "merged"),
      open: selectExternalContributions(snapshot.sections.open.items, "open"),
    };
  }
  const base = "author:guillaume-flambard is:pr -user:guillaume-flambard -org:memolabs-dev";
  const urls = [
    "https://api.github.com/search/issues?q=" + encodeURIComponent(base + " is:merged") + "&sort=updated&order=desc&per_page=100",
    "https://api.github.com/search/issues?q=" + encodeURIComponent(base + " is:open") + "&sort=created&order=desc&per_page=100",
  ];
  const [merged, open] = await Promise.all(urls.map((url) => githubJson<{
    items?: GithubPullRequest[];
  }>(url)));
  if (!Array.isArray(merged?.items) || !Array.isArray(open?.items)) {
    throw new Error("No usable GitHub snapshot or contribution feed");
  }
  return {
    merged: selectExternalContributions(merged.items, "merged"),
    open: selectExternalContributions(open.items, "open"),
  };
});

export async function getGithubActivity(): Promise<GithubActivity> {
  const [repos, contributionFeed, sync] = await Promise.all([
    loadPublicRepositories(),
    getExternalContributions(),
    getGithubSync(),
  ]);
  return {
    projects: selectShowcaseProjects(repos),
    newProjects: selectNewPublicProjects(repos),
    contributions: contributionFeed.merged.slice(0, 5),
    openContributions: contributionFeed.open.slice(0, 2),
    sync,
  };
}
