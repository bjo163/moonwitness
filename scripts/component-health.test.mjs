import { describe, expect, it } from "vitest"
import { componentHealth, componentHealthRecommendation } from "./component-health.mjs"

describe("component health", () => {
  it("flags a large component with a measurable score", () => {
    const source = `export function Large({ a, b, c, d, e, f, g }: Props) {\n${"  return <div>{a && b ? c : d}</div>\n".repeat(450)}}`
    const [item] = componentHealth("apps/web/views/example.tsx", source)
    expect(item.category).toBe("extract-now")
    expect(item.lines).toBeGreaterThan(400)
    expect(componentHealthRecommendation(item)).toContain("Renaming does not resolve duplication")
  })

  it("ignores non TSX and healthy components", () => {
    expect(componentHealth("apps/web/views/example.ts", "export function Small() { return null }"))
      .toEqual([])
  })
})
