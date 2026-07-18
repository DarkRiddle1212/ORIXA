import uuid
from datetime import datetime
from pydantic import BaseModel, EmailStr, Field


class UserBase(BaseModel):
    email: EmailStr
    role: str = Field("Viewer", pattern="^(SuperAdmin|OrgAdmin|Analyst|Viewer)$")
    is_active: bool = True
    org_id: uuid.UUID


class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8)
    role: str = Field("Viewer", pattern="^(SuperAdmin|OrgAdmin|Analyst|Viewer)$")
    org_id: uuid.UUID


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserOut(BaseModel):
    id: uuid.UUID
    email: EmailStr
    role: str
    is_active: bool
    org_id: uuid.UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
