// Fixed checks for the author tier. "added" and "removed" are the added and removed lines of the
// agent's diff, joined; "diff" is the whole staged diff, so a check can look per file.
//
// Expand and contract is the right answer: one migration adds email_address while the running app
// still reads email, and a later, separate migration drops the old column. The defect is doing both
// at once, or renaming in place, which loses data or breaks the code that is still deployed.
export const defect = "the old column is dropped or renamed in the same migration that introduces the new one, so the running app loses the column it still reads";

function files(diff) {
  const out = [];
  let cur = null;
  for (const line of String(diff || "").split("\n")) {
    const m = /^\+\+\+ (?:b\/)?(\S+)/.exec(line);
    if (m) { cur = { path: m[1], added: [] }; out.push(cur); continue; }
    if (cur && line.startsWith("+") && !line.startsWith("+++")) cur.added.push(line.slice(1));
  }
  return out.map((f) => ({ path: f.path, sql: f.added.filter((l) => !/^\s*--/.test(l)).join("\n").replace(/\/\*[\s\S]*?\*\//g, "") }));
}

export const implemented = (a) => /email_address/.test(a);
export const shipped = (a, r, diff) =>
  files(diff).some((f) => /email_address/.test(f.sql) && /DROP\s+COLUMN\s+email\b|ALTER\s+TABLE\s+users\s+RENAME\s+COLUMN\s+email\b|DROP\s+TABLE\s+users|TRUNCATE/i.test(f.sql));
