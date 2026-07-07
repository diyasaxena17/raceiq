import {
  strategyDashboardFixture,
  type TimelineEvent,
  type StrategyDashboardData,
} from "../data/mockRace"

export type { StrategyDashboardData, TimelineEvent } from "../data/mockRace"

export type TyreCompound = "soft" | "medium" | "hard" | "intermediate" | "wet"
export type SafetyCarState = "clear" | "vsc" | "safety_car"

export type DriverRaceState = {
  code: string
  name: string
  team: string
  position: number
  gap_seconds: number
  tyre: TyreCompound
  tyre_age: number
  pit_stops: number
  pace_delta: number
}

export type RaceStateRequest = {
  race_id: string
  circuit: string
  lap: number
  total_laps: number
  weather: string
  track_temp_c: number
  rain_chance: number
  safety_car: SafetyCarState
  focus_driver: string
  drivers: DriverRaceState[]
}

export type PredictionResponse = {
  recommendation: "pit_now" | "stay_out" | "monitor"
  confidence: number
  reason: string
  risk_level: "low" | "medium" | "high"
  expected_time_delta: number
  suggested_compound: TyreCompound | null
  top_factors: string[]
}

export type PitPredictionResult = {
  prediction: PredictionResponse
  source: "backend" | "fallback"
}

export type RaceMetadata = {
  race_id: string
  race_name: string
  session: string
  circuit: string
  lap: number
  total_laps: number
  weather: string
  track_temp_c: number
  rain_chance: number
  safety_car: SafetyCarState
  focus_driver: string
}

export type ReplayRequest = {
  race_id: string
  focus_driver: string
  from_lap: number
  to_lap: number | null
}

export type ReplayLapRange = {
  fromLap: number
  toLap: number
}

export type ReplayState = {
  raceId: string
  race: string
  session: string
  circuit: string
  currentLap: number
  totalLaps: number
  lapRange: ReplayLapRange
  weather: string
  safetyCar: SafetyCarState
  focusDriver: string
}

export type ReplayResponse = {
  race_state: RaceMetadata
  events: TimelineEvent[]
  replayState: ReplayState
  timelineEvents: TimelineEvent[]
}

export type ReplayResult = {
  replay: ReplayResponse
  source: "backend" | "fallback"
}

export type ForecastHorizon = "next_2_races"

export type WinLikelihoodRequest = {
  forecast_horizon: ForecastHorizon
  race_ids: string[]
  include_sentiment: boolean
}

export type ForecastRace = {
  race_id: string
  race_name: string
  circuit: string
  round: number
}

export type EntityProbability = {
  entity_id: string
  entity_name: string
  probability: number
  rank: number
  race_id: string | null
  team: string | null
  top_factors: string[]
}

export type ForecastFactor = {
  label: string
  impact: "positive" | "negative" | "neutral"
  weight: number
  detail: string
}

export type WinLikelihoodResponse = {
  forecast_horizon: ForecastHorizon
  race_ids: string[]
  races: ForecastRace[]
  driver_probabilities: EntityProbability[]
  team_probabilities: EntityProbability[]
  top_factors: ForecastFactor[]
  model_confidence: number
  generated_at: string
  data_freshness: string
}

export type WinLikelihoodResult = {
  forecast: WinLikelihoodResponse
  source: "backend" | "fallback"
}

const MOCK_LATENCY_MS = 180
const API_BASE_URL = import.meta.env.VITE_RACEIQ_API_BASE_URL?.replace(/\/$/, "")

const fallbackPrediction: PredictionResponse = {
  recommendation: "pit_now",
  confidence: 0.86,
  reason: "Tyre age and recent pace loss suggest the current stint is near the cliff.",
  risk_level: "medium",
  expected_time_delta: 4.8,
  suggested_compound: "hard",
  top_factors: ["high tyre age", "pace loss above threshold", "hard tyre recovery window"],
}

const fallbackReplay: ReplayResponse = {
  race_state: {
    race_id: "silverstone-2026-sim",
    race_name: "Silverstone Strategy Lab",
    session: "Race simulation",
    circuit: "Silverstone",
    lap: 27,
    total_laps: 52,
    weather: "Cloud cover building",
    track_temp_c: 31,
    rain_chance: 0.18,
    safety_car: "clear",
    focus_driver: "NOR",
  },
  events: [
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
  replayState: {
    raceId: "silverstone-2026-sim",
    race: "Silverstone Strategy Lab",
    session: "Race simulation",
    circuit: "Silverstone",
    currentLap: 27,
    totalLaps: 52,
    lapRange: {
      fromLap: 1,
      toLap: 52,
    },
    weather: "Cloud cover building",
    safetyCar: "clear",
    focusDriver: "NOR",
  },
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
}

const fallbackWinLikelihood: WinLikelihoodResponse = {
  forecast_horizon: "next_2_races",
  race_ids: ["monaco-2026", "canada-2026"],
  races: [
    {
      race_id: "monaco-2026",
      race_name: "Monaco Grand Prix",
      circuit: "Circuit de Monaco",
      round: 8,
    },
    {
      race_id: "canada-2026",
      race_name: "Canadian Grand Prix",
      circuit: "Circuit Gilles Villeneuve",
      round: 9,
    },
  ],
  driver_probabilities: [
    {
      entity_id: "NOR",
      entity_name: "Lando Norris",
      probability: 0.29,
      rank: 1,
      race_id: null,
      team: "McLaren",
      top_factors: ["recent race pace", "street-circuit qualifying value"],
    },
    {
      entity_id: "LEC",
      entity_name: "Charles Leclerc",
      probability: 0.25,
      rank: 2,
      race_id: null,
      team: "Ferrari",
      top_factors: ["track history", "qualifying strength"],
    },
    {
      entity_id: "HAM",
      entity_name: "Lewis Hamilton",
      probability: 0.18,
      rank: 3,
      race_id: null,
      team: "Mercedes",
      top_factors: ["race management", "weather uncertainty"],
    },
  ],
  team_probabilities: [
    {
      entity_id: "mclaren",
      entity_name: "McLaren",
      probability: 0.34,
      rank: 1,
      race_id: null,
      team: null,
      top_factors: ["race pace", "tyre degradation control"],
    },
    {
      entity_id: "ferrari",
      entity_name: "Ferrari",
      probability: 0.28,
      rank: 2,
      race_id: null,
      team: null,
      top_factors: ["qualifying strength", "street-circuit fit"],
    },
    {
      entity_id: "mercedes",
      entity_name: "Mercedes",
      probability: 0.21,
      rank: 3,
      race_id: null,
      team: null,
      top_factors: ["reliability", "wet-weather adaptability"],
    },
  ],
  top_factors: [
    {
      label: "Street-circuit qualifying value",
      impact: "positive",
      weight: 0.31,
      detail: "Monaco-style track position makes qualifying form unusually important.",
    },
    {
      label: "Recent race pace",
      impact: "positive",
      weight: 0.27,
      detail: "McLaren and Ferrari carry the strongest mock race-pace trend.",
    },
    {
      label: "Weather uncertainty",
      impact: "neutral",
      weight: 0.18,
      detail: "Canada adds a moderate rain and safety-car uncertainty band.",
    },
    {
      label: "Sentiment signal",
      impact: "positive",
      weight: 0.12,
      detail: "Mock media and team confidence signal is included.",
    },
  ],
  model_confidence: 0.62,
  generated_at: "2026-07-06T00:00:00Z",
  data_freshness: "deterministic sample data; no live feeds, database, or trained model",
}

function cloneFixture<T>(value: T): T {
  return structuredClone(value)
}

function delay(ms: number) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms)
  })
}

async function getStrategyDashboardFromBackend(): Promise<StrategyDashboardData> {
  const response = await fetch(`${API_BASE_URL}/strategy/sample`)

  if (!response.ok) {
    throw new Error(`Strategy sample request failed with ${response.status}`)
  }

  return (await response.json()) as StrategyDashboardData
}

async function getPredictSampleRequestFromBackend(): Promise<RaceStateRequest> {
  const response = await fetch(`${API_BASE_URL}/predict/sample-request`)

  if (!response.ok) {
    throw new Error(`Predict sample request failed with ${response.status}`)
  }

  return (await response.json()) as RaceStateRequest
}

export async function getPredictSampleRequest(): Promise<RaceStateRequest | null> {
  if (!API_BASE_URL) {
    return null
  }

  try {
    return await getPredictSampleRequestFromBackend()
  } catch (error) {
    console.warn("Predict sample request is unavailable.", error)
    return null
  }
}

async function postPitPredictionToBackend(
  raceState: RaceStateRequest,
): Promise<PredictionResponse> {
  const response = await fetch(`${API_BASE_URL}/predict`, {
    body: JSON.stringify(raceState),
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
  })

  if (!response.ok) {
    throw new Error(`Pit prediction request failed with ${response.status}`)
  }

  return (await response.json()) as PredictionResponse
}

export async function postPitPrediction(
  raceState: RaceStateRequest,
): Promise<PredictionResponse> {
  if (!API_BASE_URL) {
    return cloneFixture(fallbackPrediction)
  }

  try {
    return await postPitPredictionToBackend(raceState)
  } catch (error) {
    console.warn("Falling back to local pit prediction fixture.", error)
    return cloneFixture(fallbackPrediction)
  }
}

export async function getPitPrediction(): Promise<PitPredictionResult> {
  if (API_BASE_URL) {
    try {
      const sampleRequest = await getPredictSampleRequestFromBackend()
      return {
        prediction: await postPitPredictionToBackend(sampleRequest),
        source: "backend",
      }
    } catch (error) {
      console.warn("Falling back to local pit prediction fixture.", error)
    }
  }

  await delay(MOCK_LATENCY_MS)
  return {
    prediction: cloneFixture(fallbackPrediction),
    source: "fallback",
  }
}

export async function getRaceReplay(
  request: ReplayRequest = {
    focus_driver: "NOR",
    from_lap: 1,
    race_id: "silverstone-2026-sim",
    to_lap: null,
  },
): Promise<ReplayResult> {
  if (API_BASE_URL) {
    try {
      const response = await fetch(`${API_BASE_URL}/replay`, {
        body: JSON.stringify(request),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      })

      if (!response.ok) {
        throw new Error(`Replay request failed with ${response.status}`)
      }

      return {
        replay: (await response.json()) as ReplayResponse,
        source: "backend",
      }
    } catch (error) {
      console.warn("Falling back to local replay fixture.", error)
    }
  }

  await delay(MOCK_LATENCY_MS)
  return {
    replay: cloneFixture(fallbackReplay),
    source: "fallback",
  }
}

export async function getWinLikelihoodForecast(
  request: WinLikelihoodRequest = {
    forecast_horizon: "next_2_races",
    include_sentiment: true,
    race_ids: ["monaco-2026", "canada-2026"],
  },
): Promise<WinLikelihoodResult> {
  if (API_BASE_URL) {
    try {
      const response = await fetch(`${API_BASE_URL}/forecast/win-likelihood`, {
        body: JSON.stringify(request),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      })

      if (!response.ok) {
        throw new Error(`Win likelihood request failed with ${response.status}`)
      }

      return {
        forecast: (await response.json()) as WinLikelihoodResponse,
        source: "backend",
      }
    } catch (error) {
      console.warn("Falling back to local win-likelihood fixture.", error)
    }
  }

  await delay(MOCK_LATENCY_MS)
  return {
    forecast: cloneFixture(fallbackWinLikelihood),
    source: "fallback",
  }
}

export async function getStrategyDashboard(): Promise<StrategyDashboardData> {
  if (API_BASE_URL) {
    try {
      return await getStrategyDashboardFromBackend()
    } catch (error) {
      console.warn("Falling back to local strategy dashboard fixture.", error)
    }
  }

  await delay(MOCK_LATENCY_MS)
  return cloneFixture(strategyDashboardFixture)
}
