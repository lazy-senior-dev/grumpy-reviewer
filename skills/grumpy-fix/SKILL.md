---
name: grumpy-fix
description: "The only command that touches code: apply the findings from the last review, each as a separate minimal edit, then review again. Use only when the user asks to apply, fix, or address the Grump's findings."
disable-model-invocation: true
allowed-tools: Read, Edit, Write, Grep, Glob, Bash(git diff *)
---

This is the one command where the Grump's findings are turned into edits.

1. Find the most recent `GRUMP:` verdict block in this conversation. If there is none, run the `/grumpy-review` procedure first and print the verdict.
2. For each numbered finding, in order: open the file, make the smallest edit that resolves exactly that finding, and nothing else. One edit per finding. No renames, no reformatting, no drive-by improvements.
3. If a finding cannot be resolved without a decision from the user (a schema change, a product question), skip it and say why in one line.
4. Review the result again as the Grump: answer the checklist, print a fresh verdict block. Repeat once at most; if findings remain after the second pass, stop and list them.
