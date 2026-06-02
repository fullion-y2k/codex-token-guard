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

test("campaign maintenance is PR-based and campaign-limited", async () => {
  const workflow = await read(".github/workflows/campaign-maintenance.yml");

  assert.match(workflow, /workflow_dispatch:/);
  assert.doesNotMatch(workflow, /^\s*schedule:/m);
  assert.doesNotMatch(workflow, /cron:/);
  assert.match(workflow, /docs/);
  assert.match(workflow, /quality/);
  assert.match(workflow, /release/);
  assert.match(workflow, /MAINTENANCE_CAMPAIGN_END_DATE:\s*"2026-06-03"/);
  assert.match(workflow, /peter-evans\/create-pull-request@v8/);
  assert.match(workflow, /branch:\s*automation\/campaign-maintenance/);
  assert.match(workflow, /add-paths:\s*\|[\s\S]*docs\/MAINTENANCE_STATUS\.md/);
  assert.match(workflow, /Recurring maintenance is owned by Codex Automations/);
  assert.doesNotMatch(workflow, /git push[\s\S]*main/);
});

test("weekly version automation opens a reviewable PR", async () => {
  const workflow = await read(".github/workflows/weekly-version.yml");

  assert.match(workflow, /workflow_dispatch:/);
  assert.doesNotMatch(workflow, /^\s*schedule:/m);
  assert.doesNotMatch(workflow, /cron:/);
  assert.match(workflow, /npm run version:weekly/);
  assert.match(workflow, /peter-evans\/create-pull-request@v8/);
  assert.match(workflow, /branch:\s*automation\/weekly-version/);
  assert.match(workflow, /add-paths:\s*\|[\s\S]*package\.json[\s\S]*CHANGELOG\.md/);
  assert.match(workflow, /Recurring version upgrades are owned by Codex Automations/);
  assert.doesNotMatch(workflow, /npm publish|gh release create/);
});

test("Codex Automation playbook owns recurring version upgrades", async () => {
  const doc = await read("docs/CODEX_AUTOMATION.md");
  const automation = await read("docs/AUTOMATION.md");

  assert.match(doc, /Codex Desktop App Automations/);
  assert.match(doc, /not in Codex Cloud/);
  assert.match(doc, /C:\\Users\\y2kpu\\Documents\\Codex\\2026-06-01\\githumco/);
  assert.match(doc, /Every Monday at 00:00 Asia\/Tokyo/);
  assert.match(doc, /npm run version:weekly/);
  assert.match(doc, /Do not push directly to main/);
  assert.match(doc, /Open a pull request to main/);
  assert.match(doc, /four times per day at 09:00, 12:00, 15:00, and 21:00 Asia\/Tokyo/);
  assert.match(doc, /After 2026-06-03 23:59 Asia\/Tokyo, stop this campaign automation/);
  assert.match(automation, /GitHub Actions schedules are disabled/);
  assert.match(automation, /Recurring work is configured in Codex Desktop App Automations/);
  assert.match(automation, /not Codex Cloud tasks/);
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
