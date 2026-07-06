from pydantic import BaseModel, Field

from app.schemas.race_state import RaceMetadata, TimelineEvent


class ReplayRequest(BaseModel):
    race_id: str = Field("silverstone-2026-sim")
    focus_driver: str = Field("NOR")
    from_lap: int = Field(1, ge=1)
    to_lap: int | None = Field(None, ge=1)


class ReplayResponse(BaseModel):
    race_state: RaceMetadata
    events: list[TimelineEvent]
