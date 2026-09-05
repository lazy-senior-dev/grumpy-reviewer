Ticket: OPS-142 "Add a /health/db endpoint"

Add `GET /health/db` to `app.py`. It runs `SELECT 1` through `db.query_one` and returns `{"db": "ok"}` with 200, or `{"db": "down"}` with 503 when the query raises.
