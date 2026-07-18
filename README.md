# Orixa — Enterprise Intelligence Operating System

> **"Context → Intelligence → Explainability → Trust"**

[![License: Apache 2.0](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![Python](https://img.shields.io/badge/Python-3.12+-blue.svg?logo=python&logoColor=white)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-Framework-009688.svg?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-18-blue.svg?logo=react&logoColor=white)](https://react.dev/)
[![Gemini](https://img.shields.io/badge/Google_Gemini-Cognitive_Compute-4285F4.svg?logo=google&logoColor=white)](https://deepmind.google/technologies/gemini/)
[![LangGraph](https://img.shields.io/badge/Orchestration-LangGraph-orange.svg)](https://github.com/langchain-ai/langgraph)
[![DataHub](https://img.shields.io/badge/Metadata-DataHub-indigo.svg)](https://datahubproject.io/)
[![Docker](https://img.shields.io/badge/Docker-Containerized-2496ED.svg?logo=docker&logoColor=white)](https://www.docker.com/)

---

## 1. Vision & Core Philosophy

Orixa is an Enterprise Intelligence Operating System that transforms corporate metadata catalog schemas into structured, autonomous, and human-aligned intelligence. 

Rather than treating AI as a black-box chat interface, Orixa builds an operational framework around the principle of **Zero-Trust Explainable Intelligence**. It grounds autonomous specialist agents in **DataHub metadata graphs**, coordinates their tasks through an executive SRE supervisor, traces incident lineages chronologically, and holds all final database mutations behind a strict human consensus approval gate.

### The Core Pillars:
- **Context:** Connect directly to DataHub catalog endpoints to query schemas, active ownership structures, and end-to-end data lineages.
- **Intelligence:** Dispatch the Atlas Supervisor to coordinate up to 8 specialized autonomous agents (such as Forge, Oracle, Guardian, Sentinel).
- **Explainability:** Compile clear diagnostic logs, risk ratings, regression scores, and code diff overlays.
- **Trust:** Require physical cryptographic operator authorization (Human-in-the-Loop) before executing structural modifications.

---

## 2. Platform Architecture

Orixa enforces a high-performance Decoupled Dual-Backend Coexistence model to optimize scalability, development safety, and cloud-native container ingress profiles:

```
                          ┌──────────────────────────┐
                          │  Operator Browser (UI)   │
                          └─────────────┬────────────┘
                                        │ (HTTP, REST, Live SSE)
                                        ▼
                          ┌──────────────────────────┐
                          │   Port 3000 Ingress      │
                          │   Express Web Server     │
                          └──────┬────────────┬──────┘
                                 │            │
             (Static UI Assets)  ▼            ▼  (APIs & Orchestration)
                       ┌──────────┐          ┌──────────────────────┐
                       │ Vite     │          │ FastAPI Backend      │
                       │ Dist/    │          │ (Python 3.12+)       │
                       └──────────┘          └──────────┬───────────┘
                                                        │
                              ┌─────────────────────────┼─────────────────────────┐
                              │                         │                         │
                              ▼                         ▼                         ▼
                    ┌──────────────────┐      ┌──────────────────┐      ┌──────────────────┐
                    │ PostgreSQL       │      │ Redis Cache      │      │ DataHub REST     │
                    │ Relational Store │      │ Rate Limiter / TTL│     │ Metadata Engine  │
                    └──────────────────┘      └──────────────────┘      └──────────────────┘
```

- **Express-Vite Operational Gateway (Port 3000):** Acts as the primary ingress node. It serves compiled static web assets, hosts volatile mock database layers for rapid prototyping, and establishes persistent Server-Sent Events (SSE) channels to push real-time SRE logs to the dashboard.
- **FastAPI Analytical Server (/backend/):** Handles database mutations (SQLAlchemy 2.0 with PostgreSQL), Redis token-bucket rate limiters, organizational memory vector storage, and multi-agent LangGraph orchestration loops.
- **DataHub Sync Client:** Connects to standard corporate catalog servers to ingest data tables, dataset tags, CCPA classifications, ownerships, and schemas.
- **Gemini Cognitive Layer:** Translates raw unstructured inputs and technical exception traces into targeted, reliable, and backward-compatible code patches using Google Gemini models.

---

## 3. Core Features & Capabilities

- **Atlas Operations Console:** Monitor active system incidents and dispatch multi-agent supervisor loops with real-time logs streaming.
- **Enterprise Topology Map:** High-contrast interactive SVG node graph representing real-time coordinator-to-specialist communications, data payload sizes, and action states.
- **Decision DNA Center:** Human-in-the-loop audit registry detailing recommended code remediations (SQL DDL and Kubernetes config YAML patches) with granular operator sign-off controls.
- **Organizational Memory index:** Query historic incident logs and resolution parameters via cosine-similarity vector matching.
- **Drift Prediction Engine:** Analyze time-series metrics and forecast connection exhaustion, schema mutation risks, and regression thresholds.
- **Incident Replay Viewer:** A granular time-series playback engine allowing SRE operators to step forward, pause, and review past incidents.
- **Product Landing & Architecture Pages:** Built-in professional showcase screens detailing capabilities and structural specifications.

---

## 4. Repository & Folder Structure

```text
/orixa-monorepo
├── .env.example                     # Environment configuration template
├── AGENTS.md                        # Permanent SRE coding instructions
├── README.md                        # This master engineering manual
├── index.html                       # local HTML root
├── tsconfig.json                    # TypeScript compiler configuration
├── vite.config.ts                   # Vite client bundle config
├── server.ts                        # Express-Vite Port 3000 Ingress server
├── metadata.json                    # App manifest and frame permissions
├── package.json                     # Monorepo scripts and frontend dependencies
├── /docs                            # System architectures and reports
│   ├── ARCHITECTURE.md              # High-level service design
│   ├── TECHNICAL_ARCHITECTURE.md    # Master architecture and services documentation
│   └── /reports                     # SRE verification reports
│       ├── PRODUCTION_READINESS.md  # Production readiness and tech debt ledger
│       ├── SECURITY_AUDIT_REPORT.md # Vulnerability registers and mitigation matrices
│       ├── PERFORMANCE_BENCHMARK.md # Latency benchmarks and rendering cycle profiles
│       └── TESTING_COVERAGE.md      # Testing coverage and mocking summary
├── /backend                         # FastAPI Python Analytics Backend
│   ├── main.py                      # Application gateway entry point
│   ├── requirements.txt             # Backend python packages
│   ├── /app                         # Backend core directories
│   │   ├── main.py                  # API router routing configuration
│   │   ├── /core                    # Configuration profiles, secrets, and CORS
│   │   ├── /models                  # SQLAlchemy relational definitions
│   │   ├── /services                # Caches, memory managers, and Gemini APIs
│   │   ├── /schemas                 # Pydantic schemas and serialization bounds
│   │   └── /specialists             # Cognitive agent scripts and tools
│   └── /tests                       # Backend automated test suites (Pytest)
├── /src                             # React Frontend Workspace
│   ├── App.tsx                      # Primary UI router
│   ├── index.css                    # Tailwind CSS import point
│   ├── main.tsx                     # Vite mount point
│   ├── /components                  # Modular React visual consoles
│   │   ├── LandingPage.tsx          # Professional Orixa product showcase
│   │   ├── ArchitecturePage.tsx     # Interactive visual architecture diagram
│   │   ├── ExecutiveDashboard.tsx   # SRE executive telemetry interface
│   │   ├── AtlasOperationsConsole.tsx # Supervisor monitoring screen
│   │   ├── EnterpriseIntelligenceMap.tsx # SVG vector agent topology map
│   │   ├── DecisionCenter.tsx       # Human-in-the-loop consensus panel
│   │   ├── IncidentReplay.tsx       # Frame-by-frame temporal incident logs player
│   │   └── OrganizationalMemory.tsx # Query vector index of past resolutions
│   └── /tests                       # Frontend automated test suites (Vitest)
└── /docker                          # Production container configuration files
    └── docker-compose.yml           # Unified multi-container developer sandbox
```

---

## 5. Local Quickstart Installation

Orixa is configured to run flawlessly using Docker to guarantee identical local and cloud-native runtime environments.

### Prerequisite Checklist
- [Docker Engine v24.x+](https://docs.docker.com/engine/install/)
- [Docker Compose v2.x+](https://docs.docker.com/compose/install/)
- [Node.js v18.x+](https://nodejs.org/) (for running local scripts)
- [Google AI Studio Gemini API Key](https://aistudio.google.com/)

### 1. Clone the Repository & Configure Variables
```bash
git clone https://github.com/orixa-io/orixa-monorepo.git
cd orixa-monorepo
cp .env.example .env
```
Open `.env` and configure your secure credentials:
```env
# Security & JWT Token Configurations
SECRET_KEY=generate_your_secure_hex_key_here
NODE_ENV=production

# Relational Database Connection (PostgreSQL)
POSTGRES_SERVER=localhost
POSTGRES_USER=postgres
POSTGRES_PASSWORD=secure_admin_password
POSTGRES_DB=orixa_db
POSTGRES_PORT=5432

# Redis Cache Credentials
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# Gemini API Integration
GEMINI_API_KEY=your_google_ai_studio_api_key_secret
```

### 2. Boot Containers via Docker Compose
Build and launch the entire local container network (Express Ingress, FastAPI, PostgreSQL, Redis) in detached mode:
```bash
docker compose -f docker/docker-compose.yml up --build -d
```
Verify that all services are active:
```bash
docker compose -f docker/docker-compose.yml ps
```
- **Operational Web UI:** Connect to `http://localhost:3000`
- **FastAPI Gateway Documentation (Swagger):** Connect to `http://localhost:3000/api/v1/docs`

### 3. Run Relational Database Migrations
Deploy clean schema modifications into the containerized PostgreSQL database:
```bash
docker compose -f docker/docker-compose.yml exec backend alembic upgrade head
```

### 4. Seed the Metadata Catalog & Organizational Memory
Pre-populate sandboxes, lineage relations, past resolution vectors, and mock DataHub nodes:
```bash
docker compose -f docker/docker-compose.yml exec backend python scripts/seed_db.py
```

---

## 6. Testing Strategy & Execution

Orixa employs a comprehensive dual-engine automated testing pipeline. All external APIs (including Google Gemini, active DataHub REST connections, and physical databases) are mocked to ensure test isolation and sub-10 second execution loops.

### 6.1 Frontend Component Testing (Vitest)
Executes component unit tests, checking interactive panels, command palette modals, and loading states:
```bash
# Execute Vitest suite locally
npm run test
```
- **`CommandPalette.test.tsx`:** Asserts that `Ctrl+K` correctly triggers the operational overlay and that filtering limits choices.
- **`DecisionCenter.test.tsx`:** Verifies skeleton loaders appear during processing and that operator decisions render on successful submissions.

### 6.2 Backend Endpoint Testing (Pytest)
Runs analytical tests verifying security, role-based clearances, rate limiting, and memory lookups:
```bash
# Execute Pytest suite inside python backend
cd backend
poetry run pytest -v
```
- **`test_main.py`:** Checks liveness heartbeat payloads and organization metadata.
- **`test_decision_center.py`:** Asserts role clearances on action approvals.
- **`test_replay.py`:** Validates frame-by-frame replay queries.
- **`test_atlas.py`:** Audits supervisor planning logic.

---

## 7. Cloud-Native Production Deployment

Orixa is prepared for deployment to enterprise container runtimes, with **Google Cloud Run** serving as the recommended deployment environment.

### Deployment Flow Diagram
```
       Browser Operator Traffic (Port 443 HTTPS)
                         │
                         ▼
        Google Cloud Load Balancer / Ingress Gateway
                         │
                         ▼
        Orixa Express Ingress Gateway (Port 3000)
             ├── Serves Built Static Frontend (dist/)
             └── Proxies API / Real-time SSE Streams to FastAPI
```

### Deployment Commands (GCP Cloud Run)
```bash
# Build the unified container
gcloud builds submit --tag gcr.io/your-project/orixa-gateway:v1.0.0

# Deploy the gateway container to Cloud Run
gcloud run deploy orixa-console \
  --image gcr.io/your-project/orixa-gateway:v1.0.0 \
  --platform managed \
  --port 3000 \
  --set-env-vars="SECRET_KEY=your_secure_secret,NODE_ENV=production" \
  --set-secrets="GEMINI_API_KEY=GEMINI_API_KEY:latest" \
  --allow-unauthenticated
```

---

## 8. Roadmap & Future Work

Orixa's development is structured across distinct engineering iterations as we prepare for official Enterprise distribution:

- **v1.0.0 (Current Release Candidate):** Complete decoupling of ingress routes, full-scale landing experience, visual architecture explorer, volatile SSE logging streams, and Pytest/Vitest integration.
- **v1.1.0:** Migrate operator approvals out of in-memory maps into durable, transactional PostgreSQL rows.
- **v1.2.0:** Integrate live multi-tenant JWT blocklists inside Redis.
- **v1.3.0:** Support physical, bi-directional live catalog synchronization with live corporate Apache Kafka/DataHub metadata pipelines.

---

## 9. Frequently Asked Questions (FAQ)

#### Q: How does Orixa prevent AI Hallucinations during incident resolution?
Orixa uses **DataHub** as an absolute grounding boundary. Agents cannot assume table names or types; they are forced to query the physical catalog. Furthermore, all synthesized code modifications must be reviewed and approved by a human operator before execution.

#### Q: Why is there a Node.js Express server alongside a FastAPI Python backend?
The dual-backend model combines the best of both environments. The Node.js Express server is a lightweight ingress gateway that serves static React UI files and pushes real-time Server-Sent Events (SSE). The Python FastAPI backend runs CPU-heavy multi-agent reasoning graphs and manages relational data.

#### Q: What happens if the Live SSE Stream drops out?
The Orixa frontend handles reconnections with exponential backoff. If the server becomes offline, the console safely falls back to standard HTTP polling, maintaining dashboard uptime.

#### Q: Can Orixa run in offline air-gapped environments?
Yes. By deploying Orixa using the standard Docker Compose architecture and configuring the local catalog sync client with cached, offline enterprise schemas, Orixa can operate perfectly within isolated VPCs.

---

## 📄 License

Licensed under the **Apache License 2.0**. See the [LICENSE](LICENSE) file for more information.
