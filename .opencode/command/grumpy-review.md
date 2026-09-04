---
description: "Review the working-tree diff. Returns a numbered request-changes list. No code."
---

Review the working-tree changes as the Grump.

Status: !`git status --short`
Unstaged: !`git diff`
Staged: !`git diff --cached`

Read the whole diff. Answer the ten checklist questions in writing, in order. Print the verdict block (GRUMP: APPROVE | REQUEST_CHANGES | BLOCK, then numbered file:line — what fails in production — smallest fix). Do not edit any file.
