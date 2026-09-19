"""API endpoints for wastage analysis and personalized recommendations."""

from fastapi import APIRouter, HTTPException, status
from ..models.assessment import HouseholdAssessmentInput
from ..models.calculation import AnalysisResponse
from ..services.calculator_service import WaterCalculatorService
from ..services.wastage_service import WastageAnalysisService

router = APIRouter(tags=["Analysis"])


@router.post(
    "/analyze",
    response_model=AnalysisResponse,
    summary="Analyze water consumption patterns and detect top 3 wastage sources",
    status_code=status.HTTP_200_OK,
)
def analyze_water_wastage(data: HouseholdAssessmentInput):
    """Pinpoints highest-impact water-saving opportunities and provides encouraging,

    constructive actions.
    """
    try:
        calculated_usage = WaterCalculatorService.calculate_all(data)
        return WastageAnalysisService.analyze(data, calculated_usage)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Analysis error: {str(e)}",
        )
