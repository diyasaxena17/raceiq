export type Compound = "Soft" | "Medium" | "Hard" | "Intermediate"

export type DriverStrategy = {
  code: string
  name: string
  team: string
  teamColor: string
  position: number
  gap: string
  tyre: Compound
  tyreAge: number
  pitStops: number
  paceDelta: string
  risk: "Low" | "Medium" | "High"
  status: string
}

export type TimelineEvent = {
  lap: number
  title: string
  detail: string
  type: "race" | "pit" | "weather" | "warning"
}

export type TyrePoint = {
  lap: number
  medium: number
  hard: number
  projected: number
}

export type StrategyBranch = {
  label: string
  tone: "green" | "yellow"
  summary: string
  rejoin: string
  finish: string
  risk: string
  laps: string[]
}

export type ForecastPreview = {
  label: string
  value: number
  color: string
}

export type RaceState = {
  race: string
  session: string
  circuit: string
  lap: number
  totalLaps: number
  weather: string
  trackTemp: string
  rainChance: string
  safetyCar: string
  focusDriver: string
  headline: string
  subline: string
}

export type StrategyDashboardData = {
  raceState: RaceState
  drivers: DriverStrategy[]
  timelineEvents: TimelineEvent[]
  tyreData: TyrePoint[]
  strategyBranches: StrategyBranch[]
  forecastPreview: ForecastPreview[]
}

export type ScenarioPrediction = {
  recommendation: "pit_now" | "stay_out" | "monitor"
  confidence: number
  reason: string
  risk_level: "low" | "medium" | "high"
  expected_time_delta: number
  suggested_compound: "soft" | "medium" | "hard" | "intermediate" | "wet" | null
  top_factors: string[]
}

export type RaceScenario = {
  id: string
  label: string
  summary: string
  data: StrategyDashboardData
  prediction: ScenarioPrediction
}

export const raceScenarios: RaceScenario[] = [
  {
    id: "silverstone-undercut",
    label: "Silverstone undercut",
    summary: "Dry track, medium tyres fading, undercut window opening.",
    prediction: {
      recommendation: "pit_now",
      confidence: 0.86,
      reason: "Tyre age and recent pace loss suggest the current stint is near the cliff.",
      risk_level: "medium",
      expected_time_delta: 4.8,
      suggested_compound: "hard",
      top_factors: ["high tyre age", "pace loss above threshold", "hard tyre recovery window"],
    },
    data: {
      raceState: {
        race: "Silverstone Strategy Lab",
        session: "Race simulation",
        circuit: "Silverstone",
        lap: 27,
        totalLaps: 52,
        weather: "Cloud cover building",
        trackTemp: "31 C",
        rainChance: "18%",
        safetyCar: "Clear",
        focusDriver: "NOR",
        headline: "Read the race before the race reads you.",
        subline: "Medium wear is climbing and the clean-air pocket is about to close.",
      },
      drivers: [
        {
          code: "NOR",
          name: "Lando Norris",
          team: "McLaren",
          teamColor: "#ff8c1a",
          position: 6,
          gap: "+12.4s",
          tyre: "Medium",
          tyreAge: 18,
          pitStops: 0,
          paceDelta: "+0.47s",
          risk: "High",
          status: "Tyres near cliff",
        },
        {
          code: "LEC",
          name: "Charles Leclerc",
          team: "Ferrari",
          teamColor: "#ef1a2d",
          position: 5,
          gap: "+9.1s",
          tyre: "Medium",
          tyreAge: 16,
          pitStops: 0,
          paceDelta: "+0.33s",
          risk: "Medium",
          status: "Covering undercut",
        },
        {
          code: "HAM",
          name: "Lewis Hamilton",
          team: "Mercedes",
          teamColor: "#00d084",
          position: 7,
          gap: "+15.8s",
          tyre: "Hard",
          tyreAge: 7,
          pitStops: 1,
          paceDelta: "-0.12s",
          risk: "Low",
          status: "Clean air push",
        },
      ],
      timelineEvents: [
        {
          lap: 12,
          title: "Opening tyre phase settled",
          detail: "Front runners stop attacking and begin protecting the left front.",
          type: "race",
        },
        {
          lap: 18,
          title: "Virtual safety car window",
          detail: "Pit loss drops by 5.2s, but the lead pack stays out.",
          type: "warning",
        },
        {
          lap: 24,
          title: "Ferrari starts the undercut threat",
          detail: "Leclerc gains three tenths over the last two laps.",
          type: "pit",
        },
        {
          lap: 27,
          title: "RaceIQ calls the decision lap",
          detail: "Norris can pit into clean air and attack on hard tyres.",
          type: "pit",
        },
        {
          lap: 31,
          title: "Light rain risk appears",
          detail: "Radar shows a weak shower crossing sector three.",
          type: "weather",
        },
      ],
      tyreData: [
        { lap: 12, medium: 0.14, hard: 0.04, projected: 0.1 },
        { lap: 16, medium: 0.21, hard: 0.06, projected: 0.15 },
        { lap: 20, medium: 0.31, hard: 0.09, projected: 0.22 },
        { lap: 24, medium: 0.42, hard: 0.13, projected: 0.31 },
        { lap: 27, medium: 0.53, hard: 0.16, projected: 0.4 },
        { lap: 31, medium: 0.71, hard: 0.21, projected: 0.58 },
        { lap: 36, medium: 0.94, hard: 0.3, projected: 0.82 },
      ],
      strategyBranches: [
        {
          label: "Pit this lap",
          tone: "green",
          summary: "Hard tyre, clean air, attack phase from lap 29.",
          rejoin: "P9 behind Alonso",
          finish: "Projected P5",
          risk: "Low traffic risk",
          laps: ["L27 Box", "L28 Out-lap", "L31 P7", "L44 P5"],
        },
        {
          label: "Stay out",
          tone: "yellow",
          summary: "Protect track position but risk the medium tyre cliff.",
          rejoin: "Holds P6",
          finish: "Projected P9",
          risk: "High degradation risk",
          laps: ["L27 Hold", "L30 Pace drop", "L34 Box", "L44 P9"],
        },
      ],
      forecastPreview: [
        { label: "McLaren", value: 34, color: "#60a5fa" },
        { label: "Ferrari", value: 28, color: "#3b82f6" },
        { label: "Mercedes", value: 21, color: "#2563eb" },
        { label: "Red Bull", value: 17, color: "#93c5fd" },
      ],
    },
  },
  {
    id: "monaco-track-position",
    label: "Monaco cover call",
    summary: "Street circuit, low degradation, track position still king.",
    prediction: {
      recommendation: "stay_out",
      confidence: 0.78,
      reason: "The hard tyre is still controlled and track position is worth more than the stop.",
      risk_level: "low",
      expected_time_delta: 1.6,
      suggested_compound: null,
      top_factors: ["low passing value", "traffic on pit exit", "manageable tyre slope"],
    },
    data: {
      raceState: {
        race: "Monaco Position Lock",
        session: "Race simulation",
        circuit: "Circuit de Monaco",
        lap: 42,
        totalLaps: 78,
        weather: "Still air, no rain threat",
        trackTemp: "38 C",
        rainChance: "4%",
        safetyCar: "Clear",
        focusDriver: "LEC",
        headline: "Track position is the fastest car here.",
        subline: "The pit wall is weighing tyre pain against Monaco traffic.",
      },
      drivers: [
        {
          code: "LEC",
          name: "Charles Leclerc",
          team: "Ferrari",
          teamColor: "#ef1a2d",
          position: 2,
          gap: "+2.8s",
          tyre: "Hard",
          tyreAge: 8,
          pitStops: 1,
          paceDelta: "+0.12s",
          risk: "Low",
          status: "Tyres inside range",
        },
        {
          code: "PIA",
          name: "Oscar Piastri",
          team: "McLaren",
          teamColor: "#ff8c1a",
          position: 3,
          gap: "+4.0s",
          tyre: "Hard",
          tyreAge: 18,
          pitStops: 1,
          paceDelta: "+0.21s",
          risk: "Medium",
          status: "Stacked behind traffic",
        },
        {
          code: "VER",
          name: "Max Verstappen",
          team: "Red Bull",
          teamColor: "#3671c6",
          position: 1,
          gap: "Leader",
          tyre: "Hard",
          tyreAge: 20,
          pitStops: 1,
          paceDelta: "+0.12s",
          risk: "Low",
          status: "Controlling pace",
        },
      ],
      timelineEvents: [
        {
          lap: 25,
          title: "Leaders complete first stops",
          detail: "The front three rejoin nose-to-tail on hard tyres.",
          type: "pit",
        },
        {
          lap: 35,
          title: "Traffic compresses the window",
          detail: "A second stop would rejoin behind a six-car DRS queue.",
          type: "warning",
        },
        {
          lap: 42,
          title: "RaceIQ protects the place",
          detail: "The model favors staying out until a safety-car discount appears.",
          type: "race",
        },
        {
          lap: 50,
          title: "Soft tyre offset fades",
          detail: "New softs are quick for two laps, then trapped behind traffic.",
          type: "weather",
        },
      ],
      tyreData: [
        { lap: 25, medium: 0.05, hard: 0.02, projected: 0.05 },
        { lap: 30, medium: 0.08, hard: 0.04, projected: 0.07 },
        { lap: 35, medium: 0.12, hard: 0.06, projected: 0.1 },
        { lap: 42, medium: 0.18, hard: 0.09, projected: 0.14 },
        { lap: 50, medium: 0.27, hard: 0.15, projected: 0.23 },
        { lap: 58, medium: 0.39, hard: 0.23, projected: 0.34 },
      ],
      strategyBranches: [
        {
          label: "Stay out",
          tone: "green",
          summary: "Hold P2 and force rivals to pass on track.",
          rejoin: "Maintains P2",
          finish: "Projected P2",
          risk: "Low overtake risk",
          laps: ["L42 Hold", "L48 Manage", "L61 Defend", "L78 P2"],
        },
        {
          label: "Pit for softs",
          tone: "yellow",
          summary: "Gain grip but rejoin behind slower traffic.",
          rejoin: "P7 behind train",
          finish: "Projected P5",
          risk: "High traffic risk",
          laps: ["L42 Box", "L43 P7", "L51 Stuck", "L78 P5"],
        },
      ],
      forecastPreview: [
        { label: "Ferrari", value: 39, color: "#ef4444" },
        { label: "Red Bull", value: 27, color: "#3b82f6" },
        { label: "McLaren", value: 22, color: "#60a5fa" },
        { label: "Mercedes", value: 12, color: "#93c5fd" },
      ],
    },
  },
  {
    id: "spa-rain-arrival",
    label: "Spa rain watch",
    summary: "Long lap, rain building, intermediates close but not ready.",
    prediction: {
      recommendation: "monitor",
      confidence: 0.69,
      reason: "Rain is close enough to change the race, but the dry tyre still has pace for one more lap.",
      risk_level: "high",
      expected_time_delta: 0.8,
      suggested_compound: "intermediate",
      top_factors: ["radar volatility", "dry tyre still viable", "long pit-loss exposure"],
    },
    data: {
      raceState: {
        race: "Spa Weather Knife Edge",
        session: "Race simulation",
        circuit: "Spa-Francorchamps",
        lap: 18,
        totalLaps: 44,
        weather: "Rain cell over sector two",
        trackTemp: "24 C",
        rainChance: "61%",
        safetyCar: "VSC",
        focusDriver: "RUS",
        headline: "Wait for the rain, but not too long.",
        subline: "The next lap decides whether slicks survive or intermediates win the phase.",
      },
      drivers: [
        {
          code: "RUS",
          name: "George Russell",
          team: "Mercedes",
          teamColor: "#00d084",
          position: 4,
          gap: "+7.6s",
          tyre: "Medium",
          tyreAge: 11,
          pitStops: 1,
          paceDelta: "+0.09s",
          risk: "High",
          status: "Radar exposure rising",
        },
        {
          code: "NOR",
          name: "Lando Norris",
          team: "McLaren",
          teamColor: "#ff8c1a",
          position: 5,
          gap: "+9.2s",
          tyre: "Medium",
          tyreAge: 11,
          pitStops: 0,
          paceDelta: "+0.15s",
          risk: "High",
          status: "Shadowing strategy",
        },
        {
          code: "ALO",
          name: "Fernando Alonso",
          team: "Aston Martin",
          teamColor: "#006f62",
          position: 8,
          gap: "+18.9s",
          tyre: "Hard",
          tyreAge: 5,
          pitStops: 1,
          paceDelta: "-0.05s",
          risk: "Medium",
          status: "Ready for split call",
        },
      ],
      timelineEvents: [
        {
          lap: 9,
          title: "Dry race pace stabilizes",
          detail: "Medium runners hold a small advantage through sector one.",
          type: "race",
        },
        {
          lap: 15,
          title: "Radar turns purple",
          detail: "A fast-moving shower crosses the Kemmel straight projection.",
          type: "weather",
        },
        {
          lap: 18,
          title: "RaceIQ holds the trigger",
          detail: "Intermediate pace is not ready yet, but the crossover is close.",
          type: "warning",
        },
        {
          lap: 20,
          title: "Crossover lap expected",
          detail: "If rain reaches sector two, the stop becomes live immediately.",
          type: "pit",
        },
      ],
      tyreData: [
        { lap: 9, medium: 0.08, hard: 0.03, projected: 0.06 },
        { lap: 12, medium: 0.13, hard: 0.05, projected: 0.1 },
        { lap: 15, medium: 0.2, hard: 0.08, projected: 0.19 },
        { lap: 18, medium: 0.29, hard: 0.12, projected: 0.35 },
        { lap: 20, medium: 0.48, hard: 0.22, projected: 0.62 },
        { lap: 23, medium: 0.81, hard: 0.44, projected: 0.94 },
      ],
      strategyBranches: [
        {
          label: "Monitor one lap",
          tone: "green",
          summary: "Keep slicks alive and pit only when the crossover confirms.",
          rejoin: "Holds P4",
          finish: "Projected P3",
          risk: "High weather risk",
          laps: ["L18 Hold", "L19 Radar", "L20 Box?", "L31 P3"],
        },
        {
          label: "Pit now",
          tone: "yellow",
          summary: "Take intermediates early and risk overheating them on dry asphalt.",
          rejoin: "P10 in traffic",
          finish: "Projected P6",
          risk: "High tyre risk",
          laps: ["L18 Box", "L19 Warm", "L21 Grip", "L31 P6"],
        },
      ],
      forecastPreview: [
        { label: "Mercedes", value: 31, color: "#00d084" },
        { label: "McLaren", value: 29, color: "#60a5fa" },
        { label: "Red Bull", value: 24, color: "#3b82f6" },
        { label: "Aston Martin", value: 16, color: "#22c55e" },
      ],
    },
  },
]

export const strategyDashboardFixture = raceScenarios[0].data
