from pydantic import BaseModel, Field


class Token(BaseModel):
    access_token: str = Field(..., description="JWT Bearer Token")
    token_type: str = Field("bearer", description="Type of standard auth token")


class TokenPayload(BaseModel):
    sub: str | None = Field(None, description="Subject of standard token (User email)")
    org_id: str | None = Field(None, description="Bound tenant identifier UUID")
    role: str | None = Field(None, description="RBAC Role descriptor string")
