// SPDX-FileCopyrightText: 2026 Sandeep Bazar
// SPDX-License-Identifier: Apache-2.0
// SARIF 2.1.0 output. The review is otherwise reported through one vendor's pull-request comment
// API, which means the findings exist only inside that vendor. SARIF is the OASIS standard for
// static-analysis results and is read by GitHub code scanning, GitLab, Azure DevOps, and every
// SARIF viewer, so the same findings survive outside the host that produced them.
//
// Spec: https://docs.oasis-open.org/sarif/sarif/v2.1.0/sarif-v2.1.0.html
import { createHash } from "node:crypto";

// A verdict is about the whole change; SARIF levels are per result. BLOCK is the only verdict that
// stops a merge, so it is the only one raised to error. A finding the model wrote in a shape the
// parser could not read is reported as a note rather than dropped: silently losing it would make a
// broken reply look like a clean one.
const LEVEL = { BLOCK: "error", REQUEST_CHANGES: "warning", APPROVE: "note" };

const RULES = [
  { id: "review/block", name: "BlockingDefect", level: "error",
    short: "A defect that must not reach the branch",
    full: "Secrets, injection, authentication and authorisation holes, and data loss. Blocking is not downgraded by mode." },
  { id: "review/finding", name: "ReviewFinding", level: "warning",
    short: "A defect with a named line and a smallest fix",
    full: "A correctness, reliability, or security problem. Each one names the line, states how it fails, and gives the smallest fix." },
  { id: "review/unparsed", name: "UnparsedFinding", level: "note",
    short: "A finding that did not parse",
    full: "The reviewer produced a finding the verdict parser could not read. It is reported verbatim rather than dropped, because a lost finding looks like a clean review." },
];

// SARIF consumers use partialFingerprints to keep an alert stable as surrounding lines move. The
// hash deliberately excludes the line number for that reason.
const fingerprint = (file, text) => createHash("sha256").update(`${file}\n${text}`).digest("hex").slice(0, 32);

export function toSarif({ results, verdict, tool = {}, repoRoot = "" } = {}) {
  const sarifResults = [];
  for (const r of results || []) {
    if (!r.verdict) continue;
    const file = String(r.file?.filename || "").replace(/^\/+/, "");
    const uri = repoRoot && file.startsWith(repoRoot) ? file.slice(repoRoot.length).replace(/^\/+/, "") : file;
    for (const f of [...(r.verdict.findings || []), ...(r.verdict.malformed || [])]) {
      const complete = Boolean(f.complete);
      const ruleId = !complete ? "review/unparsed" : r.verdict.verdict === "BLOCK" ? "review/block" : "review/finding";
      const text = complete ? `${f.failure}\n\nSmallest fix: ${f.fix}` : String(f.raw || "").trim();
      const region = Number.isInteger(f.line) && f.line > 0 ? { startLine: f.line } : undefined;
      sarifResults.push({
        ruleId,
        level: !complete ? "note" : LEVEL[r.verdict.verdict] || "warning",
        message: { text },
        // A result with no location at all is dropped by some consumers, so a finding whose line
        // did not parse is still anchored to its file.
        locations: [{ physicalLocation: { artifactLocation: { uri, uriBaseId: "%SRCROOT%" }, ...(region ? { region } : {}) } }],
        partialFingerprints: { primaryLocationLineHash: fingerprint(uri, text) },
      });
    }
  }
  return {
    $schema: "https://json.schemastore.org/sarif-2.1.0.json",
    version: "2.1.0",
    runs: [{
      tool: {
        driver: {
          name: tool.name || "grumpy-reviewer",
          informationUri: tool.informationUri || "https://github.com/lazy-senior-dev/grumpy-reviewer",
          ...(tool.version ? { version: tool.version } : {}),
          rules: RULES.map((r) => ({
            id: r.id,
            name: r.name,
            shortDescription: { text: r.short },
            fullDescription: { text: r.full },
            defaultConfiguration: { level: r.level },
          })),
        },
      },
      properties: { verdict: verdict || null, ...(tool.model ? { model: tool.model } : {}) },
      originalUriBaseIds: { "%SRCROOT%": { uri: "file:///" } },
      results: sarifResults,
    }],
  };
}
