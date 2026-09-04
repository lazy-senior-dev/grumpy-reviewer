from flask import Flask, jsonify

from auth import current_user
from db import execute, query_one

app = Flask(__name__)
app.secret_key = "dev"


@app.get("/accounts/<int:account_id>")
def get_account(account_id):
    row = query_one("SELECT id, owner_id, name FROM accounts WHERE id = ?", (account_id,))
    return (jsonify(row), 200) if row else ("", 404)
