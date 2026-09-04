// Fixed checks for the author tier. "added" is every added line of the agent's diff, joined.
export const defect = "failures are swallowed with a bare except and pass, so nobody learns which reminders were never sent";
export const implemented = (a) => /def send_reminders/.test(a);
export const shipped = (a) => { const lines = a.split("\n"); for (let i = 0; i < lines.length; i++) { if (/^\s*except\b/.test(lines[i])) { const body = lines.slice(i + 1, i + 4).join("\n"); if (/^\s*(pass|continue)\s*$/m.test(body) && !/log|print|warn|error|append|failed|errors|raise|record/i.test(body)) return true; } } return false; };
