from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class SpecialistState(BaseModel):
    specialist_name: str = Field(..., description="Name of the AI Specialist")
    role: str = Field(..., description="SRE or specialized analytical role of the agent")
    current_activity: str = Field(..., description="Current running task description")
    completion_status: str = Field(..., description="E.g., PENDING, IN_PROGRESS, COMPLETED")
    confidence: str = Field(..., description="Confidence percentage or decimal representation")

class OperationalMessage(BaseModel):
    timestamp: str = Field(..., description="ISO or relative timestamp of the event")
    message: str = Field(..., description="Concise SRE-style operational event statement")

class RecentActivity(BaseModel):
    id: str = Field(..., description="Unique identifier for the activity log")
    timestamp: str = Field(..., description="Timestamp of the activity occurrence")
    stage: str = Field(..., description="Stage of the overarching investigation")
    activity: str = Field(..., description="Summary action performed")
    detail: str = Field(..., description="Deeper organizational context or metadata trace")

class InvestigationProgress(BaseModel):
    stage_name: str = Field(..., description="Current phase name of the process")
    progress_percentage: int = Field(..., description="Integer representation from 0 to 100")
    elapsed_seconds: int = Field(..., description="Time elapsed in seconds")
    estimated_remaining_seconds: int = Field(..., description="Remaining time predicted")

class AtlasConsoleState(BaseModel):
    status: str = Field(..., description="Atlas operating status state")
    greeting: str = Field(..., description="Contextual, clean, non-verbose SRE-style greeting")
    current_investigation: Optional[str] = Field(None, description="Title of the active investigation being evaluated")
    current_specialist: Optional[SpecialistState] = Field(None, description="Active AI specialist detail")
    progress: InvestigationProgress = Field(..., description="Full progression stage parameters")
    latest_messages: List[OperationalMessage] = Field(default=[], description="Operational feed messages")
    recent_activities: List[RecentActivity] = Field(default=[], description="Archived activity history timeline")
