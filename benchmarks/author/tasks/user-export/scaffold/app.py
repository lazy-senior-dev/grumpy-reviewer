from flask import Flask, jsonify

from auth import current_user
from db import query_all, query_one

app = Flask(__name__)
app.secret_key = "dev"


@app.get("/me")
def me():
    user = current_user()
    return (jsonify(user), 200) if user else ("", 401)
