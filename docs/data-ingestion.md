# RaceIQ Data Ingestion

## Goal

Add real F1 data to RaceIQ without slowing down the first MVP, then expand the data pipeline to support next-two-races win-likelihood forecasting.

## Data Source Choice

Primary MVP race/session source:

- OpenF1 API

Why OpenF1?

- Provides F1 session, lap, weather, driver, and telemetry-style data
- Historical data is available
- JSON/CSV access is simple for a web app
- Easier to integrate than a full Python telemetry pipeline

Optional later source:

- FastF1 Python package

Why FastF1 later?

- Strong for advanced telemetry analysis
- Useful for future ML or strategy modeling
- Better suited for Python notebooks or data science scripts

Additional forecasting sources to evaluate:

- F1 race calendar and historical results
- Weather forecast API for upcoming race weekends
- Historical weather observations by circuit/session
- Team and driver metadata
- News/media feeds or curated article datasets for sentiment
- Team communications, press conference text, and official statements where available

## MVP Real Data Scope

Use real data only for:

- circuits
- drivers
- sessions
- lap times
- weather samples

Forecasting data scope:

- upcoming race calendar for the next two races
- historical race and qualifying results
- track characteristics and historical track fit
- team and driver recent form
- car performance proxies
- reliability and pit stop performance
- weather forecasts and historical weather context
- team/media sentiment snapshots

Do not try to build a complete live F1 telemetry system.

## Initial Data Pipeline

```txt
OpenF1 API
  ↓
Node or Python ingestion script
  ↓
data/raw/*.json
  ↓
data/processed/*.json
  ↓
PostgreSQL seed data
  ↓
Strategy Service
```

## Forecasting Pipeline

```txt
Race/session/weather/sentiment sources
  ↓
ml/pipeline-scripts/collect_*.py
  ↓
ml/data/raw/
  ↓
ml/data/processed/
  ↓
PostgreSQL feature tables
  ↓
Forecast training/inference scripts
  ↓
backend/models/
  ↓
Forecast Service
```

## PostgreSQL Role

PostgreSQL is not required for the first static dashboard or pit strategy demo. It becomes the right default once forecasting needs:

- repeatable joins across drivers, teams, races, tracks, sessions, weather, and sentiment
- persisted training features
- saved model runs and forecast outputs
- API caching for dashboard views
- a clear audit trail for where each forecast came from
