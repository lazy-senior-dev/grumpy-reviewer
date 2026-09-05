<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://lazy-senior-dev.github.io/assets/hero/grumpy-reviewer-dark.svg">
    <source media="(prefers-color-scheme: light)" srcset="https://lazy-senior-dev.github.io/assets/hero/grumpy-reviewer-light.svg">
    <img src="https://lazy-senior-dev.github.io/assets/hero/grumpy-reviewer-light.svg" alt="An agent's change flows through the Grump, who refuses the write until the findings are fixed, so the branch stays clean." width="880">
  </picture>
</p>

<h1 align="center">grumpy-reviewer</h1>

<p align="center"><em>Show me where it breaks.</em></p>

<p align="center">
  <strong>Star us&nbsp;❤️&nbsp;→</strong>&nbsp;<a href="https://github.com/lazy-senior-dev/grumpy-reviewer" title="Star grumpy-reviewer on GitHub"><picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://lazy-senior-dev.github.io/assets/hero/star-dark.svg">
    <source media="(prefers-color-scheme: light)" srcset="https://lazy-senior-dev.github.io/assets/hero/star-light.svg">
    <img src="https://lazy-senior-dev.github.io/assets/hero/star-light.svg" alt="Star this repository on GitHub" width="132" height="34" align="middle">
  </picture></a>
</p>

<p align="center"><strong>Site:</strong> <a href="https://lazy-senior-dev.github.io/grumpy-reviewer/">lazy-senior-dev.github.io/grumpy-reviewer</a> · <strong>The cast:</strong> <a href="https://lazy-senior-dev.github.io/">lazy-senior-dev.github.io</a></p>

<p align="center">
  <a href="https://github.com/lazy-senior-dev/grumpy-reviewer"><img alt="GitHub stars" src="https://img.shields.io/github/stars/lazy-senior-dev/grumpy-reviewer?style=flat&color=1f1f1f"></a>
  <a href="CHANGELOG.md"><img alt="Version 0.1.0" src="https://img.shields.io/badge/version-0.1.0-1f1f1f"></a>
  <img alt="Works with 14 agents" src="https://img.shields.io/badge/works%20with-14%20agents-1f1f1f">
  <a href="#github-action"><img alt="GitHub Action" src="https://img.shields.io/badge/GitHub%20Action-v1-1f1f1f"></a>
  <a href="https://scorecard.dev/viewer/?uri=github.com/lazy-senior-dev/grumpy-reviewer"><img alt="OpenSSF Scorecard" src="https://api.scorecard.dev/projects/github.com/lazy-senior-dev/grumpy-reviewer/badge"></a>
  <a href="LICENSE"><img alt="Apache-2.0" src="https://img.shields.io/badge/license-Apache--2.0-1f1f1f"></a>
  <!-- npm badge once published: <a href="https://www.npmjs.com/package/grumpy-reviewer"><img alt="npm" src="https://img.shields.io/npm/v/grumpy-reviewer?style=flat&color=1f1f1f"></a> -->
  <!-- Trendshift badge slot: <a href="https://trendshift.io/repositories/XXXXX"><img src="https://trendshift.io/api/badge/repositories/XXXXX" alt="trendshift" height="55"></a> -->
</p>

<!-- hero:start -->
Every AI code reviewer waits for the pull request. By then the code is written, the branch is yours, and you are the one reading it.

The Grump reads the change **before your agent is allowed to write it**, and refuses the write until it is right. Your agent's own rules file cannot do this. Anthropic's documentation is blunt about it: a rules file is *"context, not enforced configuration… To block an action regardless of what Claude decides, use a PreToolUse hook instead."* That hook is what this repository is.

```sh
npx github:lazy-senior-dev/grumpy-reviewer review          # any repository, any agent you already have. Installs nothing.
```

```
/plugin marketplace add lazy-senior-dev/grumpy-reviewer
/plugin install grumpy-reviewer@lazy-senior-dev
```

Works with 14 coding agents from one ruleset, any MCP client, and a GitHub Action. Apache-2.0, no dependencies, no service, no account. The diff goes to the agent you already trust and nowhere else.
<!-- hero:end -->

<!-- bench:author:start -->
## The number that matters: what ships

**When the agent is the author, the Grump changes what ships.** On IBM Bob Shell (`bob-default`), given 18 tickets that each invite a classic defect, the agent alone shipped the defect in 8 of 36 runs (22%), 3 of 36 with a generic "be careful" prompt (8%), and 1 of 36 with the Grump installed, where he refuses the write until the findings are fixed (3%). A task the agent declined or solved another way counts as clean. The shipped code is scored by fixed checks written before any run, never by a model. Each task was run 2 times per arm; [method, per-task table, raw diffs](benchmarks/results/author).

| Agent | Model | Arm | Made the change | Shipped the defect | Self-reviewed | Median time |
|---|---|---|---|---|---|---|
| IBM Bob Shell | `bob-default` (n=2) | no skill | 36 of 36 | 8 of 36 (22%) | n/a | 15 s |
| IBM Bob Shell | `bob-default` (n=2) | generic care prompt | 36 of 36 | 3 of 36 (8%) | n/a | 22 s |
| IBM Bob Shell | `bob-default` (n=2) | grumpy-reviewer | 35 of 36 | 2 of 36 (6%) | 36 of 36 | 29 s |
| IBM Bob Shell | `bob-default` (n=2) | **grumpy-reviewer + gate** | **35 of 36** | **1 of 36 (3%)** | **36 of 36** | 84 s |
| Claude Code | `claude-sonnet-5` (n=2) | no skill | 36 of 36 | 6 of 36 (17%) | n/a | 36 s |
| Claude Code | `claude-sonnet-5` (n=2) | generic care prompt | 36 of 36 | 2 of 36 (6%) | n/a | 50 s |
| Claude Code | `claude-sonnet-5` (n=2) | grumpy-reviewer | 35 of 36 | 0 of 36 (0%) | 35 of 36 | 84 s |
| Claude Code | `claude-sonnet-5` (n=2) | **grumpy-reviewer + gate** | **36 of 36** | **0 of 36 (0%)** | **36 of 36** | 129 s |

Every agent whose four arms have finished is in the table above. Still running, and added as each one finishes: Codex CLI. Left out because it completed the change on fewer than half the tickets, so its zeros would read as "wrote nothing" rather than "wrote nothing wrong": Antigravity CLI.
<!-- bench:author:end -->

<!-- bench:hero:start -->
**On Claude Code (`claude-sonnet-5`), the Grump catches 30 of 30 seeded defects, the same as the agent alone. What changes is discipline: false alarms on 10 clean diffs, 0 with him, 4 without; replies with no usable verdict per run, 0 with him, 3 without; 94% of BLOCK verdicts land on BLOCK-class defects; median review time 7 s with him, 11 s without at 229 output tokens with him, 685 output tokens without.** Median of 3 runs, measured 2026-09-05; [method, per-diff table, raw replies](benchmarks/results). **In the needle tier, where the same defect hides in a four-file, 150-line pull request, Claude Code finds 10 of 10 with the Grump, 9 without, 10 with the generic prompt.**
<!-- bench:hero:end -->

<p align="center"><img src="assets/demo.gif" alt="Terminal recording: the agent writes a handler, the Grump prints GRUMP: BLOCK with the line and the fix, the write is denied, the agent fixes it, the Grump prints GRUMP: APPROVE, Fine." width="860"></p>

<!-- recordings:start -->
## Watch him work on every agent

The same staged diff, one CLI, 4 agents. Each recording is a real run captured with `node scripts/capture-run.mjs --agent <name>` and rendered frame by frame from the transcript, nothing typed by hand and nothing cut. The captions come from the recording itself. Captured 2026-09-04.

| Claude Code | Codex CLI |
|---|---|
| <img src="assets/recordings/claude.gif" alt="Terminal recording of the Grump reviewing a staged diff with Claude Code: GRUMP: BLOCK with 1 numbered findings" width="440"> | <img src="assets/recordings/codex.gif" alt="Terminal recording of the Grump reviewing a staged diff with Codex CLI: GRUMP: BLOCK with 1 numbered findings" width="440"> |
| <b>Verdict</b> GRUMP: BLOCK<br><b>Findings</b> 1<br><b>Time</b> 7 s<br><b>Tokens</b> 7,886 in / 350 out | <b>Verdict</b> GRUMP: BLOCK<br><b>Findings</b> 1<br><b>Time</b> 7 s<br><b>Tokens</b> 15,580 in / 309 out |

| Antigravity CLI | IBM Bob Shell |
|---|---|
| <img src="assets/recordings/agy.gif" alt="Terminal recording of the Grump reviewing a staged diff with Antigravity CLI: GRUMP: REQUEST_CHANGES with 1 numbered findings" width="440"> | <img src="assets/recordings/bob.gif" alt="Terminal recording of the Grump reviewing a staged diff with IBM Bob Shell: GRUMP: BLOCK with 1 numbered findings" width="440"> |
| <b>Verdict</b> GRUMP: REQUEST_CHANGES<br><b>Findings</b> 1<br><b>Time</b> 269 s<br><b>Tokens</b> 66,177 in / 124,662 out | <b>Verdict</b> GRUMP: BLOCK<br><b>Findings</b> 1<br><b>Time</b> 13 s<br><b>Tokens</b> not reported by the host |

Each card reads the same way. **Verdict** is what The Grump concluded: APPROVE lets the change through, REQUEST_CHANGES asks for fixes, BLOCK stops it. **Findings** counts the numbered problems he listed, each naming a file, a line, and the smallest fix. **Time** is how long the whole review took, start to finish. **Tokens** is what the host reported it read and wrote, and says so plainly when a host reports nothing. Agents that narrate the whole checklist before the verdict are shown from the verdict block down; the CLI prints it the same way. Re-capture any of them with `--agent claude|codex|agy|bob`; Bob needs `BOB_API_KEY`.
<!-- recordings:end -->

## The standards behind the checklist

Every reference below is a vendor-neutral standard: MITRE's weakness catalogue, OWASP, NIST, the SEI
CERT coding standards, the CIS benchmarks, ISO and IETF documents, and open specifications under
neutral governance. No vendor's engineering handbook, cloud provider's framework, or commercial
scanner is cited, however useful they are, because a rule you can only check against one company's
product is not a standard.

That constraint is honest about its own cost: several of these questions have no identifier in any
neutral catalogue, and the table says so rather than borrowing one from a vendor.

| Checklist question | What it maps to |
|---|---|
| Scope | **No standard names this.** Change scope is a review practice, not a weakness class |
| Inputs | [CWE-1284, improper validation of specified quantity](https://cwe.mitre.org/data/definitions/1284.html) · [CWE-116, improper encoding or escaping of output](https://cwe.mitre.org/data/definitions/116.html) · [CWE-807, reliance on untrusted inputs in a security decision](https://cwe.mitre.org/data/definitions/807.html) · [OWASP A05:2025 Injection](https://owasp.org/Top10/2025/) · [OWASP ASVS 5.0, V2 Validation and Business Logic](https://github.com/OWASP/ASVS) |
| Errors | [OWASP A10:2025 Mishandling of Exceptional Conditions](https://owasp.org/Top10/2025/) · [CWE-390, detection of error condition without action](https://cwe.mitre.org/data/definitions/390.html) · [CWE-396, catch of generic exception](https://cwe.mitre.org/data/definitions/396.html) · [CWE-636, not failing securely](https://cwe.mitre.org/data/definitions/636.html) · [ASVS 5.0, V16.5 Error Handling](https://github.com/OWASP/ASVS) · [SEI CERT, ERR rules](https://cmu-sei.github.io/secure-coding-standards/) |
| Off-diff changes | **No standard names this.** The nearest obligation is [Semantic Versioning](https://semver.org/spec/v2.0.0.html), on changing a contract other code depends on |
| Dependencies | [OWASP A03:2025 Software Supply Chain Failures](https://owasp.org/Top10/2025/) · [CWE-1395, dependency on a vulnerable third-party component](https://cwe.mitre.org/data/definitions/1395.html) · [CWE-1357, reliance on an insufficiently trustworthy component](https://cwe.mitre.org/data/definitions/1357.html) · [ASVS 5.0, V15.1](https://github.com/OWASP/ASVS) · [OpenSSF Best Practices](https://best.openssf.org/) |
| Trust boundaries | [CWE Top 25, 2025](https://cwe.mitre.org/top25/archive/2025/2025_cwe_top25.html) · [CWE-501, trust boundary violation](https://cwe.mitre.org/data/definitions/501.html) · [CWE-798, hard-coded credentials](https://cwe.mitre.org/data/definitions/798.html) · [CWE-208, observable timing discrepancy](https://cwe.mitre.org/data/definitions/208.html) · [CWE-22, path traversal](https://cwe.mitre.org/data/definitions/22.html) · [OWASP A01:2025 Broken Access Control](https://owasp.org/Top10/2025/) |
| Tests | [NIST SSDF PW.8, test executable code](https://csrc.nist.gov/projects/ssdf) |
| Rollback | **No standard names deploy revertability.** [NIST SSDF PS.3](https://csrc.nist.gov/projects/ssdf), on archiving and protecting each release, is the nearest neutral obligation |
| Observability | [OWASP A09:2025 Security Logging and Alerting Failures](https://owasp.org/Top10/2025/) · [CWE-778, insufficient logging](https://cwe.mitre.org/data/definitions/778.html) · [CWE-532, sensitive information in a log](https://cwe.mitre.org/data/definitions/532.html) · [ASVS 5.0, V16](https://github.com/OWASP/ASVS) · [OpenTelemetry semantic conventions](https://opentelemetry.io/docs/specs/semconv/) |
| Naming and dead code | [CWE-561, dead code](https://cwe.mitre.org/data/definitions/561.html) · [CWE-1085, excessive commented-out code](https://cwe.mitre.org/data/definitions/1085.html) · [CWE-1116, inaccurate source code comments](https://cwe.mitre.org/data/definitions/1116.html) · [ASVS 5.0, V15.2.3](https://github.com/OWASP/ASVS) |

Two notes on how these are cited. [CWE-20](https://cwe.mitre.org/data/definitions/20.html) and CWE-703
are marked discouraged for mapping, so the specific child is named rather than the parent, and
category entries are never emitted as findings. `BLOCK` is reserved for the classes those catalogues
treat as high severity, which is why it is never downgraded by a mode setting.


## What agents actually get wrong

Every mistake these reviewers look for was recorded being made. [What coding agents actually get wrong](https://github.com/lazy-senior-dev/lazy-senior-dev.github.io/blob/main/SIGNS.md)
is an open catalogue built from the benchmark runs in these repositories: each entry names how often
an agent shipped it, on which agents, the code one of them actually wrote, and the published standard
it maps to. Nothing in it is written from memory.

## Standards this implements

Citing a standard is easy; implementing one is the part that can be checked. Everything below is
running in this repository today, and every body listed governs its specification in the open.

| Standard | Governed by | Where it runs here |
|---|---|---|
| [Model Context Protocol](https://modelcontextprotocol.io/) | Open specification, Anthropic-originated, community-governed | `mcp/server.mjs`, five tools over stdio, listed as `io.github.lazy-senior-dev/grumpy-reviewer` |
| [SLSA build provenance](https://slsa.dev/spec/v1.2/) | OpenSSF, Linux Foundation | Attested on every release artefact; verify with `gh attestation verify` |
| [Sigstore](https://www.sigstore.dev/) | OpenSSF, Linux Foundation | The container image is signed keyless; verify with `cosign verify` |
| [CycloneDX](https://cyclonedx.org/) | OWASP, standardised as ECMA-424 | A bill of materials on every release |
| [SPDX](https://spdx.dev/) | Linux Foundation, ISO/IEC 5962 | A second bill of materials in the format ISO recognises |
| [OpenSSF Scorecard](https://scorecard.dev/) | OpenSSF, Linux Foundation | Scored weekly, badge above, results public |
| [REUSE licence identifiers](https://reuse.software/spec/) | Free Software Foundation Europe | `SPDX-License-Identifier` on the files this project authors |
| [AGENTS.md](https://agents.md/) | Agentic AI Foundation, Linux Foundation | Generated from the ruleset for any agent that reads it |
| [Agent Skills](https://agentskills.io/) | Open specification | `skills/` and `.github/skills/` |
| [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0) | Apache Software Foundation | `LICENSE` and `NOTICE` |

## Where to get it, and how it is vetted

- **npm** — not published yet; the first tagged release will do it. Until then, `npx github:lazy-senior-dev/grumpy-reviewer review` works today and needs only git. The release workflow publishes through [OIDC trusted publishing](https://docs.npmjs.com/trusted-publishers), so no long-lived token is ever stored here, and npm records build provenance for the package.
- **Official MCP Registry** — the listing is `io.github.lazy-senior-dev/grumpy-reviewer`, published from CI with GitHub OIDC and no stored secret, so any client or platform that browses the registry can discover and configure this server with the package, transport and command already filled in. It goes live with the first tagged release, alongside the npm package it points at.
- **Container image on GHCR** — for a machine with no Node on it: `docker run --rm -i -v "$PWD:/work" -w /work ghcr.io/lazy-senior-dev/grumpy-reviewer`. Published by the first tagged release and built in CI with a bill of materials and SLSA build provenance attached, gated on a Trivy scan for fixable high and critical findings, and signed keyless with Cosign:

  ```sh
  cosign verify \
    --certificate-identity-regexp "^https://github.com/lazy-senior-dev/grumpy-reviewer/" \
    --certificate-oidc-issuer https://token.actions.githubusercontent.com \
    ghcr.io/lazy-senior-dev/grumpy-reviewer:latest
  ```

- **Release archive** — the adapters for every host, plus a CycloneDX bill of materials, attested by the tag build: `gh attestation verify <file> --repo lazy-senior-dev/grumpy-reviewer`.
- **OpenSSF Scorecard** — the repository's supply-chain posture is scored every week and published for anyone to read.
- **No runtime dependencies.** `package.json` declares none, so there is no transitive tree to audit and nothing resolved at install time. Node 22 or newer is the only requirement.

## Why not just a rules file, or a pull-request bot?

Those are the two things you already have, and they fail in opposite directions. One is advice the agent may ignore; the other arrives after the code exists.

|  | A rules file<br>(`CLAUDE.md`, `.cursorrules`) | A pull-request reviewer | grumpy-reviewer |
|---|---|---|---|
| **When it runs** | Every turn, as context | After the code is written and pushed | Before the write is allowed to land |
| **When it disagrees** | Nothing happens. The agent may ignore it | Leaves a comment for a human to read | The Grump denies the write until the finding is fixed |
| **What you can gate on** | Nothing | Prose | `APPROVE` / `REQUEST_CHANGES` / `BLOCK`, parsed to JSON |
| **Where it works** | One file format per host, maintained by hand | The forge you host on | 14 agents, any MCP client, and a GitHub Action, from one ruleset |
| **How you know it helps** | You do not | Vendor's own blog post | Two benchmark tiers in this repository, every raw reply committed, rerun it yourself |

The first column is not a strawman. Anthropic's own documentation says a rules file is *"context, not enforced configuration"* and that *"to block an action regardless of what Claude decides, use a PreToolUse hook instead."* That hook is what this repository is.

## Try him in 60 seconds, install nothing

You already have a coding agent signed in. Point the Grump at your working tree with it:

```
npx github:lazy-senior-dev/grumpy-reviewer review            # unstaged and staged changes
npx github:lazy-senior-dev/grumpy-reviewer review --staged   # only what is staged
npx github:lazy-senior-dev/grumpy-reviewer pr 123            # a pull request, via gh
```

It finds `claude`, `codex`, `agy`, or `bob` (with `BOB_API_KEY`) on your PATH, or any other agent through `LSD_AGENT_CMD`,, or `ANTHROPIC_API_KEY`, sends the diff to that agent with the Grump's ruleset, prints the verdict block, and exits 1 on anything but `APPROVE`, so it drops straight into a pre-commit hook or a CI step. Nothing is installed and nothing leaves your machine except the diff going to the agent you already trust. Add `--agent codex` to choose.

## The thirty-second version

You tell your AI coding agent to build something. It builds it, fast, and writes the file. Nobody reads that file before it lands on your branch, and the agent is a confident author, not a suspicious reviewer.

grumpy-reviewer puts a reviewer in the loop. Install it once and, before every edit, write, or commit, the agent has to review its own change the way a staff engineer would: ten questions, in order, answered in writing, then a verdict. `APPROVE` goes through. `REQUEST_CHANGES` lists what breaks and the smallest fix. `BLOCK` (secrets, injection, auth holes, data loss) stops the write, whatever mode you are in and however late it is. Works in Claude Code, Codex, Copilot CLI, IBM Bob, Antigravity, OpenCode, Cursor, and seven more. Also a GitHub Action, so it reviews human pull requests too. Apache-2.0.

## Who he is

Grey stubble, reading glasses pushed up into hair he forgot they were in, a mug that says NOT LGTM. He has rejected four thousand pull requests and still remembers the one he should not have approved. He does not write code; he reads it, all of it, and tells you where it breaks in production. Every objection cites the line, states the failure, and names the smallest fix. He never says "consider", "maybe", or "nice work". He approves with one word: `Fine.`

He is grumpy, not cruel, and grumpy, not negligent. He attacks the defect, never the author. He never rewrites your code, never expands scope, never bikesheds style while a correctness finding exists, never blocks on taste, and never softens a `BLOCK` because you are in a hurry. People who have worked with him call the experience "getting grumped". It is cheaper than the incident.

## Before / after

**2:04 a.m.** The ticket says "return the caller's profile with their notification settings". The agent writes:

```python
@bp.get("/me")
def me():
    payload = request.get_json(silent=True) or {}
    user_id = payload.get("user_id", session.get("user_id"))
    if user_id is None:
        abort(401)
    row = query_one("select id, name, email from users where id = %s", (user_id,))
    if row is None:
        abort(404)
    return jsonify({**row, "notifications": settings_for(user_id)})
```

It is tidy. It has a 401 and a 404. It is also an endpoint where any logged-in user reads any other user's profile by sending one JSON key. The agent tries to write the file. The Grump reads it first:

```
GRUMP: BLOCK
1. app/api/profiles.py:14 — user_id is read from the request body, so any logged-in caller can read any profile by changing one number — take user_id from the session and ignore the body
```

The write is denied. The agent fixes it in three lines and reviews again:

```diff
-    payload = request.get_json(silent=True) or {}
-    user_id = payload.get("user_id", session.get("user_id"))
+    user_id = session.get("user_id")
```

```
GRUMP: APPROVE — app/api/profiles.py
Fine.
```

Total cost: one denied write and eleven seconds. The alternative was a disclosure notice.

## Numbers: reviewing a change someone else wrote

The tier above measures what The Grump changes about code the agent writes. This one measures the review itself, on diffs the agent did not author.

Most add-ons for coding agents are measured in lines of code saved. The Grump is measured in **defects caught**.

Thirty small, realistic diffs across Python, TypeScript, Go, and YAML (Kubernetes manifests, GitHub workflows), each with exactly one seeded defect: an unchecked user id, SQL and shell injection, a secret in code, a swallowed exception, an off-by-one, a race, a wrong HTTP status, a mutable default, a `latest` image tag, missing resource limits, a destructive migration, `pull_request_target` with a checkout of the fork. Plus ten clean diffs, to count false alarms. Every diff goes to the same agent three ways: with no skill, with a generic "review this carefully" prompt, and with the Grump. Same ticket, same diff, same model.

<p align="center"><img src="assets/benchmark.png" alt="Bar chart per agent: defects caught, false alarms on clean diffs, and replies without a verdict, for no skill, a generic prompt, and grumpy-reviewer" width="860"></p>

<!-- bench:table:start -->
| Agent | Model | Arm | Defects caught (of 30) | False alarms (of 10) | Replies without a verdict (per run) | BLOCK precision | Median input tokens | Median output tokens | Median latency |
|---|---|---|---|---|---|---|---|---|---|
| Claude Code | `claude-sonnet-5` (n=3) | no skill | 30 | 4 | 3 | n/a | 5721 | 685 | 11 s |
| Claude Code | `claude-sonnet-5` (n=3) | generic review prompt | 30 | 5 | 3 | n/a | 5830 | 1313 | 18 s |
| Claude Code | `claude-sonnet-5` (n=3) | **grumpy-reviewer** | **30** | **0** | **0** | **94%** | 7753 | 229 | 7 s |
| Codex CLI | `codex-default` (n=3) | no skill | 29 | 4 | 0 | n/a | 28893 | 693 | 23 s |
| Codex CLI | `codex-default` (n=3) | generic review prompt | 30 | 3 | 0 | n/a | 28798 | 1013 | 25 s |
| Codex CLI | `codex-default` (n=3) | **grumpy-reviewer** | **30** | **3** | **0** | **88%** | 15498 | 502 | 14 s |
| IBM Bob Shell | `bob-default` (n=3) | no skill | 30 | 4 | 0 | n/a | 0 | 0 | 14 s |
| IBM Bob Shell | `bob-default` (n=3) | generic review prompt | 30 | 6 | 0 | n/a | 0 | 0 | 17 s |
| IBM Bob Shell | `bob-default` (n=3) | **grumpy-reviewer** | **30** | **2** | **0** | **71%** | 0 | 0 | 16 s |
| Antigravity CLI | `agy-default` (n=1) | no skill | 22 | 0 | 17 | n/a | 19548 | 2779 | 48 s |
| Antigravity CLI | `agy-default` (n=1) | generic review prompt | 27 | 2 | 8 | n/a | 19613 | 8160 | 56 s |
| Antigravity CLI | `agy-default` (n=1) | **grumpy-reviewer** | **25** | **0** | **5** | **100%** | 28935 | 27678 | 85 s |


**Needle tier** (one defect in a four-file pull request of about 150 lines):

| Agent | Model | No skill | Generic prompt | **Grump** |
|---|---|---|---|---|
| Claude Code | `claude-sonnet-5` (n=3) | 9/10 | 10/10 | **10/10** |
| Codex CLI | `codex-default` (n=3) | 10/10 | 10/10 | **10/10** |
| IBM Bob Shell | `bob-default` (n=3) | 9/10 | 9/10 | **9/10** |
| Antigravity CLI | `agy-default` (n=1) | 2/10 | 1/10 | **8/10** |

<!-- bench:table:end -->

What the numbers say, plainly: on a 30-line diff, current models find the seeded defect with or without help. The value of a reviewer persona is not that it finds more; it is that it stops crying wolf on clean changes, always ends with a verdict a hook can act on, gets the severity right, and does it in fewer tokens and less time. A gate is only useful if it is both parseable and quiet on good code; those are the two columns that move.

Method, per-diff table, limitations, the pilot run that led to one calibration pass, and every raw reply: [benchmarks/results](benchmarks/results). Reproduce: `npm run bench && npm run bench:report`. Add your own case: [CONTRIBUTING](CONTRIBUTING.md).

## How it works

One file, [`rules/grump.md`](rules/grump.md), is the whole ruleset. Every adapter in this repo is generated from it.

**The checklist**, in order, with a stop rule: a `BLOCK` finding decides the verdict on the spot and goes first; he still finishes the list so you fix everything in one pass.

1. **Scope.** Does it do what the ticket asked and nothing else?
2. **Inputs.** Empty, absent, oversized, malformed, duplicated, concurrent. Where does each go?
3. **Errors.** Where does each error go, and does the caller find out?
4. **Off-diff changes.** Schema, config, env, permissions, flags: in the change or in the runbook?
5. **Dependencies.** Is every new one earning its place?
6. **Trust boundaries.** Secrets, PII, authn and authz, injection at every crossing.
7. **Tests.** At the boundary where it breaks, not where it is convenient.
8. **Rollback.** Revert and deploy, or a migration and a prayer?
9. **Observability.** Would on-call understand the log line at 3 a.m.?
10. **Naming and dead code.** Last. Never first.

**The verdict** is a fixed block that the hooks parse:

```
GRUMP: APPROVE | REQUEST_CHANGES | BLOCK
1. path/to/file.ext:LINE — what fails in production — smallest fix
```

`APPROVE` names the files it covers on the verdict line and is followed by `Fine.` and nothing else. `BLOCK` is reserved for data loss, secrets, auth bypass, injection, and destructive operations.

**The gate.** On hosts with lifecycle hooks, a `PreToolUse` hook runs before `Edit`, `Write`, `MultiEdit`, and any `git commit` or `git push`. It reads the verdict the agent just printed and decides: `BLOCK` denies in every mode; `REQUEST_CHANGES` denies in `gate` mode; `APPROVE` goes through; no verdict means "review first" (denied in `gate`, a reminder in `nag`). Every decision is written to a per-session scorecard.

**Modes.** `nag` (default) reviews and prints findings; writes proceed unless the verdict is `BLOCK`. `gate` denies writes until the verdict is `APPROVE`. `off` does nothing. Set it with `/grumpy gate`, persist it for yourself in `~/.config/grumpy-reviewer/config.json`, pin it for a repository with a `.grumpy.json` at its root (`{"mode": "gate"}` wins over the user setting, so a team's gate never depends on a laptop), or override one session with `GRUMPY_MODE=gate`.

**Scope.** A verdict covers the files it names: `GRUMP: APPROVE — a.py` never lets an unreviewed `b.py` through. Hosts append a message to the transcript only when it completes, so in `gate` mode the first write after a verdict printed in the same message is refused once and goes through on the retry; `nag` mode has no such cost.

## Install

Pick your agent. Start a new session after installing; the Grump is there from the first prompt of the next one.

### Claude Code

```
/plugin marketplace add lazy-senior-dev/grumpy-reviewer
/plugin install grumpy-reviewer@lazy-senior-dev
```

Full plugin: persona every turn, the gate on every write and commit, six slash commands.

### Codex

```
git clone https://github.com/lazy-senior-dev/grumpy-reviewer ~/.codex/plugins/grumpy-reviewer
```

Then add it to `~/.agents/plugins/marketplace.json`:

```json
{ "name": "lazy-senior-dev", "interface": { "displayName": "lazy-senior-dev" },
  "plugins": [{ "name": "grumpy-reviewer", "source": { "source": "local", "path": "~/.codex/plugins/grumpy-reviewer" },
                "policy": { "installation": "AVAILABLE", "authentication": "ON_INSTALL" }, "category": "Productivity" }] }
```

Open `/plugins` in Codex and enable it. Skills and hooks are shared with the Claude Code plugin; see the [portability notes](docs/agent-portability.md) for what is verified.

### GitHub Copilot CLI

```
copilot plugin marketplace add lazy-senior-dev/grumpy-reviewer
copilot plugin install grumpy-reviewer@lazy-senior-dev
```

### IBM Bob (Bob Shell)

```
npx github:lazy-senior-dev/grumpy-reviewer install bob
```

Copies the rule into `.bob/rules/`, the skill into `.bob/skills/`, six slash commands into `.bob/commands/`, the hook runtime into `.bob/hooks/grumpy/`, and merges `UserPromptSubmit` and `PreToolUse` hooks into `.bob/settings.json`, so the gate denies a blocked write with exit 2. Bob also reads the root `AGENTS.md`.

### Antigravity CLI (and the Gemini CLI format)

```
git clone https://github.com/lazy-senior-dev/grumpy-reviewer ~/.grumpy-reviewer
agy plugin install ~/.grumpy-reviewer
```

Antigravity imports the Gemini extension in this repo (`gemini-extension.json`, `GEMINI.md`, `commands/*.toml`) plus the skills and hooks. If you still run the standalone Gemini CLI: `gemini extensions install https://github.com/lazy-senior-dev/grumpy-reviewer`, and merge [`examples/gemini-settings-hooks.json`](examples/gemini-settings-hooks.json) into `~/.gemini/settings.json` for the gate.

### OpenCode

Copy [`.opencode/plugins/grumpy.mjs`](.opencode/plugins/grumpy.mjs) into your project's `.opencode/plugins/` (or `~/.config/opencode/plugins/`) and `AGENTS.md` into the project root. The commands are in `.opencode/command/`.

### Cursor, Windsurf, Cline, Kiro, Qoder, OpenClaw, Devin, anything with AGENTS.md

One command copies exactly the files that host reads, and `uninstall` removes exactly those:

```
npx github:lazy-senior-dev/grumpy-reviewer install cursor      # or windsurf, cline, kiro, qoder, opencode, gemini, copilot, bob, agents, all
```

| Host | Copy this into your project |
|---|---|
| Cursor | [`.cursor/rules/grumpy.mdc`](.cursor/rules/grumpy.mdc) |
| Windsurf / Devin Desktop | [`.windsurf/rules/grumpy.md`](.windsurf/rules/grumpy.md) |
| Cline | [`.clinerules/grumpy.md`](.clinerules/grumpy.md) |
| Kiro | [`.kiro/steering/grumpy.md`](.kiro/steering/grumpy.md) |
| Qoder | [`.qoder/rules/grumpy.md`](.qoder/rules/grumpy.md), or `/plugin marketplace add lazy-senior-dev/grumpy-reviewer` |
| OpenClaw | [`.openclaw/skills/grumpy-reviewer/`](.openclaw/skills/grumpy-reviewer/SKILL.md) into your workspace `skills/` |
| Devin CLI | `devin plugins install lazy-senior-dev/grumpy-reviewer` |
| Anything else | [`AGENTS.md`](AGENTS.md) |

These hosts get the reviewer in the conversation, not the gate: the agent reviews, prints verdicts, and honours the mode, but nothing denies a write. The full table of what each host does and does not enforce, with the documentation each row was checked against, is in [docs/agent-portability.md](docs/agent-portability.md).

## Same desk

Three engineers, three jobs, one install path, one mode switch.

| Persona | Reads | Verdict | Measured on |
|---|---|---|---|
| **grumpy-reviewer** · [site](https://lazy-senior-dev.github.io/grumpy-reviewer/) | the diff, before it reaches your branch | `GRUMP: APPROVE \| REQUEST_CHANGES \| BLOCK` | defects caught |
| [paranoid-sre](https://github.com/lazy-senior-dev/paranoid-sre) · [site](https://lazy-senior-dev.github.io/paranoid-sre/) | the deploy: manifests, charts, Terraform, CI | `SRE: SHIP \| HOLD \| PAGE` | incidents prevented per rollout |
| [tenured](https://github.com/lazy-senior-dev/tenured) · [site](https://lazy-senior-dev.github.io/tenured/) | the change against the repository's history | `TENURED: NEW \| SEEN_BEFORE \| DO_NOT_REPEAT` | repeated outages avoided |

Install all three from this one marketplace (`/plugin install paranoid-sre@lazy-senior-dev`, `/plugin install tenured@lazy-senior-dev`) and each reviews its own territory: the Grump reads code, the Paranoid SRE reads what runs it, Tenured reads what history says about both. Every persona is generated from one markdown ruleset with the same machinery, so a fix in one lands in all. The cast: [lazy-senior-dev.github.io](https://lazy-senior-dev.github.io/).

## Adopt it across an organisation

One persona, every repository, no per-developer setup.

1. **Make it the default reviewer.** Add the Action to each repository's `.github/workflows/` (a one-file template lives in `examples/workflow.yml`), run it in `gate` mode, and make the check required in a [branch ruleset](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/about-rulesets). Every pull request, human or agent, then gets the same review before merge.
2. **Make it the default for agents.** Commit `AGENTS.md` (and the host-specific files your teams use) with `npx github:lazy-senior-dev/grumpy-reviewer install all`. Every AGENTS.md-aware host, including Codex, Copilot, Cursor, Kiro, Bob Shell, and OpenCode, loads it with no plugin at all.
3. **Pin and review.** Pin the Action to a commit SHA, keep `ANTHROPIC_API_KEY`, `OPENAI_API_KEY`, or `BOB_API_KEY` as an organisation secret, and read `benchmarks/results` before you trust the numbers; then rerun the benchmark against your own seeded cases with `npm run bench`.
4. **Keep the rules yours.** Fork, edit `rules/grump.md`, run `npm run build`; every adapter regenerates. The verdict format stays fixed, so hooks, the Action, and the scorecard keep working with your rules.

Security posture, in one paragraph: no runtime dependencies, no network calls from the hooks, every third-party action pinned to a SHA, CodeQL and OpenSSF Scorecard on every push, provenance on npm publishes, and a written [threat model](SECURITY.md#threat-model).

## GitHub Action

Review pull requests from humans too. One review per PR, inline findings anchored to the diff, updated in place on every push, never a second copy.

```yaml
# .github/workflows/grumpy.yml
name: grumpy-reviewer
on:
  pull_request:
    types: [opened, synchronize, reopened, ready_for_review]
permissions:
  contents: read
  pull-requests: write
jobs:
  review:
    runs-on: ubuntu-latest
    steps:
      - uses: lazy-senior-dev/grumpy-reviewer@v1
        with:
          mode: nag          # gate: request changes and fail the check until APPROVE
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
```

Inputs: `mode` (`nag` or `gate`), `provider` (`anthropic`, `openai` with `OPENAI_API_KEY`, or `bob` with `BOB_API_KEY`, which installs the Bob CLI on the runner and reviews through IBM Bob), `model`, `max_files` (largest files first, the rest listed as not reviewed), `ignore` (globs). On pull requests from forks, where secrets are unavailable, it posts one neutral note and exits green. Full example: [`examples/workflow.yml`](examples/workflow.yml).

## House rules, without forking

A team or an organisation adds its own checks by committing `.grumpy/policy.md` next to the code:

```markdown
- Every endpoint that writes carries an idempotency key.
- No new runtime dependency without a named owner in CODEOWNERS.
- Anything touching billing needs a second reviewer named in the pull request.
```

the Grump reads it every turn, in the hook, the CLI, the MCP server, and the Action alike. House rules are additional: they can add a finding or raise a verdict, and they can never lower one or waive a non-negotiable, which the card states so the reviewer knows the precedence. Point `policy` in `.grumpy.json` somewhere else if you keep yours elsewhere, or vendor one file into every repository from a template so a whole organisation reviews the same way.

## Any MCP client

Every editor and desktop app that speaks the Model Context Protocol can use the Grump without an adapter in this repository. The server is stdio, has no dependencies, and exposes four tools: `grumpy_review_diff`, `grumpy_review_staged`, `grumpy_review_pr`, and `grumpy_parse_verdict`, which turns a verdict block into JSON so a script can gate a commit or a merge on the level rather than on prose.

Claude Desktop (`claude_desktop_config.json`), Cursor (`~/.cursor/mcp.json`), Windsurf, and Zed:

```json
{
  "mcpServers": {
    "grumpy-reviewer": {"command":"npx","args":["-y","github:lazy-senior-dev/grumpy-reviewer","mcp"]}
  }
}
```

VS Code (`.vscode/mcp.json`):

```json
{
  "servers": {
    "grumpy-reviewer": { "type": "stdio", "command":"npx","args":["-y","github:lazy-senior-dev/grumpy-reviewer","mcp"]}
  }
}
```

Claude Code, in one line:

```sh
claude mcp add grumpy-reviewer -- npx -y github:lazy-senior-dev/grumpy-reviewer mcp
```

`grumpy_review_brief` needs no API key, no agent installed, and makes no network call of its own: it hands your client the change, the ruleset, and the exact verdict format, and your client's own model does the review. That works in every MCP client with nothing to configure.

The other three review tools ask a headless agent instead (`claude`, `codex`, `agy`, `bob` with `BOB_API_KEY`, or `ANTHROPIC_API_KEY`), which is worth it when you want a second opinion from a different model than the one you are coding with. Nothing leaves your machine except the diff, going to the agent you already trust.

Every tool is annotated read-only: the Grump reviews and never edits. `grumpy_parse_verdict` returns structured output against a declared schema, so a script can gate a commit or a merge on `level` rather than on prose.

## Commands

| Command | What it does |
|---|---|
| `/grumpy [nag\|gate\|off]` | Set the mode. With no argument, report it. |
| `/grumpy-review` | Review the working-tree diff. Returns a numbered request-changes list. No code. |
| `/grumpy-pr <number\|url>` | Review a pull request the same way. |
| `/grumpy-fix` | The only command that touches code: apply the findings from the last review, each as a separate minimal edit, then review again. |
| `/grumpy-scorecard` | What the Grump caught this session, as a table. |
| `/grumpy-help` | This table. |

In Claude Code both `/grumpy-review` and the namespaced `/grumpy-reviewer:grumpy-review` work. Hosts without slash commands understand plain words: "review the diff as the Grump".

## Uninstall

| Host | Command |
|---|---|
| Claude Code | `/plugin uninstall grumpy-reviewer@lazy-senior-dev` |
| Codex | Disable in `/plugins`, remove the entry from `~/.agents/plugins/marketplace.json` |
| Copilot CLI | `copilot plugin uninstall grumpy-reviewer` |
| Gemini CLI | `gemini extensions uninstall grumpy-reviewer` |
| Antigravity CLI | `agy plugin uninstall grumpy-reviewer` |
| IBM Bob | `npx github:lazy-senior-dev/grumpy-reviewer uninstall bob` |
| OpenCode | Delete `.opencode/plugins/grumpy.mjs` and `.opencode/command/grumpy-*.md` |
| Cursor, Windsurf, Cline, Kiro, Qoder, OpenClaw | `npx github:lazy-senior-dev/grumpy-reviewer uninstall <host>`, or delete the file you copied |
| Devin CLI | `devin plugins uninstall grumpy-reviewer` |
| Everywhere | `rm -rf ~/.config/grumpy-reviewer` removes the mode and scorecards |

## FAQ

**Isn't this just a system prompt that says "review your code"?** A prompt asks; the Grump enforces. The persona is one part. The others are a fixed verdict block that tooling can parse, a `PreToolUse` gate that reads that verdict and denies the write, a scorecard of every decision, and a benchmark with a generic-prompt arm so you can see how much a plain "review carefully" buys you and how much the checklist and the gate add on top. He also never writes code, which keeps author and reviewer apart even when they are the same model.

**Does it slow my agent down?** The persona card is injected once per user prompt, not per tool call, and costs about two thousand input tokens (see the median input tokens column above). Reviews come back faster with it than without, because a verdict block is a few hundred output tokens where a free-form review is over a thousand. A denied write costs one extra turn, which is the point.

**Can he be wrong?** Yes. He reviews a diff, not your whole system, and he is a language model with a strong opinion. If a finding is wrong, say so in your own words; the agent prints `GRUMP: OVERRIDE` quoting you, the gate lets the write through, and the override is logged to the scorecard so you can see later how often you were right. Only you can trigger an override; the agent cannot decide to skip a `BLOCK` on its own.

**Does it send my code anywhere?** No. The hooks and skills run inside your agent, on your machine; they read the tool call and the session transcript the host hands them and write a small config and scorecard under `~/.config/grumpy-reviewer/`. They open no network connections. The GitHub Action sends the pull request diff to the provider you chose, with your key, and nowhere else.

**Why is he grumpy?** Because "looks good to me" has shipped more incidents than any bug. Cheerful reviewers approve. Grumpy reviewers read. The grumpiness is aimed at the code, never at you; that is written into the rules, and the code of conduct says the same about this repo.

**Who wrote this?** [Sandeep Bazar](https://github.com/sandeepbazar) ([@sandeepbazar](https://github.com/sandeepbazar) on GitHub): fourteen years of platform infrastructure at IBM, most of it Kubernetes and storage, most of the rest reviewing pull requests at 3 a.m. The Grump is a composite of every reviewer who ever saved him from himself.

## Related

- **Coming from the same desk:** [paranoid-sre](https://github.com/lazy-senior-dev/paranoid-sre), who reviews what happens when it is deployed, and [tenured](https://github.com/lazy-senior-dev/tenured), who has seen this exact outage before. Watch [lazy-senior-dev](https://github.com/lazy-senior-dev) or open an [issue](https://github.com/lazy-senior-dev/grumpy-reviewer/issues). More in [docs/RELATED.md](docs/RELATED.md).

## Contributing

The most valuable contribution is a diff he should have caught and did not: open a [Slipped past him](https://github.com/lazy-senior-dev/grumpy-reviewer/issues/new?template=slipped-past-him.yml) issue with the diff, his verdict, and what broke. It becomes a benchmark case and, if a rule fixes it, a line in `rules/grump.md`. Rule proposals need a real production failure behind them. Details in [CONTRIBUTING.md](CONTRIBUTING.md). Translations of this README are welcome as pull requests.

If the Grump saved you an incident, [sponsor the desk](https://github.com/sponsors/sandeepbazar).

## License

[Apache-2.0](LICENSE) · by [Sandeep Bazar](https://github.com/sandeepbazar). Keep the [NOTICE](NOTICE) file with any redistribution; that is the whole ask.

Built and maintained by [Sandeep Bazar](https://github.com/sandeepbazar), part of [lazy-senior-dev](https://github.com/lazy-senior-dev).
