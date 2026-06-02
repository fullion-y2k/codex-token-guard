# Maintenance Plan

This project uses Codex Automations and reviewable pull requests instead of direct pushes to `main`.

## Codex-Owned Recurring Maintenance

Recurring version upgrades are owned by Codex Automations. The automation should inspect the current codebase, run tests, apply a small safe maintenance improvement when appropriate, run `npm run version:weekly`, and open a pull request.

See [CODEX_AUTOMATION.md](CODEX_AUTOMATION.md) for the exact Codex Automation prompt.

## Temporary High-Frequency Campaign

For the June 3, 2026 Codex for Open Source application target, the repository can run a tri-daily Codex Automation.

Schedule:

- 09:00 Asia/Tokyo: documentation focus
- 15:00 Asia/Tokyo: quality focus
- 21:00 Asia/Tokyo: release focus

The automation should open a pull request when it finds meaningful changes. It can refresh maintenance status, example maintainer documentation, and run tests.

See [AUTOMATION.md](AUTOMATION.md) for workflow files, Codex Automation ownership, and review policy.

## Ongoing Maintenance

After the campaign, use the weekly Codex Automation for normal maintenance. GitHub scheduled workflows are disabled; manual fallback workflows remain available only for exceptional use.

## Review Policy

- Automated PRs must remain reviewable.
- No meaningless empty commits.
- No direct publish from scheduled automation.
- No claims of exact Codex token billing or internal usage.
