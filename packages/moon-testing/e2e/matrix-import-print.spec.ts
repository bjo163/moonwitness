import { test, expect } from '@playwright/test'

test.describe('Scenario 3: Bulk CSV Import & Print Briefing Memorandum', () => {
  const COMMAND_CENTER_URL = process.env.PLAYWRIGHT_CC_URL || 'http://localhost:3001'

  test('should open Bulk CSV Ingestion Wizard modal on table view', async ({ page }) => {
    await page.goto(`${COMMAND_CENTER_URL}/matrix/pj.task`)

    const importBtn = page.locator('button:has-text("IMPORT CSV")')
    await expect(importBtn).toBeVisible()
    await importBtn.click()

    // Expect Import Wizard modal
    const modalTitle = page.locator('h2:has-text("IMPORT CSV DATASET")')
    await expect(modalTitle).toBeVisible()
  })

  test('should open record modal and provide Print Tactical Briefing action', async ({ page }) => {
    await page.goto(`${COMMAND_CENTER_URL}/matrix/pj.task`)

    // Click first row
    const firstRow = page.locator('tbody tr').first()
    if (await firstRow.isVisible()) {
      await firstRow.click()

      // Expect Print Briefing button in modal header
      const printBtn = page.locator('button:has-text("PRINT BRIEFING")')
      await expect(printBtn).toBeVisible()
    }
  })
})
