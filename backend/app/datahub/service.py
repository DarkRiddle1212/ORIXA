from typing import Any, Dict, List, Optional
from backend.app.core.logging import logger
from backend.app.datahub.client import get_datahub_client, DataHubClientInterface
from backend.app.datahub.cache import metadata_cache
from backend.app.datahub.models import (
    DataHubDataset, DataHubLineage, DataHubOwner, DataHubTag,
    DataHubDomain, SchemaMetadata, GlossaryTerm
)


class DataHubContextService:
    """
    Unified metadata service managing cached and resilient access to DataHub resources.
    This acts as the single gateway layer — specialists never talk directly to clients,
    guaranteeing protocol independence (REST, GraphQL, MCP).
    """

    def __init__(self):
        self.client: DataHubClientInterface = get_datahub_client()

    async def search_assets(self, query: str, type_filter: Optional[str] = None) -> Dict[str, Any]:
        """Search across datasets, glossary terms, and domains with caching."""
        cache_key = f"search:{query}:{type_filter or 'all'}"
        cached = metadata_cache.get(cache_key)
        if cached is not None:
            logger.info(f"DataHubContextService: Cache hit for search query='{query}'")
            return cached

        try:
            res = await self.client.search_assets(query, type_filter)
            # We serialize models to dicts for clean cache serialization
            metadata_cache.set(cache_key, res, ttl=180)  # Short TTL for search
            return res
        except Exception as e:
            logger.error(f"DataHubContextService: Error in search_assets: {str(e)}")
            raise e

    async def get_dataset(self, urn: str) -> Optional[DataHubDataset]:
        """Retrieve full details of a specific dataset with cache lookup."""
        cache_key = f"dataset:{urn}"
        cached = metadata_cache.get(cache_key)
        if cached is not None:
            logger.info(f"DataHubContextService: Cache hit for dataset URN='{urn}'")
            return DataHubDataset(**cached)

        try:
            ds = await self.client.get_dataset(urn)
            if ds:
                metadata_cache.set(cache_key, ds.model_dump(), ttl=300)
            return ds
        except Exception as e:
            logger.error(f"DataHubContextService: Error getting dataset {urn}: {str(e)}")
            return None

    async def get_lineage(self, urn: str) -> Optional[DataHubLineage]:
        """Retrieve the upstream and downstream lineage relationships for a dataset URN."""
        cache_key = f"lineage:{urn}"
        cached = metadata_cache.get(cache_key)
        if cached is not None:
            logger.info(f"DataHubContextService: Cache hit for lineage URN='{urn}'")
            return DataHubLineage(**cached)

        try:
            lin = await self.client.get_lineage(urn)
            if lin:
                metadata_cache.set(cache_key, lin.model_dump(), ttl=300)
            return lin
        except Exception as e:
            logger.error(f"DataHubContextService: Error getting lineage {urn}: {str(e)}")
            return None

    async def get_owners(self, urn: str) -> List[DataHubOwner]:
        """Retrieve registered technical and business owners of an asset."""
        cache_key = f"owners:{urn}"
        cached = metadata_cache.get(cache_key)
        if cached is not None:
            return [DataHubOwner(**o) for o in cached]

        try:
            owners = await self.client.get_owners(urn)
            metadata_cache.set(cache_key, [o.model_dump() for o in owners], ttl=300)
            return owners
        except Exception as e:
            logger.error(f"DataHubContextService: Error getting owners for {urn}: {str(e)}")
            return []

    async def get_tags(self, urn: str) -> List[DataHubTag]:
        """Retrieve tags assigned to an asset."""
        cache_key = f"tags:{urn}"
        cached = metadata_cache.get(cache_key)
        if cached is not None:
            return [DataHubTag(**t) for t in cached]

        try:
            tags = await self.client.get_tags(urn)
            metadata_cache.set(cache_key, [t.model_dump() for t in tags], ttl=300)
            return tags
        except Exception as e:
            logger.error(f"DataHubContextService: Error getting tags for {urn}: {str(e)}")
            return []

    async def get_domains(self) -> List[DataHubDomain]:
        """Retrieve all defined domains in the DataHub instance."""
        cache_key = "domains:all"
        cached = metadata_cache.get(cache_key)
        if cached is not None:
            return [DataHubDomain(**d) for d in cached]

        try:
            doms = await self.client.get_domains()
            metadata_cache.set(cache_key, [d.model_dump() for d in doms], ttl=600)
            return doms
        except Exception as e:
            logger.error(f"DataHubContextService: Error getting domains: {str(e)}")
            return []

    async def get_schema(self, urn: str) -> Optional[SchemaMetadata]:
        """Retrieve physical schema specifications for a dataset."""
        cache_key = f"schema:{urn}"
        cached = metadata_cache.get(cache_key)
        if cached is not None:
            return SchemaMetadata(**cached)

        try:
            schema = await self.client.get_schema(urn)
            if schema:
                metadata_cache.set(cache_key, schema.model_dump(), ttl=300)
            return schema
        except Exception as e:
            logger.error(f"DataHubContextService: Error getting schema for {urn}: {str(e)}")
            return None

    async def get_documentation(self, urn: str) -> Optional[str]:
        """Retrieve rich text documentation/readme for an asset."""
        cache_key = f"doc:{urn}"
        cached = metadata_cache.get(cache_key)
        if cached is not None:
            return cached

        try:
            doc = await self.client.get_documentation(urn)
            if doc:
                metadata_cache.set(cache_key, doc, ttl=300)
            return doc
        except Exception as e:
            logger.error(f"DataHubContextService: Error getting documentation for {urn}: {str(e)}")
            return None

    async def search_glossary(self, query: str) -> List[GlossaryTerm]:
        """Search or list semantic business glossary terms."""
        cache_key = f"glossary:search:{query}"
        cached = metadata_cache.get(cache_key)
        if cached is not None:
            return [GlossaryTerm(**t) for t in cached]

        try:
            terms = await self.client.search_glossary(query)
            metadata_cache.set(cache_key, [t.model_dump() for t in terms], ttl=180)
            return terms
        except Exception as e:
            logger.error(f"DataHubContextService: Error searching glossary for {query}: {str(e)}")
            return []


# Global singleton instance of Context Layer service
context_service = DataHubContextService()
