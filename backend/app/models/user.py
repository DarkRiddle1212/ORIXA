import uuid
from typing import Optional
from sqlalchemy import Boolean, ForeignKey, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from backend.app.models.base import Base, TimestampModel


class User(Base, TimestampModel):
    """
    User authentication and authorization entity.
    Supports role-based access control and multi-tenancy.
    """
    __tablename__ = "users"

    email: Mapped[str] = mapped_column(String(255), nullable=False, unique=True, index=True)
    hashed_password: Mapped[str] = mapped_column(String(255), nullable=False)
    full_name: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    role: Mapped[str] = mapped_column(
        String(20),
        default="Viewer",
        nullable=False,
        index=True
    )  # SystemAdmin, Operator, Admin, Analyst, Viewer
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False, index=True)
    is_verified: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    
    # Password reset and verification
    reset_token: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    verification_token: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    last_login_at: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)

    # Multi-tenancy key binding
    org_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("organizations.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )

    # Relationships
    organization: Mapped["Organization"] = relationship("Organization", back_populates="users")
