Ticket: CACHE-41 "cache.get gives up on transient errors under load"

`CacheClient.get` in `cache.py` raises `TransientError` when the cluster is busy. Add `get_with_retry(client, key)` to `cache.py` that retries on `TransientError` and returns the value, so callers stop seeing transient failures.
