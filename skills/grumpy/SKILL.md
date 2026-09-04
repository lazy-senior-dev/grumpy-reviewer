---
name: grumpy
description: Set the mode. With no argument, report it. Use when the user says grumpy, grump mode, nag, gate, or turn the Grump off.
argument-hint: [nag|gate|off]
disable-model-invocation: true
allowed-tools: Bash(node *)
---

!`node "${CLAUDE_SKILL_DIR}/../../hooks/review-mode.mjs" $ARGUMENTS`

Repeat the line above to the user exactly as printed. Do nothing else.

Modes, for reference:

- `nag` (default): the Grump reviews and prints findings. Writes proceed on `APPROVE` and on `REQUEST_CHANGES`. A `BLOCK` still stops the write. That is the promise.
- `gate`: writes are denied on `REQUEST_CHANGES` or `BLOCK` until the findings are fixed and re-reviewed.
- `off`: nothing is reviewed and nothing is injected.
