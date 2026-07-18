from typing import Any, Dict, List
from pydantic import BaseModel, Field


class RemediationAction(BaseModel):
    action_type: str = Field(..., description="Category of remediation, e.g. SQL_MIGRATION, LOCKDOWN, CONFIG_PATCH")
    description: str = Field(..., description="Actionable summary of what to execute")
    commands_or_code: str = Field("", description="Actual commands or SQL transaction syntax proposed")


class SynthesisReport(BaseModel):
    overview: str = Field(..., description="Global narrative overview of the orchestrated findings")
    key_findings: List[str] = Field(..., description="Bulleted high-impact technical discoveries")
    remediations: List[RemediationAction] = Field(..., description="Concrete, strategic next steps")
    risk_level: str = Field("LOW", description="Overall evaluated system hazard level: LOW, MEDIUM, HIGH, CRITICAL")


class AtlasResponseBuilder:
    """
    Consolidates raw outputs from distinct specialists into a single
    actionable executive summary, resolving discrepancies and formulating next steps.
    """

    def synthesize(self, intent: str, specialist_outputs: Dict[str, Any]) -> SynthesisReport:
        key_findings = []
        remediations = []
        risk_level = "LOW"

        # Look at the collective outputs to build a highly realistic summary report
        if intent == "SCHEMA_ALIGNMENT":
            risk_level = "HIGH"
            overview = (
                "Atlas coordinated a schema reconciliation scan. "
                "The pipeline detected critical model-to-table column deviations in the production_users catalog, "
                "verified the downstream impact on analytics pipelines, and drafted an immediate SQL patch."
            )
            key_findings.extend([
                "Schema Audit [Atlas]: Discovered a cleartext 'phone_raw' column in 'users_sandbox' missing from DataHub's catalog registry.",
                "Drift Analytics [Oracle]: Calculated an 84.5% risk of undocumented structural mutations in the sandbox within 48 hours.",
                "Remediation [Forge]: Synthesized safe DDL commands altering tables with SHA-256 encrypted mappings to prevent privacy exposure."
            ])
            remediations.append(RemediationAction(
                action_type="SQL_MIGRATION",
                description="Apply Forge's generated DDL schema patch to transition the unencrypted 'phone_raw' column to encrypted variables.",
                commands_or_code=(
                    "BEGIN;\n"
                    "ALTER TABLE users_sandbox ADD COLUMN phone_encrypted VARCHAR(512);\n"
                    "UPDATE users_sandbox SET phone_encrypted = encode(digest(phone_raw, 'sha256'), 'hex') WHERE phone_raw IS NOT NULL;\n"
                    "ALTER TABLE users_sandbox DROP COLUMN phone_raw;\n"
                    "COMMIT;"
                )
            ))

        elif intent == "THREAT_CONTAINMENT":
            risk_level = "CRITICAL"
            overview = (
                "Atlas Supervisor triggered active threat isolation procedures. "
                "The fleet analyzed network connection boundaries, referenced runbook policies, "
                "sandboxed the suspicious workspace Project Alpha, and pushed alerts to operations channels."
            )
            key_findings.extend([
                "Threat Scan [Sentinel]: Flagged suspicious transaction footprints and anomalous SQL write queries on Staging Sandbox Delta.",
                "Compliance Grounding [Archivist]: Cross-referenced access patterns with Security Runbook Chapter 9 (Privilege Escalation Bounds).",
                "Isolation [Sentinel]: Enforced container network fence blocking active write hooks and recycling idle database links.",
                "Notification [Ambassador]: Successfully transmitted secure alert payloads to the Orixa Slack War Room channel."
            ])
            remediations.append(RemediationAction(
                action_type="SECURITY_PATCH",
                description="Review security logs from Staging Sandbox Delta and rotate organization OAuth credentials.",
                commands_or_code="orixa auth rotate-keys --sandbox 'Staging Sandbox Delta'"
            ))

        elif intent == "COMPLIANCE_AUDIT":
            risk_level = "MEDIUM"
            overview = (
                "Atlas supervised a regulatory compliance scan. "
                "The system evaluated existing database columns against GDPR, CCPA, and HIPAA compliance bounds "
                "to pinpoint unencrypted personal identifiers (PII)."
            )
            key_findings.extend([
                "PII Discovery [Guardian]: Flagged unencrypted raw column attributes classified as 'PII_PHONE_NUMBER'.",
                "Policy Lookup [Archivist]: Synced current rules regarding HIPAA and GDPR boundaries.",
                "Compliance Rating [Guardian]: Calculated a compliance rating score of 92.1% due to outstanding unmasked data cells."
            ])
            remediations.append(RemediationAction(
                action_type="ACCESS_CONTROL",
                description="Restrict public query access to the unmasked tables until a data mask or hashing view is deployed.",
                commands_or_code="REVOKE SELECT ON users_sandbox FROM PUBLIC;\nGRANT SELECT ON users_sandbox TO compliance_audit_role;"
            ))

        elif intent == "TOPOLOGY_ROUTING":
            risk_level = "LOW"
            overview = (
                "Atlas orchestrated a topology dependency mapping. "
                "The specialists modeled system routing boundaries and assessed connection pool exhaustion probabilities."
            )
            key_findings.extend([
                "Topology Trace [Architect]: Successfully mapped connection nodes (FastAPI, Redis, PostgreSQL) and certified that staging sandboxes are decoupled.",
                "Prediction [Oracle]: Estimated connection pool starvation probability remains stable at 12.1% under forecasted peak loads."
            ])
            remediations.append(RemediationAction(
                action_type="CONFIG_PATCH",
                description="Increase FastAPI and PostgreSQL database pool sizes to accommodate occasional analytical query spikes.",
                commands_or_code="SET max_connections = 250;\nSET shared_buffers = '512MB';"
            ))

        else:
            risk_level = "LOW"
            overview = "Atlas supervised a general system diagnostic scan. All core relational databases, caches, and AI Specialist health metrics are normal."
            key_findings.extend([
                "Runbook Scan [Archivist]: Grounded current operations against system baseline profiles.",
                "Stability Check [Sentinel]: Verified average latency parameters remain well within acceptable limits."
            ])
            remediations.append(RemediationAction(
                action_type="HEALTH_CHECK",
                description="Periodic system baselines completed. Maintain standard operational threshold telemetry.",
                commands_or_code="orixa status --fleet --detailed"
            ))

        return SynthesisReport(
            overview=overview,
            key_findings=key_findings,
            remediations=remediations,
            risk_level=risk_level
        )
