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

// Needle tier: one seeded defect buried in a four-file pull request of otherwise clean changes.
// Built deterministically from the seeded and clean sets, so the cases stay original and reproducible.
const NEEDLES = [
  ["s01-py-user-id-from-body", ["c06-py-type-hints-docstrings", "c10-py-validated-config", "c01-py-retry-with-tests"]],
  ["s05-py-swallowed-exception", ["c01-py-retry-with-tests", "c06-py-type-hints-docstrings", "c10-py-validated-config"]],
  ["s06-py-off-by-one", ["c10-py-validated-config", "c01-py-retry-with-tests", "c06-py-type-hints-docstrings"]],
  ["s10-ts-wrong-http-status", ["c02-ts-rename-helper", "c07-ts-add-unit-test", "c05-gha-add-cache"]],
  ["s11-ts-race-check-then-set", ["c07-ts-add-unit-test", "c02-ts-rename-helper", "c05-gha-add-cache"]],
  ["s15-ts-unbounded-body", ["c02-ts-rename-helper", "c05-gha-add-cache", "c07-ts-add-unit-test"]],
  ["s17-go-ignored-error", ["c08-go-error-wrapping", "c03-go-add-flag", "c09-k8s-add-pdb"]],
  ["s21-go-nil-deref", ["c03-go-add-flag", "c08-go-error-wrapping", "c04-k8s-scale-with-limits"]],
  ["s23-go-no-http-timeout", ["c08-go-error-wrapping", "c09-k8s-add-pdb", "c03-go-add-flag"]],
  ["s25-k8s-no-resource-limits", ["c04-k8s-scale-with-limits", "c09-k8s-add-pdb", "c05-gha-add-cache"]],
];

function stripTicket(diff) {
  return diff.replace(/^Ticket: .*\n\n?/, "");
}

export function buildNeedles(seeded, clean) {
  const byId = Object.fromEntries([...seeded, ...clean].map((c) => [c.id, c]));
  return NEEDLES.map(([sid, cids], i) => {
    const s = byId[sid];
    const parts = cids.map((id) => byId[id]);
    const all = [...parts.slice(0, i % 3), s, ...parts.slice(i % 3)];
    const ticket = `Ticket: REL-${140 + i} "Release branch: ${all.map((c) => c.ticket.replace(/^[A-Z]+-\d+ /, "").replace(/^"|"$/g, "").toLowerCase()).join("; ")}"`;
    const diff = ticket + "\n\n" + all.map((c) => stripTicket(c.diff).trim()).join("\n\n") + "\n";
    return { ...s, id: `n${String(i + 1).padStart(2, "0")}-${sid}`, tier: "needle", clean: false, diff, ticket: ticket.replace(/^Ticket: /, ""), parts: all.map((c) => c.id), lines: undefined };
  });
}

export function loadCases({ tiers = ["seeded", "clean", "needle"] } = {}) {
  const seeded = loadDir("seeded", false).map((c) => ({ ...c, tier: "seeded" }));
  const clean = loadDir("clean", true).map((c) => ({ ...c, tier: "clean" }));
  const needle = buildNeedles(seeded, clean);
  return [...(tiers.includes("seeded") ? seeded : []), ...(tiers.includes("clean") ? clean : []), ...(tiers.includes("needle") ? needle : [])];
}
