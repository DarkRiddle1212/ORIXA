from fastapi import APIRouter, HTTPException, status
from typing import List, Dict, Any
from backend.app.explainability.decision_models import ExplanationResponse, EvidenceItem, ConfidenceDetail
from backend.app.explainability.explanation_service import ExplanationService

router = APIRouter(prefix="/explainability", tags=["Explainability & Decision Center"])

@router.get("/explanations/{investigation_id}", response_model=ExplanationResponse, status_code=status.HTTP_200_OK)
async def get_investigation_explanation(investigation_id: str):
    """
    Retrieve executive summary, root cause, specialist details, risk assessments,
    remediations, and compliance audit histories for a specific investigation.
    """
    try:
        return ExplanationService.get_explanation(investigation_id)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to compile explanation: {str(e)}"
        )

@router.get("/evidence/{investigation_id}", response_model=List[EvidenceItem], status_code=status.HTTP_200_OK)
async def get_investigation_evidence(investigation_id: str):
    """
    Retrieve chronological evidence cards backing an active investigation recommendation.
    """
    try:
        res = ExplanationService.get_explanation(investigation_id)
        return res.evidence_timeline
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch evidence cards: {str(e)}"
        )

@router.get("/confidence/{investigation_id}", response_model=ConfidenceDetail, status_code=status.HTTP_200_OK)
async def get_investigation_confidence(investigation_id: str):
    """
    Retrieve Orixa's reasoning reliability factors and trust level calculations.
    """
    try:
        res = ExplanationService.get_explanation(investigation_id)
        return res.confidence
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to calculate confidence detail: {str(e)}"
        )
