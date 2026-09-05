---
name: grumpy-pr
description: Review a pull request the same way.
metadata:
  user-invocable: true
  disable-model-invocation: true
  argument-hint: <number-or-url>
---

Run `gh pr view $1` and `gh pr diff $1`, then review the pull request as the Grump: read the whole diff, answer the ten checklist questions in writing, print the verdict block. Do not edit any file and do not post to the pull request.
