# RaceIQ API

## Backend

Base URL:

```txt
http://localhost:8000
```

## Health Check

```http
GET /health
```

Example response:

```json
{
  "status": "ok"
}
```

## Predict Pit Recommendation

```http
POST /predict
```

This endpoint accepts the current race state and returns a deterministic pit recommendation. The implementation is rules-based for now; no ML model is loaded yet.

Example request:

```json
{
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
      "pace_delta": 0.47
    }
  ]
}
```

Example response:

```json
{
  "recommendation": "pit_now",
  "confidence": 0.86,
  "reason": "Tyre age and recent pace loss suggest the current stint is near the cliff.",
  "risk_level": "medium",
  "expected_time_delta": 4.8,
  "suggested_compound": "hard",
  "top_factors": [
    "high tyre age",
    "pace loss above threshold",
    "hard tyre recovery window"
  ]
}
```

Recommendation values:

- `pit_now`
- `stay_out`
- `monitor`

Risk values:

- `low`
- `medium`
- `high`

## Predict Sample Request

```http
GET /predict/sample-request
```

This endpoint returns a normalized deterministic request body that can be posted directly to `POST /predict`. It exists so the frontend can call the prediction contract with the current sample race state without parsing display strings from the dashboard payload.

Example response:

```json
{
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
      "pace_delta": 0.47
    },
    {
      "code": "LEC",
      "name": "Charles Leclerc",
      "team": "Ferrari",
      "position": 5,
      "gap_seconds": 9.1,
      "tyre": "medium",
      "tyre_age": 16,
      "pit_stops": 0,
      "pace_delta": 0.33
    },
    {
      "code": "HAM",
      "name": "Lewis Hamilton",
      "team": "Mercedes",
      "position": 7,
      "gap_seconds": 15.8,
      "tyre": "hard",
      "tyre_age": 7,
      "pit_stops": 1,
      "pace_delta": -0.12
    }
  ]
}
```

Frontend usage:

1. Request `GET /predict/sample-request`.
2. POST the response body to `POST /predict`.
3. Render the returned `PredictionResponse` in the recommendation panel.
4. While the request is pending, the recommendation panel shows a loading state.
5. If `VITE_RACEIQ_API_BASE_URL` is unset or either request fails, the frontend uses the local deterministic prediction fixture and labels the panel as fallback-powered.

### Frontend Predict Contract Notes

The Strategy page calls the prediction flow through `frontend/src/lib/api.ts`. It asks the backend for `GET /predict/sample-request`, posts that normalized body to `POST /predict`, and passes the returned `PredictionResponse` into `PitRecommendationPanel`.

The frontend should not generate the prediction request directly from display strings yet. The current frontend `StrategyDashboardData` shape is optimized for UI rendering, while `POST /predict` expects normalized model input.

Recommended request generated from the current sample dashboard:

```json
{
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
      "pace_delta": 0.47
    },
    {
      "code": "LEC",
      "name": "Charles Leclerc",
      "team": "Ferrari",
      "position": 5,
      "gap_seconds": 9.1,
      "tyre": "medium",
      "tyre_age": 16,
      "pit_stops": 0,
      "pace_delta": 0.33
    },
    {
      "code": "HAM",
      "name": "Lewis Hamilton",
      "team": "Mercedes",
      "position": 7,
      "gap_seconds": 15.8,
      "tyre": "hard",
      "tyre_age": 7,
      "pit_stops": 1,
      "pace_delta": -0.12
    }
  ]
}
```

Frontend mapping rules for the current dashboard data:

- `raceState.lap` -> `lap`
- `raceState.totalLaps` -> `total_laps`
- `raceState.weather` -> `weather`
- `raceState.focusDriver` -> `focus_driver`
- `driver.position` -> `position`
- `driver.tyreAge` -> `tyre_age`
- `driver.pitStops` -> `pit_stops`
- `driver.tyre` -> lowercase `tyre`
- `driver.gap` display strings like `"+12.4s"` -> numeric `gap_seconds`
- `driver.paceDelta` display strings like `"+0.47s"` -> numeric `pace_delta`
- `raceState.trackTemp` display strings like `"31 C"` -> numeric `track_temp_c`
- `raceState.rainChance` display strings like `"18%"` -> decimal `rain_chance`
- `raceState.safetyCar` display strings like `"Clear"` -> backend enum `clear`

Current schema gaps before generating predict requests directly from dashboard data:

- `StrategyDashboardData` does not include stable `race_id` or `circuit` fields; the frontend would need to hardcode or infer them from `raceState.race`.
- `trackTemp`, `rainChance`, `gap`, and `paceDelta` are display-formatted strings, so direct wiring would require parsing UI labels into numeric model inputs.
- `safetyCar` and `tyre` use display casing, while `/predict` expects lowercase enum values.
- The current safe path is to continue using `GET /predict/sample-request` until dashboard data includes normalized prediction input fields.

## Replay Race State

```http
POST /replay
```

This endpoint returns deterministic timeline events for a sample race replay. The response keeps the original snake_case `race_state` and `events` fields for compatibility, and also includes frontend-ready camelCase fields: `replayState` and `timelineEvents`.

Example request:

```json
{
  "race_id": "silverstone-2026-sim",
  "focus_driver": "NOR",
  "from_lap": 18,
  "to_lap": 27
}
```

Example response:

```json
{
  "race_state": {
    "race_id": "silverstone-2026-sim",
    "race_name": "Silverstone Strategy Lab",
    "session": "Race simulation",
    "circuit": "Silverstone",
    "lap": 27,
    "total_laps": 52,
    "weather": "Cloud cover building",
    "track_temp_c": 31,
    "rain_chance": 0.18,
    "safety_car": "clear",
    "focus_driver": "NOR"
  },
  "events": [
    {
      "lap": 18,
      "title": "Virtual safety car window",
      "detail": "Pit loss drops by 5.2s, but the lead pack stays out.",
      "type": "warning"
    },
    {
      "lap": 27,
      "title": "RaceIQ calls the decision lap",
      "detail": "Norris can pit into clean air and attack on hard tyres.",
      "type": "pit"
    }
  ],
  "replayState": {
    "raceId": "silverstone-2026-sim",
    "race": "Silverstone Strategy Lab",
    "session": "Race simulation",
    "circuit": "Silverstone",
    "currentLap": 27,
    "totalLaps": 52,
    "lapRange": {
      "fromLap": 18,
      "toLap": 27
    },
    "weather": "Cloud cover building",
    "safetyCar": "clear",
    "focusDriver": "NOR"
  },
  "timelineEvents": [
    {
      "lap": 18,
      "title": "Virtual safety car window",
      "detail": "Pit loss drops by 5.2s, but the lead pack stays out.",
      "type": "warning"
    },
    {
      "lap": 27,
      "title": "RaceIQ calls the decision lap",
      "detail": "Norris can pit into clean air and attack on hard tyres.",
      "type": "pit"
    }
  ]
}
```

Frontend timeline usage:

- `frontend/src/lib/api.ts` exposes typed request/response models and `getRaceReplay()`.
- The function calls `POST /replay` only when `VITE_RACEIQ_API_BASE_URL` is set.
- If the backend is unavailable or the base URL is unset, the function returns deterministic local fallback replay data.
- The current Strategy page timeline is not wired to this API function yet.
- Use `replayState.currentLap` for the active lap.
- Use `replayState.totalLaps` for the scrubber max.
- Use `replayState.lapRange.fromLap` and `replayState.lapRange.toLap` to label filtered replay windows.
- Use `replayState.weather` and `replayState.safetyCar` for session status displays.
- Use `timelineEvents` for the `RaceTimeline` event list.

## Sample Strategy Dashboard

```http
GET /strategy/sample
```

This endpoint returns a deterministic sample payload for the current strategy dashboard. Its response shape intentionally matches the frontend `StrategyDashboardData` type in `frontend/src/data/mockRace.ts`, so the frontend can later move from local fixtures to HTTP without a UI data-mapping rewrite.

Frontend usage:

- Leave `VITE_RACEIQ_API_BASE_URL` unset to use the local fixture.
- Set `VITE_RACEIQ_API_BASE_URL=http://localhost:8000` to have `frontend/src/lib/api.ts` request `GET /strategy/sample`.
- If the request fails, the frontend falls back to the local fixture so the strategy dashboard remains usable during backend downtime.

Example response:

```json
{
  "raceState": {
    "race": "Silverstone Strategy Lab",
    "session": "Race simulation",
    "lap": 27,
    "totalLaps": 52,
    "weather": "Cloud cover building",
    "trackTemp": "31 C",
    "rainChance": "18%",
    "safetyCar": "Clear",
    "focusDriver": "NOR",
    "headline": "Read the race before the race reads you.",
    "subline": "A mock pit wall built from race state, tyre life, and strategy branches."
  },
  "drivers": [
    {
      "code": "NOR",
      "name": "Lando Norris",
      "team": "McLaren",
      "teamColor": "#ff8c1a",
      "position": 6,
      "gap": "+12.4s",
      "tyre": "Medium",
      "tyreAge": 18,
      "pitStops": 0,
      "paceDelta": "+0.47s",
      "risk": "High",
      "status": "Tyres near cliff"
    }
  ],
  "timelineEvents": [
    {
      "lap": 27,
      "title": "RaceIQ calls the decision lap",
      "detail": "Norris can pit into clean air and attack on hard tyres.",
      "type": "pit"
    }
  ],
  "tyreData": [
    {
      "lap": 27,
      "medium": 0.53,
      "hard": 0.16,
      "projected": 0.4
    }
  ],
  "strategyBranches": [
    {
      "label": "Pit this lap",
      "tone": "green",
      "summary": "Hard tyre, clean air, attack phase from lap 29.",
      "rejoin": "P9 behind Alonso",
      "finish": "Projected P5",
      "risk": "Low traffic risk",
      "laps": ["L27 Box", "L28 Out-lap", "L31 P7", "L44 P5"]
    }
  ],
  "forecastPreview": [
    {
      "label": "McLaren",
      "value": 34,
      "color": "#60a5fa"
    }
  ]
}
```

## Forecast Win Likelihood

```http
POST /forecast/win-likelihood
```

This endpoint accepts upcoming race context and returns deterministic mock driver/team win probabilities for the next two races. No database, live data feed, or ML model is used yet. Later versions should support a `remaining_season` forecast horizon.

Example request:

```json
{
  "forecast_horizon": "next_2_races",
  "race_ids": ["monaco-2026", "canada-2026"],
  "include_sentiment": true
}
```

Example response:

```json
{
  "forecast_horizon": "next_2_races",
  "race_ids": ["monaco-2026", "canada-2026"],
  "races": [
    {
      "race_id": "monaco-2026",
      "race_name": "Monaco Grand Prix",
      "circuit": "Circuit de Monaco",
      "round": 8
    },
    {
      "race_id": "canada-2026",
      "race_name": "Canadian Grand Prix",
      "circuit": "Circuit Gilles Villeneuve",
      "round": 9
    }
  ],
  "driver_probabilities": [
    {
      "entity_id": "NOR",
      "entity_name": "Lando Norris",
      "probability": 0.29,
      "rank": 1,
      "race_id": null,
      "team": "McLaren",
      "top_factors": ["recent race pace", "street-circuit qualifying value"]
    }
  ],
  "team_probabilities": [
    {
      "entity_id": "mclaren",
      "entity_name": "McLaren",
      "probability": 0.34,
      "rank": 1,
      "race_id": null,
      "team": null,
      "top_factors": ["race pace", "tyre degradation control"]
    }
  ],
  "top_factors": [
    {
      "label": "Street-circuit qualifying value",
      "impact": "positive",
      "weight": 0.31,
      "detail": "Monaco-style track position makes qualifying form unusually important."
    }
  ],
  "model_confidence": 0.62,
  "generated_at": "2026-07-06T00:00:00Z",
  "data_freshness": "deterministic sample data; no live feeds, database, or trained model"
}
```

Response notes:

- `forecast_horizon` is currently limited to `next_2_races`.
- `race_ids` echoes the selected race IDs from the request.
- `driver_probabilities` and `team_probabilities` are overall probabilities across the requested two-race horizon.
- `top_factors` explains the deterministic baseline signals used for the mock forecast.
- `model_confidence` is a mock uncertainty score, not a trained model calibration metric.
- `generated_at` is fixed for deterministic tests and demos.

Frontend usage:

- `frontend/src/lib/api.ts` exposes typed request/response models and `getWinLikelihoodForecast()`.
- The function calls `POST /forecast/win-likelihood` only when `VITE_RACEIQ_API_BASE_URL` is set.
- If the backend is unavailable or the base URL is unset, the function returns deterministic local fallback forecast data.
- The Strategy page forecast panel renders the response with loading and fallback states.

## MVP API Rule

The first backend pass implements `/health`, `/predict`, `/predict/sample-request`, `/replay`, `/strategy/sample`, and `/forecast/win-likelihood` with deterministic mock data. Database-backed and model-backed behavior is planned for later sprints.
