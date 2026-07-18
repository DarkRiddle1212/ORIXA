from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional

class EvidenceCard(BaseModel):
    card_id: str
    title: str
    what_inspected: str
    what_found: str
    why_matters: str
    source: str
    confidence_impact: float

class SpecialistContribution(BaseModel):
    name: str
    role: str
    task: str
    findings: List[str]
    confidence: float
    completion_time_seconds: float
    reason_for_selection: str

class DecisionDNA(BaseModel):
    context_quality: float
    evidence_coverage: float
    historical_similarity: float
    specialist_agreement: float
    overall_confidence: float

class RiskAssessment(BaseModel):
    if_accepted: str
    if_ignored: str
    severity: str
    downstream_impact: str

class EvidenceTrailLayer(BaseModel):
    id: str
    label: str
    title: str
    details: str
    expanded_payload: Dict[str, Any]

class AuditEntry(BaseModel):
    id: str
    timestamp: str
    action: str
    performed_by: str
    details: str

class DecisionCenterProfile(BaseModel):
    investigation_id: str
    status: str
    risk_level: str
    executive_summary: str
    final_recommendation: str
    evidence_panel: List[EvidenceCard] = []
    specialist_contributions: List[SpecialistContribution] = []
    decision_dna: DecisionDNA
    risk_assessment: RiskAssessment
    atlas_summary: str
    evidence_trail: List[EvidenceTrailLayer] = []
    audit_trail: List[AuditEntry] = []

class ApprovalRequest(BaseModel):
    action: str  # APPROVED or REJECTED
    operator_email: str
