import hashlib
import hmac
import os

WEBHOOK_SECRET = os.environ.get("PROVIDER_WEBHOOK_SECRET", "")


def verify_signature(body: bytes, header: str) -> bool:
    """True when the provider's signature header matches the raw request body."""
    expected = hmac.new(WEBHOOK_SECRET.encode(), body, hashlib.sha256).hexdigest()
    return hmac.compare_digest(expected, header or "")
