import uuid
from datetime import datetime
from sqlalchemy import String, Float, JSON, Boolean, DateTime
from sqlalchemy.orm import Mapped, mapped_column
from backend.app.models.base import Base, TimestampModel

class DecisionRecord(Base, TimestampModel):
    __tablename__ = "decision_records"

    investigation_id: Mapped[str] = mapped_column(String(100), unique=True, index=True, nullable=False)
    status: Mapped[str] = mapped_column(String(50), default="PENDING", nullable=False)
    risk_level: Mapped[str] = mapped_column(String(50), default="MEDIUM", nullable=False)
    executive_summary: Mapped[str] = mapped_column(String(1000), nullable=True)
    final_recommendation: Mapped[str] = mapped_column(String(1000), nullable=True)
    
    # Store evidence, specialists, confidence dna, risks, audit, etc. as JSON fields
    evidence_panel: Mapped[dict] = mapped_column(JSON, default=dict, nullable=False)
    specialist_contributions: Mapped[list] = mapped_column(JSON, default=list, nullable=False)
    decision_dna: Mapped[dict] = mapped_column(JSON, default=dict, nullable=False)
    risk_assessment: Mapped[dict] = mapped_column(JSON, default=dict, nullable=False)
    atlas_summary: Mapped[str] = mapped_column(String(2000), nullable=True)
    evidence_trail: Mapped[list] = mapped_column(JSON, default=list, nullable=False)
    audit_trail: Mapped[list] = mapped_column(JSON, default=list, nullable=False)
