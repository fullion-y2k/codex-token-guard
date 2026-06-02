# Codex Automation Playbook

This repository uses Codex Automations for recurring maintenance. GitHub Actions schedules are disabled so recurring version upgrades are performed by Codex against the current codebase and returned as reviewable work.

Codex Automations are configured in the Codex app or account UI, not by a repository YAML file. Keep this document as the source prompt for the automation.

## Weekly Version Upgrade

Schedule:

- Every Monday at 00:00 Asia/Tokyo.

Automation prompt:

```text
Every Monday at 00:00 Asia/Tokyo, work in the fullion-y2k/codex-token-guard repository.

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

## Campaign Maintenance

The earlier tri-daily GitHub Actions schedule is disabled. If high-frequency maintenance is still needed in Codex, create a separate temporary Codex Automation with this schedule:

- 09:00 Asia/Tokyo: documentation focus
- 15:00 Asia/Tokyo: quality focus
- 21:00 Asia/Tokyo: release focus

Prompt:

```text
During the Codex for Open Source application campaign, return to the fullion-y2k/codex-token-guard repository and perform one focused maintenance pass.

Use the focus for this run:
- 09:00 Asia/Tokyo: docs
- 15:00 Asia/Tokyo: quality
- 21:00 Asia/Tokyo: release

Run npm test, refresh only useful docs or examples, run npm test again, and open a reviewable PR if there are meaningful changes. Do not push directly to main, do not publish, and do not create empty commits.
```

## Manual Fallback

The GitHub workflow files remain as manual fallbacks only:

- `.github/workflows/weekly-version.yml`
- `.github/workflows/tri-daily-maintenance.yml`

They have no `schedule` trigger. Use them only if Codex Automations are unavailable.
