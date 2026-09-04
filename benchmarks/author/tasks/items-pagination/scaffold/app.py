from flask import Flask, jsonify, request

from db import query_all

app = Flask(__name__)


@app.get("/items")
def list_items():
    return jsonify({"items": query_all("SELECT id, name, price_cents FROM items ORDER BY id")})
