import { Radio, ShieldCheck, Sparkles } from "lucide-react"

import type { StrategyBranch } from "../data/mockRace"
import type { PredictionResponse } from "../lib/api"

type PitRecommendationPanelProps = {
  branches: StrategyBranch[]
  isFallback: boolean
  isLoading: boolean
  prediction: PredictionResponse | null
}

const recommendationLabels = {
  monitor: "Monitor the window",
  pit_now: "Box this lap",
  stay_out: "Stay out",
}

const recommendationCopy = {
  monitor: "RaceIQ is watching the decision window before committing to a stop.",
  pit_now: "RaceIQ sees enough tyre and pace pressure to make the stop this lap.",
  stay_out: "RaceIQ is protecting track position while the current tyre remains viable.",
}

const riskLabels = {
  high: "High",
  low: "Controlled",
  medium: "Measured",
}

function formatCompound(compound: PredictionResponse["suggested_compound"]) {
  if (!compound) {
    return "No change"
  }

  return `${compound.charAt(0).toUpperCase()}${compound.slice(1)} compound`
}

function formatDelta(delta: number) {
  const sign = delta >= 0 ? "+" : ""
  return `${sign}${delta.toFixed(1)}s race ${delta >= 0 ? "gain" : "loss"}`
}

export function PitRecommendationPanel({
  branches,
  isFallback,
  isLoading,
  prediction,
}: PitRecommendationPanelProps) {
  const title = prediction
    ? recommendationLabels[prediction.recommendation]
    : "Calculating pit call"
  const confidence = prediction ? `${Math.round(prediction.confidence * 100)}%` : "--"
  const copy = prediction
    ? prediction.reason || recommendationCopy[prediction.recommendation]
    : "Waiting for normalized race state, tyre model inputs, and strategy signals."

  return (
    <section className="panel recommendation-panel" aria-labelledby="recommendation-title">
      <div className="recommendation-alert">
        <div className="radio-wave" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <div>
          <p className="eyebrow">RaceIQ call</p>
          <h2 id="recommendation-title">{title}</h2>
        </div>
        <strong>{confidence}</strong>
      </div>

      <p className="recommendation-copy">{copy}</p>

      <div className="decision-grid">
        <div>
          <span>Expected delta</span>
          <strong>{prediction ? formatDelta(prediction.expected_time_delta) : "Pending"}</strong>
        </div>
        <div>
          <span>Suggested tyre</span>
          <strong>{prediction ? formatCompound(prediction.suggested_compound) : "Pending"}</strong>
        </div>
        <div>
          <span>Risk level</span>
          <strong>{prediction ? riskLabels[prediction.risk_level] : "Pending"}</strong>
        </div>
      </div>

      <div className="factor-list" aria-label="Prediction top factors">
        {prediction
          ? prediction.top_factors.map((factor) => <span key={factor}>{factor}</span>)
          : ["Race state", "Tyre model", "Timing feed"].map((factor) => (
              <span className="is-pending" key={factor}>
                {factor}
              </span>
            ))}
      </div>

      <div className={`prediction-status ${isFallback ? "is-fallback" : "is-live"}`}>
        <Radio aria-hidden="true" />
        <span>
          {isLoading
            ? "Prediction channel warming up."
            : isFallback
              ? "Using local deterministic prediction fallback."
              : "Backend prediction contract is live."}
        </span>
      </div>

      <div className="branch-list" aria-label="Strategy branches">
        {branches.map((branch) => (
          <article className={`branch-card branch-${branch.tone}`} key={branch.label}>
            <div className="branch-heading">
              <Sparkles aria-hidden="true" />
              <h3>{branch.label}</h3>
            </div>
            <p>{branch.summary}</p>
            <div className="branch-path">
              {branch.laps.map((lap) => (
                <span key={lap}>{lap}</span>
              ))}
            </div>
            <dl>
              <div>
                <dt>Rejoin</dt>
                <dd>{branch.rejoin}</dd>
              </div>
              <div>
                <dt>Finish</dt>
                <dd>{branch.finish}</dd>
              </div>
              <div>
                <dt>Risk</dt>
                <dd>{branch.risk}</dd>
              </div>
            </dl>
          </article>
        ))}
      </div>

      <div className="engineer-note">
        <Radio aria-hidden="true" />
        <span>Ask next: why this lap, what if we wait, or which tyre protects the finish?</span>
        <ShieldCheck aria-hidden="true" />
      </div>
    </section>
  )
}
