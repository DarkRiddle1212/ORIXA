import json
import re
from typing import Any, Dict, List
from backend.app.core.logging import logger

class ResponseParser:
    """
    Parses and validates raw text output from Gemini, extracting structured JSON payloads.
    Provides sanitization filters and enforces fallback models to ensure robust processing.
    """

    @staticmethod
    def clean_json_string(text: str) -> str:
        """Strips potential markdown wrappers or surrounding whitespace from JSON output."""
        cleaned = text.strip()
        # Strip ```json ... ``` blocks
        match = re.search(r"```(?:json)?\s*(.*?)\s*```", cleaned, re.DOTALL | re.IGNORECASE)
        if match:
            cleaned = match.group(1).strip()
        return cleaned

    @staticmethod
    def parse_and_validate(raw_text: str) -> Dict[str, Any]:
        """
        Parses raw text into JSON and ensures essential schema fields are present and correctly typed.
        """
        cleaned = ResponseParser.clean_json_string(raw_text)
        
        try:
            parsed = json.loads(cleaned)
        except json.JSONDecodeError as err:
            logger.error(f"ResponseParser: Failed to decode JSON from raw text: {str(err)}. Text beginning: {raw_text[:200]}")
            raise ValueError(f"Failed to decode response payload as valid JSON: {str(err)}")

        # Enforce and validate fields
        required_fields = {
            "overview": str,
            "root_cause_analysis": str,
            "risk_assessment": str,
            "risk_level": str,
            "confidence_score": float,
            "findings": list,
            "remediations": list,
            "specialist_contributions": list
        }

        validated = {}
        for field, expected_type in required_fields.items():
            if field not in parsed:
                # Provide a clean default
                if expected_type == str:
                    validated[field] = f"Information regarding {field.replace('_', ' ')} is not specified."
                elif expected_type == float:
                    validated[field] = 0.5
                elif expected_type == list:
                    validated[field] = []
                logger.warning(f"ResponseParser: Missing expected field '{field}'. Injected fallback default.")
            else:
                val = parsed[field]
                # Coerce or validate type
                try:
                    if expected_type == float:
                        validated[field] = float(val)
                    elif expected_type == list:
                        validated[field] = list(val)
                    else:
                        validated[field] = str(val)
                except Exception:
                    logger.warning(f"ResponseParser: Could not coerce field '{field}' to {expected_type}. Setting default.")
                    validated[field] = expected_type()

        # Sanitize inner lists (remediations and specialist contributions)
        sanitized_remediations = []
        for r in validated["remediations"]:
            if isinstance(r, dict):
                sanitized_remediations.append({
                    "action_type": str(r.get("action_type", "HEALTH_CHECK")),
                    "title": str(r.get("title", "Remediation Step")),
                    "description": str(r.get("description", "Actionable recovery instructions.")),
                    "code": str(r.get("code", ""))
                })
        validated["remediations"] = sanitized_remediations

        sanitized_contributions = []
        for c in validated["specialist_contributions"]:
            if isinstance(c, dict):
                sanitized_contributions.append({
                    "specialist_name": str(c.get("specialist_name", "Unknown Agent")),
                    "contribution": str(c.get("contribution", "Analyzed telemetry context."))
                })
        validated["specialist_contributions"] = sanitized_contributions

        return validated
