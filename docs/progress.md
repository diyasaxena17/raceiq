# RaceIQ Project Progress

This document is the running project journal for RaceIQ. Update it at the end of each meaningful work session so reviewers can see what changed, what is working, and what is still planned.

## Current Phase

Early MVP dashboard and backend contract alignment.

## Current Status

- Frontend: React, TypeScript, Vite, Tailwind, Recharts, Framer Motion, and Lucide are installed. The app has a cinematic landing page, a routed strategy dashboard, route-level code splitting, and a typed API boundary with local fixture fallback.
- Backend: FastAPI is installed. `GET /health`, `POST /predict`, `GET /predict/sample-request`, `POST /replay`, `GET /strategy/sample`, and `POST /forecast/win-likelihood` are implemented with deterministic service logic and Pydantic schemas.
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
- Wired the frontend strategy dashboard API adapter to optionally call `GET /strategy/sample` when `VITE_RACEIQ_API_BASE_URL` is set.
- Added local fixture fallback for backend downtime or unset backend configuration.
- Added local Vite dev CORS origins to the FastAPI app.
- Added `GET /predict/sample-request` so the frontend can request a normalized sample payload before posting to `POST /predict`.
- Refined `POST /replay` with frontend-ready `replayState` and `timelineEvents` fields while keeping legacy `race_state` and `events`.
- Added deterministic `POST /forecast/win-likelihood` contracts for next-two-races driver/team probabilities, top factors, confidence, generated timestamp, and data freshness.
- Wired the Strategy page to call `GET /predict/sample-request` and `POST /predict` through the typed frontend API layer, with local prediction fallback.
- Updated `PitRecommendationPanel` to render `PredictionResponse` fields, loading state, top factors, and backend/local fallback status instead of hard-coded recommendation details.
- Added typed frontend API support for `POST /forecast/win-likelihood` with deterministic local fallback data.
- Replaced the static Strategy page forecast preview with a forecast panel that calls `getWinLikelihoodForecast()` and renders probabilities, confidence, top factors, data freshness, and fallback state.

## Completed

- Repository structure is easier to read.
- Core docs exist and describe the intended MVP plus forecasting direction.
- Health route is implemented and organized under backend routes.
- Frontend now has a usable mock-data RaceIQ dashboard.
- Frontend has a first Playwright smoke test suite.
- Backend has deterministic contracts for health, predict, predict sample request, replay, the sample strategy dashboard, and win-likelihood forecasting.
- Replay responses now include current lap, total laps, lap range, weather, safety car state, and timeline events for the future timeline UI.
- Strategy dashboard data can now come from the backend sample endpoint or the local fixture fallback.
- The Strategy recommendation panel can now render backend prediction data, a loading state, or a deterministic local fallback.
- The Strategy page now exposes deterministic forecast data through a visible forecast panel.

## In Progress

- Dashboard polish and forecast scenario controls are ready for the next iteration.

## Not Started

- PostgreSQL schema and migrations.
- Data ingestion scripts.
- ML model training.
- Model-backed win-likelihood forecasting.
- Full-stack integration tests that assert the frontend successfully renders backend-provided sample data.

## Next Recommended Steps

1. Add richer sample race scenarios.
2. Add full-stack integration coverage for the optional backend sample and prediction data paths.
3. Add scenario controls for forecast horizon, sentiment inclusion, and selected races.
4. Design the PostgreSQL schema for forecasting before implementing ingestion.
5. Plan the first model-backed forecast baseline after data foundations are defined.

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
