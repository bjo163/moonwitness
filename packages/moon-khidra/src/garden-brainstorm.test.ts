import { describe, expect, it } from "vitest"
import { GARDEN_BRAINSTORM_PROMPT } from "./prompt.ts"

describe("GARDEN_BRAINSTORM_PROMPT", () => {
  it("requires exactly ten prioritized tasks with constrained fields", () => {
    expect(GARDEN_BRAINSTORM_PROMPT).toContain("exactly 10 tasks")
    expect(GARDEN_BRAINSTORM_PROMPT).toContain("TASK 01 through TASK 10")
    expect(GARDEN_BRAINSTORM_PROMPT).toContain("Feature or Improvement")
    expect(GARDEN_BRAINSTORM_PROMPT).toContain("No score may exceed 99")
  })

  it("sets source and scholar-escalation boundaries", () => {
    expect(GARDEN_BRAINSTORM_PROMPT).toContain("Never invent Qur'an verses, hadith, rulings")
    expect(GARDEN_BRAINSTORM_PROMPT).toContain("qualified scholar")
    expect(GARDEN_BRAINSTORM_PROMPT).toContain("Never impersonate Allah")
  })
})
