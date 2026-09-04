from flask import Flask, jsonify, request

from db import execute, query_one

app = Flask(__name__)


@app.get("/orders/<int:order_id>")
def get_order(order_id):
    return jsonify(query_one("SELECT id, status FROM orders WHERE id = ?", (order_id,)) or {})
