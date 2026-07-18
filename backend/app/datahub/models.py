from typing import Any, Dict, List, Optional
from datetime import datetime
from pydantic import BaseModel, Field


class DataHubOwner(BaseModel):
    """Represents a data asset owner in DataHub."""
    email: str = Field(..., description="Unique email of the owner")
    name: str = Field(..., description="Full name of the owner")
    type: str = Field("USER", description="Type of owner: USER or GROUP")
    role: str = Field("DEVELOPER", description="Role: DEVELOPER, STEWARD, DATA_OWNER, etc.")


class DataHubTag(BaseModel):
    """Represents a descriptive metadata tag in DataHub."""
    name: str = Field(..., description="The tag name")
    description: Optional[str] = Field(None, description="Detailed description of the tag's semantic meaning")


class DataHubDomain(BaseModel):
    """Represents a business domain partitioning the catalog in DataHub."""
    urn: str = Field(..., description="The unique DataHub Domain URN")
    name: str = Field(..., description="Name of the domain, e.g., FINANCE, ENGINEERING")
    description: Optional[str] = Field(None, description="Detailed description of the domain scope")


class SchemaField(BaseModel):
    """Represents a field/column within a dataset schema in DataHub."""
    field_path: str = Field(..., description="The path to the field, e.g., user_id or orders.shipping_address")
    type: str = Field(..., description="Primitive data type, e.g., VARCHAR, INT, TIMESTAMP, JSON")
    description: Optional[str] = Field(None, description="Field documentation or semantic notes")
    nullable: bool = Field(True, description="Whether the field supports null values")
    tags: List[str] = Field(default_factory=list, description="Tags associated with this individual field")


class SchemaMetadata(BaseModel):
    """Represents table-level schema definitions in DataHub."""
    fields: List[SchemaField] = Field(default_factory=list, description="Ordered list of fields in this schema")
    primary_keys: List[str] = Field(default_factory=list, description="List of primary key field paths")
    foreign_keys: List[Dict[str, Any]] = Field(default_factory=list, description="Foreign key relationships mapped as dictionaries")


class DataHubDataset(BaseModel):
    """Represents a physical dataset (e.g. Snowflake Table, PostgreSQL, Kafka Topic) in DataHub."""
    urn: str = Field(..., description="The unique DataHub Dataset URN")
    name: str = Field(..., description="Human-friendly name of the dataset")
    platform: str = Field(..., description="Underlying technology provider, e.g., snowflake, postgres, bigquery")
    description: Optional[str] = Field(None, description="Contextual documentation or descriptions")
    domain: Optional[str] = Field(None, description="The name of the business domain this dataset belongs to")
    tags: List[str] = Field(default_factory=list, description="List of tags applied to this dataset")
    owners: List[DataHubOwner] = Field(default_factory=list, description="Assigned technical or business owners")
    schema_metadata: Optional[SchemaMetadata] = Field(None, description="Physical schema definition")
    created_at: Optional[str] = Field(None, description="Creation timestamp")
    updated_at: Optional[str] = Field(None, description="Last catalog modification timestamp")


class LineageNode(BaseModel):
    """Represents an individual node in the data lineage graph."""
    urn: str = Field(..., description="The unique URN of the dataset or pipeline node")
    name: str = Field(..., description="Name of the node")
    type: str = Field("DATASET", description="Type of node: DATASET, JOB, DASHBOARD")
    platform: str = Field(..., description="The platform or provider, e.g., postgres, dbt, airflow")


class DataHubLineage(BaseModel):
    """Represents lineage relationships for a specific dataset URN."""
    urn: str = Field(..., description="The source dataset URN being audited")
    upstream_nodes: List[LineageNode] = Field(default_factory=list, description="List of direct and indirect upstream sources")
    downstream_nodes: List[LineageNode] = Field(default_factory=list, description="List of direct and indirect downstream sinks")


class GlossaryTerm(BaseModel):
    """Represents a semantic business glossary term in DataHub."""
    urn: str = Field(..., description="The unique Glossary Term URN")
    name: str = Field(..., description="Standard business name of the term, e.g., CreditCardNumber")
    description: Optional[str] = Field(None, description="Strict enterprise definition of this glossary term")
    category: Optional[str] = Field(None, description="Category partition, e.g., PII, FINANCIAL, SECURITY")
