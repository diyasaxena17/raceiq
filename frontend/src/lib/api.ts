import {
  raceScenarios,
  type RaceScenario,
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

export type StrategyScenarioSummary = {
  id: string
  label: string
  summary: string
  circuit: string
  race: string
}

export type StrategyScenariosResult = {
  scenarios: StrategyScenarioSummary[]
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
const DEFAULT_SCENARIO_ID = raceScenarios[0].id

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

function getScenario(scenarioId = DEFAULT_SCENARIO_ID): RaceScenario {
  return raceScenarios.find((scenario) => scenario.id === scenarioId) ?? raceScenarios[0]
}

function getFallbackScenarioSummaries(): StrategyScenarioSummary[] {
  return raceScenarios.map((scenario) => ({
    circuit: scenario.data.raceState.circuit,
    id: scenario.id,
    label: scenario.label,
    race: scenario.data.raceState.race,
    summary: scenario.summary,
  }))
}

function canUseBackendScenario() {
  return Boolean(API_BASE_URL)
}

function canUseBackendForecast(scenarioId = DEFAULT_SCENARIO_ID) {
  return Boolean(API_BASE_URL) && scenarioId === DEFAULT_SCENARIO_ID
}

function cloneFixture<T>(value: T): T {
  return structuredClone(value)
}

function delay(ms: number) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms)
  })
}

function parseSeconds(value: string) {
  if (value.toLowerCase() === "leader") {
    return 0
  }

  return Number.parseFloat(value.replace(/[+s]/g, ""))
}

function parsePercent(value: string) {
  return Number.parseFloat(value.replace("%", "")) / 100
}

function parseCelsius(value: string) {
  return Number.parseFloat(value.replace("C", "").trim())
}

function toSafetyCarState(value: string): SafetyCarState {
  const normalizedValue = value.toLowerCase()

  if (normalizedValue === "vsc") {
    return "vsc"
  }

  if (normalizedValue.includes("safety")) {
    return "safety_car"
  }

  return "clear"
}

function toTyreCompound(value: string): TyreCompound {
  return value.toLowerCase() as TyreCompound
}

function createScenarioRaceId(scenario: RaceScenario) {
  return `${scenario.id}-sim`
}

function createRaceStateRequest(scenario: RaceScenario): RaceStateRequest {
  const { raceState } = scenario.data

  return {
    race_id: createScenarioRaceId(scenario),
    circuit: raceState.circuit,
    drivers: scenario.data.drivers.map((driver) => ({
      code: driver.code,
      gap_seconds: parseSeconds(driver.gap),
      name: driver.name,
      pace_delta: parseSeconds(driver.paceDelta),
      pit_stops: driver.pitStops,
      position: driver.position,
      team: driver.team,
      tyre: toTyreCompound(driver.tyre),
      tyre_age: driver.tyreAge,
    })),
    focus_driver: raceState.focusDriver,
    lap: raceState.lap,
    rain_chance: parsePercent(raceState.rainChance),
    safety_car: toSafetyCarState(raceState.safetyCar),
    total_laps: raceState.totalLaps,
    track_temp_c: parseCelsius(raceState.trackTemp),
    weather: raceState.weather,
  }
}

function createReplayResponse(scenario: RaceScenario): ReplayResponse {
  const { raceState, timelineEvents } = scenario.data
  const raceMetadata: RaceMetadata = {
    circuit: raceState.circuit,
    focus_driver: raceState.focusDriver,
    lap: raceState.lap,
    race_id: createScenarioRaceId(scenario),
    race_name: raceState.race,
    rain_chance: parsePercent(raceState.rainChance),
    safety_car: toSafetyCarState(raceState.safetyCar),
    session: raceState.session,
    total_laps: raceState.totalLaps,
    track_temp_c: parseCelsius(raceState.trackTemp),
    weather: raceState.weather,
  }

  return {
    events: timelineEvents,
    race_state: raceMetadata,
    replayState: {
      circuit: raceState.circuit,
      currentLap: raceState.lap,
      focusDriver: raceState.focusDriver,
      lapRange: {
        fromLap: 1,
        toLap: raceState.totalLaps,
      },
      race: raceState.race,
      raceId: raceMetadata.race_id,
      safetyCar: raceMetadata.safety_car,
      session: raceState.session,
      totalLaps: raceState.totalLaps,
      weather: raceState.weather,
    },
    timelineEvents,
  }
}

function createScenarioForecast(scenario: RaceScenario): WinLikelihoodResponse {
  const { forecastPreview, raceState } = scenario.data

  if (scenario.id === DEFAULT_SCENARIO_ID) {
    return cloneFixture(fallbackWinLikelihood)
  }

  return {
    data_freshness: `deterministic ${raceState.circuit} scenario data; no live feeds, database, or trained model`,
    driver_probabilities: scenario.data.drivers.map((driver, index) => ({
      entity_id: driver.code,
      entity_name: driver.name,
      probability: Number((Math.max(0.12, 0.32 - index * 0.07)).toFixed(2)),
      race_id: null,
      rank: index + 1,
      team: driver.team,
      top_factors: [driver.status.toLowerCase(), `${raceState.circuit} scenario pace`],
    })),
    forecast_horizon: "next_2_races",
    generated_at: "2026-07-06T00:00:00Z",
    model_confidence: scenario.prediction.confidence,
    race_ids: [createScenarioRaceId(scenario), "next-race-sim"],
    races: [
      {
        circuit: raceState.circuit,
        race_id: createScenarioRaceId(scenario),
        race_name: raceState.race,
        round: 1,
      },
      {
        circuit: "Next race simulation",
        race_id: "next-race-sim",
        race_name: "Next Race Simulation",
        round: 2,
      },
    ],
    team_probabilities: forecastPreview.map((team, index) => ({
      entity_id: team.label.toLowerCase().replaceAll(" ", "-"),
      entity_name: team.label,
      probability: Number((team.value / 100).toFixed(2)),
      race_id: null,
      rank: index + 1,
      team: null,
      top_factors: [`${raceState.circuit} fit`, "scenario forecast preview"],
    })),
    top_factors: scenario.prediction.top_factors.map((factor, index) => ({
      detail: `${factor} is a leading deterministic signal in the ${scenario.label} scenario.`,
      impact: index === 0 ? "positive" : "neutral",
      label: factor,
      weight: Number(Math.max(0.12, 0.32 - index * 0.07).toFixed(2)),
    })),
  }
}

async function getStrategyDashboardFromBackend(
  scenarioId = DEFAULT_SCENARIO_ID,
): Promise<StrategyDashboardData> {
  const path =
    scenarioId === DEFAULT_SCENARIO_ID ? "/strategy/sample" : `/strategy/sample/${scenarioId}`
  const response = await fetch(`${API_BASE_URL}${path}`)

  if (!response.ok) {
    throw new Error(`Strategy sample request failed with ${response.status}`)
  }

  return (await response.json()) as StrategyDashboardData
}

async function getStrategyScenariosFromBackend(): Promise<StrategyScenarioSummary[]> {
  const response = await fetch(`${API_BASE_URL}/strategy/scenarios`)

  if (!response.ok) {
    throw new Error(`Strategy scenarios request failed with ${response.status}`)
  }

  return (await response.json()) as StrategyScenarioSummary[]
}

export async function getStrategyScenarios(): Promise<StrategyScenariosResult> {
  if (canUseBackendScenario()) {
    try {
      return {
        scenarios: await getStrategyScenariosFromBackend(),
        source: "backend",
      }
    } catch (error) {
      console.warn("Falling back to local strategy scenario catalog.", error)
    }
  }

  await delay(MOCK_LATENCY_MS)
  return {
    scenarios: cloneFixture(getFallbackScenarioSummaries()),
    source: "fallback",
  }
}

async function getPredictSampleRequestFromBackend(
  scenarioId = DEFAULT_SCENARIO_ID,
): Promise<RaceStateRequest> {
  const path =
    scenarioId === DEFAULT_SCENARIO_ID
      ? "/predict/sample-request"
      : `/predict/sample-request/${scenarioId}`
  const response = await fetch(`${API_BASE_URL}${path}`)

  if (!response.ok) {
    throw new Error(`Predict sample request failed with ${response.status}`)
  }

  return (await response.json()) as RaceStateRequest
}

export async function getPredictSampleRequest(
  scenarioId = DEFAULT_SCENARIO_ID,
): Promise<RaceStateRequest | null> {
  if (!canUseBackendScenario()) {
    return cloneFixture(createRaceStateRequest(getScenario(scenarioId)))
  }

  try {
    return await getPredictSampleRequestFromBackend(scenarioId)
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
  scenarioId = DEFAULT_SCENARIO_ID,
): Promise<PredictionResponse> {
  if (!canUseBackendScenario()) {
    return cloneFixture(getScenario(scenarioId).prediction)
  }

  try {
    return await postPitPredictionToBackend(raceState)
  } catch (error) {
    console.warn("Falling back to local pit prediction fixture.", error)
    return cloneFixture(getScenario(scenarioId).prediction)
  }
}

export async function getPitPrediction(
  scenarioId = DEFAULT_SCENARIO_ID,
): Promise<PitPredictionResult> {
  if (canUseBackendScenario()) {
    try {
      const sampleRequest = await getPredictSampleRequestFromBackend(scenarioId)
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
    prediction: cloneFixture(getScenario(scenarioId).prediction),
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
  scenarioId = DEFAULT_SCENARIO_ID,
): Promise<ReplayResult> {
  if (canUseBackendScenario()) {
    try {
      const response = await fetch(`${API_BASE_URL}/replay`, {
        body: JSON.stringify({
          ...request,
          race_id: createScenarioRaceId(getScenario(scenarioId)),
          scenario_id: scenarioId,
        }),
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
    replay: cloneFixture(createReplayResponse(getScenario(scenarioId))),
    source: "fallback",
  }
}

export async function getWinLikelihoodForecast(
  request: WinLikelihoodRequest = {
    forecast_horizon: "next_2_races",
    include_sentiment: true,
    race_ids: ["monaco-2026", "canada-2026"],
  },
  scenarioId = DEFAULT_SCENARIO_ID,
): Promise<WinLikelihoodResult> {
  if (canUseBackendForecast(scenarioId)) {
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
    forecast: cloneFixture(createScenarioForecast(getScenario(scenarioId))),
    source: "fallback",
  }
}

export async function getStrategyDashboard(
  scenarioId = DEFAULT_SCENARIO_ID,
): Promise<StrategyDashboardData> {
  if (canUseBackendScenario()) {
    try {
      return await getStrategyDashboardFromBackend(scenarioId)
    } catch (error) {
      console.warn("Falling back to local strategy dashboard fixture.", error)
    }
  }

  await delay(MOCK_LATENCY_MS)
  return cloneFixture(getScenario(scenarioId).data)
}
