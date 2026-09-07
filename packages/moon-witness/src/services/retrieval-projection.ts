import type { SearchResult } from './retrieval.js'

export function finalizeSearchResults(
  results: SearchResult[],
  offset: number,
  limit: number,
): { total: number; results: SearchResult[] } {
  const unique = [...new Map(results.map((result) => [result.id, result])).values()]
  return { total: unique.length, results: unique.slice(offset, offset + limit) }
}
