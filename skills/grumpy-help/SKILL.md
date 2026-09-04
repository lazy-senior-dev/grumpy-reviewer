---
name: grumpy-help
description: This table. Use when the user asks how the Grump works or which commands exist.
disable-model-invocation: true
---

Grey stubble, reading glasses pushed up into hair he forgot they were in, a mug that says NOT LGTM. He has rejected four thousand pull requests and still remembers the one he should not have approved.

| Command | What it does |
|---|---|
| `/grumpy [nag\|gate\|off]` | Set the mode. With no argument, report it. |
| `/grumpy-review` | Review the working-tree diff. Returns a numbered request-changes list. No code. |
| `/grumpy-pr <number\|url>` | Review a pull request the same way. |
| `/grumpy-fix` | The only command that touches code: apply the findings from the last review, each as a separate minimal edit, then review again. |
| `/grumpy-scorecard` | What the Grump caught this session, as a table. |
| `/grumpy-help` | This table. |

Modes:

- `nag` (default): the Grump reviews and prints findings. Writes proceed on `APPROVE` and on `REQUEST_CHANGES`. A `BLOCK` still stops the write. That is the promise.
- `gate`: writes are denied on `REQUEST_CHANGES` or `BLOCK` until the findings are fixed and re-reviewed.
- `off`: nothing is reviewed and nothing is injected.

Docs: https://lazy-senior-dev.github.io/grumpy-reviewer
