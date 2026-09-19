# Smart Water Usage Advisor 💧

An AI-powered sustainability web application aligned with **UN Sustainable Development Goal 6 (Clean Water and Sanitation)** — specifically **Target 6.4: Water-use Efficiency**.

The application empowers households to:
1. **Estimate Daily Water Consumption**: Transparent deterministic flow calculations across bathing, toilets, kitchen, laundry, cleaning, and gardening.
2. **Detect Top Wastage Points**: Automatically isolates the top 3 highest-impact water-saving opportunities (such as silent toilet flapper leaks or extended shower routines) with encouraging, non-judgmental recommendations.
3. **Interact with Aqua Advisor AI**: A ChatGPT-style assistant grounded in the user's specific water profile and a local RAG knowledge base.
4. **Learn Real-World Conservation Practices**: Understand standard flow benchmarks, the food-coloring toilet test, two-basin dishwashing, and rainwater harvesting.

---

## 🚀 Tech Stack

- **Frontend**: React 18, Vite 5, Tailwind CSS, Lucide React Icons, Framer Motion
- **Backend**: Python 3.13, FastAPI, Uvicorn, Pydantic V2, httpx
- **AI Layer**: Flexible LLM client (OpenAI, Gemini OpenAI-compatible endpoint, Groq, Ollama) + built-in RAG-grounded Smart Local Fallback Engine (runs 100% reliably out-of-the-box even without an API key)
- **Knowledge Base**: Curated local JSON dataset (`backend/app/knowledge/water_conservation.json`) with fast token and keyword relevance scoring (no bloated vector DB dependencies).

---

## 📁 Project Architecture

```
Smart Water Usage Advisor/
├── backend/
│   ├── app/
│   │   ├── main.py                     # FastAPI entry point, CORS, and error handlers
│   │   ├── config.py                   # Pydantic SettingsConfigDict configuration
│   │   ├── api/
│   │   │   ├── routes_calculator.py    # POST /api/calculate, GET /api/benchmarks
│   │   │   ├── routes_analysis.py      # POST /api/analyze
│   │   │   └── routes_chat.py          # POST /api/chat, GET /api/knowledge, GET /api/health
│   │   ├── constants/
│   │   │   └── water_benchmarks.py     # Centralized empirical flow constants
│   │   ├── models/
│   │   │   ├── assessment.py           # HouseholdAssessmentInput schema
│   │   │   ├── calculation.py          # CalculatedUsageResponse, WastagePoint schemas
│   │   │   └── chat.py                 # ChatRequest, ChatResponse, SourceCitation schemas
│   │   ├── services/
│   │   │   ├── calculator_service.py   # Pure deterministic calculation logic
│   │   │   ├── wastage_service.py      # Top 3 wastage diagnostics & positive framing
│   │   │   ├── rag_service.py          # Lightweight keyword & token similarity matching
│   │   │   └── ai_service.py           # Prompt engine, LLM client & smart local fallback
│   │   └── knowledge/
│   │       └── water_conservation.json # 15 curated water conservation entries
│   ├── tests/
│   │   ├── test_calculator.py          # Unit tests for calculation math
│   │   ├── test_wastage.py             # Unit tests for wastage identification
│   │   ├── test_rag.py                 # Unit tests for knowledge retrieval
│   │   └── test_api.py                 # Integration tests for FastAPI endpoints
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx              # Header navigation & SDG 6 trigger
│   │   │   ├── Footer.jsx              # Sustainability footer & methodology note
│   │   │   ├── MetricCard.jsx          # Reusable stat & benchmark indicator card
│   │   │   ├── CategoryDonutChart.jsx  # SVG Donut distribution chart with tooltips
│   │   │   ├── CategoryBarChart.jsx    # Horizontal ranking comparison progress bars
│   │   │   ├── WastageCard.jsx         # Wastage diagnosis card with potential savings
│   │   │   ├── DisclaimerBadge.jsx     # Empirical estimate disclaimer
│   │   │   ├── NotificationToast.jsx   # Friendly toast alerts
│   │   │   └── SdgInfoModal.jsx        # UN SDG Target 6.4 educational deep-dive
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx         # Hero, value propositions, facts & quick presets
│   │   │   ├── AssessmentPage.jsx      # Progressive 3-step questionnaire
│   │   │   ├── DashboardPage.jsx       # Complete analytics, charts & print summary
│   │   │   └── ChatPage.jsx            # Aqua Advisor ChatGPT-style assistant
│   │   ├── context/
│   │   │   └── WaterContext.jsx        # State management for assessment & chat
│   │   ├── services/
│   │   │   └── api.js                  # Frontend API client with resilient error handling
│   │   ├── data/
│   │   │   └── sampleProfiles.js       # Pre-configured demo scenarios (Urban, Eco, Villa)
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css                   # Tailwind styling & glassmorphism
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── index.html
├── .env.example
├── .gitignore
└── README.md
```

---

## 🛠️ Getting Started Locally

### Prerequisites
- Python 3.10+ (Tested on Python 3.13)
- Node.js 18+ & npm (Tested on Node v24)

### 1. Backend Setup
```bash
# From project root
cd backend

# Install dependencies
pip install -r requirements.txt

# (Optional) Set up environment variables
copy .env.example .env

# Run automated tests
pytest tests

# Start FastAPI development server
uvicorn app.main:app --reload --port 8000
```
Backend will be live at: `http://localhost:8000`
Swagger API documentation at: `http://localhost:8000/docs`

### 2. Frontend Setup
```bash
# In a new terminal, from project root
cd frontend

# Install npm dependencies
npm install

# Start Vite dev server
npm run dev
```
Frontend will be live at: `http://localhost:5173`

---

## ⚙️ Environment Variables

Copy `.env.example` to `.env` in the root or `backend/` directory:

| Variable | Default | Description |
| :--- | :--- | :--- |
| `PORT` | `8000` | Port for the backend API |
| `ALLOWED_ORIGINS` | `http://localhost:5173,...` | Allowed CORS origins (comma-separated) |
| `LLM_API_KEY` | *(empty)* | Optional API key for OpenAI, Gemini, or Groq |
| `LLM_BASE_URL` | `https://api.openai.com/v1` | Base URL for OpenAI-compatible completions |
| `LLM_MODEL` | `gpt-4o-mini` | LLM model identifier |
| `LLM_TIMEOUT_SECONDS` | `20.0` | Network timeout for remote LLM requests |

> **Note on Zero-Config Operation**: If `LLM_API_KEY` is not provided, the application runs in **Smart Local Heuristic Mode**. Aqua Advisor uses RAG retrieval and the user's specific water profile metrics to generate complete, encouraging, and accurate answers with verified source citations.

---

## 🧮 How the Deterministic Calculation Works

All calculations are located in `backend/app/constants/water_benchmarks.py` and `backend/app/services/calculator_service.py`:

- **Showers**: $\text{People} \times \text{Showers/day} \times \text{Duration (min)} \times 9.5\text{ L/min}$
- **Bucket Baths**: $\text{Baths/day} \times 18\text{ Liters}$
- **Toilets**: $\text{People} \times \text{Flushes/day} \times (4.2\text{L for dual-flush average} \text{ or } 9.0\text{L for standard single flush})$
- **Kitchen**:
  - Running Tap: $7\text{ min} \times 10\text{ L/min} \times \text{Frequency}$
  - Two-Basin Wash: $24\text{ Liters} \times \text{Frequency}$
  - Dishwasher: $15\text{ Liters} \times \text{Frequency}$
  - Cooking & Drinking: $\text{People} \times 6\text{ Liters} \times \text{Cooking Intensity Multiplier}$
- **Laundry**: $\text{Weekly loads} \times (110\text{L top-load} \mid 55\text{L front-load} \mid 35\text{L manual}) \div 7$
- **Cleaning & Vehicles**: Mopping ($15\text{L}$) + Vehicle wash ($180\text{L hose} \mid 30\text{L bucket}$) converted to daily average
- **Outdoor / Garden**: $\text{Duration} \times 15\text{ L/min (hose)} \text{ or } 20\text{ L (drip/can)}$
- **Leaks**: Dripping faucet ($25\text{ L/day}$), Running toilet flapper ($220\text{ L/day}$), Pipe seepage ($80\text{ L/day}$)
- **Hygiene buffer**: $8\text{ L/person/day}$ for brushing, handwashing, and shaving

---

## 🔍 How the RAG Knowledge System Works

1. **Structured Knowledge Base**: `backend/app/knowledge/water_conservation.json` stores 15 curated entries from EPA WaterSense, WHO, AWWA, and CPHEEO covering leaks, aerators, greywater, rainwater, and SDG 6.
2. **Tokenization & Stop-Word Stripping**: Strips conversational filler and standardizes query tokens.
3. **Multi-Factor Scoring**:
   - Phrase matching in keywords: $+8.0$
   - Exact keyword hit: $+4.5$
   - Topic title overlap: $+3.0$
   - Content body hit: $+1.0$
   - Domain synonym weighting: $+3.5$
4. **Context Injection**: Top 3 ranked articles are formatted with topic, source, and snippet, and passed directly to the LLM system prompt or the local advisor engine.
5. **Citations**: The frontend highlights verified sources consulted with collapsible detail cards.

---

## 📡 API Endpoints

- `POST /api/calculate` — Takes household assessment parameters and returns category breakdown, daily liters, per-capita volume, and benchmarks.
- `POST /api/analyze` — Computes category usage and returns the top 3 wastage sources with potential daily and monthly savings.
- `POST /api/chat` — Processes user message with water profile context and returns RAG-grounded response with source citations.
- `GET /api/benchmarks` — Returns empirical flow rates and assumptions used by the calculation engine.
- `GET /api/knowledge` — Lists all curated water conservation knowledge items.
- `GET /api/health` — Returns system health status, knowledge entry count, and active model.

---

## 🚢 Deployment

### Deploy Backend (e.g. Render, Railway, DigitalOcean, or AWS EC2)
```bash
# In backend directory
uvicorn app.main:app --host 0.0.0.0 --port 8000
```
Ensure environment variable `ALLOWED_ORIGINS` includes your production frontend domain.

### Deploy Frontend (e.g. Vercel, Netlify, Cloudflare Pages)
```bash
# In frontend directory
npm run build
```
Set environment variable `VITE_API_BASE_URL` to your production backend URL (e.g. `https://api.yourdomain.com/api`).

---

## 🛡️ Responsible Sustainability Note

This application is designed to encourage individual consciousness, water literacy, and actionable demand-side conservation. It provides empirical models and estimates rather than physical telemetry, and does not claim to single-handedly resolve macro-level municipal water management or agricultural water stress.
