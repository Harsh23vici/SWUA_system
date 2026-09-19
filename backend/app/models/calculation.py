from typing import Dict, List, Optional
from pydantic import BaseModel, Field


class CategoryBreakdownItem(BaseModel):
    category_key: str
    category_name: str
    liters_per_day: float
    percentage: float
    description: str


class CalculatedUsageResponse(BaseModel):
    total_daily_liters: float = Field(..., description="Total estimated daily household water consumption in Liters")
    per_person_daily_liters: float = Field(..., description="Estimated water consumption per person per day in Liters")
    monthly_estimate_liters: float = Field(..., description="Projected monthly consumption (30-day)")
    yearly_estimate_liters: float = Field(..., description="Projected yearly consumption (365-day)")
    num_people: int
    category_breakdown: List[CategoryBreakdownItem]
    benchmark_status: str = Field(..., description="Comparison against standard: Conserving, Balanced, Elevated, High")
    benchmark_comparison_percent: float = Field(..., description="Percentage relative to the 140L/capita benchmark")
    disclaimer: str = (
        "All figures are deterministic behavioral estimates derived from standardized flow benchmarks, "
        "not physical meter measurements. Actual flow rates vary based on municipal water pressure and fixture age."
    )


class WastagePoint(BaseModel):
    rank: int
    category_key: str
    category_name: str
    estimated_water_impact_lpd: float
    why_it_matters: str
    recommended_action: str
    potential_water_saving_lpd: float
    potential_monthly_saving_liters: float
    difficulty: str = Field("Easy", description="Easy, Moderate, or Investment")


class AnalysisResponse(BaseModel):
    total_daily_liters: float
    per_person_daily_liters: float
    top_wastage_points: List[WastagePoint]
    total_potential_savings_lpd: float
    potential_monthly_savings_liters: float
    summary_advice: str
