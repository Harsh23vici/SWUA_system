# AGENTS.md

This file provides guidance to agents when working with code in this repository.

## Critical Coding Rules

### Backend
- **Do not add logic to `api/index.py`** — it is a Vercel deployment shim only (2 lines: sys.path + import). All application code belongs in `backend/app/`.
- **All water constants must live in `backend/app/constants/water_benchmarks.py`** — adding a new flow rate or volume anywhere else breaks the `/api/benchmarks` transparency endpoint.
- **`WastageAnalysisService.analyze()` receives both `assessment` and `calculation`** as arguments — it does not call the calculator internally; the route (`routes_analysis.py`) calls both. If you add a new route that needs both results, follow the same pattern: calculate first, pass both objects.
- **`RagKnowledgeService._instance` is class-level** — resetting it between tests requires `RagKnowledgeService._instance = None`. Do not instantiate with `RagKnowledgeService()` in production code; always use `get_instance()`.
- **Pydantic `model_copy(update={...})`** is the correct way to produce test variants of `HouseholdAssessmentInput` — all fields have defaults so you only need to override what you're testing.
- **`config.py` uses `extra="ignore"`** in `SettingsConfigDict` — unknown env vars are silently dropped. This is intentional to allow the root `.env` to contain `VITE_*` vars alongside Python vars.
- **The `/api/analyze` endpoint re-runs `WaterCalculatorService.calculate_all()` internally** — if you optimize `calculate_all()` for performance, it will be called twice per assessment submission (once from `/calculate`, once from `/analyze` — both fired concurrently from the frontend).

### Frontend
- **`activeView` is the only navigation mechanism** — never use `window.location` or `history.pushState`. All four views (`landing`, `assessment`, `dashboard`, `chat`) are toggled via `setActiveView()` from `WaterContext`.
- **`runAssessment()` in `WaterContext` auto-navigates to `'dashboard'`** and injects a chat message on success. If you add a new entry point to assessment submission, replicate this side-effect or the chat context will be stale.
- **Charts have no library dependency** — `CategoryDonutChart.jsx` and `CategoryBarChart.jsx` are hand-written SVG. Do not add recharts/visx/chart.js; keep charts as SVG components.
- **`water_profile` sent to `/api/chat`** is a manually assembled compact object (see `WaterContext.sendChatMessage()`), not the raw `CalculatedUsageResponse`. It intentionally omits the `disclaimer` field to keep the LLM context payload small.
- **`conversation_history` is capped at the last 6 messages** before sending to `/api/chat` — this is a deliberate token-budget decision; do not increase it without considering LLM context window costs.

### Testing
- **All tests must be run from the project root** — `pytest backend/tests` — not from inside `backend/`. The test imports use `from backend.app...` paths.
- **`test_chat_endpoint_fallback` in `test_api.py` asserts `is_fallback is True`** — this test will fail if `LLM_API_KEY` is set in the environment when tests run. Keep the key out of the test environment.
- **There are no tests for `ai_service.py`** — if you modify `_generate_fallback_response()` or any intent-detection logic, write tests before submitting.
