import { test, expect } from "@playwright/test"

test.describe("Scenario 1: Authentication & Single Sign-On (SSO)", () => {
  const COMMAND_CENTER_URL =
    process.env.PLAYWRIGHT_CC_URL || "http://localhost:3001"
  const ADMIN_EMAIL = process.env.PLAYWRIGHT_ADMIN_EMAIL
  const ADMIN_PASSWORD = process.env.PLAYWRIGHT_ADMIN_PASSWORD

  test("should render sign in portal with cyber styling", async ({ page }) => {
    await page.goto(`${COMMAND_CENTER_URL}/login`)
    await expect(page).toHaveTitle(/MoonWitness/i)

    const emailInput = page.locator(
      'input[type="email"], input[name="login"], input[name="email"]'
    )
    const passwordInput = page.locator('input[type="password"]')

    await expect(emailInput).toBeVisible()
    await expect(passwordInput).toBeVisible()
  })

  test("should authenticate user and navigate to dashboard", async ({
    page,
  }) => {
    test.skip(
      !ADMIN_EMAIL || !ADMIN_PASSWORD,
      "Set PLAYWRIGHT_ADMIN_EMAIL and PLAYWRIGHT_ADMIN_PASSWORD for authenticated E2E flows"
    )
    await page.goto(`${COMMAND_CENTER_URL}/login`)

    await page.fill(
      'input[type="email"], input[name="login"], input[name="email"]',
      ADMIN_EMAIL!
    )
    await page.fill('input[type="password"]', ADMIN_PASSWORD!)

    const submitBtn = page.locator('button[type="submit"]')
    await submitBtn.click()

    // Wait for navigation after login (redirect from /login to dashboard)
    await page.waitForURL(new RegExp(`${COMMAND_CENTER_URL}/?$`), { timeout: 15000 })
  })
})
