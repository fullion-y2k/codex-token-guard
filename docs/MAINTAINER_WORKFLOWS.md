# Maintainer Workflows

`codex-token-guard` is designed for open-source maintainers who use Codex for issue triage, pull request review, release preparation, and routine maintenance.

## Issue Triage

Before delegating an issue to Codex:

```bash
codex-token-guard brief "fix login validation bug reported in issue 123"
```

Use the generated `.codex/context-brief.md` as the first message or repository artifact for the Codex session.

## Pull Request Review

Before asking Codex to review a PR:

```bash
codex-token-guard brief "review pull request touching auth and session handling"
```

The generated brief helps keep review focused on likely relevant source, tests, and configuration rather than generated output.

## Release Maintenance

Before release cleanup:

```bash
codex-token-guard brief "prepare patch release and verify release notes"
```

The output can identify likely commands and files to inspect first.

## Guardrails

- Treat token counts as estimates only.
- Do not include secret-like files in Codex context.
- Prefer small, reviewable scopes.
- Use the generated brief to start work, not to skip human review.
