# Maintenance Status

Last refreshed: 2026-06-02T13:08:16.558Z
Tokyo date: 2026-06-02
Campaign end date: 2026-06-03
Focus: docs

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
- Codex Desktop App Automations own recurring maintenance and version upgrades.
- Manual fallback workflows can refresh this status, example docs, and smoke-test the CLI.

## Automation Evidence

- Workflow: not available outside GitHub Actions
- Event: local
- Run: not available outside GitHub Actions
- Source commit: not available outside GitHub Actions
- Review branch: automation/campaign-maintenance
- Direct publish: disabled
- Direct scheduled pushes to main: disabled

## Campaign Rules

- GitHub Actions scheduled maintenance is disabled.
- Codex Desktop App Automations can run recurring campaign maintenance.
- Manual workflow dispatch can force a maintenance refresh if Codex Desktop App Automations are unavailable.
- Automated changes are proposed through pull requests for review.

## Current Focus

- Keep README and maintainer workflow documentation clear.
- Refresh examples for issue triage, PR review, and release maintenance.
- Keep public project messaging aligned with Codex context reduction.

