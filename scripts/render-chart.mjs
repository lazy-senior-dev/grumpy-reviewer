#!/usr/bin/env node
// Draw assets/benchmark.svg from benchmarks/results/latest.json: defects caught per arm,
// one group of bars per agent. Renders a PNG next to it when headless Chrome is available.
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const src = join(ROOT, "benchmarks", "results", "latest.json");
if (!existsSync(src)) {
  console.log("no benchmarks/results/latest.json yet; run npm run bench and npm run bench:report first");
  process.exit(0);
}
const data = JSON.parse(readFileSync(src, "utf8"));
const agents = Object.entries(data.agents).filter(([, a]) => a.arms?.grump);
const arms = [
  { key: "bare", label: "no skill", fill: "#bdb6aa" },
  { key: "generic", label: "generic prompt", fill: "#7a746b" },
  { key: "grump", label: "grumpy-reviewer", fill: "#ff8a65" },
];

const W = 960, H = 120 + agents.length * 150, left = 220, right = 60, barH = 30, gap = 8;
const scaleW = W - left - right;
const x = (v) => left + (v / data.seeded) * scaleW;
let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" font-family="-apple-system, Segoe UI, Helvetica, Arial, sans-serif">
<rect width="${W}" height="${H}" fill="#f4efe6"/>
<text x="${left}" y="44" font-size="24" font-weight="700" fill="#1f1f1f" font-family="Georgia, serif">Defects caught out of ${data.seeded} seeded diffs</text>
<text x="${left}" y="68" font-size="13" fill="#7a746b">Median over runs. Same diff, same agent, same model; only the reviewer changes. ${data.date}.</text>`;
for (let g = 0; g <= data.seeded; g += 5) {
  svg += `<line x1="${x(g)}" y1="88" x2="${x(g)}" y2="${H - 30}" stroke="#d8d0c2" stroke-width="1"/><text x="${x(g)}" y="${H - 12}" font-size="12" fill="#7a746b" text-anchor="middle">${g}</text>`;
}
agents.forEach(([, a], i) => {
  const top = 100 + i * 150;
  svg += `<text x="${left - 16}" y="${top + 14}" font-size="15" font-weight="700" fill="#1f1f1f" text-anchor="end">${a.label}</text>`;
  svg += `<text x="${left - 16}" y="${top + 32}" font-size="11" fill="#7a746b" text-anchor="end">${(a.arms.grump.model || "").slice(0, 28)}, n=${a.arms.grump.runs}</text>`;
  arms.forEach((arm, j) => {
    const s = a.arms[arm.key];
    const y = top + j * (barH + gap);
    const v = s?.caughtMedian ?? 0;
    svg += `<rect x="${left}" y="${y}" width="${Math.max(2, x(v) - left)}" height="${barH}" rx="4" fill="${arm.fill}"/>`;
    svg += `<text x="${x(v) + 8}" y="${y + 20}" font-size="14" font-weight="700" fill="#1f1f1f">${s ? v : "n/a"}</text>`;
    if (i === 0) svg += `<text x="${left + 8}" y="${y + 20}" font-size="12" fill="${arm.key === "grump" ? "#1f1f1f" : "#fff"}">${arm.label}</text>`;
  });
});
svg += `</svg>\n`;
const out = join(ROOT, "assets", "benchmark.svg");
writeFileSync(out, svg);
console.log("wrote assets/benchmark.svg");

const chrome = ["/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", "google-chrome", "chromium", "chromium-browser"].find((c) => {
  try {
    execFileSync("sh", ["-c", `command -v "${c}"`], { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
});
if (chrome) {
  const html = join(ROOT, "assets", ".chart.html");
  writeFileSync(html, `<html><body style="margin:0"><img src="benchmark.svg" width="${W}" height="${H}" style="display:block"></body></html>`);
  try {
    execFileSync(chrome, ["--headless=new", "--disable-gpu", "--hide-scrollbars", `--window-size=${W},${H}`, `--screenshot=${join(ROOT, "assets", "benchmark.png")}`, `file://${html}`], { stdio: "ignore" });
    console.log("wrote assets/benchmark.png");
  } catch (err) {
    console.log("PNG render skipped: " + err.message);
  } finally {
    try { (await import("node:fs")).unlinkSync(html); } catch {}
  }
} else {
  console.log("no headless Chrome found; SVG only");
}
