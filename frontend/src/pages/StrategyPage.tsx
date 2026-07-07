import { Activity, CloudSun, RadioTower, Trophy } from "lucide-react"
import { useEffect, useMemo, useState } from "react"

import { CircuitPulse } from "../components/CircuitPulse"
import { DriverStrategyCard } from "../components/DriverStrategyCard"
import { PitRecommendationPanel } from "../components/PitRecommendationPanel"
import { RaceTimeline } from "../components/RaceTimeline"
import { TyreDegradationChart } from "../components/TyreDegradationChart"
import {
  getPitPrediction,
  getStrategyDashboard,
  type PredictionResponse,
  type PitPredictionResult,
  type StrategyDashboardData,
} from "../lib/api"

export function StrategyPage() {
  const [dashboardData, setDashboardData] = useState<StrategyDashboardData | null>(null)
  const [prediction, setPrediction] = useState<PredictionResponse | null>(null)
  const [predictionSource, setPredictionSource] =
    useState<PitPredictionResult["source"]>("fallback")
  const [isPredictionLoading, setIsPredictionLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeLap, setActiveLap] = useState<number | null>(null)

  useEffect(() => {
    let isMounted = true

    async function loadDashboard() {
      try {
        const data = await getStrategyDashboard()

        if (!isMounted) {
          return
        }

        setDashboardData(data)
        setActiveLap(data.raceState.lap)
      } catch {
        if (isMounted) {
          setError("Strategy data is unavailable. Try refreshing the dashboard.")
        }
      }
    }

    async function loadPrediction() {
      setIsPredictionLoading(true)

      const pitPrediction = await getPitPrediction()

      if (!isMounted) {
        return
      }

      setPrediction(pitPrediction.prediction)
      setPredictionSource(pitPrediction.source)
      setIsPredictionLoading(false)
    }

    void loadDashboard()
    void loadPrediction()

    return () => {
      isMounted = false
    }
  }, [])

  const raceState = dashboardData?.raceState
  const focusDriver = useMemo(
    () =>
      raceState && dashboardData
        ? dashboardData.drivers.find((driver) => driver.code === raceState.focusDriver)
        : undefined,
    [dashboardData, raceState],
  )

  if (error) {
    return (
      <section className="strategy-state-panel" aria-labelledby="strategy-error-title">
        <p className="eyebrow live-eyebrow">
          <span /> Strategy room
        </p>
        <h1 id="strategy-error-title">RaceIQ lost the timing feed.</h1>
        <p>{error}</p>
      </section>
    )
  }

  if (!dashboardData || !raceState || activeLap === null) {
    return (
      <section className="strategy-state-panel" aria-labelledby="strategy-loading-title">
        <p className="eyebrow live-eyebrow">
          <span /> Strategy room
        </p>
        <h1 id="strategy-loading-title">Loading the pit wall.</h1>
        <p>Pulling race state, tyre model, timing tower, and strategy branches.</p>
      </section>
    )
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

      <section className="command-grid" aria-label="Race command dashboard">
        <div className="left-stack" id="strategy">
          <PitRecommendationPanel
            branches={dashboardData.strategyBranches}
            isFallback={predictionSource === "fallback"}
            isLoading={isPredictionLoading}
            prediction={prediction}
          />
          <RaceTimeline
            activeLap={activeLap}
            events={dashboardData.timelineEvents}
            onLapChange={setActiveLap}
            totalLaps={raceState.totalLaps}
          />
        </div>

        <div className="center-stack" id="track">
          <CircuitPulse activeLap={activeLap} totalLaps={raceState.totalLaps} />
          <TyreDegradationChart data={dashboardData.tyreData} />
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

          <section className="panel forecast-panel" id="forecast" aria-labelledby="forecast-title">
            <div className="panel-header">
              <div>
                <p className="eyebrow">Future module</p>
                <h2 id="forecast-title">Next two race outlook</h2>
              </div>
              <Trophy aria-hidden="true" className="header-icon" />
            </div>
            <p>
              A preview of the forecasting layer: team win likelihood will later combine track,
              weather, car form, driver form, and sentiment.
            </p>
            <div className="forecast-bars">
              {dashboardData.forecastPreview.map((team) => (
                <div className="forecast-row" key={team.label}>
                  <div>
                    <span>{team.label}</span>
                    <strong>{team.value}%</strong>
                  </div>
                  <div className="bar-track">
                    <span style={{ background: team.color, width: `${team.value}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </section>

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
                <strong>L31-L35</strong>
              </div>
            </div>
            <div className="signal-note">
              <RadioTower aria-hidden="true" />
              <span>{focusDriver?.code} is inside the final dry-tyre window.</span>
            </div>
          </section>
        </aside>
      </section>
    </>
  )
}
