import { Gauge, MapPinned } from "lucide-react"

type CircuitPulseProps = {
  activeLap: number
  totalLaps: number
}

export function CircuitPulse({ activeLap, totalLaps }: CircuitPulseProps) {
  const progress = Math.round((activeLap / totalLaps) * 100)

  return (
    <section className="panel circuit-panel" aria-labelledby="circuit-title">
      <div className="panel-header">
        <div>
          <p className="eyebrow">Track model</p>
          <h2 id="circuit-title">Silverstone pulse map</h2>
        </div>
        <MapPinned aria-hidden="true" className="header-icon" />
      </div>

      <div className="circuit-stage">
        <svg viewBox="0 0 420 250" role="img" aria-label="Stylized Silverstone circuit">
          <path
            className="track-shadow"
            d="M58 156 C76 78 151 55 199 82 C234 102 243 49 304 52 C369 56 394 104 358 139 C326 171 274 143 248 177 C214 221 118 220 77 185 C61 172 54 166 58 156Z"
          />
          <path
            className="track-line"
            d="M58 156 C76 78 151 55 199 82 C234 102 243 49 304 52 C369 56 394 104 358 139 C326 171 274 143 248 177 C214 221 118 220 77 185 C61 172 54 166 58 156Z"
          />
          <path className="pit-lane" d="M250 177 C232 192 198 202 159 201" />
          <circle className="car-dot primary" cx="249" cy="176" r="8" />
          <circle className="car-dot ghost" cx="187" cy="202" r="7" />
        </svg>
      </div>

      <div className="circuit-readouts">
        <div>
          <span>Lap load</span>
          <strong>{progress}%</strong>
        </div>
        <div>
          <span>Pit lane delta</span>
          <strong>21.8s</strong>
        </div>
        <div>
          <span>Clean-air gap</span>
          <strong>3.1s</strong>
        </div>
      </div>

      <div className="radio-strip">
        <Gauge aria-hidden="true" />
        <span>Strategy channel armed for lap {activeLap}</span>
      </div>
    </section>
  )
}
