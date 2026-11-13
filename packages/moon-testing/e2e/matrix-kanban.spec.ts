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

    // Verify 3 view toggles are visible
    const tableBtn = page.locator('button:has-text("TABLE")')
    const kanbanBtn = page.locator('button:has-text("KANBAN")')
    const pivotBtn = page.locator('button:has-text("PIVOT")')

    await expect(tableBtn).toBeVisible()
    await expect(kanbanBtn).toBeVisible()
    await expect(pivotBtn).toBeVisible()
  })

  test("should switch to Kanban pipeline mode and render stage columns", async ({
    page,
  }) => {
    test.skip(
      !authenticated,
      "Authenticated matrix flow requires PLAYWRIGHT_ADMIN_EMAIL/PASSWORD"
    )
    await page.goto(`${COMMAND_CENTER_URL}/matrix/pj.task`)

    const kanbanBtn = page.locator('button:has-text("KANBAN")')
    await kanbanBtn.click()

    // Expect columns with cards
    const columns = page.locator(".rounded-xl, .rounded-lg")
    await expect(columns.first()).toBeVisible()
  })
})
