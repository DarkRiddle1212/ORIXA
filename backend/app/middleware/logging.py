import time
import uuid
from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware
from backend.app.core.logging import logger


class AuditLoggingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next) -> Response:
        # Generate or extract Correlation ID
        correlation_id = request.headers.get("X-Correlation-ID") or str(uuid.uuid4())
        
        # Keep track of latency
        start_time = time.perf_counter()
        
        # Inject correlation ID into request context state
        request.state.correlation_id = correlation_id
        
        # Execute the endpoint handler
        try:
            response = await call_next(request)
        except Exception as e:
            logger.error(
                f"Exception during request handling {request.method} {request.url.path}",
                extra={
                    "correlation_id": correlation_id,
                    "method": request.method,
                    "path": request.url.path,
                    "error": str(e)
                }
            )
            raise e from None

        process_time = time.perf_counter() - start_time
        
        # Write clean, structured JSON trace logs
        logger.info(
            f"API Request processed {request.method} {request.url.path} - {response.status_code}",
            extra={
                "correlation_id": correlation_id,
                "method": request.method,
                "path": request.url.path,
                "status_code": response.status_code,
                "latency_sec": round(process_time, 4),
            }
        )
        
        # Attach the correlation tracking ID back to the client headers
        response.headers["X-Correlation-ID"] = correlation_id
        return response
