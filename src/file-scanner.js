import fs from "node:fs/promises";
import path from "node:path";
import { relativePosix } from "./path-utils.js";
import { estimateTokensFromBytes } from "./token-estimator.js";
import { classifyFile } from "./noise-detector.js";
import { matchesAny } from "./match.js";

export async function scanFiles(cwd, config) {
  const files = [];

  async function walk(dir) {
    let entries;
    try {
      entries = await fs.readdir(dir, { withFileTypes: true });
    } catch (error) {
      files.push({
        path: relativePosix(cwd, dir),
        size: 0,
        error: error.message,
        estimatedTokens: 0
      });
      return;
    }

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      const relative = relativePosix(cwd, fullPath);

      if (entry.isDirectory()) {
        if (matchesAny(relative, config.ignore)) {
          continue;
        }
        await walk(fullPath);
        continue;
      }

      if (!entry.isFile()) {
        continue;
      }

      let stat;
      try {
        stat = await fs.stat(fullPath);
      } catch (error) {
        files.push({
          path: relative,
          size: 0,
          error: error.message,
          estimatedTokens: 0
        });
        continue;
      }

      const file = classifyFile(
        {
          path: relative,
          fullPath,
          size: stat.size,
          estimatedTokens: estimateTokensFromBytes(stat.size)
        },
        config
      );
      files.push(file);
    }
  }

  await walk(cwd);
  return files;
}

export async function readFilePrefix(file, maxBytes) {
  if (file.secretLike || file.size <= 0) {
    return "";
  }

  try {
    const handle = await fs.open(file.fullPath, "r");
    const buffer = Buffer.alloc(Math.min(maxBytes, file.size));
    const result = await handle.read(buffer, 0, buffer.length, 0);
    await handle.close();
    return buffer.subarray(0, result.bytesRead).toString("utf8");
  } catch {
    return "";
  }
}
