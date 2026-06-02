# Codex Automation Playbook

This repository uses Codex Desktop App Automations for recurring maintenance. GitHub Actions schedules are disabled so recurring version upgrades are performed by Codex against the current local codebase and returned as reviewable work.

Codex Desktop App Automations are configured in the Codex Desktop app's Automations pane, not in Codex Cloud and not by a repository YAML file. Keep this document as the source prompt for the Desktop automation.

## Desktop App Registration

Register these as Codex Desktop App Automations:

- Project: `C:\Users\y2kpu\Documents\Codex\2026-06-01\githumco`
- Repository: `fullion-y2k/codex-token-guard`
- Run mode: new background worktree for Git repositories
- Output: reviewable pull request to `main`
- Sandbox: workspace-write, with network/GitHub access only when PR creation requires it
- Model and reasoning: leave defaults unless the automation output is too slow or too broad

Do not register these as Codex Cloud tasks. The Codex Desktop app must be running and the project must remain available on disk for project-scoped automations.

## Weekly Version Upgrade Automation

Schedule:

- Every Monday at 00:00 Asia/Tokyo.

Automation prompt:

```text
Every Monday at 00:00 Asia/Tokyo, use Codex Desktop App Automation to work in the local fullion-y2k/codex-token-guard repository at C:\Users\y2kpu\Documents\Codex\2026-06-01\githumco.

Goal:
Create a reviewable weekly version upgrade based on the existing codebase.

Rules:
- Read AGENTS.md, README.md, docs/AUTOMATION.md, docs/SPECIFICATION.md, package.json, CHANGELOG.md, scripts/weekly-version-bump.js, and the tests before editing.
- Do not push directly to main.
- Do not publish npm packages.
- Do not create a GitHub release.
- Do not create empty commits only for activity.
- Keep changes small and reviewable.

Steps:
1. Create a branch named codex/weekly-version-upgrade-YYYYMMDD.
2. Run npm test.
3. Inspect the current source, tests, README, and docs for a small useful maintenance improvement.
4. If a real maintenance improvement is safe, implement it with focused tests or docs.
5. Run npm run version:weekly to bump the patch version and update CHANGELOG.md.
6. Run npm test again.
7. Commit the changes with the message chore: weekly Codex version upgrade.
8. Open a pull request to main.
9. In the PR body, include the files changed, test result, version before and after, and any remaining risk.

If the repository is not in a state where a version upgrade is safe, stop and report the blocker instead of forcing a commit.
```

## Campaign Maintenance Automation

The earlier GitHub Actions schedule is disabled. For the application campaign, create a separate temporary Codex Desktop App Automation that runs four times per day through 2026-06-03 23:59 Asia/Tokyo.

- 09:00 Asia/Tokyo: documentation focus
- 12:00 Asia/Tokyo: example and maintainer workflow focus
- 15:00 Asia/Tokyo: quality focus
- 21:00 Asia/Tokyo: release focus

Prompt:

```text
Until 2026-06-03 23:59 Asia/Tokyo, use Codex Desktop App Automation to return to the local fullion-y2k/codex-token-guard repository at C:\Users\y2kpu\Documents\Codex\2026-06-01\githumco four times per day at 09:00, 12:00, 15:00, and 21:00 Asia/Tokyo and perform one focused maintenance pass.

Use the focus for this run:
- 09:00 Asia/Tokyo: docs
- 12:00 Asia/Tokyo: examples
- 15:00 Asia/Tokyo: quality
- 21:00 Asia/Tokyo: release

Run npm test, refresh only useful docs, examples, or maintainer workflow notes, run npm test again, and open a reviewable PR if there are meaningful changes. Do not push directly to main, do not publish, and do not create empty commits. After 2026-06-03 23:59 Asia/Tokyo, stop this campaign automation and leave the weekly version automation as the ongoing maintenance path.
```

## Manual Fallback

The GitHub workflow files remain as manual fallbacks only:

- `.github/workflows/weekly-version.yml`
- `.github/workflows/campaign-maintenance.yml`

They have no `schedule` trigger. Use them only if Codex Desktop App Automations are unavailable.
