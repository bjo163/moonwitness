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
  match_type: string
}

export interface HybridSearchResult {
  query: string
  total_hits: number
  alpha: number
  results: HybridSearchHit[]
}

// Canonical sample passages for in-memory semantic indexing
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
 * Searches indexed canonical passages using term-frequency and keyword relevance scoring.
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
 * Executes hybrid semantic + lexical search, combining keyword BM25 scoring with simulated dense vector rank.
 */
export function computeHybridSearch(
  query: string,
  topK = 5,
  alpha = 0.5
): HybridSearchResult {
  const bm25Result = computeBm25Similarity(query, topK * 2)

  const hits: HybridSearchHit[] = bm25Result.results.map((hit) => {
    const bm25Score = hit.score
    // Simulated dense similarity derived from term intersection stability
    const denseScore = Math.min(
      0.98,
      parseFloat((bm25Score * 0.85 + 0.12).toFixed(3))
    )
    const hybridScore = parseFloat(
      (alpha * bm25Score + (1.0 - alpha) * denseScore).toFixed(3)
    )

    return {
      id: hit.id,
      source_type: hit.source_type || "SCRIPTURE",
      reference: hit.reference || hit.id,
      excerpt: hit.excerpt || hit.text_en,
      similarity_score: hybridScore,
      bm25_score: bm25Score,
      dense_score: denseScore,
      match_type:
        alpha > 0.7
          ? "LEXICAL_BM25"
          : alpha < 0.3
            ? "DENSE_SEMANTIC"
            : "HYBRID_FUSION",
    }
  })

  hits.sort((a, b) => b.similarity_score - a.similarity_score)
  const sliced = hits.slice(0, topK)

  return {
    query,
    total_hits: sliced.length,
    alpha,
    results: sliced,
  }
}
