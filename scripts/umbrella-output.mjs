import fs from "node:fs"
import path from "node:path"
import { renderUmbrellaStatus } from "./umbrella-render.mjs"

function isWithin(parent, target) {
  const relative = path.relative(parent, target)
  return relative === "" || (!relative.startsWith("..") && !path.isAbsolute(relative))
}

function assertSafeFixTarget(rootDir, targetPath, kind) {
  const resolved = path.resolve(targetPath)
  if (kind === "report") {
    const expected = path.join(rootDir, ".audit", "umbrella-report.json")
    if (resolved !== expected) throw new Error(`--fix-safe report target must be ${path.relative(rootDir, expected)}`)
    return
  }
  if (kind === "status") {
    const runtimeDir = path.join(rootDir, ".audit", "runtime")
    if (!isWithin(runtimeDir, resolved)) throw new Error("--fix-safe status target must remain under .audit/runtime/")
    return
  }
  throw new Error(`Unknown generated output kind: ${kind}`)
}

function writeText(filePath, content) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true })
  fs.writeFileSync(filePath, content)
}

export function writeGeneratedOutputs({
  rootDir,
  report,
  reportPath,
  statusPath,
  writeReport = false,
  writeStatus = false,
  dryRun = false,
  safeFix = false,
}) {
  const serializedReport = `${JSON.stringify(report, null, 2)}\n`
  const serializedMachineState = JSON.parse(serializedReport)
  const renderedStatus = renderUmbrellaStatus(serializedMachineState)
  const plan = []

  if (writeReport) {
    if (safeFix) assertSafeFixTarget(rootDir, reportPath, "report")
    plan.push({ kind: "report", path: path.relative(rootDir, reportPath), bytes: Buffer.byteLength(serializedReport) })
  }
  if (writeStatus) {
    if (safeFix) assertSafeFixTarget(rootDir, statusPath, "status")
    plan.push({ kind: "status", path: path.relative(rootDir, statusPath), bytes: Buffer.byteLength(renderedStatus) })
  }

  if (!dryRun) {
    if (writeReport) writeText(reportPath, serializedReport)
    if (writeStatus) writeText(statusPath, renderedStatus)
  }

  return {
    dry_run: dryRun,
    plan,
    written: dryRun ? [] : plan.map((item) => item.path),
    rendered_status: renderedStatus,
  }
}
