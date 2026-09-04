"""Tiny sqlite helper used by the service. Always pass values as params."""
import sqlite3

CONN = sqlite3.connect("service.db", check_same_thread=False)
CONN.row_factory = sqlite3.Row


def execute(sql, params=()):
    cur = CONN.execute(sql, params)
    CONN.commit()
    return cur


def query_all(sql, params=()):
    return [dict(r) for r in CONN.execute(sql, params).fetchall()]


def query_one(sql, params=()):
    row = CONN.execute(sql, params).fetchone()
    return dict(row) if row else None
