from flask import Flask, jsonify, request

app = Flask(__name__)


@app.get("/status")
def status():
    return jsonify({"ok": True})
