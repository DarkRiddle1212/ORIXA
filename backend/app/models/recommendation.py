import uuid
from typing import Optional
from sqlalchemy import ForeignKey, Float, String, Text
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from backend.app.models.base import Base, TimestampModel


class Recommendation(Base, TimestampModel):
    """
    AI-generated recommendations for schema changes, security improvements,
    compliance fixes, or operational optimizations.
    """
    __tablename__ = "recommendations"

    title: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    recommendation_type: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        index=True
    )  # schema_fix, security_patch, compliance_update, performance_optimization
    description: Mapped[str] = mapped_column(Text, nullable=False)
    impact_analysis: Mapped[dict] = mapped_column(JSONB, default=dict, nullable=False)
    
    # Confidence and risk scoring
    confidence_score: Mapped[float] = mapped_column(Float, nullable=False, index=True)
    risk_score: Mapped[float] = mapped_column(Float, nullable=False, index=True)
    
    # Proposed action details
    proposed_action: Mapped[dict] = mapped_column(JSONB, default=dict, nullable=False)
    sql_script: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    code_diff: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    
    # Approval workflow
    status: Mapped[str] = mapped_column(
        String(20),
        default="pending",
        nullable=False,
        index=True
    )  # pending, approved, rejected, implemented, failed
    reviewed_by: Mapped[Optional[uuid.UUID]] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="SET NULL"),
        nullable=True
    )
    review_notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    
    # Specialist attribution
    generated_by_specialist: Mapped[str] = mapped_column(String(100), nullable=False)
    
    # Multi-tenancy and investigation association
    org_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("organizations.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )
    investigation_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("investigations.id", ondelete="SET NULL"),
        nullable=True,
        index=True
    )
    
    # Relationships
    organization: Mapped["Organization"] = relationship("Organization", back_populates="recommendations")
    reviewer: Mapped[Optional["User"]] = relationship("User", foreign_keys=[reviewed_by])
