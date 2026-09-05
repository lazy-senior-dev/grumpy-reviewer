from pricing import total_cents


def checkout(items, discount_cents=0):
    return {"total_cents": total_cents(items)}
