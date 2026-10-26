import { FEATURED } from "@/data/projects";
import { githubJson, type ShowcaseProject } from "./githubActivity";
import { getProductMilestones, type ProductMilestone } from "./productMilestones";

/**
 * An evidence timeline is NOT a deployment history.
 * PR merge, GitHub release, repo creation and verified public site are separate facts.
 */
export type TimelineKind = "feature" | "fix" | "change" | "release" | "origin" | "public-page" | "prototype" | "demo" | "deployment";

export type TimelineEvent = {
  kind: TimelineKind;
  date: string;
  title: string;
  url: string;
  detail?: string;
};

export type ProjectTimeline = {
  events: TimelineEvent[];
  incomplete: boolean;
};

export type GithubProjectPull = {
  title?: string;
  html_url?: string;
  merged_at?: string | null;
  user?: { login?: string; type?: string };
};

export type GithubProjectRelease = {
  name?: string;
  tag_name?: string;
  published_at?: string | null;
  html_url?: string;
  draft?: boolean;
  prerelease?: boolean;
};

function validDate(value: unknown): value is string {
  return typeof value === "string" && Number.isFinite(Date.parse(value));
}

function category(title: string): TimelineKind {
  if (/^(feat(?:ure)?(?:\([^)]*\))?|add|introduce|implement)(?::|\s)/i.test(title)) return "feature";
  if (/^(fix(?:\([^)]*\))?|repair|restore)(?::|\s)/i.test(title)) return "fix";
  return "change";
}

function getEditorialPublicPage(project: ShowcaseProject): TimelineEvent | null {
  const match = FEATURED.find((candidate) =>
    candidate.links.some((link) => link.label === "repo" && link.url === project.url) &&
    ["public-website", "early-access"].includes(candidate.verification.proof),
  );
  if (!match || !validDate(match.verification.checkedAt)) return null;
  const site = match.links.find((link) => link.label === "live");
  if (!site || !/^https:\/\//.test(site.url)) return null;
  return {
    kind: "public-page",
    date: match.verification.checkedAt,
    title: match.name,
    url: site.url,
  };
}

export function buildProjectTimeline(
  project: ShowcaseProject,
  pulls: GithubProjectPull[] | null,
  releases: GithubProjectRelease[] | null,
  milestones: ProductMilestone[] = [],
  locale: "fr" | "en" = "fr",
): ProjectTimeline {
  const events: TimelineEvent[] = [];
  const seen = new Set<string>();

  if (Array.isArray(pulls)) {
    for (const pr of pulls) {
      if (!validDate(pr.merged_at) || typeof pr.html_url !== "string" ||
          !pr.html_url.startsWith(project.url + "/pull/") ||
          !/^\d+$/.test(pr.html_url.slice(project.url.length + "/pull/".length)) ||
          pr.user?.login?.toLowerCase() !== "guillaume-flambard") continue;
      const title = typeof pr.title === "string" ? pr.title.trim() : "";
      if (!title || /^(chore|ci|docs|test|build|bump|deps)(?:\([^)]*\))?:/i.test(title)) continue;
      if (seen.has(pr.html_url)) continue;
      seen.add(pr.html_url);
      events.push({
        kind: category(title),
        date: pr.merged_at,
        title: title.slice(0, 180),
        url: pr.html_url,
      });
    }
  }

  if (Array.isArray(releases)) {
    for (const release of releases) {
      if (release.draft || !validDate(release.published_at) ||
          typeof release.html_url !== "string" ||
          !release.html_url.startsWith(project.url + "/releases/tag/") ||
          release.html_url.length <= (project.url + "/releases/tag/").length ||
          seen.has(release.html_url)) continue;
      seen.add(release.html_url);
      events.push({
        kind: "release",
        date: release.published_at,
        title: (release.name?.trim() || release.tag_name?.trim() || "GitHub release").slice(0, 180),
        url: release.html_url,
      });
    }
  }

  const publicPage = getEditorialPublicPage(project);
  if (publicPage) events.push(publicPage);

  // Product milestones are deliberate, sourced declarations from the repo.
  // Keep them visible even when frequent PR merges fill the recent activity list.
  const documented = milestones.map((entry): TimelineEvent => ({
    kind: entry.kind,
    date: entry.date,
    title: entry.title[locale],
    url: entry.evidenceUrl,
    detail: entry.detail?.[locale],
  }));
  events.sort((a, b) => Date.parse(b.date) - Date.parse(a.date));
  const recent = [...events.slice(0, 12), ...documented].sort(
    (a, b) => Date.parse(b.date) - Date.parse(a.date),
  );

  // Creation is an observable GitHub fact, NOT proof that a prototype existed on this date.
  if (validDate(project.createdAt)) {
    recent.push({
      kind: "origin",
      date: project.createdAt,
      title: project.name,
      url: project.url,
    });
  }

  return {
    events: recent,
    incomplete: pulls === null || releases === null,
  };
}

export async function getProjectTimeline(project: ShowcaseProject, locale: "fr" | "en" = "fr"): Promise<ProjectTimeline> {
  if (!/^[a-z\d_.-]+\/[a-z\d_.-]+$/i.test(project.fullName) ||
      project.url !== `https://github.com/${project.fullName}`) {
    return { events: [], incomplete: true };
  }
  const api = `https://api.github.com/repos/${project.fullName}`;
  const [pulls, releases, milestones] = await Promise.all([
    githubJson<GithubProjectPull[]>(`${api}/pulls?state=closed&sort=updated&direction=desc&per_page=60`),
    githubJson<GithubProjectRelease[]>(`${api}/releases?per_page=15`),
    getProductMilestones(project),
  ]);
  return buildProjectTimeline(
    project,
    Array.isArray(pulls) ? pulls : null,
    Array.isArray(releases) ? releases : null,
    milestones,
    locale,
  );
}
