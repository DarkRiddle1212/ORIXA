import asyncio
import pytest
import pytest_asyncio
from typing import AsyncGenerator
from unittest.mock import AsyncMock, MagicMock
from fastapi import FastAPI
from httpx import AsyncClient, ASGITransport

# Mock redis_manager BEFORE importing main app to avoid connection attempts
import sys
mock_redis = MagicMock()
mock_redis.client = AsyncMock()
mock_redis.connect = MagicMock()
mock_redis.close = AsyncMock()

# Inject mock into system modules to bypass real redis initialization
sys.modules["backend.app.db.redis"] = MagicMock(redis_manager=mock_redis)

# Now import the app safely
from backend.app.main import app as fastapi_app
from backend.app.db.session import get_db_session

# Mock database session dependency
@pytest.fixture
def mock_db_session():
    session = AsyncMock()
    return session

@pytest.fixture(autouse=True)
def override_db_dependency(mock_db_session):
    # Override the database session provider dependency with our mock session
    fastapi_app.dependency_overrides[get_db_session] = lambda: mock_db_session
    yield
    fastapi_app.dependency_overrides.clear()

@pytest.fixture(scope="session")
def event_loop():
    """Create an instance of the default event loop for each test case."""
    try:
        loop = asyncio.get_running_loop()
    except RuntimeError:
        loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    yield loop
    loop.close()

@pytest_asyncio.fixture
async def client() -> AsyncGenerator[AsyncClient, None]:
    """Provide an HTTPX AsyncClient for FastAPI endpoint testing."""
    async with AsyncClient(
        transport=ASGITransport(app=fastapi_app),
        base_url="http://testserver"
    ) as ac:
        yield ac
