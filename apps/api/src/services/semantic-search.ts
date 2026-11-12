export const EMBEDDING_CONTRACT_VERSION = "moonwitness.embedding.v1"

export interface SemanticPassage {
  id: string
  source_type: string
  reference: string
  arabic?: string
  translation?: string
  keywords?: string[]
  provenance_id?: number | null
  source_revision?: string
}

export interface SemanticSearchHit {
  id: string
  collection: string
  source_type: string
  reference: string
  excerpt: string
  score: number
  match_type: "LEXICAL_BM25" | "SEMANTIC_EMBEDDING" | "HYBRID_FUSION"
  provenance_id?: number | null
  source_revision?: string
  embedding_model?: string
  embedding_version?: string
  embedding_contract_version?: string
  embedding_dim?: number
}

export interface SemanticSearchResult {
  query: string
  normalized_query: string
  total_hits: number
  results: SemanticSearchHit[]
}

export interface HybridSearchHit {
  id: string
  source_type: string
  reference: string
  excerpt: string
  similarity_score: number
  bm25_score: number
  dense_score: number
  match_type: "LEXICAL_BM25" | "SEMANTIC_EMBEDDING" | "HYBRID_FUSION"
  provenance_id?: number | null
  source_revision?: string
  embedding_model?: string
  embedding_version?: string
  embedding_contract_version?: string
  embedding_dim?: number
}

export interface HybridSearchResult {
  query: string
  total_hits: number
  alpha: number
  results: HybridSearchHit[]
}

export interface EmbeddingContract {
  contractVersion: typeof EMBEDDING_CONTRACT_VERSION
  provider: string
  model: string
  modelVersion: string
  dimensions: number
  textNormalizationVersion: string
}

export interface EmbeddingProvider {
  contract: EmbeddingContract
  embed(texts: string[]): Promise<number[][]>
}

export class EmbeddingProviderUnavailableError extends Error {
  readonly statusCode = 503

  constructor(message = "No production embedding provider is configured") {
    super(message)
    this.name = "EmbeddingProviderUnavailableError"
  }
}

export const NullEmbeddingProvider: EmbeddingProvider = {
  contract: {
    contractVersion: EMBEDDING_CONTRACT_VERSION,
    provider: "unconfigured",
    model: "none",
    modelVersion: "none",
    dimensions: 0,
    textNormalizationVersion: "arabic-normalization.v1",
  },
  async embed() {
    throw new EmbeddingProviderUnavailableError()
  },
}

let activeEmbeddingProvider: EmbeddingProvider = NullEmbeddingProvider

export function setEmbeddingProvider(provider: EmbeddingProvider): void {
  if (
    provider.contract.contractVersion !== EMBEDDING_CONTRACT_VERSION ||
    !provider.contract.provider ||
    !provider.contract.model ||
    !provider.contract.modelVersion ||
    !Number.isInteger(provider.contract.dimensions) ||
    provider.contract.dimensions <= 0 ||
    !provider.contract.textNormalizationVersion
  ) {
    throw new Error("Embedding provider does not satisfy the versioned embedding contract")
  }
  activeEmbeddingProvider = provider
}

export function resetEmbeddingProvider(): void {
  activeEmbeddingProvider = NullEmbeddingProvider
}

export function getEmbeddingProvider(): EmbeddingProvider {
  return activeEmbeddingProvider
}

export function normalizeArabic(text: string): string {
  if (!text) return ""
  return text
    .replace(/[\u064B-\u0652\u0670\u0640]/g, "")
    .replace(/[إأآا]/g, "ا")
    .replace(/[يى]/g, "ي")
    .replace(/ة/g, "ه")
    .trim()
}

export function tokenize(text: string): string[] {
  if (!text) return []
  return normalizeArabic(text.toLowerCase())
    .match(/[\p{L}\p{N}]+/gu)
    ?.filter((token) => token.length > 1) ?? []
}

function passageText(passage: SemanticPassage): string {
  return [
    passage.arabic ?? "",
    passage.translation ?? "",
    ...(passage.keywords ?? []),
  ].join(" ")
}

function excerpt(passage: SemanticPassage): string {
  return passage.translation || passage.arabic || ""
}

function toSearchHit(
  passage: SemanticPassage,
  score: number,
  matchType: SemanticSearchHit["match_type"],
  embedding?: EmbeddingContract
): SemanticSearchHit {
  return {
    id: passage.id,
    collection: passage.source_type.toLowerCase(),
    source_type: passage.source_type,
    reference: passage.reference,
    excerpt: excerpt(passage),
    score,
    match_type: matchType,
    provenance_id: passage.provenance_id,
    source_revision: passage.source_revision,
    embedding_model: embedding?.model,
    embedding_version: embedding?.modelVersion,
    embedding_contract_version: embedding?.contractVersion,
    embedding_dim: embedding?.dimensions,
  }
}

export function computeBm25Similarity(
  query: string,
  passages: SemanticPassage[],
  topK = 5
): SemanticSearchResult {
  const queryTerms = new Set(tokenize(query))
  const normalizedQuery = normalizeArabic(query)
  if (queryTerms.size === 0 || passages.length === 0) {
    return {
      query,
      normalized_query: normalizedQuery,
      total_hits: 0,
      results: [],
    }
  }

  const documents = passages.map((passage) => {
    const tokens = tokenize(passageText(passage))
    const frequencies = new Map<string, number>()
    for (const token of tokens) {
      frequencies.set(token, (frequencies.get(token) ?? 0) + 1)
    }
    return { passage, tokens, frequencies }
  })
  const averageLength =
    documents.reduce((total, document) => total + document.tokens.length, 0) /
    documents.length
  const k1 = 1.2
  const b = 0.75
  const scored = documents.flatMap((document) => {
    let score = 0
    for (const term of queryTerms) {
      const frequency = document.frequencies.get(term) ?? 0
      if (frequency === 0) continue
      const documentFrequency = documents.reduce(
        (total, candidate) =>
          total + Number(candidate.frequencies.has(term)),
        0
      )
      const inverseDocumentFrequency = Math.log(
        1 + (documents.length - documentFrequency + 0.5) /
          (documentFrequency + 0.5)
      )
      const lengthNormalization =
        k1 * (1 - b + b * document.tokens.length / averageLength)
      score += inverseDocumentFrequency *
        (frequency * (k1 + 1)) /
        (frequency + lengthNormalization)
    }
    return score > 0 ? [{ passage: document.passage, score }] : []
  })
  scored.sort(
    (left, right) =>
      right.score - left.score || left.passage.id.localeCompare(right.passage.id)
  )

  const results = scored.slice(0, Math.max(0, topK)).map(({ passage, score }) =>
    toSearchHit(passage, score, "LEXICAL_BM25")
  )
  return {
    query,
    normalized_query: normalizedQuery,
    total_hits: results.length,
    results,
  }
}

function validateEmbeddings(
  embeddings: number[][],
  expectedCount: number,
  dimensions: number
): void {
  if (embeddings.length !== expectedCount) {
    throw new Error("Embedding provider returned an unexpected number of vectors")
  }
  if (embeddings.some((vector) =>
    vector.length !== dimensions ||
    vector.some((component) => !Number.isFinite(component))
  )) {
    throw new Error("Embedding provider returned a vector with invalid dimensions or values")
  }
}

function cosineSimilarity(left: number[], right: number[]): number {
  let dotProduct = 0
  let leftNorm = 0
  let rightNorm = 0
  for (let index = 0; index < left.length; index += 1) {
    const leftComponent = left[index] ?? 0
    const rightComponent = right[index] ?? 0
    dotProduct += leftComponent * rightComponent
    leftNorm += leftComponent * leftComponent
    rightNorm += rightComponent * rightComponent
  }
  return leftNorm > 0 && rightNorm > 0
    ? dotProduct / (Math.sqrt(leftNorm) * Math.sqrt(rightNorm))
    : 0
}

export async function computeEmbeddingSimilarity(
  query: string,
  passages: SemanticPassage[],
  topK = 5
): Promise<SemanticSearchResult> {
  const provider = getEmbeddingProvider()
  if (provider === NullEmbeddingProvider) {
    throw new EmbeddingProviderUnavailableError()
  }

  const contract = provider.contract
  if (!query.trim() || passages.length === 0) {
    return {
      query,
      normalized_query: normalizeArabic(query),
      total_hits: 0,
      results: [],
    }
  }
  const vectors = await provider.embed([
    query,
    ...passages.map(passageText),
  ])
  validateEmbeddings(vectors, passages.length + 1, contract.dimensions)
  const queryVector = vectors[0]
  if (!queryVector) throw new Error("Embedding provider omitted the query vector")

  const scored = passages.map((passage, index) => {
    const vector = vectors[index + 1]
    if (!vector) throw new Error("Embedding provider omitted a passage vector")
    return {
      passage,
      score: cosineSimilarity(queryVector, vector),
    }
  })
  scored.sort(
    (left, right) =>
      right.score - left.score || left.passage.id.localeCompare(right.passage.id)
  )

  const results = scored
    .filter(({ score }) => score > 0)
    .slice(0, Math.max(0, topK))
    .map(({ passage, score }) =>
      toSearchHit(passage, score, "SEMANTIC_EMBEDDING", contract)
    )
  return {
    query,
    normalized_query: normalizeArabic(query),
    total_hits: results.length,
    results,
  }
}

export async function computeHybridSearch(
  query: string,
  passages: SemanticPassage[],
  topK = 5,
  alpha = 0.5
): Promise<HybridSearchResult> {
  if (!Number.isFinite(alpha) || alpha < 0 || alpha > 1) {
    throw new Error("Hybrid lexical weight alpha must be between 0 and 1")
  }
  const [lexical, semantic] = await Promise.all([
    computeBm25Similarity(query, passages, topK * 2),
    computeEmbeddingSimilarity(query, passages, topK * 2),
  ])
  const embeddingContract = getEmbeddingProvider().contract
  const lexicalMax = Math.max(0, ...lexical.results.map((hit) => hit.score))
  const hitById = new Map<string, HybridSearchHit>()

  for (const hit of lexical.results) {
    hitById.set(hit.id, {
      id: hit.id,
      source_type: hit.source_type,
      reference: hit.reference,
      excerpt: hit.excerpt,
      similarity_score: 0,
      bm25_score: lexicalMax > 0 ? hit.score / lexicalMax : 0,
      dense_score: 0,
      match_type: "LEXICAL_BM25",
      provenance_id: hit.provenance_id,
      source_revision: hit.source_revision,
    })
  }

  for (const hit of semantic.results) {
    const existing = hitById.get(hit.id)
    const target = existing ?? {
      id: hit.id,
      source_type: hit.source_type,
      reference: hit.reference,
      excerpt: hit.excerpt,
      similarity_score: 0,
      bm25_score: 0,
      dense_score: 0,
      match_type: "SEMANTIC_EMBEDDING" as const,
      provenance_id: hit.provenance_id,
      source_revision: hit.source_revision,
    }
    target.dense_score = hit.score
    target.embedding_model = embeddingContract.model
    target.embedding_version = embeddingContract.modelVersion
    target.embedding_contract_version = embeddingContract.contractVersion
    target.embedding_dim = embeddingContract.dimensions
    hitById.set(hit.id, target)
  }

  const results = Array.from(hitById.values())
  for (const hit of results) {
    const hasLexicalMatch = hit.bm25_score > 0
    const hasEmbeddingMatch = hit.dense_score !== 0
    hit.similarity_score =
      alpha * hit.bm25_score + (1 - alpha) * hit.dense_score
    hit.match_type = hasLexicalMatch && hasEmbeddingMatch
      ? "HYBRID_FUSION"
      : hasEmbeddingMatch
        ? "SEMANTIC_EMBEDDING"
        : "LEXICAL_BM25"
  }

  const matchedResults = results
    .filter((hit) => hit.similarity_score > 0)
    .sort(
      (left, right) =>
        right.similarity_score - left.similarity_score ||
        left.id.localeCompare(right.id)
    )
  return {
    query,
    total_hits: Math.min(matchedResults.length, Math.max(0, topK)),
    alpha,
    results: matchedResults.slice(0, Math.max(0, topK)),
  }
}
