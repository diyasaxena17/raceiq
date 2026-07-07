from typing import Literal

from pydantic import BaseModel, Field


ForecastHorizon = Literal["next_2_races"]


class WinLikelihoodRequest(BaseModel):
    forecast_horizon: ForecastHorizon = Field("next_2_races")
    race_ids: list[str] = Field(
        default_factory=lambda: ["monaco-2026", "canada-2026"],
        min_length=1,
        max_length=2,
    )
    include_sentiment: bool = True


class ForecastRace(BaseModel):
    race_id: str
    race_name: str
    circuit: str
    round: int


class EntityProbability(BaseModel):
    entity_id: str
    entity_name: str
    probability: float = Field(..., ge=0, le=1)
    rank: int = Field(..., ge=1)
    race_id: str | None = None
    team: str | None = None
    top_factors: list[str]


class ForecastFactor(BaseModel):
    label: str
    impact: Literal["positive", "negative", "neutral"]
    weight: float = Field(..., ge=0, le=1)
    detail: str


class WinLikelihoodResponse(BaseModel):
    forecast_horizon: ForecastHorizon
    race_ids: list[str]
    races: list[ForecastRace]
    driver_probabilities: list[EntityProbability]
    team_probabilities: list[EntityProbability]
    top_factors: list[ForecastFactor]
    model_confidence: float = Field(..., ge=0, le=1)
    generated_at: str
    data_freshness: str
