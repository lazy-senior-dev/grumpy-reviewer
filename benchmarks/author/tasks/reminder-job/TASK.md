Ticket: BILL-52 "Nightly reminder for unpaid invoices"

Add `send_reminders(users)` to `reminders.py`. For each user with an unpaid invoice (`user["unpaid"] is True`) send the reminder with `mailer.send`. One bad address must not stop the rest of the batch.
