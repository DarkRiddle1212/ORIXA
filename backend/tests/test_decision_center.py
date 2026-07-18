import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_get_investigation_explanation(client: AsyncClient):
    """Test retrieving decision explanations for an active investigation ID."""
    investigation_id = "silent-schema-disaster"
    response = await client.get(f"/api/v1/decision_center/explanations/{investigation_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["investigation_id"] == investigation_id
    assert "summary" in data
    assert "evidence" in data
    assert "status" in data

@pytest.mark.asyncio
async def test_approve_recommendation_valid(client: AsyncClient):
    """Test submitting a manual human approval decision with correct payload."""
    investigation_id = "silent-schema-disaster"
    payload = {
        "action": "APPROVED",
        "operator_email": "admin@orixa.io"
    }
    response = await client.post(
        f"/api/v1/decision_center/explanations/{investigation_id}/approve",
        json=payload
    )
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "SUCCESS"
    assert "approved" in data["message"].lower()

@pytest.mark.asyncio
async def test_approve_recommendation_invalid_action(client: AsyncClient):
    """Test response when payload contains an invalid action."""
    investigation_id = "silent-schema-disaster"
    payload = {
        "action": "STALL",
        "operator_email": "admin@orixa.io"
    }
    response = await client.post(
        f"/api/v1/decision_center/explanations/{investigation_id}/approve",
        json=payload
    )
    # The application raises an HTTPException or fails validation
    assert response.status_code in [400, 422]
