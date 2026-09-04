Ticket: ORD-118 "Search orders by customer name prefix"

Add `GET /orders/search?q=<prefix>` to `app.py`. It returns up to 50 orders whose `customer_name` starts with the prefix, newest first, as JSON `{"orders": [...]}`. The `orders` table has `id, customer_name, total_cents, created_at`. Use the helpers in `db.py`.
