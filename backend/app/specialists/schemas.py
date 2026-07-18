from typing import Any, Dict, List
from pydantic import BaseModel, Field


class SpecialistSchema(BaseModel):
    id: str = Field(..., description="Unique identifier of the specialist")
    name: str = Field(..., description="Name of the specialist used in routing")
    display_name: str = Field(..., description="Human-readable title of the specialist")
    description: str = Field(..., description="A short summary of what the specialist does")
    responsibilities: List[str] = Field(..., description="Key responsibilities of this specialist")
    status: str = Field("IDLE", description="Current operational status: IDLE, ACTIVE, ERROR")
    health: str = Field("GREEN", description="Current health level: GREEN, YELLOW, RED")
    capabilities: List[str] = Field(..., description="Unique actions/capabilities of this specialist")
    supported_tasks: List[str] = Field(..., description="List of tasks this specialist can execute")


class TaskExecutionRequest(BaseModel):
    task: str = Field(..., description="The name of the task to execute")
    payload: Dict[str, Any] = Field(default_factory=dict, description="Input parameters and arguments for the task")


class TaskExecutionResponse(BaseModel):
    specialist_id: str = Field(..., description="The ID of the executing specialist")
    specialist_name: str = Field(..., description="The name of the executing specialist")
    task: str = Field(..., description="The executed task")
    status: str = Field(..., description="Status of the execution: SUCCESS, FAILED")
    result: Dict[str, Any] = Field(..., description="The output payload or results of the execution")
    explanation: str = Field(..., description="Human-readable explanation of why and how the action was performed")
