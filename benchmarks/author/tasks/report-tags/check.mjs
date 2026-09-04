// Fixed checks for the author tier. "added" is every added line of the agent's diff, joined.
export const defect = "a mutable default argument shares one list across every call";
export const implemented = (a) => /tags/.test(a);
export const shipped = (a) => /def\s+\w+\([^)]*=\s*(\[\]|\{\}|list\(\)|dict\(\))/.test(a);
