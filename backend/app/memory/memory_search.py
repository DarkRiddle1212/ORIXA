import re
from typing import List, Optional
from backend.app.memory.memory_models import MemoryItem
from backend.app.memory.memory_repository import memory_repository

class MemorySearch:
    """
    Search and relevance calculation engine for Organizational Memory.
    Uses token overlap relevance scoring to determine context similarity 
    without heavy dependency trees.
    """
    def __init__(self):
        self.repository = memory_repository

    def tokenize(self, text: str) -> set[str]:
        # Convert to lower, strip non-alphanumeric, and return set of tokens
        text_clean = re.sub(r'[^a-zA-Z0-9\s_]', '', text.lower())
        return set(word for word in text_clean.split() if len(word) > 2)

    def find_similar_incidents(self, query: str, limit: int = 5) -> List[MemoryItem]:
        """
        Locates historical incidents most similar to the incoming user request.
        Ranks memories by keyword overlap with incident titles and queries.
        """
        if not query or not query.strip():
            return self.repository.get_recent_events(limit=limit)

        query_tokens = self.tokenize(query)
        scored_items = []

        for item in self.repository.get_all():
            # Calculate overlapping word count across key memory fields
            incident_tokens = self.tokenize(item.incident)
            request_tokens = self.tokenize(item.user_request)
            lessons_tokens = set()
            for lesson in item.lessons_learned:
                lessons_tokens.update(self.tokenize(lesson))
            
            # Weighted scoring
            score = 0.0
            score += len(query_tokens.intersection(incident_tokens)) * 3.0
            score += len(query_tokens.intersection(request_tokens)) * 2.0
            score += len(query_tokens.intersection(lessons_tokens)) * 1.0
            
            # Tag overlap adds relevance
            for tag in item.tags:
                if tag.lower() in query.lower():
                    score += 2.0

            if score > 0.0:
                scored_items.append((score, item))

        # Sort by score descending
        scored_items.sort(key=lambda x: x[0], reverse=True)
        return [item for _, item in scored_items[:limit]]

    def search_memory(self, query: str, tags: Optional[List[str]] = None, limit: int = 10) -> List[MemoryItem]:
        """
        Broad search across the memory store. Matches query and filters by tags if supplied.
        """
        all_items = self.repository.get_all()
        results = []

        query_tokens = self.tokenize(query) if query else set()

        for item in all_items:
            # 1. Filter by tags if specified
            if tags:
                item_tags_lower = [t.lower() for t in item.tags]
                if not any(t.lower() in item_tags_lower for t in tags):
                    continue

            # 2. Match text query if specified
            if query_tokens:
                text_to_match = f"{item.incident} {item.user_request} {item.final_outcome} " + " ".join(item.lessons_learned)
                item_tokens = self.tokenize(text_to_match)
                overlap = query_tokens.intersection(item_tokens)
                
                # Check for substring matches too in case of small keywords
                substring_match = any(token in text_to_match.lower() for token in query_tokens)
                
                if not overlap and not substring_match:
                    continue

            results.append(item)

        # Sort the filtered results: if there is a query, sort by relevance, else sort by timestamp
        if query_tokens:
            def get_score(itm: MemoryItem):
                text_to_match = f"{itm.incident} {itm.user_request} {itm.final_outcome}"
                itm_tk = self.tokenize(text_to_match)
                return len(query_tokens.intersection(itm_tk))
            results.sort(key=get_score, reverse=True)
        else:
            results.sort(key=lambda x: x.timestamp, reverse=True)

        return results[:limit]

# Global search service instance
memory_search = MemorySearch()
