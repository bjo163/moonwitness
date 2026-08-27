import { test, expect } from '@playwright/test'

test.describe('Scenario 4: Public Cosmic Portal & 3D Celestial Visualizers', () => {
  const WEB_PORTAL_URL = process.env.PLAYWRIGHT_WEB_URL || 'http://localhost:3000'

  test('should load Public Cosmic Portal without errors', async ({ page }) => {
    await page.goto(WEB_PORTAL_URL)
    await expect(page).toHaveTitle(/MoonWitness/i)
  })

  test('should render 3D Celestial Moon sphere and interactive controls', async ({ page }) => {
    await page.goto(WEB_PORTAL_URL)

    // Check for canvas or celestial container
    const celestialView = page.locator('canvas, .military-box')
    await expect(celestialView.first()).toBeVisible()
  })
})
