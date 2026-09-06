// Literal-class regression checks for the migrated public publication surface.
export function researchUiFindings(file, content) {
  if (!/^apps\/web\/components\/(?:hero|home|knowledge)\/.*\.tsx$/.test(file.replaceAll('\\', '/'))) return []
  const findings = []
  const rules = [
    [/^(?:.*:)?text-[4-9]xl$/, 'Use text-2xl or text-3xl page titles'],
    [/^(?:.*:)?uppercase$/, 'Use sentence case'],
    [/^(?:.*:)?tracking-(?:widest|\[.+\])$/, 'Use normal or tight letter spacing'],
    [/^(?:.*:)?(?:backdrop-blur.*|blur-.*|bg-gradient-.*|bg-linear-.*|shadow-(?:sm|md|lg|xl|2xl))$/, 'Remove decorative surface effects'],
    [/^(?:.*:)?(?:py|pb)-(?:16|20|24|28|32)$/, 'Use compact section spacing'],
  ]
  for (const match of content.matchAll(/className\s*=\s*"([^"]*)"/g)) {
    const line = content.slice(0, match.index).split('\n').length
    for (const token of match[1].split(/\s+/)) {
      const rule = rules.find(([pattern]) => pattern.test(token))
      if (rule) findings.push({ file, line, token, fix: rule[1] })
    }
  }
  return findings
}
