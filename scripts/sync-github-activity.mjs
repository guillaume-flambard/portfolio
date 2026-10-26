#!/usr/bin/env node
/**
 * Durable, scheduled public GitHub snapshot.
 * Run: node scripts/sync-github-activity.mjs <output.json> [previous.json]
 *
 * Data is written to the separate github-activity branch by the workflow.
 * NEVER write into main: scheduled data changes must not trigger portfolio builds.
 */
import { readFile, writeFile } from "node:fs/promises";

const actor = "guillaume-flambard";
const organization = "memolabs-dev";
const LIMIT = 100;
const VALID_SECTIONS = ["repositories", "merged", "open"];
const time = () => new Date().toISOString();

function validPrior(snapshot) {
  return snapshot && snapshot.version === 1 &&
    VALID_SECTIONS.every((key) => snapshot.sections?.[key] &&
      Array.isArray(snapshot.sections[key].items) &&
      typeof snapshot.sections[key].syncedAt === "string");
}

async function fetchGithub(url) {
  const headers = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "memo-labs-public-snapshot",
  };
  if (process.env.GITHUB_TOKEN) headers.Authorization = "Bearer " + process.env.GITHUB_TOKEN;
  for (let retry = 0; retry < 3; retry++) {
    let response;
    try {
      response = await fetch(url, {
        headers,
        signal: AbortSignal.timeout(15000),
      });
    } catch (error) {
      if (retry === 2) throw error;
      await new Promise((done) => setTimeout(done, (retry + 1) * 1000));
      continue;
    }
    if (response.ok) return response.json();
    if (retry === 2 || ![429, 500, 502, 503, 504].includes(response.status)) {
      throw new Error("GitHub returned " + response.status + " from " + new URL(url).pathname);
    }
    await new Promise((done) => setTimeout(done, (retry + 1) * 1000));
  }
}

async function getRepositories() {
  const urls = [
    "https://api.github.com/users/" + actor + "/repos?type=owner&sort=created&direction=desc&per_page=" + LIMIT,
    "https://api.github.com/users/" + actor + "/repos?type=owner&sort=pushed&direction=desc&per_page=" + LIMIT,
    "https://api.github.com/orgs/" + organization + "/repos?type=public&sort=created&direction=desc&per_page=" + LIMIT,
    "https://api.github.com/orgs/" + organization + "/repos?type=public&sort=pushed&direction=desc&per_page=" + LIMIT,
  ];
  const batches = await Promise.all(urls.map(fetchGithub));
  const byName = new Map();
  for (const batch of batches) {
    if (!Array.isArray(batch)) throw new Error("GitHub returned a non-array repository list");
    for (const repo of batch) {
      if (!repo || typeof repo.full_name !== "string" || typeof repo.html_url !== "string") continue;
      byName.set(repo.full_name.toLowerCase(), {
        name: repo.name,
        full_name: repo.full_name,
        html_url: repo.html_url,
        description: repo.description,
        language: repo.language,
        pushed_at: repo.pushed_at,
        created_at: repo.created_at,
        topics: Array.isArray(repo.topics) ? repo.topics : [],
        fork: repo.fork,
        archived: repo.archived,
        private: repo.private,
        size: repo.size,
      });
    }
  }
  return [...byName.values()];
}

async function getPulls(status) {
  const query = "author:" + actor + " is:pr is:" + status + " -user:" + actor + " -org:" + organization;
  const url = "https://api.github.com/search/issues?q=" + encodeURIComponent(query) +
    "&sort=updated&order=desc&per_page=100";
  const result = await fetchGithub(url);
  if (!result || !Array.isArray(result.items)) throw new Error("GitHub returned invalid PR search results");
  // The existing app validates each author's identity, merged_at and exact upstream URL.
  return result.items.map((item) => ({
    title: item.title,
    html_url: item.html_url,
    repository_url: item.repository_url,
    state: item.state,
    created_at: item.created_at,
    closed_at: item.closed_at,
    pull_request: { merged_at: item.pull_request?.merged_at ?? null },
    user: { login: item.user?.login },
  }));
}

export async function buildSnapshot(previous, sources, now = time()) {
  const data = { version: 1, generatedAt: now, sections: {} };
  const failures = [];
  for (const key of VALID_SECTIONS) {
    try {
      const items = await sources[key]();
      if (!Array.isArray(items)) throw new Error("Expected a list");
      data.sections[key] = { items, syncedAt: now, healthy: true };
    } catch (error) {
      failures.push(key + ": " + String(error));
      if (validPrior(previous)) {
        data.sections[key] = {
          ...previous.sections[key],
          healthy: false,
        };
      } else {
        throw new Error("Cannot initialize " + key + " without a valid previous snapshot: " + String(error));
      }
    }
  }
  return { data, failures };
}

async function main() {
  const [, , target, previousPath] = process.argv;
  if (!target) throw new Error("Usage: node scripts/sync-github-activity.mjs output.json [previous.json]");
  let previous = null;
  if (previousPath) {
    try { previous = JSON.parse(await readFile(previousPath, "utf8")); }
    catch { /* first run or unreadable prior; fail rather than publish an empty section */ }
  }
  const { data, failures } = await buildSnapshot(previous, {
    repositories: getRepositories,
    merged: () => getPulls("merged"),
    open: () => getPulls("open"),
  });
  await writeFile(target, JSON.stringify(data, null, 2) + "\n");
  if (failures.length) {
    console.error("GitHub snapshot updated using previous valid sections:\n" + failures.join("\n"));
    // Publish the last known good state, then have the workflow explicitly fail on alert.
    await writeFile(target + ".warnings", failures.join("\n") + "\n");
  }
  console.log("Snapshot generated, " + Object.entries(data.sections)
    .map(([k, v]) => k + "=" + v.items.length + (v.healthy ? "" : " (last-known-good)")).join(", "));
}

if (process.argv[1]?.endsWith("sync-github-activity.mjs")) {
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
