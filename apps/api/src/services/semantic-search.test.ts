import { beforeEach, describe, expect, it } from "vitest"
import {
  computeBm25Similarity,
  computeEmbeddingSimilarity,
  computeHybridSearch,
  EMBEDDING_CONTRACT_VERSION,
  resetEmbeddingProvider,
  setEmbeddingProvider,
  type EmbeddingProvider,
  type SemanticPassage,
} from "./semantic-search.js"

const passages: SemanticPassage[] = [
  {
    id: "quran:2:189",
    source_type: "SCRIPTURE",
    reference: "Quran 2:189",
    arabic: "الاهله",
    translation: "They ask about the new moons.",
    keywords: ["hilal", "moon"],
    provenance_id: 41,
    source_revision: "corpus-2026-01",
  },
  {
    id: "hadith:bukhari:1909",
    source_type: "HADITH",
    reference: "Sahih Bukhari 1909",
    arabic: "صوموا لرؤيته",
    translation: "Fast when you see it.",
    keywords: ["fasting", "rukyah"],
    provenance_id: 72,
    source_revision: "corpus-2026-01",
  },
]

const fixtureProvider: EmbeddingProvider = {
  contract: {
    contractVersion: EMBEDDING_CONTRACT_VERSION,
    provider: "test-provider",
    model: "fixture-embedding",
    modelVersion: "fixture-embedding-v1",
    dimensions: 2,
    textNormalizationVersion: "arabic-normalization.v1",
  },
  async embed(texts) {
    return texts.map((text, index) =>
      index === 0 || text.includes("new moons") ? [1, 0] : [0, 1]
    )
  },
}

describe("semantic retrieval scoring", () => {
  beforeEach(() => resetEmbeddingProvider())

  it("ranks canonical lexical candidates with BM25 and provenance", () => {
    const result = computeBm25Similarity("hilal moon", passages)

    expect(result.results.map((hit) => hit.id)).toEqual(["quran:2:189"])
    expect(result.results[0]?.match_type).toBe("LEXICAL_BM25")
    expect(result.results[0]?.provenance_id).toBe(41)
    expect(result.results[0]?.source_revision).toBe("corpus-2026-01")
  })

  it("does not treat an unconfigured provider as an empty successful result", async () => {
    await expect(
      computeEmbeddingSimilarity("moon query", passages)
    ).rejects.toThrow("No production embedding provider is configured")
  })

  it("rejects provider output that violates the embedding dimension contract", async () => {
    setEmbeddingProvider({
      ...fixtureProvider,
      async embed(texts) {
        return texts.map(() => [1])
      },
    })

    await expect(
      computeEmbeddingSimilarity("moon query", passages)
    ).rejects.toThrow("invalid dimensions")
  })

  it("uses actual cosine similarity and reports model contract metadata", async () => {
    setEmbeddingProvider(fixtureProvider)
    const result = await computeEmbeddingSimilarity("moon query", passages)

    expect(result.results[0]?.id).toBe("quran:2:189")
    expect(result.results[0]?.score).toBe(1)
    expect(result.results[0]?.match_type).toBe("SEMANTIC_EMBEDDING")
    expect(result.results[0]?.embedding_model).toBe("fixture-embedding")
    expect(result.results[0]?.embedding_version).toBe("fixture-embedding-v1")
    expect(result.results[0]?.embedding_contract_version).toBe(
      EMBEDDING_CONTRACT_VERSION
    )
    expect(result.results[0]?.embedding_dim).toBe(2)
  })

  it("reproduces hybrid ranking and preserves source provenance", async () => {
    setEmbeddingProvider(fixtureProvider)
    const first = await computeHybridSearch("hilal moon", passages, 2, 0.5)
    const second = await computeHybridSearch("hilal moon", passages, 2, 0.5)

    expect(first).toEqual(second)
    expect(first.results[0]?.id).toBe("quran:2:189")
    expect(first.results[0]?.match_type).toBe("HYBRID_FUSION")
    expect(first.results[0]?.provenance_id).toBe(41)
    expect(first.results[0]?.embedding_version).toBe("fixture-embedding-v1")
  })
})
