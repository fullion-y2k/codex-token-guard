import fs from "node:fs/promises";
import path from "node:path";
import { sumTokens } from "./token-estimator.js";

export async function ensureOutputDir(cwd, config) {
  const outputPath = path.join(cwd, config.outputDir);
  await fs.mkdir(outputPath, { recursive: true });
  return outputPath;
}

export function buildScanSummary(files) {
  const active = files.filter((file) => !file.ignored);
  const ignored = files.filter((file) => file.ignored);
  const large = files.filter((file) => file.large);
  const secretLike = files.filter((file) => file.secretLike);
  const generated = files.filter((file) => file.generated);

  return {
    totalFiles: files.length,
    activeFiles: active.length,
    ignoredFiles: ignored.length,
    largeFiles: large,
    secretLikeFiles: secretLike,
    generatedFiles: generated,
    estimatedRepoTokens: sumTokens(active)
  };
}

export function renderScanReport(summary) {
  return [
    "# Scan Report",
    "",
    `Files scanned: ${summary.totalFiles}`,
    `Files after ignores: ${summary.activeFiles}`,
    `Ignored files: ${summary.ignoredFiles}`,
    `Estimated repository tokens: ${summary.estimatedRepoTokens}`,
    "",
    "## Large Files",
    "",
    renderFileList(summary.largeFiles),
    "",
    "## Secret-like Files",
    "",
    renderFileList(summary.secretLikeFiles),
    "",
    "## Generated Files",
    "",
    renderFileList(summary.generatedFiles)
  ].join("\n");
}

export function renderContextBrief({ task, selected, avoid, commands, repoTokens, selectedTokens }) {
  const avoidedTokens = Math.max(repoTokens - selectedTokens, 0);
  return [
    "# Codex Context Brief",
    "",
    "## Task",
    "",
    task,
    "",
    "## Recommended Scope",
    "",
    "Read these first:",
    renderFileList(selected),
    "",
    "## Avoid Unless Needed",
    "",
    renderFileList(avoid),
    "",
    "## Likely Commands",
    "",
    renderCommandList(commands),
    "",
    "## Token Budget",
    "",
    `Estimated selected context: ${selectedTokens} tokens`,
    `Estimated avoided context: ${avoidedTokens} tokens`,
    "",
    "These are local estimates, not exact Codex billing or internal usage.",
    "",
    "## Guardrails",
    "",
    "- Do not edit generated files.",
    "- Do not inspect large exports unless the task requires them.",
    "- Do not read secret-like files.",
    "",
    "## Suggested Prompt",
    "",
    "Read `.codex/context-brief.md` first. Start with the files listed under Recommended Scope. Avoid generated files, secret-like files, and large exports unless the task requires them. Fix the issue and run the listed verification commands."
  ].join("\n");
}

export function renderTokenReport({ files, selected, repoTokens, selectedTokens }) {
  const ignored = files.filter((file) => file.ignored);
  const large = files.filter((file) => file.large);
  const avoidedTokens = Math.max(repoTokens - selectedTokens, 0);

  return [
    "# Token Budget Report",
    "",
    `Repo files scanned: ${files.length}`,
    `Files ignored: ${ignored.length}`,
    `Large files detected: ${large.length}`,
    `Selected files: ${selected.length}`,
    "",
    `Estimated repo tokens: ${repoTokens}`,
    `Estimated selected tokens: ${selectedTokens}`,
    `Estimated avoided tokens: ${avoidedTokens}`,
    "",
    "These are local estimates, not exact Codex billing or internal usage."
  ].join("\n");
}

export function renderSuggestedPrompt() {
  return [
    "Please read `.codex/context-brief.md` first.",
    "Start with the files listed under Recommended Scope.",
    "Avoid generated files, secret-like files, and large exports unless the task requires them.",
    "Fix the issue and run the listed verification commands."
  ].join("\n");
}

export async function writeBriefFiles(cwd, config, payload) {
  const outputDir = await ensureOutputDir(cwd, config);
  await fs.writeFile(path.join(outputDir, "context-brief.md"), renderContextBrief(payload) + "\n", "utf8");
  await fs.writeFile(
    path.join(outputDir, "relevant-files.txt"),
    payload.selected.map((file) => file.path).join("\n") + "\n",
    "utf8"
  );
  await fs.writeFile(path.join(outputDir, "suggested-prompt.md"), renderSuggestedPrompt() + "\n", "utf8");
  await fs.writeFile(path.join(outputDir, "token-budget-report.md"), renderTokenReport(payload) + "\n", "utf8");
}

function renderFileList(files) {
  if (!files.length) {
    return "- None";
  }
  return files.map((file) => `- ${file.path}`).join("\n");
}

function renderCommandList(commands) {
  if (!commands.length) {
    return "- No likely commands detected";
  }
  return commands.map((command) => `- ${command}`).join("\n");
}
