import { normalizeArabic, type SearchResult } from "@moon/witness"

export type CanonicalSearchResponse = {
  query: string
  normalized_query: string
  total_hits: number
  total_found: number
  results: Array<{
    id: string
    collection: string
    source_type: string
    reference: string
    excerpt: string
    language?: string
    source?: string
    edition?: string
    source_revision?: string
    provenance_id?: number | null
    match_type: "LEXICAL_CANONICAL"
    retrieval_version: "witness-search.v1"
  }>
}

export function normalizeSearchLimit(value: unknown): number {
  const requested = Number(value ?? 5)
  return Number.isFinite(requested)
    ? Math.min(Math.max(Math.trunc(requested), 1), 100)
    : 5
}

export function mapCanonicalSearchResponse(
  query: string,
  canonical: { total: number; results: SearchResult[] }
): CanonicalSearchResponse {
  return {
    query,
    normalized_query: normalizeArabic(query),
    total_hits: canonical.total,
    total_found: canonical.total,
    results: canonical.results.map((hit) => ({
      id: hit.id,
      collection: hit.type.toLowerCase(),
      source_type: hit.type,
      reference: hit.reference,
      excerpt: hit.snippet,
      language: hit.language,
      source: hit.source,
      edition: hit.edition,
      source_revision: hit.sourceRevision,
      provenance_id: hit.provenanceId,
      match_type: "LEXICAL_CANONICAL",
      retrieval_version: "witness-search.v1",
    })),
  }
}
