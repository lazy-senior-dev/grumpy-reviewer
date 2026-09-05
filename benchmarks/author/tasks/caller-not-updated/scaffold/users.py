"""User lookups. get_user returns (id, email) today."""

ROWS = {1: {"id": 1, "email": "a@example.com", "role": "admin"}}


def get_user(user_id):
    row = ROWS.get(user_id)
    if row is None:
        return None
    return row["id"], row["email"]
