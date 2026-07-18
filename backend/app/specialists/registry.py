from typing import Dict, List, Optional, Type
from backend.app.core.logging import logger
from backend.app.specialists.base import BaseSpecialist
from backend.app.specialists.impl import (
    AtlasSpecialist,
    SentinelSpecialist,
    GuardianSpecialist,
    ArchitectSpecialist,
    ForgeSpecialist,
    OracleSpecialist,
    ArchivistSpecialist,
    AmbassadorSpecialist,
)


class SpecialistRegistry:
    """
    Registry for managing AI Specialists in Orixa.
    Enables automatic registration, lookup, health monitoring,
    and supports dynamic expansion/loading of specialist modules.
    """

    def __init__(self):
        self._specialists: Dict[str, BaseSpecialist] = {}
        # Pre-register built-in agents
        self._auto_discover_and_register()

    def _auto_discover_and_register(self):
        """Discovers built-in specialist classes and registers instances in the pool."""
        built_ins = [
            AtlasSpecialist(),
            SentinelSpecialist(),
            GuardianSpecialist(),
            ArchitectSpecialist(),
            ForgeSpecialist(),
            OracleSpecialist(),
            ArchivistSpecialist(),
            AmbassadorSpecialist(),
        ]
        for spec in built_ins:
            self.register(spec)
        logger.info(f"SpecialistRegistry: Successfully registered {len(self._specialists)} core specialists.")

    def register(self, specialist: BaseSpecialist):
        """Registers a new specialist instance. Replaces existing key-match if necessary."""
        key = specialist.name.lower()
        self._specialists[key] = specialist
        logger.info(f"Registered specialist: {specialist.display_name} (ID: {specialist.id})")

    def register_class(self, specialist_cls: Type[BaseSpecialist]):
        """Dynamically instantiates and registers a specialist class."""
        try:
            instance = specialist_cls()
            self.register(instance)
        except Exception as e:
            logger.error(f"Failed to dynamically register specialist class {specialist_cls.__name__}: {str(e)}")

    def get_all(self) -> List[BaseSpecialist]:
        """Returns all registered specialists."""
        return list(self._specialists.values())

    def get_by_name(self, name: str) -> Optional[BaseSpecialist]:
        """Retrieves a specialist by name (case-insensitive)."""
        return self._specialists.get(name.lower())

    def get_health_status(self) -> Dict[str, str]:
        """Reports health values (e.g., GREEN, YELLOW, RED) across the entire fleet."""
        return {spec.display_name: spec.health for spec in self._specialists.values()}


# Global singleton instance
specialist_registry = SpecialistRegistry()
