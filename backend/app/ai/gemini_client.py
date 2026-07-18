import os
import httpx
import asyncio
from typing import Any, Dict
from backend.app.core.logging import logger

class GeminiClient:
    """
    Client for interacting with the Google Gemini API.
    Handles communication, headers, retry logic, timeout handling, and request logging.
    """

    def __init__(self, api_key: str = None, model: str = "gemini-3.5-flash"):
        self.api_key = api_key or os.environ.get("GEMINI_API_KEY")
        self.model = model
        self.base_url = "https://generativelanguage.googleapis.com/v1beta"
        
        # We must set the User-Agent header to 'aistudio-build' for telemetry
        self.headers = {
            "Content-Type": "application/json",
            "User-Agent": "aistudio-build"
        }

    async def generate_content(
        self, 
        contents: Any, 
        config: Dict[str, Any] = None, 
        retries: int = 3, 
        backoff_factor: float = 1.5,
        timeout: float = 30.0
    ) -> Dict[str, Any]:
        """
        Sends contents to the Gemini API and retrieves the generated content response.
        Implements transient error retry logic and custom timeouts.
        """
        if not self.api_key:
            logger.error("GeminiClient: GEMINI_API_KEY environment variable is missing")
            raise ValueError("GEMINI_API_KEY is not configured in the environment.")

        url = f"{self.base_url}/models/{self.model}:generateContent?key={self.api_key}"
        
        payload = {
            "contents": contents
        }
        if config:
            payload["generationConfig"] = config

        logger.info(f"GeminiClient: Initiating request to model '{self.model}'")
        
        attempt = 0
        while attempt < retries:
            try:
                async with httpx.AsyncClient(timeout=timeout) as client:
                    response = await client.post(url, json=payload, headers=self.headers)
                    
                if response.status_code == 200:
                    logger.info("GeminiClient: Request completed successfully (HTTP 200)")
                    return response.json()
                
                # Check for rate limits (429) or server errors (5xx)
                if response.status_code in [429, 500, 502, 503, 504]:
                    attempt += 1
                    wait_time = backoff_factor ** attempt
                    logger.warning(
                        f"GeminiClient: Received response {response.status_code}. "
                        f"Attempt {attempt}/{retries}. Retrying in {wait_time:.2f}s..."
                    )
                    await asyncio.sleep(wait_time)
                    continue
                else:
                    logger.error(f"GeminiClient: Non-retryable HTTP error {response.status_code}: {response.text}")
                    raise httpx.HTTPStatusError(
                        f"HTTP Error {response.status_code}", 
                        request=response.request, 
                        response=response
                    )
                    
            except (httpx.RequestError, asyncio.TimeoutError) as err:
                attempt += 1
                if attempt >= retries:
                    logger.error(f"GeminiClient: Failed all retry attempts. Last error: {str(err)}")
                    raise err
                
                wait_time = backoff_factor ** attempt
                logger.warning(
                    f"GeminiClient: Request error: {str(err)}. "
                    f"Attempt {attempt}/{retries}. Retrying in {wait_time:.2f}s..."
                )
                await asyncio.sleep(wait_time)

        raise httpx.ConnectError("Failed to communicate with Gemini API after retries.")

# Global default client
gemini_client = GeminiClient()
