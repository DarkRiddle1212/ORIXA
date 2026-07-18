# Orixa Testing Coverage Report
**Status:** ALL TESTS PASSING (100% Green)  
**Test Suite Engine:** Vitest v4.x (Frontend/Node) & Pytest v8.x (Backend)  
**Date:** July 16, 2026  

---

## 1. Testing Philosophy

To ensure high-fidelity resilience across sandboxed environments, Orixa employs a dual-engine test automation framework. External dependencies (including Live WebSocket frames, Google Gemini APIs, DataHub metadata servers, and physical databases) are mocked using isolated mock providers. This isolation ensures the pipeline can be validated in under **10 seconds** inside isolated GitHub Actions CI environments.

---

## 2. Test Execution Summary

### 2.1 Test Suites Overview

```
[✓] src/tests/CommandPalette.test.tsx  (2 tests)
[✓] src/tests/DecisionCenter.test.tsx  (2 tests)
[✓] backend/tests/test_main.py         (5 tests)
[✓] backend/tests/test_decision_center.py (3 tests)
[✓] backend/tests/test_replay.py       (4 tests)
[✓] backend/tests/test_atlas.py        (2 tests)

Total Passing: 18 / 18 tests (100% SUCCESS)
Execution Time: ~5.06s
```

---

## 3. Detailed Component Test Coverage

### 3.1 Frontend Component Tests (Vitest)
- **`CommandPalette.test.tsx` (PASS):**
  - Asserts that pressing `Ctrl+K` dynamically opens the workspace control overlay.
  - Verifies that searching/filtering terms (e.g. typing "DataHub") correctly keeps relevant command options and trims non-matching elements.
- **`DecisionCenter.test.tsx` (PASS):**
  - Confirms skeleton loaders are rendered when waiting for investigation payload synthesis.
  - Verifies that SRE live state payloads are successfully parsed and applied to drive components state transitions.

### 3.2 Backend Endpoint Tests (Pytest)
- **`test_main.py` (PASS):**
  - Validates the `/health` payload structure and service sub-heartbeats (postgres and redis mock statuses).
  - Asserts that multi-tenant listings (/organizations, /projects) return correct structured arrays.
- **`test_decision_center.py` (PASS):**
  - Verifies compile-time profiling works for selected investigations.
  - Validates manual decision submission `/approve` with correct role clearance and flags invalid commands with standard HTTP `422/400` validation filters.
- **`test_replay.py` (PASS):**
  - Asserts retrieving structured chronological event arrays.
  - Asserts generating mock simulations and catching empty query inputs.
- **`test_atlas.py` (PASS):**
  - Asserts full supervisor planning pipeline.

---

## 4. Advanced Mocking Strategy

To keep tests repeatable, fast, and secure:
1. **EventSource Mocking:** A custom virtual `MockEventSource` replaces standard SSE browser connections. It registers listeners and triggers connections on a slight timeout.
2. **Relative Ingress Patch:** A custom fetch proxy interceptor converts standard relative relative urls (e.g., `/api/...`) to absolute test harness URLs to prevent Node environment parsing issues.
3. **Database & Cache Mocks:** `conftest.py` in the Python backend injects an `AsyncMock` to completely mock SQLAlchemy transactions and intercept standard `redis_manager` connection attempts before they make real network requests.
