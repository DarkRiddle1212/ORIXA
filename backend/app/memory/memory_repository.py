from typing import List, Optional
from backend.app.memory.memory_models import MemoryItem
from backend.app.memory.memory_store import memory_store

class MemoryRepository:
    """
    Data Access Layer for querying and committing to Orixa's Organizational Memory.
    Provides decoupled domain methods for querying histories, assets, and specialists.
    """
    def __init__(self):
        self.store = memory_store

    def save(self, item: MemoryItem) -> MemoryItem:
        self.store.add(item)
        return item

    def get_by_id(self, memory_id: str) -> Optional[MemoryItem]:
        return self.store.get_by_id(memory_id)

    def get_all(self) -> List[MemoryItem]:
        return self.store.get_all()

    def get_recent_events(self, limit: int = 10) -> List[MemoryItem]:
        # Sort items chronologically descending
        all_items = self.store.get_all()
        sorted_items = sorted(
            all_items, 
            key=lambda x: x.timestamp, 
            reverse=True
        )
        return sorted_items[:limit]

    def get_asset_history(self, asset_urn: str) -> List[MemoryItem]:
        # Retrieve all memories touching the specified asset URN (case-insensitive check)
        all_items = self.store.get_all()
        matching = []
        for item in all_items:
            if any(asset_urn.lower() in asset.lower() for asset in item.affected_assets):
                matching.append(item)
        return sorted(matching, key=lambda x: x.timestamp, reverse=True)

    def get_specialist_history(self, specialist_name: str) -> List[MemoryItem]:
        # Retrieve all memories involving the specified specialist agent
        all_items = self.store.get_all()
        matching = []
        for item in all_items:
            if any(specialist_name.lower() == spec.lower() for spec in item.selected_specialists):
                matching.append(item)
        return sorted(matching, key=lambda x: x.timestamp, reverse=True)

# Global repository instance
memory_repository = MemoryRepository()
