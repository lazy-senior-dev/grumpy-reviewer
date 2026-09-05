from flask import Flask, jsonify

import users

app = Flask(__name__)


@app.get("/profile/<int:user_id>")
def profile(user_id):
    found = users.get_user(user_id)
    if found is None:
        return "", 404
    uid, email = found
    return jsonify({"id": uid, "email": email})
