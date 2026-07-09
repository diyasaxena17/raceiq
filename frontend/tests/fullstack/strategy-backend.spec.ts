import { expect, test } from "@playwright/test"

const backendScenarios = [
  {
    button: /Monaco cover call/i,
    circuitHeading: "Circuit de Monaco pulse map",
    headline: "Track position is the fastest car here.",
    lapHeading: "Lap 42 decision frame",
    recommendation: "Stay out",
    timelineEvent: "RaceIQ protects the place",
    trackTemp: "38 C",
    tyreHeading: "Hard compound pressure",
  },
  {
    button: /Spa rain watch/i,
    circuitHeading: "Spa-Francorchamps pulse map",
    headline: "Wait for the rain, but not too long.",
    lapHeading: "Lap 18 decision frame",
    recommendation: "Monitor the window",
    safetyCar: "VSC",
    timelineEvent: "RaceIQ holds the trigger",
    trackTemp: "24 C",
    tyreHeading: "Medium compound pressure",
  },
]

test("strategy page renders backend-backed scenarios", async ({ page }) => {
  await page.goto("/strategy")

  await expect(page.getByRole("button", { name: /Silverstone undercut/i })).toHaveAttribute(
    "aria-pressed",
    "true",
  )
  await expect(page.getByText("Backend prediction contract is live.")).toBeVisible()
  await expect(page.getByText("Backend replay contract is live.")).toBeVisible()
  await expect(page.getByText("Backend forecast contract is live.")).toBeVisible()
  await expect(page.getByRole("heading", { name: "Read the race before the race reads you." })).toBeVisible()
  await expect(page.getByRole("heading", { level: 2, name: "Box this lap" })).toBeVisible()
  await expect(page.getByRole("heading", { name: "Silverstone pulse map" })).toBeVisible()
  await expect(page.getByRole("heading", { name: "Lap 27 decision frame" })).toBeVisible()
  await expect(page.getByText("RaceIQ calls the decision lap")).toBeVisible()

  for (const scenario of backendScenarios) {
    await page.getByRole("button", { name: scenario.button }).click()

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

    if ("safetyCar" in scenario) {
      await expect(page.getByLabel("Session summary").getByText(scenario.safetyCar, { exact: true })).toBeVisible()
    }

    if ("trackTemp" in scenario) {
      await expect(page.getByLabel("Session summary").getByText(scenario.trackTemp, { exact: true })).toBeVisible()
    }
  }
})
