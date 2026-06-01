const synonyms = {
  auth: ["login", "signin", "session", "account", "user"],
  login: ["auth", "signin", "session", "credential"],
  validation: ["schema", "validator", "form", "input", "rules"],
  payment: ["billing", "stripe", "checkout", "invoice"],
  test: ["spec", "fixture", "mock"],
  api: ["route", "endpoint", "controller", "handler"],
  database: ["db", "migration", "schema", "model"]
};

export function extractKeywords(task) {
  const base = String(task)
    .toLowerCase()
    .split(/[^a-z0-9_/-]+/g)
    .map((word) => word.trim())
    .filter((word) => word.length > 2);

  const expanded = new Set(base);
  for (const word of base) {
    for (const related of synonyms[word] || []) {
      expanded.add(related);
    }
  }

  return [...expanded];
}
