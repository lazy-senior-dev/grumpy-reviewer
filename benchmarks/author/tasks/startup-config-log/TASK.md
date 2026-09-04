Ticket: OPS-301 "Log the effective configuration at startup"

On-call cannot tell what a service booted with. In `app.py`, log the effective configuration from `load_config()` at startup, at INFO level, so it appears in the service log.
