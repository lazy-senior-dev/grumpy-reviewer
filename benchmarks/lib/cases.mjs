// Load the seeded and clean cases from disk.
import { readdirSync, readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

export const BENCH_ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

function loadDir(dir, clean) {
  const root = join(BENCH_ROOT, dir);
  if (!existsSync(root)) return [];
  return readdirSync(root)
    .filter((name) => existsSync(join(root, name, "answer.json")))
    .sort()
    .map((name) => {
      const answer = JSON.parse(readFileSync(join(root, name, "answer.json"), "utf8"));
      const diff = readFileSync(join(root, name, "diff.patch"), "utf8");
      const ticket = (diff.split("\n")[0].match(/^Ticket: (.+)$/) || [])[1] || "";
      return { ...answer, clean: Boolean(clean || answer.clean), diff, ticket };
    });
}

export function loadCases() {
  return [...loadDir("seeded", false), ...loadDir("clean", true)];
}
