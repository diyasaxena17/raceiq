import {
  strategyDashboardFixture,
  type StrategyDashboardData,
} from "../data/mockRace"

export type { StrategyDashboardData } from "../data/mockRace"

const MOCK_LATENCY_MS = 180

function cloneFixture<T>(value: T): T {
  return structuredClone(value)
}

function delay(ms: number) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms)
  })
}

export async function getStrategyDashboard(): Promise<StrategyDashboardData> {
  await delay(MOCK_LATENCY_MS)
  return cloneFixture(strategyDashboardFixture)
}
