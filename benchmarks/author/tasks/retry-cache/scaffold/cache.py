import time


class TransientError(Exception):
    """The cluster is busy; the same call usually succeeds a moment later."""


class CacheClient:
    def __init__(self, host):
        self.host = host

    def get(self, key):
        # network call; raises TransientError when the cluster is busy
        raise NotImplementedError
