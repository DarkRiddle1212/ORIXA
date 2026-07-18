from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field
from backend.app.datahub.models import DataHubDataset, DataHubLineage, DataHubOwner, DataHubTag, DataHubDomain, GlossaryTerm


class ContextSearchRequest(BaseModel):
    """Query parameters for search context."""
    query: str = Field(..., description="The query string to search for across assets")
    type: Optional[str] = Field(None, description="Optional type filter (dataset, glossary, domain)")


class ContextSearchResponse(BaseModel):
    """Unified search result wrapper representing heterogeneous search results."""
    query: str = Field(..., description="The query string used in search execution")
    datasets: List[DataHubDataset] = Field(default_factory=list, description="List of matched dataset assets")
    glossary_terms: List[GlossaryTerm] = Field(default_factory=list, description="List of matched glossary terms")
    domains: List[DataHubDomain] = Field(default_factory=list, description="List of matched business domains")
    total_matched: int = Field(0, description="Total matched items across all categories")


class DatasetDetailsResponse(BaseModel):
    """Detailed response for a single dataset requested by URN."""
    urn: str = Field(..., description="Unique URN of the dataset")
    dataset: DataHubDataset = Field(..., description="The core dataset representation")


class LineageResponse(BaseModel):
    """Detailed response outlining upstream and downstream dependencies."""
    urn: str = Field(..., description="Unique URN of the subject dataset")
    lineage: DataHubLineage = Field(..., description="Lineage details")


class OwnersResponse(BaseModel):
    """Response containing list of owners registered to a dataset."""
    urn: str = Field(..., description="Unique URN of the dataset")
    owners: List[DataHubOwner] = Field(default_factory=list, description="List of dataset owners")
