# RaceIQ API Contracts

## Strategy Service

Base URL:

```txt
http://localhost:8080
```

## Create Simulation

### Endpoint

```http
POST /api/simulations
```

### Request Body

```json
{
  "circuit": "Monza",
  "driver": "Lando Norris",
  "team": "McLaren",
  "totalLaps": 53,
  "startingTyre": "SOFT",
  "pitStopLap": 22,
  "secondTyre": "MEDIUM",
  "weather": "DRY",
  "riskLevel": "BALANCED"
}
```

### Response Body

```json
{
  "id": "sim_001",
  "circuit": "Monza",
  "driver": "Lando Norris",
  "team": "McLaren",
  "predictedRaceTimeSeconds": 4865.42,
  "confidenceScore": 87,
  "riskLevel": "Medium",
  "recommendedStrategy": "One-stop strategy: Soft to Medium",
  "aiSummary": "This strategy offers strong early pace while controlling tyre degradation after lap 22.",
  "lapTimes": [
    {
      "lap": 1,
      "timeSeconds": 89.2,
      "tyre": "SOFT"
    }
  ],
  "tyreDegradation": [
    {
      "lap": 1,
      "value": 3,
      "tyre": "SOFT"
    }
  ]
}
```

## Get Simulation Result

### Endpoint

```http
GET /api/simulations/{id}
```

## Get Circuits

### Endpoint

```http
GET /api/circuits
```

## Get Drivers

### Endpoint

```http
GET /api/drivers
```

## Real F1 Data Endpoints

These can come later.

### Get Real Sessions

```http
GET /api/real-f1/sessions
```

### Get Real Lap Data

```http
GET /api/real-f1/laps?sessionKey=latest
```

## MVP API Rule

Only `/api/simulations` is required for the first backend MVP.