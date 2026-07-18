from typing import Any, Dict, List
from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, Field
from backend.app.atlas.supervisor import atlas_supervisor

router = APIRouter(prefix="/atlas", tags=["Atlas Supervisor"])


class AtlasSimulateRequest(BaseModel):
    query: str = Field(..., description="The natural language problem, prompt, or telemetry alert to analyze")


class AtlasSimulateResponse(BaseModel):
    session_id: str = Field(..., description="Unique transaction/session ID for tracing execution")
    query: str = Field(..., description="The analyzed user query")
    stage: str = Field(..., description="Final pipeline stage reached")
    intent: str = Field(..., description="The classified problem category/intent")
    confidence: float = Field(..., description="Intent classification probability score")
    selected_specialists: List[str] = Field(..., description="List of specialists enrolled in the operation")
    plan_steps: List[Dict[str, Any]] = Field(..., description="Sequential step-by-step planning matrix")
    specialist_outputs: Dict[str, Any] = Field(..., description="Raw outputs collected from active specialists")
    recommendation: Dict[str, Any] = Field(..., description="Executive report with remediations and risk scoring")
    orchestration_logs: List[str] = Field(..., description="Full trace of chronological system logs")
    similar_incidents: List[Dict[str, Any]] = Field(default_factory=list, description="Historical related incidents retrieved from memory")


@router.post("/simulate", response_model=AtlasSimulateResponse, status_code=status.HTTP_200_OK)
async def simulate_atlas_orchestration(request: AtlasSimulateRequest):
    """
    Simulates the full Atlas Supervisor orchestration pipeline.
    Receives user prompt, plans executing tasks, calls Orixa Specialists, and builds remediations.
    """
    if not request.query.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Query cannot be empty or solely whitespace."
        )

    try:
        result = await atlas_supervisor.orchestrate(request.query)
        return result
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Atlas Orchestration error occurred: {str(e)}"
        )
