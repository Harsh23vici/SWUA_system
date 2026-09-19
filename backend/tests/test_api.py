"""Integration tests for FastAPI endpoints."""

from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)


def test_health_endpoint():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["knowledge_entries"] > 0


def test_benchmarks_endpoint():
    response = client.get("/api/benchmarks")
    assert response.status_code == 200
    data = response.json()
    assert "assumptions" in data
    assert "shower_flow_rate_standard" in data["assumptions"]


def test_calculate_endpoint():
    payload = {
        "num_people": 3,
        "num_bathrooms": 2,
        "house_type": "apartment",
        "showers_per_person_per_day": 1,
        "shower_duration_minutes": 8,
        "bucket_baths_per_day": 0,
        "flushes_per_person_per_day": 4,
        "toilet_flush_type": "standard_flush",
        "dishwashing_method": "running_tap",
        "dishwashing_frequency_per_day": 2,
        "cooking_intensity": "moderate",
        "washing_machine_loads_per_week": 3,
        "machine_type": "top_load",
        "floor_cleaning_frequency_per_week": 3,
        "vehicle_washing_frequency_per_week": 0,
        "vehicle_washing_method": "none",
        "garden_watering_frequency_per_week": 0,
        "garden_watering_method": "none",
        "garden_duration_minutes": 0,
        "leak_detected": "none",
        "additional_notes": "Test assessment",
    }
    response = client.post("/api/calculate", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "total_daily_liters" in data
    assert data["total_daily_liters"] > 100
    assert len(data["category_breakdown"]) > 0


def test_analyze_endpoint():
    payload = {
        "num_people": 4,
        "num_bathrooms": 2,
        "house_type": "apartment",
        "showers_per_person_per_day": 1.5,
        "shower_duration_minutes": 12,
        "bucket_baths_per_day": 0,
        "flushes_per_person_per_day": 4,
        "toilet_flush_type": "standard_flush",
        "dishwashing_method": "running_tap",
        "dishwashing_frequency_per_day": 2,
        "cooking_intensity": "moderate",
        "washing_machine_loads_per_week": 4,
        "machine_type": "top_load",
        "floor_cleaning_frequency_per_week": 3,
        "vehicle_washing_frequency_per_week": 1,
        "vehicle_washing_method": "hose",
        "garden_watering_frequency_per_week": 0,
        "garden_watering_method": "none",
        "garden_duration_minutes": 0,
        "leak_detected": "running_toilet",
    }
    response = client.post("/api/analyze", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "top_wastage_points" in data
    assert len(data["top_wastage_points"]) >= 1
    assert data["total_potential_savings_lpd"] > 0


def test_chat_endpoint_fallback():
    # Calling chat without API key should succeed with smart local fallback
    payload = {
        "message": "How much water does a 10-minute shower waste?",
        "water_profile": {
            "num_people": 3,
            "total_daily_liters": 450,
            "per_person_daily_liters": 150,
            "benchmark_status": "Elevated Usage",
        },
    }
    response = client.post("/api/chat", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "response" in data
    assert len(data["response"]) > 20
    assert len(data["sources"]) > 0
    assert data["is_fallback"] is True
