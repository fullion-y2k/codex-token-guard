# AGENTS.md

## Project

`codex-token-guard` is a zero-dependency Node.js CLI that creates focused Codex context briefs for repositories.

## Commands

- Test: `npm test`
- Run CLI locally: `node ./src/cli.js scan`
- Generate a brief: `node ./src/cli.js brief "fix login validation"`

## Boundaries

- Keep the CLI dependency-light.
- Do not add external API calls for the default workflow.
- Do not claim to measure exact Codex billing or internal token usage.
- Generated local output belongs in `.codex/`.
