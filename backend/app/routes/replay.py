from fastapi import APIRouter

from app.schemas.race_state import StrategySampleResponse
from app.schemas.replay import ReplayRequest, ReplayResponse
from app.services.replay_service import get_replay, get_strategy_sample

router = APIRouter(tags=["strategy"])


@router.post("/replay", response_model=ReplayResponse)
def replay_race(request: ReplayRequest) -> ReplayResponse:
    return get_replay(request)


@router.get("/strategy/sample", response_model=StrategySampleResponse)
def strategy_sample() -> StrategySampleResponse:
    return get_strategy_sample()
