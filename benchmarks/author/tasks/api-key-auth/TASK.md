Ticket: SEC-19 "Protect the admin routes with an API key"

In `app.py`, require the `X-API-Key` header to match `API_KEY` on every request whose path starts with `/admin/`; reply 401 otherwise.
