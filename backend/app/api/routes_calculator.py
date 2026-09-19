"""API endpoints for water consumption calculation and empirical benchmarks."""

from fastapi import APIRouter, HTTPException, status
from ..models.assessment import HouseholdAssessmentInput
from ..models.calculation import CalculatedUsageResponse
from ..services.calculator_service import WaterCalculatorService
from ..constants.water_benchmarks import BENCHMARK_ASSUMPTIONS, BENCHMARK_GLOBAL_URBAN_AVG, BENCHMARK_SUSTAINABLE_GOAL

router = APIRouter(tags=["Calculator"])


@router.post(
    "/calculate",
    response_model=CalculatedUsageResponse,
    summary="Calculate estimated daily household water consumption",
    status_code=status.HTTP_200_OK,
)
def calculate_water_usage(data: HouseholdAssessmentInput):
    """Calculates category-wise water consumption and totals using empirical constants.

    All estimates are deterministic.
    """
    try:
        return WaterCalculatorService.calculate_all(data)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Calculation error: {str(e)}",
        )


@router.get(
    "/benchmarks",
    summary="Retrieve empirical flow constants and benchmark assumptions",
    status_code=status.HTTP_200_OK,
)
def get_benchmarks():
    """Returns flow constants, standard volumes, and per-capita baseline thresholds."""
    return {
        "status": "success",
        "global_urban_benchmark_lpd": BENCHMARK_GLOBAL_URBAN_AVG,
        "sustainable_target_lpd": BENCHMARK_SUSTAINABLE_GOAL,
        "assumptions": BENCHMARK_ASSUMPTIONS,
    }
