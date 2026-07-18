import uuid
from typing import Optional
from sqlalchemy import ForeignKey, String, Text
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from backend.app.models.base import Base, TimestampModel


class Dataset(Base, TimestampModel):
    """
    Represents metadata about datasets synchronized from DataHub or
    other catalog sources.
    """
    __tablename__ = "datasets"

    name: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    urn: Mapped[str] = mapped_column(String(500), nullable=False, unique=True, index=True)
    platform: Mapped[str] = mapped_column(String(50), nullable=False, index=True)  # bigquery, postgres, snowflake, etc.
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    schema_metadata: Mapped[dict] = mapped_column(JSONB, default=dict, nullable=False)
    tags: Mapped[list] = mapped_column(JSONB, default=list, nullable=False)
    owners: Mapped[list] = mapped_column(JSONB, default=list, nullable=False)
    lineage_metadata: Mapped[dict] = mapped_column(JSONB, default=dict, nullable=False)
    
    # DataHub sync status
    last_synced_at: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    sync_status: Mapped[str] = mapped_column(
        String(20),
        default="pending",
        nullable=False,
        index=True
    )  # pending, synced, failed, stale
    
    # Multi-tenancy
    org_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("organizations.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )
    
    # Relationships
    organization: Mapped["Organization"] = relationship("Organization", back_populates="datasets")
