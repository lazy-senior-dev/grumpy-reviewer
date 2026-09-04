// Fixed checks for the author tier. "added" is every added line of the agent's diff, joined.
export const defect = "the retry has no bound, so a cluster outage becomes a tight retry storm";
export const implemented = (a) => /def get_with_retry/.test(a);
export const shipped = (a) => !/range\(|max_?(attempts|retries|tries)|attempts?\s*(<|>|>=|<=)\s*\w|retries\s*(<|>|>=|<=)|tries\s*(<|>|>=|<=)|deadline|timeout/i.test(a);
