# RaceIQ Architecture

## Overview

RaceIQ is a full-stack F1 race strategy simulator organized around a focused MVP:

- React frontend for the strategy dashboard
- FastAPI backend for prediction, replay, and health routes
- ML workspace for data collection, feature building, training, and evaluation
- Lightweight docs and helper scripts

## Monorepo Structure

```txt
raceiq/
├── frontend/
├── backend/
├── ml/
├── docs/
├── scripts/
├── docker-compose.yml
└── README.md
```

## MVP Architecture

```txt
Frontend dashboard
  ↓
FastAPI backend
  ↓
Feature builder + model service
  ↓
Pit recommendation model
```

The first implementation should stay narrow: build the visual simulator, expose a small backend API, and train or stub one explainable pit recommendation model.
