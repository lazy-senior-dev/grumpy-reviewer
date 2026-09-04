---
name: grumpy-scorecard
description: What the Grump caught this session, as a table. Use when the user asks what the Grump caught, blocked, or let through.
disable-model-invocation: true
allowed-tools: Bash(node *)
---

!`node "${CLAUDE_SKILL_DIR}/../../hooks/grumpy-scorecard.mjs" ${CLAUDE_SESSION_ID}`

Show the tables above to the user unchanged. Below them, add one line naming the number of overrides and what they were for, or `No overrides.`
