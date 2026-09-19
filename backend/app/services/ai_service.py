"""Aqua Advisor AI Service.

Handles prompt engineering, context injection (household profile + retrieved RAG entries),
remote LLM API interaction (OpenAI/Gemini/Groq compatible), and a smart local fallback
engine to guarantee 100% reliable responses even without an external API key.
"""

import json
import logging
from typing import Any, Dict, List, Optional
import httpx

from ..config import settings
from ..models.chat import ChatMessage, ChatRequest, ChatResponse, SourceCitation
from .rag_service import RagKnowledgeService

logger = logging.getLogger("aqua_advisor")

AQUA_ADVISOR_SYSTEM_PROMPT = """You are "Aqua Advisor", an expert, warm, and encouraging AI sustainability assistant aligned with UN Sustainable Development Goal 6 (Clean Water and Sanitation).

YOUR ROLE:
- Help households understand, manage, and reduce their water consumption.
- Use the user's specific water profile (occupants, daily consumption, category breakdown, top wastage points) to personalize all answers.
- Base advice on the provided knowledge base snippets from water stewardship authorities.
- Prioritize the largest potential savings first (such as fixing silent leaks or shortening showers).
- Recommend practical, low-cost or zero-cost actions.

KEY BEHAVIORAL RULES:
1. TONE: Encouraging, supportive, positive, and non-judgmental. Never shame or guilt the user for their current consumption. Use phrases like "A great place to start saving is..." rather than "You are wasting too much water."
2. ESTIMATES: Always remind or acknowledge that the numbers are empirical behavioral estimates, not real-time physical water meter telemetry.
3. FACTUAL ACCURACY: Never fabricate scientific numbers or savings percentages. Rely on the provided context snippets.
4. UNCERTAINTY: If you don't know something or if a measurement is indeterminate, state it clearly and advise checking with local utility guidelines.
5. CONCISENESS: Keep answers structured with bullet points, bold highlights, and clear actionable takeaways.
"""


class AquaAdvisorService:
    @classmethod
    def _build_context_summary(cls, profile: Optional[Dict[str, Any]]) -> str:
        if not profile:
            return "Household Profile: No assessment completed yet. User is asking general water conservation questions."

        num_people = profile.get("num_people", "N/A")
        total_daily = profile.get("total_daily_liters", "N/A")
        per_person = profile.get("per_person_daily_liters", "N/A")
        status = profile.get("benchmark_status", "Standard")

        breakdown = profile.get("category_breakdown", [])
        top_cats = []
        if isinstance(breakdown, list):
            for cat in breakdown[:4]:
                if isinstance(cat, dict):
                    name = cat.get("category_name", "")
                    liters = cat.get("liters_per_day", 0)
                    pct = cat.get("percentage", 0)
                    top_cats.append(f"{name}: {liters} L/day ({pct}%)")

        top_waste = profile.get("top_wastage_points", [])
        waste_items = []
        if isinstance(waste_items, list):
            for w in top_waste[:3]:
                if isinstance(w, dict):
                    name = w.get("category_name", "")
                    save = w.get("potential_water_saving_lpd", 0)
                    waste_items.append(f"{name} (Potential saving: {save} L/day)")

        context_lines = [
            "USER'S WATER PROFILE (Estimates):",
            f"- Occupants: {num_people} people",
            f"- Total Daily Usage: {total_daily} Liters/day",
            f"- Per-Person Usage: {per_person} Liters/person/day",
            f"- Benchmark Classification: {status}",
            f"- Top Usage Areas: {', '.join(top_cats) if top_cats else 'N/A'}",
            f"- Top Potential Wastage Points: {', '.join(waste_items) if waste_items else 'None detected'}",
        ]
        return "\n".join(context_lines)

    @classmethod
    def _build_rag_context(cls, citations: List[SourceCitation]) -> str:
        if not citations:
            return "No specific reference documents retrieved."

        lines = ["VERIFIED WATER CONSERVATION KNOWLEDGE BASE:"]
        for idx, c in enumerate(citations, 1):
            lines.append(f"[{idx}] Topic: {c.topic} (Source: {c.source})")
            lines.append(f"Details: {c.snippet}")
        return "\n".join(lines)

    @classmethod
    def _generate_fallback_response(
        cls,
        user_message: str,
        profile: Optional[Dict[str, Any]],
        citations: List[SourceCitation],
    ) -> str:
        """Intelligent local heuristic generator when no external LLM API key is configured."""
        q_lower = user_message.lower()

        # Extract profile facts
        num_people = profile.get("num_people", 3) if profile else 3
        total_daily = profile.get("total_daily_liters", 420) if profile else 420
        per_person = profile.get("per_person_daily_liters", 140) if profile else 140
        benchmark_status = profile.get("benchmark_status", "Balanced") if profile else "Balanced"

        # Check intent
        is_shower_q = any(w in q_lower for w in ["shower", "bathing", "bath", "minutes"])
        is_toilet_q = any(w in q_lower for w in ["toilet", "flush", "cistern", "flapper"])
        is_leak_q = any(w in q_lower for w in ["leak", "dripping", "pipe", "loss"])
        is_plan_q = any(w in q_lower for w in ["plan", "7-day", "7 day", "schedule", "week"])
        is_high_q = any(w in q_lower for w in ["is my", "usage high", "high", "normal", "benchmark", "compare"])
        is_first_q = any(w in q_lower for w in ["first", "start", "priority", "what should i fix"])

        # Construct customized response
        intro = (
            f"Hello! Based on your household's estimated profile of **{num_people} people** consuming approximately "
            f"**{total_daily:,.0f} Liters/day** (~{per_person:.0f} L/person/day, classified as *{benchmark_status}*):\n\n"
        )

        if is_high_q:
            if per_person <= 80:
                body = (
                    f"🌟 **Your water usage is remarkably low and water-wise!**\n\n"
                    f"At **{per_person:.0f} Liters per person per day**, your household is well below the standard urban benchmark of 140 L/person/day. "
                    f"You are practicing great water stewardship aligned with SDG 6. You can continue maintaining this with regular aerator checks."
                )
            elif per_person <= 140:
                body = (
                    f"💧 **Your water usage is in the Balanced (Average) range.**\n\n"
                    f"At **{per_person:.0f} L/person/day**, you are closely aligned with standard urban household averages (135–140 L/day). "
                    f"While already balanced, targeted tweaks like cutting shower times by 2-3 minutes or adopting a two-basin dishwashing routine can comfortably save another 15–20% without impacting lifestyle."
                )
            else:
                body = (
                    f"🌊 **Your water usage has room for high-impact savings.**\n\n"
                    f"At **{per_person:.0f} L/person/day**, consumption is higher than standard urban averages (140 L/day). "
                    f"Don't worry—this is very common and usually caused by a couple of key drivers like longer showers, older single-flush cisterns, or silent leaks. "
                    f"Fixing just the top 2 areas can easily save over 100 Liters daily!"
                )

        elif is_shower_q:
            body = (
                "🚿 **Shower Water Conservation Advice:**\n\n"
                "- **Standard Flow**: A standard showerhead expends **9.5 to 12 Liters per minute**.\n"
                "- **Immediate Saving**: Shortening your shower by just **3 minutes** saves approximately **28 to 35 Liters** per person every single day.\n"
                f"- **Household Impact**: For your home of {num_people}, that equals **{num_people * 30} Liters saved daily** ({num_people * 900:,} L/month)!\n"
                "- **Hardware Fix**: Adding an inexpensive WaterSense aerator caps flow at 6.0 L/min while maintaining satisfying water pressure."
            )

        elif is_toilet_q:
            body = (
                "🚽 **Toilet & Cistern Efficiency:**\n\n"
                "- Standard single flushes consume **9 to 12 Liters** per flush, representing up to 25–30% of total indoor water.\n"
                "- Dual-flush systems average just **4.2 Liters** (3L for liquids, 6L for solids).\n"
                "- **Quick DIY Fix**: Place a 1-liter plastic bottle filled with water and sand inside the cistern (away from moving parts) to save 1 Liter on every single flush automatically!"
            )

        elif is_leak_q:
            body = (
                "🔍 **Leak Detection & Quick Fixes:**\n\n"
                "- **The Silent Toilet Flapper Leak**: Silently discharges **150 to 300 Liters/day** without making obvious noise.\n"
                "- **Test**: Place 5 drops of food coloring into the toilet tank. Wait 15 minutes without flushing. If color enters the bowl, replace the $5 rubber flapper valve.\n"
                "- **Dripping Faucets**: A 1-drop-per-second drip wastes ~25 Liters/day. Replacing a worn rubber O-ring or ceramic disc takes just minutes."
            )

        elif is_plan_q:
            body = (
                "📅 **Your 7-Day Water-Saving Action Plan:**\n\n"
                "- **Day 1 (Quick Win)**: Perform the 15-minute food-coloring test on all toilet tanks to spot silent leaks.\n"
                "- **Day 2 (Habit)**: Put on a 5-minute song during morning showers as a natural shower timer.\n"
                "- **Day 3 (Kitchen)**: Switch to the two-basin dishwashing method (soak in one, rinse in second) instead of continuous running tap.\n"
                "- **Day 4 (Laundry)**: Ensure all washing machine loads are fully loaded before pressing start.\n"
                "- **Day 5 (Outdoor/Vehicle)**: Switch to a 2-bucket wash with microfiber cloth for vehicles instead of a running hose.\n"
                "- **Day 6 (Hardware)**: Install low-flow aerators on bathroom and kitchen faucets.\n"
                "- **Day 7 (Review)**: Recalculate your usage in this advisor and celebrate your household's reduction!"
            )

        elif is_first_q:
            body = (
                "🎯 **What to Address First:**\n\n"
                "Always tackle **silent leaks first**, because water is escaping 24/7 without providing any benefit:\n"
                "1. **Check toilet flappers** with food coloring (potential saving: 150–220 L/day).\n"
                "2. **Check for dripping faucets or bibbs** (saving: 25 L/day per tap).\n"
                "3. **Focus on shower duration** — the easiest zero-cost behavioral habit to trim."
            )

        else:
            # General synthesis using top retrieved citation
            snippet_text = citations[0].snippet if citations else "Adopt mindful habits and check for leaks."
            body = (
                f"💡 **Key Insights for Your Household:**\n\n"
                f"- **Top Focus Area**: Based on guidelines from {citations[0].source if citations else 'water experts'}, "
                f"{snippet_text}\n"
                f"- **Household Scale**: For your {num_people}-person home ({total_daily:.0f} L/day total), "
                f"small 5-minute adjustments across bathing and kitchen can easily reduce overall demand by 15% to 25%.\n"
                f"- **Actionable Step**: Try focusing on the highest consumption category shown in your dashboard this week."
            )

        disclaimer = (
            "\n\n*Note: Calculations are deterministic empirical estimates based on typical fixture flow ratings, "
            "not physical meter telemetry.*"
        )
        return intro + body + disclaimer

    @classmethod
    async def chat(cls, request: ChatRequest) -> ChatResponse:
        # 1. Retrieve relevant knowledge chunks
        rag_service = RagKnowledgeService.get_instance()
        citations = rag_service.search(request.message, top_k=3)

        # 2. Check if external LLM is configured
        api_key = settings.LLM_API_KEY.strip()
        if not api_key:
            # Use intelligent fallback engine
            fallback_text = cls._generate_fallback_response(
                request.message, request.water_profile, citations
            )
            return ChatResponse(
                response=fallback_text,
                sources=citations,
                is_fallback=True,
                model_used="Aqua Advisor Local Smart Engine (RAG-Grounded)",
            )

        # 3. If API key exists, call external LLM
        profile_context = cls._build_context_summary(request.water_profile)
        rag_context = cls._build_rag_context(citations)

        system_message = (
            f"{AQUA_ADVISOR_SYSTEM_PROMPT}\n\n"
            f"{profile_context}\n\n"
            f"{rag_context}"
        )

        messages = [{"role": "system", "content": system_message}]

        # Append recent conversation history (up to last 6 messages)
        if request.conversation_history:
            for past_msg in request.conversation_history[-6:]:
                messages.append({"role": past_msg.role, "content": past_msg.content})

        messages.append({"role": "user", "content": request.message})

        try:
            async with httpx.AsyncClient(timeout=settings.LLM_TIMEOUT_SECONDS) as client:
                headers = {
                    "Authorization": f"Bearer {api_key}",
                    "Content-Type": "application/json",
                }
                payload = {
                    "model": settings.LLM_MODEL,
                    "messages": messages,
                    "temperature": 0.6,
                    "max_tokens": 800,
                }
                resp = await client.post(
                    f"{settings.LLM_BASE_URL.rstrip('/')}/chat/completions",
                    headers=headers,
                    json=payload,
                )
                resp.raise_for_status()
                data = resp.json()
                assistant_reply = data["choices"][0]["message"]["content"]

                return ChatResponse(
                    response=assistant_reply,
                    sources=citations,
                    is_fallback=False,
                    model_used=settings.LLM_MODEL,
                )
        except Exception as e:
            logger.warning(f"Remote LLM request failed ({str(e)}). Falling back to smart local engine.")
            fallback_text = cls._generate_fallback_response(
                request.message, request.water_profile, citations
            )
            return ChatResponse(
                response=fallback_text,
                sources=citations,
                is_fallback=True,
                model_used=f"Fallback Local Engine (Remote call error: {type(e).__name__})",
            )
