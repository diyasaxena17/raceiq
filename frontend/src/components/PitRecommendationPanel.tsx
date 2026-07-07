import { Radio, ShieldCheck, Sparkles } from "lucide-react"

import type { StrategyBranch } from "../data/mockRace"
import type { PredictionResponse } from "../lib/api"

type PitRecommendationPanelProps = {
  branches: StrategyBranch[]
  prediction: PredictionResponse
}

const recommendationLabels = {
  monitor: "Monitor the window",
  pit_now: "Bring Norris in now",
  stay_out: "Keep Norris out",
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

export function PitRecommendationPanel({ branches, prediction }: PitRecommendationPanelProps) {
  const confidence = Math.round(prediction.confidence * 100)

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
          <h2 id="recommendation-title">{recommendationLabels[prediction.recommendation]}</h2>
        </div>
        <strong>{confidence}%</strong>
      </div>

      <p className="recommendation-copy">{prediction.reason}</p>

      <div className="decision-grid">
        <div>
          <span>Expected delta</span>
          <strong>{formatDelta(prediction.expected_time_delta)}</strong>
        </div>
        <div>
          <span>Suggested tyre</span>
          <strong>{formatCompound(prediction.suggested_compound)}</strong>
        </div>
        <div>
          <span>Risk level</span>
          <strong>{riskLabels[prediction.risk_level]}</strong>
        </div>
      </div>

      <div className="factor-list" aria-label="Prediction top factors">
        {prediction.top_factors.map((factor) => (
          <span key={factor}>{factor}</span>
        ))}
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
