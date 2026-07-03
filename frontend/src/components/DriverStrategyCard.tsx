import { AlertTriangle, CircleGauge, TimerReset } from "lucide-react"

import type { DriverStrategy } from "../data/mockRace"

type DriverStrategyCardProps = {
  driver: DriverStrategy
  isFocus?: boolean
}

const riskClass = {
  Low: "risk-low",
  Medium: "risk-medium",
  High: "risk-high",
}

export function DriverStrategyCard({ driver, isFocus = false }: DriverStrategyCardProps) {
  return (
    <article className={`driver-card ${isFocus ? "is-focus" : ""}`}>
      <div className="driver-card-top">
        <div className="driver-code" style={{ borderColor: driver.teamColor }}>
          {driver.code}
        </div>
        <div>
          <h3>{driver.name}</h3>
          <p>{driver.team}</p>
        </div>
        <span className="position-pill">P{driver.position}</span>
      </div>

      <div className="driver-metrics">
        <div>
          <span>Gap</span>
          <strong>{driver.gap}</strong>
        </div>
        <div>
          <span>Tyre</span>
          <strong>{driver.tyre}</strong>
        </div>
        <div>
          <span>Age</span>
          <strong>{driver.tyreAge}L</strong>
        </div>
      </div>

      <div className="driver-footer">
        <div className="status-line">
          <CircleGauge aria-hidden="true" />
          <span>{driver.paceDelta}/lap</span>
        </div>
        <div className="status-line">
          <TimerReset aria-hidden="true" />
          <span>{driver.pitStops} stop</span>
        </div>
        <div className={`risk-badge ${riskClass[driver.risk]}`}>
          <AlertTriangle aria-hidden="true" />
          <span>{driver.risk}</span>
        </div>
      </div>

      <p className="driver-status">{driver.status}</p>
    </article>
  )
}
