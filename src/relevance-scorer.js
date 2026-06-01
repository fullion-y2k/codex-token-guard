import path from "node:path";
import { extractKeywords } from "./keyword.js";
import { readFilePrefix } from "./file-scanner.js";
import { matchesAny } from "./match.js";

export async function scoreFiles(files, task, config) {
  const keywords = extractKeywords(task);
  const scored = [];

  for (const file of files) {
    if (file.ignored || file.secretLike) {
      continue;
    }

    const prefix = file.noisy ? "" : await readFilePrefix(file, config.maxBytesPerFile);
    const lowerPath = file.path.toLowerCase();
    const lowerName = path.basename(file.path).toLowerCase();
    const lowerPrefix = prefix.toLowerCase();
    let score = 0;
    const reasons = [];

    if (matchesAny(file.path, config.alwaysInclude)) {
      score += 100;
      reasons.push("always include");
    }

    if (config.includeWorkflows && lowerPath.startsWith(".github/workflows/")) {
      score += 20;
      reasons.push("workflow");
    }

    if (isConfigFile(lowerName)) {
      score += 20;
      reasons.push("config");
    }

    for (const keyword of keywords) {
      if (lowerName.includes(keyword)) {
        score += 80;
        reasons.push(`name:${keyword}`);
      } else if (lowerPath.includes(keyword)) {
        score += 60;
        reasons.push(`path:${keyword}`);
      } else if (lowerPrefix.includes(keyword)) {
        score += 40;
        reasons.push(`content:${keyword}`);
      }
    }

    if (/(test|spec|fixture|mock)/.test(lowerPath) && keywords.some((keyword) => lowerPath.includes(keyword))) {
      score += 30;
      reasons.push("related test");
    }

    if (file.generated) {
      score -= 80;
      reasons.push("generated");
    }

    if (file.large) {
      score -= 100;
      reasons.push("large");
    }

    scored.push({ ...file, score, reasons });
  }

  return scored.sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    return a.size - b.size;
  });
}

function isConfigFile(name) {
  return [
    "package.json",
    "pyproject.toml",
    "cargo.toml",
    "go.mod",
    "makefile",
    "agents.md",
    "readme.md"
  ].includes(name);
}
