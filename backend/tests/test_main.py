import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_get_system_health(client: AsyncClient):
    """Test the lightweight health indicator heartbeat."""
    response = await client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "engine" in data
    assert "services" in data

@pytest.mark.asyncio
async def test_list_ai_specialists(client: AsyncClient):
    """Test retrieving details of all registered AI specialists in the fleet."""
    response = await client.get("/api/v1/specialists")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    if len(data) > 0:
        first_specialist = data[0]
        assert "display_name" in first_specialist
        assert "system_prompt" in first_specialist
        assert "status" in first_specialist

@pytest.mark.asyncio
async def test_get_specialists_status_summary(client: AsyncClient):
    """Test retrieving a quick health telemetry and current load status of the AI fleet."""
    response = await client.get("/api/v1/specialists/status")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "fleet_size" in data
    assert "health_matrix" in data

@pytest.mark.asyncio
async def test_list_registered_organizations(client: AsyncClient):
    """Test retrieving tenant organizations."""
    response = await client.get("/api/v1/organizations")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 1
    assert data[0]["name"] == "Acme Aerospace"

@pytest.mark.asyncio
async def test_list_active_projects(client: AsyncClient):
    """Test retrieving sandbox analytics workspaces."""
    response = await client.get("/api/v1/projects")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 1
    assert "metadata_json" in data[0]
