import { expect, test } from "@playwright/test"

const backendScenarios = [
  {
    button: /Silverstone undercut/i,
    circuit: "Silverstone",
    circuitHeading: "Silverstone pulse map",
    forecastStatus: "Backend forecast contract is live.",
    headline: "Read the race before the race reads you.",
    lapHeading: "Lap 27 decision frame",
    recommendation: "Box this lap",
    safetyCar: "Clear",
    shouldClick: false,
    timelineEvent: "RaceIQ calls the decision lap",
    trackTemp: "31 C",
    tyreHeading: "Medium compound pressure",
    weather: "Cloud cover building",
  },
  {
    button: /Monaco cover call/i,
    circuit: "Circuit de Monaco",
    circuitHeading: "Circuit de Monaco pulse map",
    forecastStatus: "Using local deterministic forecast fallback.",
    headline: "Track position is the fastest car here.",
    lapHeading: "Lap 42 decision frame",
    recommendation: "Stay out",
    safetyCar: "Clear",
    shouldClick: true,
    timelineEvent: "RaceIQ protects the place",
    trackTemp: "38 C",
    tyreHeading: "Hard compound pressure",
    weather: "Still air, no rain threat",
  },
  {
    button: /Spa rain watch/i,
    circuit: "Spa-Francorchamps",
    circuitHeading: "Spa-Francorchamps pulse map",
    forecastStatus: "Using local deterministic forecast fallback.",
    headline: "Wait for the rain, but not too long.",
    lapHeading: "Lap 18 decision frame",
    recommendation: "Monitor the window",
    safetyCar: "VSC",
    shouldClick: true,
    timelineEvent: "RaceIQ holds the trigger",
    trackTemp: "24 C",
    tyreHeading: "Medium compound pressure",
    weather: "Rain cell over sector two",
  },
]

test("strategy page renders backend-backed scenarios", async ({ page }) => {
  await page.goto("/strategy")

  for (const scenario of backendScenarios) {
    if (scenario.shouldClick) {
      await page.getByRole("button", { name: scenario.button }).click()
    }

    await expect(page.getByRole("button", { name: scenario.button })).toHaveAttribute(
      "aria-pressed",
      "true",
    )
    await expect(page.getByRole("heading", { name: scenario.headline })).toBeVisible()
    await expect(page.getByRole("heading", { level: 2, name: scenario.recommendation })).toBeVisible()
    await expect(page.getByRole("heading", { name: scenario.circuitHeading })).toBeVisible()
    await expect(page.getByRole("heading", { name: scenario.tyreHeading })).toBeVisible()
    await expect(page.getByRole("heading", { name: scenario.lapHeading })).toBeVisible()
    await expect(page.getByText(scenario.timelineEvent)).toBeVisible()
    await expect(page.getByText("Backend prediction contract is live.")).toBeVisible()
    await expect(page.getByText("Backend replay contract is live.")).toBeVisible()
    await expect(page.getByText(scenario.forecastStatus)).toBeVisible()

    const sessionSummary = page.getByLabel("Session summary")
    await expect(sessionSummary.getByText(scenario.circuit, { exact: true })).toBeVisible()
    await expect(sessionSummary.getByText(scenario.weather, { exact: true })).toBeVisible()
    await expect(sessionSummary.getByText(scenario.safetyCar, { exact: true })).toBeVisible()
    await expect(sessionSummary.getByText(scenario.trackTemp, { exact: true })).toBeVisible()
  }
})
