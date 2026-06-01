# codex-token-guard

Reduce wasted Codex context before you start a coding session.

`codex-token-guard` scans a repository, detects noisy files, estimates rough context size, and writes a small Codex-ready brief with recommended files, likely commands, and guardrails.

It does not measure OpenAI billing or Codex's internal token usage. It gives a practical local estimate so you can start Codex with a tighter scope.

## Why

Large repositories often contain generated files, build output, snapshots, lockfiles, exports, coverage folders, and old docs. Asking Codex to "look at the whole repo" can waste context and make the task harder to steer.

For open-source maintainers, this is useful before issue triage, pull request review, release maintenance, and security-sensitive cleanup.

This tool creates a focused task brief:

```text
.codex/context-brief.md
.codex/relevant-files.txt
.codex/suggested-prompt.md
.codex/token-budget-report.md
```

## Install

Use directly with npm once published:

```bash
npx codex-token-guard brief "fix login validation"
```

For local development:

```bash
npm install
npm test
node ./src/cli.js scan
```

## Commands

```bash
codex-token-guard init
codex-token-guard scan
codex-token-guard scan --write
codex-token-guard estimate
codex-token-guard brief "fix login validation"
```

## Automation

The repository uses PR-based automation for CI, Dependabot, weekly version bumps, and temporary tri-daily maintenance before the June 3, 2026 Codex for Open Source application target.

See [docs/AUTOMATION.md](docs/AUTOMATION.md) for schedules and review rules.

## Example

```bash
codex-token-guard brief "fix login validation"
```

Then ask Codex:

```text
Read .codex/context-brief.md first.
Start with the files listed under Recommended Scope.
Avoid generated files and large exports unless the task requires them.
Fix the issue and run the listed verification commands.
```

## Configuration

Create `.codex-token-guard.json`:

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

## Automation

This repository includes:

- CI on pull requests and pushes.
- Dependabot weekly dependency and GitHub Actions update checks.
- A weekly version PR workflow that bumps the patch version and updates `CHANGELOG.md`.
- A temporary tri-daily maintenance workflow for the June 3, 2026 Codex for Open Source application campaign.

The weekly version workflow opens a pull request instead of committing directly to `main`.

See [Specification](docs/SPECIFICATION.md), [Maintainer Workflows](docs/MAINTAINER_WORKFLOWS.md), and [Maintenance Plan](docs/MAINTENANCE_PLAN.md).

## Roadmap

- Better language-specific relevance scoring.
- JSON output for CI integrations.
- GitHub Action mode for posting context reports to pull requests.
- `AGENTS.md` generation support.

## License

MIT
