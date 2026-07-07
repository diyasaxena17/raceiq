import { RadioTower, Trophy } from "lucide-react"

import type { ForecastPreview } from "../data/mockRace"
import type { WinLikelihoodResponse, WinLikelihoodResult } from "../lib/api"

type ForecastPanelProps = {
  forecast: WinLikelihoodResponse | null
  isFallback: boolean
  isLoading: boolean
  scenarioPreview: ForecastPreview[]
}

function formatProbability(value: number) {
  return `${Math.round(value * 100)}%`
}

function formatGeneratedAt(value: string) {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return value
  }

  return date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

function getStatusLabel(isLoading: boolean, source: WinLikelihoodResult["source"]) {
  if (isLoading) {
    return "Forecast channel warming up."
  }

  return source === "fallback"
    ? "Using local deterministic forecast fallback."
    : "Backend forecast contract is live."
}

export function ForecastPanel({
  forecast,
  isFallback,
  isLoading,
  scenarioPreview,
}: ForecastPanelProps) {
  const source: WinLikelihoodResult["source"] = isFallback ? "fallback" : "backend"
  const topTeams = forecast?.team_probabilities.slice(0, 3) ?? []
  const topDrivers = forecast?.driver_probabilities.slice(0, 3) ?? []
  const topFactors = forecast?.top_factors.slice(0, 3) ?? []

  return (
    <section className="panel forecast-panel" id="forecast" aria-labelledby="forecast-title">
      <div className="panel-header">
        <div>
          <p className="eyebrow">Forecast module</p>
          <h2 id="forecast-title">Next two race outlook</h2>
        </div>
        <Trophy aria-hidden="true" className="header-icon" />
      </div>

      <div className={`prediction-status ${isFallback ? "is-fallback" : "is-live"}`}>
        <RadioTower aria-hidden="true" />
        <span>{getStatusLabel(isLoading, source)}</span>
      </div>

      <div className="forecast-summary">
        <div>
          <span>Model confidence</span>
          <strong>{forecast ? formatProbability(forecast.model_confidence) : "--"}</strong>
        </div>
        <div>
          <span>Generated</span>
          <strong>{forecast ? formatGeneratedAt(forecast.generated_at) : "Pending"}</strong>
        </div>
      </div>

      <div className="forecast-section" aria-label="Team win likelihood">
        <div className="forecast-section-heading">
          <h3>Team win likelihood</h3>
          <span>{forecast?.forecast_horizon.replaceAll("_", " ") ?? "next 2 races"}</span>
        </div>
        <div className="forecast-bars">
          {(topTeams.length ? topTeams : [null, null, null]).map((team, index) => (
            <div className="forecast-row" key={team?.entity_id ?? `team-${index}`}>
              <div>
                <span>{team?.entity_name ?? "Loading"}</span>
                <strong>{team ? formatProbability(team.probability) : "--"}</strong>
              </div>
              <div className="bar-track">
                <span style={{ width: team ? `${Math.round(team.probability * 100)}%` : "18%" }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="forecast-section" aria-label="Scenario forecast preview">
        <div className="forecast-section-heading">
          <h3>Scenario preview</h3>
          <span>selected race</span>
        </div>
        <div className="forecast-bars">
          {scenarioPreview.map((team) => (
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
      </div>

      <div className="forecast-section" aria-label="Driver win likelihood">
        <div className="forecast-section-heading">
          <h3>Driver board</h3>
        </div>
        <div className="driver-probability-list">
          {topDrivers.map((driver) => (
            <div className="driver-probability" key={driver.entity_id}>
              <div>
                <strong>{driver.entity_id}</strong>
                <span>{driver.entity_name}</span>
              </div>
              <b>{formatProbability(driver.probability)}</b>
            </div>
          ))}
          {!topDrivers.length && <p>Waiting for driver forecast probabilities.</p>}
        </div>
      </div>

      <div className="forecast-section" aria-label="Forecast top factors">
        <div className="forecast-section-heading">
          <h3>Top factors</h3>
        </div>
        <div className="forecast-factor-list">
          {topFactors.map((factor) => (
            <article className={`forecast-factor factor-${factor.impact}`} key={factor.label}>
              <div>
                <strong>{factor.label}</strong>
                <span>{Math.round(factor.weight * 100)}% weight</span>
              </div>
              <p>{factor.detail}</p>
            </article>
          ))}
          {!topFactors.length && <p>Waiting for forecast factor analysis.</p>}
        </div>
      </div>

      <p className="forecast-freshness">
        {forecast?.data_freshness ?? "Forecast data freshness pending."}
      </p>
    </section>
  )
}
