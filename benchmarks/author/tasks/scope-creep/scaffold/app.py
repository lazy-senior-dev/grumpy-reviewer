import logging

from flask import Flask, jsonify, request

import db

app = Flask(__name__)
log = logging.getLogger(__name__)

# TODO: these two handlers are old and could use a tidy-up one day


@app.get("/health")
def health():
    return "ok"


@app.get("/orders/<order_id>")
def get_order(order_id):
    row = db.query_one("SELECT * FROM orders WHERE id = ?", (order_id,))
    if row == None:
        return jsonify({}), 404
    log.info("order %s served" % order_id)
    return jsonify(row)


@app.get("/items")
def list_items():
    rows = []
    for i in range(0, 10):
        r = db.query_one("SELECT * FROM items WHERE id = ?", (i,))
        if r != None:
            rows.append(r)
    return jsonify({"items": rows})
