# RaceIQ MVP Plan

## Goal

Build a polished F1 race strategy simulator in 2 weeks.

RaceIQ should feel like a modern F1 pit wall strategy dashboard, combining strong visual design with believable simulation logic and real F1 data support.

## MVP Priorities

1. Stunning frontend
2. Working simulation flow
3. Believable strategy model
4. Charts and strategy timeline
5. Real F1 data support through a controlled ingestion layer
6. Strong README and GitHub presentation

## MVP Must-Haves

- Landing page
- Dashboard page
- New simulation page
- Results page
- Mock simulation data
- Lap time chart
- Tyre degradation chart
- Strategy timeline
- AI insight card
- Real-data-ready architecture
- Recruiter-quality README

## MVP Should-Haves

- Spring Boot strategy-service
- REST API for simulations
- PostgreSQL persistence
- Docker Compose setup
- OpenF1-based data ingestion script

## Nice-To-Haves

- FastF1 telemetry analysis
- Real LLM API integration
- User accounts
- Cloud deployment
- Kubernetes/GKE
- Advanced ML strategy optimization

## Out of Scope for Initial MVP

- Authentication
- Payments
- Live race tracking
- Full Kubernetes setup
- Complex machine learning model
- Full real-time telemetry dashboard
- Multi-user simulation sharing

## Real F1 Data Rule

Real F1 data should support the project, not slow it down.

Initial plan:
1. Use mock frontend data first.
2. Build the simulation UI.
3. Add backend API.
4. Add OpenF1 ingestion for real circuits, sessions, drivers, lap times, and weather.
5. Store selected real data in PostgreSQL.
6. Use that data to improve simulation defaults.

## Development Rule

Do not overbuild.

A beautiful, complete, explainable MVP is better than an unfinished massive system.