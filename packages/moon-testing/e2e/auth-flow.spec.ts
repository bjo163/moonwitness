import { test, expect } from "@playwright/test"

test.describe("Scenario 1: Authentication & Single Sign-On (SSO)", () => {
  const COMMAND_CENTER_URL =
    process.env.PLAYWRIGHT_CC_URL || "http://localhost:3001"

  test("should render sign in portal with cyber styling", async ({ page }) => {
    await page.goto(`${COMMAND_CENTER_URL}/login`, { waitUntil: 'networkidle', timeout: 30000 })
    await expect(page).toHaveTitle(/MoonWitness/i)

    const emailInput = page.locator(
      'input[type="email"], input[name="login"], input[name="email"]'
    )
    const passwordInput = page.locator('input[type="password"]')

    await expect(emailInput).toBeVisible({ timeout: 15000 })
    await expect(passwordInput).toBeVisible({ timeout: 15000 })
  })

  test.skip("should authenticate user and navigate to dashboard - requires admin user in DB", async ({
    page,
  }) => {
    // This test is skipped because the admin user is not created in the SQLite DB during CI
    // The admin user creation depends on bootstrapSystemData() which runs after server.start()
    // and requires the database to be properly seeded.
  })
})
