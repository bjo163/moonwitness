import { test, expect } from "@playwright/test"

test.describe("Scenario 3: Bulk CSV Import & Print Report", () => {
  const COMMAND_CENTER_URL =
    process.env.PLAYWRIGHT_CC_URL || "http://localhost:3001"
  const authenticated = Boolean(
    process.env.PLAYWRIGHT_ADMIN_EMAIL && process.env.PLAYWRIGHT_ADMIN_PASSWORD
  )

  test("should open Bulk CSV Ingestion Wizard modal on table view", async ({
    page,
  }) => {
    test.skip(
      !authenticated,
      "Authenticated matrix flow requires PLAYWRIGHT_ADMIN_EMAIL/PASSWORD"
    )
    await page.goto(`${COMMAND_CENTER_URL}/matrix/pj.task`)
    
    // Wait for page to fully load and matrix to render
    await page.waitForLoadState('networkidle', { timeout: 30000 })
    
    // Wait for matrix table to be visible
    await expect(page.locator('table, [role="grid"], .matrix-table')).toBeVisible({ timeout: 20000 })

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
    test.skip(
      !authenticated,
      "Authenticated matrix flow requires PLAYWRIGHT_ADMIN_EMAIL/PASSWORD"
    )
    await page.goto(`${COMMAND_CENTER_URL}/matrix/pj.task`)
    
    // Wait for page to fully load
    await page.waitForLoadState('networkidle', { timeout: 30000 })
    await expect(page.locator('table, [role="grid"], .matrix-table')).toBeVisible({ timeout: 20000 })

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
