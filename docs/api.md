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

Planned endpoint:

```http
POST /predict
```

This endpoint will accept the current race state and return a pit recommendation, confidence score, and explanation.

## Replay Race State

Planned endpoint:

```http
POST /replay
```

This endpoint will replay or summarize race state changes for the dashboard timeline.

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

Only `/health` and one prediction-style endpoint are required for the first backend pass. Win-likelihood forecasting is planned for a later sprint after the data model exists.
