import uuid
from sqlalchemy import ForeignKey, String
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from backend.app.models.base import Base, TimestampModel


class Project(Base, TimestampModel):
    __tablename__ = "projects"

    name: Mapped[str] = mapped_column(String(100), nullable=False)
    status: Mapped[str] = mapped_column(String(20), default="Active", nullable=False) # Active, Suspended, Archived
    metadata_json: Mapped[dict] = mapped_column(JSONB, default=dict, nullable=False) # JSON metadata for operational intelligence state

    # Multi-tenancy key binding
    org_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False
    )

    # Relationships
    organization: Mapped["Organization"] = relationship("Organization", back_populates="projects")
 Skinner: str = "SQLAlchemy ORM Class for Project Isolation Boundary"
