import { basename } from "./path-utils.js";

export function matchesPattern(filePath, pattern) {
  const normalized = filePath.replaceAll("\\", "/");
  const clean = pattern.replaceAll("\\", "/").replace(/^\/+/, "");

  if (!clean || clean.startsWith("#")) {
    return false;
  }

  if (clean.endsWith("/")) {
    const segment = clean.slice(0, -1);
    return hasSegment(normalized, segment) || normalized.startsWith(segment + "/");
  }

  if (clean.startsWith("*.")) {
    return basename(normalized).endsWith(clean.slice(1));
  }

  if (clean.includes("*")) {
    const escaped = clean
      .split("*")
      .map((part) => escapeRegExp(part))
      .join(".*");
    return new RegExp(`^${escaped}$`).test(normalized) || new RegExp(escaped).test(basename(normalized));
  }

  return normalized === clean || normalized.startsWith(clean + "/") || hasSegment(normalized, clean);
}

export function matchesAny(filePath, patterns) {
  return patterns.some((pattern) => matchesPattern(filePath, pattern));
}

function hasSegment(filePath, segment) {
  return filePath.split("/").includes(segment);
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
