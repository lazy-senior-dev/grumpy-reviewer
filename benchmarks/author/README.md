Tasks are Python services; the checks look for the defect class in the added lines of the diff.

Any agent can be measured, not only the four with built-in adapters. Point `LSD_AGENT_CMD` at a command that reads the prompt on standard input and edits files in the working directory:

```sh
LSD_AGENT_CMD="my-agent --write" LSD_AGENT_LABEL="My agent" npm run bench:author -- --agents any
LSD_AGENT_CMD="my-agent --print" LSD_AGENT_LABEL="My agent" npm run bench -- --agents any
```

The first measures what the agent ships; the second measures how it reviews. Nothing else in the benchmark knows which agent it is talking to.

## What a sweep costs, and what it does not buy

Measured over 2,418 recorded runs across the three corpora: **565M tokens**, of which Claude Code
alone was 453M. Per run, by host:

| Host | tokens per run |
|---|---|
| Claude Code | 648k |
| Codex CLI | 164k |
| Antigravity CLI | 85k |

99% of that is input rather than output: the agent re-reads its context on every turn, and the gate
arm re-reads it again on each review round, which is why that arm alone costs 1,089k per run on
Claude against 421k for the unaided arm.

**Five runs per ticket buys precision, not conclusions.** Every published rate here was recomputed
using only runs 1 to 3. All nine host-and-corpus pairs reached the same conclusion — the same
ordering of arms, and the same answer to whether the gate came in under a generic prompt. The rates
move (one went from 27% to 44%) but nothing that is claimed from them changes. The last two runs of
five cost 40% of the tokens and changed no finding, so `--n` now defaults to 3. Pass `--n 5` when a
percentage rather than a direction is what is wanted.

**Claude is no longer in the default sweep.** It is the most expensive host by a factor of seven and
the least informative on this corpus, because it ships almost none of these defects unaided — there
is little for a reviewer to prevent. Its records are kept and published; new sweeps need
`--agents claude` to include it.

**All four arms stay.** Dropping the ruleset-without-gate arm would save a fifth of the remaining
cost and would collapse three distinct findings into one: across the nine pairs it is what separates
"the gate did it" (four), "the ruleset did it, the gate held the floor" (two) and "neither beat a
careful prompt" (three). That distinction is the difference between a benchmark and an
advertisement.

<!-- value:start -->
## Does it beat a prompt, and what does it cost?

Rates below divide by the tickets the agent actually **completed**, not by every attempt. A run
that wrote nothing cannot ship a defect, so the headline rate can flatter a host that finished
less work; this removes that.

| Agent | unaided | careful prompt | **with the gate** | beats the prompt | tickets finished |
|---|---|---|---|---|---|
| Antigravity CLI | 26 of 85 (31%) | 7 of 85 (8%) | **0 of 73 (0%)** | **yes** | 12 fewer (14%) |
| IBM Bob Shell | 16 of 55 (29%) | 4 of 55 (7%) | **0 of 53 (0%)** | **yes** | 2 fewer (4%) |
| Claude Code | 6 of 85 (7%) | 4 of 85 (5%) | **2 of 86 (2%)** | **yes** | none |

On 3 of the 3 hosts measured here the gate came in under a generic "be careful" prompt. The last column is the cost: where it is not "none", the agent finished fewer tickets with the gate loaded than without it, because a refused write is sometimes a write the agent then abandons. A ticket left undone is visible and recoverable; that is the trade, and it is the reader's to make rather than mine to hide.
<!-- value:end -->
