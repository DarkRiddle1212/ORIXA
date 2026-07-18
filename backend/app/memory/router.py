import uuid
from datetime import datetime
from typing import Any, Dict, List, Optional
from fastapi import APIRouter, HTTPException, Query, status
from pydantic import BaseModel, Field
from backend.app.memory.memory_models import MemoryItem
from backend.app.memory.memory_service import memory_service

router = APIRouter(prefix="/memory", tags=["Organizational Memory"])


class CreateMemoryItemPayload(BaseModel):
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


class MemorySummaryResponse(BaseModel):
    summary: str


@router.get("", response_model=List[MemoryItem], status_code=status.HTTP_200_OK)
async def list_memories(
    asset_urn: Optional[str] = Query(None, description="Filter memories by affected asset URN"),
    specialist: Optional[str] = Query(None, description="Filter memories by active specialist name"),
    limit: int = Query(15, ge=1, le=100, description="Retrieve up to N records")
):
    """
    Retrieves records from the Organizational Memory store.
    Supports filtering by specific asset URN or participating Specialist.
    """
    if asset_urn:
        return memory_service.get_asset_history(asset_urn)
    elif specialist:
        return memory_service.get_specialist_history(specialist)
    else:
        return memory_service.get_recent_events(limit)


@router.post("", response_model=MemoryItem, status_code=status.HTTP_201_CREATED)
async def create_memory_item(payload: CreateMemoryItemPayload):
    """
    Records a completed incident resolution flow as an Organizational Memory item, 
    making it permanently available for future operational planning.
    """
    new_id = f"mem-{str(uuid.uuid4())[:18]}"
    item = MemoryItem(
        id=new_id,
        incident=payload.incident,
        user_request=payload.user_request,
        context_snapshot=payload.context_snapshot,
        selected_specialists=payload.selected_specialists,
        execution_plan=payload.execution_plan,
        recommendations=payload.recommendations,
        human_approvals=payload.human_approvals,
        final_outcome=payload.final_outcome,
        lessons_learned=payload.lessons_learned,
        tags=payload.tags,
        affected_assets=payload.affected_assets,
        timestamp=datetime.utcnow().isoformat() + "Z"
    )
    saved = memory_service.save_memory(item)
    return saved


@router.get("/search", response_model=List[MemoryItem], status_code=status.HTTP_200_OK)
async def search_memory_store(
    q: Optional[str] = Query("", description="Keyword search query"),
    tags: Optional[List[str]] = Query(None, description="Optional tag boundaries"),
    limit: int = Query(10, ge=1, le=100)
):
    """
    Performs full-text keyword searches across incident definitions, 
    outcome reports, and metadata tags.
    """
    return memory_service.search_memory(query=q, tags=tags, limit=limit)


@router.get("/similar", response_model=List[MemoryItem], status_code=status.HTTP_200_OK)
async def fetch_similar_incidents(
    q: str = Query(..., description="User query context to evaluate similarity"),
    limit: int = Query(5, ge=1, le=20)
):
    """
    Compares query context against memory indexes to identify 
    historically relevant incidents.
    """
    return memory_service.find_similar_incidents(query=q, limit=limit)


@router.get("/summary", response_model=MemorySummaryResponse, status_code=status.HTTP_200_OK)
async def get_synthesis_summary(ids: List[str] = Query(..., description="List of memory IDs to consolidate")):
    """
    Combines several historical memories into a unified executive report.
    """
    txt = memory_service.summarize_incidents(ids)
    return MemorySummaryResponse(summary=txt)


@router.get("/{id}", response_model=MemoryItem, status_code=status.HTTP_200_OK)
async def get_memory_by_id(id: str):
    """
    Loads a specific Organizational Memory record by ID.
    """
    item = memory_service.get_by_id(id)
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Organizational Memory record with ID '{id}' was not found."
        )
    return item
