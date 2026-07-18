from typing import List
from backend.app.memory.memory_repository import memory_repository

class MemorySummary:
    """
    Summarization service for grouping, explaining, and consolidating 
    multiple organizational memory records.
    """
    def __init__(self):
        self.repository = memory_repository

    def summarize_incidents(self, ids: List[str]) -> str:
        """
        Synthesizes a list of memory IDs into an executive-level summary 
        outlining patterns, risks, and unified recovery postures.
        """
        items = []
        for memory_id in ids:
            item = self.repository.get_by_id(memory_id)
            if item:
                items.append(item)

        if not items:
            return "No incidents matching the specified criteria were identified for synthesis."

        total = len(items)
        critical_count = sum(1 for item in items if item.recommendations.get("risk_level") in ["HIGH", "CRITICAL"])
        
        all_tags = set()
        all_assets = set()
        all_specialists = set()
        all_lessons = []
        all_remediations = []

        for item in items:
            all_tags.update(item.tags)
            all_assets.update(item.affected_assets)
            all_specialists.update(item.selected_specialists)
            all_lessons.extend(item.lessons_learned)
            if "remediations" in item.recommendations:
                all_remediations.extend(item.recommendations["remediations"])

        summary = f"### Executive Operational Synthesis (Count: {total} Records)\n\n"
        summary += f"This synthesis covers **{total} historical events** (with **{critical_count} marked High/Critical Hazard**).\n\n"
        
        summary += "#### 🛠️ Core Specialists Engaged\n"
        summary += ", ".join([f"`{s}`" for s in sorted(all_specialists)]) + "\n\n"

        summary += "#### 🏷️ Organizational Tag Profiles\n"
        summary += ", ".join([f"#{tag}" for tag in sorted(all_tags)]) + "\n\n"

        summary += "#### 🌍 Affected Enterprise Assets\n"
        for asset in sorted(all_assets):
            summary += f"- `{asset}`\n"
        summary += "\n"

        summary += "#### 📓 Consolidated Incident Registry\n"
        for item in items:
            summary += f"- **[{item.id}] {item.incident}** (*{item.timestamp[:10]}*)\n"
            summary += f"  - *Request*: \"{item.user_request}\"\n"
            summary += f"  - *Outcome*: {item.final_outcome}\n"
        summary += "\n"

        summary += "#### 💡 Aggregated Lessons Learned\n"
        unique_lessons = list(dict.fromkeys(all_lessons))[:6]  # unique, top 6
        for lesson in unique_lessons:
            summary += f"- {lesson}\n"
        summary += "\n"

        summary += "#### 🛡️ Reusable Remediation Playbooks\n"
        unique_rem = list(dict.fromkeys(all_remediations))[:6]
        for rem in unique_rem:
            summary += f"- *Proactive*: {rem}\n"
        
        return summary

# Global summarizer instance
memory_summary = MemorySummary()
