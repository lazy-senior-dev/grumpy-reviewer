#!/usr/bin/env node
// Try the Grump without installing anything:
//   npx github:lazy-senior-dev/grumpy-reviewer review [--staged] [--agent claude|codex|agy|api] [--model ID]
//   npx github:lazy-senior-dev/grumpy-reviewer pr <number|url> [--agent ...]
// Uses whichever headless agent you already have signed in. Sends the diff to that agent and nothing else.
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { AGENTS, availableAgents } from "../benchmarks/lib/agents.mjs";
import { lastVerdict } from "../hooks/lib/verdict.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const cmd = args[0];
const opt = (name, def) => { const i = args.indexOf(name); return i > -1 ? args[i + 1] : def; };
const flag = (name) => args.includes(name);

function usage(code = 0) {
  console.log(readFileSync(fileURLToPath(import.meta.url), "utf8").split("\n").slice(1, 5).map((l) => l.replace(/^\/\/ ?/, "")).join("\n"));
  process.exit(code);
}
if (!cmd || cmd === "help" || cmd === "--help") usage();

function sh(c, a) { return execFileSync(c, a, { encoding: "utf8", maxBuffer: 20 * 1024 * 1024 }); }

let diff = "";
let label = "";
try {
  if (cmd === "review") {
    diff = flag("--staged") ? sh("git", ["diff", "--cached"]) : sh("git", ["diff"]) + sh("git", ["diff", "--cached"]);
    label = flag("--staged") ? "staged changes" : "working tree";
  } else if (cmd === "pr") {
    const ref = args[1];
    if (!ref) usage(2);
    diff = sh("gh", ["pr", "diff", ref]);
    label = `pull request ${ref}`;
  } else usage(2);
} catch (err) {
  console.error(`Could not read the ${cmd === "pr" ? "pull request (is gh installed and signed in?)" : "diff (is this a git repository?)"}: ${err.message.split("\n")[0]}`);
  process.exit(2);
}
if (!diff.trim()) {
  console.log("Nothing to review.");
  process.exit(0);
}
if (diff.length > 400_000) {
  console.error(`That diff is ${Math.round(diff.length / 1000)} KB. The Grump reads everything, but not that; narrow it with --staged or review files in batches.`);
  process.exit(2);
}

const wanted = opt("--agent", null);
const available = await availableAgents();
const agentName = wanted && AGENTS[wanted] ? wanted : available[0];
if (!agentName || (wanted && !available.includes(wanted))) {
  console.error(`No headless agent found${wanted ? ` for --agent ${wanted}` : ""}. Install and sign in to one of: claude, codex, agy; or set ANTHROPIC_API_KEY / OPENAI_API_KEY.`);
  process.exit(2);
}
const agent = AGENTS[agentName];
const model = opt("--model", agent.defaultModel);
const system = readFileSync(join(HERE, "..", "hooks", "persona.md"), "utf8") + "\n\nPrint the verdict block and nothing else.";
const user = `Review this change as the Grump. It is the ${label}.\n\n${diff}`;

process.stderr.write(`Reading the ${label} (${diff.split("\n").length} lines) with ${agent.label}${model ? ` (${model})` : ""}. The Grump does not skim; give him a moment.\n`);
const started = Date.now();
let res;
try {
  res = await agent.run({ system, user, model });
} catch (err) {
  console.error(`The agent failed: ${err.message}`);
  process.exit(1);
}
const verdict = lastVerdict(res.text);
console.log(res.text.trim());
process.stderr.write(`\n${Math.round((Date.now() - started) / 1000)} s · ${res.usage.input} in / ${res.usage.output} out tokens${res.costUsd != null ? ` · $${res.costUsd.toFixed(4)}` : ""}\n`);
process.exit(verdict && verdict.verdict !== "APPROVE" ? 1 : 0);
