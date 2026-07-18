from typing import List, Dict, Any
from backend.app.decision_center.schemas import DecisionCenterProfile, EvidenceTrailLayer, SpecialistContribution
from backend.app.decision_center.evidence_engine import EvidenceEngine
from backend.app.decision_center.risk_engine import RiskEngine
from backend.app.decision_center.confidence_engine import ConfidenceEngine
from backend.app.decision_center.audit_engine import AuditEngine
from backend.app.decision_center.summary_engine import SummaryEngine

class DecisionEngine:
    @staticmethod
    def get_profile(investigation_id: str) -> DecisionCenterProfile:
        # 1. Compile summaries
        exec_sum, final_rec, atlas_sum = SummaryEngine.compile_summaries(investigation_id)
        
        # 2. Get evidence cards
        evidence = EvidenceEngine.get_evidence(investigation_id)
        
        # 3. Assess risks
        risk = RiskEngine.evaluate_risk(investigation_id)
        
        # 4. Get confidence DNA
        dna = ConfidenceEngine.calculate_dna(investigation_id)
        
        # 5. Generate audit trail
        audit = AuditEngine.generate_trail(investigation_id)
        
        # 6. Specialist contributions
        specialists = DecisionEngine._get_specialists(investigation_id)
        
        # 7. Generate expandable evidence trail
        trail = DecisionEngine._build_trail(investigation_id, final_rec, risk, dna)
        
        return DecisionCenterProfile(
            investigation_id=investigation_id,
            status="PENDING",
            risk_level=risk.risk_level,
            executive_summary=exec_sum,
            final_recommendation=final_rec,
            evidence_panel=evidence,
            specialist_contributions=specialists,
            decision_dna=dna,
            risk_assessment=risk,
            atlas_summary=atlas_sum,
            evidence_trail=trail,
            audit_trail=audit
        )

    @staticmethod
    def _get_specialists(investigation_id: str) -> List[SpecialistContribution]:
        if investigation_id == "silent-schema-disaster":
            return [
                SpecialistContribution(
                    name="atlas",
                    role="Schema Alignment Specialist",
                    task="audit_schema",
                    findings=[
                        "Unregistered plain-text column 'customer_phone_raw' varchar(255) located.",
                        "Schema model conflicts with registered production layout definition."
                    ],
                    confidence=0.98,
                    completion_time_seconds=3.2,
                    reason_for_selection="Assigned as primary catalog auditor for metadata verification."
                ),
                SpecialistContribution(
                    name="oracle",
                    role="Drift Analytics Specialist",
                    task="estimate_schema_drift_risk",
                    findings=[
                        "Calculated high failure risk index (84.5%) for analytical pipelines.",
                        "Downstream ETL pool saturation predicted if column change runs unresolved."
                    ],
                    confidence=0.91,
                    completion_time_seconds=2.1,
                    reason_for_selection="Required to forecast cascade failure timelines on downstream reporting warehouses."
                ),
                SpecialistContribution(
                    name="forge",
                    role="Migration Script Planner",
                    task="draft_alignment_sql",
                    findings=[
                        "Formulated safe DDL statements adding secure crypt parameters.",
                        "Mapped robust drop update operations inside transactional rollback blocks."
                    ],
                    confidence=0.94,
                    completion_time_seconds=1.4,
                    reason_for_selection="Responsible for compiling database transactional corrective scripts."
                )
            ]
        elif investigation_id == "compromised-dev-keys-leak":
            return [
                SpecialistContribution(
                    name="sentinel",
                    role="Threat Containment Specialist",
                    task="scan_operational_logs",
                    findings=[
                        "Logged unauthorized read attempts targeting customer contact endpoints.",
                        "Flagged active IP block 192.168.42.102 making unauthorized configuration select operations."
                    ],
                    confidence=0.97,
                    completion_time_seconds=4.1,
                    reason_for_selection="Dispatched to scan operational request footprints and manage active boundaries."
                ),
                SpecialistContribution(
                    name="archivist",
                    role="Compliance Grounding Specialist",
                    task="ground_agent_decision",
                    findings=[
                        "Matched leak structure with Runbook Chapter 9 isolation playbook requirements.",
                        "Identified plaintext Vault token exposed on staging git history branch."
                    ],
                    confidence=0.90,
                    completion_time_seconds=1.8,
                    reason_for_selection="Employed to query organizational safety guidelines and incident databases."
                )
            ]
        else:
            return [
                SpecialistContribution(
                    name="guardian",
                    role="Privacy Auditing Specialist",
                    task="scan_sensitive_columns",
                    findings=[
                        "Flagged plain-text column 'tax_id_unencrypted' as severe data leak risk.",
                        "Isolate 140,000 exposed Social Security / Tax numbers lacking compliance masks."
                    ],
                    confidence=0.95,
                    completion_time_seconds=2.8,
                    reason_for_selection="Dispatched as chief policy auditor for PII attribute validation."
                )
            ]

    @staticmethod
    def _build_trail(investigation_id: str, recommendation: str, risk: Any, dna: Any) -> List[EvidenceTrailLayer]:
        if investigation_id == "silent-schema-disaster":
            return [
                EvidenceTrailLayer(
                    id="trail-1-rec",
                    label="Recommendation Blueprint",
                    title="Remediation Strategy Proposed",
                    details=f"Drafted operational database migration: {recommendation}",
                    expanded_payload={"ddl_migration_id": "MIG-2942", "rollback_supported": True}
                ),
                EvidenceTrailLayer(
                    id="trail-2-ev",
                    label="Physical Evidence Checked",
                    title="Database Column Mismatch",
                    details="Unregistered variable 'customer_phone_raw' detected inside users_sandbox.",
                    expanded_payload={"physical_field": "customer_phone_raw", "field_type": "varchar(255)"}
                ),
                EvidenceTrailLayer(
                    id="trail-3-dh",
                    label="DataHub Metadata Verified",
                    title="Lineage Dependency Map",
                    details="14 downstream datasets and 2 critical dashboards depend directly on user identity schemas.",
                    expanded_payload={"downstream_node_count": 14, "impacted_dashboards": ["Executive Metrics Dashboard"]}
                ),
                EvidenceTrailLayer(
                    id="trail-4-spec",
                    label="Specialist Findings Evaluated",
                    title="Consensus Achieved (100%)",
                    details="Atlas, Oracle, and Forge verified unanimous coordination logs regarding drift.",
                    expanded_payload={"specialists_involved": ["atlas", "oracle", "forge"], "agreement": 1.0}
                ),
                EvidenceTrailLayer(
                    id="trail-5-mem",
                    label="Historical Memory Synced",
                    title="Incident Correlation Analysis",
                    details="Matched incident #MEM-8FA4 regarding schema drift on public billing nodes (89% match).",
                    expanded_payload={"matching_incident_id": "MEM-8FA4", "similarity_score": 0.89}
                ),
                EvidenceTrailLayer(
                    id="trail-6-risk",
                    label="Risk Forecast Completed",
                    title="Downstream Pipeline Interruption",
                    details=f"Deferring alignment risks breaking critical weekly reporting metrics. Severity: {risk.severity}.",
                    expanded_payload={"deferral_consequence": risk.if_ignored, "impact_scope": risk.downstream_impact}
                )
            ]
        elif investigation_id == "compromised-dev-keys-leak":
            return [
                EvidenceTrailLayer(
                    id="trail-1-rec",
                    label="Recommendation Blueprint",
                    title="Credentials Key Rotation",
                    details=f"Revoke exposed Vault keys: {recommendation}",
                    expanded_payload={"vault_engine": "kv-staging", "rotation_policy": "immediate"}
                ),
                EvidenceTrailLayer(
                    id="trail-2-ev",
                    label="Physical Evidence Checked",
                    title="Git Log Exposure Located",
                    details="Plain Vault credentials key was committed to staging branch configuration files.",
                    expanded_payload={"exposed_file": "config.yaml", "branch": "sandbox-patch-99"}
                ),
                EvidenceTrailLayer(
                    id="trail-3-dh",
                    label="DataHub Context Used",
                    title="Resource Boundaries Map",
                    details="Isolated dev sandbox container lacks egress firewall rules.",
                    expanded_payload={"sandbox": "Staging Sandbox Delta", "egress_restricted": False}
                ),
                EvidenceTrailLayer(
                    id="trail-4-spec",
                    label="Specialist Findings Evaluated",
                    title="Sentinel Containment Logs",
                    details="Sentinel confirmed active API select attempts from unrecognized development subnet.",
                    expanded_payload={"unauthorized_requests": 42, "originating_ip": "192.168.42.102"}
                ),
                EvidenceTrailLayer(
                    id="trail-5-risk",
                    label="Risk Forecast Completed",
                    title="Lateral Movement Threat",
                    details=f"Unrotated keys enable unauthorized lateral staging access. Severity: {risk.severity}.",
                    expanded_payload={"deferral_consequence": risk.if_ignored, "impact_scope": risk.downstream_impact}
                )
            ]
        else:
            return [
                EvidenceTrailLayer(
                    id="trail-1-rec",
                    label="Recommendation Blueprint",
                    title="Secure View Masking Layer",
                    details=f"Establish crypt view views on unmasked values: {recommendation}",
                    expanded_payload={"masking_algorithm": "SHA-256", "view_name": "vw_finance_reporting"}
                ),
                EvidenceTrailLayer(
                    id="trail-2-ev",
                    label="Physical Evidence Checked",
                    title="Raw Plain PII Unmasked",
                    details="Column 'tax_id_unencrypted' stores plain SSN variables.",
                    expanded_payload={"table_name": "finance_reporting", "pii_columns": ["tax_id_unencrypted"]}
                ),
                EvidenceTrailLayer(
                    id="trail-3-dh",
                    label="DataHub Context Used",
                    title="Compliance Policies Checked",
                    details="Fails SOX data isolation parameters and GDPR CC-3 boundaries.",
                    expanded_payload={"violated_policies": ["SOX-SEC-01", "GDPR-CC-3"]}
                ),
                EvidenceTrailLayer(
                    id="trail-4-risk",
                    label="Risk Forecast Completed",
                    title="Auditing Infraction Penalty",
                    details=f"Unresolved records risk SOX audit failure. Severity: {risk.severity}.",
                    expanded_payload={"deferral_consequences": risk.if_ignored}
                )
            ]
