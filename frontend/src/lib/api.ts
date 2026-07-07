import {
  strategyDashboardFixture,
  type StrategyDashboardData,
} from "../data/mockRace"

export type { StrategyDashboardData } from "../data/mockRace"

const MOCK_LATENCY_MS = 180
const API_BASE_URL = import.meta.env.VITE_RACEIQ_API_BASE_URL?.replace(/\/$/, "")

function cloneFixture<T>(value: T): T {
  return structuredClone(value)
}

function delay(ms: number) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms)
  })
}

async function getStrategyDashboardFromBackend(): Promise<StrategyDashboardData> {
  const response = await fetch(`${API_BASE_URL}/strategy/sample`)

  if (!response.ok) {
    throw new Error(`Strategy sample request failed with ${response.status}`)
  }

  return (await response.json()) as StrategyDashboardData
}

export async function getStrategyDashboard(): Promise<StrategyDashboardData> {
  if (API_BASE_URL) {
    try {
      return await getStrategyDashboardFromBackend()
    } catch (error) {
      console.warn("Falling back to local strategy dashboard fixture.", error)
    }
  }

  await delay(MOCK_LATENCY_MS)
  return cloneFixture(strategyDashboardFixture)
}
