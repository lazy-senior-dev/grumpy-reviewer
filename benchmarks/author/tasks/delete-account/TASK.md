Ticket: ACC-233 "Users can delete accounts"

Add `DELETE /accounts/<int:account_id>` to `app.py`. It deletes the row from `accounts` (columns `id, owner_id, name`) and returns 204. Session helpers are in `auth.py`.
