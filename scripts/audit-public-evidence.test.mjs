import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { FEATURED } from "../src/data/projects.ts";
import { classifyHttpStatus, makeTargets, checkTarget, audit, renderSummary } from "./audit-public-evidence.mjs";

describe("public evidence audit — conservative classification", () => {
  it("distinguishes accessible, restricted, missing and inconclusive", () => {
    for (const status of [200, 204, 301, 308]) assert.equal(classifyHttpStatus(status), "accessible");
    for (const status of [401, 403, 429]) assert.equal(classifyHttpStatus(status), "restricted");
    for (const status of [404, 410]) assert.equal(classifyHttpStatus(status), "missing");
    for (const status of [500, 503]) assert.equal(classifyHttpStatus(status), "inconclusive");
  });

  it("uses real featured links, never creates a fake working Weave demo", () => {
    const targets = makeTargets();
    assert.equal(targets.length, 11);
    assert.equal(FEATURED.length, 7);
    assert.equal(targets.filter((t) => t.kind === "npm-registry").length, 1);
    assert.ok(targets.some((t) => t.url === "https://registry.npmjs.org/n8n-nodes-opn/latest"));
    assert.ok(!targets.some((t) => t.url.includes("weave.memolabs.dev")));
    for (const t of targets) assert.ok(t.url.startsWith("https://"));
  });

  it("does not report a 403 anti-bot response as a missing link", async () => {
    const result = await checkTarget({ project: "node", kind: "npm", url: "https://www.npmjs.com/package/n8n-nodes-opn" }, {
      request: async (url) => ({
        status: 403, url, body: { cancel: async () => undefined },
      }),
    });
    assert.equal(result.status, "restricted");
    assert.equal(result.httpStatus, 403);
    assert.match(result.note, /bot protection/);
  });

  it("requires real npm registry name and version, without claiming install success", async () => {
    const target = makeTargets().find((t) => t.kind === "npm-registry");
    const response = async (url) => ({
      status: 200,
      url,
      json: async () => ({ name: "n8n-nodes-opn", version: "0.1.1" }),
    });
    const result = await checkTarget(target, { request: response });
    assert.equal(result.status, "accessible");
    assert.equal(result.version, "0.1.1");
    assert.match(result.note, /not runtime behavior/);
    const mismatch = await checkTarget(target, {
      request: async (url) => ({ status: 200, url, json: async () => ({ name: "wrong", version: "1.0.0" }) }),
    });
    assert.equal(mismatch.status, "inconclusive");
  });

  it("keeps network errors inconclusive, and confirms actual 404/410 responses", async () => {
    const target = { project: "test", kind: "live", url: "https://example.com/" };
    const network = await checkTarget(target, { request: async () => { throw new Error("timeout"); } });
    assert.equal(network.status, "inconclusive");
    assert.equal(network.attempts, 2);
    const missing = await checkTarget(target, { request: async (url) => ({
      status: 404, url, body: { cancel: async () => undefined },
    }) });
    assert.equal(missing.status, "missing");
  });

  it("makes a human-readable report without conflating public HTTP with product proof", async () => {
    const fakeProjects = [{ name: "Example", slug: "example", links: [{ label: "live", url: "https://example.com/" }] }];
    const report = await audit({ projects: fakeProjects, request: async (url) => ({
      status: 200, url, body: { cancel: async () => undefined },
    }) });
    assert.equal(report.totals.accessible, 1);
    const md = renderSummary(report);
    assert.match(md, /HTTP 200 does not verify transactions/);
    assert.match(md, /Example/);
    assert.match(md, /not treated as broken links/);
  });
});
