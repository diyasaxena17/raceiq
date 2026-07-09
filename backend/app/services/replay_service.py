from dataclasses import dataclass

from app.schemas.race_state import (
    DashboardDriver,
    DashboardRaceState,
    DriverRaceState,
    ForecastPreview,
    RaceMetadata,
    RaceStateRequest,
    StrategyBranch,
    StrategyDashboardResponse,
    StrategyScenarioSummary,
    TimelineEvent,
    TyrePoint,
)
from app.schemas.replay import ReplayLapRange, ReplayRequest, ReplayResponse, ReplayState

DEFAULT_SCENARIO_ID = "silverstone-undercut"


@dataclass(frozen=True)
class StrategyScenario:
    id: str
    label: str
    summary: str
    race_state: RaceMetadata
    dashboard: StrategyDashboardResponse
    predict_drivers: list[DriverRaceState]


SILVERSTONE_TIMELINE = [
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

MONACO_TIMELINE = [
    TimelineEvent(
        lap=25,
        title="Leaders complete first stops",
        detail="The front three rejoin nose-to-tail on hard tyres.",
        type="pit",
    ),
    TimelineEvent(
        lap=35,
        title="Traffic compresses the window",
        detail="A second stop would rejoin behind a six-car DRS queue.",
        type="warning",
    ),
    TimelineEvent(
        lap=42,
        title="RaceIQ protects the place",
        detail="The model favors staying out until a safety-car discount appears.",
        type="race",
    ),
    TimelineEvent(
        lap=50,
        title="Soft tyre offset fades",
        detail="New softs are quick for two laps, then trapped behind traffic.",
        type="weather",
    ),
]

SPA_TIMELINE = [
    TimelineEvent(
        lap=9,
        title="Dry race pace stabilizes",
        detail="Medium runners hold a small advantage through sector one.",
        type="race",
    ),
    TimelineEvent(
        lap=15,
        title="Radar turns purple",
        detail="A fast-moving shower crosses the Kemmel straight projection.",
        type="weather",
    ),
    TimelineEvent(
        lap=18,
        title="RaceIQ holds the trigger",
        detail="Intermediate pace is not ready yet, but the crossover is close.",
        type="warning",
    ),
    TimelineEvent(
        lap=20,
        title="Crossover lap expected",
        detail="If rain reaches sector two, the stop becomes live immediately.",
        type="pit",
    ),
]


def build_dashboard(
    race_state: DashboardRaceState,
    drivers: list[DashboardDriver],
    timeline: list[TimelineEvent],
    tyre_data: list[TyrePoint],
    branches: list[StrategyBranch],
    forecast_preview: list[ForecastPreview],
) -> StrategyDashboardResponse:
    return StrategyDashboardResponse(
        raceState=race_state,
        drivers=drivers,
        timelineEvents=timeline,
        tyreData=tyre_data,
        strategyBranches=branches,
        forecastPreview=forecast_preview,
    )


SCENARIOS = {
    "silverstone-undercut": StrategyScenario(
        id="silverstone-undercut",
        label="Silverstone undercut",
        summary="Dry track, medium tyres fading, undercut window opening.",
        race_state=RaceMetadata(
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
        ),
        predict_drivers=[
            DriverRaceState(
                code="NOR",
                name="Lando Norris",
                team="McLaren",
                position=6,
                gap_seconds=12.4,
                tyre="medium",
                tyre_age=18,
                pit_stops=0,
                pace_delta=0.47,
            ),
            DriverRaceState(
                code="LEC",
                name="Charles Leclerc",
                team="Ferrari",
                position=5,
                gap_seconds=9.1,
                tyre="medium",
                tyre_age=16,
                pit_stops=0,
                pace_delta=0.33,
            ),
            DriverRaceState(
                code="HAM",
                name="Lewis Hamilton",
                team="Mercedes",
                position=7,
                gap_seconds=15.8,
                tyre="hard",
                tyre_age=7,
                pit_stops=1,
                pace_delta=-0.12,
            ),
        ],
        dashboard=build_dashboard(
            race_state=DashboardRaceState(
                race="Silverstone Strategy Lab",
                session="Race simulation",
                circuit="Silverstone",
                lap=27,
                totalLaps=52,
                weather="Cloud cover building",
                trackTemp="31 C",
                rainChance="18%",
                safetyCar="Clear",
                focusDriver="NOR",
                headline="Read the race before the race reads you.",
                subline="Medium wear is climbing and the clean-air pocket is about to close.",
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
            timeline=SILVERSTONE_TIMELINE,
            tyre_data=[
                TyrePoint(lap=12, medium=0.14, hard=0.04, projected=0.1),
                TyrePoint(lap=16, medium=0.21, hard=0.06, projected=0.15),
                TyrePoint(lap=20, medium=0.31, hard=0.09, projected=0.22),
                TyrePoint(lap=24, medium=0.42, hard=0.13, projected=0.31),
                TyrePoint(lap=27, medium=0.53, hard=0.16, projected=0.4),
                TyrePoint(lap=31, medium=0.71, hard=0.21, projected=0.58),
                TyrePoint(lap=36, medium=0.94, hard=0.3, projected=0.82),
            ],
            branches=[
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
            forecast_preview=[
                ForecastPreview(label="McLaren", value=34, color="#60a5fa"),
                ForecastPreview(label="Ferrari", value=28, color="#3b82f6"),
                ForecastPreview(label="Mercedes", value=21, color="#2563eb"),
                ForecastPreview(label="Red Bull", value=17, color="#93c5fd"),
            ],
        ),
    ),
    "monaco-track-position": StrategyScenario(
        id="monaco-track-position",
        label="Monaco cover call",
        summary="Street circuit, low degradation, track position still king.",
        race_state=RaceMetadata(
            race_id="monaco-track-position-sim",
            race_name="Monaco Position Lock",
            session="Race simulation",
            circuit="Circuit de Monaco",
            lap=42,
            total_laps=78,
            weather="Still air, no rain threat",
            track_temp_c=38.0,
            rain_chance=0.04,
            safety_car="clear",
            focus_driver="LEC",
        ),
        predict_drivers=[
            DriverRaceState(
                code="LEC",
                name="Charles Leclerc",
                team="Ferrari",
                position=2,
                gap_seconds=2.8,
                tyre="hard",
                tyre_age=8,
                pit_stops=1,
                pace_delta=0.12,
            ),
            DriverRaceState(
                code="PIA",
                name="Oscar Piastri",
                team="McLaren",
                position=3,
                gap_seconds=4.0,
                tyre="hard",
                tyre_age=18,
                pit_stops=1,
                pace_delta=0.21,
            ),
            DriverRaceState(
                code="VER",
                name="Max Verstappen",
                team="Red Bull",
                position=1,
                gap_seconds=0,
                tyre="hard",
                tyre_age=20,
                pit_stops=1,
                pace_delta=0.12,
            ),
        ],
        dashboard=build_dashboard(
            race_state=DashboardRaceState(
                race="Monaco Position Lock",
                session="Race simulation",
                circuit="Circuit de Monaco",
                lap=42,
                totalLaps=78,
                weather="Still air, no rain threat",
                trackTemp="38 C",
                rainChance="4%",
                safetyCar="Clear",
                focusDriver="LEC",
                headline="Track position is the fastest car here.",
                subline="The pit wall is weighing tyre pain against Monaco traffic.",
            ),
            drivers=[
                DashboardDriver(
                    code="LEC",
                    name="Charles Leclerc",
                    team="Ferrari",
                    teamColor="#ef1a2d",
                    position=2,
                    gap="+2.8s",
                    tyre="Hard",
                    tyreAge=8,
                    pitStops=1,
                    paceDelta="+0.12s",
                    risk="Low",
                    status="Tyres inside range",
                ),
                DashboardDriver(
                    code="PIA",
                    name="Oscar Piastri",
                    team="McLaren",
                    teamColor="#ff8c1a",
                    position=3,
                    gap="+4.0s",
                    tyre="Hard",
                    tyreAge=18,
                    pitStops=1,
                    paceDelta="+0.21s",
                    risk="Medium",
                    status="Stacked behind traffic",
                ),
                DashboardDriver(
                    code="VER",
                    name="Max Verstappen",
                    team="Red Bull",
                    teamColor="#3671c6",
                    position=1,
                    gap="Leader",
                    tyre="Hard",
                    tyreAge=20,
                    pitStops=1,
                    paceDelta="+0.12s",
                    risk="Low",
                    status="Controlling pace",
                ),
            ],
            timeline=MONACO_TIMELINE,
            tyre_data=[
                TyrePoint(lap=25, medium=0.05, hard=0.02, projected=0.05),
                TyrePoint(lap=30, medium=0.08, hard=0.04, projected=0.07),
                TyrePoint(lap=35, medium=0.12, hard=0.06, projected=0.1),
                TyrePoint(lap=42, medium=0.18, hard=0.09, projected=0.14),
                TyrePoint(lap=50, medium=0.27, hard=0.15, projected=0.23),
                TyrePoint(lap=58, medium=0.39, hard=0.23, projected=0.34),
            ],
            branches=[
                StrategyBranch(
                    label="Stay out",
                    tone="green",
                    summary="Hold P2 and force rivals to pass on track.",
                    rejoin="Maintains P2",
                    finish="Projected P2",
                    risk="Low overtake risk",
                    laps=["L42 Hold", "L48 Manage", "L61 Defend", "L78 P2"],
                ),
                StrategyBranch(
                    label="Pit for softs",
                    tone="yellow",
                    summary="Gain grip but rejoin behind slower traffic.",
                    rejoin="P7 behind train",
                    finish="Projected P5",
                    risk="High traffic risk",
                    laps=["L42 Box", "L43 P7", "L51 Stuck", "L78 P5"],
                ),
            ],
            forecast_preview=[
                ForecastPreview(label="Ferrari", value=39, color="#ef4444"),
                ForecastPreview(label="Red Bull", value=27, color="#3b82f6"),
                ForecastPreview(label="McLaren", value=22, color="#60a5fa"),
                ForecastPreview(label="Mercedes", value=12, color="#93c5fd"),
            ],
        ),
    ),
    "spa-rain-arrival": StrategyScenario(
        id="spa-rain-arrival",
        label="Spa rain watch",
        summary="Long lap, rain building, intermediates close but not ready.",
        race_state=RaceMetadata(
            race_id="spa-rain-arrival-sim",
            race_name="Spa Weather Knife Edge",
            session="Race simulation",
            circuit="Spa-Francorchamps",
            lap=18,
            total_laps=44,
            weather="Rain cell over sector two",
            track_temp_c=24.0,
            rain_chance=0.61,
            safety_car="vsc",
            focus_driver="RUS",
        ),
        predict_drivers=[
            DriverRaceState(
                code="RUS",
                name="George Russell",
                team="Mercedes",
                position=4,
                gap_seconds=7.6,
                tyre="medium",
                tyre_age=11,
                pit_stops=1,
                pace_delta=0.09,
            ),
            DriverRaceState(
                code="NOR",
                name="Lando Norris",
                team="McLaren",
                position=5,
                gap_seconds=9.2,
                tyre="medium",
                tyre_age=11,
                pit_stops=0,
                pace_delta=0.15,
            ),
            DriverRaceState(
                code="ALO",
                name="Fernando Alonso",
                team="Aston Martin",
                position=8,
                gap_seconds=18.9,
                tyre="hard",
                tyre_age=5,
                pit_stops=1,
                pace_delta=-0.05,
            ),
        ],
        dashboard=build_dashboard(
            race_state=DashboardRaceState(
                race="Spa Weather Knife Edge",
                session="Race simulation",
                circuit="Spa-Francorchamps",
                lap=18,
                totalLaps=44,
                weather="Rain cell over sector two",
                trackTemp="24 C",
                rainChance="61%",
                safetyCar="VSC",
                focusDriver="RUS",
                headline="Wait for the rain, but not too long.",
                subline="The next lap decides whether slicks survive or intermediates win the phase.",
            ),
            drivers=[
                DashboardDriver(
                    code="RUS",
                    name="George Russell",
                    team="Mercedes",
                    teamColor="#00d084",
                    position=4,
                    gap="+7.6s",
                    tyre="Medium",
                    tyreAge=11,
                    pitStops=1,
                    paceDelta="+0.09s",
                    risk="High",
                    status="Radar exposure rising",
                ),
                DashboardDriver(
                    code="NOR",
                    name="Lando Norris",
                    team="McLaren",
                    teamColor="#ff8c1a",
                    position=5,
                    gap="+9.2s",
                    tyre="Medium",
                    tyreAge=11,
                    pitStops=0,
                    paceDelta="+0.15s",
                    risk="High",
                    status="Shadowing strategy",
                ),
                DashboardDriver(
                    code="ALO",
                    name="Fernando Alonso",
                    team="Aston Martin",
                    teamColor="#006f62",
                    position=8,
                    gap="+18.9s",
                    tyre="Hard",
                    tyreAge=5,
                    pitStops=1,
                    paceDelta="-0.05s",
                    risk="Medium",
                    status="Ready for split call",
                ),
            ],
            timeline=SPA_TIMELINE,
            tyre_data=[
                TyrePoint(lap=9, medium=0.08, hard=0.03, projected=0.06),
                TyrePoint(lap=12, medium=0.13, hard=0.05, projected=0.1),
                TyrePoint(lap=15, medium=0.2, hard=0.08, projected=0.19),
                TyrePoint(lap=18, medium=0.29, hard=0.12, projected=0.35),
                TyrePoint(lap=20, medium=0.48, hard=0.22, projected=0.62),
                TyrePoint(lap=23, medium=0.81, hard=0.44, projected=0.94),
            ],
            branches=[
                StrategyBranch(
                    label="Monitor one lap",
                    tone="green",
                    summary="Keep slicks alive and pit only when the crossover confirms.",
                    rejoin="Holds P4",
                    finish="Projected P3",
                    risk="High weather risk",
                    laps=["L18 Hold", "L19 Radar", "L20 Box?", "L31 P3"],
                ),
                StrategyBranch(
                    label="Pit now",
                    tone="yellow",
                    summary="Take intermediates early and risk overheating them on dry asphalt.",
                    rejoin="P10 in traffic",
                    finish="Projected P6",
                    risk="High tyre risk",
                    laps=["L18 Box", "L19 Warm", "L21 Grip", "L31 P6"],
                ),
            ],
            forecast_preview=[
                ForecastPreview(label="Mercedes", value=31, color="#00d084"),
                ForecastPreview(label="McLaren", value=29, color="#60a5fa"),
                ForecastPreview(label="Red Bull", value=24, color="#3b82f6"),
                ForecastPreview(label="Aston Martin", value=16, color="#22c55e"),
            ],
        ),
    ),
}


def list_strategy_scenarios() -> list[StrategyScenarioSummary]:
    return [
        StrategyScenarioSummary(
            id=scenario.id,
            label=scenario.label,
            summary=scenario.summary,
            circuit=scenario.race_state.circuit,
            race=scenario.race_state.race_name,
        )
        for scenario in SCENARIOS.values()
    ]


def get_strategy_scenario(scenario_id: str | None = None) -> StrategyScenario:
    return SCENARIOS.get(scenario_id or DEFAULT_SCENARIO_ID, SCENARIOS[DEFAULT_SCENARIO_ID])


def get_strategy_scenario_by_race_id(race_id: str) -> StrategyScenario:
    for scenario in SCENARIOS.values():
        if race_id in {scenario.race_state.race_id, f"{scenario.id}-sim", scenario.id}:
            return scenario

    return SCENARIOS[DEFAULT_SCENARIO_ID]


def get_sample_predict_request(scenario_id: str | None = None) -> RaceStateRequest:
    scenario = get_strategy_scenario(scenario_id)
    race_state = scenario.race_state

    return RaceStateRequest(
        race_id=race_state.race_id,
        circuit=race_state.circuit,
        lap=race_state.lap,
        total_laps=race_state.total_laps,
        weather=race_state.weather,
        track_temp_c=race_state.track_temp_c,
        rain_chance=race_state.rain_chance,
        safety_car=race_state.safety_car,
        focus_driver=race_state.focus_driver,
        drivers=scenario.predict_drivers,
    )


def get_replay(request: ReplayRequest) -> ReplayResponse:
    scenario = get_strategy_scenario(request.scenario_id)

    if request.scenario_id is None:
        scenario = get_strategy_scenario_by_race_id(request.race_id)

    race_state = scenario.race_state
    to_lap = request.to_lap or race_state.total_laps
    events = [
        event
        for event in scenario.dashboard.timelineEvents
        if request.from_lap <= event.lap <= to_lap
    ]

    return ReplayResponse(
        race_state=race_state,
        events=events,
        replayState=ReplayState(
            raceId=race_state.race_id,
            race=race_state.race_name,
            session=race_state.session,
            circuit=race_state.circuit,
            currentLap=race_state.lap,
            totalLaps=race_state.total_laps,
            lapRange=ReplayLapRange(fromLap=request.from_lap, toLap=to_lap),
            weather=race_state.weather,
            safetyCar=race_state.safety_car,
            focusDriver=race_state.focus_driver,
        ),
        timelineEvents=events,
    )


def get_strategy_sample(scenario_id: str | None = None) -> StrategyDashboardResponse:
    return get_strategy_scenario(scenario_id).dashboard
