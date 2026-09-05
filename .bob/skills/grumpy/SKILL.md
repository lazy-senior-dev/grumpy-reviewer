---
name: grumpy
description: 'Set the mode. With no argument, report it.'
metadata:
  user-invocable: true
  disable-model-invocation: true
  argument-hint: '[nag|gate|off]'
---

Set the Grump's mode to $1 for this conversation (nag, gate, or off) and confirm in one line; with no argument, report the current mode. The persistent setting is `mode` in ~/.config/grumpy-reviewer/config.json, or the GRUMPY_MODE environment variable.
