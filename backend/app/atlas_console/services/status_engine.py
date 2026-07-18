class StatusEngine:
    """
    Evaluates and transitions between the official Atlas Operations Console status states:
    - Monitoring
    - Healthy
    - Investigating
    - Waiting for Approval
    - Recommendation Ready
    - Review Required
    - Paused
    - Offline
    """
    
    def __init__(self):
        # Default baseline operational status
        self._current_status = "Monitoring"

    def get_status(self) -> str:
        return self._current_status

    def set_status(self, status: str) -> str:
        valid_statuses = {
            "Monitoring",
            "Healthy",
            "Investigating",
            "Waiting for Approval",
            "Recommendation Ready",
            "Review Required",
            "Paused",
            "Offline"
        }
        if status in valid_statuses:
            self._current_status = status
            return self._current_status
        raise ValueError(f"Invalid Atlas operational status state: {status}")

    def evaluate_system_state(self, has_active_investigations: bool, pending_approvals: int, is_offline: bool) -> str:
        """
        Determines state dynamically based on operational variables.
        """
        if is_offline:
            self._current_status = "Offline"
        elif has_active_investigations:
            self._current_status = "Investigating"
        elif pending_approvals > 0:
            self._current_status = "Waiting for Approval"
        else:
            self._current_status = "Healthy"
        return self._current_status
