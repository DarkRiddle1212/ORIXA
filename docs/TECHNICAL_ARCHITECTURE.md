# Orixa Enterprise Intelligence OS — Technical Architecture Document
**Author:** Principal Software Architect, Orixa
**Version:** 2.0.0
**Date:** July 13, 2026

Orixa is an Enterprise Intelligence Operating System designed to understand, predict, and protect organizational operational intelligence. It shifts the enterprise paradigm away from disjointed utility scripts toward a **stateful, collaborative team of AI Specialists coordinated by an executive Supervisor**. 

This document defines Orixa's complete production-ready system architecture. It models cognitive workers as first-class architectural components, details our three primary pillars—**Organizational Memory**, the **Prediction Engine**, and **Explainability**—as core services, and structures LangGraph, Gemini, and DataHub as supporting implementation technologies.

---

## 🗺️ 1. Overall System Architecture

Orixa employs a clean, service-oriented multi-tier architecture. It strictly decouples client presentation from backend event processing, cognitive orchestrations, and underlying database resources.

```text
                               ┌────────────────────────────────┐
                               │       Client Web Console       │
                               │   (Next.js 15 App - Port 3000) │
                               └───────────────┬────────────────┘
                                               │ HTTPS / WSS (API & Telemetry)
                                               ▼
                               ┌────────────────────────────────┐
                               │      FastAPI API Gateway       │
                               │   (Python 3.12+ ASGI / Async)  │
                               └───────┬───────────────┬────────┘
                                       │               │
                     ┌─────────────────┘               └─────────────────┐
                     ▼                                                   ▼
       ┌───────────────────────────┐                       ┌───────────────────────────┐
       │     CORE SERVICES LAYER   │                       │    COGNITIVE AGENT LAYER  │
       ├───────────────────────────┤                       ├───────────────────────────┤
       │                           │                       │                           │
       │  ┌─────────────────────┐  │                       │  ┌─────────────────────┐  │
       │  │ Organizational      │  │                       │  │     Supervisor      │  │
       │  │ Memory Service      │  │                       │  │     Coordinator     │  │
       │  └──────────┬──────────┘  │                       │  └──────────┬──────────┘  │
       │             │             │                       │             │             │
       │  ┌──────────▼──────────┐  │                       │  ┌──────────▼──────────┐  │
       │  │ Prediction Engine   │  │                       │  │   AI Specialists    │  │
       │  └──────────┬──────────┘  │                       │  │  (Security, Schema, │  │
       │             │             │                       │  │   Compliance, etc)  │  │
       │  ┌──────────▼──────────┐  │                       │  └─────────────────────┘  │
       │  │ Explainability      │  │                       └─────────────┬─────────────┘
       │  │ Engine Service      │  │                                     │
       │  └─────────────────────┘  │                                     │
       └─────────────┬─────────────┘                                     │
                     │                                                   │
                     └─────────────────┐               ┌─────────────────┘
                                       │               │
                                       ▼               ▼
                               ┌────────────────────────────────┐
                               │ IMPLEMENTATION / INFRA LAYER   │
                               ├────────────────────────────────┤
                               │                                │
                               │  - PostgreSQL (asyncpg DB)     │
                               │  - Redis Enterprise (Cache)    │
                               │  - DataHub Metadata Connector  │
                               │  - LangGraph State Engine      │
                               │  - Google Gemini API (Compute) │
                               └────────────────────────────────┘
```

### System Processing Lifecycle
1. **Dynamic Ingress**: High-frequency operational telemetry, user queries, and configuration schemas hit the FastAPI Gateway via secure HTTPS endpoints and WebSocket channels.
2. **Identity & Scope Enforcement**: The Gateway intercepts requests, extracts correlation trackers (`X-Correlation-ID`), validates multi-tenant identity claims (`org_id` and role permissions), and bounds subsequent execution parameters.
3. **Core Services Enrichment**:
   * Incoming actions interface with **Organizational Memory** to extract relevant playbooks, active policies, or historical schema declarations.
   * Telemetry patterns and database actions are continuously streamed to the **Prediction Engine** to evaluate risk levels, project performance bottlenecks, or detect schema drift impacts.
4. **Cognitive Specialist Negotiation**: The executive **Supervisor Coordinator** digests the compiled context. It allocates specific sub-tasks to the corresponding **AI Specialists** (e.g., Security Specialist, Schema Specialist).
5. **Execution Proof & Commit**: The specialists analyze the problems, formulate solutions, and coordinate results back to the Supervisor. The **Explainability Engine** registers every logical step, model checkpoint, and database policy reference, packaging them into human-auditable logs before mutations are written to PostgreSQL or external catalogs.

---

## 🎨 2. Frontend Architecture (Next.js 15)

Orixa's frontend console is engineered using Next.js 15, focusing on density, visual rhythm, and state synchronization.

### Technical Stack
* **Framework**: Next.js 15 (App Router) employing React Server Components (RSC) for optimized initial payload rendering.
* **Client-Side Hydration**: TanStack React Query (`@tanstack/react-query` v5) manages declarative state synchronization, polling loops (5-second frequencies), and caching.
* **Component Primitives**: Accessible Tailwind UI modules based on Radix UI, styled with customizable off-white and charcoal palettes.
* **Micro-Animations**: Framer Motion (`motion/react`) powers spatial transitions, contextual slide-outs, and alert propagation effects.

### Console-First Layouts
To map our core services, the Next.js interface presents three specialized command views:
1. **The Specialist Command Center**: Displays the active team topology, showing the current task routing, execution statuses, and agent workloads under the Supervisor's control. Includes an interactive console to submit tasks and inspect active agent negotiations.
2. **Organizational Memory Manager**: A workspace to search, filter, and upload business policies, compliance guidelines, operational runbooks, and active metadata connections.
3. **Predictive Diagnostic & Explainability Board**: A visualization screen showing predicted schema drifts, security vectors, and confidence charts. Clicking an alert reveals the complete **Explainability Tree**—a clear, step-by-step diagnostic breakdown mapping the specialists' reasoning straight to registered documentation or system logs.

---

## ⚡ 3. Backend Architecture (FastAPI)

The FastAPI Gateway serves as Orixa's primary operating system daemon, handling routing, middleware interceptors, and background worker queues.

### Backend Routing Topology
```text
  [Client Inbound API Calls]
              │
              ▼
  ┌────────────────────────┐
  │ Correlation Middleware │ ──► Binds a unique UUID to context logger
  └──────────┬─────────────┘
             ▼
  ┌────────────────────────┐
  │ Rate Limiting & Sec    │ ──► Contacts Redis; verifies JWT org identity
  └──────────┬─────────────┘
             ▼
  ┌────────────────────────┐
  │   Domain Controllers   │ ──► Routes requests to Core Services and Specialists
  └────────────────────────┘
```

### Core Design Patterns
* **Asynchronous Execution Pattern**: Fully async endpoints utilizing `asyncpg` as the database driver, preventing event-loop bottlenecks under intensive I/O pressure.
* **Clean Dependency Injection**: Modular FastAPI dependencies parse authentication tokens, verify role permissions, and inject thread-safe database sessions.
* **RFC 7807 Standard Exceptions**: Custom exception interceptors format runtime failures into clean, machine-readable JSON payloads, preserving diagnostic integrity across clients.

---

## 👥 4. AI Specialists & Supervisor Orchestration

The core cognitive layer of Orixa is structured as a **collaborative team of domain-expert AI Specialists coordinated by an executive Supervisor**. This team is not an external utility; it is a first-class architectural component modeled directly into the system state.

```text
                        ┌──────────────────────────────┐
                        │          Supervisor          │
                        │         Coordinator          │
                        └──────────────┬───────────────┘
                                       │
                  ┌────────────────────┼────────────────────┐
                  ▼ Tasks              ▼ Tasks              ▼ Tasks
        ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
        │     Security     │  │      Schema      │  │    Compliance    │
        │    Specialist    │  │    Specialist    │  │    Specialist    │
        ├──────────────────┤  ├──────────────────┤  ├──────────────────┤
        │ - Log Telemetry  │  │ - Table Audits   │  │ - Policy Checks  │
        │ - Anomaly Triages│  │ - Schema Drift   │  │ - Classifications│
        │ - Lockdowns      │  │ - Migration Align│  │ - Audit Proofs   │
        └─────────┬────────┘  └─────────┬────────┘  └─────────┬────────┘
                  │                     │                     │
                  └────────────────────┼────────────────────┘
                                       ▼ Synthesis
                        ┌──────────────────────────────┐
                        │      Explainability &        │
                        │      Human-in-the-Loop       │
                        └──────────────────────────────┘
```

### 1. The Supervisor Coordinator
The **Supervisor** is the central command dispatcher. It intercepts system tasks, evaluates organizational priorities, delegates sub-tasks to specialists, and synthesizes findings into structured results. The Supervisor maintains the master execution state database, ensuring that long-running operations are fully resumeable and auditable.

### 2. First-Class AI Specialists
Each Specialist is a highly sandboxed, domain-isolated cognitive agent with clear authority bounds, custom tool sets, and targeted responsibilities:
1. **The Security Specialist**:
   * **Scope**: Evaluates live operational logs, network telemetry, and access footprints.
   * **Action Capabilities**: Detects privilege escalations, isolates suspicious tenant environments, and coordinates automated containment/lockdown protocols.
2. **The Schema Specialist**:
   * **Scope**: Audits physical database schema structures against desired designs and tracks active data migrations.
   * **Action Capabilities**: Performs safe structural drift diagnostics, calculates data-loss potentials, and drafts secure SQL mitigation scripts.
3. **The Compliance Specialist**:
   * **Scope**: Monitors database and data assets for compliance with corporate classification standards and regulatory requirements.
   * **Action Capabilities**: Scans tables for sensitive cleartext data (e.g., PII), verifies access logging configurations, and certifies audit trail compliance.

### 3. Specialist Coordination Protocols
* **Task Delegation**: The Supervisor translates high-level requests into specific JSON-formatted directives for the target Specialists.
* **Specialist Consultation**: Specialists do not run in isolation; they can query each other's outputs via the Supervisor (e.g., the Compliance Specialist can ask the Schema Specialist to verify structural column details before running a classification check).
* **Stateful Checkpointing**: Long-running diagnostic pipelines serialize their states into the database at every transition. This allows administrative operators to approve gated actions (such as structural migrations or tenant isolation commands) via human-in-the-loop triggers before final changes are committed.

---

## 🧠 5. Core Services Architecture

Orixa's intelligence framework is built around three core services: **Organizational Memory**, the **Prediction Engine**, and the **Explainability Engine**. These are first-class, software-defined services that govern how our cognitive Specialists think, learn, and act.

### 1. Organizational Memory Service
The Organizational Memory represents the dynamic, centralized knowledge base of the enterprise. It aggregates unstructured operational policies, technical configurations, regulatory rules, and historical incident logs into a unified, high-performance semantic index.

* **Dynamic Ingestion**: Ingests new schemas, compliance frameworks, or security runbooks via the API.
* **Contextual Retrieval**: Specialists query this service to ground their actions in active organizational context (e.g., retrieving the custom enterprise password policy before evaluating an access audit).
* **Continuous Updates**: When an investigation is resolved or a migration is approved, the Supervisor catalogs the post-mortem analysis and resolution steps back into Organizational Memory, allowing the team to adapt to new patterns.

### 2. Prediction Engine Service
The Prediction Engine shifts Orixa from a reactive diagnostic utility to a proactive system, analyzing live telemetry patterns and database mutations to forecast future operational risks.

* **Schema Drift Impact Analysis**: Evaluates proposed or detected database alterations to predict downstream application breakages, performance overheads, or compliance violations.
* **Capacity & Bottleneck Projections**: Analyzes resource usage and active task queues to project system saturation thresholds and operational bottlenecks.
* **Vulnerability Forecasting**: Identifies potential security configurations or access trends that could lead to privilege escalation vectors before they are exploited.

### 3. Explainability Engine Service
Explainability is a core security requirement. Every recommendation, classification, or action generated by the AI Specialists must be backed by a clear, step-by-step audit proof.

* **Cognitive Trace Mapping**: Records the precise logical steps taken by the Supervisor and Specialists during a task.
* **Grounding Attribution**: Maps every decision back to specific source material within the Organizational Memory (e.g., attributing a compliance warning to Section 4.2 of the Corporate Privacy Policy).
* **Human-Scannable Rationales**: Formats raw agent checkpoints into intuitive, step-by-step diagnostic trees, making it easy for human operators to quickly understand and verify complex decisions.

---

## 🛠️ 6. Implementation Technologies (The Execution Layer)

Rather than serving as the center of the architecture, tools like **LangGraph**, **Gemini**, and **DataHub** are treated strictly as supporting execution technologies that power our core services and specialist teams.

```text
  ┌────────────────────────────────────────────────────────────────────────┐
  │                            ORIXA OS CORE                               │
  │     (Supervisor, Specialists, Memory, Predictions, Explainability)      │
  └───────────────────────────────────┬────────────────────────────────────┘
                                      │
                                      ▼ Interfaces With
  ┌────────────────────────────────────────────────────────────────────────┐
  │                    IMPLEMENTATION TECHNOLOGIES                         │
  ├───────────────────────┬────────────────────────┬───────────────────────┤
  │    LangGraph SDK      │    Google Gemini API   │  DataHub Metadata API │
  ├───────────────────────┼────────────────────────┼───────────────────────┤
  │ Stateful workflow     │ High-reasoning compute │ Ingresses enterprise  │
  │ checkpoints and       │ engine powering        │ metadata catalog      │
  │ agent state-graphs.   │ cognitive tasks.       │ definitions.          │
  └───────────────────────┴────────────────────────┴───────────────────────┘
```

* **State Graph Library (LangGraph)**: Serves as our state-machine execution tool. It provides the framework for modeling specialist coordination loops, handling checkpoints, and structuring human-in-the-loop approval gates.
* **Cognitive Compute Engine (Google Gemini)**: Acts as our primary processor. The backend communicates server-side using the `google-genai` (Python) and `@google/genai` (Node) SDKs. 
  * `gemini-2.5-flash`: Used for high-throughput, low-latency tasks like real-time telemetry analysis and log parsing.
  * `gemini-2.5-pro`: Utilized for complex structural diagnostics, risk predictions, and explainability mapping.
* **Enterprise Catalog Connector (DataHub)**: Acts as a bridge to corporate metadata resources. The memory service queries DataHub to ingest database schemas, catalog configurations, and business glossaries, feeding them directly into our active Organizational Memory.

---

## 🗄️ 7. Database Schema Design (PostgreSQL)

Orixa's database schema maps organizations, user identities, specialist team states, and predictive diagnostics into a highly insulated relational database structure.

```text
  ┌───────────────────────┐              ┌───────────────────────┐
  │     organizations     │              │         users         │
  ├───────────────────────┤              ├───────────────────────┤
  │ id: UUID (PK)         │              │ id: UUID (PK)         │
  │ name: VARCHAR(100)    │ 1-to-Many    │ email: VARCHAR(255)   │
  │ domain: VARCHAR(100)  ├─────────────►│ hashed_password: STR  │
  │ is_active: BOOLEAN    │              │ role: VARCHAR(20)     │
  │ created_at: TIMESTAMP │              │ org_id: UUID (FK)     │
  └──────────┬────────────┘              │ created_at: TIMESTAMP │
             │                           └───────────────────────┘
             │ 1-to-Many
             ├───────────────────────────┐
             │                           │
             ▼ 1-to-Many                 ▼ 1-to-Many
  ┌───────────────────────┐              ┌───────────────────────┐
  │       projects        │              │   knowledge_entries   │
  ├───────────────────────┤              ├───────────────────────┤
  │ id: UUID (PK)         │              │ id: UUID (PK)         │
  │ name: VARCHAR(100)    │              │ org_id: UUID (FK)     │
  │ org_id: UUID (FK)     │              │ title: VARCHAR(255)   │
  │ status: VARCHAR(20)   │              │ category: VARCHAR(50) │
  │ metadata: JSONB       │              │ content: TEXT         │
  │ created_at: TIMESTAMP │              │ source_uri: TEXT      │
  └──────────┬────────────┘              │ created_at: TIMESTAMP │
             │                           └───────────────────────┘
             │ 1-to-Many
             ├───────────────────────────┐
             │                           │
             ▼ 1-to-Many                 ▼ 1-to-Many
  ┌───────────────────────┐              ┌───────────────────────┐
  │     investigations    │              │      predictions      │
  ├───────────────────────┤              ├───────────────────────┤
  │ id: UUID (PK)         │              │ id: UUID (PK)         │
  │ project_id: UUID (FK) │              │ project_id: UUID (FK) │
  │ title: VARCHAR(255)   │              │ target_type: VARCHAR  │
  │ status: VARCHAR(20)   │              │ risk_score: DECIMAL   │
  │ severity: VARCHAR(10) │              │ details: JSONB        │
  │ incident_data: JSONB  │              │ is_mitigated: BOOLEAN │
  │ created_at: TIMESTAMP │              │ created_at: TIMESTAMP │
  └───────────────────────┘              └───────────────────────┘
```

### Core Table Specifications

#### 1. Table: `organizations` (Tenant Boundaries)
* `id` (UUID, Primary Key): Unique tenant identifier.
* `name` (VARCHAR(100), Not Null): Full enterprise name.
* `domain` (VARCHAR(100), Unique, Not Null): Canonical organizational email domain.
* `is_active` (BOOLEAN, Default True): Controls platform access for the tenant.
* `created_at` (TIMESTAMP WITH TIME ZONE, Default now()): Entry timestamp.

#### 2. Table: `users` (Identity)
* `id` (UUID, Primary Key): User identity.
* `email` (VARCHAR(255), Unique, Not Null): Login identity.
* `hashed_password` (VARCHAR(255), Not Null): Secure password hash.
* `role` (VARCHAR(20), Not Null): User permissions role (`Admin`, `Analyst`, `Viewer`).
* `org_id` (UUID, Foreign Key referencing `organizations.id` ON DELETE CASCADE): Tenant association.
* `created_at` (TIMESTAMP WITH TIME ZONE, Default now()): Creation date.

#### 3. Table: `projects` (Sandboxed Workspaces)
* `id` (UUID, Primary Key): Unique workspace project identifier.
* `name` (VARCHAR(100), Not Null): Human-readable workspace name.
* `org_id` (UUID, Foreign Key referencing `organizations.id` ON DELETE CASCADE): Tenant boundary.
* `status` (VARCHAR(20), Not Null): Current status (`active`, `locked`, `suspended`).
* `metadata` (JSONB, Not Null, Default '{}'): Project settings and catalog sync configurations.
* `created_at` (TIMESTAMP WITH TIME ZONE, Default now()): Registration date.

#### 4. Table: `knowledge_entries` (Organizational Memory)
* `id` (UUID, Primary Key): Knowledge record identifier.
* `org_id` (UUID, Foreign Key referencing `organizations.id` ON DELETE CASCADE): Tenant domain.
* `title` (VARCHAR(255), Not Null): Descriptive title of the knowledge artifact.
* `category` (VARCHAR(50), Not Null): Type of knowledge (`policy`, `runbook`, `schema_definition`, `historical_incident`).
* `content` (TEXT, Not Null): The raw text or policy definition content.
* `source_uri` (TEXT, Nullable): Reference link to source system (e.g., DataHub asset URL, Confluence link).
* `created_at` (TIMESTAMP WITH TIME ZONE, Default now()): Ingestion date.

#### 5. Table: `predictions` (Proactive Diagnostic Alerts)
* `id` (UUID, Primary Key): Predictive alert identifier.
* `project_id` (UUID, Foreign Key referencing `projects.id` ON DELETE CASCADE): Target workspace.
* `target_type` (VARCHAR(50), Not Null): Risk classification (`schema_drift`, `compliance_failure`, `resource_bottleneck`).
* `risk_score` (DECIMAL(5, 2), Not Null): Calculated probability value (0.00 to 100.00).
* `details` (JSONB, Not Null, Default '{}'): Predicted impact analysis, confidence parameters, and recommended mitigations.
* `is_mitigated` (BOOLEAN, Default False): Resolution status.
* `created_at` (TIMESTAMP WITH TIME ZONE, Default now()): Prediction timestamp.

#### 6. Table: `investigations` (Explainability Case Logs)
* `id` (UUID, Primary Key): Investigation record identifier.
* `project_id` (UUID, Foreign Key referencing `projects.id` ON DELETE CASCADE): Target workspace.
* `title` (VARCHAR(255), Not Null): Incident description.
* `status` (VARCHAR(20), Not Null): Current status (`open`, `investigating`, `contained`, `resolved`).
* `severity` (VARCHAR(10), Not Null): Risk categorization (`low`, `medium`, `high`, `critical`).
* `incident_data` (JSONB, Not Null, Default '{}'): Holds the **Explainability cognitive traces**, specialist conversation steps, and mitigation history.
* `created_at` (TIMESTAMP WITH TIME ZONE, Default now()): Case initiation timestamp.

#### 7. Table: `agent_states` (Orchestration Checkpoints)
* `id` (UUID, Primary Key): Execution state identifier.
* `org_id` (UUID, Foreign Key referencing `organizations.id` ON DELETE CASCADE): Tenant context.
* `task_id` (UUID, Not Null, Unique): Association with API Gateway transaction tracking.
* `supervisor_state` (VARCHAR(20), Not Null): Current state of Supervisor coordinator.
* `active_specialists` (JSONB, Not Null, Default '[]'): List of specialists engaged.
* `checkpoint_data` (JSONB, Not Null, Default '{}'): Complete serialized state parameters for resumeability.
* `updated_at` (TIMESTAMP WITH TIME ZONE, Default now()): Last state update.

---

## 🔑 8. Authentication and Authorization Strategy

Orixa enforces robust multi-tenant authentication protocols using stateless JWT mechanisms paired with secure cookies.

* **Dual-Token Handshake**:
  * **Access Token**: Short-lived JWT (15-minute validity) passed via the authorization header, containing user identity (`sub`), role assignments, and tenant boundaries (`org_id`).
  * **Refresh Token**: Long-lived token (7-day validity) stored as an `HttpOnly`, `Secure`, `SameSite=Strict` cookie, tracked in Redis to support immediate session revocation.
* **Contextual Tenant Routing**: The backend extracts the verified `org_id` from the JWT claims, injecting it into every database and memory query context. This guarantees complete multi-tenant insulation at the database level.
* **System Lockdown Drills**: Operators can quickly trigger a global tenant lockdown. This immediately updates the target organization's `is_active` parameter in PostgreSQL, invalidates all active session keys inside Redis, and halts active Supervisor orchestration loops.

---

## 📂 9. Core Repository Directory Structure

The repository directory layout is organized as a clean enterprise monorepo, cleanly mapping the frontend console, backend gateway, core services, and specialist models.

```text
/orixa-monorepo
├── .env.example                     # Reference environment variables
├── .gitignore                       # System exclusions
├── AGENTS.md                        # Permanent design and coding guidelines
├── index.html                       # Base Vite anchor template
├── metadata.json                    # Application configurations and permissions
├── package.json                     # Monorepo workspaces and script engines
├── tsconfig.json                    # Base typescript configuration
├── vite.config.ts                   # Local development proxy rules
├── /docs                            # Technical documentation directory
│   ├── ARCHITECTURE.md              # High-level architecture summary
│   ├── DATABASE.md                  # Conceptual entity descriptions
│   └── TECHNICAL_ARCHITECTURE.md    # This master specification
├── /frontend                        # Next.js 15 Web Console
│   ├── package.json                 # FE library requirements
│   ├── tsconfig.json                # TS compiler rules for Next.js
│   └── /app
│       ├── globals.css              # Global styles importing Tailwind utilities
│       ├── layout.tsx               # Root app layout
│       ├── page.tsx                 # Command console dashboard
│       ├── /components              # React Presentation Components
│       │   ├── specialist-panel.tsx # Agent team interaction dashboard
│       │   ├── memory-manager.tsx   # Knowledge base search and ingest interface
│       │   ├── prediction-alert.tsx # Predictive diagnostic graphs
│       │   └── explainability-tree.tsx# Interactive diagnostic step view
│       └── /lib                     # FE internal state and tools
│           ├── api-client.ts        # Modular HTTP/WS fetch helper
│           └── console-context.tsx  # Dynamic UI selection context
├── /backend                         # FastAPI Python Gateway
│   ├── requirements.txt             # Python packages
│   ├── server.ts                    # Root development proxy
│   └── /app
│       ├── main.py                  # API Gateway entry point
│       ├── /core                    # Gate setups
│       │   ├── config.py            # Pydantic environment configuration definitions
│       │   ├── security.py          # Cryptography and session validations
│       │   └── logging.py           # Structured JSON formatter configurations
│       ├── /models                  # PostgreSQL SQLAlchemy Entities
│       │   ├── base.py              # Base declaration file
│       │   ├── organization.py      # Table organizations model
│       │   ├── user.py              # Table user accounts model
│       │   ├── knowledge.py         # Table knowledge base model
│       │   ├── prediction.py        # Table proactive predictions model
│       │   └── investigation.py     # Table diagnostic cases model
│       ├── /schemas                 # Pydantic schemas for verification
│       │   ├── auth.py              # Session and token verification
│       │   ├── memory.py            # Ingestion payload schemas
│       │   ├── prediction.py        # Prediction diagnostic schemas
│       │   └── supervisor.py        # Supervisor task payloads
│       ├── /services                # CORE SERVICES
│       │   ├── memory.py            # Organizational Memory manager
│       │   ├── prediction.py        # Predictive analysis routines
│       │   └── explainability.py    # Log trace parsing algorithms
│       ├── /specialists             # COGNITIVE SPECIALISTS (Agent Code)
│       │   ├── supervisor.py        # Supervisor coordination controller
│       │   ├── security.py          # Security specialist logic
│       │   ├── schema.py            # Schema specialist logic
│       │   └── compliance.py        # Compliance specialist logic
│       ├── /middleware              # HTTP interceptor plugins
│       │   ├── correlation.py       # Interceptor assigning request tracing IDs
│       │   └── audit.py             # Interceptor formatting secure JSON audit trails
│       └── /api                     # Versioned endpoint routers
│           ├── deps.py              # Common DB and auth dependencies
│           └── /v1
│               ├── auth.py          # Session and JWT routes
│               ├── supervisor.py    # Task dispatches to Supervisor
│               ├── memory.py        # Ingest and query memory routes
│               └── predictions.py   # Retrieve proactive risk metrics
├── /docker                          # Container orchestrations
│   ├── docker-compose.yml           # Dev environment orchestration blueprint
│   ├── backend.Dockerfile           # FastAPI runtime image
│   └── frontend.Dockerfile          # Next.js builder image
└── /scripts                         # DevOps scripts
    ├── seed_db.py                   # Relational seed data script
    └── run_migrations.sh            # Migration runner script
```

---

## 🌐 10. API Design & Versioning

Orixa's API is fully versioned under the `/api/v1` prefix. Payload data transfers strictly utilize JSON standards.

### Core Endpoints

#### 1. POST `/api/v1/supervisor/dispatch`
* **Purpose**: Dispatches a new problem-solving task to the executive Supervisor.
* **Request Payload**:
  ```json
  {
    "project_id": "c1a234bd-78ef-90ab-12cd-3456789abcde",
    "prompt": "Inspect sandbox environment for structural schema differences relative to standard policies.",
    "override_gating": false
  }
  ```
* **Response (202 Accepted)**:
  ```json
  {
    "task_id": "9abcde12-34f5-67ab-89cd-0123456789ab",
    "status": "processing",
    "allocated_specialists": ["SchemaSpecialist", "ComplianceSpecialist"],
    "correlation_id": "f8a123bc-db89-4fef-8ab9-0123456789ab"
  }
  ```

#### 2. GET `/api/v1/explainability/tasks/{task_id}`
* **Purpose**: Retrieves the detailed explanation trace of a completed or active Supervisor operation.
* **Response (200 OK)**:
  ```json
  {
    "task_id": "9abcde12-34f5-67ab-89cd-0123456789ab",
    "status": "completed",
    "cognitive_trace": [
      {
        "step": 1,
        "agent": "Supervisor",
        "action": "Ingested query and fetched project configuration rules.",
        "timestamp": "2026-07-13T03:55:00Z"
      },
      {
        "step": 2,
        "agent": "SchemaSpecialist",
        "action": "Audited physical table states; discovered mutation in 'users' table.",
        "evidence_sources": [
          "database_metadata_users_v1",
          "DataHub_catalog_assets_3920"
        ],
        "timestamp": "2026-07-13T03:55:02Z"
      },
      {
        "step": 3,
        "agent": "ComplianceSpecialist",
        "action": "Evaluated mutation against Corporate Privacy Rule Section 4.2; flagged unencrypted phone data.",
        "evidence_sources": [
          "corporate_privacy_policy_v2_section_4"
        ],
        "timestamp": "2026-07-13T03:55:05Z"
      }
    ],
    "final_determination": "Lockdown recommended. Database schema drift detected with compliance breach."
  }
  ```

#### 3. POST `/api/v1/memory/ingest`
* **Purpose**: Feeds a new corporate directive or documentation resource into Organizational Memory.
* **Request Payload**:
  ```json
  {
    "title": "Corporate Database Security Guideline",
    "category": "policy",
    "content": "All structural tables carrying user credentials must encrypt telephone fields before committing database mutations.",
    "source_uri": "https://confluence.orixa.io/sec-guideline-v4"
  }
  ```
* **Response (201 Created)**:
  ```json
  {
    "entry_id": "d0a987bc-43ef-12ab-56cd-0123456789ab",
    "status": "ingested",
    "processed_length": 115,
    "timestamp": "2026-07-13T03:56:10Z"
  }
  ```

#### 4. GET `/api/v1/predictions/active`
* **Purpose**: Retrieves all active proactive risk forecasts generated by the Prediction Engine for a project.
* **Response (200 OK)**:
  ```json
  {
    "predictions": [
      {
        "id": "e9876543-21ab-cd34-ef56-0123456789ab",
        "project_id": "c1a234bd-78ef-90ab-12cd-3456789abcde",
        "target_type": "compliance_failure",
        "risk_score": 84.50,
        "details": {
          "vulnerable_point": "Table 'users' column 'phone_raw'",
          "anticipated_consequence": "Database schema fails corporate encryption classification audit",
          "mitigation_steps": "Apply migration schema v2 to encrypt raw strings"
        },
        "is_mitigated": false,
        "created_at": "2026-07-13T03:57:00Z"
      }
    ]
  }
  ```

---

## 🚀 11. Deployment Strategy

Orixa uses a fully automated containerized deployment flow targeting **Google Cloud Run** to combine serverless elasticity with enterprise-grade security.

* **Production CI/CD Engine**: Commits to the `main` branch trigger automated workflows that run code checkers (`eslint`, `ruff`), execute tests (`pytest`), and compile secure production Docker images.
* **Google Artifact Registry**: Compiled images are version-tagged and pushed to our secure Google Cloud Registry.
* **Serverless Scale Management (Cloud Run)**: Deploys containers with minimal active nodes (min-instances: 1) in production to avoid system startup delays.
* **Structured Canary Rollouts**: Incoming production traffic is incrementally routed to new versions (10% -> 50% -> 100%) as telemetry dashboards monitor error rates.

---

## 🐳 12. Docker Architecture

Docker configurations guarantee consistency across local workstations and production servers.

* **Local Compose Networks**: The `/docker/docker-compose.yml` configures a unified sandbox network containing Next.js (`frontend`, port `3000`), FastAPI (`backend`, port `8000`), PostgreSQL (`postgres`), and Redis (`redis`).
* **Multi-Stage Production Builds**:
  * **Frontend Dockerfile**: Standard alpine Node image that compiles Next.js static builds, purging development dependencies before exporting a minimal runtime package.
  * **Backend Dockerfile**: Standard Python alpine template that compiles library wheels and mounts codebases under a secure, unprivileged system user (`orixa_app`) to prevent host escalations.

---

## 🔒 13. Security Considerations

Securing Orixa involves zero-trust principles applied across every operational layer.

* **Multi-Tenant Row-Level Security**: The PostgreSQL connector forces the session context to filter by `org_id` on every query, ensuring complete isolation.
* **Secrets Separation**: Raw database passwords and model API credentials are never committed to the repository. They are retrieved at container launch from secure, audited key storage engines (Google Cloud Secret Manager).
* **Cryptographic Lockdown Controls**: Security administrators can immediately trigger a lockdown command. This flag invalidates tenant session states in Redis, halts active Supervisor workflows, and blocks subsequent transactions for the target workspace until an administrator override is verified.

---

## 📈 14. Scalability and Resiliency Considerations

The platform is designed to scale horizontally to meet heavy enterprise demands.

* **Database Connection Reuse**: Uses database connection pools via `asyncpg`, integrated with PgBouncer under high concurrency loads to maximize throughput.
* **Asynchronous Queue Processors**: Time-consuming Specialist negotiations are offloaded to asynchronous background workers (Arq or Celery backed by Redis), preventing API Gateway thread starvation.
* **Distributed Redis Caching**: Active workspace definitions, system configurations, and predictive assessments are cached in Redis with strict time-to-live parameters (TTL), minimizing direct read pressure on PostgreSQL.

---

## 📅 15. Recommended Development Phases

Development progresses through four iterative delivery phases to ensure systematic verification of all architectural components.

```text
  ┌─────────────────────────────────────────────────────────────┐
  │  Phase 1: Foundations & Core Identity                       │
  │  - PostgreSQL schemas, base tables, multi-tenant boundaries │
  │  - FastAPI Gateway base and Next.js specialist console      │
  └─────────────────────────────┬───────────────────────────────┘
                                │
                                ▼
  ┌─────────────────────────────────────────────────────────────┐
  │  Phase 2: Core Services (Memory & Predictions)              │
  │  - Implement Organizational Memory active ingestion         │
  │  - Develop the Prediction Engine for resource risk tracking │
  └─────────────────────────────┬───────────────────────────────┘
                                │
                                ▼
  ┌─────────────────────────────────────────────────────────────┐
  │  Phase 3: Cognitive Specialists & Supervisor Orchestration │
  │  - Deploy Supervisor dispatcher and Specialist teams        │
  │  - Integrate stateful checkpoints and gating workflows       │
  └─────────────────────────────┬───────────────────────────────┘
                                │
                                ▼
  ┌─────────────────────────────────────────────────────────────┐
  │  Phase 4: Explainability, Hardening & Cloud Deploy          │
  │  - Implement Explainability cognitive trace mapping         │
  │  - Hardening lockdown controls; deploy to Cloud Run         │
  └─────────────────────────────────────────────────────────────┘
```

---

This technical architecture document is established and approved as the core engineering blueprint governing Orixa's structural development. All code modifications must adhere strictly to these principles.
