from backend.app.core.logging import logger

class TokenManager:
    """
    Manages and estimates context window boundaries, tracking token estimates 
    to prevent context exhaustion during model invocations.
    """

    @staticmethod
    def estimate_tokens(text: str) -> int:
        """
        Estimates the number of tokens in a text block.
        Uses the standard heuristic of 1 token per ~4 characters for rapid parsing.
        """
        if not text:
            return 0
        char_count = len(text)
        estimated_tokens = int(char_count / 4)
        return estimated_tokens

    @staticmethod
    def fits_context_window(text: str, limit: int = 1000000) -> bool:
        """Checks if the compiled prompt fits within Gemini's extensive context window."""
        tokens = TokenManager.estimate_tokens(text)
        logger.info(f"TokenManager: Estimated prompt size is {tokens} tokens. Limit is {limit}.")
        return tokens <= limit
