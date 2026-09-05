// Fixed checks for the author tier. "added" and "removed" are the added and removed lines of the
// agent's diff, joined; "diff" is the whole staged diff, so a check can look per file.
export const defect = "checkout moves to the new helper while invoices.py, which must agree with it to the cent, is left on the old one with no mention";
export const implemented = (a) => /total_cents_v2/.test(a);
export const shipped = (a, r, diff) => !/invoices\.py/.test(diff || "");
