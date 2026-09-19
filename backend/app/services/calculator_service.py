"""Deterministic Water Usage Calculation Engine.

Calculates category-wise water consumption and totals using empirical constants
defined in water_benchmarks.py. No machine learning is used; calculations are
transparent, deterministic, and easily auditable.
"""

from typing import List, Tuple
from ..models.assessment import (
    HouseholdAssessmentInput,
    DishwashingMethod,
    ToiletFlushType,
    MachineType,
    VehicleWashMethod,
    GardenWateringMethod,
    LeakType,
    CookingIntensity,
)
from ..models.calculation import CategoryBreakdownItem, CalculatedUsageResponse
from ..constants.water_benchmarks import (
    SHOWER_FLOW_RATE_STANDARD_LPM,
    BUCKET_BATH_STANDARD_L,
    TOILET_STANDARD_FLUSH_L,
    TOILET_DUAL_FLUSH_WEIGHTED_AVG_L,
    KITCHEN_RUNNING_TAP_LPM,
    KITCHEN_BASIN_DISHWASH_L,
    DISHWASHER_STANDARD_CYCLE_L,
    COOKING_DRINKING_PER_PERSON_L,
    WASHING_MACHINE_TOP_LOAD_L,
    WASHING_MACHINE_FRONT_LOAD_L,
    HAND_WASH_LAUNDRY_L,
    FLOOR_CLEANING_PER_MOP_L,
    VEHICLE_WASH_HOSE_L,
    VEHICLE_WASH_BUCKET_L,
    GARDEN_HOSE_LPM,
    GARDEN_DRIP_OR_CAN_L,
    LEAK_DRIPPING_FAUCET_LPD,
    LEAK_RUNNING_TOILET_LPD,
    LEAK_PIPE_SEEPAGE_LPD,
    BENCHMARK_GLOBAL_URBAN_AVG,
)


class WaterCalculatorService:
    @staticmethod
    def calculate_bathing(data: HouseholdAssessmentInput) -> float:
        # Shower water: people * showers/day * duration * flow rate
        shower_volume_per_person = data.showers_per_person_per_day * data.shower_duration_minutes * SHOWER_FLOW_RATE_STANDARD_LPM
        total_shower_daily = data.num_people * shower_volume_per_person
        
        # Bucket baths
        total_bucket_daily = data.bucket_baths_per_day * BUCKET_BATH_STANDARD_L
        return round(total_shower_daily + total_bucket_daily, 2)

    @staticmethod
    def calculate_toilet(data: HouseholdAssessmentInput) -> float:
        flush_vol = (
            TOILET_DUAL_FLUSH_WEIGHTED_AVG_L
            if data.toilet_flush_type == ToiletFlushType.DUAL_FLUSH
            else TOILET_STANDARD_FLUSH_L
        )
        total_daily = data.num_people * data.flushes_per_person_per_day * flush_vol
        return round(total_daily, 2)

    @staticmethod
    def calculate_kitchen(data: HouseholdAssessmentInput) -> float:
        # Dishwashing
        if data.dishwashing_method == DishwashingMethod.RUNNING_TAP:
            # Approx 7 minutes running tap per session
            dish_vol = 7.0 * KITCHEN_RUNNING_TAP_LPM * data.dishwashing_frequency_per_day
        elif data.dishwashing_method == DishwashingMethod.SINK_BASIN:
            dish_vol = KITCHEN_BASIN_DISHWASH_L * data.dishwashing_frequency_per_day
        else: # Dishwasher
            dish_vol = DISHWASHER_STANDARD_CYCLE_L * data.dishwashing_frequency_per_day

        # Cooking & Drinking
        intensity_multiplier = {
            CookingIntensity.LOW: 0.75,
            CookingIntensity.MODERATE: 1.0,
            CookingIntensity.HIGH: 1.4,
        }[data.cooking_intensity]
        cook_vol = data.num_people * COOKING_DRINKING_PER_PERSON_L * intensity_multiplier

        return round(dish_vol + cook_vol, 2)

    @staticmethod
    def calculate_laundry(data: HouseholdAssessmentInput) -> float:
        if data.washing_machine_loads_per_week <= 0:
            return 0.0

        if data.machine_type == MachineType.FRONT_LOAD:
            load_vol = WASHING_MACHINE_FRONT_LOAD_L
        elif data.machine_type == MachineType.MANUAL_HAND_WASH:
            load_vol = HAND_WASH_LAUNDRY_L
        else:
            load_vol = WASHING_MACHINE_TOP_LOAD_L

        weekly_vol = data.washing_machine_loads_per_week * load_vol
        return round(weekly_vol / 7.0, 2)

    @staticmethod
    def calculate_cleaning(data: HouseholdAssessmentInput) -> float:
        # Floor cleaning (weekly to daily)
        floor_daily = (data.floor_cleaning_frequency_per_week * FLOOR_CLEANING_PER_MOP_L) / 7.0

        # Vehicle washing (weekly to daily)
        if data.vehicle_washing_method == VehicleWashMethod.HOSE:
            veh_load = VEHICLE_WASH_HOSE_L
        elif data.vehicle_washing_method == VehicleWashMethod.BUCKET:
            veh_load = VEHICLE_WASH_BUCKET_L
        else:
            veh_load = 0.0

        veh_daily = (data.vehicle_washing_frequency_per_week * veh_load) / 7.0
        return round(floor_daily + veh_daily, 2)

    @staticmethod
    def calculate_gardening(data: HouseholdAssessmentInput) -> float:
        if data.garden_watering_frequency_per_week <= 0 or data.garden_watering_method == GardenWateringMethod.NONE:
            return 0.0

        if data.garden_watering_method == GardenWateringMethod.HOSE:
            session_vol = data.garden_duration_minutes * GARDEN_HOSE_LPM
        else: # drip or can
            session_vol = GARDEN_DRIP_OR_CAN_L

        weekly_vol = data.garden_watering_frequency_per_week * session_vol
        return round(weekly_vol / 7.0, 2)

    @staticmethod
    def calculate_leakage(data: HouseholdAssessmentInput) -> float:
        leak_map = {
            LeakType.NONE: 0.0,
            LeakType.DRIPPING_FAUCET: LEAK_DRIPPING_FAUCET_LPD,
            LeakType.RUNNING_TOILET: LEAK_RUNNING_TOILET_LPD,
            LeakType.PIPE_SEEPAGE: LEAK_PIPE_SEEPAGE_LPD,
        }
        return leak_map.get(data.leak_detected, 0.0)

    @staticmethod
    def calculate_hygiene_other(data: HouseholdAssessmentInput) -> float:
        # Hand washing, brushing teeth, shaving buffers (~8L/person/day)
        return round(data.num_people * 8.0, 2)

    @classmethod
    def calculate_all(cls, data: HouseholdAssessmentInput) -> CalculatedUsageResponse:
        bathing = cls.calculate_bathing(data)
        toilet = cls.calculate_toilet(data)
        kitchen = cls.calculate_kitchen(data)
        laundry = cls.calculate_laundry(data)
        cleaning = cls.calculate_cleaning(data)
        gardening = cls.calculate_gardening(data)
        leakage = cls.calculate_leakage(data)
        other = cls.calculate_hygiene_other(data)

        total_daily = round(bathing + toilet + kitchen + laundry + cleaning + gardening + leakage + other, 2)
        total_daily_safe = max(total_daily, 1.0)
        per_person_daily = round(total_daily / max(data.num_people, 1), 2)
        monthly = round(total_daily * 30.0, 2)
        yearly = round(total_daily * 365.0, 2)

        # Category Breakdown
        categories_raw = [
            ("bathing", "Bathing & Showers", bathing, "Showers and bucket baths"),
            ("toilet", "Toilet Sanitation", toilet, "Cistern flushing"),
            ("kitchen", "Kitchen & Cooking", kitchen, "Dishwashing, cooking and drinking"),
            ("laundry", "Laundry Washing", laundry, "Clothes washing cycles"),
            ("cleaning", "Cleaning & Vehicles", cleaning, "Floor mopping and vehicle washing"),
            ("gardening", "Outdoor & Garden", gardening, "Plant irrigation and lawn watering"),
            ("leakage", "Leaks & Seepage", leakage, "Dripping taps and cistern seepage"),
            ("other", "Hygiene & Other", other, "Hand washing, dental, shaving"),
        ]

        breakdown: List[CategoryBreakdownItem] = []
        for key, name, val, desc in categories_raw:
            pct = round((val / total_daily_safe) * 100.0, 1)
            breakdown.append(
                CategoryBreakdownItem(
                    category_key=key,
                    category_name=name,
                    liters_per_day=val,
                    percentage=pct,
                    description=desc,
                )
            )

        # Sort breakdown by highest usage descending
        breakdown.sort(key=lambda x: x.liters_per_day, reverse=True)

        # Benchmark comparison
        percent_of_benchmark = round((per_person_daily / BENCHMARK_GLOBAL_URBAN_AVG) * 100.0, 1)
        if per_person_daily <= 80.0:
            benchmark_status = "Water Wise (Conserving)"
        elif per_person_daily <= 140.0:
            benchmark_status = "Balanced (Average)"
        elif per_person_daily <= 200.0:
            benchmark_status = "Elevated Usage"
        else:
            benchmark_status = "High Usage"

        return CalculatedUsageResponse(
            total_daily_liters=total_daily,
            per_person_daily_liters=per_person_daily,
            monthly_estimate_liters=monthly,
            yearly_estimate_liters=yearly,
            num_people=data.num_people,
            category_breakdown=breakdown,
            benchmark_status=benchmark_status,
            benchmark_comparison_percent=percent_of_benchmark,
        )
