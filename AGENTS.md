# AGENTS.md

This file provides guidance to agents when working with code in this repository.

## Project Structure
Split monorepo: `frontend/` (React/Vite SPA) and `backend/` (FastAPI Python package).
Root `api/index.py` is a thin Vercel shim — it only adds `backend/` to `sys.path` and re-exports the FastAPI `app`. Do not add logic there.

## Commands

### Backend (must run from **project root**, NOT from `backend/`)
```bash
# Run all tests
pytest backend/tests

# Run a single test file
pytest backend/tests/test_calculator.py

# Run a single test by name
pytest backend/tests/test_calculator.py::test_leak_impact

# Start dev server
uvicorn backend.app.main:app --reload --port 8000

# With uv (project uses uv as package manager — see uv.lock)
uv run pytest backend/tests
uv run uvicorn backend.app.main:app --reload --port 8000
```
> **Critical**: Tests import as `from backend.app.services...` — they require the project root on `sys.path`. Running `pytest` from inside `backend/` will fail with `ModuleNotFoundError`.

### Frontend (run from `frontend/`)
```bash
npm run dev    # port 5173 — proxies /api/* to localhost:8000 automatically
npm run build  # outputs to frontend/dist/
```

## Non-Obvious Patterns

### Python
- **All benchmark constants are in one place**: `backend/app/constants/water_benchmarks.py`. Every numeric water value (flow rates, volumes, leak rates, per-capita benchmarks) must come from there — never hardcode floats in service files.
- **`WastageAnalysisService.analyze()` calls `WaterCalculatorService` internally** in `routes_analysis.py`. The route does not share the result from `/calculate` — it recalculates. Do not refactor to reuse the caller's result.
- **`RagKnowledgeService` is a singleton** (`get_instance()`). Creating a new instance in tests is safe; the class-level `_instance` is shared across all `get_instance()` calls within a process.
- **`HouseholdAssessmentInput` uses Pydantic defaults for all fields** — the model is valid with zero arguments. Tests exploit `model_copy(update={...})` for minimal diff fixtures.
- **`config.py` reads `.env` from the working directory**, not from `backend/`. Place `.env` in the project root or `backend/` depending on how `uvicorn` is launched.
- **`ai_service.py` has no test file** — `test_ai.py` does not exist. Any changes to `_generate_fallback_response()` or `chat()` are untested.

### Frontend
- **Navigation is state-driven, not URL-based**. `activeView` in `WaterContext` is the router. There are no `<Link>` components or URL params — use `setActiveView('dashboard')` to navigate.
- **`runAssessment()` fires `/calculate` and `/analyze` concurrently** via `Promise.all` and navigates to `'dashboard'` on success. It also injects a proactive assistant message into `chatMessages`.
- **`VITE_API_BASE_URL` defaults to `/api`** (relative path). In local dev this works via Vite proxy. For a standalone backend deployment, set this env var to the full backend URL.
- **Charts are custom SVG** — there is no charting library. `CategoryDonutChart.jsx` and `CategoryBarChart.jsx` render pure SVG. Do not reach for recharts/chart.js.
- **`clsx` + `tailwind-merge`** are available for className composition. Use these instead of string concatenation in component props.

## Code Style

### Python
- Services are **pure static/class methods** — no instance state in `WaterCalculatorService` or `WastageAnalysisService`.
- All service return types use Pydantic models — never return raw dicts from service methods.
- Enums in `assessment.py` use `str, Enum` so they serialize to strings in JSON automatically.
- Log via `logging.getLogger("module_name")` — no `print()` statements in services.

### JavaScript / JSX
- Named exports for components; default export for the component function.
- `useWater()` is the only hook needed to access all app state — do not prop-drill.
- Framer Motion `motion.div` with `fadeUp` variants is the standard animation pattern on page-level sections (see `DashboardPage.jsx`).
