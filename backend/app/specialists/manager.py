from typing import Any, Dict, List, Optional
from backend.app.core.logging import logger
from backend.app.specialists.registry import specialist_registry
from backend.app.specialists.schemas import SpecialistSchema, TaskExecutionResponse


class SpecialistManager:
    """
    Manager responsible for coordinating specialized agent lifecycles,
    monitoring telemetry, executing commands, and broadcasting events.
    Acts as the main orchestration interface for supervisor coordinators.
    """

    def __init__(self):
        self.registry = specialist_registry

    def get_all_specialists(self) -> List[SpecialistSchema]:
        """Retrieves current states of all registered specialists."""
        return [spec.to_schema() for spec in self.registry.get_all()]

    def get_specialist(self, name: str) -> Optional[SpecialistSchema]:
        """Retrieves a single specialist by name, serialized as a schema."""
        spec = self.registry.get_by_name(name)
        return spec.to_schema() if spec else None

    async def execute_agent_task(self, name: str, task: str, payload: Dict[str, Any]) -> TaskExecutionResponse:
        """
        Coordinates execution of a task for a specific specialist.
        Handles lifecycle events, alerts, and exceptions during processing.
        """
        spec = self.registry.get_by_name(name)
        if not spec:
            raise ValueError(f"Specialist '{name}' does not exist in the active fleet.")

        logger.info(f"SpecialistManager: Initiating task '{task}' on agent '{spec.display_name}'")
        self.broadcast_event("task_start", {"specialist": spec.name, "task": task})

        try:
            # Execute agent logic asynchronously
            response = await spec.execute(task, payload)
            
            logger.info(f"SpecialistManager: Task '{task}' successfully completed by '{spec.display_name}'")
            self.broadcast_event("task_success", {"specialist": spec.name, "task": task, "status": "SUCCESS"})
            return response

        except Exception as e:
            logger.error(f"SpecialistManager: Error during task '{task}' execution on '{spec.display_name}': {str(e)}")
            spec.set_status("ERROR")
            spec.set_health("RED")
            
            self.broadcast_event("task_failure", {"specialist": spec.name, "task": task, "error": str(e)})
            raise e

    def broadcast_event(self, event_type: str, payload: Dict[str, Any]):
        """
        Simulates event broadcasting across specialists for active collaboration.
        In the future, this will hook into LangGraph and RabbitMQ event buses.
        """
        logger.info(f"SpecialistManager Event: Broadcast '{event_type}' payload: {payload}")


# Global singleton instance
specialist_manager = SpecialistManager()
