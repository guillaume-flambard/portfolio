import test from "node:test";
import assert from "node:assert/strict";
import { buildSnapshot } from "./sync-github-activity.mjs";

const now = "2026-10-26T08:00:00Z";
const sources = {
  repositories: async () => [{ full_name: "guillaume-flambard/example" }],
  merged: async () => [{ html_url: "https://github.com/nextcloud/text/pull/9159" }],
  open: async () => [],
};

test("generates all three independently timestamped snapshot sections", async () => {
  const { data, failures } = await buildSnapshot(null, sources, now);
  assert.deepEqual(failures, []);
  assert.equal(data.version, 1);
  assert.equal(data.sections.repositories.items.length, 1);
  assert.equal(data.sections.merged.items.length, 1);
  assert.deepEqual(data.sections.open.items, []);
  assert.equal(data.sections.open.healthy, true);
  assert.equal(data.sections.open.syncedAt, now);
});

test("a transient upstream error retains previously published evidence", async () => {
  const previous = (await buildSnapshot(null, sources, now)).data;
  const nextTime = "2026-10-26T08:30:00Z";
  const { data, failures } = await buildSnapshot(previous, {
    ...sources,
    merged: async () => { throw new Error("rate limited"); },
  }, nextTime);
  assert.equal(failures.length, 1);
  assert.deepEqual(data.sections.merged.items, previous.sections.merged.items);
  assert.equal(data.sections.merged.syncedAt, now);
  assert.equal(data.sections.merged.healthy, false);
  assert.equal(data.sections.open.healthy, true);
  assert.equal(data.sections.open.syncedAt, nextTime);
});

test("initial API failure is fatal rather than silently publishing an empty portfolio", async () => {
  await assert.rejects(
    () => buildSnapshot(null, {
      ...sources,
      repositories: async () => { throw new Error("API outage"); },
    }, now),
    /Cannot initialize repositories/,
  );
});

test("invalid previously published snapshot cannot mask an outage", async () => {
  await assert.rejects(
    () => buildSnapshot({ version: 1, sections: { repositories: { items: [] } } }, {
      ...sources,
      open: async () => { throw new Error("API outage"); },
    }, now),
    /Cannot initialize open/,
  );
});
