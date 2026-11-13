/** Cross-file consistency checks for UI and component conventions. */
export function consistencyFindings(file, source) {
  const findings = []
  const normalized = file.replaceAll("\\", "/")
  if (!/\.(?:tsx|ts)$/.test(normalized) || /(?:\.test|\.spec)\./.test(normalized)) return findings

  const uiImports = [...source.matchAll(/from\s+["'](@workspace\/ui(?:\/[^"']+)?)["']/g)].map((m) => m[1])
  const isUiPackageSource = /^packages\/ui\/src\//.test(normalized)
  if (isUiPackageSource && uiImports.includes("@workspace/ui")) {
    findings.push({ file, line: 1, category: "ui-import", issue: "@workspace/ui internals must use relative imports; reserve the public barrel for feature consumers" })
  }
  if (!/\/app\/layout\.tsx$/.test(normalized) && uiImports.includes("@workspace/ui") && uiImports.some((item) => item !== "@workspace/ui")) {
    findings.push({ file, line: 1, category: "ui-import", issue: "Mixed @workspace/ui barrel and subpath imports; use one canonical import style per file" })
  }

  // Dynamic inline colors must be resolved through the shared color contract.
  // Static domain visualization files are reviewed separately by their owner.
  if (source.includes("style={{") && /style=\{\{\s*(?:color|background|backgroundColor|borderColor)\s*:/.test(source)) {
    const hasResolver = /resolveSemanticColor|resolveVisualizationColor/.test(source)
    const domainFile = /(?:chart|seismix|tajweed|celestial|spectrogram|map|waveform|cosmic-3d-background)/i.test(normalized)
    if (!hasResolver && !domainFile) {
      findings.push({ file, line: 1, category: "color-contract", issue: "Dynamic inline color bypasses @workspace/ui color resolver" })
    }
  }

  if (/^(?:apps\/|packages\/ui\/src\/)/.test(normalized) && /<form\b/i.test(source) && /<button\b[^>]*>/i.test(source)) {
    for (const match of source.matchAll(/<button\b([^>]*)>/gi)) {
      const before = source.slice(0, match.index)
      const inForm = before.lastIndexOf("<form") > before.lastIndexOf("</form")
      if (inForm && !/\btype\s*=/.test(match[1])) findings.push({ file, line: source.slice(0, match.index).split("\n").length, category: "button-contract", issue: "Button inside a form is missing an explicit type (button, submit, or reset)" })
    }
  }

  const base = normalized.split("/").pop()?.replace(/\.(?:tsx|ts)$/, "")
  const componentMatches = [...source.matchAll(/(?:export\s+)?function\s+([A-Z][A-Za-z0-9_]*)\s*(?:<[^>]+>)?\s*\(/g)]
  for (const match of componentMatches) {
    const component = match[1]
    const isNumberedCompositionRoot = /^\d{2}[a-z]?-[a-z0-9-]+$/.test(base || "") && /(?:home|section)/i.test(component)
    const isFeatureCompositionRoot = /(?:PortalView|AudioToggle|AudioWaveformVisualizer)$/.test(component)
    if (base && componentMatches.length === 1 && base !== "index" && !isNumberedCompositionRoot && !isFeatureCompositionRoot && !component.toLowerCase().includes(base.toLowerCase().replace(/[-_]/g, "")) && /(?:components|views)/.test(normalized)) {
      findings.push({ file, line: source.slice(0, match.index).split("\n").length, category: "component-naming", issue: `${component} does not describe file ${base}; use a focused file/name pair or explain the composition root` })
    }
  }
  return findings
}
