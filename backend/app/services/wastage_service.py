"""Wastage Analysis Engine.

Pinpoints top water wastage sources from calculated usage and assessment data,
providing encouraging, supportive, and non-judgmental recommendations with
quantifiable potential savings.
"""

from typing import List
from ..models.assessment import (
    HouseholdAssessmentInput,
    ToiletFlushType,
    DishwashingMethod,
    MachineType,
    VehicleWashMethod,
    GardenWateringMethod,
    LeakType,
)
from ..models.calculation import (
    CalculatedUsageResponse,
    WastagePoint,
    AnalysisResponse,
)
from ..constants.water_benchmarks import (
    SHOWER_FLOW_RATE_STANDARD_LPM,
    SHOWER_FLOW_RATE_ECO_LPM,
    TOILET_STANDARD_FLUSH_L,
    TOILET_DUAL_FLUSH_WEIGHTED_AVG_L,
    KITCHEN_RUNNING_TAP_LPM,
    WASHING_MACHINE_TOP_LOAD_L,
    WASHING_MACHINE_FRONT_LOAD_L,
    VEHICLE_WASH_HOSE_L,
    VEHICLE_WASH_BUCKET_L,
    LEAK_DRIPPING_FAUCET_LPD,
    LEAK_RUNNING_TOILET_LPD,
    LEAK_PIPE_SEEPAGE_LPD,
)


class WastageAnalysisService:
    @classmethod
    def analyze(
        cls, assessment: HouseholdAssessmentInput, calculation: CalculatedUsageResponse
    ) -> AnalysisResponse:
        candidates: List[WastagePoint] = []

        # 1. Leakage Analysis (Highest priority if present)
        if assessment.leak_detected != LeakType.NONE:
            if assessment.leak_detected == LeakType.RUNNING_TOILET:
                candidates.append(
                    WastagePoint(
                        rank=0,
                        category_key="leakage",
                        category_name="Running Toilet Flapper",
                        estimated_water_impact_lpd=LEAK_RUNNING_TOILET_LPD,
                        why_it_matters="A worn toilet flapper valve silently leaks clean potable water around the clock without visible overflows.",
                        recommended_action="Replace the rubber flapper or flush valve seal in the cistern (often takes under 15 minutes and costs very little).",
                        potential_water_saving_lpd=LEAK_RUNNING_TOILET_LPD,
                        potential_monthly_saving_liters=LEAK_RUNNING_TOILET_LPD * 30.0,
                        difficulty="Easy",
                    )
                )
            elif assessment.leak_detected == LeakType.DRIPPING_FAUCET:
                candidates.append(
                    WastagePoint(
                        rank=0,
                        category_key="leakage",
                        category_name="Dripping Faucets",
                        estimated_water_impact_lpd=LEAK_DRIPPING_FAUCET_LPD,
                        why_it_matters="A slow drip of 1 drop per second quietly wastes over 9,000 liters of water each year.",
                        recommended_action="Replace the inner rubber washer or ceramic cartridge to restore a tight seal.",
                        potential_water_saving_lpd=LEAK_DRIPPING_FAUCET_LPD,
                        potential_monthly_saving_liters=LEAK_DRIPPING_FAUCET_LPD * 30.0,
                        difficulty="Easy",
                    )
                )
            elif assessment.leak_detected == LeakType.PIPE_SEEPAGE:
                candidates.append(
                    WastagePoint(
                        rank=0,
                        category_key="leakage",
                        category_name="Concealed Pipe Seepage",
                        estimated_water_impact_lpd=LEAK_PIPE_SEEPAGE_LPD,
                        why_it_matters="Pipe seepage not only loses treated water but can weaken wall plaster and structural integrity.",
                        recommended_action="Inspect under-sink valves and joint seals, or consult a licensed plumber to tighten connections.",
                        potential_water_saving_lpd=LEAK_PIPE_SEEPAGE_LPD,
                        potential_monthly_saving_liters=LEAK_PIPE_SEEPAGE_LPD * 30.0,
                        difficulty="Moderate",
                    )
                )

        # 2. Bathing & Shower Duration Analysis
        if assessment.shower_duration_minutes > 5.0 and assessment.showers_per_person_per_day > 0:
            excess_mins = assessment.shower_duration_minutes - 5.0
            shower_waste_lpd = round(
                assessment.num_people * assessment.showers_per_person_per_day * excess_mins * SHOWER_FLOW_RATE_STANDARD_LPM,
                1,
            )
            if shower_waste_lpd > 20:
                candidates.append(
                    WastagePoint(
                        rank=0,
                        category_key="bathing",
                        category_name="Extended Shower Routine",
                        estimated_water_impact_lpd=round(
                            assessment.num_people * assessment.showers_per_person_per_day * assessment.shower_duration_minutes * SHOWER_FLOW_RATE_STANDARD_LPM,
                            1,
                        ),
                        why_it_matters="Your shower routine is one of the easiest and most refreshing places to save water without losing comfort.",
                        recommended_action="Gently shorten showers toward 5 minutes, or install an aerated low-flow showerhead to maintain pressure with 40% less flow.",
                        potential_water_saving_lpd=shower_waste_lpd,
                        potential_monthly_saving_liters=round(shower_waste_lpd * 30.0, 1),
                        difficulty="Easy",
                    )
                )

        # 3. Toilet Cistern Type Analysis
        if assessment.toilet_flush_type == ToiletFlushType.STANDARD_FLUSH:
            delta_per_flush = TOILET_STANDARD_FLUSH_L - TOILET_DUAL_FLUSH_WEIGHTED_AVG_L
            toilet_waste_lpd = round(
                assessment.num_people * assessment.flushes_per_person_per_day * delta_per_flush, 1
            )
            if toilet_waste_lpd > 15:
                candidates.append(
                    WastagePoint(
                        rank=0,
                        category_key="toilet",
                        category_name="Single-Flush Cistern",
                        estimated_water_impact_lpd=round(
                            assessment.num_people * assessment.flushes_per_person_per_day * TOILET_STANDARD_FLUSH_L, 1
                        ),
                        why_it_matters="Older single-flush tanks discharge a full 9-12 liters regardless of whether liquid or solid waste is being flushed.",
                        recommended_action="Place a water displacement bag/bottle in the cistern, or install an inexpensive dual-flush conversion valve.",
                        potential_water_saving_lpd=toilet_waste_lpd,
                        potential_monthly_saving_liters=round(toilet_waste_lpd * 30.0, 1),
                        difficulty="Easy",
                    )
                )

        # 4. Kitchen Dishwashing Analysis
        if assessment.dishwashing_method == DishwashingMethod.RUNNING_TAP:
            # Running tap dishes wastes ~45 L compared to two-basin or eco dishwasher
            kitchen_waste_lpd = round(45.0 * assessment.dishwashing_frequency_per_day, 1)
            candidates.append(
                WastagePoint(
                    rank=0,
                    category_key="kitchen",
                    category_name="Continuous Running Tap Dishwashing",
                    estimated_water_impact_lpd=round(
                        7.0 * KITCHEN_RUNNING_TAP_LPM * assessment.dishwashing_frequency_per_day, 1
                    ),
                    why_it_matters="A running kitchen tap releases up to 10 liters per minute while plates are merely being scrubbed.",
                    recommended_action="Try the two-basin method (soak & scrub in basin 1, dip & rinse in basin 2) or install a swivel tap aerator.",
                    potential_water_saving_lpd=kitchen_waste_lpd,
                    potential_monthly_saving_liters=round(kitchen_waste_lpd * 30.0, 1),
                    difficulty="Easy",
                )
            )

        # 5. Vehicle Washing Analysis
        if (
            assessment.vehicle_washing_method == VehicleWashMethod.HOSE
            and assessment.vehicle_washing_frequency_per_week > 0
        ):
            delta_wash = VEHICLE_WASH_HOSE_L - VEHICLE_WASH_BUCKET_L
            vehicle_waste_lpd = round(
                (assessment.vehicle_washing_frequency_per_week * delta_wash) / 7.0, 1
            )
            candidates.append(
                WastagePoint(
                    rank=0,
                    category_key="cleaning",
                    category_name="Hosepipe Vehicle Washing",
                    estimated_water_impact_lpd=round(
                        (assessment.vehicle_washing_frequency_per_week * VEHICLE_WASH_HOSE_L) / 7.0, 1
                    ),
                    why_it_matters="An open garden hose consumes 180+ liters in 15 minutes, whereas 2 buckets achieve the same spotless shine.",
                    recommended_action="Switch to a 2-bucket wash with microfiber towels, or attach an automatic trigger shut-off nozzle to your hose.",
                    potential_water_saving_lpd=vehicle_waste_lpd,
                    potential_monthly_saving_liters=round(vehicle_waste_lpd * 30.0, 1),
                    difficulty="Easy",
                )
            )

        # 6. Laundry Appliance Analysis
        if (
            assessment.machine_type == MachineType.TOP_LOAD
            and assessment.washing_machine_loads_per_week >= 2.0
        ):
            delta_laundry = WASHING_MACHINE_TOP_LOAD_L - WASHING_MACHINE_FRONT_LOAD_L
            laundry_waste_lpd = round(
                (assessment.washing_machine_loads_per_week * delta_laundry) / 7.0, 1
            )
            candidates.append(
                WastagePoint(
                    rank=0,
                    category_key="laundry",
                    category_name="Conventional Top-Load Laundry",
                    estimated_water_impact_lpd=round(
                        (assessment.washing_machine_loads_per_week * WASHING_MACHINE_TOP_LOAD_L) / 7.0, 1
                    ),
                    why_it_matters="Standard top-loaders submerge all clothes in deep water, consuming nearly double the water of high-efficiency machines.",
                    recommended_action="Always wash full loads, skip extra rinse cycles when possible, and consider a front-load high-efficiency machine when upgrading.",
                    potential_water_saving_lpd=laundry_waste_lpd,
                    potential_monthly_saving_liters=round(laundry_waste_lpd * 30.0, 1),
                    difficulty="Moderate",
                )
            )

        # 7. Gardening Analysis
        if (
            assessment.garden_watering_method == GardenWateringMethod.HOSE
            and assessment.garden_watering_frequency_per_week >= 2.0
        ):
            garden_waste_lpd = round(
                (assessment.garden_watering_frequency_per_week * (assessment.garden_duration_minutes * 15.0 - 20.0)) / 7.0, 1
            )
            if garden_waste_lpd > 10.0:
                candidates.append(
                    WastagePoint(
                        rank=0,
                        category_key="gardening",
                        category_name="Open Hose Garden Watering",
                        estimated_water_impact_lpd=round(
                            (assessment.garden_watering_frequency_per_week * assessment.garden_duration_minutes * 15.0) / 7.0, 1
                        ),
                        why_it_matters="Unregulated hose watering often causes rapid run-off and midday evaporation before roots can absorb it.",
                        recommended_action="Water before 8:00 AM using a watering can or drip kit, and spread organic mulch around plants to retain moisture.",
                        potential_water_saving_lpd=garden_waste_lpd,
                        potential_monthly_saving_liters=round(garden_waste_lpd * 30.0, 1),
                        difficulty="Easy",
                    )
                )

        # Fallback candidate if usage is already extremely low and no waste found
        if not candidates:
            candidates.append(
                WastagePoint(
                    rank=1,
                    category_key="general",
                    category_name="General Fixture Optimization",
                    estimated_water_impact_lpd=15.0,
                    why_it_matters="Your household is already quite efficient! Fine-tuning fixture aerators can lock in additional baseline gains.",
                    recommended_action="Install 2-4 L/min aerators on bathroom basin taps to maintain water efficiency effortlessly.",
                    potential_water_saving_lpd=15.0,
                    potential_monthly_saving_liters=450.0,
                    difficulty="Easy",
                )
            )

        # Sort candidates by potential water saving descending
        candidates.sort(key=lambda x: x.potential_water_saving_lpd, reverse=True)

        # Pick top 3
        top_3 = candidates[:3]
        for idx, item in enumerate(top_3):
            item.rank = idx + 1

        total_savings_lpd = round(sum(p.potential_water_saving_lpd for p in top_3), 1)
        potential_monthly = round(total_savings_lpd * 30.0, 1)

        # Craft encouraging summary
        if total_savings_lpd > 100:
            summary = (
                f"Great news: by adopting a few simple changes in your top areas, your household can save "
                f"an estimated {total_savings_lpd:,.0f} liters every single day—that's over {potential_monthly:,.0f} liters every month!"
            )
        else:
            summary = (
                f"You are already practicing mindful consumption! Taking action on your top recommendations "
                f"can help you conserve an extra {total_savings_lpd:,.0f} liters daily ({potential_monthly:,.0f} L/month)."
            )

        return AnalysisResponse(
            total_daily_liters=calculation.total_daily_liters,
            per_person_daily_liters=calculation.per_person_daily_liters,
            top_wastage_points=top_3,
            total_potential_savings_lpd=total_savings_lpd,
            potential_monthly_savings_liters=potential_monthly,
            summary_advice=summary,
        )
