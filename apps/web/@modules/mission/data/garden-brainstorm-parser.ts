export type TaskType = "Feature" | "Improvement"

export type BrainstormTask = {
  title: string
  type: TaskType
  score: number
  goal: string
}

function toTaskType(value: string): TaskType | null {
  const lowered = value.trim().toLowerCase()
  if (lowered === "feature") return "Feature"
  if (lowered === "improvement") return "Improvement"
  return null
}

function parseTaskBlock(block: string): BrainstormTask | null {
  const titleMatch = block.match(/\*\*Title:\*\*\s*(.+)/i)
  const typeMatch = block.match(/\*\*Type:\*\*\s*(.+)/i)
  const scoreMatch = block.match(
    /\*\*Score:\*\*\s*\**\s*(\d{1,2}|99)\s*\/\s*99\s*\**/i
  )
  const goalMatch = block.match(/\*\*Goal:\*\*\s*(.+)/i)

  if (!titleMatch || !typeMatch || !scoreMatch || !goalMatch) return null

  const type = toTaskType(typeMatch[1] || "")
  const score = Number(scoreMatch[1])
  if (!type || Number.isNaN(score) || score < 0 || score > 99) return null

  return {
    title: titleMatch[1]!.trim(),
    type,
    score,
    goal: goalMatch[1]!.trim(),
  }
}

export function parseTasksFromMarkdown(
  rawText: string
): BrainstormTask[] | null {
  const blocks = rawText
    .split(/###\s*TASK\s*\d{1,2}/i)
    .map((part) => part.trim())
    .filter(Boolean)

  const parsed = blocks
    .map(parseTaskBlock)
    .filter((task): task is BrainstormTask => task !== null)

  if (parsed.length !== 10) return null
  return parsed
}

export function normalizeTasks(tasks: BrainstormTask[]): BrainstormTask[] {
  return [...tasks]
    .map((task) => ({
      ...task,
      score: Math.min(99, Math.max(0, task.score)),
    }))
    .sort((a, b) => b.score - a.score)
}

export function formatTasksAsMarkdown(tasks: BrainstormTask[]): string {
  return tasks
    .map((task, index) => {
      const taskNumber = String(index + 1).padStart(2, "0")
      return [
        `### TASK ${taskNumber}`,
        `**Title:** ${task.title}`,
        `**Type:** ${task.type}`,
        `**Score:** ${task.score}/99`,
        `**Goal:** ${task.goal}`,
      ].join("\n")
    })
    .join("\n\n")
}

export function parseAndNormalizeTasks(rawText: string): string | null {
  const tasks = parseTasksFromMarkdown(rawText)
  if (!tasks) return null
  return formatTasksAsMarkdown(normalizeTasks(tasks))
}
