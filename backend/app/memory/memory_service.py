from typing import Any, Dict, List, Optional
from backend.app.memory.memory_models import MemoryItem
from backend.app.memory.memory_repository import memory_repository, MemoryRepository
from backend.app.memory.memory_search import memory_search, MemorySearch
from backend.app.memory.memory_summary import memory_summary, MemorySummary

class MemoryService:
    """
    Unified domain service representing Orixa's Organizational Memory capability.
    Coordinates database/in-memory states, search query vectors, and text synthesizers.
    """
    def __init__(self):
        self.repository: MemoryRepository = memory_repository
        self.search_engine: MemorySearch = memory_search
        self.summarizer: MemorySummary = memory_summary

    def save_memory(self, item: MemoryItem) -> MemoryItem:
        """Saves a new historical operational record to memory."""
        return self.repository.save(item)

    def get_by_id(self, memory_id: str) -> Optional[MemoryItem]:
        """Loads a specific memory record by ID."""
        return self.repository.get_by_id(memory_id)

    def get_recent_events(self, limit: int = 10) -> List[MemoryItem]:
        """Loads the most recent operational memories."""
        return self.repository.get_recent_events(limit)

    def find_similar_incidents(self, query: str, limit: int = 5) -> List[MemoryItem]:
        """Computes keyword overlap similarities with existing incidents."""
        return self.search_engine.find_similar_incidents(query, limit)

    def search_memory(self, query: str, tags: Optional[List[str]] = None, limit: int = 10) -> List[MemoryItem]:
        """Queries database records based on keywords and metadata classifications."""
        return self.search_engine.search_memory(query, tags, limit)

    def get_asset_history(self, asset_urn: str) -> List[MemoryItem]:
        """Extracts history timeline records touching a single resource."""
        return self.repository.get_asset_history(asset_urn)

    def get_specialist_history(self, specialist_name: str) -> List[MemoryItem]:
        """Extracts execution tracking records involving a single specialist."""
        return self.repository.get_specialist_history(specialist_name)

    def summarize_incidents(self, ids: List[str]) -> str:
        """Synthesizes multiple incidents into an executive analysis."""
        return self.summarizer.summarize_incidents(ids)

# Global service instance
memory_service = MemoryService()
