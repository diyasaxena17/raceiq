import { Database, FlaskConical, Workflow } from "lucide-react"
import { Link } from "react-router-dom"

const steps = [
  "Start with deterministic strategy rules.",
  "Add stable API contracts and sample fixtures.",
  "Train explainable baselines before complex models.",
  "Introduce PostgreSQL when historical features need persistence.",
]

export function MethodologyPage() {
  return (
    <section className="info-page" aria-labelledby="method-page-title">
      <div className="info-hero">
        <p className="eyebrow live-eyebrow">
          <span /> Methodology
        </p>
        <h1 id="method-page-title">Explainable first, model-backed second.</h1>
        <p>
          RaceIQ should show how a recommendation is made, not just output a probability. The build
          path favors transparent baselines, visible assumptions, and measurable model upgrades.
        </p>
        <Link className="primary-action" to="/strategy">
          View live mock dashboard
        </Link>
      </div>

      <div className="info-grid">
        <article className="panel info-card">
          <Workflow aria-hidden="true" />
          <h2>Workflow</h2>
          <ol>
            {steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </article>
        <article className="panel info-card">
          <Database aria-hidden="true" />
          <h2>Data spine</h2>
          <p>Race, track, weather, driver, team, sentiment, model run, and forecast tables.</p>
        </article>
        <article className="panel info-card">
          <FlaskConical aria-hidden="true" />
          <h2>Evaluation</h2>
          <p>Track prediction quality, calibration, and feature importance as the model evolves.</p>
        </article>
      </div>
    </section>
  )
}
