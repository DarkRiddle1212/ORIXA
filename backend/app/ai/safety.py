from typing import Any, Dict, List
from backend.app.core.logging import logger

class SafetyManager:
    """
    Configures and enforces safety policies for Gemini API calls.
    Includes configuration payloads for API safety blocks and local filters.
    """

    @staticmethod
    def get_default_safety_settings() -> List[Dict[str, str]]:
        """Returns standard safety filters to prevent toxic or harmful generations."""
        return [
            {
                "category": "HARM_CATEGORY_HARASSMENT",
                "threshold": "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
                "category": "HARM_CATEGORY_HATE_SPEECH",
                "threshold": "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
                "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                "threshold": "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
                "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
                "threshold": "BLOCK_MEDIUM_AND_ABOVE"
            }
        ]

    @staticmethod
    def inspect_content(text: str) -> bool:
        """
        Conducts basic checks on raw text to detect obvious policy anomalies before sending.
        Returns True if the content is safe to process, False otherwise.
        """
        # Placeholders for any strict client-side PII or blacklist terms if required
        if not text:
            return True
            
        blacklisted_terms = ["__orixa_secret_sandbox_leak__"]
        for term in blacklisted_terms:
            if term in text:
                logger.warning(f"SafetyManager: Content blocked due to matching blacklisted term '{term}'")
                return False
                
        return True
