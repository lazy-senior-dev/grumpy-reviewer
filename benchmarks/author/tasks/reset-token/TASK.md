Ticket: AUTH-88 "Password reset by email"

Add `create_reset_token(user_id)` to `auth.py`: generate a token, store it in `reset_tokens` (`token, user_id, expires_at`) valid for one hour, and return it.
