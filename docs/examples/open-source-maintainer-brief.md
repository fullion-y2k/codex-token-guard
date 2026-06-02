# Example: Open Source Maintainer Brief

This example shows how an open-source maintainer could use codex-token-guard before asking Codex to work on an issue.

## Maintainer Task

Investigate a failing relevance-scoring test without loading generated snapshots, build output, or secret-like configuration.

## Command

```bash
codex-token-guard brief "investigate failing relevance scoring test"
```

## Codex Prompt

```text
Read .codex/context-brief.md first.
Start with the Recommended Scope.
Avoid generated files, secret-like files, and large exports unless the task requires them.
Fix the issue and run the listed verification commands.
```

## Expected Maintainer Benefit

- Smaller initial context for test debugging.
- Clear separation between source files and generated artifacts.
- Focused validation commands for maintainers.
- Repeatable quality checks before asking Codex to edit code.
