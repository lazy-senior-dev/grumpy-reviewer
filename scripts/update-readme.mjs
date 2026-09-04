#!/usr/bin/env node
// Fill the benchmark block of README.md from benchmarks/results/latest.json.
// The block sits between <!-- bench:start --> and <!-- bench:end -->; everything else is hand-written.
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const readmePath = join(ROOT, "README.md");
const latestPath = join(ROOT, "benchmarks", "results", "latest.json");
const readme = readFileSync(readmePath, "utf8");

const TBD = `**Numbers: TBD.** Run \`npm run bench\` and \`npm run bench:report\` with a headless agent installed (\`claude\`, \`codex\`, or \`agy\`) or an \`ANTHROPIC_API_KEY\`; the table below fills in from \`benchmarks/results/latest.json\`.`;

function block() {
  if (!existsSync(latestPath)) return { hero: TBD, table: "" };
  const d = JSON.parse(readFileSync(latestPath, "utf8"));
  const rows = Object.entries(d.agents).filter(([, a]) => a.arms?.grump);
  if (!rows.length) return { hero: TBD, table: "" };
  const [, first] = rows[0];
  const b = first.arms.bare, g = first.arms.grump, ge = first.arms.generic;
  const n = d.seeded;
  const fmt = (arm) => (arm && arm.caughtMedian != null ? `${arm.caughtMedian}/${n}` : "n/a");
  const hero = `**${fmt(g)} seeded defects caught with the Grump, ${fmt(b)} without, ${fmt(ge)} with a generic "review carefully" prompt** (${first.label}, \`${g.model}\`, median of ${g.runs} run${g.runs === 1 ? "" : "s"}; ${g.falsePositivesMedian ?? "n/a"} false alarm${g.falsePositivesMedian === 1 ? "" : "s"} on ${d.clean} clean diffs). Same diff, same model; only the reviewer changes. Measured ${d.date}; [method and raw replies](benchmarks/results).`;
  let table = `| Agent | Model | No skill | Generic prompt | **Grump** | False alarms (Grump, of ${d.clean}) | BLOCK precision | Extra input tokens per review |\n|---|---|---|---|---|---|---|---|\n`;
  for (const [, a] of rows) {
    const gg = a.arms.grump, bb = a.arms.bare, gen = a.arms.generic;
    const overhead = gg.inputTokensMedian != null && bb?.inputTokensMedian != null ? Math.round(gg.inputTokensMedian - bb.inputTokensMedian) : "n/a";
    table += `| ${a.label} | \`${gg.model}\` (n=${gg.runs}) | ${fmt(bb)} | ${fmt(gen)} | **${fmt(gg)}** | ${gg.falsePositivesMedian ?? "n/a"} | ${gg.blockPrecision == null ? "n/a" : Math.round(gg.blockPrecision * 100) + "%"} | ${overhead} |\n`;
  }
  return { hero, table };
}

const { hero, table } = block();
const heroOut = readme.replace(/<!-- bench:hero:start -->[\s\S]*?<!-- bench:hero:end -->/, `<!-- bench:hero:start -->\n${hero}\n<!-- bench:hero:end -->`);
const out = heroOut.replace(/<!-- bench:table:start -->[\s\S]*?<!-- bench:table:end -->/, `<!-- bench:table:start -->\n${table || "_No results yet._"}\n<!-- bench:table:end -->`);
if (out !== readme) {
  writeFileSync(readmePath, out);
  console.log("README benchmark block updated");
} else console.log("README benchmark block unchanged");
