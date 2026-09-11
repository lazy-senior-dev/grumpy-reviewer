import { test } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, readdirSync, rmSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname;
const PKG = JSON.parse(readFileSync(join(ROOT, "package.json"), "utf8"));
const BIN = join(ROOT, Object.values(PKG.bin)[0]);
const HOST_DIR = ".bob"; // the one host whose install merges into a settings file rather than only copying

const run = (cwd, ...a) => execFileSync("node", [BIN, ...a], { cwd, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
const entries = (dir) => {
  const out = [];
  const walk = (d, rel = "") => {
    for (const e of readdirSync(d, { withFileTypes: true })) {
      if (e.name === ".git") continue;
      const r = rel ? `${rel}/${e.name}` : e.name;
      out.push(r);
      if (e.isDirectory()) walk(join(d, e.name), r);
    }
  };
  walk(dir);
  return out.sort();
};
const project = () => {
  const d = mkdtempSync(join(tmpdir(), "lsd-install-"));
  execFileSync("git", ["init", "-q"], { cwd: d });
  return d;
};

test("uninstall leaves nothing behind when install created everything", () => {
  const d = project();
  try {
    assert.equal(entries(d).length, 0, "a fresh project starts empty");
    run(d, "install", "all");
    assert.ok(entries(d).length > 10, "install writes the host files");
    run(d, "uninstall", "all");
    // Not just the files: a directory left empty is still a trace of a tool that claims to remove
    // exactly what it added.
    assert.deepEqual(entries(d), [], "uninstall removes its files and the directories it created");
  } finally { rmSync(d, { recursive: true, force: true }); }
});

test("uninstall keeps files the user put in the same directories", () => {
  const d = project();
  try {
    mkdirSync(join(d, HOST_DIR, "rules"), { recursive: true });
    writeFileSync(join(d, HOST_DIR, "rules", "my-team.md"), "my own rule\n");
    run(d, "install", "all");
    run(d, "uninstall", "all");
    assert.ok(existsSync(join(d, HOST_DIR, "rules", "my-team.md")), "a user's own rule survives");
    assert.equal(readFileSync(join(d, HOST_DIR, "rules", "my-team.md"), "utf8"), "my own rule\n");
  } finally { rmSync(d, { recursive: true, force: true }); }
});

test("uninstall restores a settings file the user already had", () => {
  const d = project();
  try {
    const mine = { theme: "dark", hooks: { PreToolUse: [{ hooks: [{ type: "command", command: "echo mine" }] }] } };
    mkdirSync(join(d, HOST_DIR), { recursive: true });
    writeFileSync(join(d, HOST_DIR, "settings.json"), JSON.stringify(mine, null, 2) + "\n");
    run(d, "install", "all");
    run(d, "uninstall", "all");
    assert.deepEqual(JSON.parse(readFileSync(join(d, HOST_DIR, "settings.json"), "utf8")), mine,
      "the user's own settings and hooks come back exactly as they were");
  } finally { rmSync(d, { recursive: true, force: true }); }
});
