# RaceIQ

RaceIQ is an F1 race intelligence dashboard built as a polished full-stack portfolio project. The current MVP pairs a cinematic React frontend with deterministic FastAPI contracts for strategy, replay, and next-two-race win-likelihood forecasting.

The app is intentionally mock-first right now: recommendations and forecasts are rules-based or fixture-backed, not trained ML output. That keeps the product usable while the data and modeling foundation is designed properly.

## What Works Today

- Cinematic landing page at `/`
- Strategy dashboard at `/strategy`
- Planned forecast and methodology surfaces at `/forecast` and `/methodology`
- Typed frontend API layer with local fallback data
- Scenario selector with Silverstone, Monaco, and Spa race states
- Dynamic pit recommendation panel backed by `POST /predict` when configured
- Replay/timeline panel backed by `POST /replay` when configured
- Visible win-likelihood forecast panel backed by `POST /forecast/win-likelihood` when configured
- FastAPI backend with deterministic Pydantic contracts and tests
- Playwright smoke coverage for desktop and mobile frontend flows
- Full-stack Playwright coverage for backend-backed Strategy scenarios

## Project Structure

```txt
raceiq/
├── frontend/              # React + TypeScript + Vite dashboard
├── backend/               # FastAPI app, routes, schemas, services, and tests
├── backend/models/        # Future serialized model artifacts
├── ml/                    # ML data, pipeline scripts, notebooks, and outputs
├── ml/pipeline-scripts/   # Future ingestion/training/evaluation scripts
├── docs/                  # Product, architecture, API, data, and model docs
├── dev-scripts/           # Repo-wide local development helpers
└── README.md
```

## Local Setup

Install frontend dependencies:

```bash
cd frontend
npm install
```

Install backend dependencies:

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

## Run Locally

Start the backend:

```bash
cd backend
uvicorn app.main:app --reload
```

Start the frontend:

```bash
cd frontend
npm run dev
```

By default, the frontend works from local deterministic fixtures. To call the backend during local development, set:

```bash
VITE_RACEIQ_API_BASE_URL=http://localhost:8000
```

If the variable is unset or a backend request fails, the frontend falls back to local mock data so the dashboard remains usable.

## Implemented API

Base URL:

```txt
http://localhost:8000
```

Implemented endpoints:

- `GET /health`
- `GET /strategy/scenarios`
- `GET /strategy/sample`
- `GET /strategy/sample/{scenario_id}`
- `GET /predict/sample-request`
- `GET /predict/sample-request/{scenario_id}`
- `POST /predict`
- `POST /replay`
- `POST /forecast/win-likelihood`

All current API behavior is deterministic/mock. There is no PostgreSQL database, live F1 data feed, or trained model serving yet.

## Testing

Frontend:

```bash
cd frontend
npm run lint
npm run build
npm run test:e2e
npm run test:e2e:fullstack
```

`npm run test:e2e` runs the local deterministic fallback browser suite. `npm run test:e2e:fullstack` starts FastAPI on `127.0.0.1:8000`, starts Vite with `VITE_RACEIQ_API_BASE_URL=http://127.0.0.1:8000`, and verifies backend-backed Strategy scenarios.

Backend:

```bash
cd backend
python -m compileall app
pytest
```

## Documentation

- [Product Requirements](docs/product-requirements.md)
- [Architecture](docs/architecture.md)
- [API](docs/api.md)
- [Roadmap](docs/roadmap.md)
- [Project Progress](docs/progress.md)
- [Data Dictionary](docs/data-dictionary.md)
- [Model Card](docs/model-card.md)

## Roadmap

Next work should focus on richer forecast controls, a clearer scenario-data module if the deterministic registry keeps growing, and then the PostgreSQL/data foundation needed before real model-backed forecasting.
