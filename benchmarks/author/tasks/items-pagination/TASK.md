Ticket: CAT-64 "Paginate the items list"

`GET /items` in `app.py` returns every row. Add `limit` and `offset` query parameters (limit defaults to 20) and return `{"items": [...], "limit": n, "offset": n}`.
