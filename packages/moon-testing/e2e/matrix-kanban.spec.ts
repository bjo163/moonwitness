import { test, expect } from "@playwright/test"

test.describe("Scenario 2: Matrix Workspace & Kanban Pipeline", () => {
  const COMMAND_CENTER_URL =
    process.env.PLAYWRIGHT_CC_URL || "http://localhost:3001"
  const authenticated = Boolean(
    process.env.PLAYWRIGHT_ADMIN_EMAIL && process.env.PLAYWRIGHT_ADMIN_PASSWORD
  )

  test("should navigate to Task Matrix and render Table, Kanban, and Pivot view toggles", async ({
    page,
  }) => {
    test.skip(
      !authenticated,
      "Authenticated matrix flow requires PLAYWRIGHT_ADMIN_EMAIL/PASSWORD"
    )
    await page.goto(`${COMMAND_CENTER_URL}/matrix/pj.task`)
    
    // Wait for page to fully load and matrix to render
    await page.waitForLoadState('networkidle', { timeout: 30000 })
    await expect(page.locator('table, [role="grid"], .matrix-table')).toBeVisible({ timeout: 20000 })

    // Verify 3 view toggles are visible
    const tableBtn = page.locator('button:has-text("TABLE")')
    const kanbanBtn = page.locator('button:has-text("KANBAN")')
    const pivotBtn = page.locator('button:has-text("PIVOT")')

    await expect(tableBtn).toBeVisible({ timeout: 15000 })
    await expect(kanbanBtn).toBeVisible({ timeout: 15000 })
    await expect(pivotBtn).toBeVisible({ timeout: 15000 })
  })

  test("should switch to Kanban pipeline mode and render stage columns", async ({
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

    const kanbanBtn = page.locator('button:has-text("KANBAN")')
    await expect(kanbanBtn).toBeVisible({ timeout: 15000 })
    await kanbanBtn.click()

    // Wait for Kanban board to render columns with cards
    await page.waitForLoadState('networkidle', { timeout: 30000 })
    const columns = page.locator(".rounded-xl, .rounded-lg, [data-column], .kanban-column")
    await expect(columns.first()).toBeVisible({ timeout: 20000 })
  })
})
