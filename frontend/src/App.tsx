import { Navigate, Route, Routes } from "react-router-dom"

import { AppNav } from "./components/AppNav"
import { ForecastPage } from "./pages/ForecastPage"
import { LandingPage } from "./pages/LandingPage"
import { MethodologyPage } from "./pages/MethodologyPage"
import { StrategyPage } from "./pages/StrategyPage"

function App() {
  return (
    <main className="race-shell">
      <AppNav />
      <Routes>
        <Route element={<LandingPage />} path="/" />
        <Route element={<StrategyPage />} path="/strategy" />
        <Route element={<ForecastPage />} path="/forecast" />
        <Route element={<MethodologyPage />} path="/methodology" />
        <Route element={<Navigate replace to="/" />} path="*" />
      </Routes>
    </main>
  )
}

export default App
