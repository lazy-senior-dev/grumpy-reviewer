from flask import Flask, jsonify, request

from db import query_all

app = Flask(__name__)


@app.get("/orders/<int:order_id>")
def get_order(order_id):
    rows = query_all("SELECT * FROM orders WHERE id = ?", (order_id,))
    return jsonify(rows[0] if rows else {}), (200 if rows else 404)
