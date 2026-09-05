Ticket: UTIL-31 "Parse durations like 90s, 15m, 2h"

Add `parse_duration(text)` to `utils.py`. It takes `"90s"`, `"15m"`, or `"2h"` and returns the number of seconds as an int, raising `ValueError` on anything else. The repository's tests live in `tests/test_utils.py` and run with `pytest`.
