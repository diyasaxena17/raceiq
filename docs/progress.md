# RaceIQ Project Progress

This document is the running project journal for RaceIQ. Update it at the end of each meaningful work session so reviewers can see what changed, what is working, and what is still planned.

## Current Phase

Early MVP planning and scaffold cleanup.

## Current Status

- Frontend: React, TypeScript, Vite, Tailwind, Recharts, Framer Motion, and Lucide are installed. The app currently renders a static hero screen.
- Backend: FastAPI is installed. `GET /health` is implemented through `backend/app/routes/health.py` and registered in `backend/app/main.py`.
- ML: data folders, pipeline script placeholders, and output placeholders exist. No model has been trained yet.
- Data: static/sample data is planned first. PostgreSQL is planned for the forecasting phase when historical features, sentiment snapshots, model runs, and forecast outputs need persistence.
- Docs: product requirements, architecture, roadmap, API, data ingestion, data dictionary, and model card docs exist.

## Progress Log

### 2026-07-03

- Created initial product requirements and architecture docs.
- Cleaned the repository structure so `frontend/` is the single canonical frontend app.
- Removed Vite starter clutter that did not represent RaceIQ functionality.
- Renamed docs for readability:
  - `docs/api.md`
  - `docs/data-ingestion.md`
  - `docs/product-requirements.md`
  - `docs/roadmap.md`
- Renamed script folders by purpose:
  - `dev-scripts/` for repo-wide setup and development helpers
  - `ml/pipeline-scripts/` for ML and data pipeline scripts
- Moved the health endpoint into the health route module.
- Added next-two-races driver/team win-likelihood forecasting as a planned product capability.
- Documented PostgreSQL as the recommended data store for the forecasting phase.
- Added planned forecasting feature groups: track, weather, car, driver, team, reliability, and sentiment.

## Completed

- Repository structure is easier to read.
- Core docs exist and describe the intended MVP plus forecasting direction.
- Health route is implemented and organized under backend routes.

## In Progress

- Product requirements are being expanded from pit strategy into race intelligence and win-likelihood forecasting.
- Architecture is being refined around a future PostgreSQL-backed forecasting data model.

## Not Started

- Real dashboard implementation.
- Backend `/predict` endpoint.
- Backend `/replay` endpoint.
- Backend `/forecast/win-likelihood` endpoint.
- Pydantic schemas for race state, prediction, replay, and forecast responses.
- Sample race data fixtures.
- PostgreSQL schema and migrations.
- Data ingestion scripts.
- ML model training.
- Automated tests.

## Next Recommended Steps

1. Build the static mock-data dashboard in `frontend/`.
2. Add sample race scenario fixtures.
3. Implement typed backend schemas and deterministic `/predict`.
4. Add `/replay` with sample timeline data.
5. Design the PostgreSQL schema for forecasting before implementing ingestion.

## Update Template

Use this format for future entries:

```md
### YYYY-MM-DD

- Completed:
- Changed:
- Verified:
- Blocked:
- Next:
```
