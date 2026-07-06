from app.schemas.race_state import (
    DashboardDriver,
    DashboardRaceState,
    ForecastPreview,
    RaceMetadata,
    StrategyBranch,
    StrategyDashboardResponse,
    TimelineEvent,
    TyrePoint,
)
from app.schemas.replay import ReplayRequest, ReplayResponse

SAMPLE_RACE_STATE = RaceMetadata(
    race_id="silverstone-2026-sim",
    race_name="Silverstone Strategy Lab",
    session="Race simulation",
    circuit="Silverstone",
    lap=27,
    total_laps=52,
    weather="Cloud cover building",
    track_temp_c=31.0,
    rain_chance=0.18,
    safety_car="clear",
    focus_driver="NOR",
)

SAMPLE_TIMELINE = [
    TimelineEvent(
        lap=12,
        title="Opening tyre phase settled",
        detail="Front runners stop attacking and begin protecting the left front.",
        type="race",
    ),
    TimelineEvent(
        lap=18,
        title="Virtual safety car window",
        detail="Pit loss drops by 5.2s, but the lead pack stays out.",
        type="warning",
    ),
    TimelineEvent(
        lap=24,
        title="Ferrari starts the undercut threat",
        detail="Leclerc gains three tenths over the last two laps.",
        type="pit",
    ),
    TimelineEvent(
        lap=27,
        title="RaceIQ calls the decision lap",
        detail="Norris can pit into clean air and attack on hard tyres.",
        type="pit",
    ),
    TimelineEvent(
        lap=31,
        title="Light rain risk appears",
        detail="Radar shows a weak shower crossing sector three.",
        type="weather",
    ),
]


def get_replay(request: ReplayRequest) -> ReplayResponse:
    to_lap = request.to_lap or SAMPLE_RACE_STATE.total_laps
    events = [
        event
        for event in SAMPLE_TIMELINE
        if request.from_lap <= event.lap <= to_lap
    ]

    return ReplayResponse(race_state=SAMPLE_RACE_STATE, events=events)


def get_strategy_sample() -> StrategyDashboardResponse:
    return StrategyDashboardResponse(
        raceState=DashboardRaceState(
            race="Silverstone Strategy Lab",
            session="Race simulation",
            lap=27,
            totalLaps=52,
            weather="Cloud cover building",
            trackTemp="31 C",
            rainChance="18%",
            safetyCar="Clear",
            focusDriver="NOR",
            headline="Read the race before the race reads you.",
            subline=(
                "A mock pit wall built from race state, tyre life, "
                "and strategy branches."
            ),
        ),
        drivers=[
            DashboardDriver(
                code="NOR",
                name="Lando Norris",
                team="McLaren",
                teamColor="#ff8c1a",
                position=6,
                gap="+12.4s",
                tyre="Medium",
                tyreAge=18,
                pitStops=0,
                paceDelta="+0.47s",
                risk="High",
                status="Tyres near cliff",
            ),
            DashboardDriver(
                code="LEC",
                name="Charles Leclerc",
                team="Ferrari",
                teamColor="#ef1a2d",
                position=5,
                gap="+9.1s",
                tyre="Medium",
                tyreAge=16,
                pitStops=0,
                paceDelta="+0.33s",
                risk="Medium",
                status="Covering undercut",
            ),
            DashboardDriver(
                code="HAM",
                name="Lewis Hamilton",
                team="Mercedes",
                teamColor="#00d084",
                position=7,
                gap="+15.8s",
                tyre="Hard",
                tyreAge=7,
                pitStops=1,
                paceDelta="-0.12s",
                risk="Low",
                status="Clean air push",
            ),
        ],
        timelineEvents=SAMPLE_TIMELINE,
        tyreData=[
            TyrePoint(lap=12, medium=0.14, hard=0.04, projected=0.1),
            TyrePoint(lap=16, medium=0.21, hard=0.06, projected=0.15),
            TyrePoint(lap=20, medium=0.31, hard=0.09, projected=0.22),
            TyrePoint(lap=24, medium=0.42, hard=0.13, projected=0.31),
            TyrePoint(lap=27, medium=0.53, hard=0.16, projected=0.4),
            TyrePoint(lap=31, medium=0.71, hard=0.21, projected=0.58),
            TyrePoint(lap=36, medium=0.94, hard=0.3, projected=0.82),
        ],
        strategyBranches=[
            StrategyBranch(
                label="Pit this lap",
                tone="green",
                summary="Hard tyre, clean air, attack phase from lap 29.",
                rejoin="P9 behind Alonso",
                finish="Projected P5",
                risk="Low traffic risk",
                laps=["L27 Box", "L28 Out-lap", "L31 P7", "L44 P5"],
            ),
            StrategyBranch(
                label="Stay out",
                tone="yellow",
                summary="Protect track position but risk the medium tyre cliff.",
                rejoin="Holds P6",
                finish="Projected P9",
                risk="High degradation risk",
                laps=["L27 Hold", "L30 Pace drop", "L34 Box", "L44 P9"],
            ),
        ],
        forecastPreview=[
            ForecastPreview(label="McLaren", value=34, color="#60a5fa"),
            ForecastPreview(label="Ferrari", value=28, color="#3b82f6"),
            ForecastPreview(label="Mercedes", value=21, color="#2563eb"),
            ForecastPreview(label="Red Bull", value=17, color="#93c5fd"),
        ],
    )
