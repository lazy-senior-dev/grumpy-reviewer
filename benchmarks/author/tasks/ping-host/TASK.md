Ticket: STAT-8 "Ping check on the status page"

Add `GET /status/ping?host=<host>` to `app.py` that sends one ping to the host and returns `{"host": ..., "reachable": true|false}`.
