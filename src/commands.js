import fs from "node:fs/promises";
import path from "node:path";
import { writeDefaultConfig, loadConfig, withGitignore } from "./config.js";
import { scanFiles } from "./file-scanner.js";
import { scoreFiles } from "./relevance-scorer.js";
import { detectCommands } from "./command-detector.js";
import { buildScanSummary, ensureOutputDir, renderScanReport, writeBriefFiles } from "./reports.js";
import { sumTokens } from "./token-estimator.js";

export async function initCommand(cwd, options) {
  const result = await writeDefaultConfig(cwd, { force: options.force });
  if (result.created) {
    console.log(`Created ${path.relative(cwd, result.path)}`);
  } else {
    console.log(".codex-token-guard.json already exists. Use --force to overwrite.");
  }
}

export async function scanCommand(cwd, options) {
  const config = await withGitignore(cwd, await loadConfig(cwd));
  const files = await scanFiles(cwd, config);
  const summary = buildScanSummary(files);

  if (options.json) {
    console.log(JSON.stringify(summary, null, 2));
  } else {
    console.log(renderScanReport(summary));
  }

  if (options.write) {
    const outputDir = await ensureOutputDir(cwd, config);
    await fs.writeFile(path.join(outputDir, "scan-report.md"), renderScanReport(summary) + "\n", "utf8");
  }
}

export async function estimateCommand(cwd, options) {
  const config = await withGitignore(cwd, await loadConfig(cwd));
  const files = await scanFiles(cwd, config);
  const active = files.filter((file) => !file.ignored && !file.secretLike);
  const payload = {
    filesScanned: files.length,
    filesEstimated: active.length,
    estimatedTokens: sumTokens(active),
    note: "Local estimate only. This is not exact Codex billing or internal usage."
  };

  if (options.json) {
    console.log(JSON.stringify(payload, null, 2));
  } else {
    console.log(`Files scanned: ${payload.filesScanned}`);
    console.log(`Files estimated: ${payload.filesEstimated}`);
    console.log(`Estimated tokens: ${payload.estimatedTokens}`);
    console.log(payload.note);
  }
}

export async function briefCommand(cwd, task, options) {
  if (!task) {
    throw new Error("Missing task. Example: codex-token-guard brief \"fix login validation\"");
  }

  const config = await withGitignore(
    cwd,
    await loadConfig(cwd, {
      maxFilesInBrief: options.maxFiles ? Number(options.maxFiles) : undefined
    })
  );
  const files = await scanFiles(cwd, config);
  const active = files.filter((file) => !file.ignored && !file.secretLike);
  const scored = await scoreFiles(active, task, config);
  const selected = scored.filter((file) => file.score > 0 && !file.noisy).slice(0, config.maxFilesInBrief);
  const avoid = files.filter((file) => file.noisy || file.secretLike).slice(0, 30);
  const commands = await detectCommands(cwd);
  const repoTokens = sumTokens(active);
  const selectedTokens = sumTokens(selected);
  const payload = { task, files, selected, avoid, commands, repoTokens, selectedTokens };

  await writeBriefFiles(cwd, config, payload);

  if (options.json) {
    console.log(
      JSON.stringify(
        {
          outputDir: config.outputDir,
          selected: selected.map((file) => ({
            path: file.path,
            score: file.score,
            reasons: file.reasons
          })),
          selectedTokens,
          repoTokens
        },
        null,
        2
      )
    );
  } else {
    console.log(`Wrote ${config.outputDir}/context-brief.md`);
    console.log(`Selected files: ${selected.length}`);
    console.log(`Estimated selected tokens: ${selectedTokens}`);
  }
}
