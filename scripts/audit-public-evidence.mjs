/**
 * Public access audit only. This verifies that linked websites, repositories
 * and a published npm package respond; it NEVER certifies product functionality,
 * production transactions, customer adoption or authenticated user journeys.
 *
 * Node 24+ uses native TypeScript type stripping for the portfolio data module.
 */
import { FEATURED } from "../src/data/projects.ts";
import { mkdir, writeFile, appendFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";

const DEFAULT_TIMEOUT_MS = 12000;
const RETRIES = 2;

export function classifyHttpStatus(code) {
  if (code >= 200 && code < 400) return "accessible";
  if ([401, 403, 429].includes(code)) return "restricted";
  if ([404, 410].includes(code)) return "missing";
  return "inconclusive";
}

export function makeTargets(projects = FEATURED) {
  const targets = projects.flatMap((project) =>
    project.links.map((link) => ({
      project: project.name,
      slug: project.slug,
      kind: link.label,
      url: link.url,
    })),
  );
  for (const target of [...targets]) {
    if (target.kind !== "npm") continue;
    const match = new URL(target.url).pathname.match(/^\/package\/(@[^/]+\/)?([^/]+)$/);
    if (!match) throw new Error("Unsupported npm package URL: " + target.url);
    const packageName = [match[1] || "", match[2]].join("");
    targets.push({
      project: target.project,
      slug: target.slug,
      kind: "npm-registry",
      url: "https://registry.npmjs.org/" + encodeURIComponent(packageName) + "/latest",
      expectedPackage: packageName,
    });
  }
  return targets;
}

export async function checkTarget(target, { request = fetch, timeoutMs = DEFAULT_TIMEOUT_MS } = {}) {
  let latest = null;
  for (let attempt = 1; attempt <= RETRIES; attempt++) {
    try {
      const response = await request(target.url, {
        method: "GET",
        headers: {
          "User-Agent": "MemoLabs-Public-Evidence-Audit/1.0 (+https://memolabs.dev)",
          "Accept": target.kind === "npm-registry" ? "application/json" : "text/html,application/json,*/*",
        },
        redirect: "follow",
        signal: AbortSignal.timeout(timeoutMs),
      });
      let status = classifyHttpStatus(response.status);
      let note = "";
      let version;
      if (target.kind === "npm-registry" && status === "accessible") {
        try {
          const metadata = await response.json();
          if (metadata.name !== target.expectedPackage || !metadata.version) {
            status = "inconclusive";
            note = "Unexpected npm metadata";
          } else {
            version = String(metadata.version);
            note = "Registry metadata confirms package/version, not runtime behavior";
          }
        } catch {
          status = "inconclusive";
          note = "Could not validate npm registry metadata";
        }
      } else {
        await response.body?.cancel?.().catch(() => undefined);
      }
      if (status === "restricted") note = "Possible authentication, rate limit or bot protection; not proof of a broken public link";
      if (status === "accessible" && target.kind !== "npm-registry") note = "HTTP access only; does not verify an app feature";
      latest = {
        ...target,
        status,
        httpStatus: response.status,
        finalUrl: response.url,
        ...(version ? { version } : {}),
        note,
        attempts: attempt,
      };
      if (status !== "inconclusive" || attempt === RETRIES) return latest;
    } catch (error) {
      latest = {
        ...target,
        status: "inconclusive",
        httpStatus: null,
        note: "Network/timeout: " + (error instanceof Error ? error.name : "unknown"),
        attempts: attempt,
      };
    }
  }
  return latest;
}

export async function audit({ projects = FEATURED, request = fetch } = {}) {
  const targets = makeTargets(projects);
  const results = [];
  // Small batches reduce rate limiting and avoid overwhelming client services.
  for (let i = 0; i < targets.length; i += 3) {
    const batch = await Promise.all(targets.slice(i, i + 3).map((target) =>
      checkTarget(target, { request }),
    ));
    results.push(...batch);
  }
  const totals = Object.fromEntries(["accessible", "restricted", "missing", "inconclusive"].map(
    (status) => [status, results.filter((result) => result.status === status).length],
  ));
  return {
    checkedAt: new Date().toISOString(),
    scope: "Public HTTP and npm registry metadata only; not a product or security audit",
    totals,
    results,
  };
}

function safeCell(value) {
  return String(value ?? "—").replaceAll("|", "\\|").replaceAll("\n", " ").slice(0, 320);
}

export function renderSummary(report) {
  const lines = [
    "## Memo Labs — public evidence links",
    "",
    "Access check only: **an HTTP 200 does not verify transactions, authenticated flows, adoption or customer claims**.",
    "",
    "| Project | Link | Result | HTTP | Note |",
    "| --- | --- | --- | --- | --- |",
  ];
  for (const entry of report.results) {
    lines.push("| " + [entry.project, entry.kind, entry.status + (entry.version ? " (" + entry.version + ")" : ""), entry.httpStatus, entry.note].map(safeCell).join(" | ") + " |");
  }
  lines.push("", "Restricted (401/403/429) and inconclusive checks require human review and are **not treated as broken links**.", "");
  lines.push("Checked: " + report.checkedAt);
  return lines.join("\n");
}

async function main() {
  const report = await audit();
  const folder = resolve("evidence-reports");
  await mkdir(folder, { recursive: true });
  await writeFile(resolve(folder, "public-links.json"), JSON.stringify(report, null, 2) + "\n");
  const summary = renderSummary(report);
  await writeFile(resolve(folder, "public-links.md"), summary + "\n");
  if (process.env.GITHUB_STEP_SUMMARY) {
    await appendFile(process.env.GITHUB_STEP_SUMMARY, summary + "\n");
  }
  console.log(summary);
  if (process.argv.includes("--strict") && report.totals.missing > 0) {
    // Only confirmed 404/410 failures cause a red workflow run. No automatic
    // issue creation, outbound messages or changes to product status.
    process.exitCode = 1;
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await main();
}
