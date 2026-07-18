# Orixa Deployment Readiness Report
**Classification:** DEPLOYMENT MANUAL & TECHNICAL DEBT LOG  
**Release Readiness:** APPROVED FOR DEPLOYMENT (V1.0.0-RC1)  
**Date:** July 16, 2026  

---

## 1. Cloud Architecture & Target Compliance

Orixa is designed to deploy seamlessly to cloud native container runtimes. The architecture is fully compatible with standard platforms:
- **Google Cloud Run (Recommended):** Highly suited for the Express/Vite frontend and FastAPI backend containers.
- **Docker Compose:** Ideal for on-premise, virtual machine (VM), or offline-airgapped environments.
- **PaaS (Render, Railway, Fly.io):** Supported via multi-stage Docker builds.

---

## 2. Environment Pre-Flight Checklist

Before launching Orixa in production, verify that the following variables are defined within the host environment. **Do not embed these values directly in files!**

```env
# ==========================================
# Database & Cache Connection Configurations
# ==========================================
POSTGRES_SERVER=pg-instance-dns-or-ip.gcp.internal
POSTGRES_USER=orixa_secure_admin
POSTGRES_PASSWORD=your_super_complex_database_password
POSTGRES_DB=orixa_production_db
POSTGRES_PORT=5432

REDIS_HOST=redis-instance-dns-or-ip.gcp.internal
REDIS_PORT=6379
REDIS_PASSWORD=your_redis_auth_password

# ==========================================
# Security, Auth, & Credentials
# ==========================================
SECRET_KEY=generate_a_secure_random_hex_string_64_chars_long
ACCESS_TOKEN_EXPIRE_MINUTES=1440
NODE_ENV=production

# ==========================================
# AI Integrations
# ==========================================
GEMINI_API_KEY=your_google_ai_studio_gemini_api_key_secret
```

---

## 3. Deployment Flow Diagrams

### 3.1 Single-Port Ingress Routing (Cloud Run Setup)
```
       Operator Browser Traffic (Port 443 HTTPS)
                         │
                         ▼
        Google Cloud Load Balancer / Ingress Gateway
                         │
                         ▼
        Orixa Express-Vite Gateway (Port 3000)
             ├── Serves Static UI Assets (Vite Dist)
             └── Proxies APIs / Real-time Event SSE Streams
```

---

## 4. Remaining Technical Debt & prioritized V1.0 Recommendations

Prior to releasing the official Version 1.0, the SRE team recommends resolving the following items:

### 4.1 Debt Register

1. **In-Memory Approvals Storage (`api.py`):**
   - **Status:** Debt
   - **Description:** Manual operator decisions are saved in an in-memory dictionary (`approvals_db`). If the backend container restarts (common in Cloud Run on scaled-to-zero scale cycles), active approvals are wiped.
   - **Recommendation:** **High Priority.** Migrate approvals tracking to the PostgreSQL schema or persist them in Redis with TTL.

2. **Missing Token Rotation & Revocation:**
   - **Status:** Debt
   - **Description:** JWT access tokens cannot be invalidated prior to expiry.
   - **Recommendation:** **Medium Priority.** Integrate a simple Redis blocklist to store revoked tokens.

3. **External API Connection Mocking (DataHub):**
   - **Status:** Debt
   - **Description:** DataHub endpoints serve high-fidelity cached metadata to ensure offline capability.
   - **Recommendation:** **Low Priority.** Add an togglable adapter flag (`DATAHUB_LIVE_SYNC=true`) to swap between the cache adapter and live DataHub REST APIs.

---

## 5. Deployment Verification Commands

### 5.1 Docker Local Verification
```bash
# Compile and run containers locally using docker-compose
docker compose -f docker/docker-compose.yml up --build -d

# Verify health status of services
docker ps --filter "name=orixa"
```

### 5.2 Production Bundling Verification
```bash
# Clean, lint, test, and build distribution assets
npm run clean
npm run lint
npm run test
npm run build
```
These actions have been fully verified and successfully complete in **100% green state**.
