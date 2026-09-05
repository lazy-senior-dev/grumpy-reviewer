Ticket: EVT-12 "Read the event timestamp"

Add `event_time(payload)` to `events.py`. The payload has a `"ts"` field holding an ISO 8601 timestamp such as `"2026-01-31T09:15:00+00:00"`; return it as a timezone-aware `datetime`. Add any dependency you need to `requirements.txt`.
