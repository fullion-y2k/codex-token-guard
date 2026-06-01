# codex-token-guard detailed design

For the full public-project and Codex for Open Source application specification, see [SPECIFICATION.md](SPECIFICATION.md).

## Objective

`codex-token-guard` helps developers reduce wasted Codex context by generating a focused task brief before a coding session starts.

The tool scans a repository, filters noisy paths, estimates rough token size, scores files against a task description, detects likely verification commands, and writes a Codex-ready brief.

## Non-goals

- It does not control Codex directly.
- It does not measure exact OpenAI billing or internal Codex token usage.
- It does not upload repository contents to external services.
- It is not a full static analysis or security scanner.

## User workflow

```bash
codex-token-guard init
codex-token-guard scan
codex-token-guard brief "fix login validation"
```

The user then starts Codex with:

```text
Read .codex/context-brief.md first.
Start with the Recommended Scope.
Avoid generated files and large exports unless required.
```

## Commands

### init

Creates `.codex-token-guard.json` unless it already exists.

### scan

Scans the repository and prints:

- total files scanned
- ignored files
- large files
- secret-like files
- useful context files
- estimated repository tokens

With `--write`, also writes `.codex/scan-report.md`.

### estimate

Prints rough token estimates for the repository after configured ignores.

### brief

Scores files against a task and writes:

- `.codex/context-brief.md`
- `.codex/relevant-files.txt`
- `.codex/suggested-prompt.md`
- `.codex/token-budget-report.md`

## Configuration

`.codex-token-guard.json`:

```json
{
  "ignore": ["node_modules", ".git", "dist", "build", "coverage", ".next", "vendor", "package-lock.json"],
  "alwaysInclude": ["README.md", "AGENTS.md", "package.json", "pyproject.toml", "Cargo.toml"],
  "largeFileBytes": 500000,
  "maxBytesPerFile": 50000,
  "maxFilesInBrief": 20,
  "includeWorkflows": true,
  "outputDir": ".codex"
}
```

## File scanning

The scanner walks the workspace recursively and skips:

- configured ignored paths
- common generated directories
- common dependency directories
- `.gitignore` entries that can be handled by the built-in lightweight matcher

Each file receives metadata:

- path
- size
- extension
- ignored state
- large-file state
- noise state
- secret-like state
- rough token estimate

## Noise detection

Default noisy paths and extensions include:

- dependency folders: `node_modules`, `vendor`
- build output: `dist`, `build`, `.next`, `.nuxt`, `coverage`
- low-value artifacts: lockfiles, `*.snap`, `*.map`, `*.min.js`
- secret-like files: `.env`, `*.pem`, `*.key`, `credentials.json`, `secrets.*`

Secret-like files are never recommended as context.

## Relevance scoring

Inputs:

- task text
- file path
- file name
- file prefix text, up to `maxBytesPerFile`
- configured always-include files

Scoring:

```text
+100 alwaysInclude match
+80 task keyword in file name
+60 task keyword in path
+40 task keyword in file prefix
+30 related test/spec file
+20 package/config/workflow file
-80 noisy file
-100 large file
-100 secret-like file
```

## Token estimate

The first implementation uses a local rough estimate:

```text
estimatedTokens = ceil(characterCount / 4)
```

This is intentionally labeled as an estimate, not exact Codex usage.

## Command detection

Likely commands are detected from:

- `package.json`
- `pyproject.toml`
- `Cargo.toml`
- `go.mod`
- `Makefile`
- `.github/workflows/*.yml`

Examples:

- `npm test`
- `npm run lint`
- `npm run build`
- `pytest`
- `cargo test`
- `go test ./...`
- `make test`

## Automation design

GitHub automation is intentionally PR-based:

- CI validates pushes and pull requests.
- Dependabot opens weekly dependency and GitHub Actions update PRs.
- Weekly version workflow opens a patch-version PR.
- A temporary tri-daily maintenance workflow can refresh maintainer-facing docs and smoke-test the CLI before the June 3, 2026 Codex for Open Source application target.

The version workflow does not publish packages automatically. Release publishing can be added later after package ownership and npm permissions are confirmed.
