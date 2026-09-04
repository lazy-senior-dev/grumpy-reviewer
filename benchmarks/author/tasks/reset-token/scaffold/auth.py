import datetime

from db import execute


def now():
    return datetime.datetime.now(datetime.timezone.utc)
