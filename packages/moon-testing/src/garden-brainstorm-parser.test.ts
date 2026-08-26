import { describe, expect, it } from "vitest"
import {
  formatTasksAsMarkdown,
  normalizeTasks,
  parseTasksFromMarkdown,
  type BrainstormTask,
} from "../../types/src/garden-brainstorm-parser"

function makeTask(index: number, score: number): BrainstormTask {
  return {
    title: `Task ${index}`,
    type: index % 2 === 0 ? "Feature" : "Improvement",
    score,
    goal: `Goal ${index}`,
  }
}

describe("garden brainstorm parser", () => {
  it("parses exactly 10 markdown tasks", () => {
    const markdown = formatTasksAsMarkdown([
      makeTask(1, 90),
      makeTask(2, 89),
      makeTask(3, 88),
      makeTask(4, 87),
      makeTask(5, 86),
      makeTask(6, 85),
      makeTask(7, 84),
      makeTask(8, 83),
      makeTask(9, 82),
      makeTask(10, 81),
    ])

    const parsed = parseTasksFromMarkdown(markdown)
    expect(parsed).not.toBeNull()
    expect(parsed?.length).toBe(10)
    expect(parsed?.[0]?.title).toBe("Task 1")
  })

  it("rejects non-10 task payloads", () => {
    const markdown = formatTasksAsMarkdown([
      makeTask(1, 90),
      makeTask(2, 89),
      makeTask(3, 88),
      makeTask(4, 87),
      makeTask(5, 86),
      makeTask(6, 85),
      makeTask(7, 84),
      makeTask(8, 83),
      makeTask(9, 82),
    ])

    expect(parseTasksFromMarkdown(markdown)).toBeNull()
  })

  it("normalizes score bounds and order", () => {
    const normalized = normalizeTasks([
      makeTask(1, 25),
      makeTask(2, 101),
      makeTask(3, -7),
      makeTask(4, 88),
      makeTask(5, 52),
      makeTask(6, 77),
      makeTask(7, 67),
      makeTask(8, 35),
      makeTask(9, 47),
      makeTask(10, 80),
    ])

    expect(normalized[0]?.score).toBe(99)
    expect(normalized[normalized.length - 1]?.score).toBe(0)
    expect(normalized[0]?.score).toBeGreaterThanOrEqual(normalized[1]?.score || 0)
  })
})
