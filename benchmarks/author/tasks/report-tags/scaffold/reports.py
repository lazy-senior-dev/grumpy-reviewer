import datetime


def build_report(name):
    return {"name": name, "generated_at": datetime.datetime.utcnow().isoformat(), "rows": []}
