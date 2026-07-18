from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
from datetime import datetime

class EvidenceItem(BaseModel):
    id: str = Field(..., description="Unique hash representing this piece of evidence.")
    type: str = Field(..., description="E.g., schema_drift, pii_leak, historical_match, specialist_log, datahub_sync")
    source: str = Field(..., description="Originating agent, engine, or catalog database.")
    title: str = Field(..., description="Compact descriptive label.")
    description: str = Field(..., description="Detailed explanation of the findings and metrics.")
    confidence_impact: float = Field(0.0, description="Estimated influence coefficient on final confidence score.")
    timestamp: str = Field(..., description="Time this evidence was compiled.")
    metadata: Dict[str, Any] = Field(default_factory=dict, description="Arbitrary diagnostic parameters.")

class SpecialistContribution(BaseModel):
    specialist_name: str = Field(..., description="Domain specialist codename (e.g., sentinel, forge, oracle).")
    display_name: str = Field(..., description="Human-readable title.")
    role: str = Field(..., description="Orchestration role assigned by Atlas.")
    findings: List[str] = Field(default_factory=list, description="Specific catalog deviations or logs flagged by this specialist.")
    confidence_score: float = Field(..., description="Internal confidence metric emitted for executed sub-tasks.")

class ConfidenceDetail(BaseModel):
    score: float = Field(..., description="Compound accuracy coefficient (0.0 to 1.0).")
    grade: str = Field(..., description="High-level trust rating (e.g., HIGH, MEDIUM, LOW, CRITICAL).")
    factors: List[str] = Field(default_factory=list, description="Positive and negative factors contributing to this confidence.")
    specialist_agreement: float = Field(..., description="Index representing consistency between specialists (0.0 to 1.0).")
    calculated_at: str = Field(..., description="Timestamp of confidence computation.")

class RiskAssessment(BaseModel):
    risk_level: str = Field(..., description="Compound risk rank (e.g., LOW, MEDIUM, HIGH, CRITICAL).")
    description: str = Field(..., description="Short explanation of systemic threat or business impact.")
    mitigations: List[str] = Field(default_factory=list, description="Prescriptive measures to offset potential failure vectors.")

class RecommendedAction(BaseModel):
    id: str = Field(..., description="Unique task identifier.")
    title: str = Field(..., description="Remediation title.")
    description: str = Field(..., description="Strategic context justifying this remediation.")
    code_snippet: Optional[str] = Field(None, description="Actionable command, SQL DDL script, or shell patch.")
    status: str = Field("PENDING", description="Status of action (e.g., PENDING, APPROVED, BYPASS, EXECUTED).")

class AuditTrailEntry(BaseModel):
    id: str = Field(..., description="Audit footprint hash.")
    action: str = Field(..., description="Action category (e.g., ORCHESTRATION_TRIGGERED, EVIDENCE_APPENDED, APPROVED).")
    performed_by: str = Field(..., description="Agent supervisor or admin user email.")
    timestamp: str = Field(..., description="Time of audit entry creation.")
    details: str = Field(..., description="Detailed ledger event summary.")

class ExplanationResponse(BaseModel):
    investigation_id: str = Field(..., description="Unique correlation ID for the associated investigation session.")
    executive_summary: str = Field(..., description="High-level narrative explaining what Orixa orchestrated.")
    root_cause: str = Field(..., description="Identified root cause or structural failure origin.")
    confidence: ConfidenceDetail = Field(..., description="Diagnostic metric details mapping Orixa's reasoning reliability.")
    risk: RiskAssessment = Field(..., description="Potential threat rating and mitigations list.")
    evidence_timeline: List[EvidenceItem] = Field(default_factory=list, description="Chronological timeline of compiled evidence cards.")
    specialists_contributed: List[SpecialistContribution] = Field(default_factory=list, description="Domain-specific specialist details.")
    organizational_memory_matches: List[Dict[str, Any]] = Field(default_factory=list, description="Grounded incidents matching semantic features.")
    datahub_context_used: List[Dict[str, Any]] = Field(default_factory=list, description="Catalogs, schemas, and schemas metadata snapshots pulled.")
    recommended_actions: List[RecommendedAction] = Field(default_factory=list, description="Synthesized remediation scripts.")
    human_approval_status: str = Field("PENDING", description="General status of human verification (PENDING, APPROVED, REJECTED).")
    audit_trail: List[AuditTrailEntry] = Field(default_factory=list, description="Immutable ledger tracking agent actions.")
