/**
 * Public GitHub evidence for the living portfolio.
 *
 * Only public repositories and merged PRs are included. No claim about
 * production readiness, CI status, or user adoption is inferred from activity.
 *
 * `memo-showcase` is an explicit opt-in for new repositories. Existing
 * repositories listed below are editorially selected; both paths must pass
 * the same freshness and public-data safeguards.
 */
const GITHUB_USER = "guillaume-flambard";
const GITHUB_ORG = "memolabs-dev";
const SHOWCASE_TOPIC = "memo-showcase";
const HIDE_TOPIC = "memo-hide";
const REVALIDATE_SECONDS = 60 * 60;
const RECENT_DAYS = 120;

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
};

export type GithubPullRequest = {
  title: string;
  html_url: string;
  repository_url: string;
  closed_at: string | null;
  user?: { login?: string };
};

export type OpenSourceContribution = {
  title: string;
  url: string;
  repository: string;
  mergedAt: string | null;
};

export type GithubActivity = {
  projects: ShowcaseProject[];
  contributions: OpenSourceContribution[];
};

function publicGithubUrl(value: string): boolean {
  return /^https:\/\/github\.com\/[a-zA-Z0-9_.-]+\/[a-zA-Z0-9_.-]+(?:\/pull\/[0-9]+)?$/.test(value);
}

export function selectShowcaseProjects(
  repositories: GithubRepository[],
  now = Date.now(),
): ShowcaseProject[] {
  const threshold = now - RECENT_DAYS * 24 * 60 * 60 * 1000;
  const seen = new Set<string>();

  return repositories
    .filter((repo) => {
      if (!repo || typeof repo.full_name !== "string" || typeof repo.name !== "string") return false;
      const key = repo.full_name.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      if (
        repo.private || repo.archived || repo.fork ||
        !repo.pushed_at || !Number.isFinite(Date.parse(repo.pushed_at)) ||
        Date.parse(repo.pushed_at) < threshold ||
        !publicGithubUrl(repo.html_url) || repo.size < 1
      ) return false;
      const topics = Array.isArray(repo.topics) ? repo.topics : [];
      if (topics.includes(HIDE_TOPIC)) return false;
      return EDITORIAL_REPOS.has(key) || topics.includes(SHOWCASE_TOPIC);
    })
    .sort((a, b) => Date.parse(b.pushed_at!) - Date.parse(a.pushed_at!))
    .slice(0, 4)
    .map((repo) => ({
      name: repo.name,
      fullName: repo.full_name,
      url: repo.html_url,
      description: typeof repo.description === "string" && repo.description.trim()
        ? repo.description.trim().slice(0, 240) : null,
      language: repo.language,
      pushedAt: repo.pushed_at!,
    }));
}

export function selectMergedContributions(items: GithubPullRequest[]): OpenSourceContribution[] {
  const repositories = new Set<string>();
  return items
    .flatMap((pr) => {
      if (!pr || typeof pr.html_url !== "string" || !publicGithubUrl(pr.html_url) ||
          !/\/pull\/[0-9]+$/.test(pr.html_url)) return [];
      if (pr.user?.login?.toLowerCase() !== GITHUB_USER) return [];
      const match = pr.repository_url?.match(
        /^https:\/\/api\.github\.com\/repos\/([a-zA-Z0-9_.-]+)\/([a-zA-Z0-9_.-]+)$/,
      );
      if (!match) return [];
      const owner = match[1].toLowerCase();
      const repoName = match[2];
      if (owner === GITHUB_USER || owner === GITHUB_ORG) return [];
      const repository = `${match[1]}/${repoName}`;
      if (repositories.has(repository.toLowerCase())) return [];
      repositories.add(repository.toLowerCase());
      return [{
        title: pr.title?.trim().slice(0, 150) || "Merged contribution",
        url: pr.html_url,
        repository,
        mergedAt: pr.closed_at ?? null,
      }];
    })
    .slice(0, 5);
}

async function githubJson<T>(url: string): Promise<T | null> {
  const token = process.env.GITHUB_READ_TOKEN;
  try {
    const response = await fetch(url, {
      headers: {
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
        "User-Agent": "MemoLabsPortfolio",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      next: { revalidate: REVALIDATE_SECONDS },
      signal: AbortSignal.timeout(5500),
    });
    if (!response.ok) return null;
    return await response.json() as T;
  } catch {
    // API outages or rate limits should never make the portfolio fail to render.
    return null;
  }
}

export async function getGithubActivity(): Promise<GithubActivity> {
  const q = encodeURIComponent(
    "author:guillaume-flambard is:pr is:merged -user:guillaume-flambard -org:memolabs-dev",
  );
  const [personal, organization, search] = await Promise.all([
    githubJson<GithubRepository[]>(
      `https://api.github.com/users/${GITHUB_USER}/repos?type=owner&sort=pushed&direction=desc&per_page=100`,
    ),
    githubJson<GithubRepository[]>(
      `https://api.github.com/orgs/${GITHUB_ORG}/repos?type=public&sort=pushed&direction=desc&per_page=100`,
    ),
    githubJson<{ items?: GithubPullRequest[] }>(
      `https://api.github.com/search/issues?q=${q}&sort=updated&order=desc&per_page=30`,
    ),
  ]);
  return {
    projects: selectShowcaseProjects([
      ...(Array.isArray(personal) ? personal : []),
      ...(Array.isArray(organization) ? organization : []),
    ]),
    contributions: selectMergedContributions(
      Array.isArray(search?.items) ? search.items : [],
    ),
  };
}
