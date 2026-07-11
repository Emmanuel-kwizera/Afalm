import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_health_endpoint():
    """Test the /health endpoint returns 200 OK and correct JSON"""
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"

def test_monitoring_endpoint():
    """Test the /monitoring endpoint returns system metrics"""
    response = client.get("/monitoring")
    assert response.status_code == 200
    data = response.json()
    assert "uptime_seconds" in data
    assert "system" in data
    assert "memory_percent" in data["system"]

def test_soil_prediction_endpoint():
    """Test the soil prediction endpoint with valid data"""
    payload = {
        "nitrogen": 90.0,
        "phosphorous": 42.0,
        "potassium": 43.0,
        "temperature": 20.8,
        "humidity": 82.0,
        "moisture": 65.0,
        "ph": 6.5,
        "rainfall": 202.9,
        "soil_type": "Loamy",
        "crop_type": "Rice"
    }
    response = client.post("/api/v1/predict/soil", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert "data" in data
    assert "crop_recommendation" in data["data"]
