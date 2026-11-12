import { describe, expect, it } from "vitest"
import {
  mapCanonicalSearchResponse,
  normalizeSearchLimit,
} from "./canonical-search-response.js"

describe("canonical search API response", () => {
  it("preserves source identity, revision, and provenance", () => {
    const response = mapCanonicalSearchResponse("  Pengasih  ", {
      total: 1,
      results: [
        {
          id: "content:17",
          type: "SCRIPTURE",
          title: "Translation",
          reference: "Q:1:1",
          link: "/scripture/1?ref=Q%3A1%3A1",
          snippet: "Pengasih dan Penyayang",
          language: "id",
          source: "canonical-quran",
          edition: "edition:2",
          sourceRevision: "corpus-r1",
          provenanceId: 41,
        },
      ],
    })

    expect(response.normalized_query).toBe("Pengasih")
    expect(response.total_hits).toBe(1)
    expect(response.total_found).toBe(1)
    expect(response.results[0]).toMatchObject({
      source: "canonical-quran",
      edition: "edition:2",
      source_revision: "corpus-r1",
      provenance_id: 41,
      match_type: "LEXICAL_CANONICAL",
      retrieval_version: "witness-search.v1",
    })
  })

  it("bounds and normalizes requested result counts", () => {
    expect(normalizeSearchLimit(4.9)).toBe(4)
    expect(normalizeSearchLimit(0)).toBe(1)
    expect(normalizeSearchLimit(500)).toBe(100)
    expect(normalizeSearchLimit("not-a-number")).toBe(5)
  })
})
