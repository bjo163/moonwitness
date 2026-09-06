/** Cross-file consistency checks for UI and component conventions. */
export function consistencyFindings(file, source) {
  const findings = []
  const normalized = file.replaceAll("\\", "/")
  if (!/\.(?:tsx|ts)$/.test(normalized) || /(?:\.test|\.spec)\./.test(normalized)) return findings

  const uiImports = [...source.matchAll(/from\s+["'](@workspace\/ui(?:\/[^"']+)?)["']/g)].map((m) => m[1])
  if (uiImports.includes("@workspace/ui") && uiImports.some((item) => item !== "@workspace/ui")) {
    findings.push({ file, line: 1, category: "ui-import", issue: "Mixed @workspace/ui barrel and subpath imports; use one canonical import style per file" })
  }

  // Dynamic inline colors must be resolved through the shared color contract.
  // Static domain visualization files are reviewed separately by their owner.
  if (source.includes("style={{") && /style=\{\{\s*(?:color|background|backgroundColor|borderColor)\s*:/.test(source)) {
    const hasResolver = /resolveSemanticColor|resolveVisualizationColor/.test(source)
    const domainFile = /(?:chart|seismix|tajweed|celestial|spectrogram|map|waveform)/i.test(normalized)
    if (!hasResolver && !domainFile) {
      findings.push({ file, line: 1, category: "color-contract", issue: "Dynamic inline color bypasses @workspace/ui color resolver" })
    }
  }

  if (/^apps\//.test(normalized) && /<button\b[^>]*>/i.test(source)) {
    for (const match of source.matchAll(/<button\b([^>]*)>/gi)) {
      if (!/\btype\s*=/.test(match[1])) findings.push({ file, line: source.slice(0, match.index).split("\n").length, category: "button-contract", issue: "Button is missing an explicit type (button, submit, or reset)" })
    }
  }

  const base = normalized.split("/").pop()?.replace(/\.(?:tsx|ts)$/, "")
  for (const match of source.matchAll(/(?:export\s+)?function\s+([A-Z][A-Za-z0-9_]*)\s*(?:<[^>]+>)?\s*\(/g)) {
    const component = match[1]
    if (base && base !== "index" && !component.toLowerCase().includes(base.toLowerCase().replace(/[-_]/g, "")) && /(?:components|views)/.test(normalized)) {
      findings.push({ file, line: source.slice(0, match.index).split("\n").length, category: "component-naming", issue: `${component} does not describe file ${base}; use a focused file/name pair or explain the composition root` })
    }
  }
  return findings
}
