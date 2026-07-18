import uuid
from datetime import datetime
from pydantic import BaseModel, Field


class OrganizationBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    domain: str | None = Field(None, max_length=100)
    is_active: bool = True


class OrganizationCreate(OrganizationBase):
    pass


class OrganizationOut(OrganizationBase):
    id: uuid.UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
