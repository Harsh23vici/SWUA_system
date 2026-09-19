"""Tests for the deterministic water calculator service."""

import pytest
from backend.app.models.assessment import (
    HouseholdAssessmentInput,
    HouseType,
    ToiletFlushType,
    DishwashingMethod,
    MachineType,
    VehicleWashMethod,
    GardenWateringMethod,
    LeakType,
    CookingIntensity,
)
from backend.app.services.calculator_service import WaterCalculatorService


def test_standard_household_calculation():
    # 3-person apartment, 1 shower/day 8 mins, standard flush 4 flushes/day
    data = HouseholdAssessmentInput(
        num_people=3,
        num_bathrooms=2,
        house_type=HouseType.APARTMENT,
        showers_per_person_per_day=1.0,
        shower_duration_minutes=8.0,
        bucket_baths_per_day=0.0,
        flushes_per_person_per_day=4.0,
        toilet_flush_type=ToiletFlushType.STANDARD_FLUSH,
        dishwashing_method=DishwashingMethod.RUNNING_TAP,
        dishwashing_frequency_per_day=2.0,
        cooking_intensity=CookingIntensity.MODERATE,
        washing_machine_loads_per_week=3.0,
        machine_type=MachineType.TOP_LOAD,
        floor_cleaning_frequency_per_week=3.0,
        vehicle_washing_frequency_per_week=0.0,
        vehicle_washing_method=VehicleWashMethod.NONE,
        garden_watering_frequency_per_week=0.0,
        garden_watering_method=GardenWateringMethod.NONE,
        leak_detected=LeakType.NONE,
    )

    result = WaterCalculatorService.calculate_all(data)

    assert result.num_people == 3
    assert result.total_daily_liters > 0
    assert result.per_person_daily_liters > 0
    assert result.monthly_estimate_liters == round(result.total_daily_liters * 30, 2)
    assert result.yearly_estimate_liters == round(result.total_daily_liters * 365, 2)

    # Check that categories exist and percentages sum to approximately 100%
    total_pct = sum(item.percentage for item in result.category_breakdown)
    assert 98.0 <= total_pct <= 102.0


def test_leak_impact():
    base_data = HouseholdAssessmentInput(
        num_people=2,
        leak_detected=LeakType.NONE,
    )
    res_no_leak = WaterCalculatorService.calculate_all(base_data)

    leak_data = base_data.model_copy(update={"leak_detected": LeakType.RUNNING_TOILET})
    res_leak = WaterCalculatorService.calculate_all(leak_data)

    # Running toilet leak adds 220 L/day
    diff = res_leak.total_daily_liters - res_no_leak.total_daily_liters
    assert diff == pytest.approx(220.0, 0.1)


def test_dual_flush_vs_single_flush():
    data_single = HouseholdAssessmentInput(
        num_people=4,
        flushes_per_person_per_day=4.0,
        toilet_flush_type=ToiletFlushType.STANDARD_FLUSH,
    )
    res_single = WaterCalculatorService.calculate_toilet(data_single)

    data_dual = data_single.model_copy(update={"toilet_flush_type": ToiletFlushType.DUAL_FLUSH})
    res_dual = WaterCalculatorService.calculate_toilet(data_dual)

    # Dual flush should consume significantly less than standard flush
    assert res_dual < res_single
