# RaceIQ API Contracts

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

## MVP API Rule

Only `/health` and one prediction-style endpoint are required for the first backend pass.
