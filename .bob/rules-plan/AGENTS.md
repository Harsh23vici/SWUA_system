# AGENTS.md

This file provides guidance to agents when working with code in this repository.

## Non-Obvious Architectural Constraints

- **`/api/analyze` is computationally coupled to `/api/calculate`** — `WastageAnalysisService.analyze()` requires a pre-computed `CalculatedUsageResponse` as input. Any architectural change that separates the two endpoints (e.g., caching, async queues) must account for this dependency.
- **The frontend fires both API calls concurrently (`Promise.all`)** — `/calculate` and `/analyze` must remain independent stateless endpoints. They cannot depend on server-side session state or shared request context.
- **`RagKnowledgeService` loads the JSON file once at first `get_instance()` call** — it is in-process memory, not a file watch. Adding new knowledge base entries requires a server restart; there is no hot-reload for the KB.
- **The AI fallback (`_generate_fallback_response`) and remote LLM path return the identical `ChatResponse` Pydantic schema** — the only distinguishing field is `is_fallback: bool`. The frontend displays a badge based on this flag. Any new response path must preserve this contract.
- **`WaterContext.jsx` is the single point of truth for ALL frontend state** — there is no Redux, Zustand, or other store. Adding a second context or a module-level store will create split-brain state between views.
- **The Vite dev proxy (`/api → localhost:8000`) is the only local CORS solution** — the backend's `ALLOWED_ORIGINS` does not include `localhost:5173` as a wildcard bypass. If you start the frontend without the Vite proxy (e.g., serving `dist/` directly), you must add the origin to `ALLOWED_ORIGINS` in `.env`.
- **Vercel serverless has a cold-start implication for the RAG singleton** — each serverless function invocation may be a new process, meaning `RagKnowledgeService._instance` will be `None` and the JSON file will be re-read on each cold start. This is acceptable for the current 15-entry file size.
- **`pyproject.toml` pins `requires-python = "~=3.13.0"`** — the `uv.lock` lockfile is generated for exactly Python 3.13.x. Do not change the Python version without regenerating the lockfile.
- **There is no database** — all state is in-request (computed per API call) or in-process (RAG singleton). There is no persistence layer to design around.
