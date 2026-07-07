import { Activity, CloudSun, RadioTower } from "lucide-react"
import { useEffect, useMemo, useState } from "react"

import { CircuitPulse } from "../components/CircuitPulse"
import { DriverStrategyCard } from "../components/DriverStrategyCard"
import { ForecastPanel } from "../components/ForecastPanel"
import { PitRecommendationPanel } from "../components/PitRecommendationPanel"
import { RaceTimeline } from "../components/RaceTimeline"
import { TyreDegradationChart } from "../components/TyreDegradationChart"
import { raceScenarios } from "../data/mockRace"
import {
  getPitPrediction,
  getRaceReplay,
  getStrategyDashboard,
  getWinLikelihoodForecast,
  type PitPredictionResult,
  type PredictionResponse,
  type ReplayResponse,
  type ReplayResult,
  type StrategyDashboardData,
  type WinLikelihoodResponse,
  type WinLikelihoodResult,
} from "../lib/api"

export function StrategyPage() {
  const [selectedScenarioId, setSelectedScenarioId] = useState(raceScenarios[0].id)
  const [backendDashboardData, setBackendDashboardData] =
    useState<StrategyDashboardData | null>(null)
  const [backendPrediction, setBackendPrediction] = useState<PredictionResponse | null>(null)
  const [predictionSource, setPredictionSource] =
    useState<PitPredictionResult["source"]>("fallback")
  const [isPredictionLoading, setIsPredictionLoading] = useState(true)
  const [replay, setReplay] = useState<ReplayResponse | null>(null)
  const [replaySource, setReplaySource] = useState<ReplayResult["source"]>("fallback")
  const [isReplayLoading, setIsReplayLoading] = useState(true)
  const [forecast, setForecast] = useState<WinLikelihoodResponse | null>(null)
  const [forecastSource, setForecastSource] =
    useState<WinLikelihoodResult["source"]>("fallback")
  const [isForecastLoading, setIsForecastLoading] = useState(true)
  const [activeLap, setActiveLap] = useState(raceScenarios[0].data.raceState.lap)

  const selectedScenario = useMemo(
    () =>
      raceScenarios.find((scenario) => scenario.id === selectedScenarioId) ?? raceScenarios[0],
    [selectedScenarioId],
  )
  const usesBackendScenario = selectedScenario.id === raceScenarios[0].id
  const dashboardData =
    usesBackendScenario && backendDashboardData ? backendDashboardData : selectedScenario.data
  const raceState = dashboardData.raceState
  const prediction =
    usesBackendScenario && backendPrediction ? backendPrediction : selectedScenario.prediction
  const timelineEvents =
    usesBackendScenario && replay ? replay.timelineEvents : dashboardData.timelineEvents
  const timelineTotalLaps =
    usesBackendScenario && replay ? replay.replayState.totalLaps : raceState.totalLaps

  useEffect(() => {
    let isMounted = true

    async function loadBackendScenarioData() {
      setIsPredictionLoading(true)
      setIsReplayLoading(true)

      const [strategyDashboard, pitPrediction, raceReplay] = await Promise.all([
        getStrategyDashboard(),
        getPitPrediction(),
        getRaceReplay(),
      ])

      if (!isMounted) {
        return
      }

      setBackendDashboardData(strategyDashboard)
      setBackendPrediction(pitPrediction.prediction)
      setPredictionSource(pitPrediction.source)
      setReplay(raceReplay.replay)
      setReplaySource(raceReplay.source)
      setIsPredictionLoading(false)
      setIsReplayLoading(false)
    }

    async function loadForecast() {
      setIsForecastLoading(true)

      const winLikelihood = await getWinLikelihoodForecast()

      if (!isMounted) {
        return
      }

      setForecast(winLikelihood.forecast)
      setForecastSource(winLikelihood.source)
      setIsForecastLoading(false)
    }

    void loadBackendScenarioData()
    void loadForecast()

    return () => {
      isMounted = false
    }
  }, [])

  const focusDriver = useMemo(
    () =>
      dashboardData.drivers.find((driver) => driver.code === raceState.focusDriver),
    [dashboardData, raceState],
  )

  function selectScenario(scenarioId: string) {
    const nextScenario = raceScenarios.find((scenario) => scenario.id === scenarioId)

    if (!nextScenario) {
      return
    }

    setSelectedScenarioId(scenarioId)
    setActiveLap(nextScenario.data.raceState.lap)
  }

  return (
    <>
      <section className="hero-band" aria-labelledby="page-title">
        <div className="hero-copy" id="overview">
          <p className="eyebrow live-eyebrow">
            <span /> RaceIQ strategy room
          </p>
          <h1 id="page-title">{raceState.headline}</h1>
          <p>{raceState.subline}</p>
        </div>

        <div className="session-strip" aria-label="Session summary">
          <div>
            <span>Circuit</span>
            <strong>{raceState.circuit}</strong>
          </div>
          <div>
            <span>Session</span>
            <strong>{raceState.session}</strong>
          </div>
          <div>
            <span>Weather</span>
            <strong>{raceState.weather}</strong>
          </div>
          <div>
            <span>Track temp</span>
            <strong>{raceState.trackTemp}</strong>
          </div>
          <div>
            <span>Safety car</span>
            <strong>{raceState.safetyCar}</strong>
          </div>
        </div>
      </section>

      <section className="scenario-panel" aria-label="Race scenarios">
        {raceScenarios.map((scenario) => {
          const isSelected = scenario.id === selectedScenarioId

          return (
            <button
              aria-pressed={isSelected}
              className={`scenario-button ${isSelected ? "is-selected" : ""}`}
              key={scenario.id}
              onClick={() => selectScenario(scenario.id)}
              type="button"
            >
              <span>{scenario.label}</span>
              <strong>{scenario.data.raceState.circuit}</strong>
              <small>{scenario.summary}</small>
            </button>
          )
        })}
      </section>

      <section className="command-grid" aria-label="Race command dashboard">
        <div className="left-stack" id="strategy">
          <PitRecommendationPanel
            branches={dashboardData.strategyBranches}
            isFallback={!usesBackendScenario || predictionSource === "fallback"}
            isLoading={usesBackendScenario && isPredictionLoading}
            prediction={prediction}
          />
          <RaceTimeline
            activeLap={activeLap}
            events={timelineEvents}
            isFallback={!usesBackendScenario || replaySource === "fallback"}
            isLoading={usesBackendScenario && isReplayLoading}
            onLapChange={setActiveLap}
            totalLaps={timelineTotalLaps}
          />
        </div>

        <div className="center-stack" id="track">
          <CircuitPulse
            activeLap={activeLap}
            circuitName={raceState.circuit}
            totalLaps={raceState.totalLaps}
          />
          <TyreDegradationChart compound={focusDriver?.tyre ?? "Medium"} data={dashboardData.tyreData} />
        </div>

        <aside className="right-stack" aria-label="Driver and forecast panels">
          <section className="panel driver-panel" id="drivers" aria-labelledby="driver-panel-title">
            <div className="panel-header">
              <div>
                <p className="eyebrow">Timing tower</p>
                <h2 id="driver-panel-title">Focus group</h2>
              </div>
              <Activity aria-hidden="true" className="header-icon" />
            </div>
            <div className="driver-list">
              {dashboardData.drivers.map((driver) => (
                <DriverStrategyCard
                  driver={driver}
                  isFocus={driver.code === raceState.focusDriver}
                  key={driver.code}
                />
              ))}
            </div>
          </section>

          <ForecastPanel
            forecast={forecast}
            isFallback={forecastSource === "fallback"}
            isLoading={isForecastLoading}
            scenarioPreview={dashboardData.forecastPreview}
          />

          <section className="panel weather-panel" aria-labelledby="weather-title">
            <div className="panel-header">
              <div>
                <p className="eyebrow">Radar desk</p>
                <h2 id="weather-title">Weather pressure</h2>
              </div>
              <CloudSun aria-hidden="true" className="header-icon" />
            </div>
            <div className="weather-grid">
              <div>
                <span>Rain chance</span>
                <strong>{raceState.rainChance}</strong>
              </div>
              <div>
                <span>Window</span>
                <strong>
                  L{Math.min(raceState.lap + 2, raceState.totalLaps)}-L
                  {Math.min(raceState.lap + 6, raceState.totalLaps)}
                </strong>
              </div>
            </div>
            <div className="signal-note">
              <RadioTower aria-hidden="true" />
              <span>{focusDriver?.code} is inside the live scenario decision window.</span>
            </div>
          </section>
        </aside>
      </section>
    </>
  )
}
