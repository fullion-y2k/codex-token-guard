# Maintenance Status

Last refreshed: 2026-06-02T01:18:17.557Z
Tokyo date: 2026-06-02
Campaign end date: 2026-06-03
Focus: docs

## Package

- Name: codex-token-guard
- Version: 0.1.0
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
- Run: https://github.com/fullion-y2k/codex-token-guard/actions/runs/26792330028
- Source commit: 17c52e713b3d301b462909e59f23a0119cdfbd83
- Review branch: automation/tri-daily-maintenance
- Direct publish: disabled
- Direct scheduled pushes to main: disabled

## Campaign Rules

- Scheduled updates run three times per day during the campaign.
- Scheduled file modifications stop after 2026-06-03.
- Manual workflow dispatch can force a maintenance refresh after the campaign.
- Automated changes are proposed through pull requests for review.

## Current Focus

- Keep README and maintainer workflow documentation clear.
- Refresh examples for issue triage, PR review, and release maintenance.
- Keep public project messaging aligned with Codex context reduction.

