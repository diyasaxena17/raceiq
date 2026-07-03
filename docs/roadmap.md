# RaceIQ Roadmap

## Goal

Build a polished F1 race strategy simulator first, then expand RaceIQ into a short-term F1 win-likelihood forecasting dashboard.

RaceIQ should feel like a modern F1 pit wall dashboard: visual, fast, and grounded in believable race strategy logic.

The first forecasting target is driver and team win likelihood over the next two races. Later versions can expand this to all remaining races in the season.

## MVP Priorities

1. Stunning frontend
2. Working pit recommendation flow
3. Race replay or timeline view
4. Tyre degradation and strategy charts
5. Simple FastAPI backend
6. Recruiter-quality README and docs

## MVP Must-Haves

- Dashboard-first React experience
- Race timeline
- Driver strategy cards
- Tyre degradation chart
- Pit recommendation panel
- FastAPI health and prediction routes
- Mock or sample race data for the first frontend pass
- Clear project documentation

## MVP Should-Haves

- Small ML training pipeline
- Sample dataset
- Basic model evaluation output
- Replay endpoint
- Docker Compose setup later if time allows
- PostgreSQL-backed data model for forecasting, after the first demo is working

## Nice-To-Haves

- FastF1 data collection
- More advanced feature engineering
- Next-two-races driver/team win-likelihood forecasting
- Sentiment features from team and media sources
- Remaining-season forecast mode
- Real LLM strategy summaries
- Authentication
- Cloud deployment

## Out of Scope for Initial MVP

- Live race tracking
- Full telemetry dashboard
- Complex multi-service backend
- User accounts
- Kubernetes or heavy infrastructure
- Betting or gambling workflow

## Development Rule

Do not overbuild.

A beautiful, complete, explainable MVP is better than an unfinished massive system.

## Forecasting Roadmap

### Forecasting Phase 1: Data Foundation

- Add PostgreSQL when historical data and saved forecasts become necessary.
- Design tables for races, circuits, drivers, teams, results, sessions, weather, sentiment, model runs, and forecast outputs.
- Seed enough historical data to train a first baseline model.
- Build ingestion scripts for race/session data, weather, and sentiment snapshots.

### Forecasting Phase 2: Next Two Races

- Add a `/forecast/win-likelihood` backend endpoint.
- Predict driver and team win likelihood for the next two races.
- Show forecast cards, probability charts, top factors, and uncertainty in the dashboard.
- Start with deterministic baseline logic, then replace internals with a trained model.

### Forecasting Phase 3: Remaining Season

- Expand forecast horizon from two races to all remaining races.
- Add scenario controls for weather, upgrades, penalties, and driver/team form.
- Track forecast accuracy over time.
