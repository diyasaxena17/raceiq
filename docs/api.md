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

## Replay Race State

```http
POST /replay
```

This endpoint returns deterministic timeline events for a sample race replay.

Example request:

```json
{
  "race_id": "silverstone-2026-sim",
  "focus_driver": "NOR",
  "from_lap": 1,
  "to_lap": 31
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
      "lap": 27,
      "title": "RaceIQ calls the decision lap",
      "detail": "Norris can pit into clean air and attack on hard tyres.",
      "type": "pit"
    }
  ]
}
```

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

Planned endpoint after the first MVP:

```http
POST /forecast/win-likelihood
```

This endpoint will accept upcoming race context and return driver/team win probabilities for the next two races. Later versions should support a `remaining_season` forecast horizon.

Example request shape:

```json
{
  "forecast_horizon": "next_2_races",
  "race_ids": ["monaco-2026", "canada-2026"],
  "include_sentiment": true
}
```

Example response shape:

```json
{
  "forecast_horizon": "next_2_races",
  "driver_probabilities": [],
  "team_probabilities": [],
  "top_factors": [],
  "model_confidence": 0.0,
  "generated_at": "2026-07-03T00:00:00Z",
  "data_freshness": "placeholder"
}
```

## MVP API Rule

The first backend pass implements `/health`, `/predict`, `/replay`, and `/strategy/sample` with deterministic mock data. Win-likelihood forecasting is planned for a later sprint after the data model exists.
