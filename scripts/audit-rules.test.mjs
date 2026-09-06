import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import { spawnSync } from "node:child_process"
import { fileURLToPath } from "node:url"
import { describe, expect, it } from "vitest"

const root = resolve(fileURLToPath(new URL(".", import.meta.url)), "..")
const auditor = resolve(root, "scripts", "audit-rules.mjs")

describe("Phase 5 governance auditor", () => {
  it("reports every Phase 5 governance category", () => {
    const result = spawnSync(process.execPath, [auditor], { cwd: root, encoding: "utf8" })
    const output = `${result.stdout}${result.stderr}`
    expect(output).toContain("PHASE 5 GOVERNANCE")
    for (const label of [
      "LEGACY APIs",
      "BANNED ACTIVE TERMINOLOGY",
      "CYBER VARIABLE MISUSE",
      "RAW UI COLORS",
      "DECORATIVE UTILITIES",
      "RESEARCH UI SPECIFICATION",
      "FORCED DARK MODE",
      "ACCESSIBILITY",
      "PACKAGE BOUNDARIES",
      "CANONICAL THEME PARITY",
    ]) expect(output).toContain(label)
  })

  it("documents the implementation/domain exception boundary", () => {
    const source = readFileSync(auditor, "utf8")
    expect(source).toContain("function isDocumentation")
    expect(source).toContain("function isDomainData")
    expect(source).toContain("isActiveImplementation")
  })

  it("includes reusable component composition checks", () => {
    const source = readFileSync(auditor, "utf8")
    expect(source).toContain("componentReuse")
    expect(source).toContain("data-driven reusable component")
  })

  it("includes the shared UI boundary check", () => {
    const source = readFileSync(auditor, "utf8")
    expect(source).toContain("SHARED UI BOUNDARY")
    expect(source).toContain("Use Button from @workspace/ui")
  })
})
