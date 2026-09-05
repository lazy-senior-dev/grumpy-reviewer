from utils import slugify


def test_slugify():
    assert slugify("Hello There") == "hello-there"
