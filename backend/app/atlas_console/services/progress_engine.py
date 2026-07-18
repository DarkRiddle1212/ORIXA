from typing import Dict, Any

class ProgressEngine:
    """
    Coordinates investigation stages, maps them to realistic system progress metrics, 
    and handles remaining execution time estimations.
    """
    
    STAGES = [
        "Receiving Request",
        "Reading Organizational Context",
        "Searching Organizational Memory",
        "Coordinating Specialists",
        "Generating Recommendation",
        "Completed"
    ]
    
    STAGE_PERCENTAGES = {
        "Receiving Request": 20,
        "Reading Organizational Context": 40,
        "Searching Organizational Memory": 65,
        "Coordinating Specialists": 85,
        "Generating Recommendation": 95,
        "Completed": 100
    }
    
    STAGE_ESTIMATED_TIMES = {
        "Receiving Request": 8,
        "Reading Organizational Context": 6,
        "Searching Organizational Memory": 4,
        "Coordinating Specialists": 3,
        "Generating Recommendation": 2,
        "Completed": 0
    }

    def get_progress_data(self, stage_name: str, elapsed_seconds: int = 12) -> Dict[str, Any]:
        if stage_name not in self.STAGE_PERCENTAGES:
            stage_name = "Receiving Request"
            
        progress_pct = self.STAGE_PERCENTAGES[stage_name]
        remaining_seconds = self.STAGE_ESTIMATED_TIMES[stage_name]
        
        return {
            "stage_name": stage_name,
            "progress_percentage": progress_pct,
            "elapsed_seconds": elapsed_seconds,
            "estimated_remaining_seconds": remaining_seconds
        }
