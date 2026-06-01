import fs from "node:fs/promises";
import path from "node:path";
import { defaultConfig } from "./defaults.js";

const configFileName = ".codex-token-guard.json";

export async function loadConfig(cwd, overrides = {}) {
  const configPath = path.join(cwd, configFileName);
  let fileConfig = {};
  const cleanOverrides = stripUndefined(overrides);

  try {
    const raw = await fs.readFile(configPath, "utf8");
    fileConfig = JSON.parse(raw);
  } catch (error) {
    if (error.code !== "ENOENT") {
      throw new Error(`Invalid ${configFileName}: ${error.message}`);
    }
  }

  return {
    ...defaultConfig,
    ...fileConfig,
    ...cleanOverrides,
    ignore: mergeList(defaultConfig.ignore, fileConfig.ignore, cleanOverrides.ignore),
    alwaysInclude: mergeList(defaultConfig.alwaysInclude, fileConfig.alwaysInclude, cleanOverrides.alwaysInclude)
  };
}

export async function writeDefaultConfig(cwd, { force = false } = {}) {
  const configPath = path.join(cwd, configFileName);

  if (!force) {
    try {
      await fs.access(configPath);
      return { created: false, path: configPath };
    } catch (error) {
      if (error.code !== "ENOENT") {
        throw error;
      }
    }
  }

  await fs.writeFile(configPath, JSON.stringify(defaultConfig, null, 2) + "\n", "utf8");
  return { created: true, path: configPath };
}

async function readGitignore(cwd) {
  try {
    const raw = await fs.readFile(path.join(cwd, ".gitignore"), "utf8");
    return raw
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith("#") && !line.startsWith("!"));
  } catch (error) {
    if (error.code === "ENOENT") {
      return [];
    }
    throw error;
  }
}

export async function withGitignore(cwd, config) {
  const gitignore = await readGitignore(cwd);
  return {
    ...config,
    ignore: mergeList(config.ignore, gitignore)
  };
}

function mergeList(...lists) {
  return [...new Set(lists.flat().filter(Boolean))];
}

function stripUndefined(value) {
  return Object.fromEntries(Object.entries(value).filter(([, entry]) => entry !== undefined));
}
