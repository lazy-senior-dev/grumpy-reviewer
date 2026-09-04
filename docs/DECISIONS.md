# Decisions and assumptions

One line each, in the order they were made. Anything a reader might reasonably have decided differently.

1. Built directly in the two clones under `~/01.Projects/lazy-senior-dev/`, so there is no tarball to unpack; `docs/SETUP.md` starts from the clones as they are.
2. The ruleset is markdown with a fixed heading set, parsed by `scripts/lib/ruleset.mjs`; no YAML front matter, so a human can read the source of truth as a document.
3. The `PreToolUse` gate finds the verdict by reading the session transcript the host provides; hosts that provide no transcript get a two-phase gate (first write to a file refused with the checklist, retry allowed) instead of a fake one.
4. In `gate` mode, a file that is denied twice without a verdict being found is let through with a note, so a transcript-format change can never brick a session.
5. `BLOCK` is denied in every mode except `off`; this is the "grumpy, not negligent" promise made mechanical.
6. `permissionDecision: "allow"` is never emitted; an allowed write goes back to the host's normal permission flow. The gate only ever adds context or denies.
7. Mode lives in `~/.config/grumpy-reviewer/config.json` (or `$XDG_CONFIG_HOME`); `GRUMPY_MODE` wins for one session; `GRUMPY_CONFIG_DIR` exists for tests.
8. Skill files call the hook scripts through `${CLAUDE_SKILL_DIR}/../../hooks/` because that variable is documented for skills; `${CLAUDE_PLUGIN_ROOT}` is used in `hooks.json` because that one is documented for hooks.
9. Codex reads the same `hooks/hooks.json` shape; its documentation does not name a plugin-root placeholder, so the shared file keeps `${CLAUDE_PLUGIN_ROOT}` and the portability table says so.
10. Copilot CLI hooks use relative paths from the plugin root, which is not documented; the documented alternative (`.github/hooks/*.json` in your own repo pointing at a clone) ships as `examples/copilot-repo-hooks.json`.
11. Gemini CLI hooks live in `settings.json`, not the extension, so the extension is instruction plus commands and `examples/gemini-settings-hooks.json` adds the gate.
12. Cursor, Kiro, and Devin CLI document blocking pre-tool hooks but not the full stdin schema; they ship instruction-only rather than a hook that might silently do nothing.
13. Antigravity CLI installs this repo with `agy plugin install <path>` (skills, commands, and hooks were imported and `/grumpy-help` ran); no public schema document was found, so the table cites the local test and version.
14. Gemini CLI could not be exercised on the build machine (the account tier is no longer served by Gemini CLI), so its adapter is verified against documentation only.
15. The Action posts inline findings as review comments and keeps one summary review; on re-runs it updates the summary in place when the review state can stay, and dismisses then replaces it when the state must change (gate mode flipping between REQUEST_CHANGES and approval).
16. The Action's OpenAI default model id (`gpt-5`) was not verified against a live account; set `model` explicitly when using `provider: openai`.
17. Benchmark arms all receive the identical ticket line and diff; the two non-Grump arms are asked for a `VERDICT: PASS|FAIL` last line so the same scorer applies to all three.
18. A finding counts as caught only if the reviewer flagged the change and named the defect's key terms (all regex groups in `match`); the file name is required only when the diff touches more than one file.
19. The Claude Code arm uses `--safe-mode` so the user's own plugins and CLAUDE.md do not leak into the baseline; the Codex arm uses `--ignore-user-config` for the same reason.
20. Antigravity is benchmarked with n=1 because a single call took 50 to 220 seconds on the build machine; the report labels its run count.
21. Codex is benchmarked on the CLI's default model because the CLI does not report the model name in its JSON events; the report says "codex-default" and records the CLI version.
22. Raw benchmark replies are committed (`benchmarks/results/raw/`) so every number can be re-derived; they are text, a few megabytes at most.
23. No `docs/CNAME` file is created because GitHub Pages treats its content as a domain; the instruction lives as a comment in `docs/index.html` and a step in `SETUP.md`.
24. `vhs` is not installed on the build machine and installing it pulls in ffmpeg; `docs/demo.tape` and the command ship, the GIF does not.
25. The README badge for npm is commented out until the package is published; the Trendshift slot is a comment.
26. The build machine's global git config signs with an RSA key and the folder-level config was not yet included from `~/.gitconfig`; `SETUP.md` step 1 adds the include and step 3 re-signs the whole history with the intended key.
27. No other project's rules, prompts, hook code, benchmark code, or examples were read into this repository; every file is original, and the README avoids comparisons with other projects by design.
