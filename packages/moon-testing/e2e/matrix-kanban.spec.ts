import { test, expect } from "@playwright/test"

test.describe("Scenario 2: Matrix Workspace & Kanban Pipeline", () => {
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

  test("should navigate to Task Matrix and render Table, Kanban, and Pivot view toggles", async ({
    page,
  }) => {
    await login(page)
    
    // Now go to matrix page
    await page.goto(`${COMMAND_CENTER_URL}/matrix/pj.task`, { waitUntil: 'networkidle', timeout: 60000 })
    
    // Wait for matrix table to be visible
    await expect(page.locator('table, [role="grid"]')).toBeVisible({ timeout: 30000 })

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
    await login(page)
    
    // Now go to matrix page
    await page.goto(`${COMMAND_CENTER_URL}/matrix/pj.task`, { waitUntil: 'networkidle', timeout: 60000 })
    
    // Wait for matrix table to be visible
    await expect(page.locator('table, [role="grid"]')).toBeVisible({ timeout: 30000 })

    const kanbanBtn = page.locator('button:has-text("KANBAN")')
    await expect(kanbanBtn).toBeVisible({ timeout: 15000 })
    await kanbanBtn.click()

    // Wait for Kanban board to render columns with cards
    await page.waitForLoadState('networkidle', { timeout: 30000 })
    const columns = page.locator(".rounded-xl, .rounded-lg, [data-column], .kanban-column")
    await expect(columns.first()).toBeVisible({ timeout: 20000 })
  })
})
