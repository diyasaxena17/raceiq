# RaceIQ

RaceIQ is an F1 race strategy simulator built as a polished full-stack portfolio project.

The MVP focuses on a visually strong strategy dashboard, a FastAPI backend for pit strategy prediction and replay endpoints, and a small ML workspace for training and evaluating a pit recommendation model.

## Project Structure

```txt
raceiq/
├── frontend/   # React + TypeScript + Vite dashboard
├── backend/    # FastAPI app and model-serving layer
├── ml/         # data collection, training, experiments, and outputs
├── docs/       # planning, architecture, model, and data docs
└── scripts/    # local helper scripts
```

## MVP Priorities

- Stunning React dashboard
- Pit recommendation and race replay flow
- Simple FastAPI backend
- Focused ML pipeline, not a complex live telemetry system
- Strong documentation for portfolio review

## Docs

- [Product Requirements](docs/product-requirements.md)
- [Architecture](docs/architecture.md)
- [API](docs/api.md)
- [Roadmap](docs/roadmap.md)

## Status

RaceIQ is currently in early MVP scaffold stage. The frontend renders a static hero screen, the backend exposes `GET /health`, and the dashboard, prediction, replay, and ML pipeline pieces are placeholders ready for implementation.
