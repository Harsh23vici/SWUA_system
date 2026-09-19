from fastapi import APIRouter
from .routes_calculator import router as calculator_router
from .routes_analysis import router as analysis_router
from .routes_chat import router as chat_router

api_router = APIRouter()
api_router.include_router(calculator_router)
api_router.include_router(analysis_router)
api_router.include_router(chat_router)
