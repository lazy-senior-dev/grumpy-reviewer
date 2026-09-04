#!/usr/bin/env node
// Capture a real review run for the recording: stage a sample change in a scratch repo, run the
// CLI with one agent, and save the terminal transcript (command, stderr status line, stdout
// verdict, timing) as JSON that scripts/render-demo.py can play back frame by frame.
//   node scripts/capture-run.mjs --agent claude [--case s01-py-user-id-from-body] [--out assets/recordings/claude.json]
import { execFileSync, spawnSync } from "node:child_process";
import { mkdtempSync, writeFileSync, mkdirSync, readFileSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const P = JSON.parse(readFileSync(join(ROOT, "persona.json"), "utf8"));
const args = process.argv.slice(2);
const opt = (k, d) => { const i = args.indexOf(k); return i > -1 ? args[i + 1] : d; };
const agent = opt("--agent", "claude");
const caseId = opt("--case", null);
const out = opt("--out", join(ROOT, "assets", "recordings", `${agent}.json`));

// pick a seeded case and apply its diff to a scratch repository
const seededDir = join(ROOT, "benchmarks", "seeded");
const id = caseId || readFileSync(join(ROOT, "benchmarks", "seeded", "..", "..", "persona.json"), "utf8") && (existsSync(join(seededDir, "s01-py-user-id-from-body")) ? "s01-py-user-id-from-body" : execFileSync("ls", [seededDir], { encoding: "utf8" }).trim().split("\n")[0]);
const patch = readFileSync(join(seededDir, id, "diff.patch"), "utf8");
const body = patch.slice(patch.indexOf("diff --git"));
const repo = mkdtempSync(join(tmpdir(), "lsd-rec-"));
execFileSync("git", ["init", "-q"], { cwd: repo });
execFileSync("git", ["-c", "user.name=demo", "-c", "user.email=demo@example.com", "commit", "-q", "--allow-empty", "-m", "base"], { cwd: repo });
// create the pre-image for modified files so the patch applies, then apply and stage
for (const m of body.matchAll(/^--- a\/(\S+)\n\+\+\+ b\/\S+\n@@ -(\d+)/gm)) {
  const file = m[1], start = Number(m[2]);
  const hunk = body.slice(m.index);
  const lines = hunk.split("\n").slice(3).filter((l) => l.startsWith(" ") || l.startsWith("-")).map((l) => l.slice(1));
  const pre = Array.from({ length: start - 1 }, (_, i) => `# line ${i + 1}`).concat(lines);
  mkdirSync(join(repo, dirname(file)), { recursive: true });
  writeFileSync(join(repo, file), pre.join("\n") + "\n");
}
execFileSync("git", ["add", "-A"], { cwd: repo });
execFileSync("git", ["-c", "user.name=demo", "-c", "user.email=demo@example.com", "commit", "-q", "--allow-empty", "-m", "pre"], { cwd: repo });
const applied = spawnSync("git", ["apply", "--whitespace=nowarn", "-"], { cwd: repo, input: body + "\n", encoding: "utf8" });
if (applied.status !== 0) {
  // fall back to writing the new-file content of added files
  for (const m of body.matchAll(/^\+\+\+ b\/(\S+)\n@@[^\n]*\n([\s\S]*?)(?=^diff --git|\Z(?![\s\S]))/gm)) {
    const file = m[1];
    const content = m[2].split("\n").filter((l) => l.startsWith("+")).map((l) => l.slice(1)).join("\n") + "\n";
    mkdirSync(join(repo, dirname(file)), { recursive: true });
    writeFileSync(join(repo, file), content);
  }
}
execFileSync("git", ["add", "-A"], { cwd: repo });

const cmd = `npx github:lazy-senior-dev/${P.slug} review --staged --agent ${agent}`;
const started = Date.now();
const res = spawnSync(process.execPath, [join(ROOT, "bin", `${P.command}.mjs`), "review", "--staged", "--agent", agent], { cwd: repo, encoding: "utf8", env: process.env, maxBuffer: 20 * 1024 * 1024 });
const durationMs = Date.now() - started;
const transcript = {
  persona: P.slug, agent, case: id, command: cmd, durationMs, exitCode: res.status,
  stderr: (res.stderr || "").trim().split("\n").filter(Boolean),
  stdout: (res.stdout || "").trim().split("\n"),
  recordedAt: new Date().toISOString(),
};
mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, JSON.stringify(transcript, null, 2) + "\n");
console.log(`${agent}: exit ${res.status}, ${Math.round(durationMs / 1000)} s, ${transcript.stdout.length} lines -> ${out.replace(ROOT + "/", "")}`);
