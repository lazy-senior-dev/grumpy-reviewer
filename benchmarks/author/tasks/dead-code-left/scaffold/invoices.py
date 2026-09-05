from pricing import total_cents


def invoice_total(items):
    """Invoices bill the same basket as checkout and must agree with it to the cent."""
    return total_cents(items)
