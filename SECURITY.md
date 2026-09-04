# Security

## What this project touches

grumpy-reviewer runs inside your coding agent and, as a GitHub Action, inside your workflow. The hook scripts read the tool call the agent is about to make and the session transcript the host hands them, and they write a small config and scorecard under `~/.config/grumpy-reviewer/`. They open no network connections. The Action sends pull request diffs to the model provider you configured with your own key, and nothing else, nowhere else.

## Reporting a vulnerability

Use GitHub's private vulnerability reporting: **Security tab, "Report a vulnerability"** on this repository. Do not open a public issue for security problems.

You will get an acknowledgement within 72 hours and a fix or a clear answer within 14 days for anything that affects the hooks, the Action, or the adapters. Credit goes in the release notes unless you ask otherwise. Maintainer: [Sandeep Bazar](https://www.linkedin.com/in/sandeepbazar/).

## Scope

In scope: the hook scripts, the Action, the generated adapters, the benchmark runner, and this repository's workflows. Out of scope: the behaviour of the underlying model, and the agent hosts themselves, which have their own programmes.

## Supported versions

The latest minor release. Older releases get fixes only if the fix is trivial to backport.
