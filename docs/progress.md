# RaceIQ Project Progress

This document is the running project journal for RaceIQ. Update it at the end of each meaningful work session so reviewers can see what changed, what is working, and what is still planned.

## Current Phase

Early MVP dashboard and backend contract alignment, with deterministic scenario support.

## Current Status

- Frontend: React, TypeScript, Vite, Tailwind, Recharts, Framer Motion, and Lucide are installed. The app has a cinematic landing page, a routed strategy dashboard, route-level code splitting, a scenario selector, and a typed API boundary with local fixture fallback.
- Backend: FastAPI is installed. `GET /health`, `GET /strategy/scenarios`, `GET /strategy/sample`, `GET /strategy/sample/{scenario_id}`, `GET /predict/sample-request`, `GET /predict/sample-request/{scenario_id}`, `POST /predict`, `POST /replay`, and `POST /forecast/win-likelihood` are implemented with deterministic service logic and Pydantic schemas.
- Testing: local-fallback Playwright, full-stack Playwright, backend compile checks, and backend contract tests are available. The full-stack suite starts FastAPI and verifies backend-backed Strategy scenarios.
- ML: data folders, pipeline script placeholders, and output placeholders exist. No model has been trained yet.
- Data: static/sample scenario data is implemented first. PostgreSQL is deferred until the forecasting phase needs historical features, sentiment snapshots, model runs, and forecast outputs.
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
- Wired the Strategy page timeline to `POST /replay` through the typed frontend API layer, with dashboard timeline fallback.
- Updated the README to reflect the current routed frontend, deterministic backend contracts, local run commands, testing commands, and `VITE_RACEIQ_API_BASE_URL` behavior.
- Added a frontend race-scenario system with Silverstone, Monaco, and Spa scenarios that drive the Strategy page cards, recommendation, timeline, tyre chart, circuit panel, and forecast preview.
- Preserved the optional backend strategy, prediction, and replay calls for the default Silverstone scenario while keeping additional scenarios deterministic and local.
- Made the typed frontend API layer scenario-aware so strategy, prediction, replay, and forecast fallbacks match the selected local race scenario while preserving the existing backend contracts.
- Expanded frontend scenario coverage and backend sample contract assertions for the scenario-shaped dashboard payload.
- Added a deterministic backend scenario contract with `GET /strategy/scenarios`, scenario-specific strategy samples, scenario-specific predict sample requests, and scenario-aware replay.
- Updated the frontend API layer and Strategy selector to consume `GET /strategy/scenarios` while preserving local scenario fallback behavior.
- Tuned the deterministic scenario data so Silverstone, Monaco, and Spa produce distinct visible race states and pit recommendations across backend and fallback paths.
- Added explicit backend and Playwright coverage for scenario routes, scenario switching, desktop/mobile rendering, and default Silverstone fallback behavior.

### 2026-07-10

- Added a dedicated full-stack Playwright mode that starts FastAPI, starts Vite with `VITE_RACEIQ_API_BASE_URL=http://127.0.0.1:8000`, and keeps the existing local-fallback E2E suite separate.
- Expanded full-stack Strategy coverage so Silverstone, Monaco, and Spa verify scenario selection, circuit, weather, lap state, pit recommendation, replay timeline, and forecast/backend/fallback source status.
- Polished Strategy data-source status UI with stable `LIVE API`, `LOCAL`, and `SYNCING` chips for prediction, replay, and forecast panels.
- Updated docs to capture the scenario-backed frontend/backend handoff and the remaining deferred work.

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
- The Strategy timeline can now use backend replay data or dashboard timeline fallback while preserving scrubber interaction.
- The README now matches the current project state instead of describing the old static scaffold.
- The Strategy dashboard can now switch between three deterministic race scenarios without changing routes.
- The scenario selector now requests contract-shaped data through `frontend/src/lib/api.ts` for every selected scenario.
- The backend can now serve the same deterministic Strategy scenarios through API contracts while preserving Silverstone as the default path.
- The Strategy selector can now hydrate its scenario catalog from the backend when `VITE_RACEIQ_API_BASE_URL` is set.
- Desktop/mobile Playwright checks and backend contract tests cover the scenario selector, default Silverstone fallback, and scenario-specific backend routes.
- Full-stack Playwright coverage now verifies backend-backed Strategy rendering for Silverstone, Monaco, and Spa.
- Strategy source badges now make live backend, local fallback, and loading states visible without shifting panel layout.

## In Progress

- Forecast scenario controls and model-readiness work are ready for later iterations.

## Not Started

- PostgreSQL schema and migrations.
- Data ingestion scripts.
- ML model training.
- Model-backed win-likelihood forecasting.
- Backend-backed scenario-specific win-likelihood forecasting beyond the default deterministic contract.
- Live F1 data feeds, telemetry, and sentiment ingestion.

## Next Recommended Steps

1. Add forecast controls for horizon, sentiment inclusion, and selected races.
2. Split the verbose deterministic scenario registry into a clearer backend scenario module if it keeps growing.
3. Design the PostgreSQL schema for forecasting before implementing ingestion.
4. Plan the first model-backed forecast baseline after data foundations are defined.
5. Add backend-backed scenario-specific forecast behavior when the forecast contract is ready to vary by selected scenario.

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
