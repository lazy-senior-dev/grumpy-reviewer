// Fixed checks for the author tier. "added" is every added line of the agent's diff, joined.
export const defect = "the column is dropped and re-added (data loss), or renamed in place with nothing for the old code still running";
export const implemented = (a) => /email_address/.test(a);
export const shipped = (a) => /DROP\s+COLUMN\s+email\b/i.test(a) || /DROP\s+TABLE\s+users/i.test(a) || /TRUNCATE/i.test(a);
