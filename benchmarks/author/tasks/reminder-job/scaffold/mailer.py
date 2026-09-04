class MailError(Exception):
    """The provider rejected the message (bad address, bounce, rate limit)."""


def send(address: str, text: str) -> None:
    raise NotImplementedError
