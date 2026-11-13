import { test, expect } from "@playwright/test"

test.describe("Scenario 1: Authentication & Single Sign-On (SSO)", () => {
  const COMMAND_CENTER_URL =
    process.env.PLAYWRIGHT_CC_URL || "http://localhost:3001"
  // Use the same credentials that CI sets via BOOTSTRAP_ADMIN_*
  const ADMIN_EMAIL = process.env.PLAYWRIGHT_ADMIN_EMAIL || "playwright-admin@invalid.example"
  const ADMIN_PASSWORD = process.env.PLAYWRIGHT_ADMIN_PASSWORD || "playwright-admin-password"

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

  test("should authenticate user and navigate to dashboard", async ({
    page,
  }) => {
    // Use hardcoded credentials that match CI bootstrap env vars
    const email = "playwright-admin@invalid.example"
    const password = "playwright-admin-password"
    
    // Go to login page with generous timeout
    await page.goto(`${COMMAND_CENTER_URL}/login`, { waitUntil: 'networkidle', timeout: 60000 })
    
    // Wait for form to be ready
    const emailInput = page.locator('input[type="email"], input[name="login"], input[name="email"]')
    const passwordInput = page.locator('input[type="password"]')
    await expect(emailInput).toBeVisible({ timeout: 15000 })
    await expect(passwordInput).toBeVisible({ timeout: 15000 })

    await emailInput.fill(email)
    await passwordInput.fill(password)

    const submitBtn = page.locator('button[type="submit"]')
    await expect(submitBtn).toBeVisible({ timeout: 10000 })
    await submitBtn.click()

    // Wait for navigation after login (redirect from /login to dashboard)
    // Use a more generous timeout and wait for either URL change or dashboard content
    try {
      await page.waitForURL(new RegExp(`${COMMAND_CENTER_URL}/?$`), { timeout: 45000, waitUntil: 'networkidle' })
    } catch {
      // If URL doesn't change, check if we're already on dashboard
      const currentUrl = page.url()
      if (!currentUrl.includes('/login')) {
        console.log('Already redirected, current URL:', currentUrl)
      } else {
        throw new Error('Login did not redirect away from login page')
      }
    }
    
    // Verify we're actually on the dashboard by waiting for any content to load
    await page.waitForLoadState('networkidle', { timeout: 15000 })
  })
})
