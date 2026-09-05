# Changelog

All notable changes to grumpy-reviewer. The format follows Keep a Changelog; versions follow semver.

## [0.2.0] - 2026-09-05

### Added

- Model Context Protocol server (`mcp/server.mjs`, `grumpy mcp`): five tools, no dependencies, protocol revision negotiated against a declared list, every tool annotated read-only. `grumpy_review_brief` returns the change, the ruleset and the verdict format so the calling client's own model does the review, with no API key and no agent installed. `grumpy_parse_verdict` declares an output schema and returns structured content, so a script can gate on the level rather than on prose.
- House rules: a repository or an organisation commits `.grumpy/policy.md` and the hook, the CLI, the MCP server and the Action all read it. House rules add findings and raise verdicts; they can never waive a non-negotiable.
- A blocking gate on Cursor, which now documents `preToolUse`, `beforeShellExecution` and a permission response (`examples/cursor-hooks.json`).
- A skill for GitHub Copilot code review at `.github/skills/grumpy-reviewer/SKILL.md`.
- Author tier in the benchmark: the agent writes the change itself, with arms for the ticket alone, a generic care prompt, the persona card, and the persona's gate refusing the write until the findings are fixed. Scored by fixed checks written before any run.
- `failClosed` in `.grumpy.json`, the user config, or `GRUMPY_FAIL_CLOSED`, for a repository that would rather keep denying than let a write through after repeated attempts.
- Supply chain: a container image on GHCR with a bill of materials, build provenance, a vulnerability gate and a keyless signature; a CycloneDX bill of materials attested on every release; MCP Registry and npm publishing from CI through OIDC, with no stored token.
- `LSD_AGENT_CMD` runs the benchmarks against any agent that is not one of the four with built-in adapters.

### Changed

- Every arm of the review benchmark is scored on the cases all arms completed, so a host that errors on one case cannot make another arm look better by answering a smaller set.
- The CLI prints from the last verdict header down, for hosts that narrate the whole checklist first.
- Recording cards drop the cost figure, which had no unit a reader could act on, and a legend explains the rest.

## [0.1.0] - 2026-09-04

First release. Licensed under Apache-2.0.

### Added

- `rules/grump.md`: the character, the ten-question checklist with its stop rule, the fixed verdict block, the non-negotiables, and the three modes.
- Claude Code plugin with a `UserPromptSubmit` hook that injects the reviewer and a `PreToolUse` gate that reads the agent's own verdict and denies writes on `BLOCK` (every mode) or `REQUEST_CHANGES` (gate mode).
- Slash commands: `/grumpy`, `/grumpy-review`, `/grumpy-pr`, `/grumpy-fix`, `/grumpy-scorecard`, `/grumpy-help`.
- Generated adapters for Codex, GitHub Copilot CLI, IBM Bob, Gemini CLI, Antigravity, OpenCode, Cursor, Windsurf, Cline, Kiro, OpenClaw, Devin, Qoder, and a plain `AGENTS.md`.
- `grumpy` CLI: `review`, `pr`, `install <host>`, `uninstall <host>`; runs with any headless agent you already have.
- GitHub Action that posts one review with inline findings, updates it on re-runs, and handles forks and rate limits.
- Benchmark: 30 seeded and 10 clean diffs, a resumable runner for headless agents, a tested scorer, and a report generator.
- Project site, launch kit, contribution templates, CI with adapter staleness, manifest, and attribution checks.
