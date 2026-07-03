import { CloudSun, MessageSquareText, Trophy } from "lucide-react"
import { Link } from "react-router-dom"

export function ForecastPage() {
  return (
    <section className="info-page" aria-labelledby="forecast-page-title">
      <div className="info-hero">
        <p className="eyebrow live-eyebrow">
          <span /> Forecast module
        </p>
        <h1 id="forecast-page-title">Next-two-race likelihood is the next intelligence layer.</h1>
        <p>
          This page will become the driver and team win-probability surface. The first version will
          forecast two races, then expand toward the remaining season.
        </p>
        <Link className="primary-action" to="/strategy">
          Back to strategy room
        </Link>
      </div>

      <div className="info-grid">
        <article className="panel info-card">
          <Trophy aria-hidden="true" />
          <h2>Outcome model</h2>
          <p>Driver and constructor win probabilities by race and forecast horizon.</p>
        </article>
        <article className="panel info-card">
          <CloudSun aria-hidden="true" />
          <h2>Context features</h2>
          <p>Track fit, weather volatility, car form, driver form, and reliability signals.</p>
        </article>
        <article className="panel info-card">
          <MessageSquareText aria-hidden="true" />
          <h2>Sentiment layer</h2>
          <p>Team and media signals treated as noisy, timestamped model inputs.</p>
        </article>
      </div>
    </section>
  )
}
