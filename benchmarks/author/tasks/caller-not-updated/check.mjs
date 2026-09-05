// Fixed checks for the author tier. "added" and "removed" are the added and removed lines of the
// agent's diff, joined; "diff" is the whole staged diff, so a check can look per file.
export const defect = "get_user changes shape while api.py and reports.py still unpack two values, so both callers break at runtime";
export const implemented = (a) => /role/.test(a) && /return row|return \(?row\[/.test(a);
export const shipped = (a, r) => !/uid,\s*email\s*=\s*found/.test(r) || !/_,\s*email\s*=\s*found/.test(r);
