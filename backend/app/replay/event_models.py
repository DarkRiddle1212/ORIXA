from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field


class ReplayEvent(BaseModel):
    id: str = Field(..., description="Unique event identifier")
    timestamp: str = Field(..., description="Chronological timestamp of the event")
    event_type: str = Field(
        ...,
        description="Type of the event, e.g., ATLAS_ORCHESTRATION, SPECIALIST_ACTIVITY, "
        "DATAHUB_RETRIEVAL, ORGANIZATIONAL_MEMORY, GEMINI_REASONING, "
        "FINAL_RECOMMENDATION, HUMAN_APPROVAL",
    )
    responsible_specialist: Optional[str] = Field(
        None, description="The domain specialist executing this step"
    )
    description: str = Field(..., description="Actionable summary of the event")
    supporting_evidence: List[str] = Field(
        default_factory=list, description="Associated telemetry lines or evidence"
    )
    status: str = Field(
        "COMPLETED", description="State of execution: PENDING, EXECUTING, COMPLETED, FAILED"
    )
    related_assets: List[str] = Field(
        default_factory=list, description="Affected DataHub URNs or system assets"
    )


class ReplayTimeline(BaseModel):
    investigation_id: str = Field(..., description="Reference ID for the parent investigation")
    title: str = Field(..., description="Title of the incident under replay")
    short_description: str = Field(..., description="Brief overview of the investigation")
    category: str = Field(..., description="Incident domain classification")
    confidence_score: float = Field(..., description="Atlas synthesis confidence score")
    root_cause: str = Field(..., description="Identified failure vector")
    risk_assessment: str = Field(..., description="Risk profile evaluation")
    events: List[ReplayEvent] = Field(..., description="Chronological mission steps")


class ReplayGenerateRequest(BaseModel):
    query: str = Field(..., description="A natural language search or a scenario template ID")
    org_id: Optional[str] = Field(None, description="Optional organization isolation parameter")
