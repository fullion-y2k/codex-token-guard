import test from "node:test";
import assert from "node:assert/strict";
import { extractKeywords } from "../src/keyword.js";

test("extracts and expands task keywords", () => {
  const keywords = extractKeywords("fix login validation");
  assert.equal(keywords.includes("login"), true);
  assert.equal(keywords.includes("auth"), true);
  assert.equal(keywords.includes("schema"), true);
});
