import uuid
from typing import Dict, Optional
from backend.app.replay.event_models import ReplayTimeline
from backend.app.replay.timeline_builder import TimelineBuilder


class ReplayService:
    """
    Coordinates state lookup, construction, and simulation caching of active incident timelines.
    """

    def __init__(self):
        # Seed an initial registry of active replays
        self._registry: Dict[str, ReplayTimeline] = {}
        self._initialize_defaults()

    def _initialize_defaults(self):
        # Pre-seed the registry with the 5 major scenarios
        scenarios = TimelineBuilder.get_predefined_scenarios()
        for scenario_key in scenarios.keys():
            # Seed them both as their specific key name and a random uuid
            timeline = TimelineBuilder.build_timeline(scenario_key, scenario_key)
            self._registry[scenario_key] = timeline
            
            # Seed an additional uuid version
            alt_id = f"inv-{scenario_key[:4]}-{str(uuid.uuid4())[:8]}"
            self._registry[alt_id] = TimelineBuilder.build_timeline(alt_id, scenario_key)

    def get_replay_timeline(self, investigation_id: str) -> Optional[ReplayTimeline]:
        """
        Retrieves an active replay timeline by investigation_id reference.
        """
        # If not explicitly present, fall back to compiling a greenfield timeline
        if investigation_id not in self._registry:
            # Let's see if the ID is a substring of a scenario, otherwise general
            self._registry[investigation_id] = TimelineBuilder.build_timeline(investigation_id, investigation_id)
        return self._registry[investigation_id]

    def generate_replay_timeline(self, query: str) -> ReplayTimeline:
        """
        Dynamically constructs and registers a high-fidelity replay timeline for a specific query.
        """
        new_id = f"inv-gen-{str(uuid.uuid4())[:8]}"
        timeline = TimelineBuilder.build_timeline(new_id, query)
        self._registry[new_id] = timeline
        return timeline


# Global singleton service
replay_service = ReplayService()
