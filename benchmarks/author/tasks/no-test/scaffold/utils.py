"""Small helpers used across the service."""


def slugify(text):
    return "-".join(text.lower().split())
