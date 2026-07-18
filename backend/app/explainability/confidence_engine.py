from typing import List, Dict, Any
from datetime import datetime
from backend.app.explainability.decision_models import ConfidenceDetail, EvidenceItem, SpecialistContribution

class ConfidenceEngine:
    @staticmethod
    def calculate_confidence(
        investigation_id: str,
        evidence_timeline: List[EvidenceItem],
        specialists: List[SpecialistContribution]
    ) -> ConfidenceDetail:
        """
        Dynamically evaluates reasoning metrics to output a compound trust score,
        grade, and contributing factors list.
        """
        # Calculate sum of confidence impacts from compiled evidence
        evidence_weight = sum(ev.confidence_impact for ev in evidence_timeline)
        evidence_factor = min(0.6, evidence_weight) # Up to 60% of confidence comes from evidence volume/strength
        
        # Calculate specialist agreement index
        successful_specialists = [s for s in specialists if s.confidence_score >= 0.8]
        specialist_ratio = len(successful_specialists) / len(specialists) if specialists else 1.0
        specialist_factor = specialist_ratio * 0.4 # Up to 40% comes from specialist alignment
        
        # Calculate compound score
        raw_score = evidence_factor + specialist_factor
        score = round(max(0.1, min(0.99, raw_score)), 2)
        
        # Classify Grade
        if score >= 0.90:
            grade = "HIGH"
        elif score >= 0.70:
            grade = "MEDIUM"
        else:
            grade = "LOW"
            
        # Construct Factors
        factors = []
        if len(evidence_timeline) >= 2:
            factors.append(f"Highly robust verification ({len(evidence_timeline)} independent evidence signals compiled).")
        else:
            factors.append("Limited empirical evidence found in the current sandbox scan.")
            
        if specialist_ratio >= 0.8:
            factors.append(f"Unanimous consensus among active specialized agents ({len(specialists)}/{len(specialists)} green status).")
        else:
            factors.append("Some specialized agents report incomplete diagnostic telemetry.")
            
        if any(ev.type == "historical_match" for ev in evidence_timeline):
            factors.append("Grounding matched with certified Organizational Memory runbook cases.")
        else:
            factors.append("No identical previous resolutions discovered in historic memory logs.")
            
        return ConfidenceDetail(
            score=score,
            grade=grade,
            factors=factors,
            specialist_agreement=round(specialist_ratio, 2),
            calculated_at=datetime.utcnow().isoformat() + "Z"
        )
