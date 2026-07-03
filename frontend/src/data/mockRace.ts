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

export const raceState = {
  race: "Silverstone Strategy Lab",
  session: "Race simulation",
  lap: 27,
  totalLaps: 52,
  weather: "Cloud cover building",
  trackTemp: "31 C",
  rainChance: "18%",
  safetyCar: "Clear",
  focusDriver: "NOR",
  headline: "Read the race before the race reads you.",
  subline: "A mock pit wall built from race state, tyre life, and strategy branches.",
}

export const drivers: DriverStrategy[] = [
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
]

export const timelineEvents: TimelineEvent[] = [
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
]

export const tyreData: TyrePoint[] = [
  { lap: 12, medium: 0.14, hard: 0.04, projected: 0.1 },
  { lap: 16, medium: 0.21, hard: 0.06, projected: 0.15 },
  { lap: 20, medium: 0.31, hard: 0.09, projected: 0.22 },
  { lap: 24, medium: 0.42, hard: 0.13, projected: 0.31 },
  { lap: 27, medium: 0.53, hard: 0.16, projected: 0.4 },
  { lap: 31, medium: 0.71, hard: 0.21, projected: 0.58 },
  { lap: 36, medium: 0.94, hard: 0.3, projected: 0.82 },
]

export const strategyBranches: StrategyBranch[] = [
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
]

export const forecastPreview = [
  { label: "McLaren", value: 34, color: "#60a5fa" },
  { label: "Ferrari", value: 28, color: "#3b82f6" },
  { label: "Mercedes", value: 21, color: "#2563eb" },
  { label: "Red Bull", value: 17, color: "#93c5fd" },
]
