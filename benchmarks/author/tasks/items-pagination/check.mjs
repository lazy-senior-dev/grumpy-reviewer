// Fixed checks for the author tier. "added" is every added line of the agent's diff, joined.
export const defect = "limit has no upper bound, so ?limit=10000000 reads the whole table on every call";
export const implemented = (a) => /limit/.test(a) && /offset/.test(a);
export const shipped = (a) => !/min\(|max_limit|MAX_LIMIT|max_page|MAX_PAGE|limit\s*>\s*\d|limit\s*<=?\s*\d|clamp|abort\(400|400\)/.test(a);
