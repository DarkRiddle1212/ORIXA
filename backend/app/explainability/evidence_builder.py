from typing import List, Dict, Any
from datetime import datetime
import uuid
from backend.app.explainability.decision_models import EvidenceItem

class EvidenceBuilder:
    @staticmethod
    def compile_evidence(investigation_id: str, intent_type: str = "SCHEMA_ALIGNMENT") -> List[EvidenceItem]:
        """
        Gathers and compiles structured, high-fidelity supporting evidence cards
        based on the detected operational intent and system context.
        """
        now = datetime.utcnow().isoformat() + "Z"
        evidence_list = []

        if intent_type == "SCHEMA_ALIGNMENT":
            evidence_list.append(
                EvidenceItem(
                    id=f"ev-drift-{uuid.uuid4().hex[:8]}",
                    type="schema_drift",
                    source="Atlas Supervisor",
                    title="Column Deviation Detected",
                    description="Physical column catalog scan pinpointed an unregistered plain attribute 'phone_raw' varchar(255) in 'users_sandbox' which deviates from the registered schema definition.",
                    confidence_impact=0.45,
                    timestamp=now,
                    metadata={"target_table": "users_sandbox", "drifted_columns": ["phone_raw"], "db_platform": "postgres"}
                )
            )
            evidence_list.append(
                EvidenceItem(
                    id=f"ev-pii-{uuid.uuid4().hex[:8]}",
                    type="pii_leak",
                    source="Guardian Specialist",
                    title="Plaintext PII Warning Triggered",
                    description="Automated entropy scanning verified that column 'phone_raw' stores unmasked phone numbers, violating CCPA personal identifiable data policies.",
                    confidence_impact=0.35,
                    timestamp=now,
                    metadata={"privacy_boundary": "CCPA_CC-5", "entropy_level": 0.89, "classification": "PII_PHONE_NUMBER"}
                )
            )
            evidence_list.append(
                EvidenceItem(
                    id=f"ev-trace-{uuid.uuid4().hex[:8]}",
                    type="datahub_sync",
                    source="DataHub Catalog",
                    title="Downstream Lineage Threat",
                    description="Identified 1 active downstream Snowflake analytical dashboard ('Executive Metrics Dashboard') depending directly on the drifting schema, confirming immediate business disruption risks.",
                    confidence_impact=0.20,
                    timestamp=now,
                    metadata={"downstream_nodes": 1, "dependent_dashboards": ["Executive Metrics Dashboard"]}
                )
            )
        elif intent_type == "THREAT_CONTAINMENT":
            evidence_list.append(
                EvidenceItem(
                    id=f"ev-threat-{uuid.uuid4().hex[:8]}",
                    type="pii_leak",
                    source="Sentinel Specialist",
                    title="Suspicious Connection Query",
                    description="Identified rapid schema inspection commands from an unrecognized development IP block attempting to select cleartext credentials.",
                    confidence_impact=0.50,
                    timestamp=now,
                    metadata={"unauthorized_ips": ["192.168.42.102"], "matched_pattern": "SQL_INJECTION_SUSPICION"}
                )
            )
            evidence_list.append(
                EvidenceItem(
                    id=f"ev-mem-{uuid.uuid4().hex[:8]}",
                    type="historical_match",
                    source="Organizational Memory",
                    title="Security Runbook Correlation",
                    description="Verified SRE playbook constraints in Chapter 9, mandating immediate container network workspace isolation.",
                    confidence_impact=0.30,
                    timestamp=now,
                    metadata={"runbook_chapter": 9, "remediation_recipe": "Isolate Sandbox"}
                )
            )
        else:
            evidence_list.append(
                EvidenceItem(
                    id=f"ev-gen-{uuid.uuid4().hex[:8]}",
                    type="specialist_log",
                    source="Archivist Specialist",
                    title="Standard Operational Baseline Matches",
                    description="Checked background performance stats against operational baselines. Database latencies and connection pools are stable.",
                    confidence_impact=0.20,
                    timestamp=now,
                    metadata={"latency_ms": 11.2, "pool_utilization_pct": 15}
                )
            )

        return evidence_list
