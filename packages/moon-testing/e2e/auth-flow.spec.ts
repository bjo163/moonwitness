import { test, expect } from '@playwright/test'

test.describe('Scenario 1: Authentication & Single Sign-On (SSO)', () => {
  const COMMAND_CENTER_URL = process.env.PLAYWRIGHT_CC_URL || 'http://localhost:3001'

  test('should render tactical login portal with cyber styling', async ({ page }) => {
    await page.goto(`${COMMAND_CENTER_URL}/login`)
    await expect(page).toHaveTitle(/MoonWitness/i)
    
    const emailInput = page.locator('input[type="email"], input[name="login"], input[name="email"]')
    const passwordInput = page.locator('input[type="password"]')
    
    await expect(emailInput).toBeVisible()
    await expect(passwordInput).toBeVisible()
  })

  test('should authenticate operator and navigate to tactical dashboard', async ({ page }) => {
    await page.goto(`${COMMAND_CENTER_URL}/login`)

    await page.fill('input[type="email"], input[name="login"], input[name="email"]', 'commander@moonwitness.os')
    await page.fill('input[type="password"]', 'password123')
    
    const submitBtn = page.locator('button[type="submit"]')
    await submitBtn.click()

    // Expect transition to dashboard
    await expect(page).toHaveURL(new RegExp(`${COMMAND_CENTER_URL}/?$`))
  })
})
