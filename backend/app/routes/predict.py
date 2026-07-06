from fastapi import APIRouter, HTTPException

from app.schemas.prediction import PredictionResponse
from app.schemas.race_state import RaceStateRequest
from app.services.model_service import predict_pit_strategy

router = APIRouter(tags=["strategy"])


@router.post("/predict", response_model=PredictionResponse)
def predict_strategy(race_state: RaceStateRequest) -> PredictionResponse:
    try:
        return predict_pit_strategy(race_state)
    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error)) from error
