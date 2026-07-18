import json
from typing import Any, Dict, List
from pydantic import BaseModel

class PromptBuilder:
    """
    Constructs highly structured, multi-context prompt templates for Gemini.
    Embeds raw user intent, catalog metadata, similarity logs, and active agent execution footprints.
    """

    @staticmethod
    def build_synthesis_prompt(
        query: str,
        datahub_assets: List[Any],
        similar_incidents: List[Any],
        specialist_outputs: Dict[str, Any]
    ) -> str:
        # Format DataHub Context
        datahub_str = "No DataHub catalog context matching this query was found."
        if datahub_assets:
            assets_list = []
            for asset in datahub_assets:
                asset_dict = asset.model_dump() if hasattr(asset, "model_dump") else str(asset)
                assets_list.append(asset_dict)
            datahub_str = json.dumps(assets_list, indent=2)

        # Format Organizational Memory Context
        memory_str = "No similar historical incidents found in organizational memory."
        if similar_incidents:
            memories_list = []
            for item in similar_incidents:
                item_dict = item.model_dump() if hasattr(item, "model_dump") else str(item)
                memories_list.append(item_dict)
            memory_str = json.dumps(memories_list, indent=2)

        # Format Specialists Context
        specialists_str = json.dumps(specialist_outputs, indent=2) if specialist_outputs else "No active specialists registered or triggered."

        prompt = f"""You are the Orixa Enterprise Intelligence Operating System Core Reasoning Engine (powered by Google Gemini 3.5).
You are tasked with analyzing a complex system incident, conducting Root Cause Analysis, evaluating security risks, and synthesizing a comprehensive remediation report.

Your synthesis MUST be based strictly on the provided multi-source context, including live DataHub metadata schemas, historical memory records, and distinct Specialist agent execution logs.

---
### 1. RAW USER REQUEST / TELEMETRY INCIDENT
"{query}"

---
### 2. DATAHUB METADATA CATALOG CONTEXT
{datahub_str}

---
### 3. SIMILAR INCIDENTS (ORGANIZATIONAL MEMORY)
{memory_str}

---
### 4. ACTIVE SPECIALIST AGENTS EXECUTION LOGS
{specialists_str}

---
### REQUIRED OUTPUT FORMAT:
You MUST output a single, valid JSON object matching the following structure. Do not wrap the JSON in Markdown block formatting or any other headers. Just return raw JSON.

{{
  "overview": "A detailed executive summary of the incident findings, explaining what occurred, the operational impact, and high-level recovery strategy.",
  "root_cause_analysis": "An extensive technical diagnosis tracing how and why the incident occurred based on DataHub schema or specialist signals.",
  "risk_assessment": "Analysis of the immediate security, privacy, and systemic risk. Outline compliance impact (e.g. GDPR, PII exposure).",
  "risk_level": "Overall hazard level. Must be one of: 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL'.",
  "confidence_score": 0.85,  // A float between 0.0 and 1.0 representing system alignment and grounding.
  "findings": [
    "A list of bulleted high-impact discoveries and evidence items. For example: 'Anomaly [Sentry-X]: Detected anomalous SQL queries...'"
  ],
  "remediations": [
    {{
      "action_type": "SQL_MIGRATION", // Category of remediation: SQL_MIGRATION, SECURITY_PATCH, ACCESS_CONTROL, CONFIG_PATCH, HEALTH_CHECK
      "title": "Apply Forge DDL Encrypted Mappings Patch",
      "description": "Description of the remediation step.",
      "code": "Actual SQL or shell commands proposed."
    }}
  ],
  "specialist_contributions": [
    {{
      "specialist_name": "Sentry-X",
      "contribution": "Detailed explanation of how this specific agent's input was evaluated and integrated into the final solution."
    }}
  ]
}}

Ensure that all 'remediations' include accurate, production-safe SQL syntax or terminal shell scripts in the 'code' field. Maintain professional, clear, and objective terminology.
"""
        return prompt
