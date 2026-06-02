# Maintenance Status

Last refreshed: 2026-06-02T07:32:09.187Z
Tokyo date: 2026-06-02
Campaign end date: 2026-06-03
Focus: quality

## Package

- Name: codex-token-guard
- Version: 0.1.1
- Runtime: Node.js >=20
- License: MIT

## Current Surface

- Source files: 13
- Test files: 3
- CLI commands: init, scan, estimate, brief
- Default output directory: .codex

## Maintenance Checks

- CI runs the Node.js test suite on pull requests and pushes.
- Dependabot checks npm and GitHub Actions updates weekly.
- Tri-daily maintenance refreshes this status, example docs, and smoke-tests the CLI until the campaign end date.

## Automation Evidence

- Workflow: Tri-daily Maintenance PR
- Event: schedule
- Run: https://github.com/fullion-y2k/codex-token-guard/actions/runs/26805315657
- Source commit: 0bbe82c1fe3fd4723a505059b869075a51d53b85
- Review branch: automation/tri-daily-maintenance
- Direct publish: disabled
- Direct scheduled pushes to main: disabled

## Campaign Rules

- Scheduled updates run three times per day during the campaign.
- Scheduled file modifications stop after 2026-06-03.
- Manual workflow dispatch can force a maintenance refresh after the campaign.
- Automated changes are proposed through pull requests for review.

## Current Focus

- Keep tests passing.
- Check relevance scoring behavior.
- Confirm generated and secret-like files remain excluded.

