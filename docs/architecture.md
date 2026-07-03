# RaceIQ Architecture

## Purpose

This document describes the intended MVP architecture for RaceIQ and the current implementation state of the repo.

RaceIQ should stay intentionally small: a React dashboard, a FastAPI API, and an ML workspace that can evolve from deterministic strategy rules to a simple model-backed recommendation service.

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
  +--> Feature builder
          |
          v
      Model service
          |
          v
      Rules or ML model
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
- `src/lib/api.ts`: typed API calls to FastAPI.
- `src/lib/utils.ts`: shared frontend utilities.

Current state:

- `src/App.tsx` renders a static hero screen.
- Component files are present but empty.
- `src/lib/api.ts` is empty.
- Vite starter files have been removed so the frontend tree only shows RaceIQ app files.

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
- `app/routes/replay.py`: race replay endpoint.
- `app/schemas/race_state.py`: request schema for current race state.
- `app/schemas/prediction.py`: response schema for recommendation output.
- `app/services/feature_builder.py`: convert API input into model features.
- `app/services/model_service.py`: rules or model-backed prediction logic.
- `app/services/replay_service.py`: load or generate sample timeline state.

Current state:

- `app/routes/health.py` defines `GET /health`, and `app/main.py` registers it.
- Predict, replay, schema, and service files exist but are empty.
- Health is the only registered router.
- No tests are present.

## API Boundary

The frontend should talk to the backend through stable JSON contracts.

Minimum MVP endpoints:

- `GET /health`
- `POST /predict`
- `POST /replay`

The first backend implementation can use deterministic rules. The frontend should not need to know whether a recommendation came from rules or from a trained model.

## Data and ML Architecture

The ML workspace lives in `ml/`. ML-specific scripts live in `ml/pipeline-scripts/` so they are not confused with repo-wide development helpers.

Intended flow:

```txt
raw race/session data
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
  +--> ml/outputs/metrics.json
  +--> ml/outputs/feature_importance.csv
```

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

## Deployment Shape

For the MVP, deployment can stay simple:

- Frontend: static build from Vite.
- Backend: single FastAPI service.
- Model artifact: local file loaded by backend service.
- Data: checked-in sample JSON/CSV fixtures or generated local files.

No database is required for the first complete demo.

## Key Architecture Decisions

- Keep `frontend/` as the canonical frontend.
- Use mock/sample data before real F1 ingestion.
- Implement deterministic strategy rules before ML serving.
- Keep the prediction API stable while internals evolve.
- Avoid adding a database until there is a clear feature requiring persistence.

## Immediate Technical Risks

- The docs and file names imply more functionality than currently exists.
- Predict, replay, schema, and service files are scaffolded but not connected.
- ML pipeline scripts and outputs are placeholders, so model claims should stay conservative.
- No automated tests currently protect API contracts or frontend rendering.
