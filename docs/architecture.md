# RaceIQ Architecture

## Purpose

This document describes the intended MVP architecture for RaceIQ and the current implementation state of the repo.

RaceIQ should stay intentionally small at first: a React dashboard, a FastAPI API, and an ML workspace that can evolve from deterministic strategy rules to model-backed recommendations and win-likelihood forecasts.

## Repository Layout

```txt
raceiq/
├── frontend/              # Main React + TypeScript + Vite app
├── backend/               # FastAPI app, routes, schemas, and services
├── backend/models/        # Future serialized model artifacts
├── ml/                    # Data, pipeline scripts, notebooks, and model outputs
├── docs/                  # Product, architecture, API, data, and model docs
├── dev-scripts/           # Repo-wide setup and local development helpers
├── docker-compose.yml     # Placeholder
└── README.md
```

## System Context

```txt
User
  |
  v
React dashboard
  |
  | HTTP JSON
  v
FastAPI backend
  |
  +--> Replay service
  |
  +--> Strategy prediction service
  |
  +--> Win likelihood forecast service
  |
  +--> Feature builder
          |
          v
      Model service
          |
          v
      Rules or ML model
          |
          v
      PostgreSQL feature/history store
```

## Frontend Architecture

The main frontend lives in `frontend/`.

Current stack:

- React 19
- TypeScript
- Vite
- Tailwind CSS 4
- Recharts for charts
- Framer Motion for motion
- Lucide React for icons

Intended frontend modules:

- `src/App.tsx`: top-level dashboard composition.
- `src/components/DriverStrategyCard.tsx`: driver race state and strategy summary.
- `src/components/PitRecommendationPanel.tsx`: recommendation, confidence, and explanation.
- `src/components/RaceTimeline.tsx`: lap and event timeline.
- `src/components/TyreDegradationChart.tsx`: tyre age or pace trend chart.
- Future `src/components/WinLikelihoodPanel.tsx`: driver and team probabilities for upcoming races.
- `src/lib/api.ts`: typed API calls to FastAPI.
- `src/lib/utils.ts`: shared frontend utilities.

Current state:

- `src/App.tsx` owns the route shell with route-level code splitting.
- The landing page and strategy dashboard are separate routes.
- `src/lib/api.ts` exposes a typed mock API over `frontend/src/data/mockRace.ts`.
- The strategy page currently consumes local deterministic mock data, not the backend yet.

## Backend Architecture

The backend lives in `backend/` and should expose a small JSON API.

Current stack:

- FastAPI
- Uvicorn
- Pydantic
- Pandas, NumPy, and scikit-learn for future model work

Intended backend modules:

- `app/main.py`: FastAPI app setup and route registration.
- `app/routes/health.py`: health endpoint.
- `app/routes/predict.py`: pit recommendation endpoint.
- Future `app/routes/forecast.py`: driver/team win-likelihood endpoint.
- `app/routes/replay.py`: race replay endpoint.
- `app/schemas/race_state.py`: request schema for current race state.
- `app/schemas/prediction.py`: response schema for recommendation output.
- Future `app/schemas/forecast.py`: forecast request and response schemas.
- `app/services/feature_builder.py`: convert API input into model features.
- `app/services/model_service.py`: rules or model-backed prediction logic.
- Future `app/services/forecast_service.py`: driver/team win-likelihood prediction logic.
- `app/services/replay_service.py`: load or generate sample timeline state.

Current state:

- `app/routes/health.py` defines `GET /health`, and `app/main.py` registers it.
- `app/routes/predict.py` defines `POST /predict`, backed by deterministic strategy rules.
- `app/routes/replay.py` defines `POST /replay` and `GET /strategy/sample`, backed by local sample data.
- Pydantic schemas exist for race state, prediction, replay, and sample dashboard responses.
- Backend contract tests cover health, predict, replay, and the frontend-aligned sample dashboard payload.

## API Boundary

The frontend should talk to the backend through stable JSON contracts.

Minimum MVP endpoints:

- `GET /health`
- `POST /predict`
- `POST /replay`
- `GET /strategy/sample`

The first backend implementation can use deterministic rules. The frontend should not need to know whether a recommendation came from rules or from a trained model.

`GET /strategy/sample` is the bridge contract for the current dashboard. Its response intentionally mirrors the frontend `StrategyDashboardData` type from `frontend/src/data/mockRace.ts`, including camelCase keys such as `raceState`, `totalLaps`, `teamColor`, `timelineEvents`, `tyreData`, `strategyBranches`, and `forecastPreview`. Backend request schemas and replay metadata can remain Pythonic/snake_case where they are not directly replacing the frontend dashboard fixture.

Forecasting endpoint planned after the first MVP:

- `POST /forecast/win-likelihood`

This endpoint should return driver and team win probabilities for the next two races first, then later support all remaining races in the season.

## Data and ML Architecture

The ML workspace lives in `ml/`. ML-specific scripts live in `ml/pipeline-scripts/` so they are not confused with repo-wide development helpers.

Intended flow:

```txt
raw race/session/weather/sentiment data
  |
  v
build_dataset.py
  |
  v
processed training data
  |
  v
train_pit_classifier.py
  |
  +--> backend/models/pit_classifier.*
  +--> backend/models/win_likelihood.*
  +--> ml/outputs/metrics.json
  +--> ml/outputs/feature_importance.csv
```

Forecasting features should include:

- Track characteristics: layout, overtaking difficulty, tyre stress, historical safety car rate, weather sensitivity.
- Weather: forecast temperature, rain probability, wind, track temperature, weather volatility.
- Car characteristics: qualifying pace, race pace, tyre degradation, straight-line speed, cornering performance, reliability.
- Driver characteristics: recent form, track history, qualifying strength, race pace, wet-weather performance, incident rate.
- Team strengths: strategy execution, pit stop performance, reliability, upgrade trend, constructor pace.
- Sentiment: team statements, media coverage, confidence signals, negative news, injury or reliability concerns.

## Data Store

Static JSON or CSV fixtures are enough for the first pit strategy demo. PostgreSQL becomes useful once RaceIQ stores reusable historical data and forecast outputs.

Recommended PostgreSQL use cases:

- Race calendar, circuits, sessions, drivers, teams, and results.
- Weather observations and upcoming weather forecasts.
- Historical feature rows used for training and inference.
- Sentiment source snapshots and normalized sentiment scores.
- Model runs, model versions, metrics, and generated forecasts.
- Cached API responses for dashboard performance.

Likely early tables:

- `races`
- `circuits`
- `drivers`
- `teams`
- `race_results`
- `session_results`
- `weather_samples`
- `sentiment_snapshots`
- `model_runs`
- `forecast_outputs`

Current state:

- `ml/data/raw`, `ml/data/processed`, and `ml/data/sample` exist with `.gitkeep` files.
- `ml/pipeline-scripts/` contains empty placeholders for collection, dataset building, training, and evaluation.
- `ml/outputs/metrics.json` contains `{}`.
- `ml/outputs/feature_importance.csv` contains only headers.

## Local Development

Current available commands:

```bash
cd frontend
npm run dev
npm run build
npm run lint
```

Backend intended command:

```bash
cd backend
uvicorn app.main:app --reload
```

Current caveats:

- `dev-scripts/setup.sh` and `dev-scripts/run-dev.sh` are placeholders.
- `docker-compose.yml` is empty.
- Backend dependency installation is manual through `backend/requirements.txt`.
- Frontend-to-backend HTTP wiring is intentionally deferred until the mock API contract is stable.

## Deployment Shape

For the MVP, deployment can stay simple:

- Frontend: static build from Vite.
- Backend: single FastAPI service.
- Model artifact: local file loaded by backend service.
- Data: checked-in sample JSON/CSV fixtures first; PostgreSQL for historical features and forecast outputs when forecasting begins.

No database is required for the first complete pit strategy demo. PostgreSQL is recommended for the forecasting phase.

## Key Architecture Decisions

- Keep `frontend/` as the canonical frontend.
- Use mock/sample data before real F1 ingestion.
- Implement deterministic strategy rules before ML serving.
- Implement deterministic forecast baselines before model-backed win likelihood.
- Keep the prediction API stable while internals evolve.
- Avoid adding a database for the first pit strategy demo; add PostgreSQL when forecasting requires historical features, sentiment snapshots, and saved forecast runs.

## Immediate Technical Risks

- The docs and file names still describe planned forecasting and ML functionality that is not implemented yet.
- ML pipeline scripts and outputs are placeholders, so model claims should stay conservative.
- Forecasting requires careful data quality work because sentiment, weather, and car performance features can be noisy or unavailable.
- Frontend rendering and backend API contracts have first-pass automated checks, but no end-to-end backend integration is wired into the UI yet.
