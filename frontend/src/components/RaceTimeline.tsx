import { CloudRain, Flag, Siren, Wrench } from "lucide-react"

import type { TimelineEvent } from "../data/mockRace"

type RaceTimelineProps = {
  events: TimelineEvent[]
  activeLap: number
  totalLaps: number
  onLapChange: (lap: number) => void
}

const eventIcons = {
  race: Flag,
  pit: Wrench,
  weather: CloudRain,
  warning: Siren,
}

export function RaceTimeline({ events, activeLap, totalLaps, onLapChange }: RaceTimelineProps) {
  return (
    <section className="panel timeline-panel" aria-labelledby="timeline-title">
      <div className="panel-header">
        <div>
          <p className="eyebrow">Race scrubber</p>
          <h2 id="timeline-title">Lap {activeLap} decision frame</h2>
        </div>
        <span className="lap-pill">
          {activeLap}/{totalLaps}
        </span>
      </div>

      <div className="scrubber">
        <input
          aria-label="Select race lap"
          max={totalLaps}
          min={1}
          onChange={(event) => onLapChange(Number(event.target.value))}
          type="range"
          value={activeLap}
        />
        <div className="scrubber-labels">
          <span>L1</span>
          <span>L{Math.round(totalLaps / 2)}</span>
          <span>L{totalLaps}</span>
        </div>
      </div>

      <div className="timeline-events">
        {events.map((event) => {
          const Icon = eventIcons[event.type]
          const isActive = event.lap <= activeLap

          return (
            <article className={`timeline-event ${isActive ? "is-active" : ""}`} key={event.title}>
              <div className="event-icon">
                <Icon aria-hidden="true" />
              </div>
              <div>
                <span>Lap {event.lap}</span>
                <h3>{event.title}</h3>
                <p>{event.detail}</p>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
