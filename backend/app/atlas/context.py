from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field


class AtlasContext(BaseModel):
    """
    State context governing an active Atlas supervisor orchestration cycle.
    Tracks state, telemetry logs, collected observations, and session metadata.
    """
    session_id: str = Field(..., description="Unique UUID or trace identifier for this orchestration session")
    query: str = Field(..., description="The original natural language request from the user")
    current_stage: str = Field("INIT", description="Active stage: INIT, ANALYZING, PLANNING, EXECUTING, AGGREGATING, COMPLETED")
    metadata: Dict[str, Any] = Field(default_factory=dict, description="Custom metadata injected from FastAPI requests")
    logs: List[str] = Field(default_factory=list, description="Global orchestration log traces")
    specialist_outputs: Dict[str, Any] = Field(default_factory=dict, description="Raw outputs collected from active specialists")
    variables: Dict[str, Any] = Field(default_factory=dict, description="Transient session parameters shared across steps")

    def add_log(self, message: str):
        """Append an internal orchestration trace message."""
        self.logs.append(message)
