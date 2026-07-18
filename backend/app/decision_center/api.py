from fastapi import APIRouter, HTTPException, status
from backend.app.decision_center.schemas import DecisionCenterProfile, ApprovalRequest
from backend.app.decision_center.decision_engine import DecisionEngine
from backend.app.decision_center.schemas import AuditEntry
from datetime import datetime

router = APIRouter(prefix="/decision_center", tags=["Atlas Decision Center"])

# Active approvals database in-memory
approvals_db = {}

@router.get("/explanations/{investigation_id}", response_model=DecisionCenterProfile, status_code=status.HTTP_200_OK)
async def get_investigation_explanation(investigation_id: str):
    """
    Fetch comprehensive explainability details for the active decision center investigation.
    Includes Executive Summary, Evidence Panel, Specialist Contributions, Decision DNA, Risk Assessment,
    Atlas Executive Summary, Expandable Evidence Trail, and Immutable Audit Trail.
    """
    try:
        profile = DecisionEngine.get_profile(investigation_id)
        # Apply any active approvals state
        if investigation_id in approvals_db:
            profile.status = approvals_db[investigation_id]["status"]
            # Append approval log to audit trail
            profile.audit_trail.append(
                AuditEntry(
                    id="aud-human-approval",
                    timestamp=approvals_db[investigation_id]["timestamp"],
                    action="HUMAN_APPROVAL_DECISION",
                    performed_by=approvals_db[investigation_id]["email"],
                    details=f"Operator made decision: {approvals_db[investigation_id]['status']}"
                )
            )
        return profile
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to compile Decision Center profile: {str(e)}"
        )

@router.post("/explanations/{investigation_id}/approve", status_code=status.HTTP_200_OK)
async def approve_recommendation(investigation_id: str, request: ApprovalRequest):
    """
    Submit manual human operator approval or bypass action for the specified recommendation.
    Logs actions securely within the audit trail.
    """
    try:
        if request.action not in ["APPROVED", "REJECTED"]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Action must be either APPROVED or REJECTED"
            )
        
        now_str = datetime.now().strftime("%H:%M:%S UTC")
        approvals_db[investigation_id] = {
            "status": request.action,
            "email": request.operator_email,
            "timestamp": now_str
        }
        
        return {
            "status": "SUCCESS",
            "message": f"Recommendation successfully {request.action.lower()} by {request.operator_email}.",
            "timestamp": now_str
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to record manual approval action: {str(e)}"
        )
