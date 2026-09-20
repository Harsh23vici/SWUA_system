# AGENTS.md

This file provides guidance to agents when working with code in this repository.

## Non-Obvious Documentation Context

- **The root `README.md` contains the canonical calculation formulas** (LaTeX-style) for all 8 water categories. These match the implementation exactly and are the best reference for understanding the maths.
- **`backend/app/constants/water_benchmarks.py` is also a documentation file** — it includes `BENCHMARK_ASSUMPTIONS`, a dict of every constant with value, unit, and description, exposed verbatim via `GET /api/benchmarks`. Treat it as both code and spec.
- **`frontend/src/data/sampleProfiles.js` defines `INITIAL_ASSESSMENT_STATE`** — this is the default form state used on every fresh assessment. It is the canonical reference for default field values, not `assessment.py` (which defines Pydantic defaults separately).
- **`backend/app/knowledge/water_conservation.json` sources** — entries cite EPA WaterSense, WHO, AWWA, CPHEEO, Alliance for Water Efficiency, USGS, and Ministry of Jal Shakti. Any new KB entries should follow the same `{id, topic, content, keywords[], source, savings_potential_liters_per_day}` schema.
- **Fallback AI responses are in `ai_service.py`, not a template file** — `_generate_fallback_response()` contains all the hardcoded fallback copy. It is the only place where user-facing AI text lives outside of the knowledge base.
- **The Tailwind design system is documented in `tailwind.config.js`** — custom color scales (`ocean`, `aqua`), shadow tokens (`premium`, `glow-ocean`), and animation names (`ripple-slow`, `pulse-subtle`) are all defined there. Reference it before adding any new visual styling.
- **`vercel.json` is the deployment spec** — it reveals the complete production routing table: `/api/*` → Python serverless, everything else → static SPA. There is no separate nginx or CDN config.
