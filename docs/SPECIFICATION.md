# codex-token-guard Specification

Version: 0.1 draft  
Target public repository: `codex-token-guard`  
Target application date: June 3, 2026  
Primary audience: open-source maintainers using Codex

## 1. Project Summary

`codex-token-guard` is a local-first CLI for reducing wasted Codex context during open-source maintenance work.

The tool scans a repository, excludes low-value or risky files, estimates rough context size, scores files against a maintainer task, detects likely verification commands, and writes a small Codex-ready context brief.

The project is designed to be published on GitHub as a public open-source repository and used as supporting evidence for a Codex for Open Source application.

## 2. Problem Statement

Open-source maintainers frequently ask Codex to help with:

- issue triage
- bug fixes
- pull request review
- release cleanup
- documentation updates
- security-sensitive maintenance

Large repositories often contain files that waste context or increase review risk:

- generated files
- dependency folders
- build outputs
- coverage reports
- lockfiles
- snapshots
- large exports
- secret-like files
- old design notes

Asking Codex to inspect an entire repository can increase token usage, slow the task, and make the resulting change harder to review.

## 3. Goals

The project must:

- create focused Codex context briefs before a session starts
- recommend a small set of files to inspect first
- list files and directories to avoid unless needed
- estimate context size locally
- detect likely validation commands
- protect secret-like files from being recommended
- work without external API calls by default
- be usable from GitHub-hosted open-source repositories
- support a public, reviewable maintenance workflow

## 4. Non-goals

The project must not:

- claim to measure exact Codex billing
- claim to measure exact Codex internal token usage
- call OpenAI APIs by default
- upload repository contents to external services
- directly control Codex
- directly push scheduled changes to `main`
- create meaningless empty commits for activity signaling

## 5. Core User Workflow

The maintainer runs:

```bash
codex-token-guard brief "fix login validation bug reported by users"
```

The CLI writes:

```text
.codex/context-brief.md
.codex/relevant-files.txt
.codex/suggested-prompt.md
.codex/token-budget-report.md
```

The maintainer then starts Codex with:

```text
Read .codex/context-brief.md first.
Start with the files listed under Recommended Scope.
Avoid generated files, secret-like files, and large exports unless the task requires them.
Fix the issue and run the listed verification commands.
```

## 6. CLI Commands

### 6.1 `init`

Creates `.codex-token-guard.json`.

Rules:

- do not overwrite existing config by default
- allow overwrite with `--force`

Example:

```bash
codex-token-guard init
codex-token-guard init --force
```

### 6.2 `scan`

Scans the repository and prints a markdown report.

Output includes:

- total files scanned
- files after ignore filters
- ignored file count
- large files
- generated files
- secret-like files
- rough repository token estimate

Options:

```bash
codex-token-guard scan --write
codex-token-guard scan --json
```

`--write` writes `.codex/scan-report.md`.

### 6.3 `estimate`

Prints a rough token estimate for the repository after ignore rules.

Example:

```bash
codex-token-guard estimate
codex-token-guard estimate --json
```

The output must clearly state that estimates are local approximations, not exact Codex billing.

### 6.4 `brief`

Generates the Codex context pack for a task.

Example:

```bash
codex-token-guard brief "review pull request touching auth and sessions"
```

Options:

```bash
codex-token-guard brief "..." --max-files 12
codex-token-guard brief "..." --json
```

## 7. Configuration

Config file:

```text
.codex-token-guard.json
```

Default shape:

```json
{
  "ignore": [
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
  "alwaysInclude": [
    "README.md",
    "AGENTS.md",
    "package.json",
    "pyproject.toml",
    "Cargo.toml",
    "go.mod",
    "Makefile"
  ],
  "largeFileBytes": 500000,
  "maxBytesPerFile": 50000,
  "maxFilesInBrief": 20,
  "includeWorkflows": true,
  "outputDir": ".codex"
}
```

Config precedence:

1. CLI arguments
2. `.codex-token-guard.json`
3. defaults
4. `.gitignore` additions

## 8. File Classification

Each scanned file receives metadata:

- path
- size
- rough token estimate
- ignored
- generated
- secret-like
- large
- noisy

### 8.1 Ignored Paths

Default ignored paths include:

- `node_modules`
- `.git`
- `dist`
- `build`
- `coverage`
- `.next`
- `.nuxt`
- `vendor`
- common lockfiles

### 8.2 Generated or Low-value Files

Generated or low-value patterns include:

- `package-lock.json`
- `yarn.lock`
- `pnpm-lock.yaml`
- `bun.lockb`
- `*.snap`
- `*.map`
- `*.min.js`
- `*.generated.*`
- `*.gen.*`

### 8.3 Secret-like Files

Secret-like patterns include:

- `.env`
- `.env.*`
- `*.pem`
- `*.key`
- `id_rsa`
- `credentials.json`
- `secrets.*`

Secret-like files must never be recommended in `Recommended Scope`.

## 9. Relevance Scoring

Inputs:

- task text
- file name
- file path
- file prefix up to `maxBytesPerFile`
- always-include list
- workflow/config file detection

Scoring model:

```text
+100 alwaysInclude match
+80 task keyword in file name
+60 task keyword in path
+40 task keyword in file prefix
+30 related test/spec file
+20 package/config/workflow file
-80 generated file
-100 large file
-100 secret-like file
```

Selected files:

- must have positive score
- must not be ignored
- must not be secret-like
- must not be noisy in the MVP
- capped by `maxFilesInBrief`

## 10. Token Estimation

MVP formula:

```text
estimatedTokens = ceil(characterCount / 4)
```

For files that are not read in full:

```text
estimatedTokens = ceil(fileSizeBytes / 4)
```

Required disclaimer:

```text
These are local estimates, not exact Codex billing or internal usage.
```

## 11. Command Detection

The CLI detects likely commands from:

- `package.json`
- `pyproject.toml`
- `Cargo.toml`
- `go.mod`
- `Makefile`
- `.github/workflows/*.yml` in future versions

Examples:

- `npm test`
- `npm run lint`
- `npm run build`
- `pytest`
- `cargo test`
- `go test ./...`
- `make test`

## 12. Output Files

### 12.1 `context-brief.md`

Sections:

- Task
- Recommended Scope
- Avoid Unless Needed
- Likely Commands
- Token Budget
- Guardrails
- Suggested Prompt

### 12.2 `relevant-files.txt`

Plain file list for scripts, editor integrations, or manual copy.

### 12.3 `suggested-prompt.md`

Short prompt that the maintainer can paste into Codex.

### 12.4 `token-budget-report.md`

Summary of scanned, ignored, selected, and avoided context estimates.

## 13. Public Repository Requirements

The GitHub repository must be public before applying to Codex for Open Source.

Required files:

- `README.md`
- `LICENSE`
- `CONTRIBUTING.md`
- `SECURITY.md`
- `AGENTS.md`
- `docs/DESIGN.md`
- `docs/SPECIFICATION.md`
- `docs/MAINTAINER_WORKFLOWS.md`
- `docs/CODEX_FOR_OSS_APPLICATION_ASSESSMENT.md`
- `.github/workflows/ci.yml`
- `.github/workflows/tri-daily-maintenance.yml`
- `.github/workflows/weekly-version.yml`
- `.github/dependabot.yml`
- issue templates
- pull request template

## 14. Automation Requirements

All automation must use pull requests. Scheduled workflows must not push directly to `main`.

### 14.1 CI

Workflow:

```text
.github/workflows/ci.yml
```

Triggers:

- push to `main`
- pull request to `main`

Checks:

- Node.js 20
- Node.js 22
- `npm test`

### 14.2 Dependabot

Config:

```text
.github/dependabot.yml
```

Schedule:

- weekly npm checks
- weekly GitHub Actions checks

### 14.3 Weekly Version PR

Workflow:

```text
.github/workflows/weekly-version.yml
```

Purpose:

- bump patch version
- update `CHANGELOG.md`
- open a reviewable pull request

Schedule:

- Monday 00:00 Asia/Tokyo

### 14.4 Tri-daily Maintenance PR

Workflow:

```text
.github/workflows/tri-daily-maintenance.yml
```

Temporary campaign target:

- June 1, 2026 through June 3, 2026

Schedule:

- 09:00 Asia/Tokyo: documentation focus
- 15:00 Asia/Tokyo: quality focus
- 21:00 Asia/Tokyo: release focus

Actions:

- run `npm test`
- run CLI smoke test with `brief`
- refresh `docs/MAINTENANCE_STATUS.md`
- refresh `docs/examples/open-source-maintainer-brief.md`
- open or update a PR on `automation/tri-daily-maintenance`

Campaign stop rule:

- scheduled file modifications stop after `2026-06-03`
- manual `workflow_dispatch` can force a run after that date

Review policy:

- one reviewable branch
- no empty activity commits
- no direct publishing
- no direct pushes to `main`

## 15. Codex for Open Source Application Positioning

The repository should be positioned as:

```text
A maintainer tool that reduces wasted Codex context during OSS issue triage, pull request review, and release maintenance.
```

Recommended application emphasis:

- primary maintainer role
- public repository
- active maintenance workflow
- Codex-specific maintainer utility
- no external data upload by default
- API credits would support benchmark examples, maintainer automation, and Codex workflow testing

Suggested short qualification text:

```text
codex-token-guard helps open-source maintainers reduce wasted Codex context during issue triage, PR review, and release maintenance. It generates focused context briefs, avoids generated/secret/large files, and makes Codex workflows cheaper and easier to review.
```

Suggested API-credit usage text:

```text
I will use API credits to test Codex-assisted maintainer workflows: issue-to-brief generation, PR review context reduction, release maintenance automation, and benchmark examples across real open-source repositories.
```

## 16. Release Plan

### 16.1 Before June 3, 2026

Required:

- publish repository on GitHub
- confirm repository visibility is public
- confirm GitHub profile visibility is public
- verify CI passes
- run tri-daily maintenance workflow at least once
- create `v0.1.0` release if possible
- prepare Codex for Open Source application text

Optional but useful:

- publish npm package
- add a screenshot or terminal output example
- add first GitHub issues for roadmap items

### 16.2 After Application

Recommended:

- reduce maintenance workflow frequency or keep it no-op after campaign end
- continue normal weekly Dependabot and version PRs
- prioritize real issues and usage examples
- avoid artificial commit churn

## 17. Acceptance Criteria

The MVP is acceptable when:

- `codex-token-guard --help` or no-arg help displays usage
- `init` writes config
- `scan` reports ignored, large, generated, and secret-like files
- `estimate` reports a rough token estimate
- `brief` writes all four `.codex` output files
- secret-like files are excluded from recommendations
- README clearly explains that token counts are estimates
- GitHub Actions are PR-based
- tri-daily maintenance is configured for June 3, 2026 application preparation

## 18. Risks

### Artificial activity risk

High-frequency automation can look like noise if it only changes timestamps.

Mitigation:

- keep automation transparent
- create reviewable PRs
- stop modifications after the campaign end date
- use real docs, examples, and tests

### Token estimate accuracy risk

The MVP estimate is intentionally rough.

Mitigation:

- label all estimates clearly
- avoid billing claims
- consider tokenizer integration later

### Security risk

Repository scans can accidentally include sensitive files.

Mitigation:

- secret-like files are excluded by default
- do not upload file contents
- include security policy

### GitHub automation risk

Scheduled workflows can fail or be delayed.

Mitigation:

- include `workflow_dispatch`
- keep workflow simple
- use pull requests rather than direct pushes

## 19. Future Versions

Planned improvements:

- JSON output for CI
- richer `.gitignore` matching
- better language-specific scoring
- monorepo package detection
- GitHub Action mode
- benchmark fixture repositories
- optional tokenizer-backed estimates
- `AGENTS.md` generation helper
