from typing import Dict, Any, List
from datetime import datetime
import uuid
from backend.app.explainability.decision_models import (
    ExplanationResponse,
    SpecialistContribution,
    RiskAssessment,
    RecommendedAction,
    ConfidenceDetail
)
from backend.app.explainability.evidence_builder import EvidenceBuilder
from backend.app.explainability.confidence_engine import ConfidenceEngine
from backend.app.explainability.audit_service import AuditService

class ExplanationService:
    @staticmethod
    def get_explanation(investigation_id: str) -> ExplanationResponse:
        """
        Retrieves or dynamically compiles a high-fidelity audit and explainability
        package for any given investigation identifier.
        """
        now = datetime.utcnow().isoformat() + "Z"
        
        # Determine intent heuristic based on investigation ID naming
        intent = "SCHEMA_ALIGNMENT"
        if "threat" in investigation_id.lower() or "contain" in investigation_id.lower() or "sentinel" in investigation_id.lower():
            intent = "THREAT_CONTAINMENT"
        elif "compliance" in investigation_id.lower() or "privacy" in investigation_id.lower() or "guardian" in investigation_id.lower():
            intent = "COMPLIANCE_AUDIT"

        # 1. Compile Supporting Evidence Timeline
        evidence_timeline = EvidenceBuilder.compile_evidence(investigation_id, intent)

        # 2. Compile Specialist Contributions
        specialists = []
        if intent == "SCHEMA_ALIGNMENT":
            specialists = [
                SpecialistContribution(
                    specialist_name="atlas",
                    display_name="Atlas",
                    role="Schema Alignment Specialist",
                    findings=["Physical column 'phone_raw' in 'users_sandbox' lacks registered metadata definition."],
                    confidence_score=0.95
                ),
                SpecialistContribution(
                    specialist_name="oracle",
                    display_name="Oracle",
                    role="Drift Analytics Specialist",
                    findings=["Calculated 84.5% chance of downstream pipeline breakdown if column is not updated."],
                    confidence_score=0.88
                ),
                SpecialistContribution(
                    specialist_name="forge",
                    display_name="Forge",
                    role="Migration Script Planner",
                    findings=["Synthesized transactional DDL statements migrating column to secure crypt-parameters."],
                    confidence_score=0.92
                )
            ]
        elif intent == "THREAT_CONTAINMENT":
            specialists = [
                SpecialistContribution(
                    specialist_name="sentinel",
                    display_name="Sentinel",
                    role="Threat Containment Specialist",
                    findings=["Flagged unauthorized schema inspections from unlisted dev IP block."],
                    confidence_score=0.96
                ),
                SpecialistContribution(
                    specialist_name="archivist",
                    display_name="Archivist",
                    role="Compliance Grounding Specialist",
                    findings=["Matched query pattern with intrusion and privilege escalation models."],
                    confidence_score=0.90
                )
            ]
        else:
            specialists = [
                SpecialistContribution(
                    specialist_name="archivist",
                    display_name="Archivist",
                    role="Organizational Memory Audit Specialist",
                    findings=["Confirmed system variables and relational table columns are aligned to baselines."],
                    confidence_score=0.85
                )
            ]

        # 3. Calculate Confidence Detail
        confidence_detail = ConfidenceEngine.calculate_confidence(investigation_id, evidence_timeline, specialists)

        # 4. Construct Risk Assessment
        if intent == "SCHEMA_ALIGNMENT":
            risk = RiskAssessment(
                risk_level="HIGH",
                description="Plaintext customer contact variables left accessible violate CCPA Article 5 privacy boundaries.",
                mitigations=[
                    "Roll back latest dev migration or alter column 'phone_raw' immediately.",
                    "Enable pre-flight database metadata inspection checks in dbt loader pipelines."
                ]
            )
        elif intent == "THREAT_CONTAINMENT":
            risk = RiskAssessment(
                risk_level="CRITICAL",
                description="Potential credential leak might lead to unauthorized write privileges inside core production databases.",
                mitigations=[
                    "Isolate sandbox container immediately.",
                    "Revoke all active developer connection strings and regenerate API secrets."
                ]
            )
        else:
            risk = RiskAssessment(
                risk_level="LOW",
                description="System is performing within highly optimized SLA baseline margins. Compounding risks are minimal.",
                mitigations=[]
            )

        # 5. Synthesize Recommended Actions
        actions = []
        if intent == "SCHEMA_ALIGNMENT":
            actions.append(
                RecommendedAction(
                    id="rec-action-001",
                    title="Apply Cryptographic Column Migration",
                    description="Encrypts the plaintext phone column and drops the cleartext variable under a transactional safety block.",
                    code_snippet="BEGIN;\nALTER TABLE users_sandbox ADD COLUMN phone_encrypted VARCHAR(512);\nUPDATE users_sandbox SET phone_encrypted = encode(digest(phone_raw, 'sha256'), 'hex') WHERE phone_raw IS NOT NULL;\nALTER TABLE users_sandbox DROP COLUMN phone_raw;\nCOMMIT;",
                    status="PENDING"
                )
            )
        elif intent == "THREAT_CONTAINMENT":
            actions.append(
                RecommendedAction(
                    id="rec-action-002",
                    title="Isolate Sandbox & Rotate API Keys",
                    description="Executes CLI isolation procedures and updates API authentication tokens.",
                    code_snippet='orixa auth rotate-keys --sandbox "Staging Sandbox Delta"',
                    status="PENDING"
                )
            )
        else:
            actions.append(
                RecommendedAction(
                    id="rec-action-003",
                    title="Maintain Baseline Monitoring",
                    description="Standard diagnostic loop validated. Continue continuous telemetry logging.",
                    code_snippet="orixa status --fleet --detailed",
                    status="PENDING"
                )
            )

        # 6. Build Chronological Audit Ledger
        audit_trail = AuditService.create_audit_trail(investigation_id, intent)

        # 7. Standardize DataHub Context Snapshot Used
        datahub_context = [
            {
                "asset_urn": "urn:li:dataset:(urn:li:dataPlatform:postgres,acme_aerospace.core.users,PROD)",
                "asset_name": "core.users",
                "last_synchronized": "2026-07-13T01:30:00Z",
                "registered_fields": 6,
                "domain": "Engineering"
            }
        ]

        # 8. Standardize Organizational Memory Matches
        memory_matches = [
            {
                "id": "mem-8fa4e28-1b03-49aa",
                "incident": "Downstream Pipeline Interruption due to Schema Drift",
                "match_strength": 0.89,
                "relevance_explanation": "Historic drift on billing core mirrors current sandbox drift characteristics."
            }
        ]

        # Assemble Full Response Package
        if intent == "SCHEMA_ALIGNMENT":
            exec_summary = "Atlas coordinated an automated schema reconciliation scan. The intelligence pipeline detected critical column layout deviations in the 'users_sandbox' catalog, verified downstream analytics impact, and formulated an immediately deployable database migration patch."
            root_cause = "The development sandbox database underwent custom manual schema modifications without registering alterations via standard DataHub webhooks."
        elif intent == "THREAT_CONTAINMENT":
            exec_summary = "Atlas triggered active threat mitigation containment. The sentinel fleet analyzed request credentials, restricted public write permissions on isolated workspaces, and updated security SRE war rooms."
            root_cause = "Compromised developer credentials committed in local text variables."
        else:
            exec_summary = "Atlas orchestrated a general diagnostic sweep of active database pools and catalog assets. All microservice routes, metadata hooks, and latency bounds are performing within acceptable parameters."
            root_cause = "No anomalies detected."

        return ExplanationResponse(
            investigation_id=investigation_id,
            executive_summary=exec_summary,
            root_cause=root_cause,
            confidence=confidence_detail,
            risk=risk,
            evidence_timeline=evidence_timeline,
            specialists_contributed=specialists,
            organizational_memory_matches=memory_matches,
            datahub_context_used=datahub_context,
            recommended_actions=actions,
            human_approval_status="PENDING",
            audit_trail=audit_trail
        )
