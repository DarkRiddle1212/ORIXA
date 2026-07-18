# Orixa Database Architecture and Multi-Tenancy Design

Orixa employs a clean relational database model designed to support strict enterprise security, hierarchical organizations, and independent workspace scoping. This schema ensures complete separation of data boundaries and supports audits.

---

## 🗺️ Entity Relationship Diagram (ERD) Conceptual Schema

```text
  ┌───────────────────────┐
  │     Organization      │
  ├───────────────────────┤
  │ id: UUID (PK)         │
  │ name: VARCHAR(100)    │
  │ domain: VARCHAR(100)  │
  │ is_active: BOOLEAN    │
  │ created_at: DATETIME  │
  └──────────┬────────────┘
             │
             ├──────────────────────────────────────┐
             │ 1-to-many                            │ 1-to-many
             ▼                                      ▼
  ┌───────────────────────┐              ┌───────────────────────┐
  │         User          │              │        Project        │
  ├───────────────────────┤              ├───────────────────────┤
  │ id: UUID (PK)         │              │ id: UUID (PK)         │
  │ email: VARCHAR(255)   │              │ name: VARCHAR(100)    │
  │ hashed_password: STR  │              │ org_id: UUID (FK)     │
  │ role: VARCHAR(20)     │              │ status: VARCHAR(20)   │
  │ org_id: UUID (FK)     │              │ metadata: JSONB       │
  │ created_at: DATETIME  │              │ created_at: DATETIME  │
  └───────────────────────┘              └───────────────────────┘
```

---

## 🛡️ Key Components

### 1. The Multi-Tenancy Tenant (`Organization`)
The parent entity for all operational intelligence. No data (users, projects, specialized alerts) exists in Orixa without being bound to a specific `org_id`. This prevents cross-tenant data leaks.

### 2. The Identity Model (`User`)
* Users are associated with an `Organization` (via `org_id` foreign key).
* Password hashing uses `argon2` or `bcrypt` to safeguard authentication.
* Role-based access control (RBAC) is implemented via a strict `role` property (e.g., `SuperAdmin`, `OrgAdmin`, `SecurityAnalyst`, `Viewer`).

### 3. The Security Boundary (`Project`)
* Projects are sandboxed operational domains within an organization (e.g., "Mainframe Ingress Audit Q3").
* Contain specific analysis telemetry, logs, and a dynamic JSONB metadata schema to store complex AI intelligence parameters without requiring migrations.
