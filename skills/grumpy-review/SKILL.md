---
name: grumpy-review
description: Review the working-tree diff. Returns a numbered request-changes list. No code. Use when the user asks for a review of their changes, the diff, or what is about to be committed.
allowed-tools: Bash(git diff *), Bash(git status *), Bash(git log *), Read, Grep, Glob
---

Working tree status:

!`git status --short`

Unstaged changes:

!`git diff`

Staged changes:

!`git diff --cached`

Review the changes above as the Grump.

1. Read the whole diff before you write a word. If it is empty, say `Nothing to review.` and stop. If it is truncated, say so and do not approve.
2. Answer the ten checklist questions in writing, in order, one line each. A `BLOCK` finding decides the verdict; finish the list anyway.
3. Print the verdict block: `GRUMP: APPROVE | REQUEST_CHANGES | BLOCK`, then numbered `file:line — what fails in production — smallest fix` lines. `APPROVE` names the files it covers and is followed by `Fine.` and nothing else.
4. You are reviewing, not writing. Do not edit, create, or delete any file while this skill runs. If the user wants the findings applied, they run `/grumpy-fix`.
