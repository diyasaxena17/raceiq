# RaceIQ Architecture

## Overview

RaceIQ is a full-stack F1 race strategy simulator.

The application is designed as a monorepo with:

- React frontend
- Spring Boot backend services
- PostgreSQL database
- Docker-based local development
- Optional real F1 data ingestion layer

## Monorepo Structure

```txt
raceiq/
├── apps/
│   └── frontend/
├── services/
│   ├── user-service/
│   ├── race-service/
│   ├── strategy-service/
│   └── ai-insights-service/
├── data/
│   ├── raw/
│   ├── processed/
│   └── scripts/
├── infra/
│   ├── docker/
│   └── database/
├── docs/
├── scripts/
├── docker-compose.yml
└── README.md