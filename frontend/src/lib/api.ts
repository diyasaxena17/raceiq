import {
  strategyDashboardFixture,
  type StrategyDashboardData,
} from "../data/mockRace"

export type { StrategyDashboardData } from "../data/mockRace"

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
