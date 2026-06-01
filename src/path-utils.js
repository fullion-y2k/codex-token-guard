import path from "node:path";

export function toPosixPath(value) {
  return value.split(path.sep).join("/");
}

export function relativePosix(root, filePath) {
  return toPosixPath(path.relative(root, filePath));
}

export function basename(value) {
  return path.basename(value);
}

export function dirname(value) {
  return toPosixPath(path.dirname(value));
}
