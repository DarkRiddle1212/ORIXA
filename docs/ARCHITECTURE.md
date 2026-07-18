# Orixa Enterprise Intelligence OS — Architecture Blueprint

Orixa is designed as an Enterprise Intelligence Operating System to understand, predict, and protect organizational operational intelligence. This document explains the design principles, structural directory layout, and choices driving its scalability.

---

## 📂 Repository Directory Layout

The codebase is organized as a modular, enterprise-ready Monorepo. This structure decouples the concerns of ingestion, analysis, hosting, and operations, allowing independent scaling of frontend, backend, and database infrastructure.

```text
/orixa-monorepo
├── /frontend             # Next.js 15 Web Console
│   ├── /app              # App Router Pages & Layouts
│   ├── /components       # Reusable UI & shadcn components
│   └── /lib              # React Query client, utility helpers
├── /backend              # FastAPI Python Gateway
│   ├── /app
│   │   ├── /core         # Configurations, structured logs, security
│   │   ├── /models       # SQLAlchemy PostgreSQL models (Auth/Org)
│   │   ├── /schemas      # Pydantic schemas for strict payload validation
│   │   └── /middleware   # Enterprise CORS, rate-limiting, audit-logging
│   └── /alembic          # Database migration schemas
├── /docker               # Infrastructure provisioning assets
│   ├── docker-compose.yml# Local multi-container development blueprint
│   ├── backend.Dockerfile# Optimized FastAPI multi-stage container
│   └── frontend.Dockerfile# High-efficiency Next.js builder
├── /docs                 # Architecture, engineering guidelines, ERDs
├── /examples             # CLI instructions, curl commands, and payload maps
└── /scripts              # Operations, database seed, and migrations runners
```

---

## 🏛️ Core Architectural Design Decisions

### 1. Next.js 15 (Frontend Console)
* **App Router**: Leverage server components for fast page assembly, while using client components for high-fidelity interactive monitoring panels.
* **Framer Motion**: Enables physical fluidity, providing organic feedback on actions such as state switches, detail overlays, and system alerts.
* **TanStack React Query**: Ensures declarative data fetching, background synchronization, and robust caching, preventing redundant data traffic to FastAPI endpoints.

### 2. FastAPI (Python 3.12 Gateway)
* **High Throughput**: Powered by ASGI (Uvicorn), FastAPI handles high-concurrency event streams from operational specialists.
* **Pydantic Validation**: Uses compiled Rust-backed Pydantic validation schemas to guarantee request/response contracts before reaching core controllers.
* **Strict API Versioning**: All routes are routed under `/api/v1/...` to allow blue-green upgrades of operational APIs without breaking legacy clients.

### 3. SQLAlchemy 2.0 & PostgreSQL (Database Engine)
* **Async IO**: Leverages `asyncpg` to prevent thread-blocking during heavy query operations.
* **Multi-Tenancy Foundation**: All system configuration and user accounts are structured under `Organization` tenants to ensure complete, secure workspace separation.
* **Alembic Migrations**: All schema modifications are tracked as explicit version migrations, preventing drift between environments.

### 4. Redis Enterprise Cache & Event Bus
* **Rate-Limiting**: Protects backend ingress from brute-force token requests.
* **Distributed Caching**: Stores parsed schemas and frequently accessed intelligence configs.

### 5. Logging and Auditing
* **Structured JSON Logging**: Outlets log records in JSON format in production, directly compatible with cloud collectors (e.g., Google Cloud Logging, Datadog).
* **Correlation IDs**: Middleware assigns a unique UUID to every request, linking logs, traces, and DB calls.
