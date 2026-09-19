from enum import Enum
from typing import Optional
from pydantic import BaseModel, Field


class HouseType(str, Enum):
    APARTMENT = "apartment"
    INDEPENDENT_HOUSE = "independent_house"
    VILLA = "villa"


class ToiletFlushType(str, Enum):
    DUAL_FLUSH = "dual_flush"
    STANDARD_FLUSH = "standard_flush"


class DishwashingMethod(str, Enum):
    RUNNING_TAP = "running_tap"
    SINK_BASIN = "sink_basin"
    DISHWASHER = "dishwasher"


class CookingIntensity(str, Enum):
    LOW = "low"
    MODERATE = "moderate"
    HIGH = "high"


class MachineType(str, Enum):
    TOP_LOAD = "top_load"
    FRONT_LOAD = "front_load"
    MANUAL_HAND_WASH = "manual_hand_wash"


class VehicleWashMethod(str, Enum):
    HOSE = "hose"
    BUCKET = "bucket"
    NONE = "none"


class GardenWateringMethod(str, Enum):
    HOSE = "hose"
    DRIP_OR_CAN = "drip_or_can"
    NONE = "none"


class LeakType(str, Enum):
    NONE = "none"
    DRIPPING_FAUCET = "dripping_faucet"
    RUNNING_TOILET = "running_toilet"
    PIPE_SEEPAGE = "pipe_seepage"


class HouseholdAssessmentInput(BaseModel):
    # Household
    num_people: int = Field(default=3, ge=1, le=25, description="Number of household occupants")
    num_bathrooms: int = Field(default=2, ge=1, le=10, description="Number of bathrooms")
    house_type: HouseType = Field(default=HouseType.APARTMENT, description="Dwelling architecture")

    # Bathing
    showers_per_person_per_day: float = Field(default=1.0, ge=0.0, le=5.0, description="Average showers taken per person daily")
    shower_duration_minutes: float = Field(default=8.0, ge=1.0, le=45.0, description="Average duration of each shower in minutes")
    bucket_baths_per_day: float = Field(default=0.0, ge=0.0, le=10.0, description="Number of bucket baths taken per day in household")

    # Toilet
    flushes_per_person_per_day: float = Field(default=4.0, ge=1.0, le=15.0, description="Daily flushes per occupant")
    toilet_flush_type: ToiletFlushType = Field(default=ToiletFlushType.STANDARD_FLUSH, description="Toilet cistern mechanism")

    # Kitchen
    dishwashing_method: DishwashingMethod = Field(default=DishwashingMethod.RUNNING_TAP, description="Primary dishwashing technique")
    dishwashing_frequency_per_day: float = Field(default=2.0, ge=0.5, le=6.0, description="Dishwashing sessions per day")
    cooking_intensity: CookingIntensity = Field(default=CookingIntensity.MODERATE, description="Cooking water consumption level")

    # Laundry
    washing_machine_loads_per_week: float = Field(default=3.0, ge=0.0, le=25.0, description="Laundry loads executed per week")
    machine_type: MachineType = Field(default=MachineType.TOP_LOAD, description="Washing appliance specification")

    # Cleaning
    floor_cleaning_frequency_per_week: float = Field(default=3.0, ge=0.0, le=14.0, description="Floor mopping sessions per week")
    vehicle_washing_frequency_per_week: float = Field(default=1.0, ge=0.0, le=7.0, description="Vehicle washes conducted weekly")
    vehicle_washing_method: VehicleWashMethod = Field(default=VehicleWashMethod.BUCKET, description="Vehicle washing method")

    # Outdoor & Leaks
    garden_watering_frequency_per_week: float = Field(default=0.0, ge=0.0, le=7.0, description="Outdoor garden watering days per week")
    garden_watering_method: GardenWateringMethod = Field(default=GardenWateringMethod.NONE, description="Garden irrigation setup")
    garden_duration_minutes: float = Field(default=10.0, ge=0.0, le=60.0, description="Minutes spent watering per watering day")
    leak_detected: LeakType = Field(default=LeakType.NONE, description="Reported or observed household leaks")
    additional_notes: Optional[str] = Field(default="", max_length=500, description="User notes or context")
