# Automation

`codex-token-guard` uses reviewable GitHub automation. Scheduled workflows must open pull requests instead of pushing directly to `main`.

## Workflows

| Workflow | File | Trigger | Purpose |
| --- | --- | --- | --- |
| CI | `.github/workflows/ci.yml` | push and pull request to `main` | Run the Node.js test suite on Node.js 20 and 22. |
| Dependabot | `.github/dependabot.yml` | weekly | Open dependency and GitHub Actions update PRs. |
| Weekly Version PR | `.github/workflows/weekly-version.yml` | Monday 00:00 Asia/Tokyo or manual dispatch | Bump the patch version, update `CHANGELOG.md`, and open a PR. |
| Tri-daily Maintenance PR | `.github/workflows/tri-daily-maintenance.yml` | 09:00, 15:00, and 21:00 Asia/Tokyo or manual dispatch | Smoke-test the CLI and refresh maintainer-facing docs during the application campaign. |

GitHub Actions stores scheduled workflow times as UTC cron expressions. The workflow comments document the intended Asia/Tokyo schedule beside the UTC cron values.

## Campaign Rules

The tri-daily workflow is temporary for the June 3, 2026 Codex for Open Source application target.

- Scheduled modifications stop after `2026-06-03`.
- Manual dispatch can force a refresh after the campaign if needed.
- The workflow updates `automation/tri-daily-maintenance`.
- The workflow only adds the maintenance status and example brief files to its PR.
- It does not create empty commits for activity signaling.

## Review Policy

- Automated changes are proposed through pull requests.
- Package publishing is not automated.
- Release creation is not automated.
- The generated maintenance status includes workflow run evidence.
- CI must pass before merging automation PRs.
