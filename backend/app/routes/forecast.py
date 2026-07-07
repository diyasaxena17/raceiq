from fastapi import APIRouter

from app.schemas.forecast import WinLikelihoodRequest, WinLikelihoodResponse
from app.services.forecast_service import forecast_win_likelihood

router = APIRouter(tags=["forecast"])


@router.post("/forecast/win-likelihood", response_model=WinLikelihoodResponse)
def win_likelihood_forecast(
    request: WinLikelihoodRequest,
) -> WinLikelihoodResponse:
    return forecast_win_likelihood(request)
