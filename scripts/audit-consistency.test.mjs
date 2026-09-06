import { describe, expect, it } from "vitest"
import { consistencyFindings } from "./audit-consistency.mjs"

describe("cross-file consistency audit", () => {
  it("detects mixed UI imports and missing button type", () => {
    const findings = consistencyFindings("apps/web/components/example.tsx", `import { Button } from "@workspace/ui"\nimport { Card } from "@workspace/ui/components/card"\nexport function Example() { return <button>Save</button> }`)
    expect(findings.map((item) => item.category)).toEqual(["ui-import", "button-contract"])
  })

  it("ignores tests and accepts explicit button type", () => {
    expect(consistencyFindings("apps/web/components/example.test.tsx", "<button>Save</button>")).toEqual([])
    expect(consistencyFindings("apps/web/components/example.tsx", "export function Example() { return <button type=\"button\">Save</button> }")).toEqual([])
  })
})
