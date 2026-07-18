import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_simulate_atlas_orchestration_success(client: AsyncClient):
    """Test standard execution of the full Atlas Supervisor simulation pipeline."""
    payload = {
        "query": "Silent postgres drift on prod schema"
    }
    response = await client.post("/api/v1/atlas/simulate", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "session_id" in data
    assert data["query"] == payload["query"]
    assert "selected_specialists" in data
    assert "plan_steps" in data
    assert "recommendation" in data
    assert "orchestration_logs" in data

@pytest.mark.asyncio
async def test_simulate_atlas_orchestration_empty_query(client: AsyncClient):
    """Test Atlas orchestration error response with empty query payload."""
    payload = {
        "query": "   "
    }
    response = await client.post("/api/v1/atlas/simulate", json=payload)
    assert response.status_code == 400
    assert "empty" in response.json()["detail"].lower()
