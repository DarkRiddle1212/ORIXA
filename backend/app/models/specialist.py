import uuid
from typing import Optional
from sqlalchemy import ForeignKey, Integer, String, Text
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from backend.app.models.base import Base, TimestampModel


class Specialist(Base, TimestampModel):
    """
    Tracks AI specialist agents and their execution state.
    Stores specialist configurations, performance metrics, and health status.
    """
    __tablename__ = "specialists"

    name: Mapped[str] = mapped_column(String(100), nullable=False, unique=True, index=True)
    display_name: Mapped[str] = mapped_column(String(100), nullable=False)
    specialist_type: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        index=True
    )  # security, schema, compliance, performance, etc.
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    capabilities: Mapped[list] = mapped_column(JSONB, default=list, nullable=False)
    configuration: Mapped[dict] = mapped_column(JSONB, default=dict, nullable=False)
    
    # Status and health tracking
    status: Mapped[str] = mapped_column(
        String(20),
        default="standby",
        nullable=False,
        index=True
    )  # standby, active, busy, error, offline
    health_status: Mapped[str] = mapped_column(
        String(10),
        default="GREEN",
        nullable=False,
        index=True
    )  # GREEN, YELLOW, RED
    
    # Performance metrics
    total_tasks_executed: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    successful_executions: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    failed_executions: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    avg_execution_time_ms: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    
    # Multi-tenancy (specialists can be org-specific or global)
    org_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("organizations.id", ondelete="CASCADE"),
        nullable=True,
        index=True
    )
    
    # Relationships
    organization: Mapped[Optional["Organization"]] = relationship("Organization", back_populates="specialists")
