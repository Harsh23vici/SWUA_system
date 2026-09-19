"""Empirical water benchmark constants and assumption parameters.

All flow rates and volumes represent standardized empirical household averages
derived from international water stewardship benchmarks (EPA WaterSense, WHO,
and Central Public Health and Environmental Engineering Organisation).
All values are deterministic baseline estimates, not physical meter telemetry.
"""

from typing import Dict

# Bathing assumptions (Liters)
SHOWER_FLOW_RATE_STANDARD_LPM: float = 9.5  # Standard showerhead liters per minute
SHOWER_FLOW_RATE_ECO_LPM: float = 6.0       # Low-flow showerhead / aerator
BUCKET_BATH_STANDARD_L: float = 18.0        # Typical bucket capacity

# Toilet sanitation assumptions (Liters)
TOILET_STANDARD_FLUSH_L: float = 9.0        # Older single flush cistern
TOILET_DUAL_FLUSH_FULL_L: float = 6.0       # Dual flush full cycle
TOILET_DUAL_FLUSH_HALF_L: float = 3.0       # Dual flush liquid cycle
TOILET_DUAL_FLUSH_WEIGHTED_AVG_L: float = 4.2 # Empirical 2:1 liquid to solid ratio average

# Kitchen & Dining assumptions (Liters)
KITCHEN_RUNNING_TAP_LPM: float = 10.0       # Running faucet dishwashing per minute
KITCHEN_BASIN_DISHWASH_L: float = 24.0      # Two-basin wash & rinse method per session
DISHWASHER_STANDARD_CYCLE_L: float = 15.0   # Modern standard dishwasher cycle
COOKING_DRINKING_PER_PERSON_L: float = 6.0  # Basic food prep and drinking per person per day

# Laundry assumptions (Liters)
WASHING_MACHINE_TOP_LOAD_L: float = 110.0   # Standard top-loader cycle
WASHING_MACHINE_FRONT_LOAD_L: float = 55.0  # High efficiency front-loader cycle
HAND_WASH_LAUNDRY_L: float = 35.0           # Manual bucket laundry per load

# Cleaning & Hygiene (Liters)
FLOOR_CLEANING_PER_MOP_L: float = 15.0      # Water used per floor mopping round
VEHICLE_WASH_HOSE_L: float = 180.0          # Washing a car/bike with running hosepipe
VEHICLE_WASH_BUCKET_L: float = 30.0         # 2 buckets with microfiber cloth

# Outdoor & Gardening (Liters)
GARDEN_HOSE_LPM: float = 15.0               # Running hose per minute
GARDEN_DRIP_OR_CAN_L: float = 20.0          # Controlled drip / manual watering can per day

# Leakage estimates (Liters per day)
LEAK_NONE_LPD: float = 0.0
LEAK_DRIPPING_FAUCET_LPD: float = 25.0      # Slow drip (1 drip per second = ~25-30 L/day)
LEAK_RUNNING_TOILET_LPD: float = 220.0      # Silent toilet tank flapper leak
LEAK_PIPE_SEEPAGE_LPD: float = 80.0         # Concealed pipe / valve seep

# Per-capita benchmarks for comparison (Liters per person per day)
BENCHMARK_WHO_MINIMUM_SURVIVAL: float = 50.0 # Essential health & hygiene minimum
BENCHMARK_SUSTAINABLE_GOAL: float = 100.0   # Sustainable target for modern urban households
BENCHMARK_GLOBAL_URBAN_AVG: float = 140.0   # Typical urban benchmark (CPHEEO / international)

# Dictionary of all constants for transparency in API responses
BENCHMARK_ASSUMPTIONS: Dict[str, dict] = {
    "shower_flow_rate_standard": {
        "value": SHOWER_FLOW_RATE_STANDARD_LPM,
        "unit": "L/min",
        "description": "Standard showerhead flow without flow restrictor"
    },
    "shower_flow_rate_eco": {
        "value": SHOWER_FLOW_RATE_ECO_LPM,
        "unit": "L/min",
        "description": "Aerated eco showerhead flow"
    },
    "bucket_bath_volume": {
        "value": BUCKET_BATH_STANDARD_L,
        "unit": "Liters/bucket",
        "description": "Standard bucket bath volume"
    },
    "toilet_standard_flush": {
        "value": TOILET_STANDARD_FLUSH_L,
        "unit": "Liters/flush",
        "description": "Single-flush conventional cistern"
    },
    "toilet_dual_flush_avg": {
        "value": TOILET_DUAL_FLUSH_WEIGHTED_AVG_L,
        "unit": "Liters/flush",
        "description": "Dual flush weighted average (3L half / 6L full)"
    },
    "washing_machine_top_load": {
        "value": WASHING_MACHINE_TOP_LOAD_L,
        "unit": "Liters/load",
        "description": "Conventional top-loading washing machine"
    },
    "washing_machine_front_load": {
        "value": WASHING_MACHINE_FRONT_LOAD_L,
        "unit": "Liters/load",
        "description": "High-efficiency front-loading machine"
    },
    "vehicle_wash_hose": {
        "value": VEHICLE_WASH_HOSE_L,
        "unit": "Liters/wash",
        "description": "Vehicle washing with continuous open hose"
    },
    "vehicle_wash_bucket": {
        "value": VEHICLE_WASH_BUCKET_L,
        "unit": "Liters/wash",
        "description": "Vehicle washing with 2 buckets and cloth"
    },
    "dripping_faucet_leak": {
        "value": LEAK_DRIPPING_FAUCET_LPD,
        "unit": "Liters/day",
        "description": "Continuous dripping faucet (~60 drops/min)"
    },
    "running_toilet_leak": {
        "value": LEAK_RUNNING_TOILET_LPD,
        "unit": "Liters/day",
        "description": "Silent flapper valve leak in toilet cistern"
    }
}
