/**
 * Static component health metrics. These are triage signals, not a substitute
 * for review: a domain visualization may legitimately be complex.
 */
export function componentHealth(file, source) {
  if (!/\.tsx$/.test(file) || /\.test\./.test(file)) return []
  const results = []
  for (const match of source.matchAll(/(?:export\s+)?function\s+([A-Z][A-Za-z0-9_]*)\s*(?:<[^>]+>)?\s*\(([^)]*)\)/g)) {
    const name = match[1]
    const start = match.index
    const next = source.slice(start).search(/\n(?:export\s+)?function\s+[A-Z]/)
    const body = source.slice(start, next > 0 ? start + next : source.length)
    const lines = body.split("\n").length
    const props = (match[2].match(/[A-Za-z_$][\w$]*\s*[?:]/g) || []).length
    const conditionals = (body.match(/\?|\bif\b|&&/g) || []).length
    const nested = (body.match(/<([A-Z][A-Za-z0-9_]*)\b/g) || []).length
    const imports = (source.match(/^import\s/gm) || []).length
    const score = Math.max(0, 100 - Math.max(0, lines - 120) * 0.25 - Math.max(0, props - 6) * 3 - Math.max(0, conditionals - 12) * 1.5 - Math.max(0, nested - 12) * 1.25)
    const category = lines > 400 || score < 55 ? "extract-now" : score < 75 ? "review" : "healthy"
    if (category !== "healthy") results.push({ file, component: name, line: source.slice(0, start).split("\n").length, lines, props, conditionals, nested, imports, score: Math.round(score), category })
  }
  return results
}

export function componentHealthRecommendation(item) {
  if (item.category === "extract-now") return "Extract focused children into packages/ui when generic; keep domain/API logic in its owning feature package. Renaming does not resolve duplication."
  return "Review props and conditional branches; extract repeated presentation into a named shared component or data-driven renderer."
}
