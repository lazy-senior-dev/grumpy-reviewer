Ticket: FILES-9 "Let users download their uploads"

Add `GET /files/<path:name>` to `app.py` that returns the file with that name from `UPLOAD_DIR`, with a 404 when it does not exist.
