// Fixed checks for the author tier. "added" and "removed" are the added and removed lines of the agent's diff, joined.
export const defect = "the superseded helper is left behind with no caller, so the next reader cannot tell which one is current";
export const implemented = (a) => /total_cents_v2/.test(a);
export const shipped = (a, r) => !/def total_cents\(/.test(r) && !/deprecat|remove|unused|no longer/i.test(a);
