import { Activity, CloudSun, RadioTower, Trophy } from "lucide-react"
import { useMemo, useState } from "react"

import { CircuitPulse } from "../components/CircuitPulse"
import { DriverStrategyCard } from "../components/DriverStrategyCard"
import { PitRecommendationPanel } from "../components/PitRecommendationPanel"
import { RaceTimeline } from "../components/RaceTimeline"
import { TyreDegradationChart } from "../components/TyreDegradationChart"
import {
  drivers,
  forecastPreview,
  raceState,
  strategyBranches,
  timelineEvents,
  tyreData,
} from "../data/mockRace"

export function StrategyPage() {
  const [activeLap, setActiveLap] = useState(raceState.lap)
  const focusDriver = useMemo(
    () => drivers.find((driver) => driver.code === raceState.focusDriver),
    [],
  )

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
          <PitRecommendationPanel branches={strategyBranches} />
          <RaceTimeline
            activeLap={activeLap}
            events={timelineEvents}
            onLapChange={setActiveLap}
            totalLaps={raceState.totalLaps}
          />
        </div>

        <div className="center-stack" id="track">
          <CircuitPulse activeLap={activeLap} totalLaps={raceState.totalLaps} />
          <TyreDegradationChart data={tyreData} />
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
              {drivers.map((driver) => (
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
              {forecastPreview.map((team) => (
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
