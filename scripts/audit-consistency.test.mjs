import { describe, expect, it } from "vitest"
import { consistencyFindings } from "./audit-consistency.mjs"

describe("cross-file consistency audit", () => {
  it("detects mixed UI imports and missing button type", () => {
    const findings = consistencyFindings("apps/web/components/example.tsx", `import { Button } from "@workspace/ui"\nimport { Card } from "@workspace/ui/components/card"\nexport function Example() { return <form><button>Save</button></form> }`)
    expect(findings.map((item) => item.category)).toEqual(["ui-import", "button-contract"])
  })

  it("ignores tests and accepts explicit button type", () => {
    expect(consistencyFindings("apps/web/components/example.test.tsx", "<button>Save</button>")).toEqual([])
    expect(consistencyFindings("apps/web/components/example.tsx", "export function Example() { return <button type=\"button\">Save</button> }")).toEqual([])
  })

  it("applies the form button contract to shared UI package sources", () => {
    const findings = consistencyFindings(
      "packages/ui/src/components/example.tsx",
      "export function Example() { return <form><button>Save</button></form> }"
    )
    expect(findings.map((item) => item.category)).toEqual(["button-contract"])
  })

  it("keeps shared UI internals off the public barrel", () => {
    const findings = consistencyFindings(
      "packages/ui/src/components/example.tsx",
      'import { Button } from "@workspace/ui"\nexport function Example() { return <Button /> }'
    )
    expect(findings.map((item) => item.category)).toEqual(["ui-import"])
  })

  it("flags dynamic UI color styles without the resolver", () => {
    const findings = consistencyFindings("apps/web/components/example.tsx", "export function Example() { return <span style={{ color: item.color }}>x</span> }")
    expect(findings.some((item) => item.category === "color-contract")).toBe(true)
  })
})
