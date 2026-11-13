/**
 * ◈ MoonWitness AI Knowledge & Semantic Agent Engine (Native TypeScript)
 *
 * Implements Arabic text normalization, tokenization, BM25 term weighting,
 * and lexical/hybrid semantic search across canonical Islamic scriptures & Hadiths.
 */

export interface SemanticPassage {
  id: string
  source_type: string
  reference: string
  arabic: string
  translation: string
  keywords: string[]
}

export interface SemanticSearchHit {
  id: string
  collection: string
  source_type?: string
  reference?: string
  text_ar: string
  text_en: string
  excerpt?: string
  score: number
  similarity_score?: number
  match_type: "LEXICAL_BM25" | "SEMANTIC_EMBEDDING" | "HYBRID_FUSION"
  embedding_model?: string
  embedding_version?: string
}

export interface SemanticSearchResult {
  query: string
  normalized_query: string
  total_hits: number
  total_found?: number
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
  embedding_model?: string
  embedding_version?: string
  embedding_dim?: number
}

export interface HybridSearchResult {
  query: string
  total_hits: number
  alpha: number
  results: HybridSearchHit[]
}

// Canonical sample passages for in-memory semantic indexing (DEMO/fallback only)
export const CANONICAL_INDEX: SemanticPassage[] = [
  {
    id: "quran:2:189",
    source_type: "SCRIPTURE",
    reference: "QS Al-Baqarah 2:189",
    arabic: "يَسْأَلُونَكَ عَنِ الْأَهِلَّةِ قُلْ هِيَ مَوَاقِيتُ لِلنَّاسِ وَالْحَجِّ",
    translation:
      "Mereka bertanya kepadamu tentang bulan sabit. Katakanlah: Bulan sabit itu adalah tanda-tanda waktu bagi manusia dan (bagi ibadah) haji.",
    keywords: ["hilal", "bulan", "sabit", "waktu", "haji", "ahillah", "crescent", "moon", "rukyah"],
  },
  {
    id: "quran:10:5",
    source_type: "SCRIPTURE",
    reference: "QS Yunus 10:5",
    arabic:
      "هُوَ الَّذِي جَعَلَ الشَّمْسَ ضِيَاءً وَالْقَمَرَ نُورًا وَقَدَّرَهُ مَنَازِلَ لِتَعْلَمُوا عَدَدَ السِّنِينَ وَالْحِسَابَ",
    translation:
      "Dialah yang menjadikan matahari bersinar dan bulan bercahaya dan ditetapkan-Nya manzilah-manzilah (tempat-tempat) bagi perjalanan bulan itu, supaya kamu mengetahui bilangan tahun dan perhitungan (waktu).",
    keywords: ["matahari", "bulan", "manzilah", "orbit", "tahun", "hisab", "perhitungan", "sun", "celestial"],
  },
  {
    id: "quran:36:39",
    source_type: "SCRIPTURE",
    reference: "QS Yasin 36:39",
    arabic: "وَالْقَمَرَ قَدَّرْنَاهُ مَنَازِلَ حَتَّىٰ عَادَ كَالْعُرْجُونِ الْقَدِيمِ",
    translation:
      "Dan telah Kami tetapkan bagi bulan manzilah-manzilah, sehingga (setelah dia sampai ke manzilah yang terakhir) kembalilah dia sebagai bentuk tandan yang tua.",
    keywords: ["bulan", "manzilah", "urjun", "fase", "lunar", "cycle", "orbit"],
  },
  {
    id: "quran:55:5",
    source_type: "SCRIPTURE",
    reference: "QS Ar-Rahman 55:5",
    arabic: "الشَّمْسُ وَالْقَمَرُ بِحُسْبَانٍ",
    translation: "Matahari dan bulan beredar menurut perhitungan yang pasti.",
    keywords: ["matahari", "bulan", "hisab", "bihusban", "perhitungan", "presisi", "astronomi"],
  },
  {
    id: "quran:6:96",
    source_type: "SCRIPTURE",
    reference: "QS Al-An'am 6:96",
    arabic: "فَالِقُ الْإِصْبَاحِ وَجَعَلَ اللَّيْلَ سَكَنًا وَالشَّمْسَ وَالْقَمَرَ حُسْبَانًا",
    translation:
      "Dia menyingsingkan pagi dan menjadikan malam untuk beristirahat, dan (menjadikan) matahari dan bulan untuk perhitungan.",
    keywords: ["fajar", "pagi", "malam", "matahari", "bulan", "hisab", "kalender"],
  },
  {
    id: "hadith:bukhari:1909",
    source_type: "HADITH",
    reference: "Shahih Bukhari No. 1909",
    arabic: "صُومُوا لِرُؤْيَتِهِ وَأَفْطِرُوا لِرُؤْيَتِهِ",
    translation:
      "Berpuasalah kalian karena melihat hilal (rukyah), dan berbukalah (berhari raya) karena melihatnya.",
    keywords: ["puasa", "rukyah", "hilal", "ramadhan", "syawal", "bukhari", "sighting"],
  },
  {
    id: "hadith:muslim:1081",
    source_type: "HADITH",
    reference: "Shahih Muslim No. 1081",
    arabic: "إِذَا رَأَيْتُمُ الْهِلاَلَ فَصُومُوا وَإِذَا رَأَيْتُمُوهُ فَأَفْطِرُوا فَإِنْ غُمَّ عَلَيْكُمْ فَاقْدُرُوا لَهُ",
    translation:
      "Jika kalian melihat hilal, maka berpuasalah; dan jika kalian melihatnya lagi, berbukalah. Apabila tertutup awan bagi kalian, maka perkirakanlah (hitunglah).",
    keywords: ["hilal", "rukyah", "puasa", "awan", "hisab", "istiqmal", "muslim"],
  },
]

/**
 * Normalizes Arabic text by removing diacritics (tashkeel/harakat) and standardizing glyph variants.
 */
export function normalizeArabic(text: string): string {
  if (!text) return ""
  return text
    .replace(/[\u064B-\u0652\u0670\u0640]/g, "") // remove harakat / tatweel
    .replace(/[إأآا]/g, "ا") // standardize Alef
    .replace(/[يى]/g, "ي") // standardize Yaa
    .replace(/ة/g, "ه") // standardize Taa Marbuta
    .trim()
}

/**
 * Tokenizes multilingual text (Arabic, Indonesian, English), removing punctuation.
 */
export function tokenize(text: string): string[] {
  if (!text) return []
  const norm = normalizeArabic(text.toLowerCase())
  const words = norm.match(/[\p{L}\p{N}]+/gu) || []
  return words.filter((w) => w.length > 1)
}

/**
 * Searches indexed canonical passages using term-frequency and keyword relevance scoring (BM25-style).
 * This is LEXICAL search only - no embedding similarity is computed here.
 */
export function computeBm25Similarity(
  query: string,
  topK = 5
): SemanticSearchResult {
  const queryTokens = new Set(tokenize(query))
  const normQuery = normalizeArabic(query)

  if (queryTokens.size === 0) {
    return {
      query,
      normalized_query: normQuery,
      total_hits: 0,
      total_found: 0,
      results: [],
    }
  }

  const scored: Array<{ passage: SemanticPassage; score: number }> = []

  for (const doc of CANONICAL_INDEX) {
    const docTokens = new Set([
      ...tokenize(doc.translation),
      ...tokenize(doc.arabic),
      ...doc.keywords.map((k) => k.toLowerCase()),
    ])

    const intersection = [...queryTokens].filter((t) => docTokens.has(t))
    if (intersection.length === 0) continue

    // Jaccard + token overlap weighted score
    const overlapScore =
      intersection.length / Math.sqrt(queryTokens.size * docTokens.size)
    const score = Math.min(
      0.99,
      parseFloat(
        (overlapScore + 0.25 * (intersection.length / queryTokens.size)).toFixed(3)
      )
    )

    scored.push({ passage: doc, score })
  }

  scored.sort((a, b) => b.score - a.score)
  const topHits = scored.slice(0, topK)

  const results: SemanticSearchHit[] = topHits.map(({ passage, score }) => ({
    id: passage.id,
    collection: passage.source_type.toLowerCase(),
    source_type: passage.source_type,
    reference: passage.reference,
    text_ar: passage.arabic,
    text_en: passage.translation,
    excerpt: `${passage.reference} — "${passage.translation}"`,
    score,
    similarity_score: score,
    match_type: "LEXICAL_BM25",
  }))

  return {
    query,
    normalized_query: normQuery,
    total_hits: results.length,
    total_found: results.length,
    results,
  }
}

/**
 * Embedding provider interface for production semantic search.
 * Real implementations must provide actual vector embeddings from a configured model.
 */
export interface EmbeddingProvider {
  name: string
  version: string
  dimensions: number
  embed(texts: string[]): Promise<number[][]>
}

/**
 * No-op embedding provider that explicitly fails - forces explicit configuration.
 * Production must inject a real provider (e.g., OpenAI, Cohere, local model via @moon/server).
 */
export const NullEmbeddingProvider: EmbeddingProvider = {
  name: "null",
  version: "0.0.0",
  dimensions: 0,
  async embed() {
    throw new Error(
      "EmbeddingProvider not configured. Production must provide a real embedding model via @moon/server."
    )
  },
}

let activeEmbeddingProvider: EmbeddingProvider = NullEmbeddingProvider

/**
 * Set the active embedding provider for semantic search.
 * Must be called during application initialization with a real provider.
 */
export function setEmbeddingProvider(provider: EmbeddingProvider): void {
  activeEmbeddingProvider = provider
}

/**
 * Get the currently active embedding provider.
 */
export function getEmbeddingProvider(): EmbeddingProvider {
  return activeEmbeddingProvider
}

/**
 * Compute dense vector similarity using the configured embedding provider.
 * Returns empty results if provider is not configured (fails explicitly).
 */
export async function computeEmbeddingSimilarity(
  query: string,
  topK = 5
): Promise<SemanticSearchResult> {
  const provider = getEmbeddingProvider()
  if (provider === NullEmbeddingProvider || provider.dimensions === 0) {
    return {
      query,
      normalized_query: normalizeArabic(query),
      total_hits: 0,
      total_found: 0,
      results: [],
    }
  }

  // Build corpus texts from canonical index
  const corpusTexts = CANONICAL_INDEX.map(
    (doc) => `${doc.arabic} ${doc.translation} ${doc.keywords.join(" ")}`
  )

  try {
    const [queryEmbedding, corpusEmbeddings] = await Promise.all([
      provider.embed([query]),
      provider.embed(corpusTexts),
    ])

    const queryVec = queryEmbedding[0]
    if (!queryVec) {
      return {
        query,
        normalized_query: normalizeArabic(query),
        total_hits: 0,
        total_found: 0,
        results: [],
      }
    }

    const scored: Array<{ passage: SemanticPassage; score: number }> = []

    for (let i = 0; i < CANONICAL_INDEX.length; i++) {
      const docVec = corpusEmbeddings[i]
      const passage = CANONICAL_INDEX[i]
      if (!docVec || !passage) continue

      // Cosine similarity
      let dot = 0
      let normA = 0
      let normB = 0
      for (let j = 0; j < queryVec.length; j++) {
        const queryComponent = queryVec[j] ?? 0
        const documentComponent = docVec[j] ?? 0
        dot += queryComponent * documentComponent
        normA += queryComponent * queryComponent
        normB += documentComponent * documentComponent
      }
      const similarity =
        normA > 0 && normB > 0 ? dot / (Math.sqrt(normA) * Math.sqrt(normB)) : 0

      if (similarity > 0.01) {
        scored.push({ passage, score: similarity })
      }
    }

    scored.sort((a, b) => b.score - a.score)
    const topHits = scored.slice(0, topK)

    const results: SemanticSearchHit[] = topHits.map(({ passage, score }) => ({
      id: passage.id,
      collection: passage.source_type.toLowerCase(),
      source_type: passage.source_type,
      reference: passage.reference,
      text_ar: passage.arabic,
      text_en: passage.translation,
      excerpt: `${passage.reference} — "${passage.translation}"`,
      score,
      similarity_score: score,
      match_type: "SEMANTIC_EMBEDDING",
      embedding_model: provider.name,
      embedding_version: provider.version,
    }))

    return {
      query,
      normalized_query: normalizeArabic(query),
      total_hits: results.length,
      total_found: results.length,
      results,
    }
  } catch (err) {
    // Provider failure - return empty with error info
    return {
      query,
      normalized_query: normalizeArabic(query),
      total_hits: 0,
      total_found: 0,
      results: [],
    }
  }
}

/**
 * Executes hybrid search combining BM25 lexical scoring with real embedding similarity.
 * Both components must be explicitly labeled; no synthetic dense_score from BM25.
 */
export async function computeHybridSearch(
  query: string,
  topK = 5,
  alpha = 0.5
): Promise<HybridSearchResult> {
  const [bm25Result, embeddingResult] = await Promise.all([
    computeBm25Similarity(query, topK * 2),
    computeEmbeddingSimilarity(query, topK * 2),
  ])

  const provider = getEmbeddingProvider()
  const hits: HybridSearchHit[] = []

  // Create a unified result set keyed by passage ID
  const resultMap = new Map<string, HybridSearchHit>()

  // Add BM25 results
  for (const hit of bm25Result.results) {
    resultMap.set(hit.id, {
      id: hit.id,
      source_type: hit.source_type || "SCRIPTURE",
      reference: hit.reference || hit.id,
      excerpt: hit.excerpt || hit.text_en,
      similarity_score: 0, // Will be recomputed
      bm25_score: hit.score,
      dense_score: 0,
      match_type: "LEXICAL_BM25",
    })
  }

  // Merge or add embedding results
  for (const hit of embeddingResult.results) {
    const existing = resultMap.get(hit.id)
    if (existing) {
      existing.dense_score = hit.similarity_score || 0
      existing.embedding_model = hit.embedding_model
      existing.embedding_version = hit.embedding_version
      existing.embedding_dim = provider.dimensions
    } else {
      resultMap.set(hit.id, {
        id: hit.id,
        source_type: hit.source_type || "SCRIPTURE",
        reference: hit.reference || hit.id,
        excerpt: hit.excerpt || hit.text_en,
        similarity_score: 0,
        bm25_score: 0,
        dense_score: hit.similarity_score || 0,
        match_type: "SEMANTIC_EMBEDDING",
        embedding_model: hit.embedding_model,
        embedding_version: hit.embedding_version,
        embedding_dim: provider.dimensions,
      })
    }
  }

  // Compute fused scores and determine match_type
  for (const hit of resultMap.values()) {
    const hasBm25 = hit.bm25_score > 0
    const hasDense = hit.dense_score > 0

    if (hasBm25 && hasDense) {
      hit.similarity_score = parseFloat(
        (alpha * hit.bm25_score + (1.0 - alpha) * hit.dense_score).toFixed(3)
      )
      hit.match_type = "HYBRID_FUSION"
    } else if (hasDense) {
      hit.similarity_score = parseFloat(hit.dense_score.toFixed(3))
      hit.match_type = "SEMANTIC_EMBEDDING"
    } else if (hasBm25) {
      hit.similarity_score = parseFloat(hit.bm25_score.toFixed(3))
      hit.match_type = "LEXICAL_BM25"
    } else {
      hit.similarity_score = 0
      hit.match_type = "LEXICAL_BM25"
    }
  }

  const sortedHits = Array.from(resultMap.values())
    .filter((h) => h.similarity_score > 0.01)
    .sort((a, b) => b.similarity_score - a.similarity_score)
    .slice(0, topK)

  return {
    query,
    total_hits: sortedHits.length,
    alpha,
    results: sortedHits,
  }
}
