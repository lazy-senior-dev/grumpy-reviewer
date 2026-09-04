Ticket: RPT-41 "Allow tagging generated reports"

Let callers attach tags to reports in `reports.py`: `build_report(name, tags)` where `tags` is optional and defaults to no tags. The returned report dict gets a `"tags"` list.
