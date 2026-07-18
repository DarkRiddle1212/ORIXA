from fastapi import APIRouter, Query, HTTPException, status
from datetime import datetime
from typing import Optional

from backend.app.atlas_console.schemas import AtlasConsoleState, SpecialistState, InvestigationProgress
from backend.app.atlas_console.services.status_engine import StatusEngine
from backend.app.atlas_console.services.message_engine import MessageEngine
from backend.app.atlas_console.services.activity_engine import ActivityEngine
from backend.app.atlas_console.services.greeting_engine import GreetingEngine
from backend.app.atlas_console.services.progress_engine import ProgressEngine

router = APIRouter(prefix="/atlas_console", tags=["Atlas Operations Console"])

status_engine = StatusEngine()
message_engine = MessageEngine()
activity_engine = ActivityEngine()
greeting_engine = GreetingEngine()
progress_engine = ProgressEngine()

@router.get("/state", response_model=AtlasConsoleState)
async def get_atlas_console_state(
    investigation_id: Optional[str] = Query("silent-schema-disaster", description="ID of the active investigation"),
    stage: Optional[str] = Query("Coordinating Specialists", description="Custom stage overlay for demo"),
    after_long_inactivity: bool = Query(False, description="Simulate returns after inactivity")
):
    """
    Core operational gateway delivering real-time telemetry metrics 
    and SRE-grounded status logs for the active enterprise layout.
    """
    try:
        now_hour = datetime.now().hour
        greeting_text = greeting_engine.generate_greeting(now_hour, after_long_inactivity)
        
        # Determine base status state
        has_active = stage != "Completed"
        status_state = status_engine.evaluate_system_state(
            has_active_investigations=has_active,
            pending_approvals=1 if stage == "Generating Recommendation" else 0,
            is_offline=False
        )
        
        # Override if specific stages match approvals
        if stage == "Generating Recommendation" or stage == "Completed":
            status_state = "Recommendation Ready"
            
        # Compile active specialist
        active_specialist = None
        if stage != "Completed":
            active_specialist = SpecialistState(
                specialist_name="Architect",
                role="Downstream System Dependency Tracing",
                current_activity="Tracing 14 downstream Looker metrics dashboard schemas.",
                completion_status="IN_PROGRESS" if stage != "Generating Recommendation" else "COMPLETED",
                confidence="98%"
            )
            
        # Progress calculation
        progress_data = progress_engine.get_progress_data(stage, elapsed_seconds=24)
        
        # SRE sequence messages
        messages = [
            {"timestamp": msg["timestamp"], "message": msg["message"]}
            for msg in message_engine.get_sequential_feed(investigation_id)
        ]
        
        # Activities index
        activities = [
            {
                "id": act["id"],
                "timestamp": act["timestamp"],
                "stage": act["stage"],
                "activity": act["activity"],
                "detail": act["detail"]
            }
            for act in activity_engine.get_recent_activities()
        ]
        
        return AtlasConsoleState(
            status=status_state,
            greeting=greeting_text,
            current_investigation="Silent Schema Drift: users_sandbox deviation",
            current_specialist=active_specialist,
            progress=InvestigationProgress(
                stage_name=progress_data["stage_name"],
                progress_percentage=progress_data["progress_percentage"],
                elapsed_seconds=progress_data["elapsed_seconds"],
                estimated_remaining_seconds=progress_data["estimated_remaining_seconds"]
            ),
            latest_messages=messages,
            recent_activities=activities
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Atlas metadata bridge error: {str(e)}"
        )
