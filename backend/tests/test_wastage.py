"""Tests for the wastage analysis engine."""

from backend.app.models.assessment import HouseholdAssessmentInput, LeakType, ToiletFlushType
from backend.app.services.calculator_service import WaterCalculatorService
from backend.app.services.wastage_service import WastageAnalysisService


def test_wastage_identifies_top_three():
    # Long shower (15 mins), single flush, running toilet leak
    data = HouseholdAssessmentInput(
        num_people=4,
        shower_duration_minutes=15.0,
        toilet_flush_type=ToiletFlushType.STANDARD_FLUSH,
        leak_detected=LeakType.RUNNING_TOILET,
    )
    calc = WaterCalculatorService.calculate_all(data)
    analysis = WastageAnalysisService.analyze(data, calc)

    assert len(analysis.top_wastage_points) <= 3
    assert len(analysis.top_wastage_points) > 0
    assert analysis.total_potential_savings_lpd > 0
    assert analysis.potential_monthly_savings_liters == round(analysis.total_potential_savings_lpd * 30, 1)

    # Ranks should be 1, 2, 3
    ranks = [p.rank for p in analysis.top_wastage_points]
    assert ranks == list(range(1, len(ranks) + 1))

    # Language check: summary should be positive and encouraging
    assert "save" in analysis.summary_advice.lower()
    assert "wasting too much" not in analysis.summary_advice.lower()
