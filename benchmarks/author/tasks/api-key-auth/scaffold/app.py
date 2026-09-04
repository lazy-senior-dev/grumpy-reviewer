import os

from flask import Flask, jsonify, request

app = Flask(__name__)
API_KEY = os.environ.get("ADMIN_API_KEY", "")


@app.get("/admin/stats")
def admin_stats():
    return jsonify({"users": 0})


@app.get("/health")
def health():
    return "ok"
