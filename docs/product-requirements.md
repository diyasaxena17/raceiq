# RaceIQ Product Requirements

## Product Summary

RaceIQ is an F1 race strategy simulator that helps a user explore pit stop timing, tyre life, race pace, and simple strategy recommendations from a pit wall style dashboard.

The MVP should be a polished portfolio product, not a full live telemetry platform. It should make one core workflow feel complete: load a race scenario, inspect the current race state, receive a pit recommendation, and understand the reasoning.

## Target Users

- Recruiters and hiring managers reviewing a full-stack and ML portfolio project.
- F1 fans who want to explore race strategy tradeoffs visually.
- Developers or data practitioners who want to understand how the prediction flow is built.

## User Problem

Race strategy is hard to reason about because tyre degradation, track position, lap number, weather, and pit loss all interact. RaceIQ should make those tradeoffs visible and explainable in a single dashboard.

## MVP Goals

- Show a beautiful, responsive F1 strategy dashboard.
- Let the user inspect one simulated race scenario.
- Return a pit recommendation from a backend endpoint.
- Explain why the recommendation was made in plain language.
- Show supporting race context: driver cards, timeline, tyre degradation chart, and key metrics.
- Keep the system easy to run locally and easy to explain in docs.

## Non-Goals

- Live race ingestion.
- Full telemetry analysis.
- User accounts or authentication.
- Multi-team collaboration features.
- Production deployment infrastructure.
- Complex ML experimentation platform.

## Core MVP Workflow

1. User opens the RaceIQ dashboard.
2. Dashboard loads a sample race scenario.
3. User selects or reviews a driver and current lap state.
4. Frontend sends the race state to the backend.
5. Backend builds model features and returns a pit recommendation.
6. Dashboard displays recommendation, confidence, reasoning, timeline context, and tyre trend.

## Functional Requirements

### Dashboard

- Display current race metadata: circuit, lap, weather, safety car status, and session name.
- Display driver strategy cards with position, gap, tyre compound, tyre age, and pit stop count.
- Display a pit recommendation panel with decision, confidence, predicted outcome, and explanation.
- Display a race timeline of important events.
- Display a tyre degradation chart for at least one driver or compound.
- Use mock/sample data until real data ingestion is ready.

### Backend API

- `GET /health` returns service health.
- `POST /predict` accepts current race state and returns a recommendation.
- `POST /replay` returns timeline or replay state for a sample scenario.
- API responses should be typed with Pydantic schemas.
- Backend should support deterministic stub logic first, then model-backed logic.

### ML/Data

- Define the training and inference feature set before training.
- Support a small processed sample dataset for local development.
- Train a simple classifier or rules-plus-model baseline for pit recommendation.
- Store metrics and feature importance after a real training run.
- Document model limitations in `docs/model-card.md`.

## Recommendation Output

The prediction endpoint should return:

- `recommendation`: `pit_now`, `stay_out`, or `monitor`
- `confidence`: number from `0` to `1`
- `reason`: short plain-language explanation
- `risk_level`: `low`, `medium`, or `high`
- `expected_time_delta`: estimated gain/loss in seconds
- `suggested_compound`: tyre compound when pitting is recommended

## Success Metrics

- A new user can run the frontend and backend locally from documented commands.
- The main dashboard is usable on desktop and mobile.
- The predict endpoint works with a documented example payload.
- The app can complete the core MVP workflow without manual code edits.
- README and docs clearly explain architecture, model status, and next steps.

## Current Status

RaceIQ is in early scaffold stage.

- Frontend: React, TypeScript, Vite, Tailwind, Recharts, Framer Motion, and Lucide are installed. The current UI is a static hero screen. Dashboard component files exist but are empty.
- Backend: FastAPI is installed and `GET /health` exists in `backend/app/main.py`. Predict, replay, schema, and service files exist but are empty.
- ML: ML directories, output files, and script names exist. Training, collection, dataset, and evaluation scripts are empty. Metrics and feature importance outputs are placeholders.
- Docs: Initial planning docs exist, but they need to be kept in sync as implementation begins.
- Tooling: `frontend/package-lock.json` and `node_modules` exist. `docker-compose.yml`, setup script, and dev runner are placeholders.

## Suggested Sprint Breakdown

### Sprint 1: Working Product Skeleton

- Replace the static hero with a real dashboard layout.
- Add sample race data in the frontend or shared fixture file.
- Implement driver cards, pit panel, timeline, and tyre chart with mock data.
- Wire frontend API client shape even if backend predict is still stubbed.

### Sprint 2: Backend Contracts

- Add Pydantic schemas for race state and prediction response.
- Implement `/predict` with deterministic strategy rules.
- Implement `/replay` with sample race timeline data.
- Update `docs/api.md` with real request and response examples.

### Sprint 3: ML Baseline

- Define data dictionary fields.
- Build or seed a small processed dataset.
- Train a simple baseline model.
- Save real metrics and feature importance.
- Connect model service behind the existing `/predict` contract.

### Sprint 4: Polish and Portfolio Readiness

- Improve responsive UI, loading states, and error states.
- Add README run instructions and screenshots.
- Add model card details and limitations.
- Add Docker or one-command local dev only if it helps the demo.
