import { expect, test } from "@playwright/test"

const strategyScenarios = [
  {
    button: /Silverstone undercut/i,
    circuitHeading: "Silverstone pulse map",
    driverCode: "NOR",
    forecastTeam: "McLaren",
    headline: "Read the race before the race reads you.",
    lapHeading: "Lap 27 decision frame",
    recommendation: "Box this lap",
    timelineEvent: "RaceIQ calls the decision lap",
    tyreHeading: "Medium compound pressure",
  },
  {
    button: /Monaco cover call/i,
    circuitHeading: "Circuit de Monaco pulse map",
    driverCode: "LEC",
    forecastTeam: "Ferrari",
    headline: "Track position is the fastest car here.",
    lapHeading: "Lap 42 decision frame",
    rainChance: "4%",
    recommendation: "Stay out",
    safetyCar: "Clear",
    timelineEvent: "RaceIQ protects the place",
    trackTemp: "38 C",
    tyreHeading: "Hard compound pressure",
  },
  {
    button: /Spa rain watch/i,
    circuitHeading: "Spa-Francorchamps pulse map",
    driverCode: "RUS",
    forecastTeam: "Mercedes",
    headline: "Wait for the rain, but not too long.",
    lapHeading: "Lap 18 decision frame",
    rainChance: "61%",
    recommendation: "Monitor the window",
    safetyCar: "VSC",
    timelineEvent: "RaceIQ holds the trigger",
    trackTemp: "24 C",
    tyreHeading: "Medium compound pressure",
  },
]

test("renders the RaceIQ landing page", async ({ page }) => {
  await page.goto("/")

  await expect(page.getByRole("heading", { name: "Strategy decisions, staged like race control." })).toBeVisible()
  await expect(page.getByRole("link", { name: /Open strategy room/i })).toBeVisible()
  await expect(page.getByText("Branching futures")).toBeVisible()
})

test("renders the RaceIQ command dashboard", async ({ page }) => {
  await page.goto("/strategy")

  await expect(page.getByRole("button", { name: /Silverstone undercut/i })).toHaveAttribute(
    "aria-pressed",
    "true",
  )
  await expect(page.getByRole("button", { name: /Monaco cover call/i })).toBeVisible()
  await expect(page.getByRole("button", { name: /Spa rain watch/i })).toBeVisible()
  await expect(page.getByRole("heading", { name: "Read the race before the race reads you." })).toBeVisible()
  await expect(page.getByRole("heading", { name: "Box this lap" })).toBeVisible()
  await expect(page.getByText("Using local deterministic prediction fallback.")).toBeVisible()
  await expect(page.getByText("hard tyre recovery window")).toBeVisible()
  await expect(page.getByRole("heading", { name: "Silverstone pulse map" })).toBeVisible()
  await expect(page.getByRole("heading", { name: "Medium compound pressure" })).toBeVisible()
  await expect(page.getByText("Next two race outlook")).toBeVisible()
  await expect(page.getByText("Scenario preview")).toBeVisible()
  await expect(page.getByText("Using local deterministic forecast fallback.")).toBeVisible()
  await expect(page.getByText("Model confidence")).toBeVisible()
  await expect(page.getByText("Street-circuit qualifying value")).toBeVisible()
  await expect(page.getByText("Using dashboard timeline fallback.")).toBeVisible()
  await expect(page.getByText("Virtual safety car window")).toBeVisible()
})

test("race scrubber updates the active lap", async ({ page }) => {
  await page.goto("/strategy")

  const scrubber = page.getByLabel("Select race lap")
  await scrubber.fill("31")

  await expect(page.getByRole("heading", { name: "Lap 31 decision frame" })).toBeVisible()
  await expect(page.getByText("Strategy channel armed for lap 31")).toBeVisible()
})

test("scenario selector changes the strategy state", async ({ page }) => {
  await page.goto("/strategy")

  await expect(page.getByRole("button", { name: /Silverstone undercut/i })).toHaveAttribute(
    "aria-pressed",
    "true",
  )
  await expect(page.getByText("Using local deterministic prediction fallback.")).toBeVisible()
  await expect(page.getByText("Using dashboard timeline fallback.")).toBeVisible()

  for (const scenario of strategyScenarios) {
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
    await expect(page.getByText(`${scenario.driverCode} is inside the live scenario decision window.`)).toBeVisible()
    if ("rainChance" in scenario) {
      const sessionSummary = page.getByLabel("Session summary")
      await expect(page.getByText(scenario.rainChance, { exact: true })).toBeVisible()
      await expect(sessionSummary.getByText(scenario.safetyCar, { exact: true })).toBeVisible()
      await expect(sessionSummary.getByText(scenario.trackTemp, { exact: true })).toBeVisible()
    }
    await expect(
      page.getByLabel("Scenario forecast preview").getByText(scenario.forecastTeam),
    ).toBeVisible()
  }
})

test("dashboard remains readable on mobile", async ({ page }) => {
  await page.goto("/strategy")

  await expect(page.getByRole("heading", { name: "Read the race before the race reads you." })).toBeVisible()
  await expect(page.getByRole("heading", { name: "Focus group" })).toBeVisible()
  await expect(page.getByText("Norris can pit into clean air")).toBeVisible()
})

test("forecast and methodology routes render planned surfaces", async ({ page }) => {
  await page.goto("/forecast")
  await expect(
    page.getByRole("heading", { name: "Next-two-race likelihood is the next intelligence layer." }),
  ).toBeVisible()

  await page.goto("/methodology")
  await expect(page.getByRole("heading", { name: "Explainable first, model-backed second." })).toBeVisible()
})
