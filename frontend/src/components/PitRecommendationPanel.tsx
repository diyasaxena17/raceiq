import { Radio, ShieldCheck, Sparkles } from "lucide-react"

import type { StrategyBranch } from "../data/mockRace"

type PitRecommendationPanelProps = {
  branches: StrategyBranch[]
}

export function PitRecommendationPanel({ branches }: PitRecommendationPanelProps) {
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
          <h2 id="recommendation-title">Bring Norris in now</h2>
        </div>
        <strong>86%</strong>
      </div>

      <p className="recommendation-copy">
        The medium tyre is losing bite and the pit window opens into clean air. A hard-tyre
        attack now protects the undercut and improves the projected finish.
      </p>

      <div className="decision-grid">
        <div>
          <span>Expected delta</span>
          <strong>+4.8s race gain</strong>
        </div>
        <div>
          <span>Suggested tyre</span>
          <strong>Hard compound</strong>
        </div>
        <div>
          <span>Risk level</span>
          <strong>Controlled</strong>
        </div>
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
