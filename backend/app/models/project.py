import uuid
from sqlalchemy import ForeignKey, String
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from backend.app.models.base import Base, TimestampModel


class Project(Base, TimestampModel):
    """
    Sandboxed workspace projects for investigations and analytics.
    Each project can contain investigations, datasets, and specialist work.
    """
    __tablename__ = "projects"

    name: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    status: Mapped[str] = mapped_column(
        String(20),
        default="active",
        nullable=False,
        index=True
    )  # active, suspended, archived
    metadata_json: Mapped[dict] = mapped_column(
        JSONB,
        default=dict,
        nullable=False
    )  # JSON metadata for operational intelligence state

    # Multi-tenancy key binding
    org_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("organizations.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )

    # Relationships
    organization: Mapped["Organization"] = relationship("Organization", back_populates="projects")
