from app.schemas.prediction import PredictionResponse
from app.schemas.race_state import RaceStateRequest
from app.services.feature_builder import build_strategy_features, get_focus_driver


def predict_pit_strategy(race_state: RaceStateRequest) -> PredictionResponse:
    focus_driver = get_focus_driver(race_state)
    features = build_strategy_features(race_state)

    if features["safety_car_active"] and focus_driver.pit_stops == 0:
        return PredictionResponse(
            recommendation="pit_now",
            confidence=0.91,
            reason="A neutralized race window lowers pit loss and the focus driver has not stopped yet.",
            risk_level="low",
            expected_time_delta=6.2,
            suggested_compound="hard",
            top_factors=["active safety car window", "zero pit stops", "reduced pit loss"],
        )

    if (
        focus_driver.tyre in {"medium", "soft"}
        and focus_driver.tyre_age >= 17
        and focus_driver.pace_delta >= 0.4
    ):
        return PredictionResponse(
            recommendation="pit_now",
            confidence=0.86,
            reason="Tyre age and recent pace loss suggest the current stint is near the cliff.",
            risk_level="medium",
            expected_time_delta=4.8,
            suggested_compound="hard",
            top_factors=["high tyre age", "pace loss above threshold", "hard tyre recovery window"],
        )

    if focus_driver.tyre_age <= 8 and focus_driver.pace_delta <= 0.15:
        return PredictionResponse(
            recommendation="stay_out",
            confidence=0.78,
            reason="The tyre is still in its working range and pace loss is controlled.",
            risk_level="low",
            expected_time_delta=1.6,
            suggested_compound=None,
            top_factors=["low tyre age", "stable pace", "track position protection"],
        )

    return PredictionResponse(
        recommendation="monitor",
        confidence=0.68,
        reason="The stint is approaching the decision window, but the current data does not force a stop.",
        risk_level="medium",
        expected_time_delta=0.4,
        suggested_compound=None,
        top_factors=["moderate tyre age", "uncertain traffic window", "weather risk under watch"],
    )
