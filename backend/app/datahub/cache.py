import json
import time
from typing import Any, Dict, Optional, Union
from backend.app.core.logging import logger
from backend.app.core.config import settings


class MetadataCache:
    """
    High-performance caching layer for DataHub Metadata Context.
    Supports local in-memory dictionaries and integrates with Redis if configured and reachable.
    """

    def __init__(self):
        self._local_cache: Dict[str, Dict[str, Any]] = {}
        self._is_redis_ready = False
        self._redis_client = None

        # Attempt to initialize Redis connection lazily
        self._init_redis()

    def _init_redis(self) -> None:
        try:
            # Check if redis package is available and settings specify parameters
            import redis
            if settings.REDIS_HOST:
                logger.info(f"MetadataCache: Attempting connection to Redis at {settings.REDIS_HOST}:{settings.REDIS_PORT}")
                self._redis_client = redis.Redis(
                    host=settings.REDIS_HOST,
                    port=settings.REDIS_PORT,
                    password=settings.REDIS_PASSWORD,
                    socket_connect_timeout=2.0,
                    decode_responses=True
                )
                # Quick health check test
                self._redis_client.ping()
                self._is_redis_ready = True
                logger.info("MetadataCache: Successfully connected to Redis.")
        except Exception as e:
            logger.warning(f"MetadataCache: Redis initialization skipped or failed ({str(e)}). Falling back to in-memory dictionary.")
            self._is_redis_ready = False
            self._redis_client = None

    def get(self, key: str) -> Optional[Any]:
        """Retrieves an item from cache. Returns None on cache miss or expiration."""
        if self._is_redis_ready and self._redis_client:
            try:
                val = self._redis_client.get(f"orixa:datahub:{key}")
                if val:
                    return json.loads(val)
            except Exception as e:
                logger.error(f"MetadataCache: Redis GET error: {str(e)}. Falling back to local cache.")

        # Local Cache lookup
        if key in self._local_cache:
            entry = self._local_cache[key]
            if entry["expire_at"] > time.time():
                return entry["value"]
            else:
                # Evict expired entry
                del self._local_cache[key]
        return None

    def set(self, key: str, value: Any, ttl: int = 300) -> None:
        """Sets a value in the cache with a specified Time-to-Live (TTL) in seconds."""
        if self._is_redis_ready and self._redis_client:
            try:
                self._redis_client.setex(
                    name=f"orixa:datahub:{key}",
                    time=ttl,
                    value=json.dumps(value)
                )
                return
            except Exception as e:
                logger.error(f"MetadataCache: Redis SET error: {str(e)}. Falling back to local cache.")

        # Local Cache write
        self._local_cache[key] = {
            "value": value,
            "expire_at": time.time() + ttl
        }

    def delete(self, key: str) -> None:
        """Deletes a key from cache."""
        if self._is_redis_ready and self._redis_client:
            try:
                self._redis_client.delete(f"orixa:datahub:{key}")
                return
            except Exception as e:
                logger.error(f"MetadataCache: Redis DEL error: {str(e)}.")

        if key in self._local_cache:
            del self._local_cache[key]

    def clear(self) -> None:
        """Clears all cached metadata entries."""
        if self._is_redis_ready and self._redis_client:
            try:
                # Find keys with pattern and delete them
                keys = self._redis_client.keys("orixa:datahub:*")
                if keys:
                    self._redis_client.delete(*keys)
                logger.info("MetadataCache: Cleared all Redis keys matching datahub pattern.")
            except Exception as e:
                logger.error(f"MetadataCache: Redis CLEAR error: {str(e)}.")

        self._local_cache.clear()
        logger.info("MetadataCache: Local in-memory dictionary cache cleared.")


# Global Singleton for metadata caching
metadata_cache = MetadataCache()
