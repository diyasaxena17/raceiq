from fastapi import APIRouter

from app.schemas.race_state import StrategyDashboardResponse, StrategyScenarioSummary
from app.schemas.replay import ReplayRequest, ReplayResponse
from app.services.replay_service import (
    get_replay,
    get_strategy_sample,
    list_strategy_scenarios,
)

router = APIRouter(tags=["strategy"])


@router.post("/replay", response_model=ReplayResponse)
def replay_race(request: ReplayRequest) -> ReplayResponse:
    return get_replay(request)


@router.get("/strategy/scenarios", response_model=list[StrategyScenarioSummary])
def strategy_scenarios() -> list[StrategyScenarioSummary]:
    return list_strategy_scenarios()


@router.get("/strategy/sample", response_model=StrategyDashboardResponse)
def strategy_sample() -> StrategyDashboardResponse:
    return get_strategy_sample()


@router.get("/strategy/sample/{scenario_id}", response_model=StrategyDashboardResponse)
def strategy_sample_for_scenario(scenario_id: str) -> StrategyDashboardResponse:
    return get_strategy_sample(scenario_id)
