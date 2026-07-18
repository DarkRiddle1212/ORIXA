import uuid
from datetime import datetime
from pydantic import BaseModel, Field


class ProjectBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    status: str = Field("Active", pattern="^(Active|Suspended|Archived)$")
    metadata_json: dict = Field(default_factory=dict)
    org_id: uuid.UUID


class ProjectCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    metadata_json: dict = Field(default_factory=dict)
    org_id: uuid.UUID


class ProjectOut(ProjectBase):
    id: uuid.UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
