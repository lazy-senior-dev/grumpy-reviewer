import { test } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { normaliseInput, classify, decide, render, bumpDenials, clearDenials } from "../hooks/lib/gate.mjs";
import { lastVerdict } from "../hooks/lib/verdict.mjs";
import { assistantTextSinceLastPrompt } from "../hooks/lib/transcript.mjs";

const write = { toolName: "Write", toolInput: { file_path: "src/a.py", content: "" } };

test("classify recognises writes, commits, and ignores reads", () => {
  assert.deepEqual(classify(write), { kind: "write", file: "src/a.py" });
  assert.equal(classify({ toolName: "Read", toolInput: { file_path: "x" } }), null);
  assert.equal(classify({ toolName: "Bash", toolInput: { command: "git status" } }), null);
  assert.equal(classify({ toolName: "Bash", toolInput: { command: "git add -A && git commit -m x" } }).kind, "commit");
  assert.equal(classify({ toolName: "Bash", toolInput: { command: "git -c user.name=x commit -m y" } }).kind, "commit");
  assert.equal(classify({ toolName: "apply_patch", toolInput: { input: "*** Begin Patch\n*** Update File: lib/b.go\n" } }).file, "lib/b.go");
  assert.equal(classify({ toolName: "MultiEdit", toolInput: { edits: [{ file_path: "m.ts" }] } }).file, "m.ts");
});

test("normaliseInput accepts claude and copilot shapes", () => {
  const a = normaliseInput({ tool_name: "Edit", tool_input: { file_path: "x" }, session_id: "s", transcript_path: "/t" });
  const b = normaliseInput({ toolName: "edit", toolArgs: { path: "x" }, sessionId: "s" }, "copilot");
  assert.equal(a.toolName, "Edit");
  assert.equal(a.transcriptPath, "/t");
  assert.equal(b.toolInput.path, "x");
  assert.equal(b.transcriptPath, null);
  assert.equal(normaliseInput(null).sessionId, "unknown");
});

const target = { kind: "write", file: "src/a.py" };
const block = lastVerdict("GRUMP: BLOCK\n1. src/a.py:1 — secret in code — move to env");
const changes = lastVerdict("GRUMP: REQUEST_CHANGES\n1. src/a.py:1 — unhandled error — return 404");
const approve = lastVerdict("GRUMP: APPROVE\nFine.");
const override = lastVerdict("GRUMP: OVERRIDE — user: proceed, I accept it");

test("off mode skips everything", () => {
  assert.equal(decide({ mode: "off", verdict: block, target }).action, "skip");
});

test("BLOCK is denied in nag and gate alike", () => {
  assert.equal(decide({ mode: "nag", verdict: block, target }).action, "deny");
  assert.equal(decide({ mode: "gate", verdict: block, target }).action, "deny");
});

test("REQUEST_CHANGES is denied only in gate", () => {
  assert.equal(decide({ mode: "nag", verdict: changes, target }).action, "allow");
  assert.match(decide({ mode: "nag", verdict: changes, target }).context, /1 finding/);
  assert.equal(decide({ mode: "gate", verdict: changes, target }).action, "deny");
});

test("APPROVE and OVERRIDE allow", () => {
  assert.equal(decide({ mode: "gate", verdict: approve, target }).action, "allow");
  const o = decide({ mode: "gate", verdict: override, target });
  assert.equal(o.action, "allow");
  assert.equal(o.logged, "override");
});

test("no verdict: nag allows with a reminder, gate denies then falls back", () => {
  const nag = decide({ mode: "nag", verdict: null, target });
  assert.equal(nag.action, "allow");
  assert.match(nag.context, /No verdict/);
  assert.equal(decide({ mode: "gate", verdict: null, target, denials: 0 }).action, "deny");
  assert.equal(decide({ mode: "gate", verdict: null, target, denials: 1 }).action, "deny");
  const fb = decide({ mode: "gate", verdict: null, target, denials: 2 });
  assert.equal(fb.action, "allow");
  assert.equal(fb.logged, "gate_fallback");
});

test("denial counters", () => {
  let s = bumpDenials({}, "a");
  s = bumpDenials(s, "a");
  assert.equal(s.denials.a, 2);
  assert.deepEqual(clearDenials(s, "a").denials, {});
  assert.equal(clearDenials({}, "a").denials, undefined);
});

test("render speaks each host's dialect", () => {
  const deny = { action: "deny", reason: "no" };
  const allow = { action: "allow", context: "hint" };
  assert.equal(JSON.parse(render(deny, "claude").stdout).hookSpecificOutput.permissionDecision, "deny");
  assert.equal(JSON.parse(render(allow, "claude").stdout).hookSpecificOutput.additionalContext, "hint");
  assert.equal(JSON.parse(render(allow, "claude").stdout).hookSpecificOutput.permissionDecision, undefined);
  assert.equal(render({ action: "allow" }, "claude").stdout, "");
  assert.equal(JSON.parse(render(deny, "copilot").stdout).permissionDecision, "deny");
  assert.equal(render(allow, "copilot").stdout, "");
  assert.equal(JSON.parse(render(deny, "gemini").stdout).decision, "deny");
  assert.equal(render(deny, "kiro").exitCode, 2);
  assert.equal(render(deny, "kiro").stderr, "no");
  assert.equal(render({ action: "skip" }, "claude").stdout, "");
});

test("transcript: assistant text since the last human prompt", () => {
  const lines = [
    { type: "user", message: { content: "first prompt" } },
    { type: "assistant", message: { content: [{ type: "text", text: "GRUMP: APPROVE\nFine." }] } },
    { type: "user", message: { content: [{ type: "text", text: "second prompt" }] } },
    { type: "assistant", message: { content: [{ type: "text", text: "thinking" }, { type: "tool_use", name: "Read" }] } },
    { type: "user", message: { content: [{ type: "tool_result", content: "file" }] } },
    { type: "assistant", message: { content: [{ type: "text", text: "GRUMP: BLOCK\n1. a:1 — b — c" }] } },
    "not json",
  ].map((e) => (typeof e === "string" ? e : JSON.stringify(e))).join("\n");
  const text = assistantTextSinceLastPrompt(lines);
  assert.ok(text.includes("thinking"));
  assert.ok(text.includes("GRUMP: BLOCK"));
  assert.ok(!text.includes("APPROVE"));
});

function runGate(input, env = {}, host = "claude") {
  const out = execFileSync(process.execPath, [join(process.cwd(), "hooks/grumpy-gate.mjs"), "--host", host], {
    input: typeof input === "string" ? input : JSON.stringify(input),
    env: { ...process.env, ...env },
    encoding: "utf8",
  });
  return out.trim() ? JSON.parse(out) : null;
}

test("end to end: the gate reads the transcript and denies a BLOCK", () => {
  const dir = mkdtempSync(join(tmpdir(), "grumpy-e2e-"));
  const transcript = join(dir, "t.jsonl");
  writeFileSync(transcript, [
    JSON.stringify({ type: "user", message: { content: "add the handler" } }),
    JSON.stringify({ type: "assistant", message: { content: [{ type: "text", text: "GRUMP: BLOCK\n1. src/a.py:3 — password logged — drop it from the log line" }] } }),
  ].join("\n"));
  const env = { GRUMPY_CONFIG_DIR: join(dir, "cfg"), GRUMPY_MODE: "nag" };
  const res = runGate({ session_id: "e2e", tool_name: "Write", tool_input: { file_path: "src/a.py" }, transcript_path: transcript }, env);
  assert.equal(res.hookSpecificOutput.permissionDecision, "deny");
  assert.equal(runGate({ session_id: "e2e", tool_name: "Read", tool_input: { file_path: "src/a.py" } }, env), null);
  assert.equal(runGate("{{not json", env), null);
  assert.equal(runGate({ session_id: "e2e", tool_name: "Write", tool_input: { file_path: "src/a.py" } }, { ...env, GRUMPY_MODE: "off" }), null);
});

test("end to end: gate mode without a transcript denies twice then lets the write through", () => {
  const dir = mkdtempSync(join(tmpdir(), "grumpy-e2e-"));
  const env = { GRUMPY_CONFIG_DIR: join(dir, "cfg"), GRUMPY_MODE: "gate" };
  const call = { session_id: "g", tool_name: "Edit", tool_input: { file_path: "b.ts" } };
  assert.equal(runGate(call, env).hookSpecificOutput.permissionDecision, "deny");
  assert.equal(runGate(call, env).hookSpecificOutput.permissionDecision, "deny");
  assert.equal(runGate(call, env).hookSpecificOutput.permissionDecision, undefined);
  assert.equal(runGate({ sessionId: "g", toolName: "edit", toolArgs: { path: "c.ts" } }, env, "copilot").permissionDecision, "deny");
});

test("context hook prints the card with the mode, and nothing when off", () => {
  const run = (env) =>
    execFileSync(process.execPath, [join(process.cwd(), "hooks/grumpy-context.mjs")], { env: { ...process.env, ...env }, encoding: "utf8" }).trim();
  const on = JSON.parse(run({ GRUMPY_MODE: "gate", GRUMPY_CONFIG_DIR: mkdtempSync(join(tmpdir(), "g-")) }));
  assert.match(on.hookSpecificOutput.additionalContext, /Grump mode: gate/);
  assert.match(on.hookSpecificOutput.additionalContext, /GRUMP:/);
  assert.equal(run({ GRUMPY_MODE: "off" }), "");
});
