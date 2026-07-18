import uuid
from typing import Optional
from sqlalchemy import ForeignKey, Float, String, Text, Boolean
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from backend.app.models.base import Base, TimestampModel


class Prediction(Base, TimestampModel):
    """
    Proactive predictive alerts from the Prediction Engine.
    Forecasts schema drift, security risks, capacity bottlenecks, and compliance failures.
    """
    __tablename__ = "predictions"

    title: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    target_type: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        index=True
    )  # schema_drift, compliance_failure, resource_bottleneck, security_risk
    description: Mapped[str] = mapped_column(Text, nullable=False)
    
    # Risk assessment
    risk_score: Mapped[float] = mapped_column(Float, nullable=False, index=True)  # 0.00 to 100.00
    confidence_level: Mapped[float] = mapped_column(Float, nullable=False)  # 0.00 to 1.00
    severity: Mapped[str] = mapped_column(
        String(10),
        nullable=False,
        index=True
    )  # low, medium, high, critical
    
    # Prediction details and recommendations
    prediction_details: Mapped[dict] = mapped_column(JSONB, default=dict, nullable=False)
    recommended_actions: Mapped[list] = mapped_column(JSONB, default=list, nullable=False)
    impact_analysis: Mapped[dict] = mapped_column(JSONB, default=dict, nullable=False)
    
    # Timing prediction
    predicted_occurrence_window: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    
    # Resolution tracking
    is_mitigated: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False, index=True)
    mitigation_notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    mitigated_at: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    mitigated_by: Mapped[Optional[uuid.UUID]] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="SET NULL"),
        nullable=True
    )
    
    # Model attribution
    model_version: Mapped[str] = mapped_column(String(50), nullable=False)
    specialist_name: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    
    # Multi-tenancy and project association
    org_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("organizations.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )
    project_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("projects.id", ondelete="SET NULL"),
        nullable=True,
        index=True
    )
    
    # Relationships
    organization: Mapped["Organization"] = relationship("Organization", back_populates="predictions")
    mitigator: Mapped[Optional["User"]] = relationship("User", foreign_keys=[mitigated_by])
