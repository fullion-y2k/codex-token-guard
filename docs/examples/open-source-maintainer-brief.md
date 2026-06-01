# Example: Open Source Maintainer Brief

This example shows how an open-source maintainer could use codex-token-guard before asking Codex to work on an issue.

## Maintainer Task

Fix a bug report about login validation without loading generated files, lockfiles, build output, or secret-like configuration.

## Command

```bash
codex-token-guard brief "fix login validation bug reported by users"
```

## Codex Prompt

```text
Read .codex/context-brief.md first.
Start with the Recommended Scope.
Avoid generated files, secret-like files, and large exports unless the task requires them.
Fix the issue and run the listed verification commands.
```

## Expected Maintainer Benefit

- Smaller initial context for Codex.
- Clear file boundaries for review.
- Fewer accidental reads of generated or sensitive files.
- Repeatable issue triage and PR review workflow.
