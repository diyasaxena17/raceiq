import { lazy, Suspense } from "react"
import { Navigate, Route, Routes } from "react-router-dom"

import { AppNav } from "./components/AppNav"
import { LandingPage } from "./pages/LandingPage"

const StrategyPage = lazy(() =>
  import("./pages/StrategyPage").then((module) => ({ default: module.StrategyPage })),
)
const ForecastPage = lazy(() =>
  import("./pages/ForecastPage").then((module) => ({ default: module.ForecastPage })),
)
const MethodologyPage = lazy(() =>
  import("./pages/MethodologyPage").then((module) => ({ default: module.MethodologyPage })),
)

function RouteLoader() {
  return (
    <div className="route-loader" role="status">
      <span />
      Loading RaceIQ module
    </div>
  )
}

function App() {
  return (
    <main className="race-shell">
      <AppNav />
      <Suspense fallback={<RouteLoader />}>
        <Routes>
          <Route element={<LandingPage />} path="/" />
          <Route element={<StrategyPage />} path="/strategy" />
          <Route element={<ForecastPage />} path="/forecast" />
          <Route element={<MethodologyPage />} path="/methodology" />
          <Route element={<Navigate replace to="/" />} path="*" />
        </Routes>
      </Suspense>
    </main>
  )
}

export default App
