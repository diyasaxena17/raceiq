from fastapi import APIRouter, HTTPException

from app.schemas.prediction import PredictionResponse
from app.schemas.race_state import RaceStateRequest
from app.services.model_service import predict_pit_strategy
from app.services.replay_service import get_sample_predict_request

router = APIRouter(tags=["strategy"])


@router.get("/predict/sample-request", response_model=RaceStateRequest)
def predict_sample_request() -> RaceStateRequest:
    return get_sample_predict_request()


@router.post("/predict", response_model=PredictionResponse)
def predict_strategy(race_state: RaceStateRequest) -> PredictionResponse:
    try:
        return predict_pit_strategy(race_state)
    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error)) from error
