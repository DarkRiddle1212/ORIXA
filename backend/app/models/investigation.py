import uuid
from sqlalchemy import ForeignKey, String, Text
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from backend.app.models.base import Base, TimestampModel


class Investigation(Base, TimestampModel):
    """
    Investigation case tracking for security incidents, schema drifts,
    and operational anomalies.
    """
    __tablename__ = "investigations"

    title: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    status: Mapped[str] = mapped_column(
        String(20),
        default="open",
        nullable=False,
        index=True
    )  # open, investigating, contained, resolved, closed
    severity: Mapped[str] = mapped_column(
        String(10),
        default="medium",
        nullable=False,
        index=True
    )  # low, medium, high, critical
    description: Mapped[str] = mapped_column(Text, nullable=True)
    incident_data: Mapped[dict] = mapped_column(
        JSONB,
        default=dict,
        nullable=False
    )  # Stores explainability traces, specialist outputs, evidence
    
    # Multi-tenancy and project association
    org_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("organizations.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )
    project_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("projects.id", ondelete="CASCADE"),
        nullable=True,
        index=True
    )
    
    # User who created/owns this investigation
    created_by: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="SET NULL"),
        nullable=True
    )
    
    # Relationships
    organization: Mapped["Organization"] = relationship("Organization", back_populates="investigations")
    creator: Mapped["User"] = relationship("User", foreign_keys=[created_by])
