# RaceIQ Project Progress

This document is the running project journal for RaceIQ. Update it at the end of each meaningful work session so reviewers can see what changed, what is working, and what is still planned.

## Current Phase

Early MVP dashboard and backend contract alignment.

## Current Status

- Frontend: React, TypeScript, Vite, Tailwind, Recharts, Framer Motion, and Lucide are installed. The app has a cinematic landing page, a routed strategy dashboard, route-level code splitting, and a typed mock API boundary.
- Backend: FastAPI is installed. `GET /health`, `POST /predict`, `POST /replay`, and `GET /strategy/sample` are implemented with deterministic service logic and Pydantic schemas.
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
- Aligned `GET /strategy/sample` with the frontend `StrategyDashboardData` contract so the future HTTP swap does not require a dashboard data-mapping rewrite.
- Added backend contract coverage for the frontend-aligned sample strategy dashboard payload.

## Completed

- Repository structure is easier to read.
- Core docs exist and describe the intended MVP plus forecasting direction.
- Health route is implemented and organized under backend routes.
- Frontend now has a usable mock-data RaceIQ dashboard.
- Frontend has a first Playwright smoke test suite.
- Backend has deterministic contracts for health, predict, replay, and the sample strategy dashboard.

## In Progress

- Dashboard polish and future frontend-to-backend HTTP integration are ready for the next iteration.

## Not Started

- Backend `/forecast/win-likelihood` endpoint.
- Forecast schemas.
- PostgreSQL schema and migrations.
- Data ingestion scripts.
- ML model training.
- Full-stack integration tests against a running backend.

## Next Recommended Steps

1. Wire the frontend mock API adapter to optionally call `GET /strategy/sample`.
2. Add richer sample race scenarios.
3. Add a frontend strategy interaction that can call `POST /predict`.
4. Design the PostgreSQL schema for forecasting before implementing ingestion.
5. Plan the first deterministic `/forecast/win-likelihood` baseline.

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
