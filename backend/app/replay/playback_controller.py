from fastapi import APIRouter, HTTPException, status
from backend.app.replay.event_models import ReplayTimeline, ReplayGenerateRequest
from backend.app.replay.replay_service import replay_service

router = APIRouter(prefix="/replay", tags=["Incident Replay Core"])


@router.get("/{investigation_id}", response_model=ReplayTimeline, status_code=status.HTTP_200_OK)
async def get_incident_replay_timeline(investigation_id: str):
    """
    Retrieves the complete, structured chronological timeline of an investigation
    by its ID for client-side mission-style playback.
    """
    timeline = replay_service.get_replay_timeline(investigation_id)
    if not timeline:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Investigation timeline with reference ID '{investigation_id}' not found."
        )
    return timeline


@router.post("/generate", response_model=ReplayTimeline, status_code=status.HTTP_201_CREATED)
async def generate_incident_replay(request: ReplayGenerateRequest):
    """
    Dynamically spins up a high-fidelity incident simulation trace based on a specific query,
    enrolling correct specialists, matching historical assets, and mapping chronological logs.
    """
    if not request.query.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Query cannot be empty or contain solely blank whitespace."
        )
    
    try:
        timeline = replay_service.generate_replay_timeline(request.query)
        return timeline
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate incident simulation replay: {str(e)}"
        )
