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
