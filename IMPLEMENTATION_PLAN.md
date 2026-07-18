# Orixa V1.0 Implementation Action Plan

**Mission:** Transform Orixa from 15% to 100% implementation in 12 weeks  
**Status:** 🔴 CRITICAL - Multiple blockers preventing deployment  
**Started:** [To be filled]  
**Target V1.0 Release:** [Start Date + 12 weeks]  

---

## WEEK 1: DATABASE & AUTHENTICATION FOUNDATION

### Days 1-2: Database Migrations (CRITICAL BLOCKER #1)

**Owner:** Backend Team  
**Effort:** 16 hours  

```bash
# Tasks:
1. Create alembic/versions directory structure
2. Update models with proper relationships:
   - Organization.users relationship
   - Organization.projects relationship
   - User.organization relationship
   - Project.organization relationship
   - Add knowledge_entries, predictions, investigations tables

3. Generate initial migration:
   cd backend
   alembic revision --autogenerate -m "Initial schema with all tables"

4. Add performance indexes:
   - users.email (unique)
   - projects.org_id
   - knowledge_entries.org_id
   - investigations.project_id

5. Test migration cycle:
   alembic upgrade head
   alembic downgrade base
   alembic upgrade head

6. Create seed script: scripts/seed_db.py
   - 2 organizations
   - 5 users across orgs
   - 10 projects
   - 20 knowledge entries

7. Test with Docker:
   docker compose up db -d
   docker compose exec backend alembic upgrade head
   docker compose exec backend python scripts/seed_db.py
```

**Acceptance Criteria:**
- [ ] Migration runs without errors
- [ ] All tables created with proper foreign keys
- [ ] Seed data loads successfully
- [ ] Can query data across relationships
- [ ] Downgrade/upgrade cycle works

---

### Days 3-5: Authentication System (CRITICAL BLOCKER #2)

**Owner:** Backend Team  
**Effort:** 24 hours  

**Files to Create:**

1. `backend/app/core/security.py`
```python
# JWT generation/validation
# Password hashing with bcrypt
# Token validation functions
```

2. `backend/app/api/v1/endpoints/auth.py`
```python
# POST /auth/register
# POST /auth/login
# POST /auth/refresh
# POST /auth/logout
# GET /auth/me
```

3. `backend/app/core/deps.py`
```python
# get_current_user dependency
# get_current_active_user dependency
# require_role decorator
```

4. `backend/app/schemas/auth.py`
```python
# LoginRequest, LoginResponse
# RegisterRequest, RegisterResponse
# TokenResponse, TokenPayload
```

**Acceptance Criteria:**
- [ ] User can register with email/password
- [ ] Passwords are hashed with bcrypt
- [ ] Login returns JWT access + refresh tokens
- [ ] Protected routes require valid JWT
- [ ] Token refresh endpoint works
- [ ] Logout invalidates tokens in Redis
- [ ] RBAC enforced on endpoints
- [ ] 15+ tests passing

---

## WEEK 2: SECURITY & TESTING

### Days 1-2: Security Hardening

**Critical Fixes:**
1. Remove hardcoded SECRET_KEY
2. Add SECRET_KEY validation on startup
3. Implement rate limiting (Redis-based)
4. Add security headers middleware
5. Enforce tenant isolation in all queries
6. Add CSRF protection

**Files:**
- `backend/app/core/config.py` - Fix SECRET_KEY
- `backend/app/middleware/security.py` - Headers
- `backend/app/middleware/rate_limit.py` - Rate limiting
- `backend/app/db/queries.py` - Tenant-aware query helpers

---

### Days 3-5: Testing Infrastructure

**Setup:**
1. Create `backend/pytest.ini`
2. Create `backend/conftest.py` with fixtures
3. Create `frontend/vitest.config.ts`
4. Create test database config

**First Test Suite (30 tests minimum):**
- `test_auth.py` - Auth endpoints (10 tests)
- `test_organizations.py` - Org CRUD (5 tests)
- `test_projects.py` - Project CRUD (5 tests)
- `test_security.py` - Tenant isolation (5 tests)
- `test_health.py` - Health endpoint (5 tests)

**Acceptance Criteria:**
- [ ] `pytest` runs all tests successfully
- [ ] Test coverage > 30%
- [ ] CI/CD runs tests automatically
- [ ] Test database auto-created/destroyed

---

## WEEK 3: ORGANIZATIONAL MEMORY

### Implementation Tasks:

1. **Choose Vector Store: pgvector** (simplest with existing PostgreSQL)

2. **Install Dependencies:**
```bash
# Add to requirements.txt
pgvector==0.2.5
sentence-transformers==2.6.1
```

3. **Create Migration:**
```sql
-- 002_add_vector_embeddings.py
ALTER TABLE knowledge_entries ADD COLUMN embedding vector(384);
CREATE INDEX ON knowledge_entries USING ivfflat (embedding vector_cosine_ops);
```

4. **Implement Services:**
- `backend/app/memory/embeddings.py` - Generate embeddings
- `backend/app/memory/vector_store.py` - Vector operations
- Update `memory_service.py` to use vector search

5. **Update API:**
- POST `/api/v1/memory/ingest` - Add knowledge with embedding
- GET `/api/v1/memory/search` - Semantic search
- GET `/api/v1/memory/similar/{id}` - Find similar items

6. **Frontend Component:**
- Create `frontend/app/memory/page.tsx`
- Build knowledge upload form
- Build search interface
- Display search results

**Acceptance Criteria:**
- [ ] Can upload text documents
- [ ] Embeddings generated automatically
- [ ] Semantic search returns relevant results
- [ ] Vector similarity working
- [ ] 20+ tests passing

---

## WEEK 4: AI SPECIALIST INTEGRATION

### Implementation Tasks:

1. **Install LangChain/LangGraph:**
```bash
# Add to requirements.txt
langgraph==0.2.0
langchain==0.2.0
langchain-google-genai==1.0.0
```

2. **Connect Gemini Client:**
```python
# backend/app/ai/gemini_client.py - ACTUALLY USE IT
class GeminiClient:
    def __init__(self):
        self.client = genai.Client(api_key=settings.GEMINI_API_KEY)
    
    async def generate(self, prompt: str, model: str = "gemini-2.0-flash"):
        # Real implementation
```

3. **Implement Base Specialist:**
```python
# backend/app/specialists/base_specialist.py
class BaseSpecialist(ABC):
    def __init__(self, name: str, gemini_client: GeminiClient):
        self.name = name
        self.gemini = gemini_client
    
    async def execute(self, task: str, payload: Dict) -> TaskExecutionResponse:
        # Real LLM call logic
```

4. **Implement 3 Specialists:**
- `security_specialist.py` - Security analysis
- `schema_specialist.py` - Schema analysis  
- `compliance_specialist.py` - Compliance checks

5. **Update Specialist Manager:**
- Load specialists with real Gemini client
- Implement task execution with LLM calls
- Add error handling and retries

**Acceptance Criteria:**
- [ ] Gemini API calls working
- [ ] 3 specialists respond to tasks
- [ ] Responses are coherent and relevant
- [ ] Token usage tracked
- [ ] 25+ tests with mocked LLM

---

## WEEK 5: SUPERVISOR ORCHESTRATION

### Implementation Tasks:

1. **Implement Atlas Supervisor:**
```python
# backend/app/atlas/supervisor.py
class AtlasSupervisor:
    def __init__(self, specialist_manager: SpecialistManager):
        self.specialists = specialist_manager
        self.workflow = LangGraphWorkflow()
    
    async def coordinate_task(self, task: str, context: Dict):
        # Plan task breakdown
        # Delegate to specialists
        # Synthesize results
        # Return with explainability
```

2. **Create LangGraph Workflow:**
- Define state graph
- Add nodes for each specialist
- Add edges for task routing
- Add checkpoints for human-in-loop

3. **Implement Context Builder:**
- Query organizational memory
- Load relevant policies
- Build specialist context

4. **Update API:**
- POST `/api/v1/atlas/execute` - Run coordinated task
- GET `/api/v1/atlas/status/{task_id}` - Check status
- POST `/api/v1/atlas/approve/{task_id}` - Human approval

**Acceptance Criteria:**
- [ ] Supervisor coordinates multi-specialist tasks
- [ ] Context properly built from memory
- [ ] Checkpointing works
- [ ] Human approval gate functional
- [ ] 20+ integration tests

---

## WEEK 6: DECISION CENTER & EXPLAINABILITY

### Implementation Tasks:

1. **Connect Decision Engines:**
- Use real data from database
- Implement risk calculations
- Build confidence scoring
- Generate evidence chains

2. **Implement Explainability:**
```python
# backend/app/explainability/trace_generator.py
class ExplainabilityTrace:
    def build_trace(self, task_execution):
        # Extract LLM reasoning steps
        # Map to organizational memory sources
        # Build attribution chain
        # Format for UI display
```

3. **Create Audit Trail:**
- Persist all decisions to database
- Track specialist contributions
- Record human approvals
- Store explainability traces

4. **Update APIs:**
- GET `/api/v1/decisions` - List pending decisions
- POST `/api/v1/decisions/{id}/approve` - Approve decision
- GET `/api/v1/decisions/{id}/explain` - Get explainability trace
- GET `/api/v1/audit` - Audit trail

**Acceptance Criteria:**
- [ ] Decisions persisted to database
- [ ] Explainability traces generated
- [ ] Audit trail complete
- [ ] Human approval workflow functional
- [ ] 25+ tests passing

---

## WEEKS 7-9: FRONTEND IMPLEMENTATION

### Week 7: Core Components

**Component Library:**
1. Install shadcn/ui components
2. Create design system
3. Build layout components
4. Create API client with React Query
5. Implement auth flow UI

**Files to Create:**
```
frontend/
├── components/
│   ├── ui/              # shadcn components
│   ├── layout/
│   │   ├── header.tsx
│   │   ├── sidebar.tsx
│   │   └── footer.tsx
│   └── auth/
│       ├── login-form.tsx
│       └── register-form.tsx
├── lib/
│   ├── api/
│   │   ├── client.ts    # Axios/Fetch wrapper
│   │   └── hooks.ts     # React Query hooks
│   └── auth/
│       └── auth-context.tsx
```

---

### Week 8: Feature Dashboards

**Pages to Build:**
1. **Dashboard** (`/dashboard`)
   - System telemetry cards
   - Active specialists
   - Recent activities

2. **Atlas Console** (`/atlas`)
   - Task execution form
   - Specialist status display
   - Workflow visualization

3. **Memory Manager** (`/memory`)
   - Knowledge upload
   - Semantic search
   - Knowledge browser

4. **Specialists Fleet** (`/specialists`)
   - Specialist cards
   - Health status
   - Manual task dispatch

---

### Week 9: Interactive Features

1. **Decision Center** (`/decisions`)
   - Pending decisions list
   - Approval workflow
   - Explainability tree viewer

2. **Replay Viewer** (`/replay`)
   - Timeline scrubber
   - Event playback
   - Frame-by-frame navigation

3. **Command Palette**
   - Global Ctrl+K shortcut
   - Quick actions
   - Search everything

4. **Real-time Updates**
   - SSE connection
   - Live notifications
   - Status updates

---

## WEEK 10: DATAHUB INTEGRATION

### Implementation Tasks:

1. **Implement REST DataHub Client:**
```python
# backend/app/datahub/client.py
class RestDataHubClient(DataHubClientInterface):
    async def search_assets(self, query: str):
        # Real HTTP calls to DataHub API
```

2. **Build Sync Pipeline:**
- Schedule periodic sync jobs
- Extract schemas from DataHub
- Store in Organizational Memory
- Update vector embeddings

3. **Create Catalog Browser UI:**
- Display DataHub assets
- Show lineage graphs
- Enable schema exploration

**Acceptance Criteria:**
- [ ] Can connect to real DataHub instance
- [ ] Schema sync working
- [ ] Lineage displayed correctly
- [ ] Search integrated
- [ ] 15+ integration tests

---

## WEEK 11: TESTING & QUALITY

### Test Coverage Goals:

**Backend: 80%+ coverage**
- Unit tests: 120+ tests
- Integration tests: 40+ tests
- E2E API tests: 15+ scenarios

**Frontend: 70%+ coverage**
- Component tests: 50+ tests
- Integration tests: 20+ tests
- E2E tests: 10+ scenarios

### Quality Checks:
- [ ] ESLint passing (0 errors)
- [ ] Pylint passing (9.0+ score)
- [ ] TypeScript strict mode (0 errors)
- [ ] WCAG AA accessibility compliance
- [ ] Performance benchmarks met

---

## WEEK 12: PRODUCTION DEPLOYMENT

### DevOps Tasks:

1. **Create Dockerfiles:**
   - Multi-stage backend Dockerfile
   - Optimized frontend Dockerfile
   - Minimize image sizes

2. **CI/CD Pipeline:**
   - GitHub Actions workflow
   - Automated testing
   - Security scanning
   - Docker image building
   - Deployment automation

3. **Monitoring Setup:**
   - Application logs
   - Error tracking (Sentry)
   - Performance monitoring (APM)
   - Uptime monitoring

4. **Production Environment:**
   - Configure secrets
   - Set up databases
   - Configure Redis
   - DNS and SSL
   - Load balancer

5. **Final Checks:**
   - [ ] Load testing (1000+ concurrent users)
   - [ ] Security penetration testing
   - [ ] Disaster recovery tested
   - [ ] Rollback procedures documented
   - [ ] Monitoring dashboards configured

---

## TRACKING & ACCOUNTABILITY

### Weekly Sprint Reviews:
- Monday: Planning & task assignment
- Friday: Demo & retrospective
- Continuous: Daily standups (15 min)

### Key Metrics:
- Implementation completion % (target: 10% increase per week)
- Test coverage % (target: 7% increase per week)
- Open blockers (target: < 3)
- Deployment readiness score (target: 8.5/10 by Week 12)

### Risk Register:
- LLM API costs exceed budget
- DataHub integration more complex than expected
- Frontend complexity underestimated
- Testing reveals major architectural issues
- Team capacity constraints

---

## SUCCESS CRITERIA

### V1.0 Must Have:
- ✅ All migrations working
- ✅ Authentication functional
- ✅ 3 specialists working with Gemini
- ✅ Supervisor orchestration functional
- ✅ Frontend built and professional
- ✅ 70%+ test coverage
- ✅ Security audit passed
- ✅ Deployed to production
- ✅ Load testing passed
- ✅ Documentation updated

### V1.0 Nice to Have:
- Real DataHub connection (can use mock for V1.0)
- Advanced visualizations
- Mobile responsive
- Internationalization
- Advanced analytics

---

**Next Step:** Approve this plan and begin Week 1, Day 1 tasks immediately.

*Questions? Review ENGINEERING_AUDIT_REPORT.md for full details.*
