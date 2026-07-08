from typing import Literal

from pydantic import BaseModel, Field

from app.schemas.race_state import RaceMetadata, TimelineEvent


class ReplayRequest(BaseModel):
    race_id: str = Field("silverstone-2026-sim")
    focus_driver: str = Field("NOR")
    from_lap: int = Field(1, ge=1)
    to_lap: int | None = Field(None, ge=1)
    scenario_id: str | None = Field(None)


class ReplayLapRange(BaseModel):
    fromLap: int
    toLap: int


class ReplayState(BaseModel):
    raceId: str
    race: str
    session: str
    circuit: str
    currentLap: int
    totalLaps: int
    lapRange: ReplayLapRange
    weather: str
    safetyCar: Literal["clear", "vsc", "safety_car"]
    focusDriver: str


class ReplayResponse(BaseModel):
    race_state: RaceMetadata
    events: list[TimelineEvent]
    replayState: ReplayState
    timelineEvents: list[TimelineEvent]
