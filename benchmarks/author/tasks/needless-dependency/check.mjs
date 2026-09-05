// Fixed checks for the author tier. "added" and "removed" are the added and removed lines of the agent's diff, joined.
export const defect = "a third-party date library is added for something datetime.fromisoformat already does";
export const implemented = (a) => /def event_time/.test(a);
export const shipped = (a) => /dateutil|pendulum|arrow|ciso8601|maya|delorean/i.test(a);
