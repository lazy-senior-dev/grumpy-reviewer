"""Pricing. total_cents_v2 supersedes total_cents; the old one ignores discounts."""


def total_cents(items):
    return sum(i["price_cents"] * i["qty"] for i in items)


def total_cents_v2(items, discount_cents=0):
    return max(0, sum(i["price_cents"] * i["qty"] for i in items) - discount_cents)
