export const defaultConfig = {
  ignore: [
    "node_modules",
    ".git",
    "dist",
    "build",
    "coverage",
    ".next",
    ".nuxt",
    "vendor",
    "package-lock.json",
    "yarn.lock",
    "pnpm-lock.yaml",
    "bun.lockb"
  ],
  alwaysInclude: [
    "README.md",
    "AGENTS.md",
    "package.json",
    "pyproject.toml",
    "Cargo.toml",
    "go.mod",
    "Makefile"
  ],
  largeFileBytes: 500000,
  maxBytesPerFile: 50000,
  maxFilesInBrief: 20,
  includeWorkflows: true,
  outputDir: ".codex"
};

export const generatedPatterns = [
  "package-lock.json",
  "yarn.lock",
  "pnpm-lock.yaml",
  "bun.lockb",
  "*.lock",
  "*.snap",
  "*.map",
  "*.min.js",
  "*.generated.*",
  "*.gen.*"
];

export const secretPatterns = [
  ".env",
  ".env.*",
  "*.pem",
  "*.key",
  "id_rsa",
  "credentials.json",
  "secrets.*"
];
