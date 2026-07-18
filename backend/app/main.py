from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException, Request, status
from fastapi.encoders import jsonable_encoder
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy.exc import IntegrityError

from backend.app.core.config import settings
from backend.app.core.logging import logger, setup_logging
from backend.app.db.redis import redis_manager
from backend.app.middleware.logging import AuditLoggingMiddleware

# Import schemas and routers placeholder references
from backend.app.schemas.user import UserOut
from backend.app.schemas.organization import OrganizationOut
from backend.app.schemas.project import ProjectOut


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup configurations
    setup_logging()
    logger.info("Initializing Orixa Operating System services...")
    
    # Initialize redis client pool
    redis_manager.connect()
    
    yield
    
    # Shutdown routines
    logger.info("De-provisioning Orixa Operating System service interfaces...")
    await redis_manager.close()


app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Enterprise Intelligence Operating System for analytical isolation & intelligence containment.",
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS Policy configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Custom Audit and Request Tracking Middleware
app.add_middleware(AuditLoggingMiddleware)


# ==========================================
# Custom Global Exception Handling Filters
# ==========================================

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """Graceful filter catching incorrect JSON client payloads"""
    logger.warning(
        f"Validation error occurred: {exc.errors()}",
        extra={"correlation_id": getattr(request.state, "correlation_id", "N/A")}
    )
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content=jsonable_encoder({"detail": exc.errors(), "message": "Invalid request payload parameters."}),
    )


@app.exception_handler(IntegrityError)
async def db_integrity_exception_handler(request: Request, exc: IntegrityError):
    """Graceful filter catching database key constraints conflicts"""
    logger.error(
        f"Database transaction violation conflict: {str(exc)}",
        extra={"correlation_id": getattr(request.state, "correlation_id", "N/A")}
    )
    return JSONResponse(
        status_code=status.HTTP_409_CONFLICT,
        content={"detail": "Resource conflict. Key index values already exist or violate relational boundaries."},
    )


@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    """Explicitly map HTTP exceptions back to clean standardized JSON structures"""
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail, "code": exc.status_code},
    )


# ==========================================
# API Version v1 Operational Gateways
# ==========================================

@app.get("/health", status_code=status.HTTP_200_OK, tags=["System Health"])
async def get_system_health():
    """Lightweight cloud load-balancer health checker heartbeat"""
    return {
        "status": "healthy",
        "engine": "Orixa OS Gateway v1",
        "timestamp": "2026-07-13T03:37:38Z",
        "services": {
            "postgres": "connected",
            "redis": "connected" if redis_manager.client else "disconnected",
        }
    }


# Scaffold Router Blocks Mock Endpoints for early development representation
from fastapi import APIRouter
from backend.app.specialists.manager import specialist_manager
from backend.app.specialists.schemas import SpecialistSchema, TaskExecutionResponse, TaskExecutionRequest

v1_router = APIRouter(prefix=settings.API_V1_STR)

from backend.app.atlas.router import router as atlas_router
v1_router.include_router(atlas_router)

from backend.app.datahub.router import router as context_router
v1_router.include_router(context_router)

from backend.app.memory.router import router as memory_router
v1_router.include_router(memory_router)

from backend.app.replay.playback_controller import router as replay_router
v1_router.include_router(replay_router)

from backend.app.atlas_console.api import router as atlas_console_router
v1_router.include_router(atlas_console_router)

from backend.app.decision_center.api import router as decision_center_router
v1_router.include_router(decision_center_router)


@v1_router.get("/specialists", response_model=list[SpecialistSchema], tags=["AI Specialists"])
async def list_ai_specialists():
    """Retrieve details and operational status of all registered AI Specialists"""
    return specialist_manager.get_all_specialists()


@v1_router.get("/specialists/status", tags=["AI Specialists"])
async def get_specialists_status_summary():
    """Retrieve quick health telemetry and current load status of the AI fleet"""
    return {
        "status": "healthy",
        "fleet_size": len(specialist_manager.get_all_specialists()),
        "health_matrix": specialist_manager.registry.get_health_status()
    }


@v1_router.get("/specialists/{name}", response_model=SpecialistSchema, tags=["AI Specialists"])
async def get_ai_specialist_by_name(name: str):
    """Retrieve a single AI Specialist profile by its matching code-name identifier"""
    spec = specialist_manager.get_specialist(name)
    if not spec:
        raise HTTPException(status_code=404, detail=f"Specialist '{name}' not found in active fleet.")
    return spec


@v1_router.post("/specialists/{name}/execute", response_model=TaskExecutionResponse, tags=["AI Specialists"])
async def execute_specialist_task(name: str, request: TaskExecutionRequest):
    """Manually dispatch a specific domain operational task to an active AI Specialist"""
    try:
        response = await specialist_manager.execute_agent_task(name, request.task, request.payload)
        return response
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to execute specialist task: {str(e)}")



@v1_router.post("/auth/login", tags=["Identity Operations"])
async def authenticate_user_credentials():
    """Secure OAuth2 bearer token exchange entrypoint"""
    return {
        "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mock_token_orixa_enterprise",
        "token_type": "bearer",
        "expires_in": settings.ACCESS_TOKEN_EXPIRE_MINUTES
    }


@v1_router.get("/organizations", tags=["Tenant Settings"])
async def list_registered_organizations():
    """Retrieve multi-tenant isolated workspaces"""
    return [
        {
            "id": "e3020613-2d2c-4934-be57-fb9279dfb107",
            "name": "Acme Aerospace",
            "domain": "acme-aero.com",
            "is_active": True,
            "created_at": "2026-01-10T12:00:00Z"
        },
        {
            "id": "7b8db3ef-844c-47bc-ad74-325db000109f",
            "name": "Cyberdyne Systems",
            "domain": "cyberdyne.io",
            "is_active": True,
            "created_at": "2026-04-15T09:12:30Z"
        }
    ]


@v1_router.get("/projects", tags=["Sandbox Investigations"])
async def list_active_projects():
    """Retrieve sandboxed analytics workspaces within organization boundaries"""
    return [
        {
            "id": "c16ba2d2-c439-4be2-9842-1698a87b8f04",
            "name": "Audit Ingress Log anomalies",
            "status": "Active",
            "org_id": "e3020613-2d2c-4934-be57-fb9279dfb107",
            "metadata_json": {"specialists": ["Sentry-X", "Anomalist"], "data_hub_synced": True},
            "created_at": "2026-07-01T08:00:00Z"
        },
        {
            "id": "f8a02bd2-89cd-4a21-9db3-efeeaa20499e",
            "name": "Predict Operational Outage risks",
            "status": "Active",
            "org_id": "e3020613-2d2c-4934-be57-fb9279dfb107",
            "metadata_json": {"specialists": ["Predictor-9"], "data_hub_synced": False},
            "created_at": "2026-07-10T14:30:00Z"
        }
    ]

app.include_router(v1_router)
