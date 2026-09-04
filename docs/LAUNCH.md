# Launch kit

## Show HN

**Title:** Show HN: Grumpy-reviewer – a staff-engineer persona that blocks your AI agent's bad writes

**Text (about 120 words):**

At 2 a.m. an agent shipped me a `/me` endpoint that read `user_id` from the request body. Any logged-in user could read any profile. The agent was fast, polite, and wrong, and nothing between it and my branch asked a single question.

grumpy-reviewer is that question, asked ten times. It installs into Claude Code, Codex, Copilot CLI and others as a plugin, injects a reviewer persona every turn, and a PreToolUse hook reads the agent's own verdict before each write: BLOCK denies, REQUEST_CHANGES denies in gate mode, APPROVE goes through. He never writes code. He approves with one word.

It also runs as a GitHub Action. Benchmark: 30 seeded defects, three agents, with and without him; raw replies are in the repo. MIT.

## X / LinkedIn

Your AI agent writes code faster than anyone can read it. Nobody reviews it before it lands.

Meet the Grump: a staff-engineer persona for Claude Code, Codex, Copilot CLI and friends. Ten questions, one verdict, and a hook that denies the write when the answer is BLOCK. He never writes code. He approves with one word: Fine.

Benchmark with and without him, on three agents, raw replies included. MIT.

https://github.com/lazy-senior-dev/grumpy-reviewer

## Terminal GIF

`docs/demo.tape` records the demo with [vhs](https://github.com/charmbracelet/vhs):

```
brew install vhs
npm run gif        # writes assets/demo.gif
```

Then add `![demo](assets/demo.gif)` under the before/after section of the README.

## Launch checklist

1. `docs/SETUP.md` done end to end: history re-signed, both repos pushed, Pages live, ruleset on, `v0.1.0` tagged.
2. Enable Discussions on the repo (Settings, Features) and pin a "What did he catch?" thread.
3. Turn on private vulnerability reporting (Settings, Security).
4. Run the benchmark once more on launch morning if a model changed; regenerate the chart.
5. Post Show HN between 8 and 10 a.m. US Eastern on a weekday. Reply to every comment for the first three hours; the Grump's voice is for code, not for people.
6. Post on X and LinkedIn an hour after HN, linking the HN thread.
