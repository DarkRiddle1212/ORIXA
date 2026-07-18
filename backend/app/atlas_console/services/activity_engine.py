from typing import List, Dict, Any

class ActivityEngine:
    """
    Supplies structural activity timeline entries tracking detailed metadata 
    inspections, governance evaluations, and specialist contributions.
    """
    
    def get_recent_activities(self) -> List[Dict[str, Any]]:
        return [
            {
                "id": "act-01",
                "timestamp": "2026-07-15T10:30:00Z",
                "stage": "Reading Organizational Context",
                "activity": "DataHub Lineage Inspection",
                "detail": "Mapped downstream analytics dependencies. Identified 1 dependent looker dashboard on sandbox schemas."
            },
            {
                "id": "act-02",
                "timestamp": "2026-07-15T10:32:00Z",
                "stage": "Searching Organizational Memory",
                "activity": "Memory Pattern Retrieval",
                "detail": "Retrieved incident #MEM-8FA4 for historic column mismatches on billing tables. Match strength: 89%."
            },
            {
                "id": "act-03",
                "timestamp": "2026-07-15T10:35:00Z",
                "stage": "Coordinating Specialists",
                "activity": "Specialist Consensus Reached",
                "detail": "Sentinel threat engine and Atlas schema alignments validated unanimous risk containment plan."
            }
        ]
