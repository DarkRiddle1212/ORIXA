import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_get_incident_replay_timeline_success(client: AsyncClient):
    """Test retrieving an existing incident replay timeline."""
    investigation_id = "silent-schema-disaster"
    response = await client.get(f"/api/v1/replay/{investigation_id}")
    assert response.status_code == 200
    data = response.json()
    assert "events" in data
    assert len(data["events"]) > 0
    assert "duration_sec" in data

@pytest.mark.asyncio
async def test_get_incident_replay_timeline_not_found(client: AsyncClient):
    """Test response when querying a non-existent incident ID."""
    response = await client.get("/api/v1/replay/non-existent-id-xyz")
    assert response.status_code == 404

@pytest.mark.asyncio
async def test_generate_incident_replay_success(client: AsyncClient):
    """Test dynamically generating a high-fidelity incident simulation trace."""
    payload = {
        "query": "Database schema migration deadlock trace"
    }
    response = await client.post("/api/v1/replay/generate", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert "events" in data
    assert "duration_sec" in data
    assert len(data["events"]) > 0

@pytest.mark.asyncio
async def test_generate_incident_replay_empty_query(client: AsyncClient):
    """Test error response when submitting an empty query for generation."""
    payload = {
        "query": ""
    }
    response = await client.post("/api/v1/replay/generate", json=payload)
    assert response.status_code == 400
