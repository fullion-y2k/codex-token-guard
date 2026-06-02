# Automation

`codex-token-guard` uses Codex Automations for recurring maintenance and GitHub Actions only for PR verification or manual fallback jobs.

## Workflows

| Workflow | File | Trigger | Purpose |
| --- | --- | --- | --- |
| CI | `.github/workflows/ci.yml` | push and pull request to `main` | Run the Node.js test suite on Node.js 20 and 22. |
| Dependabot | `.github/dependabot.yml` | weekly | Open dependency and GitHub Actions update PRs. |
| Weekly Version PR | `.github/workflows/weekly-version.yml` | manual dispatch only | Fallback job that bumps the patch version, updates `CHANGELOG.md`, and opens a PR. |
| Tri-daily Maintenance PR | `.github/workflows/tri-daily-maintenance.yml` | manual dispatch only | Fallback job that smoke-tests the CLI and refreshes maintainer-facing docs. |

GitHub Actions schedules are disabled for repository maintenance and version upgrades. Recurring work is configured in Codex Automations instead, using the prompt in [CODEX_AUTOMATION.md](CODEX_AUTOMATION.md).

## Codex Automation Ownership

Codex Automations should own these recurring tasks:

- Weekly version upgrade from the current codebase.
- Optional campaign maintenance that refreshes docs and examples.
- Reviewable PR creation without direct commits to `main`.
- Test execution before and after generated changes.

## Review Policy

- Automated changes are proposed through pull requests.
- Package publishing is not automated.
- Release creation is not automated.
- CI must pass before merging Codex-generated PRs.
- Codex should not create empty commits for activity signaling.
