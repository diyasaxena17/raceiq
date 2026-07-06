from typing import Literal

from pydantic import BaseModel, Field


class PredictionResponse(BaseModel):
    recommendation: Literal["pit_now", "stay_out", "monitor"]
    confidence: float = Field(..., ge=0, le=1)
    reason: str
    risk_level: Literal["low", "medium", "high"]
    expected_time_delta: float = Field(
        ...,
        description="Estimated race-time gain or loss in seconds. Positive means gain.",
    )
    suggested_compound: Literal["soft", "medium", "hard", "intermediate", "wet"] | None
    top_factors: list[str]
