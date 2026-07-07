from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_health_returns_ok() -> None:
    response = client.get("/health")

    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_predict_returns_typed_recommendation() -> None:
    response = client.post(
        "/predict",
        json={
            "race_id": "silverstone-2026-sim",
            "circuit": "Silverstone",
            "lap": 27,
            "total_laps": 52,
            "weather": "Cloud cover building",
            "track_temp_c": 31,
            "rain_chance": 0.18,
            "safety_car": "clear",
            "focus_driver": "NOR",
            "drivers": [
                {
                    "code": "NOR",
                    "name": "Lando Norris",
                    "team": "McLaren",
                    "position": 6,
                    "gap_seconds": 12.4,
                    "tyre": "medium",
                    "tyre_age": 18,
                    "pit_stops": 0,
                    "pace_delta": 0.47,
                }
            ],
        },
    )

    assert response.status_code == 200

    body = response.json()
    assert body["recommendation"] in {"pit_now", "stay_out", "monitor"}
    assert body["recommendation"] == "pit_now"
    assert 0 <= body["confidence"] <= 1
    assert body["risk_level"] in {"low", "medium", "high"}
    assert isinstance(body["reason"], str)
    assert isinstance(body["expected_time_delta"], float)
    assert body["suggested_compound"] == "hard"


def test_predict_sample_request_can_drive_prediction() -> None:
    sample_response = client.get("/predict/sample-request")

    assert sample_response.status_code == 200

    sample_request = sample_response.json()
    assert sample_request["race_id"] == "silverstone-2026-sim"
    assert sample_request["circuit"] == "Silverstone"
    assert sample_request["track_temp_c"] == 31.0
    assert sample_request["rain_chance"] == 0.18
    assert sample_request["safety_car"] == "clear"
    assert sample_request["focus_driver"] == "NOR"

    focus_driver = sample_request["drivers"][0]
    assert focus_driver["code"] == "NOR"
    assert focus_driver["gap_seconds"] == 12.4
    assert focus_driver["tyre"] == "medium"
    assert focus_driver["tyre_age"] == 18
    assert focus_driver["pace_delta"] == 0.47

    predict_response = client.post("/predict", json=sample_request)
    assert predict_response.status_code == 200
    assert predict_response.json()["recommendation"] == "pit_now"


def test_replay_returns_timeline_data() -> None:
    response = client.post(
        "/replay",
        json={
            "race_id": "silverstone-2026-sim",
            "focus_driver": "NOR",
            "from_lap": 18,
            "to_lap": 27,
        },
    )

    assert response.status_code == 200

    body = response.json()
    assert body["race_state"]["race_id"] == "silverstone-2026-sim"
    assert body["race_state"]["lap"] == 27
    assert body["race_state"]["total_laps"] == 52
    assert body["race_state"]["weather"] == "Cloud cover building"
    assert body["race_state"]["safety_car"] == "clear"

    assert body["replayState"] == {
        "raceId": "silverstone-2026-sim",
        "race": "Silverstone Strategy Lab",
        "session": "Race simulation",
        "circuit": "Silverstone",
        "currentLap": 27,
        "totalLaps": 52,
        "lapRange": {"fromLap": 18, "toLap": 27},
        "weather": "Cloud cover building",
        "safetyCar": "clear",
        "focusDriver": "NOR",
    }

    assert len(body["events"]) > 0
    assert body["timelineEvents"] == body["events"]
    for event in body["events"]:
        assert {"lap", "title", "detail", "type"} <= set(event)


def test_forecast_win_likelihood_returns_deterministic_probabilities() -> None:
    response = client.post(
        "/forecast/win-likelihood",
        json={
            "forecast_horizon": "next_2_races",
            "race_ids": ["monaco-2026", "canada-2026"],
            "include_sentiment": True,
        },
    )

    assert response.status_code == 200

    body = response.json()
    assert body["forecast_horizon"] == "next_2_races"
    assert body["race_ids"] == ["monaco-2026", "canada-2026"]
    assert body["generated_at"] == "2026-07-06T00:00:00Z"
    assert "deterministic sample data" in body["data_freshness"]
    assert 0 <= body["model_confidence"] <= 1

    assert len(body["races"]) == 2
    assert body["races"][0]["race_id"] == "monaco-2026"
    assert body["races"][1]["race_id"] == "canada-2026"

    assert len(body["driver_probabilities"]) > 0
    assert len(body["team_probabilities"]) > 0
    for probability in body["driver_probabilities"] + body["team_probabilities"]:
        assert 0 <= probability["probability"] <= 1
        assert probability["rank"] >= 1
        assert len(probability["top_factors"]) > 0

    assert len(body["top_factors"]) > 0
    assert {"label", "impact", "weight", "detail"} <= set(body["top_factors"][0])


def test_strategy_sample_matches_frontend_dashboard_contract() -> None:
    response = client.get("/strategy/sample")

    assert response.status_code == 200

    body = response.json()
    assert {
        "raceState",
        "drivers",
        "timelineEvents",
        "tyreData",
        "strategyBranches",
        "forecastPreview",
    } <= set(body)

    race_state = body["raceState"]
    assert race_state["race"] == "Silverstone Strategy Lab"
    assert race_state["totalLaps"] == 52
    assert race_state["trackTemp"] == "31 C"
    assert race_state["rainChance"] == "18%"
    assert race_state["focusDriver"] == "NOR"

    driver = body["drivers"][0]
    assert {"teamColor", "tyreAge", "pitStops", "paceDelta"} <= set(driver)
    assert driver["code"] == "NOR"
    assert driver["teamColor"] == "#ff8c1a"

    assert len(body["timelineEvents"]) > 0
    assert len(body["tyreData"]) > 0
    assert len(body["strategyBranches"]) > 0
    assert len(body["forecastPreview"]) > 0
