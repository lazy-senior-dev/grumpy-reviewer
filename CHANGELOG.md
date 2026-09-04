# Changelog

All notable changes to grumpy-reviewer. The format follows Keep a Changelog; versions follow semver.

## [0.1.0] - 2026-09-04

First release.

### Added

- `rules/grump.md`: the character, the ten-question checklist with its stop rule, the fixed verdict block, the non-negotiables, and the three modes.
- Claude Code plugin with a `UserPromptSubmit` hook that injects the reviewer and a `PreToolUse` gate that reads the agent's own verdict and denies writes on `BLOCK` (every mode) or `REQUEST_CHANGES` (gate mode).
- Slash commands: `/grumpy`, `/grumpy-review`, `/grumpy-pr`, `/grumpy-fix`, `/grumpy-scorecard`, `/grumpy-help`.
- Generated adapters for Codex, GitHub Copilot CLI, Gemini CLI, OpenCode, Cursor, Windsurf, Cline, Kiro, OpenClaw, Devin, Qoder, Antigravity, and a plain `AGENTS.md`.
- GitHub Action that posts one review with inline findings, updates it on re-runs, and handles forks and rate limits.
- Benchmark: 30 seeded and 10 clean diffs, a resumable runner for headless agents, a tested scorer, and a report generator.
- Project site, launch kit, contribution templates, CI with adapter staleness, manifest, and attribution checks.
