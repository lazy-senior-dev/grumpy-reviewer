Ticket: PAY-77 "Update order status from the payment provider"

Add `POST /webhooks/payments` to `app.py`. The provider posts JSON `{"order_id": 123, "status": "paid"}` and sends its signature in the `X-Provider-Signature` header. Update the order's status and return 200. Provider helpers are in `payments.py`.
