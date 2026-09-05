Ticket: PAY-64 "Move to the new pricing helper"

`pricing.py` has both `total_cents` (old) and `total_cents_v2` (new, correct for discounts). Change `checkout.py` to use the new one.
