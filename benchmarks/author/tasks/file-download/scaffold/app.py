import os

from flask import Flask, abort

app = Flask(__name__)
UPLOAD_DIR = "/srv/uploads"


@app.get("/health")
def health():
    return "ok"
