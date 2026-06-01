# Maintenance Plan

This project uses reviewable automation instead of direct pushes to `main`.

## Temporary High-Frequency Campaign

For the June 3, 2026 Codex for Open Source application target, the repository can run a tri-daily maintenance workflow.

Schedule:

- 09:00 Asia/Tokyo: documentation focus
- 15:00 Asia/Tokyo: quality focus
- 21:00 Asia/Tokyo: release focus

The workflow opens or updates a pull request on `automation/tri-daily-maintenance`. It refreshes maintenance status, example maintainer documentation, and runs tests.

See [AUTOMATION.md](AUTOMATION.md) for workflow files, schedules, review policy, and campaign stop rules.

## Ongoing Maintenance

After the campaign, the workflow is configured to stop modifying files after the campaign end date unless manually forced. Weekly Dependabot and weekly version PR workflows remain available for normal maintenance.

## Review Policy

- Automated PRs must remain reviewable.
- No meaningless empty commits.
- No direct publish from scheduled automation.
- No claims of exact Codex token billing or internal usage.
