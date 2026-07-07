import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import type { Compound, TyrePoint } from "../data/mockRace"

type TyreDegradationChartProps = {
  compound: Compound
  data: TyrePoint[]
}

export function TyreDegradationChart({ compound, data }: TyreDegradationChartProps) {
  const latestPoint = data.at(-1)

  return (
    <section className="panel tyre-panel" aria-labelledby="tyre-title">
      <div className="panel-header">
        <div>
          <p className="eyebrow">Tyre model</p>
          <h2 id="tyre-title">{compound} compound pressure</h2>
        </div>
        <div className="tyre-orbit" aria-hidden="true">
          <span />
        </div>
      </div>

      <div className="tyre-readout">
        <div className="tyre-visual">
          <div className="tyre-ring">
            <span>{compound.slice(0, 3).toUpperCase()}</span>
          </div>
        </div>
        <div className="tyre-stats">
          <div>
            <span>Pace loss</span>
            <strong>+{(latestPoint?.medium ?? 0).toFixed(2)}s/lap</strong>
          </div>
          <div>
            <span>Estimated life</span>
            <strong>{Math.max(2, Math.round(8 - (latestPoint?.projected ?? 0) * 6))} laps</strong>
          </div>
          <div>
            <span>Cliff risk</span>
            <strong>{(latestPoint?.projected ?? 0) > 0.6 ? "High" : "Medium"}</strong>
          </div>
        </div>
      </div>

      <div className="chart-wrap">
        <ResponsiveContainer height={220} width="100%">
          <AreaChart data={data} margin={{ bottom: 0, left: -18, right: 10, top: 12 }}>
            <defs>
              <linearGradient id="mediumWear" x1="0" x2="0" y1="0" y2="1">
                <stop offset="5%" stopColor="#ffd43b" stopOpacity={0.45} />
                <stop offset="95%" stopColor="#ffd43b" stopOpacity={0.02} />
              </linearGradient>
              <linearGradient id="hardWear" x1="0" x2="0" y1="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.32} />
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
            <XAxis dataKey="lap" stroke="#a6adbb" tickLine={false} />
            <YAxis stroke="#a6adbb" tickLine={false} unit="s" />
            <Tooltip
              contentStyle={{
                background: "#101820",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: 8,
                color: "#E0E0E0",
              }}
            />
            <Area
              dataKey="medium"
              fill="url(#mediumWear)"
              name="Medium wear"
              stroke="#ffd43b"
              strokeWidth={3}
              type="monotone"
            />
            <Area
              dataKey="hard"
              fill="url(#hardWear)"
              name="Hard tyre"
              stroke="#3B82F6"
              strokeWidth={3}
              type="monotone"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  )
}
