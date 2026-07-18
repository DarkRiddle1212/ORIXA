import uuid
from datetime import datetime
from typing import Dict, List
from backend.app.memory.memory_models import MemoryItem

class MemoryStore:
    """
    In-memory state engine for Orixa's Organizational Memory service.
    Holds, indexes, and manages persistent metadata snapshots, pre-seeded with 
    enterprise failure/resolution runbook cases.
    """
    def __init__(self):
        self.memories: Dict[str, MemoryItem] = {}
        self._seed_initial_data()

    def get_all(self) -> List[MemoryItem]:
        return list(self.memories.values())

    def get_by_id(self, memory_id: str) -> MemoryItem | None:
        return self.memories.get(memory_id)

    def add(self, item: MemoryItem):
        self.memories[item.id] = item

    def _seed_initial_data(self):
        # 1. Pipeline Drift and Telemetry Outage
        id1 = "mem-8fa4e28-1b03-49aa"
        self.memories[id1] = MemoryItem(
            id=id1,
            incident="Downstream Pipeline Interruption due to Schema Drift",
            user_request="A schema change caused downstream failures in the analytics pipeline.",
            context_snapshot={
                "cluster": "acme-prod-east-01",
                "triggered_by": "secops-alert-99",
                "datahub_sync": True
            },
            selected_specialists=["SchemaSpecialist", "PipelineSpecialist", "DataHubSpecialist"],
            execution_plan=[
                {"step_number": 1, "specialist_name": "SchemaSpecialist", "task": "Compare current schema against reference master in DataHub", "status": "COMPLETED"},
                {"step_number": 2, "specialist_name": "PipelineSpecialist", "task": "Pinpoint breaking column drop in core_orders dataset", "status": "COMPLETED"},
                {"step_number": 3, "specialist_name": "DataHubSpecialist", "task": "Propagate modified field status to Tableau visualization nodes", "status": "COMPLETED"}
            ],
            recommendations={
                "risk_level": "HIGH",
                "remediations": [
                    "Roll back latest migration on postgres core_orders schema.",
                    "Configure strict column validation filters in airbyte loading pipelines."
                ]
            },
            human_approvals=[
                {"approver": "secops-manager@acme.com", "action": "APPROVED", "timestamp": "2026-07-10T14:22:00Z"}
            ],
            final_outcome="Schema drift resolved. Orders pipeline restarted. 1,240 delayed processing rows backfilled into staging tables successfully.",
            lessons_learned=[
                "Database migrations altering primary key components must run through DataHub pre-flight validations.",
                "Enforce alert margins when downstream processing delays exceed 5 minutes."
            ],
            tags=["DRIFTED", "POSTGRES", "CRITICAL"],
            affected_assets=["urn:li:dataset:(prod,postgres,acme.public.core_orders)"],
            timestamp="2026-07-10T14:35:00Z"
        )

        # 2. Unencrypted PII leaking in Staging Account
        id2 = "mem-3bb4fa1-6677-49f0"
        self.memories[id2] = MemoryItem(
            id=id2,
            incident="Plaintext Secret & Sensitive PII Leak Detected",
            user_request="Verify compliance issues or security leaks in user_profiles dataset.",
            context_snapshot={
                "cluster": "acme-staging-west",
                "triggered_by": "compliance-scanner-04",
                "datahub_sync": True
            },
            selected_specialists=["SecuritySpecialist", "ComplianceSpecialist"],
            execution_plan=[
                {"step_number": 1, "specialist_name": "SecuritySpecialist", "task": "Scan user_profiles column schemas for plain email or passwords", "status": "COMPLETED"},
                {"step_number": 2, "specialist_name": "ComplianceSpecialist", "task": "Audit compliance status under GDPR Article 30 requirements", "status": "COMPLETED"}
            ],
            recommendations={
                "risk_level": "CRITICAL",
                "remediations": [
                    "Immediately redact and encrypt the 'plaintext_password' column in staging.",
                    "Apply hashing algorithms using SEC_SALT_MD5 before logging to file targets."
                ]
            },
            human_approvals=[
                {"approver": "compliance-officer@acme.com", "action": "REDATED", "timestamp": "2026-07-11T09:12:00Z"}
            ],
            final_outcome="Leaked staging columns purged. Enforced standard SHA-256 password salting routines. Compliance status set back to certified.",
            lessons_learned=[
                "Never dump staging operational database records without checking tag validations.",
                "Assign strict ownership rules on public schemas."
            ],
            tags=["PII", "GDPR", "SECRET", "VULNERABLE"],
            affected_assets=["urn:li:dataset:(prod,snowflake,acme.analytics.user_profiles)"],
            timestamp="2026-07-11T09:30:00Z"
        )

        # 3. Connection Timeout Snowflake Analytics Warehouse
        id3 = "mem-7bb1da5-2244-11f2"
        self.memories[id3] = MemoryItem(
            id=id3,
            incident="Analytical Warehouse Connection Timeout",
            user_request="Snowflake reports connection timed out during aggregate refresh.",
            context_snapshot={
                "cluster": "snowflake-analytics-warehouse",
                "triggered_by": "prometheus-sn-01",
                "datahub_sync": True
            },
            selected_specialists=["InfrastructureSpecialist", "DataHubSpecialist"],
            execution_plan=[
                {"step_number": 1, "specialist_name": "InfrastructureSpecialist", "task": "Inspect routing tables and security group ingress limits", "status": "COMPLETED"},
                {"step_number": 2, "specialist_name": "DataHubSpecialist", "task": "Check DataHub connection state for active metadata heartbeats", "status": "COMPLETED"}
            ],
            recommendations={
                "risk_level": "MEDIUM",
                "remediations": [
                    "Increase warehouse timeout limits from 60s to 180s.",
                    "Verify Snowflake IP address ranges are whitelisted on our enterprise NAT gateway."
                ]
            },
            human_approvals=[
                {"approver": "sre-lead@acme.com", "action": "WHITELISTED", "timestamp": "2026-07-12T16:45:00Z"}
            ],
            final_outcome="Whitelisted outbound egress IP blocks and scale timeout parameters. Normal connection queries succeeded thereafter.",
            lessons_learned=[
                "Cloud analytical instances undergo transient scale events which need retry backoffs.",
                "Configure persistent Snowflake endpoints with standard keepalive loops."
            ],
            tags=["SNOWFLAKE", "TIMEOUT", "STABLE"],
            affected_assets=["urn:li:dataset:(prod,snowflake,acme.analytics.aggregates)"],
            timestamp="2026-07-12T17:00:00Z"
        )

# Global memory storage engine instance
memory_store = MemoryStore()
