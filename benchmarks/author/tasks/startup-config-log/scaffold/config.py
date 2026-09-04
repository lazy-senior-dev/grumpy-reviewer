import os


def load_config():
    return {
        "DATABASE_URL": os.environ.get("DATABASE_URL", "postgres://app:s3cretpass@db:5432/shop"),
        "STRIPE_SECRET_KEY": os.environ.get("STRIPE_SECRET_KEY", "psk-live-000"),
        "SMTP_PASSWORD": os.environ.get("SMTP_PASSWORD", "changeme"),
        "LOG_LEVEL": os.environ.get("LOG_LEVEL", "INFO"),
        "PORT": int(os.environ.get("PORT", "8080")),
        "REGION": os.environ.get("REGION", "eu-west-1"),
    }
