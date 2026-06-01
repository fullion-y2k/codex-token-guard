#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const docsDir = new URL("../docs/", import.meta.url);
const examplesDir = new URL("../docs/examples/", import.meta.url);

const focus = process.env.MAINTENANCE_FOCUS || "docs";
const endDate = process.env.MAINTENANCE_CAMPAIGN_END_DATE || "";
const now = new Date(process.env.MAINTENANCE_TIMESTAMP || Date.now());
const tokyoDate = formatDateInTokyo(now);
const runMetadata = resolveRunMetadata();

if (endDate && tokyoDate > endDate && process.env.FORCE_MAINTENANCE !== "1") {
  console.log(`Maintenance campaign ended on ${endDate}. No files updated.`);
  process.exit(0);
}

await fs.mkdir(docsDir, { recursive: true });
await fs.mkdir(examplesDir, { recursive: true });

const pkg = JSON.parse(await fs.readFile(new URL("../package.json", import.meta.url), "utf8"));
const sourceFiles = await listFiles(new URL("../src/", import.meta.url));
const testFiles = await listFiles(new URL("../test/", import.meta.url));

await fs.writeFile(
  new URL("../docs/MAINTENANCE_STATUS.md", import.meta.url),
  renderMaintenanceStatus({ pkg, sourceFiles, testFiles, focus, now, tokyoDate, endDate, runMetadata }),
  "utf8"
);

await fs.writeFile(
  new URL("../docs/examples/open-source-maintainer-brief.md", import.meta.url),
  renderMaintainerBriefExample(pkg, focus),
  "utf8"
);

console.log(`Refreshed maintenance assets for focus: ${focus}`);

async function listFiles(directoryUrl) {
  const directoryPath = fileURLToPath(directoryUrl);
  const files = [];

  async function walk(currentPath) {
    let entries;
    try {
      entries = await fs.readdir(currentPath, { withFileTypes: true });
    } catch {
      return;
    }

    for (const entry of entries) {
      const fullPath = path.join(currentPath, entry.name);
      if (entry.isDirectory()) {
        await walk(fullPath);
      } else if (entry.isFile()) {
        files.push(path.relative(root, fullPath).replaceAll("\\", "/"));
      }
    }
  }

  await walk(directoryPath);
  return files.sort();
}

function renderMaintenanceStatus({ pkg, sourceFiles, testFiles, focus, now, tokyoDate, endDate, runMetadata }) {
  return `# Maintenance Status

Last refreshed: ${now.toISOString()}
Tokyo date: ${tokyoDate}
Campaign end date: ${endDate || "not set"}
Focus: ${focus}

## Package

- Name: ${pkg.name}
- Version: ${pkg.version}
- Runtime: Node.js ${pkg.engines?.node || "not specified"}
- License: ${pkg.license}

## Current Surface

- Source files: ${sourceFiles.length}
- Test files: ${testFiles.length}
- CLI commands: init, scan, estimate, brief
- Default output directory: .codex

## Maintenance Checks

- CI runs the Node.js test suite on pull requests and pushes.
- Dependabot checks npm and GitHub Actions updates weekly.
- Tri-daily maintenance refreshes this status, example docs, and smoke-tests the CLI until the campaign end date.

## Automation Evidence

- Workflow: ${runMetadata.workflow}
- Event: ${runMetadata.eventName}
- Run: ${runMetadata.runUrl}
- Source commit: ${runMetadata.sha}
- Review branch: ${runMetadata.branch}
- Direct publish: disabled
- Direct scheduled pushes to main: disabled

## Campaign Rules

- Scheduled updates run three times per day during the campaign.
- Scheduled file modifications stop after ${endDate || "the configured campaign end date"}.
- Manual workflow dispatch can force a maintenance refresh after the campaign.
- Automated changes are proposed through pull requests for review.

## Current Focus

${renderFocus(focus)}
`;
}

function renderFocus(value) {
  if (value === "quality") {
    return "- Keep tests passing.\n- Check relevance scoring behavior.\n- Confirm generated and secret-like files remain excluded.\n";
  }
  if (value === "release") {
    return "- Keep release notes current.\n- Check package metadata for npm readiness.\n- Confirm automation opens reviewable pull requests instead of direct pushes.\n";
  }
  return "- Keep README and maintainer workflow documentation clear.\n- Refresh examples for issue triage, PR review, and release maintenance.\n- Keep public project messaging aligned with Codex context reduction.\n";
}

function renderMaintainerBriefExample(pkg, focus) {
  const scenario = scenarioForFocus(focus);
  return `# Example: Open Source Maintainer Brief

This example shows how an open-source maintainer could use ${pkg.name} before asking Codex to work on an issue.

## Maintainer Task

${scenario.task}

## Command

\`\`\`bash
codex-token-guard brief "${scenario.commandTask}"
\`\`\`

## Codex Prompt

\`\`\`text
Read .codex/context-brief.md first.
Start with the Recommended Scope.
Avoid generated files, secret-like files, and large exports unless the task requires them.
Fix the issue and run the listed verification commands.
\`\`\`

## Expected Maintainer Benefit

${scenario.benefits.map((item) => `- ${item}`).join("\n")}
`;
}

function scenarioForFocus(value) {
  if (value === "quality") {
    return {
      task: "Investigate a failing relevance-scoring test without loading generated snapshots, build output, or secret-like configuration.",
      commandTask: "investigate failing relevance scoring test",
      benefits: [
        "Smaller initial context for test debugging.",
        "Clear separation between source files and generated artifacts.",
        "Focused validation commands for maintainers.",
        "Repeatable quality checks before asking Codex to edit code."
      ]
    };
  }

  if (value === "release") {
    return {
      task: "Prepare release maintenance notes while keeping Codex focused on package metadata, changelog entries, and public documentation.",
      commandTask: "prepare release maintenance notes",
      benefits: [
        "Smaller release-maintenance context for Codex.",
        "Clear file boundaries around changelog, README, and package metadata.",
        "Lower risk of reading unrelated repository history.",
        "Reviewable release preparation workflow."
      ]
    };
  }

  return {
    task: "Fix a bug report about login validation without loading generated files, lockfiles, build output, or secret-like configuration.",
    commandTask: "fix login validation bug reported by users",
    benefits: [
      "Smaller initial context for Codex.",
      "Clear file boundaries for review.",
      "Fewer accidental reads of generated or sensitive files.",
      "Repeatable issue triage and PR review workflow."
    ]
  };
}

function formatDateInTokyo(value) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).formatToParts(value);
  const map = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${map.year}-${map.month}-${map.day}`;
}

function resolveRunMetadata() {
  const repository = process.env.GITHUB_REPOSITORY || "";
  const runId = process.env.GITHUB_RUN_ID || "";
  const runUrl =
    process.env.MAINTENANCE_RUN_URL ||
    (repository && runId
      ? `https://github.com/${repository}/actions/runs/${runId}`
      : "not available outside GitHub Actions");

  return {
    workflow: process.env.GITHUB_WORKFLOW || "not available outside GitHub Actions",
    eventName: process.env.GITHUB_EVENT_NAME || "local",
    runUrl,
    sha: process.env.GITHUB_SHA || "not available outside GitHub Actions",
    branch: process.env.MAINTENANCE_BRANCH || "automation/tri-daily-maintenance"
  };
}
