from typing import List, Dict, Any
from datetime import datetime

class MessageEngine:
    """
    Synthesizes and delivers objective, professional, non-conversational 
    SRE and Incident Commander messages matching Orixa voice guidelines.
    """
    
    def get_sequential_feed(self, investigation_id: str) -> List[Dict[str, str]]:
        """
        Retrieves standard chronological operational event logs for an investigation.
        """
        now = datetime.now()
        
        # SRE style operational sequences
        if "drift" in investigation_id.lower() or "schema" in investigation_id.lower() or "silent" in investigation_id.lower():
            return [
                {"timestamp": "09:14:12", "message": "Investigation initiated."},
                {"timestamp": "09:14:13", "message": "Retrieving DataHub organizational context."},
                {"timestamp": "09:14:15", "message": "Catalog synchronized with physical pg_catalog scans."},
                {"timestamp": "09:14:18", "message": "Searching Organizational Memory for drift patterns."},
                {"timestamp": "09:14:20", "message": "2 historical incidents matching schema deviations found."},
                {"timestamp": "09:14:22", "message": "Atlas Supervisor coordination complete. Architect assigned."},
                {"timestamp": "09:14:24", "message": "Sentinel threat analyzer assigned."},
                {"timestamp": "09:14:27", "message": "Risk and downstream compliance evaluation in progress."},
                {"timestamp": "09:14:31", "message": "Transactional schema mitigation recommendation generated."}
            ]
        elif "key" in investigation_id.lower() or "leak" in investigation_id.lower():
            return [
                {"timestamp": "14:02:10", "message": "Security threat investigation dispatched."},
                {"timestamp": "14:02:11", "message": "Retrieving credential metadata models."},
                {"timestamp": "14:02:13", "message": "Scanning sandbox active container workspace logs."},
                {"timestamp": "14:02:15", "message": "Archivist matched suspicious credentials in commit registry."},
                {"timestamp": "14:02:18", "message": "Security policy incident playbook isolated. SRE chapter 9 engaged."},
                {"timestamp": "14:02:22", "message": "Sentinel containment scripts evaluated."},
                {"timestamp": "14:02:25", "message": "Risk escalation identified: critical database write capability threat."},
                {"timestamp": "14:02:29", "message": "Mitigation prepared: rotate sandbox credentials and restrict network subnets."}
            ]
        else:
            return [
                {"timestamp": "11:00:00", "message": "Continuous background scanning active."},
                {"timestamp": "11:00:05", "message": "Metadata models synchronized with DataHub Graph database."},
                {"timestamp": "11:00:10", "message": "All database columns and indexes verified against baseline registrations."}
            ]
            
    def get_stage_message(self, stage_name: str) -> str:
        """
        Returns direct, context-rich SRE descriptions of current operations.
        """
        stage_messages = {
            "Receiving Request": "Ingesting request parameters into isolated container memory.",
            "Reading Organizational Context": "Reading DataHub lineage and inspecting column ownership catalogs.",
            "Searching Organizational Memory": "Querying vector indices in Organizational Memory for similar drift cases.",
            "Coordinating Specialists": "Coordinating active specialist agents: Architect and Sentinel.",
            "Generating Recommendation": "Preparing explainable transactional migration scripts and compliance mitigations.",
            "Completed": "Recommendation ready for review. Action items queued."
        }
        return stage_messages.get(stage_name, "Processing operational metadata.")
