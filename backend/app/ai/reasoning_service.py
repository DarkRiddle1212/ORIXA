import time
from typing import Any, Dict, List
from backend.app.core.logging import logger
from backend.app.ai.gemini_client import gemini_client
from backend.app.ai.prompt_builder import PromptBuilder
from backend.app.ai.response_parser import ResponseParser
from backend.app.ai.token_manager import TokenManager
from backend.app.ai.safety import SafetyManager

class ReasoningService:
    """
    Coordinates context integration, model execution, safety screening,
    and structured output translation for Atlas.
    """

    def __init__(self):
        self.client = gemini_client

    async def generate_reasoning_synthesis(
        self,
        query: str,
        datahub_assets: List[Any],
        similar_incidents: List[Any],
        specialist_outputs: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Gathers multi-source context, constructs the comprehensive system prompt,
        invokes Google Gemini, and returns a verified explainable diagnosis.
        """
        start_time = time.time()
        
        # 1. Pre-Execution Safety Inspection
        if not SafetyManager.inspect_content(query):
            logger.error("ReasoningService: Content did not clear pre-execution safety rules.")
            raise ValueError("Provided query failed core systemic safety inspections.")

        # 2. Compile Unified Prompt
        prompt = PromptBuilder.build_synthesis_prompt(
            query=query,
            datahub_assets=datahub_assets,
            similar_incidents=similar_incidents,
            specialist_outputs=specialist_outputs
        )

        # 3. Context Budget Analysis
        if not TokenManager.fits_context_window(prompt):
            logger.warning("ReasoningService: Prompt exceeds standard context window threshold. Proceeding with caution.")

        # 4. Invoke Gemini API
        contents = [
            {
                "parts": [
                    {"text": prompt}
                ]
            }
        ]
        
        # Build generation configuration. Request structured JSON response.
        config = {
            "responseMimeType": "application/json",
            "temperature": 0.2, # Low temperature for analytical precision
            "safetySettings": SafetyManager.get_default_safety_settings()
        }

        try:
            raw_response = await self.client.generate_content(
                contents=contents,
                config=config
            )
            
            # Extract generated text from candidates
            candidates = raw_response.get("candidates", [])
            if not candidates:
                logger.error("ReasoningService: Empty candidates returned from Gemini API.")
                raise ValueError("Gemini returned an empty generation response.")

            parts = candidates[0].get("content", {}).get("parts", [])
            if not parts:
                logger.error("ReasoningService: Candidate contains no content parts.")
                raise ValueError("Gemini response is missing text parts.")

            raw_text = parts[0].get("text", "")
            if not raw_text:
                logger.error("ReasoningService: Candidate part text is empty.")
                raise ValueError("Gemini text block is empty.")

            # 5. Parse and Validate Structured Payload
            result = ResponseParser.parse_and_validate(raw_text)
            
            duration = time.time() - start_time
            logger.info(f"ReasoningService: Successfully synthesized explainable reasoning in {duration:.2f}s")
            return result

        except Exception as ex:
            logger.error(f"ReasoningService: Failed during synthesis pipeline: {str(ex)}")
            # Fail gracefully, but bubble up to Atlas orchestrator to let it decide fallback behavior
            raise ex

# Singleton instance
reasoning_service = ReasoningService()
