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
  await expect(page.getByRole("heading", { name: "Bring Norris in now" })).toBeVisible()
  await expect(page.getByRole("heading", { name: "Silverstone pulse map" })).toBeVisible()
  await expect(page.getByRole("heading", { name: "Medium compound is near the edge" })).toBeVisible()
  await expect(page.getByText("Next two race outlook")).toBeVisible()
})

test("race scrubber updates the active lap", async ({ page }) => {
  await page.goto("/strategy")

  const scrubber = page.getByLabel("Select race lap")
  await scrubber.fill("31")

  await expect(page.getByRole("heading", { name: "Lap 31 decision frame" })).toBeVisible()
  await expect(page.getByText("Strategy channel armed for lap 31")).toBeVisible()
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
