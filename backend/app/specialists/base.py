from abc import ABC, abstractmethod
from typing import Any, Dict, List
from backend.app.specialists.schemas import SpecialistSchema, TaskExecutionResponse


class BaseSpecialist(ABC):
    """
    Abstract Base Class for all Orixa AI Specialists.
    Enforces architectural uniformity, standardized telemetry, capabilities mapping,
    and a reliable execution interface across the entire autonomous workspace fleet.
    """

    def __init__(
        self,
        id: str,
        name: str,
        display_name: str,
        description: str,
        responsibilities: List[str],
        capabilities: List[str],
        supported_tasks: List[str],
        status: str = "IDLE",
        health: str = "GREEN",
    ):
        self.id = id
        self.name = name
        self.display_name = display_name
        self.description = description
        self.responsibilities = responsibilities
        self.capabilities = capabilities
        self.supported_tasks = supported_tasks
        self.status = status
        self.health = health

    def to_schema(self) -> SpecialistSchema:
        """Serializes the specialist's current operational state into a Pydantic schema."""
        return SpecialistSchema(
            id=self.id,
            name=self.name,
            display_name=self.display_name,
            description=self.description,
            responsibilities=self.responsibilities,
            status=self.status,
            health=self.health,
            capabilities=self.capabilities,
            supported_tasks=self.supported_tasks,
        )

    def set_status(self, status: str):
        """Updates the operational status (e.g. IDLE, ACTIVE, ERROR)"""
        self.status = status

    def set_health(self, health: str):
        """Updates the current health index (e.g. GREEN, YELLOW, RED)"""
        self.health = health

    @abstractmethod
    async def execute(self, task: str, payload: Dict[str, Any]) -> TaskExecutionResponse:
        """
        Asynchronously executes a targeted, domain-specific operational task.
        Must be implemented by all concrete inheriting specialist classes.
        """
        pass
