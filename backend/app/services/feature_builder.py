from app.schemas.race_state import DriverRaceState, RaceStateRequest


def get_focus_driver(race_state: RaceStateRequest) -> DriverRaceState:
    for driver in race_state.drivers:
        if driver.code == race_state.focus_driver:
            return driver

    raise ValueError(f"Focus driver {race_state.focus_driver} was not found in race state")


def build_strategy_features(race_state: RaceStateRequest) -> dict[str, float | int | bool]:
    focus_driver = get_focus_driver(race_state)
    race_progress = race_state.lap / race_state.total_laps

    return {
        "lap": race_state.lap,
        "race_progress": race_progress,
        "tyre_age": focus_driver.tyre_age,
        "pace_delta": focus_driver.pace_delta,
        "pit_stops": focus_driver.pit_stops,
        "position": focus_driver.position,
        "gap_seconds": focus_driver.gap_seconds,
        "rain_chance": race_state.rain_chance,
        "track_temp_c": race_state.track_temp_c,
        "safety_car_active": race_state.safety_car in {"vsc", "safety_car"},
    }
