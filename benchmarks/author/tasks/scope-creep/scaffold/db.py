"""Tiny sqlite helper. Always pass values as params."""
import sqlite3

CONN = sqlite3.connect("service.db", check_same_thread=False)


def query_one(sql, params=()):
    row = CONN.execute(sql, params).fetchone()
    return dict(row) if row else None
