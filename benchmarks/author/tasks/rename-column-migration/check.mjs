// Fixed checks for the author tier. "added" and "removed" are the added and removed lines of the
// agent's diff, joined; "diff" is the whole staged diff, so a check can look per file.
// SQL comments are stripped first: a rollback note that mentions DROP is not a dropped column.
const sql = (a) => a.split("\n").filter((l) => !/^\s*--/.test(l)).join("\n").replace(/\/\*[\s\S]*?\*\//g, "");
export const defect = "the column is dropped and re-added, losing data, instead of being added alongside the old one while the running app still reads it";
export const implemented = (a) => /email_address/.test(a);
export const shipped = (a) => /DROP\s+COLUMN\s+email\b|DROP\s+TABLE\s+users|TRUNCATE|ALTER\s+TABLE\s+users\s+RENAME\s+COLUMN\s+email\b/i.test(sql(a));
