// Fixed checks for the author tier. "added" and "removed" are the added and removed lines of the agent's diff, joined.
export const defect = "the diff also rewrites handlers the ticket did not ask about, so an unrelated change ships under this ticket";
export const implemented = (a) => /health\/db/.test(a);
export const shipped = (a, r) => /get_order|list_items|order %s served|for i in range|== None|!= None/.test(r);
