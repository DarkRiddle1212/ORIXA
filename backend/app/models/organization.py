from sqlalchemy import Boolean, String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from backend.app.models.base import Base, TimestampModel


class Organization(Base, TimestampModel):
    """
    Multi-tenant organization/tenant entity.
    All data is isolated by org_id for complete tenant separation.
    """
    __tablename__ = "organizations"

    name: Mapped[str] = mapped_column(String(100), nullable=False, unique=True, index=True)
    domain: Mapped[str] = mapped_column(String(100), nullable=True, unique=True, index=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False, index=True)

    # Relationships (all cascade delete for tenant isolation)
    users: Mapped[list["User"]] = relationship(
        "User", back_populates="organization", cascade="all, delete-orphan"
    )
    projects: Mapped[list["Project"]] = relationship(
        "Project", back_populates="organization", cascade="all, delete-orphan"
    )
    audit_logs: Mapped[list["AuditLog"]] = relationship(
        "AuditLog", back_populates="organization", cascade="all, delete-orphan"
    )
    investigations: Mapped[list["Investigation"]] = relationship(
        "Investigation", back_populates="organization", cascade="all, delete-orphan"
    )
    datasets: Mapped[list["Dataset"]] = relationship(
        "Dataset", back_populates="organization", cascade="all, delete-orphan"
    )
    specialists: Mapped[list["Specialist"]] = relationship(
        "Specialist", back_populates="organization", cascade="all, delete-orphan"
    )
    recommendations: Mapped[list["Recommendation"]] = relationship(
        "Recommendation", back_populates="organization", cascade="all, delete-orphan"
    )
    knowledge_entries: Mapped[list["KnowledgeEntry"]] = relationship(
        "KnowledgeEntry", back_populates="organization", cascade="all, delete-orphan"
    )
    predictions: Mapped[list["Prediction"]] = relationship(
        "Prediction", back_populates="organization", cascade="all, delete-orphan"
    )
    decisions: Mapped[list["Decision"]] = relationship(
        "Decision", back_populates="organization", cascade="all, delete-orphan"
    )
    replay_sessions: Mapped[list["ReplaySession"]] = relationship(
        "ReplaySession", back_populates="organization", cascade="all, delete-orphan"
    )
