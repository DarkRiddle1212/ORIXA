import uuid
from typing import Optional
from sqlalchemy import ForeignKey, Integer, String, Text
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from backend.app.models.base import Base, TimestampModel


class ReplaySession(Base, TimestampModel):
    """
    Incident Replay sessions for time-series playback of past investigations.
    Stores frame-by-frame event sequences for temporal analysis.
    """
    __tablename__ = "replay_sessions"

    title: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    
    # Session configuration
    replay_type: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        index=True
    )  # investigation, specialist_execution, system_event, audit_trail
    playback_speed: Mapped[float] = mapped_column(
        nullable=False,
        default=1.0
    )  # 0.5 = half speed, 2.0 = double speed
    
    # Timeline metadata
    start_timestamp: Mapped[str] = mapped_column(String(50), nullable=False, index=True)
    end_timestamp: Mapped[str] = mapped_column(String(50), nullable=False, index=True)
    total_frames: Mapped[int] = mapped_column(Integer, nullable=False)
    total_duration_ms: Mapped[int] = mapped_column(Integer, nullable=False)
    
    # Frame data
    frames: Mapped[list] = mapped_column(JSONB, default=list, nullable=False)
    event_markers: Mapped[list] = mapped_column(JSONB, default=list, nullable=False)
    metadata: Mapped[dict] = mapped_column(JSONB, default=dict, nullable=False)
    
    # Playback state
    current_frame_index: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    playback_status: Mapped[str] = mapped_column(
        String(20),
        default="stopped",
        nullable=False
    )  # stopped, playing, paused, completed
    
    # Investigation reference
    investigation_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("investigations.id", ondelete="SET NULL"),
        nullable=True,
        index=True
    )
    
    # Multi-tenancy
    org_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("organizations.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )
    created_by: Mapped[Optional[uuid.UUID]] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="SET NULL"),
        nullable=True
    )
    
    # Relationships
    organization: Mapped["Organization"] = relationship("Organization", back_populates="replay_sessions")
    creator: Mapped[Optional["User"]] = relationship("User", foreign_keys=[created_by])
