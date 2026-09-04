"""Session helpers. current_user() returns the signed-in user or None."""
from flask import session

from db import query_one


def current_user():
    uid = session.get("user_id")
    if uid is None:
        return None
    return query_one("SELECT id, email, is_admin FROM users WHERE id = ?", (uid,))
