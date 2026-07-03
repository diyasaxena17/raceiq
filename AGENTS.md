# AGENTS.md

This file gives coding agents the project context and working rules for RaceIQ.

## Project Overview

RaceIQ is an F1 race intelligence dashboard. The first MVP is a polished pit-strategy simulator with a React dashboard, FastAPI backend, and a small ML workspace. A later phase adds driver/team win-likelihood forecasting for the next two races, with a path to remaining-season forecasts.

## Repository Layout

```txt
raceiq/
├── frontend/              # React + TypeScript + Vite dashboard
├── backend/               # FastAPI app, routes, schemas, and services
├── backend/models/        # Future serialized model artifacts
├── ml/                    # ML data, pipeline scripts, notebooks, and outputs
├── ml/pipeline-scripts/   # ML/data collection, training, and evaluation scripts
├── docs/                  # Product, architecture, roadmap, API, data, and model docs
├── dev-scripts/           # Repo-wide setup and local development helpers
├── docker-compose.yml     # Placeholder
└── README.md
```

## Current Product Direction

Build in this order:

1. Static mock-data dashboard.
2. Backend schemas and deterministic `/predict`.
3. Replay/timeline endpoint.
4. ML/data baseline for pit recommendations.
5. PostgreSQL-backed data foundation.
6. `/forecast/win-likelihood` for driver/team probabilities over the next two races.

Do not jump straight to the full forecasting system before the MVP dashboard and backend contract are usable.

## Important Docs

- `docs/product-requirements.md`: product requirements and sprint direction.
- `docs/architecture.md`: intended architecture and current implementation state.
- `docs/roadmap.md`: MVP and forecasting roadmap.
- `docs/progress.md`: running project progress log.
- `docs/api.md`: planned API contracts.
- `docs/data-ingestion.md`: data source and pipeline plan.
- `docs/data-dictionary.md`: feature groups and planned data fields.
- `docs/model-card.md`: planned model notes and limitations.

Update `docs/progress.md` after meaningful implementation or planning changes.

## Frontend Guidance

- The canonical frontend is `frontend/`.
- Use React, TypeScript, Vite, Tailwind CSS, Recharts, Framer Motion, and Lucide React.
- Keep the dashboard app-first. Do not rebuild a marketing landing page.
- Prefer clear components for dashboard sections:
  - `DriverStrategyCard`
  - `PitRecommendationPanel`
  - `RaceTimeline`
  - `TyreDegradationChart`
  - future `WinLikelihoodPanel`
- Use mock/sample data before adding complex data ingestion.
- Keep visual polish high, but avoid adding ornamental UI that does not help the race intelligence workflow.

## Backend Guidance

- Backend lives in `backend/`.
- Keep route, schema, and service responsibilities separate.
- `backend/app/main.py` should register routers.
- Route files should expose HTTP endpoints only.
- Schema files should define Pydantic request/response models.
- Service files should contain business logic.
- Start deterministic and explainable before model-backed behavior.

Planned endpoints:

- `GET /health`
- `POST /predict`
- `POST /replay`
- `POST /forecast/win-likelihood`

## ML and Data Guidance

- ML-specific scripts belong in `ml/pipeline-scripts/`.
- Keep raw, processed, and sample data separated under `ml/data/`.
- First build small, explainable baselines.
- Save metrics and feature importance in `ml/outputs/`.
- Treat sentiment as noisy. Store source, timestamp, confidence, and normalized score when implemented.
- PostgreSQL should be introduced when forecasting needs reusable historical features, sentiment snapshots, saved model runs, and forecast outputs.

## Development Commands

Frontend:

```bash
cd frontend
npm run dev
npm run build
npm run lint
```

Backend:

```bash
cd backend
uvicorn app.main:app --reload
```

Python sanity check:

```bash
python -m compileall backend/app
```

## Working Rules

- Keep changes scoped and easy to review.
- Prefer descriptive file and folder names over generic names.
- Do not reintroduce duplicate frontend roots.
- Do not add a database until there is a feature that needs persistence.
- Do not claim a model is trained until scripts, data, metrics, and model artifacts exist.
- Keep docs honest about what is implemented versus planned.
- Run the relevant build or compile check after code changes.
- Update `docs/progress.md` when a change affects project status.

## Git Hygiene

- Commit focused changes with clear messages.
- Do not include generated caches, local environment files, or dependency folders in new commits.
- Preserve user work and avoid reverting unrelated changes.
