from datetime import datetime
from typing import Dict, Any, List, Optional

class AtlasConsoleModel:
    """
    State container representing the real-time operational database configuration 
    and memory-aligned telemetry for the Atlas Operations Console.
    """
    def __init__(self):
        self.active_investigations_count: int = 0
        self.system_status: str = "Monitoring"
        self.last_sync_time: datetime = datetime.now()
        self.active_specialist_id: Optional[str] = None
        self.operational_log: List[Dict[str, Any]] = []

    def to_dict(self) -> Dict[str, Any]:
        return {
            "active_investigations_count": self.active_investigations_count,
            "system_status": self.system_status,
            "last_sync_time": self.last_sync_time.isoformat(),
            "active_specialist_id": self.active_specialist_id,
            "operational_log": self.operational_log
        }
