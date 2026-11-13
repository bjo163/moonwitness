import { test, expect } from "@playwright/test"

test.describe("Scenario 3: Bulk CSV Import & Print Report", () => {
  const COMMAND_CENTER_URL =
    process.env.PLAYWRIGHT_CC_URL || "http://localhost:3001"
  // Use hardcoded credentials that match CI bootstrap env vars
  const ADMIN_EMAIL = "playwright-admin@invalid.example"
  const ADMIN_PASSWORD = "playwright-admin-password"

  async function login(page) {
    await page.goto(`${COMMAND_CENTER_URL}/login`, { waitUntil: 'networkidle', timeout: 60000 })
    const emailInput = page.locator('input[type="email"], input[name="login"], input[name="email"]')
    const passwordInput = page.locator('input[type="password"]')
    await expect(emailInput).toBeVisible({ timeout: 15000 })
    await expect(passwordInput).toBeVisible({ timeout: 15000 })
    await emailInput.fill(ADMIN_EMAIL)
    await passwordInput.fill(ADMIN_PASSWORD)
    const submitBtn = page.locator('button[type="submit"]')
    await submitBtn.click()
    await page.waitForURL(new RegExp(`${COMMAND_CENTER_URL}/?$`), { timeout: 45000, waitUntil: 'networkidle' }).catch(() => {})
    await page.waitForLoadState('networkidle', { timeout: 15000 })
  }

  test("should open Bulk CSV Ingestion Wizard modal on table view", async ({
    page,
  }) => {
    await login(page)
    
    // Now go to matrix page
    await page.goto(`${COMMAND_CENTER_URL}/matrix/pj.task`, { waitUntil: 'networkidle', timeout: 60000 })
    
    // Wait for matrix table to be visible - use more specific selector
    await expect(page.locator('table, [role="grid"]')).toBeVisible({ timeout: 30000 })

    const importBtn = page.locator('button:has-text("IMPORT CSV")')
    await expect(importBtn).toBeVisible({ timeout: 15000 })
    await importBtn.click()

    // Expect Import Wizard modal
    const modalTitle = page.locator('h2:has-text("IMPORT CSV DATASET")')
    await expect(modalTitle).toBeVisible({ timeout: 10000 })
  })

  test("should open record modal and provide Print Report action", async ({
    page,
  }) => {
    await login(page)
    
    // Now go to matrix page
    await page.goto(`${COMMAND_CENTER_URL}/matrix/pj.task`, { waitUntil: 'networkidle', timeout: 60000 })
    
    // Wait for matrix table to be visible
    await expect(page.locator('table, [role="grid"]')).toBeVisible({ timeout: 30000 })

    // Click first row
    const firstRow = page.locator("tbody tr").first()
    if (await firstRow.isVisible({ timeout: 10000 }).catch(() => false)) {
      await firstRow.click()

      // Expect Print Report button in modal header
      const printBtn = page.locator('button:has-text("PRINT REPORT")')
      await expect(printBtn).toBeVisible({ timeout: 10000 })
    }
  })
})
