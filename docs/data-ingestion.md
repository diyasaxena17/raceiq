# RaceIQ Data Ingestion

## Goal

Add real F1 data to RaceIQ without slowing down the 2-week MVP.

## Data Source Choice

Primary MVP data source:

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

## MVP Real Data Scope

Use real data only for:

- circuits
- drivers
- sessions
- lap times
- weather samples

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
