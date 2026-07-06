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
- Replaced the static frontend hero with a real mock-data dashboard.
- Added pit recommendation, branching strategy timeline, race scrubber, circuit pulse map, tyre degradation chart, driver strategy cards, weather pressure, and forecast preview panels.
- Verified the frontend with `npm run build` and `npm run lint`.
- Installed Playwright for frontend browser testing.
- Added desktop and mobile smoke tests for dashboard rendering and race scrubber interaction.
- Verified Playwright with `npm run test:e2e`.
- Shifted the dashboard visual system toward a cyberpunk minimalist palette: charcoal background, cool text, electric-blue primary accents, subtle motion, and sticky responsive navigation.
- Added a routed frontend structure with a cinematic landing page at `/`, the pit-wall dashboard at `/strategy`, and planned surfaces at `/forecast` and `/methodology`.
- Made the landing page more cinematic with a race-control visual scene.
- Added route-level code splitting so the strategy dashboard loads as a separate bundle and the Vite chunk-size warning is resolved.
- Added a typed mock API boundary for the Strategy dashboard so page components no longer import fixture data directly.
- Implemented deterministic FastAPI contracts for `POST /predict`, `POST /replay`, and `GET /strategy/sample` with Pydantic schemas and service-layer logic.
- Added backend contract tests for `GET /health`, `POST /predict`, and `POST /replay`.

## Completed

- Repository structure is easier to read.
- Core docs exist and describe the intended MVP plus forecasting direction.
- Health route is implemented and organized under backend routes.
- Frontend now has a usable mock-data RaceIQ dashboard.
- Frontend has a first Playwright smoke test suite.

## In Progress

- Dashboard polish and data/API integration are ready for the next iteration.

## Not Started

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
