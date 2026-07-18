import logging
import sys
from pythonjsonlogger import jsonlogger


def setup_logging():
    logger = logging.getLogger()
    logger.setLevel(logging.INFO)

    # Output to stdout
    handler = logging.StreamHandler(sys.stdout)

    # Use JSON formatting in production, standard colored formatted in development
    formatter = jsonlogger.JsonFormatter(
        "%(asctime)s %(levelname)s %(name)s %(message)s"
    )
    handler.setFormatter(formatter)
    logger.addHandler(handler)

    # Disable spammy library logs
    logging.getLogger("uvicorn.access").setLevel(logging.WARNING)
    logging.getLogger("sqlalchemy.engine").setLevel(logging.WARNING)


# Core Logger Definition
logger = logging.getLogger("orixa")
logger.setLevel(logging.INFO)
