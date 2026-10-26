import { githubJson, type ShowcaseProject } from "./githubActivity";

/**
 * Optional .portfolio/milestones.json in the public repository.
 *
 * A declaration backed by a source link is not an independently certified
 * deployed product. In particular an Actions run URL is not deployment proof.
 */
export type ProductMilestoneKind = "prototype" | "demo" | "deployment";

export type ProductMilestone = {
  kind: ProductMilestoneKind;
  date: string;
  title: { fr: string; en: string };
  detail: { fr: string; en: string } | null;
  evidenceUrl: string;
  demoUrl?: string;
};

function textPair(value: unknown, max: number): { fr: string; en: string } | null {
  if (!value || typeof value !== "object") return null;
  const obj = value as Record<string, unknown>;
  if (typeof obj.fr !== "string" || typeof obj.en !== "string") return null;
  const fr = obj.fr.trim(), en = obj.en.trim();
  if (!fr || !en || fr.length > max || en.length > max) return null;
  return { fr, en };
}

function publicDemoUrlAllowed(url: string, project: ShowcaseProject): boolean {
  const parts = project.fullName.split("/");
  if (parts.length !== 2) return false;
  const canonical = "https://" + parts[0].toLowerCase() + ".github.io/" + parts[1].toLowerCase() + "/";
  return url.toLowerCase() === canonical;
}

/**
 * A project maintainer may link its explicitly configured public homepage as
 * a demo only when it is on a DNS name controlled by Memo Labs. A repository
 * homepage alone is never interpreted as deployment evidence.
 */
function ownedHomepageDemoAllowed(
  url: string,
  homepage: string | undefined,
): boolean {
  if (!homepage) return false;
  try {
    const target = new URL(url);
    const declared = new URL(homepage);
    return target.href === declared.href &&
      target.protocol === "https:" &&
      /^[a-z0-9-]+\.memolabs\.dev$/i.test(target.hostname) &&
      !target.username && !target.password &&
      !target.port && !target.search && !target.hash &&
      target.pathname === "/";
  } catch {
    return false;
  }
}

function evidenceAllowed(kind: ProductMilestoneKind, url: string, repoUrl: string): boolean {
  const prefix = repoUrl + "/";
  if (url.startsWith(prefix)) {
    const suffix = url.slice(prefix.length);
    if (/^commit\/[a-f0-9]{40}$/i.test(suffix) ||
        /^pull\/[1-9]\d*$/.test(suffix) ||
        /^releases\/tag\/[A-Za-z0-9_.%-]+$/.test(suffix) ||
        /^actions\/runs\/[1-9]\d*$/.test(suffix)) return true;
  }
  if (kind === "demo") {
    return /^https:\/\/(?:www\.)?youtube\.com\/watch\?v=[A-Za-z0-9_-]{11}$/.test(url) ||
      /^https:\/\/youtu\.be\/[A-Za-z0-9_-]{11}$/.test(url) ||
      /^https:\/\/(?:www\.)?vimeo\.com\/[0-9]+$/.test(url);
  }
  return false;
}

export function validateProductMilestones(
  input: unknown,
  project: ShowcaseProject,
  now = Date.now(),
  verifiedHomepage?: string,
): ProductMilestone[] {
  if (!input || typeof input !== "object" || !Array.isArray((input as Record<string, unknown>).milestones) ||
      (input as Record<string, unknown>).version !== 1) return [];
  const entries = (input as { milestones: unknown[] }).milestones.slice(0, 24);
  const seen = new Set<string>();
  return entries.flatMap((raw): ProductMilestone[] => {
    if (!raw || typeof raw !== "object") return [];
    const entry = raw as Record<string, unknown>;
    if (entry.kind !== "prototype" && entry.kind !== "demo" && entry.kind !== "deployment") return [];
    const kind = entry.kind;
    if (typeof entry.date !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(entry.date) ||
        !Number.isFinite(Date.parse(entry.date)) ||
        new Date(entry.date).toISOString().slice(0, 10) !== entry.date ||
        Date.parse(entry.date) > now + 86400000) return [];
    if (project.createdAt && Date.parse(entry.date) < Date.parse(project.createdAt.slice(0, 10))) return [];
    const title = textPair(entry.title, 110);
    const detail = entry.detail === undefined ? null : textPair(entry.detail, 300);
    if (!title || (entry.detail !== undefined && !detail)) return [];
    if (typeof entry.evidenceUrl !== "string" ||
        !evidenceAllowed(kind, entry.evidenceUrl, project.url)) return [];
    // A separate demo link must belong to this repository's public GitHub Pages
    // namespace, or be identical to the validated video proof. Never accept
    // arbitrary URLs from a remotely fetched manifest.
    let demoUrl: string | undefined;
    if (entry.demoUrl !== undefined) {
      if (kind !== "demo" || typeof entry.demoUrl !== "string") return [];
      if (!publicDemoUrlAllowed(entry.demoUrl, project) &&
          !ownedHomepageDemoAllowed(entry.demoUrl, verifiedHomepage) &&
          !(entry.demoUrl === entry.evidenceUrl &&
            evidenceAllowed("demo", entry.evidenceUrl, project.url))) return [];
      demoUrl = entry.demoUrl;
    }
    const key = kind + ":" + entry.evidenceUrl;
    if (seen.has(key)) return [];
    seen.add(key);
    return [{ kind, date: entry.date, title, detail, evidenceUrl: entry.evidenceUrl, ...(demoUrl ? { demoUrl } : {}) }];
  }).sort((a, b) => Date.parse(b.date) - Date.parse(a.date)).slice(0, 6);
}

type GithubContents = {
  type?: string;
  encoding?: string;
  content?: string;
  size?: number;
};

/** No arbitrary network destinations: the repo must have passed showcase filters. */
export async function getProductMilestones(project: ShowcaseProject): Promise<ProductMilestone[]> {
  if (!/^(guillaume-flambard|memolabs-dev)\/[A-Za-z0-9_.-]+$/.test(project.fullName) ||
      project.url.toLowerCase() !== "https://github.com/" + project.fullName.toLowerCase()) return [];
  const [content, metadata] = await Promise.all([
    githubJson<GithubContents>(
      "https://api.github.com/repos/" + project.fullName + "/contents/.portfolio/milestones.json",
    ),
    githubJson<{ homepage?: string | null }>(
      "https://api.github.com/repos/" + project.fullName,
    ),
  ]);
  if (content?.type !== "file" || content.encoding !== "base64" ||
      typeof content.content !== "string" ||
      typeof content.size !== "number" || content.size > 50_000) return [];
  try {
    const decoded = Buffer.from(content.content.replace(/\s/g, ""), "base64").toString("utf8");
    return validateProductMilestones(
      JSON.parse(decoded), project, Date.now(),
      typeof metadata?.homepage === "string" ? metadata.homepage : undefined,
    );
  } catch {
    return [];
  }
}
