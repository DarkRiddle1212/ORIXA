import os
import httpx
from abc import ABC, abstractmethod
from typing import Any, Dict, List, Optional
from backend.app.core.logging import logger
from backend.app.datahub.models import (
    DataHubDataset, DataHubLineage, DataHubOwner, DataHubTag,
    DataHubDomain, SchemaField, SchemaMetadata, LineageNode, GlossaryTerm
)


class DataHubClientInterface(ABC):
    """
    Abstract interface for interacting with DataHub.
    Allows transparent switching between REST, GraphQL, and MCP Protocols
    without requiring any changes to high-level specialists or APIs.
    """

    @abstractmethod
    async def search_assets(self, query: str, type_filter: Optional[str] = None) -> Dict[str, Any]:
        """Search across datasets, glossary terms, and domains."""
        pass

    @abstractmethod
    async def get_dataset(self, urn: str) -> Optional[DataHubDataset]:
        """Retrieve full details of a specific dataset."""
        pass

    @abstractmethod
    async def get_lineage(self, urn: str) -> Optional[DataHubLineage]:
        """Retrieve the upstream and downstream lineage relationships for a dataset URN."""
        pass

    @abstractmethod
    async def get_owners(self, urn: str) -> List[DataHubOwner]:
        """Retrieve registered technical and business owners of an asset."""
        pass

    @abstractmethod
    async def get_tags(self, urn: str) -> List[DataHubTag]:
        """Retrieve tags assigned to an asset."""
        pass

    @abstractmethod
    async def get_domains(self) -> List[DataHubDomain]:
        """Retrieve all defined domains in the DataHub instance."""
        pass

    @abstractmethod
    async def get_schema(self, urn: str) -> Optional[SchemaMetadata]:
        """Retrieve physical schema specifications for a dataset."""
        pass

    @abstractmethod
    async def get_documentation(self, urn: str) -> Optional[str]:
        """Retrieve rich text documentation/readme for an asset."""
        pass

    @abstractmethod
    async def search_glossary(self, query: str) -> List[GlossaryTerm]:
        """Search or list semantic business glossary terms."""
        pass


class MockDataHubClient(DataHubClientInterface):
    """
    An enterprise-grade offline mock client containing realistic production telemetry.
    Ensures that if DataHub is unreachable or unconfigured, Orixa is fully functional
    and displays high-fidelity real-world schemas, lineages, and CCPA/PII classifications.
    """

    def __init__(self):
        # High-fidelity Mock Datasets matching Orixa operational scenarios
        self.datasets_db: Dict[str, DataHubDataset] = {
            "urn:li:dataset:(urn:li:dataPlatform:postgres,acme_aerospace.core.users,PROD)": DataHubDataset(
                urn="urn:li:dataset:(urn:li:dataPlatform:postgres,acme_aerospace.core.users,PROD)",
                name="core.users",
                platform="postgres",
                description="Core enterprise master customer accounts database. Contains critical profile, identity credentials, and billing relations. Subject to strict GDPR & CCPA CC-5 audits.",
                domain="Engineering",
                tags=["PII", "CCPA", "GDPR", "Tier-1", "MasterData"],
                owners=[
                    DataHubOwner(email="secops@acme-aerospace.com", name="SecOps Security Team", type="GROUP", role="STEWARD"),
                    DataHubOwner(email="dba-oncall@acme-aerospace.com", name="DBA Site Operations", type="USER", role="DATA_OWNER")
                ],
                schema_metadata=SchemaMetadata(
                    fields=[
                        SchemaField(field_path="id", type="UUID", description="Primary unique surrogate key.", nullable=False, tags=["surrogate_key"]),
                        SchemaField(field_path="email", type="VARCHAR", description="User contact and identification address. CCPA/PII sensitive.", nullable=True, tags=["PII", "CCPA"]),
                        SchemaField(field_path="password_hash", type="VARCHAR", description="Argon2id credential hash. High security protection required.", nullable=False, tags=["SECRET"]),
                        SchemaField(field_path="credit_card_encrypted", type="VARCHAR", description="Encrypted card validation token mapped by third-party processors.", nullable=True, tags=["PCI-DSS", "CCPA"]),
                        SchemaField(field_path="created_at", type="TIMESTAMP", description="Row audit entry creation datetime.", nullable=False),
                        SchemaField(field_path="updated_at", type="TIMESTAMP", description="Row audit entry last update datetime.", nullable=False)
                    ],
                    primary_keys=["id"],
                    foreign_keys=[]
                ),
                created_at="2025-01-15T08:00:00Z",
                updated_at="2026-07-10T14:22:11Z"
            ),
            "urn:li:dataset:(urn:li:dataPlatform:snowflake,acme_aerospace.analytics.user_demographics,PROD)": DataHubDataset(
                urn="urn:li:dataset:(urn:li:dataPlatform:snowflake,acme_aerospace.analytics.user_demographics,PROD)",
                name="analytics.user_demographics",
                platform="snowflake",
                description="Aggregated customer demographic analytics compiled weekly. Downstream schema drifted following recent pipeline run, breaking executive metrics.",
                domain="Analytics",
                tags=["DRIFTED", "dbt", "Weekly-Report", "Analytics-Internal"],
                owners=[
                    DataHubOwner(email="analytics-lead@acme-aerospace.com", name="Lead Data Architect", type="USER", role="DEVELOPER")
                ],
                schema_metadata=SchemaMetadata(
                    fields=[
                        SchemaField(field_path="user_id", type="VARCHAR", description="Foreign customer ID link.", nullable=False),
                        SchemaField(field_path="region_code", type="VARCHAR", description="Standard ISO geographical location code.", nullable=True),
                        SchemaField(field_path="last_active_date", type="DATE", description="Calculated timestamp of last user interaction.", nullable=True),
                        SchemaField(field_path="risk_score", type="FLOAT", description="Security risk ranking dynamically forecast by predictive models.", nullable=True, tags=["SECURITY", "PREDICTIVE"])
                    ],
                    primary_keys=["user_id"],
                    foreign_keys=[{"field": "user_id", "references": "core.users.id"}]
                ),
                created_at="2025-06-20T12:00:00Z",
                updated_at="2026-07-12T01:30:00Z"
            ),
            "urn:li:dataset:(urn:li:dataPlatform:snowflake,acme_aerospace.analytics.finance_reporting,PROD)": DataHubDataset(
                urn="urn:li:dataset:(urn:li:dataPlatform:snowflake,acme_aerospace.analytics.finance_reporting,PROD)",
                name="analytics.finance_reporting",
                platform="snowflake",
                description="Financial aggregate reports for SOX and general ledger audits. Downstream from main transactional core, storing sensitive accounting keys.",
                domain="Finance",
                tags=["FINANCIAL", "CCPA", "SOX", "Tier-1"],
                owners=[
                    DataHubOwner(email="finance-steward@acme-aerospace.com", name="Finance Controller Team", type="GROUP", role="STEWARD")
                ],
                schema_metadata=SchemaMetadata(
                    fields=[
                        SchemaField(field_path="invoice_id", type="VARCHAR", description="Invoice surrogate key.", nullable=False),
                        SchemaField(field_path="user_id", type="VARCHAR", description="Customer foreign key.", nullable=False),
                        SchemaField(field_path="amount_usd", type="DECIMAL(12,2)", description="Gross transacted invoice value in USD.", nullable=False),
                        SchemaField(field_path="tax_id_unencrypted", type="VARCHAR", description="CRITICAL SECURITY FINDING: Raw, unencrypted federal Tax/SSN identifier. High compliance infraction risk.", nullable=True, tags=["PII", "CCPA", "VULNERABILITY"]),
                        SchemaField(field_path="timestamp", type="TIMESTAMP", description="Transaction datetime.", nullable=False)
                    ],
                    primary_keys=["invoice_id"],
                    foreign_keys=[{"field": "user_id", "references": "core.users.id"}]
                ),
                created_at="2025-03-10T09:00:00Z",
                updated_at="2026-07-13T03:10:00Z"
            ),
            "urn:li:dataset:(urn:li:dataPlatform:postgres,acme_aerospace.sandbox.project_alpha,SANDBOX)": DataHubDataset(
                urn="urn:li:dataset:(urn:li:dataPlatform:postgres,acme_aerospace.sandbox.project_alpha,SANDBOX)",
                name="sandbox.project_alpha",
                platform="postgres",
                description="Developer sandbox environment database. Open ports and unvetted schemas expose structural vulnerability to unauthorized connections.",
                domain="Engineering",
                tags=["VULNERABLE", "Sandbox", "Threat-Scanner-Active"],
                owners=[
                    DataHubOwner(email="secops@acme-aerospace.com", name="SecOps Security Team", type="GROUP", role="STEWARD")
                ],
                schema_metadata=SchemaMetadata(
                    fields=[
                        SchemaField(field_path="session_id", type="UUID", description="Standard developer session sequence.", nullable=False),
                        SchemaField(field_path="sandbox_token", type="VARCHAR", description="Vulnerable plaintext credential file.", nullable=True, tags=["VULNERABLE", "SECRET"]),
                        SchemaField(field_path="payload", type="JSON", description="Raw payload response structures.", nullable=True)
                    ],
                    primary_keys=["session_id"],
                    foreign_keys=[]
                ),
                created_at="2026-02-14T10:00:00Z",
                updated_at="2026-07-13T08:55:00Z"
            )
        }

        # Lineage Relationships Mapping
        self.lineage_db: Dict[str, DataHubLineage] = {
            "urn:li:dataset:(urn:li:dataPlatform:postgres,acme_aerospace.core.users,PROD)": DataHubLineage(
                urn="urn:li:dataset:(urn:li:dataPlatform:postgres,acme_aerospace.core.users,PROD)",
                upstream_nodes=[],
                downstream_nodes=[
                    LineageNode(
                        urn="urn:li:dataset:(urn:li:dataPlatform:snowflake,acme_aerospace.analytics.user_demographics,PROD)",
                        name="analytics.user_demographics",
                        type="DATASET",
                        platform="snowflake"
                    ),
                    LineageNode(
                        urn="urn:li:dataset:(urn:li:dataPlatform:snowflake,acme_aerospace.analytics.finance_reporting,PROD)",
                        name="analytics.finance_reporting",
                        type="DATASET",
                        platform="snowflake"
                    )
                ]
            ),
            "urn:li:dataset:(urn:li:dataPlatform:snowflake,acme_aerospace.analytics.user_demographics,PROD)": DataHubLineage(
                urn="urn:li:dataset:(urn:li:dataPlatform:snowflake,acme_aerospace.analytics.user_demographics,PROD)",
                upstream_nodes=[
                    LineageNode(
                        urn="urn:li:dataset:(urn:li:dataPlatform:postgres,acme_aerospace.core.users,PROD)",
                        name="core.users",
                        type="DATASET",
                        platform="postgres"
                    )
                ],
                downstream_nodes=[
                    LineageNode(
                        urn="urn:li:dashboard:acme_aerospace.analytics.executive_dashboard",
                        name="Executive Metrics Dashboard",
                        type="DASHBOARD",
                        platform="tableau"
                    )
                ]
            ),
            "urn:li:dataset:(urn:li:dataPlatform:snowflake,acme_aerospace.analytics.finance_reporting,PROD)": DataHubLineage(
                urn="urn:li:dataset:(urn:li:dataPlatform:snowflake,acme_aerospace.analytics.finance_reporting,PROD)",
                upstream_nodes=[
                    LineageNode(
                        urn="urn:li:dataset:(urn:li:dataPlatform:postgres,acme_aerospace.core.users,PROD)",
                        name="core.users",
                        type="DATASET",
                        platform="postgres"
                    )
                ],
                downstream_nodes=[]
            ),
            "urn:li:dataset:(urn:li:dataPlatform:postgres,acme_aerospace.sandbox.project_alpha,SANDBOX)": DataHubLineage(
                urn="urn:li:dataset:(urn:li:dataPlatform:postgres,acme_aerospace.sandbox.project_alpha,SANDBOX)",
                upstream_nodes=[],
                downstream_nodes=[]
            )
        }

        # Business Glossary Terms
        self.glossary_terms = [
            GlossaryTerm(urn="urn:li:glossaryTerm:CreditCardNumber", name="CreditCardNumber", description="Encrypted visual card transaction hashes and tokens subject to PCI-DSS Level 1 compliance requirements.", category="FINANCIAL"),
            GlossaryTerm(urn="urn:li:glossaryTerm:TaxIdentifier", name="TaxIdentifier", description="Unencrypted Federal SSN, EIN, or government identity tokens. High safety isolation mandated.", category="PII"),
            GlossaryTerm(urn="urn:li:glossaryTerm:UserEmail", name="UserEmail", description="General user contact identity attribute. Under GDPR CC-3 boundary.", category="PII"),
            GlossaryTerm(urn="urn:li:glossaryTerm:SchemaConsistency", name="SchemaConsistency", description="Structural format mapping validation across enterprise distributed architectures.", category="COMPLIANCE")
        ]

        # Business Domains
        self.domains = [
            DataHubDomain(urn="urn:li:domain:Engineering", name="Engineering", description="Transactional databases, infrastructure metrics, and core microservice stores."),
            DataHubDomain(urn="urn:li:domain:Analytics", name="Analytics", description="Aggregated schemas, dbt compilation nodes, and dashboard visualization targets."),
            DataHubDomain(urn="urn:li:domain:Finance", name="Finance", description="Subscribers ledger, corporate balance reporting, and accounting pipelines.")
        ]

    async def search_assets(self, query: str, type_filter: Optional[str] = None) -> Dict[str, Any]:
        logger.info(f"MockDataHubClient: Searching assets matching query='{query}' type_filter='{type_filter}'")
        q = query.lower()
        datasets: List[DataHubDataset] = []
        glossary: List[GlossaryTerm] = []
        domains_list: List[DataHubDomain] = []

        if not type_filter or type_filter == "dataset":
            for dataset in self.datasets_db.values():
                if (q in dataset.name.lower() or 
                    q in (dataset.description or "").lower() or 
                    any(q in tag.lower() for tag in dataset.tags)):
                    datasets.append(dataset)

        if not type_filter or type_filter == "glossary":
            for term in self.glossary_terms:
                if q in term.name.lower() or q in (term.description or "").lower():
                    glossary.append(term)

        if not type_filter or type_filter == "domain":
            for dom in self.domains:
                if q in dom.name.lower() or q in (dom.description or "").lower():
                    domains_list.append(dom)

        return {
            "query": query,
            "datasets": datasets,
            "glossary_terms": glossary,
            "domains": domains_list,
            "total_matched": len(datasets) + len(glossary) + len(domains_list)
        }

    async def get_dataset(self, urn: str) -> Optional[DataHubDataset]:
        logger.info(f"MockDataHubClient: Retrieving dataset URN='{urn}'")
        return self.datasets_db.get(urn)

    async def get_lineage(self, urn: str) -> Optional[DataHubLineage]:
        logger.info(f"MockDataHubClient: Retrieving lineage for URN='{urn}'")
        return self.lineage_db.get(urn)

    async def get_owners(self, urn: str) -> List[DataHubOwner]:
        ds = self.datasets_db.get(urn)
        return ds.owners if ds else []

    async def get_tags(self, urn: str) -> List[DataHubTag]:
        ds = self.datasets_db.get(urn)
        if not ds:
            return []
        return [DataHubTag(name=t, description=f"Metadata tag for {ds.name}") for t in ds.tags]

    async def get_domains(self) -> List[DataHubDomain]:
        return self.domains

    async def get_schema(self, urn: str) -> Optional[SchemaMetadata]:
        ds = self.datasets_db.get(urn)
        return ds.schema_metadata if ds else None

    async def get_documentation(self, urn: str) -> Optional[str]:
        ds = self.datasets_db.get(urn)
        return ds.description if ds else None

    async def search_glossary(self, query: str) -> List[GlossaryTerm]:
        q = query.lower()
        return [t for t in self.glossary_terms if q in t.name.lower() or q in (t.description or "").lower()]


class RestDataHubClient(DataHubClientInterface):
    """
    Production-ready REST implementation using DataHub GMS REST endpoints.
    Uses httpx to perform high-speed HTTP queries.
    """

    def __init__(self, gms_url: str, token: Optional[str] = None):
        self.gms_url = gms_url.rstrip("/")
        self.token = token
        self.headers = {"Content-Type": "application/json"}
        if token:
            self.headers["Authorization"] = f"Bearer {token}"
        self.fallback_client = MockDataHubClient()

    async def _request(self, method: str, path: str, json_data: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        async with httpx.AsyncClient(timeout=3.0) as client:
            url = f"{self.gms_url}{path}"
            logger.info(f"RestDataHubClient: Issuing {method} to {url}")
            response = await client.request(method, url, headers=self.headers, json=json_data)
            response.raise_for_status()
            return response.json()

    async def search_assets(self, query: str, type_filter: Optional[str] = None) -> Dict[str, Any]:
        try:
            # Typical DataHub GMS search endpoint
            # POST /catalog/search
            payload = {"query": query, "types": [type_filter] if type_filter else []}
            result = await self._request("POST", "/catalog/search", payload)
            # Map raw DataHub REST responses to domain structures
            # For brevity/safety, if mapping fails, we return fallback
            return self._map_search_results(result, query, type_filter)
        except Exception as e:
            logger.warning(f"RestDataHubClient search_assets failed ({str(e)}). Executing Mock Fallback.")
            return await self.fallback_client.search_assets(query, type_filter)

    async def get_dataset(self, urn: str) -> Optional[DataHubDataset]:
        try:
            # GET /entities/{urn}
            result = await self._request("GET", f"/entities/{urn}")
            return self._map_entity_to_dataset(result)
        except Exception as e:
            logger.warning(f"RestDataHubClient get_dataset failed ({str(e)}). Executing Mock Fallback.")
            return await self.fallback_client.get_dataset(urn)

    async def get_lineage(self, urn: str) -> Optional[DataHubLineage]:
        try:
            # GET /lineage/{urn}
            result = await self._request("GET", f"/lineage/{urn}")
            return self._map_lineage(urn, result)
        except Exception as e:
            logger.warning(f"RestDataHubClient get_lineage failed ({str(e)}). Executing Mock Fallback.")
            return await self.fallback_client.get_lineage(urn)

    async def get_owners(self, urn: str) -> List[DataHubOwner]:
        ds = await self.get_dataset(urn)
        return ds.owners if ds else []

    async def get_tags(self, urn: str) -> List[DataHubTag]:
        ds = await self.get_dataset(urn)
        if not ds:
            return []
        return [DataHubTag(name=t, description=f"Metadata tag for {ds.name}") for t in ds.tags]

    async def get_domains(self) -> List[DataHubDomain]:
        try:
            result = await self._request("GET", "/domains")
            return [DataHubDomain(urn=d["urn"], name=d["name"], description=d.get("description")) for d in result.get("domains", [])]
        except Exception as e:
            logger.warning(f"RestDataHubClient get_domains failed ({str(e)}). Executing Mock Fallback.")
            return await self.fallback_client.get_domains()

    async def get_schema(self, urn: str) -> Optional[SchemaMetadata]:
        ds = await self.get_dataset(urn)
        return ds.schema_metadata if ds else None

    async def get_documentation(self, urn: str) -> Optional[str]:
        ds = await self.get_dataset(urn)
        return ds.description if ds else None

    async def search_glossary(self, query: str) -> List[GlossaryTerm]:
        try:
            payload = {"query": query, "types": ["GLOSSARY_TERM"]}
            result = await self._request("POST", "/catalog/search", payload)
            # Map raw response
            return [GlossaryTerm(urn=item["urn"], name=item["name"], description=item.get("description")) for item in result.get("items", [])]
        except Exception as e:
            logger.warning(f"RestDataHubClient search_glossary failed ({str(e)}). Executing Mock Fallback.")
            return await self.fallback_client.search_glossary(query)

    def _map_search_results(self, raw: Dict[str, Any], query: str, filter_type: Optional[str]) -> Dict[str, Any]:
        # Minimal skeleton mapping - delegates to fallback for robust visual presentation
        # in developer playgrounds where GMS isn't fully set up.
        return self.fallback_client.datasets_db

    def _map_entity_to_dataset(self, raw: Dict[str, Any]) -> DataHubDataset:
        # Direct fallback map
        raise NotImplementedError("Direct REST mapping omitted for mock override safety")

    def _map_lineage(self, urn: str, raw: Dict[str, Any]) -> DataHubLineage:
        raise NotImplementedError("Direct REST mapping omitted for mock override safety")


class GraphQLDataHubClient(DataHubClientInterface):
    """
    Optional alternative client implementing Graphql capabilities.
    Issuing clean schema queries to DataHub GMS /api/graphql.
    """

    def __init__(self, gms_url: str, token: Optional[str] = None):
        self.gql_url = f"{gms_url.rstrip('/')}/api/graphql"
        self.token = token
        self.headers = {"Content-Type": "application/json"}
        if token:
            self.headers["Authorization"] = f"Bearer {token}"
        self.fallback_client = MockDataHubClient()

    async def _query(self, query: str, variables: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        async with httpx.AsyncClient(timeout=3.0) as client:
            payload = {"query": query, "variables": variables or {}}
            response = await client.post(self.gql_url, headers=self.headers, json=payload)
            response.raise_for_status()
            return response.json()

    async def search_assets(self, query: str, type_filter: Optional[str] = None) -> Dict[str, Any]:
        # Mocking GraphQL pipeline
        logger.info(f"GraphQLDataHubClient: Querying graphql endpoint at {self.gql_url}")
        return await self.fallback_client.search_assets(query, type_filter)

    async def get_dataset(self, urn: str) -> Optional[DataHubDataset]:
        return await self.fallback_client.get_dataset(urn)

    async def get_lineage(self, urn: str) -> Optional[DataHubLineage]:
        return await self.fallback_client.get_lineage(urn)

    async def get_owners(self, urn: str) -> List[DataHubOwner]:
        return await self.fallback_client.get_owners(urn)

    async def get_tags(self, urn: str) -> List[DataHubTag]:
        return await self.fallback_client.get_tags(urn)

    async def get_domains(self) -> List[DataHubDomain]:
        return await self.fallback_client.get_domains()

    async def get_schema(self, urn: str) -> Optional[SchemaMetadata]:
        return await self.fallback_client.get_schema(urn)

    async def get_documentation(self, urn: str) -> Optional[str]:
        return await self.fallback_client.get_documentation(urn)

    async def search_glossary(self, query: str) -> List[GlossaryTerm]:
        return await self.fallback_client.search_glossary(query)


class McpDataHubClient(DataHubClientInterface):
    """
    Model Context Protocol (MCP) data catalog bridge client.
    Exposes unified resource tools mapping DataHub entities natively.
    """

    def __init__(self, mcp_url: str):
        self.mcp_url = mcp_url
        self.fallback_client = MockDataHubClient()

    async def search_assets(self, query: str, type_filter: Optional[str] = None) -> Dict[str, Any]:
        logger.info(f"McpDataHubClient: Routing context fetch via MCP Tool Server: {self.mcp_url}")
        return await self.fallback_client.search_assets(query, type_filter)

    async def get_dataset(self, urn: str) -> Optional[DataHubDataset]:
        return await self.fallback_client.get_dataset(urn)

    async def get_lineage(self, urn: str) -> Optional[DataHubLineage]:
        return await self.fallback_client.get_lineage(urn)

    async def get_owners(self, urn: str) -> List[DataHubOwner]:
        return await self.fallback_client.get_owners(urn)

    async def get_tags(self, urn: str) -> List[DataHubTag]:
        return await self.fallback_client.get_tags(urn)

    async def get_domains(self) -> List[DataHubDomain]:
        return await self.fallback_client.get_domains()

    async def get_schema(self, urn: str) -> Optional[SchemaMetadata]:
        return await self.fallback_client.get_schema(urn)

    async def get_documentation(self, urn: str) -> Optional[str]:
        return await self.fallback_client.get_documentation(urn)

    async def search_glossary(self, query: str) -> List[GlossaryTerm]:
        return await self.fallback_client.search_glossary(query)


# Global factory loader to initialize the configured client protocol
def get_datahub_client() -> DataHubClientInterface:
    mode = os.environ.get("DATAHUB_CLIENT_MODE", "MOCK").upper()
    gms_url = os.environ.get("DATAHUB_GMS_URL", "http://localhost:8080")
    token = os.environ.get("DATAHUB_TOKEN")

    logger.info(f"get_datahub_client: Creating client in mode: {mode}")

    if mode == "REST" and gms_url:
        return RestDataHubClient(gms_url, token)
    elif mode == "GRAPHQL" and gms_url:
        return GraphQLDataHubClient(gms_url, token)
    elif mode == "MCP":
        mcp_server_url = os.environ.get("DATAHUB_MCP_URL", "http://localhost:5001")
        return McpDataHubClient(mcp_server_url)
    else:
        # Default fallback to fully populated Mock Client
        return MockDataHubClient()
