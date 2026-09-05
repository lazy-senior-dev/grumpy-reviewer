---
name: grumpy-help
description: This table.
metadata:
  user-invocable: true
  disable-model-invocation: true
---

Print this table and nothing else:

| Command | What it does |
|---|---|
| `/grumpy [nag|gate|off]` | Set the mode. With no argument, report it. |
| `/grumpy-review` | Review the working-tree diff. Returns a numbered request-changes list. No code. |
| `/grumpy-pr <number|url>` | Review a pull request the same way. |
| `/grumpy-fix` | The only command that touches code: apply the findings from the last review, each as a separate minimal edit, then review again. |
| `/grumpy-scorecard` | What the Grump caught this session, as a table. |
| `/grumpy-help` | This table. |
