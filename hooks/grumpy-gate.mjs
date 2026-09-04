#!/usr/bin/env node
// PreToolUse gate. Reads the host's hook event from stdin, finds the last verdict
// the agent printed, and answers allow or deny in the host's dialect.
//
//   node grumpy-gate.mjs [--host claude|codex|copilot|gemini|kiro]
//
// It never throws: any internal failure means "allow", because a broken reviewer
// must not become a broken editor.

import { resolveMode, readState, writeState, appendScorecard } from "./lib/config.mjs";
import { lastVerdict } from "./lib/verdict.mjs";
import { recentAssistantText } from "./lib/transcript.mjs";
import { normaliseInput, classify, decide, render, bumpDenials, clearDenials } from "./lib/gate.mjs";

function readStdin() {
  return new Promise((resolve) => {
    let data = "";
    process.stdin.setEncoding("utf8");
    process.stdin.on("data", (chunk) => (data += chunk));
    process.stdin.on("end", () => resolve(data));
    process.stdin.on("error", () => resolve(data));
    setTimeout(() => resolve(data), 3000).unref();
  });
}

function hostArg() {
  const i = process.argv.indexOf("--host");
  return i > -1 && process.argv[i + 1] ? process.argv[i + 1] : "claude";
}

function emit(out) {
  if (out.stdout) process.stdout.write(out.stdout + "\n");
  if (out.stderr) process.stderr.write(out.stderr + "\n");
  process.exitCode = out.exitCode;
}

async function main() {
  const host = hostArg();
  let raw = {};
  try {
    raw = JSON.parse(await readStdin());
  } catch {
    raw = {};
  }
  const call = normaliseInput(raw, host);
  const target = classify(call);
  if (!target) return emit({ stdout: "", stderr: "", exitCode: 0 });

  const { mode } = resolveMode();
  if (mode === "off") return emit({ stdout: "", stderr: "", exitCode: 0 });

  const text = recentAssistantText(call.transcriptPath);
  const verdict = lastVerdict(text);
  let state = readState(call.sessionId);
  const denials = state.denials?.[target.file] || 0;

  const decision = decide({ mode, verdict, hasTranscript: Boolean(text), denials, target });

  if (decision.action === "deny") state = bumpDenials(state, target.file);
  else state = clearDenials(state, target.file);
  writeState(call.sessionId, state);

  appendScorecard(call.sessionId, {
    host,
    mode,
    tool: call.toolName,
    kind: target.kind,
    file: target.file,
    verdict: verdict ? verdict.verdict : null,
    findings: verdict ? verdict.findings.length : 0,
    decision: decision.action,
    logged: decision.logged || null,
  });

  emit(render(decision, host));
}

main().catch(() => emit({ stdout: "", stderr: "", exitCode: 0 }));
