#!/usr/bin/env node
import fs from "node:fs/promises";

const packagePath = new URL("../package.json", import.meta.url);
const changelogPath = new URL("../CHANGELOG.md", import.meta.url);

const pkg = JSON.parse(await fs.readFile(packagePath, "utf8"));
const nextVersion = incrementPatch(pkg.version);
pkg.version = nextVersion;

await fs.writeFile(packagePath, JSON.stringify(pkg, null, 2) + "\n", "utf8");

let changelog = "";
try {
  changelog = await fs.readFile(changelogPath, "utf8");
} catch {
  changelog = "# Changelog\n";
}

const date = process.env.WEEKLY_VERSION_DATE || formatDateInTokyo(new Date());
const entry = `\n## ${nextVersion} - ${date}\n\n- Weekly maintenance version bump.\n`;
const normalized = changelog.startsWith("# Changelog") ? changelog : `# Changelog\n\n${changelog}`;
const updated = normalized.replace(/^# Changelog\s*/, `# Changelog\n${entry}\n`);
await fs.writeFile(changelogPath, updated, "utf8");

console.log(`Bumped package version to ${nextVersion}`);

function incrementPatch(version) {
  const match = /^(\d+)\.(\d+)\.(\d+)(?:-.+)?$/.exec(version);
  if (!match) {
    throw new Error(`Unsupported semver version: ${version}`);
  }
  const major = Number(match[1]);
  const minor = Number(match[2]);
  const patch = Number(match[3]) + 1;
  return `${major}.${minor}.${patch}`;
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
