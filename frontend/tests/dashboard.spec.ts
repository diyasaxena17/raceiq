import { expect, test } from "@playwright/test"

test("renders the RaceIQ landing page", async ({ page }) => {
  await page.goto("/")

  await expect(page.getByRole("heading", { name: "Strategy decisions, staged like race control." })).toBeVisible()
  await expect(page.getByRole("link", { name: /Open strategy room/i })).toBeVisible()
  await expect(page.getByText("Branching futures")).toBeVisible()
})

test("renders the RaceIQ command dashboard", async ({ page }) => {
  await page.goto("/strategy")

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

  await page.getByRole("button", { name: /Monaco cover call/i }).click()
  await expect(page.getByRole("heading", { name: "Track position is the fastest car here." })).toBeVisible()
  await expect(page.getByRole("heading", { level: 2, name: "Stay out" })).toBeVisible()
  await expect(page.getByRole("heading", { name: "Circuit de Monaco pulse map" })).toBeVisible()
  await expect(page.getByText("RaceIQ protects the place")).toBeVisible()
  await expect(page.getByLabel("Scenario forecast preview").getByText("Ferrari")).toBeVisible()

  await page.getByRole("button", { name: /Spa rain watch/i }).click()
  await expect(page.getByRole("heading", { name: "Wait for the rain, but not too long." })).toBeVisible()
  await expect(page.getByRole("heading", { name: "Monitor the window" })).toBeVisible()
  await expect(page.getByRole("heading", { name: "Spa-Francorchamps pulse map" })).toBeVisible()
  await expect(page.getByText("RaceIQ holds the trigger")).toBeVisible()
  await expect(page.getByLabel("Scenario forecast preview").getByText("Mercedes")).toBeVisible()
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
