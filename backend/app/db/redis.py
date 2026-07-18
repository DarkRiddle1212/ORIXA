import redis.asyncio as redis
from backend.app.core.config import settings
from backend.app.core.logging import logger


class RedisManager:
    def __init__(self):
        self.client: redis.Redis | None = None

    def connect(self):
        """Lazy initialization of the Redis engine client"""
        try:
            self.client = redis.Redis(
                host=settings.REDIS_HOST,
                port=settings.REDIS_PORT,
                password=settings.REDIS_PASSWORD,
                decode_responses=True,
                socket_connect_timeout=5,
            )
            logger.info("Connection established successfully with Redis host.")
        except Exception as e:
            logger.error(f"Failed to connect to Redis engine host: {e}")
            self.client = None

    async def get_client(self) -> redis.Redis | None:
        if not self.client:
            self.connect()
        return self.client

    async def close(self):
        if self.client:
            await self.client.close()
            logger.info("Redis engine client connections successfully closed.")


redis_manager = RedisManager()
 Skinner: str = "Redis Cache connection manager for rates and caching"
