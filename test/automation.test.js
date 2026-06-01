import assert from "node:assert/strict";
import fs from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

test("CI workflow matches the automation specification", async () => {
  const workflow = await read(".github/workflows/ci.yml");

  assert.match(workflow, /push:\s*\n\s*branches:\s*\[main\]/);
  assert.match(workflow, /pull_request:\s*\n\s*branches:\s*\[main\]/);
  assert.match(workflow, /node-version:\s*\[20,\s*22\]/);
  assert.match(workflow, /npm test/);
});

test("tri-daily maintenance is PR-based and campaign-limited", async () => {
  const workflow = await read(".github/workflows/tri-daily-maintenance.yml");

  assert.match(workflow, /09:00, 15:00, and 21:00 Asia\/Tokyo/);
  assert.match(workflow, /GitHub Actions cron is UTC/);
  assert.match(workflow, /cron:\s*"0 0 \* \* \*"/);
  assert.match(workflow, /cron:\s*"0 6 \* \* \*"/);
  assert.match(workflow, /cron:\s*"0 12 \* \* \*"/);
  assert.match(workflow, /"0 0 \* \* \*"\) focus="docs"/);
  assert.match(workflow, /"0 6 \* \* \*"\) focus="quality"/);
  assert.match(workflow, /"0 12 \* \* \*"\) focus="release"/);
  assert.match(workflow, /MAINTENANCE_CAMPAIGN_END_DATE:\s*"2026-06-03"/);
  assert.match(workflow, /peter-evans\/create-pull-request@v8/);
  assert.match(workflow, /branch:\s*automation\/tri-daily-maintenance/);
  assert.match(workflow, /add-paths:\s*\|[\s\S]*docs\/MAINTENANCE_STATUS\.md/);
  assert.doesNotMatch(workflow, /git push[\s\S]*main/);
});

test("weekly version automation opens a reviewable PR", async () => {
  const workflow = await read(".github/workflows/weekly-version.yml");

  assert.match(workflow, /Monday 00:00 Asia\/Tokyo/);
  assert.match(workflow, /GitHub Actions cron is UTC/);
  assert.match(workflow, /cron:\s*"0 15 \* \* 0"/);
  assert.match(workflow, /npm run version:weekly/);
  assert.match(workflow, /peter-evans\/create-pull-request@v8/);
  assert.match(workflow, /branch:\s*automation\/weekly-version/);
  assert.match(workflow, /add-paths:\s*\|[\s\S]*package\.json[\s\S]*CHANGELOG\.md/);
  assert.doesNotMatch(workflow, /npm publish|gh release create/);
});

test("dependabot checks npm and GitHub Actions weekly", async () => {
  const config = await read(".github/dependabot.yml");

  assert.match(config, /package-ecosystem:\s*"npm"/);
  assert.match(config, /package-ecosystem:\s*"github-actions"/);
  assert.match(config, /interval:\s*"weekly"/);
  assert.match(config, /timezone:\s*"Asia\/Tokyo"/);
});

async function read(relativePath) {
  return fs.readFile(new URL(relativePath, root), "utf8");
}
