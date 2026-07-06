from typing import Literal

from pydantic import BaseModel, Field

Compound = Literal["soft", "medium", "hard", "intermediate", "wet"]
RiskLevel = Literal["low", "medium", "high"]


class DriverRaceState(BaseModel):
    code: str = Field(..., examples=["NOR"])
    name: str = Field(..., examples=["Lando Norris"])
    team: str = Field(..., examples=["McLaren"])
    position: int = Field(..., ge=1, le=20)
    gap_seconds: float = Field(..., ge=0)
    tyre: Compound
    tyre_age: int = Field(..., ge=0)
    pit_stops: int = Field(..., ge=0)
    pace_delta: float = Field(
        ...,
        description="Seconds per lap relative to the driver's expected baseline.",
    )


class RaceStateRequest(BaseModel):
    race_id: str = Field(..., examples=["silverstone-2026-sim"])
    circuit: str = Field(..., examples=["Silverstone"])
    lap: int = Field(..., ge=1)
    total_laps: int = Field(..., ge=1)
    weather: str = Field(..., examples=["Cloud cover building"])
    track_temp_c: float = Field(..., examples=[31.0])
    rain_chance: float = Field(..., ge=0, le=1)
    safety_car: Literal["clear", "vsc", "safety_car"]
    focus_driver: str = Field(..., examples=["NOR"])
    drivers: list[DriverRaceState]


class RaceMetadata(BaseModel):
    race_id: str
    race_name: str
    session: str
    circuit: str
    lap: int
    total_laps: int
    weather: str
    track_temp_c: float
    rain_chance: float
    safety_car: Literal["clear", "vsc", "safety_car"]
    focus_driver: str


class DashboardDriver(BaseModel):
    code: str
    name: str
    team: str
    team_color: str
    position: int
    gap: str
    tyre: str
    tyre_age: int
    pit_stops: int
    pace_delta: str
    risk: Literal["Low", "Medium", "High"]
    status: str


class TimelineEvent(BaseModel):
    lap: int
    title: str
    detail: str
    type: Literal["race", "pit", "weather", "warning"]


class TyrePoint(BaseModel):
    lap: int
    medium: float
    hard: float
    projected: float


class StrategyBranch(BaseModel):
    label: str
    tone: Literal["green", "yellow"]
    summary: str
    rejoin: str
    finish: str
    risk: str
    laps: list[str]


class ForecastPreview(BaseModel):
    label: str
    value: int
    color: str


class StrategySampleResponse(BaseModel):
    race_state: RaceMetadata
    headline: str
    subline: str
    drivers: list[DashboardDriver]
    timeline_events: list[TimelineEvent]
    tyre_data: list[TyrePoint]
    strategy_branches: list[StrategyBranch]
    forecast_preview: list[ForecastPreview]
