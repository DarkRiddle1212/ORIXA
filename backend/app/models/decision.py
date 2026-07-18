import uuid
from typing import Optional
from sqlalchemy import ForeignKey, Float, String, Text
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from backend.app.models.base import Base, TimestampModel


class Decision(Base, TimestampModel):
    """
    Human-in-the-loop decision records from the Decision DNA Center.
    Tracks operator approvals/rejections of AI-generated recommendations.
    """
    __tablename__ = "decisions"

    title: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    decision_type: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        index=True
    )  # schema_change, security_action, compliance_fix, configuration_update
    description: Mapped[str] = mapped_column(Text, nullable=False)
    
    # Proposed change details
    proposed_changes: Mapped[dict] = mapped_column(JSONB, default=dict, nullable=False)
    risk_assessment: Mapped[dict] = mapped_column(JSONB, default=dict, nullable=False)
    evidence_chain: Mapped[list] = mapped_column(JSONB, default=list, nullable=False)
    explainability_trace: Mapped[dict] = mapped_column(JSONB, default=dict, nullable=False)
    
    # Confidence scoring
    confidence_score: Mapped[float] = mapped_column(Float, nullable=False, index=True)
    risk_score: Mapped[float] = mapped_column(Float, nullable=False, index=True)
    
    # Decision workflow
    status: Mapped[str] = mapped_column(
        String(20),
        default="pending",
        nullable=False,
        index=True
    )  # pending, approved, rejected, implemented, failed
    decision_outcome: Mapped[Optional[str]] = mapped_column(String(20), nullable=True)  # approve, reject
    decision_notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    decided_at: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    
    # Implementation tracking
    implemented_at: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    implementation_status: Mapped[Optional[str]] = mapped_column(String(20), nullable=True)
    implementation_notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    
    # Actor tracking
    requested_by_specialist: Mapped[str] = mapped_column(String(100), nullable=False)
    decided_by: Mapped[Optional[uuid.UUID]] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="SET NULL"),
        nullable=True
    )
    
    # Multi-tenancy and investigation/recommendation linkage
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
    recommendation_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("recommendations.id", ondelete="SET NULL"),
        nullable=True,
        index=True
    )
    
    # Relationships
    organization: Mapped["Organization"] = relationship("Organization", back_populates="decisions")
    decider: Mapped[Optional["User"]] = relationship("User", foreign_keys=[decided_by])
