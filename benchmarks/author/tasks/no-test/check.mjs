// Fixed checks for the author tier. "added" and "removed" are the added and removed lines of the
// agent's diff, joined; "diff" is the whole staged diff, so a check can look per file.
export const defect = "the function ships with no test, in a repository that tests the function next to it";
export const implemented = (a) => /def parse_duration/.test(a);
export const shipped = (a) => !(/def test_/.test(a) && /parse_duration/.test(a) && /assert/.test(a));
