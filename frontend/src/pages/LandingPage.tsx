import { ArrowRight, Gauge, GitBranch, LineChart, Radar } from "lucide-react"
import { Link } from "react-router-dom"

const entryCards = [
  {
    icon: Gauge,
    label: "Pit window",
    text: "Compare the call lap against tyre life, traffic, and track position.",
  },
  {
    icon: GitBranch,
    label: "Branching futures",
    text: "Follow alternate race paths instead of reading a flat recommendation.",
  },
  {
    icon: Radar,
    label: "Race pressure",
    text: "Blend weather, pace, gaps, and risk into one pit-wall view.",
  },
]

export function LandingPage() {
  return (
    <section className="landing-page" aria-labelledby="landing-title">
      <div className="landing-hero">
        <div className="landing-copy">
          <p className="eyebrow live-eyebrow">
            <span /> Race intelligence cockpit
          </p>
          <h1 id="landing-title">Strategy decisions, staged like race control.</h1>
          <p>
            RaceIQ turns pit timing, tyre life, weather pressure, and model confidence into an
            interactive F1 command room.
          </p>
          <div className="landing-actions">
            <Link className="primary-action" to="/strategy">
              Open strategy room
              <ArrowRight aria-hidden="true" />
            </Link>
            <Link className="secondary-action" to="/methodology">
              See the model plan
            </Link>
          </div>
        </div>

        <div className="landing-visual" aria-label="RaceIQ system preview">
          <div className="visual-orbit">
            <span />
            <span />
            <span />
          </div>
          <div className="visual-console">
            <div>
              <span>Decision lap</span>
              <strong>L27</strong>
            </div>
            <div>
              <span>Call</span>
              <strong>Box now</strong>
            </div>
            <div>
              <span>Confidence</span>
              <strong>86%</strong>
            </div>
          </div>
          <LineChart aria-hidden="true" className="visual-icon" />
        </div>
      </div>

      <div className="entry-card-grid">
        {entryCards.map((card) => {
          const Icon = card.icon

          return (
            <article className="entry-card" key={card.label}>
              <Icon aria-hidden="true" />
              <h2>{card.label}</h2>
              <p>{card.text}</p>
            </article>
          )
        })}
      </div>
    </section>
  )
}
