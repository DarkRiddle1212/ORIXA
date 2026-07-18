import uuid
from typing import Optional
from sqlalchemy import ForeignKey, Integer, String, Text
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from backend.app.models.base import Base, TimestampModel


class KnowledgeEntry(Base, TimestampModel):
    """
    Organizational Memory knowledge base entries.
    Stores policies, runbooks, schemas, compliance docs, and historical incident resolutions.
    """
    __tablename__ = "knowledge_entries"

    title: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    category: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        index=True
    )  # policy, runbook, schema_definition, historical_incident, compliance_guide
    content: Mapped[str] = mapped_column(Text, nullable=False)
    source_uri: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    tags: Mapped[list] = mapped_column(JSONB, default=list, nullable=False)
    metadata: Mapped[dict] = mapped_column(JSONB, default=dict, nullable=False)
    
    # Vector embedding for semantic search (will be populated by embedding service)
    embedding_model: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    embedding_dim: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    # Note: actual vector column will be added in migration with pgvector extension
    
    # Version control
    version: Mapped[int] = mapped_column(Integer, default=1, nullable=False)
    parent_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("knowledge_entries.id", ondelete="SET NULL"),
        nullable=True
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
    organization: Mapped["Organization"] = relationship("Organization", back_populates="knowledge_entries")
    creator: Mapped[Optional["User"]] = relationship("User", foreign_keys=[created_by])
