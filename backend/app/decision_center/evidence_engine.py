from typing import List
from backend.app.decision_center.schemas import EvidenceCard

class EvidenceEngine:
    @staticmethod
    def get_evidence(investigation_id: str) -> List[EvidenceCard]:
        if investigation_id == "silent-schema-disaster":
            return [
                EvidenceCard(
                    card_id="ev-dh-lineage",
                    title="DataHub Lineage Check",
                    what_inspected="Upstream physical PostgreSQL tables mapped to Snowflake core analytic pipelines.",
                    what_found="14 downstream datasets, 2 Looker billing reports, and 1 main billing ETL depending directly on users_sandbox.id field.",
                    why_matters="A schema modification on the sandbox database will silently cascade, breaking financial ingestion runs.",
                    source="DataHub Lineage Service",
                    confidence_impact=0.30
                ),
                EvidenceCard(
                    card_id="ev-owner-metadata",
                    title="Ownership Metadata Check",
                    what_inspected="DataHub asset owner records and team rosters for users_sandbox database.",
                    what_found="Asset is owned by the Data Platform Team with no registered backup DBA steward.",
                    why_matters="No automated safety warnings were issued to owners prior to execution because notification webhooks were unconfigured.",
                    source="DataHub Ownership Service",
                    confidence_impact=0.15
                ),
                EvidenceCard(
                    card_id="ev-schema-evolution",
                    title="Schema Evolution Trace",
                    what_inspected="Chronological DDL alterations on active pg_catalog indices in the sandbox workspace.",
                    what_found="Column 'customer_phone_raw' was added yesterday afternoon under commit transaction #DEV-9842.",
                    why_matters="This column mismatch deviates from production where 'customer_phone' is registered, causing a structural sync conflict.",
                    source="Atlas Schema Scanner",
                    confidence_impact=0.25
                ),
                EvidenceCard(
                    card_id="ev-gov-policies",
                    title="Governance Policies Check",
                    what_inspected="Active data sovereignty rules and security catalog tags on users_sandbox fields.",
                    what_found="Column 'customer_phone_raw' is unencrypted, violating safety policy CCPA CC-5 and GOV-SEC-09.",
                    why_matters="Raw customer contacts left in plaintext violate statutory privacy laws and trigger immediate compliance audit flags.",
                    source="Guardian Compliance Auditor",
                    confidence_impact=0.20
                )
            ]
        elif investigation_id == "compromised-dev-keys-leak":
            return [
                EvidenceCard(
                    card_id="ev-threat-intel",
                    title="Network Ingress Trace",
                    what_inspected="Operational gateway connection headers and staging cluster container subnets.",
                    what_found="Active, unauthorized API requests from an unlisted developer CLI IP block on subnet 10.14.0.0/16.",
                    why_matters="Indicates that leaked credentials are being actively utilized in an unauthorized attempts to dump system variables.",
                    source="Sentinel Threat Detection",
                    confidence_impact=0.35
                ),
                EvidenceCard(
                    card_id="ev-key-commit",
                    title="Credential Exposure Trace",
                    what_inspected="Staging branch git commits and cleartext configuration variables.",
                    what_found="An unencrypted Vault staging token was committed plaintext to public branch 'sandbox-patch-99'.",
                    why_matters="Allows arbitrary container orchestration control without going through authorized SSO identity gates.",
                    source="Archivist Code Scanner",
                    confidence_impact=0.30
                ),
                EvidenceCard(
                    card_id="ev-gov-isolation",
                    title="Isolation Boundaries Check",
                    what_inspected="Active security groups, firewall rules, and VPC container boundaries.",
                    what_found="Development sandbox lacks strict security group egress limits, allowing connections outwards.",
                    why_matters="Enables potential lateral movement from sandbox staging to production endpoints if keys are unrotated.",
                    source="Sentinel Isolation Engine",
                    confidence_impact=0.25
                )
            ]
        else:
            # Default unencrypted pii columns
            return [
                EvidenceCard(
                    card_id="ev-pii-scan",
                    title="Sensitive Column Audit",
                    what_inspected="Data dictionaries and sample rows for active snowflake tables.",
                    what_found="Column 'tax_id_unencrypted' stores raw Social Security and Tax IDs in cleartext.",
                    why_matters="Fails PCI-DSS and SOX financial protection compliance parameters. High vulnerability index.",
                    source="Guardian PII Scanner",
                    confidence_impact=0.40
                ),
                EvidenceCard(
                    card_id="ev-historical-incident",
                    title="Historical Incident Match",
                    what_inspected="Semantic correlation records in Orixa's long-term incident database.",
                    what_found="Matched incident #MEM-3C21 with 92% similarity regarding unmasked staging metrics.",
                    why_matters="Historic remediation patterns show that failing to restrict views immediately leads to regulatory warnings.",
                    source="Archivist Incident Database",
                    confidence_impact=0.30
                )
            ]
