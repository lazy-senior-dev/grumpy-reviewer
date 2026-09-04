import logging

from flask import Flask

from config import load_config

log = logging.getLogger(__name__)
app = Flask(__name__)
config = load_config()


@app.get("/health")
def health():
    return "ok"
