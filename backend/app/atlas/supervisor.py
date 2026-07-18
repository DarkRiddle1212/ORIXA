from typing import Any, Dict
from backend.app.core.logging import logger
from backend.app.atlas.workflow import AtlasWorkflow


class AtlasSupervisor:
    """
    High-level Coordinator Interface for the Atlas Orchestrator.
    Serves as the core entry point for dispatching multi-agent tasks.
    """

    def __init__(self):
        self.workflow = AtlasWorkflow()

    async def orchestrate(self, query: str, metadata: Dict[str, Any] = None) -> Dict[str, Any]:
        """
        Ingests user request, analyzes scope, structures the multi-specialist
        execution plan, executes tasks sequentially, and compiles the unified response.
        """
        logger.info(f"AtlasSupervisor: Ingesting orchestration query: '{query}'")
        try:
            result = await self.workflow.run(query, metadata)
            logger.info(f"AtlasSupervisor: Successfully completed orchestration for session {result.get('session_id')}")
            return result
        except Exception as e:
            logger.error(f"AtlasSupervisor: Critical error during multi-agent orchestration: {str(e)}")
            raise e


# Global singleton instance
atlas_supervisor = AtlasSupervisor()
