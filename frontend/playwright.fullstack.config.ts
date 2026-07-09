import { defineConfig, devices } from "@playwright/test"

const frontendUrl = "http://127.0.0.1:5173"
const backendUrl = "http://127.0.0.1:8000"

export default defineConfig({
  testDir: "./tests/fullstack",
  fullyParallel: true,
  reporter: [["list"]],
  use: {
    baseURL: frontendUrl,
    trace: "on-first-retry",
  },
  webServer: [
    {
      command: "python -m uvicorn app.main:app --app-dir ../backend --host 127.0.0.1 --port 8000",
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
      url: `${backendUrl}/health`,
    },
    {
      command: `VITE_RACEIQ_API_BASE_URL=${backendUrl} npm run dev -- --host 127.0.0.1`,
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
      url: frontendUrl,
    },
  ],
  projects: [
    {
      name: "chromium-fullstack",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
})
