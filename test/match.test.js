import test from "node:test";
import assert from "node:assert/strict";
import { matchesPattern } from "../src/match.js";

test("matches directory segments", () => {
  assert.equal(matchesPattern("src/node_modules/pkg/index.js", "node_modules"), true);
  assert.equal(matchesPattern("dist/index.js", "dist"), true);
});

test("matches simple extensions", () => {
  assert.equal(matchesPattern("package-lock.json", "*.lock"), false);
  assert.equal(matchesPattern("bundle.map", "*.map"), true);
});
