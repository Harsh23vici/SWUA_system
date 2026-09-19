"""API endpoints for Aqua Advisor chat and RAG knowledge exploration."""

from fastapi import APIRouter, HTTPException, status
from ..models.chat import ChatRequest, ChatResponse
from ..services.ai_service import AquaAdvisorService
from ..services.rag_service import RagKnowledgeService
from ..config import settings

router = APIRouter(tags=["Aqua Advisor"])


@router.post(
    "/chat",
    response_model=ChatResponse,
    summary="Chat with Aqua Advisor AI assistant about water usage",
    status_code=status.HTTP_200_OK,
)
async def chat_with_advisor(request: ChatRequest):
    """Processes user queries about household water consumption with RAG context."""
    if not request.message or not request.message.strip():
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Chat message cannot be empty.",
        )
    try:
        return await AquaAdvisorService.chat(request)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Chat processing failed: {str(e)}",
        )


@router.get(
    "/knowledge",
    summary="List all water conservation knowledge base entries",
    status_code=status.HTTP_200_OK,
)
def get_knowledge_base():
    """Returns curated water-saving reference entries."""
    service = RagKnowledgeService.get_instance()
    items = service.get_all_items()
    return {
        "status": "success",
        "count": len(items),
        "items": items,
    }


@router.get(
    "/health",
    summary="System health check endpoint",
    status_code=status.HTTP_200_OK,
)
def health_check():
    """Returns operational status of the service."""
    kb_count = len(RagKnowledgeService.get_instance().get_all_items())
    has_api_key = bool(settings.LLM_API_KEY.strip())

    return {
        "status": "healthy",
        "service": "Smart Water Usage Advisor API",
        "version": settings.VERSION,
        "knowledge_entries": kb_count,
        "llm_configured": has_api_key,
        "active_model": settings.LLM_MODEL if has_api_key else "Smart Local Heuristic Engine",
    }
