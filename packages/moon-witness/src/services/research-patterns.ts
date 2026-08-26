export interface ResearchObservation { category: string; sourceFamily?: string; evidence: boolean; disputed?: boolean }
export interface ResearchDistribution { category: string; numerator: number; denominator: number; proportion: number; evidenceCoverage: number; disputed: number }

/** Deterministic, denominator-explicit distribution; disputed observations remain visible. */
export function distribution(observations: ResearchObservation[]): ResearchDistribution[] {
  const groups = new Map<string, ResearchObservation[]>()
  for (const observation of observations) groups.set(observation.category, [...(groups.get(observation.category) ?? []), observation])
  return [...groups.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([category, rows]) => ({ category, numerator: rows.filter((row) => row.evidence).length, denominator: rows.length, proportion: rows.length ? rows.filter((row) => row.evidence).length / rows.length : 0, evidenceCoverage: rows.length ? rows.filter((row) => row.evidence).length / rows.length : 0, disputed: rows.filter((row) => row.disputed).length }))
}
