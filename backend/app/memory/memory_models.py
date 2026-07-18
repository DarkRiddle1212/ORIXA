from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field
from datetime import datetime

class MemoryItem(BaseModel):
    id: str = Field(..., description="Unique ID of the memory record")
    incident: str = Field(..., description="High-level incident title or classification")
    user_request: str = Field(..., description="The original natural language query or user request")
    context_snapshot: Dict[str, Any] = Field(default_factory=dict, description="Metadata and DataHub state snapshot at execution time")
    selected_specialists: List[str] = Field(default_factory=list, description="Specialist agents enrolled in resolving the incident")
    execution_plan: List[Dict[str, Any]] = Field(default_factory=list, description="Cronological plan steps orchestrated by Atlas")
    recommendations: Dict[str, Any] = Field(default_factory=dict, description="Risk assessments and recovery procedures recommended")
    human_approvals: List[Dict[str, Any]] = Field(default_factory=list, description="Audit log of operations signed off by enterprise humans")
    final_outcome: str = Field(..., description="Success/Failure resolution summary details")
    lessons_learned: List[str] = Field(default_factory=list, description="Discovered heuristics or rules learned for future routing")
    tags: List[str] = Field(default_factory=list, description="Governance, regulatory, and metadata index tags")
    affected_assets: List[str] = Field(default_factory=list, description="List of dataset URNs or infrastructure blocks impacted")
    timestamp: str = Field(..., description="ISO 8601 creation timestamp")

class MemorySearchRequest(BaseModel):
    query: str
    tags: Optional[List[str]] = None
    limit: Optional[int] = 10
