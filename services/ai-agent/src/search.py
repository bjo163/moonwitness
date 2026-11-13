"""
◈ MoonWitness AI Knowledge Agent — Semantic & Lexical Search Engine
Multilingual text normalization (Arabic, Indonesian, English), BM25 term weighting,
and vector similarity scoring.
"""
from typing import List, Dict, Any, TypedDict, Optional, Protocol
import re
import math
import asyncio


class ScoredPassage(TypedDict):
    id: str
    source_type: str
    reference: str
    similarity_score: float
    excerpt: str
    match_type: str


# Canonical sample passages for in-memory semantic indexing (DEMO/fallback only)
CANONICAL_INDEX: List[Dict[str, Any]] = [
    {
        "id": "quran:2:189",
        "source_type": "SCRIPTURE",
        "reference": "QS Al-Baqarah 2:189",
        "arabic": "يَسْأَلُونَكَ عَنِ الْأَهِلَّةِ قُلْ هِيَ مَوَاقِيتُ لِلنَّاسِ وَالْحَجِّ",
        "translation": "Mereka bertanya kepadamu tentang bulan sabit. Katakanlah: Bulan sabit itu adalah tanda-tanda waktu bagi manusia dan (bagi ibadah) haji.",
        "keywords": ["hilal", "bulan", "sabit", "waktu", "haji", "ahillah", "crescent", "moon"],
    },
    {
        "id": "quran:10:5",
        "source_type": "SCRIPTURE",
        "reference": "QS Yunus 10:5",
        "arabic": "هُوَ الَّذِي جَعَلَ الشَّمْسَ ضِيَاءً وَالْقَمَرَ نُورًا وَقَدَّرَهُ مَنَازِلَ لِتَعْلَمُوا عَدَدَ السِّنِينَ وَالْحِسَابَ",
        "translation": "Dialah yang menjadikan matahari bersinar dan bulan bercahaya dan ditetapkan-Nya manzilah-manzilah (tempat-tempat) bagi perjalanan bulan itu, supaya kamu mengetahui bilangan tahun dan perhitungan (waktu).",
        "keywords": ["matahari", "bulan", "manzilah", "orbit", "tahun", "hisab", "perhitungan", "sun", "celestial"],
    },
    {
        "id": "quran:36:39",
        "source_type": "SCRIPTURE",
        "reference": "QS Yasin 36:39",
        "arabic": "وَالْقَمَرَ قَدَّرْنَاهُ مَنَازِلَ حَتَّىٰ عَادَ كَالْعُرْجُونِ الْقَدِيمِ",
        "translation": "Dan telah Kami tetapkan bagi bulan manzilah-manzilah, sehingga (setelah dia sampai ke manzilah yang terakhir) kembalilah dia sebagai bentuk tandan yang tua.",
        "keywords": ["bulan", "manzilah", "urjun", "fase", "lunar", "cycle"],
    },
    {
        "id": "hadith:bukhari:1909",
        "source_type": "HADITH",
        "reference": "Shahih Bukhari No. 1909",
        "arabic": "صُومُوا لِرُؤْيَتِهِ وَأَفْطِرُوا لِرُؤْيَتِهِ",
        "translation": "Berpuasalah kalian karena melihat hilal (rukyah), dan berbukalah (berhari raya) karena melihatnya.",
        "keywords": ["puasa", "ramadhan", "shaum", "sawm", "iftar", "sahur", "syawal", "rukyah", "berpuasa", "fasting"],
    },
]


def normalize_arabic(text: str) -> str:
    """Normalize Arabic text by stripping diacritics (tashkeel) and standardizing glyphs."""
    # Remove harakat / diacritics
    tashkeel = re.compile(r"[\u064B-\u0652\u0670\u0640]")
    text = tashkeel.sub("", text)
    # Standardize Alef
    text = re.sub(r"[إأآا]", "ا", text)
    # Standardize Yaa & Alef Maqsura
    text = re.sub(r"[يى]", "ي", text)
    # Standardize Taa Marbuta & Haa
    text = re.sub(r"ة", "ه", text)
    return text.strip()


def tokenize(text: str) -> List[str]:
    """Tokenize and lowercase text, stripping punctuation."""
    norm = normalize_arabic(text.lower())
    words = re.findall(r"\b\w+\b", norm)
    return [w for w in words if len(w) > 1]


def compute_bm25_similarity(query: str, top_k: int = 5) -> List[ScoredPassage]:
    """
    Search indexed canonical passages using term-frequency and keyword relevance scoring.
    This is LEXICAL search only - no embedding similarity is computed here.
    """
    query_tokens = set(tokenize(query))
    if not query_tokens:
        return []

    scored: List[ScoredPassage] = []

    for doc in CANONICAL_INDEX:
        doc_tokens = set(
            tokenize(doc["translation"])
            + tokenize(doc["arabic"])
            + [k.lower() for k in doc.get("keywords", [])]
        )

        intersection = query_tokens.intersection(doc_tokens)
        if not intersection:
            continue

        # Jaccard + token overlap weighted score
        overlap_score = len(intersection) / math.sqrt(len(query_tokens) * len(doc_tokens))
        score = min(0.99, round(overlap_score + 0.25 * (len(intersection) / len(query_tokens)), 3))

        scored.append(
            ScoredPassage(
                id=doc["id"],
                source_type=doc["source_type"],
                reference=doc["reference"],
                similarity_score=score,
                excerpt=doc["translation"],
                match_type="LEXICAL_BM25",
            )
        )

    # Sort descending by similarity score
    scored.sort(key=lambda p: p["similarity_score"], reverse=True)
    return scored[:top_k]


class EmbeddingProvider(Protocol):
    """Embedding provider interface for production semantic search."""
    name: str
    version: str
    dimensions: int

    async def embed(self, texts: List[str]) -> List[List[float]]:
        ...


class NullEmbeddingProvider:
    """No-op embedding provider that explicitly fails - forces explicit configuration."""
    name = "null"
    version = "0.0.0"
    dimensions = 0

    async def embed(self, texts: List[str]) -> List[List[float]]:
        raise RuntimeError(
            "EmbeddingProvider not configured. Production must provide a real embedding model."
        )


_active_embedding_provider: EmbeddingProvider = NullEmbeddingProvider()


def set_embedding_provider(provider: EmbeddingProvider) -> None:
    """Set the active embedding provider for semantic search."""
    global _active_embedding_provider
    _active_embedding_provider = provider


def get_embedding_provider() -> EmbeddingProvider:
    """Get the currently active embedding provider."""
    return _active_embedding_provider


async def compute_embedding_similarity(
    query: str, top_k: int = 5
) -> List[ScoredPassage]:
    """
    Compute dense vector similarity using the configured embedding provider.
    Returns empty results if provider is not configured (fails explicitly).
    """
    provider = get_embedding_provider()
    if provider.dimensions == 0:
        return []

    # Build corpus texts from canonical index
    corpus_texts = [
        f"{doc['arabic']} {doc['translation']} {' '.join(doc.get('keywords', []))}"
        for doc in CANONICAL_INDEX
    ]

    try:
        [query_embedding], corpus_embeddings = await asyncio.gather(
            provider.embed([query]),
            provider.embed(corpus_texts),
        )

        if not query_embedding:
            return []

        scored: List[ScoredPassage] = []

        for i, doc_vec in enumerate(corpus_embeddings):
            if not doc_vec:
                continue

            # Cosine similarity
            dot = sum(a * b for a, b in zip(query_embedding, doc_vec))
            norm_a = math.sqrt(sum(a * a for a in query_embedding))
            norm_b = math.sqrt(sum(b * b for b in doc_vec))
            similarity = dot / (norm_a * norm_b) if norm_a > 0 and norm_b > 0 else 0.0

            if similarity > 0.01:
                scored.append(
                    ScoredPassage(
                        id=CANONICAL_INDEX[i]["id"],
                        source_type=CANONICAL_INDEX[i]["source_type"],
                        reference=CANONICAL_INDEX[i]["reference"],
                        similarity_score=round(similarity, 3),
                        excerpt=CANONICAL_INDEX[i]["translation"],
                        match_type="SEMANTIC_EMBEDDING",
                    )
                )

        scored.sort(key=lambda p: p["similarity_score"], reverse=True)
        return scored[:top_k]

    except Exception:
        # Provider failure - return empty
        return []


class HybridSearchHit(TypedDict):
    id: str
    source_type: str
    reference: str
    excerpt: str
    similarity_score: float
    bm25_score: float
    dense_score: float
    match_type: str
    embedding_model: Optional[str]
    embedding_version: Optional[str]
    embedding_dim: Optional[int]


class HybridSearchResult(TypedDict):
    query: str
    total_hits: int
    alpha: float
    results: List[HybridSearchHit]


async def compute_hybrid_search(
    query: str,
    top_k: int = 5,
    alpha: float = 0.5,
) -> HybridSearchResult:
    """
    Execute hybrid search fusing BM25 lexical term overlap with dense semantic embeddings:
    Score = alpha * BM25 + (1 - alpha) * CosineSimilarity(Dense)
    Both components must be explicitly labeled; no synthetic dense_score from BM25.
    """
    bm25_results = compute_bm25_similarity(query, top_k * 2)
    embedding_results = await compute_embedding_similarity(query, top_k * 2)

    provider = get_embedding_provider()
    hits: List[HybridSearchHit] = []

    # Create a unified result set keyed by passage ID
    result_map: Dict[str, HybridSearchHit] = {}

    # Add BM25 results
    for hit in bm25_results:
        result_map[hit["id"]] = HybridSearchHit(
            id=hit["id"],
            source_type=hit["source_type"],
            reference=hit["reference"],
            excerpt=hit["excerpt"],
            similarity_score=0.0,
            bm25_score=hit["similarity_score"],
            dense_score=0.0,
            match_type="LEXICAL_BM25",
            embedding_model=None,
            embedding_version=None,
            embedding_dim=None,
        )

    # Merge or add embedding results
    for hit in embedding_results:
        existing = result_map.get(hit["id"])
        if existing:
            existing["dense_score"] = hit["similarity_score"]
            existing["embedding_model"] = provider.name
            existing["embedding_version"] = provider.version
            existing["embedding_dim"] = provider.dimensions
        else:
            result_map[hit["id"]] = HybridSearchHit(
                id=hit["id"],
                source_type=hit["source_type"],
                reference=hit["reference"],
                excerpt=hit["excerpt"],
                similarity_score=0.0,
                bm25_score=0.0,
                dense_score=hit["similarity_score"],
                match_type="SEMANTIC_EMBEDDING",
                embedding_model=provider.name,
                embedding_version=provider.version,
                embedding_dim=provider.dimensions,
            )

    # Compute fused scores and determine match_type
    for hit in result_map.values():
        has_bm25 = hit["bm25_score"] > 0
        has_dense = hit["dense_score"] > 0

        if has_bm25 and has_dense:
            hit["similarity_score"] = round(
                alpha * hit["bm25_score"] + (1.0 - alpha) * hit["dense_score"], 3
            )
            hit["match_type"] = "HYBRID_FUSION"
        elif has_dense:
            hit["similarity_score"] = round(hit["dense_score"], 3)
            hit["match_type"] = "SEMANTIC_EMBEDDING"
        elif has_bm25:
            hit["similarity_score"] = round(hit["bm25_score"], 3)
            hit["match_type"] = "LEXICAL_BM25"
        else:
            hit["similarity_score"] = 0.0
            hit["match_type"] = "LEXICAL_BM25"

    sorted_hits = [
        h for h in result_map.values() if h["similarity_score"] > 0.01
    ]
    sorted_hits.sort(key=lambda h: h["similarity_score"], reverse=True)
    selected_hits = sorted_hits[:top_k]

    return HybridSearchResult(
        query=query,
        total_hits=len(selected_hits),
        alpha=alpha,
        results=selected_hits,
    )


# Semantic concept dimensions for dense vector representation (DEMO/heuristic only)
CONCEPT_VOCABULARY: Dict[str, List[str]] = {
    "LUNAR_CALENDAR": [
        "hilal",
        "crescent",
        "bulan",
        "sabit",
        "manzilah",
        "ahillah",
        "orbit",
        "fase",
        "urjun",
        "lunar",
        "moon",
    ],
    "CELESTIAL_COSMOLOGY": [
        "matahari",
        "bulan",
        "bintang",
        "astronomi",
        "falak",
        "shams",
        "qamar",
        "celestial",
        "sun",
        "syams",
        "kosmos",
    ],
    "FASTING_RAMADHAN": [
        "puasa",
        "ramadhan",
        "shaum",
        "sawm",
        "iftar",
        "sahur",
        "syawal",
        "rukyah",
        "berpuasa",
        "fasting",
    ],
    "PRAYER_DEVOTION": [
        "salat",
        "sholat",
        "prayer",
        "qibla",
        "kiblat",
        "sujud",
        "ruku",
        "fajr",
        "maghrib",
        "dhuhr",
        "asr",
        "isha",
        "ibadah",
    ],
    "PILGRIMAGE_HAJJ": [
        "haji",
        "hajj",
        "umrah",
        "makkah",
        "kaaba",
        "tawaf",
        "arafah",
        "ihram",
        "pilgrimage",
    ],
    "TIME_CALCULATION": [
        "waktu",
        "tahun",
        "hisab",
        "perhitungan",
        "bilangan",
        "time",
        "calendar",
        "calculation",
        "years",
    ],
}


def encode_concept_vector(tokens: List[str]) -> List[float]:
    """
    Project text tokens into a dense normalized vector space based on semantic concept dimensions.
    HEURISTIC ONLY - not a real embedding model. Explicitly labeled as CONCEPT_HEURISTIC.
    """
    token_set = set(tokens)
    vector: List[float] = []

    for _, keywords in CONCEPT_VOCABULARY.items():
        overlap = len(token_set.intersection(set(keywords)))
        vector.append(float(overlap))

    # Calculate L2 norm
    norm = math.sqrt(sum(x * x for x in vector))
    if norm > 0.0:
        return [round(x / norm, 4) for x in vector]
    return [0.0] * len(CONCEPT_VOCABULARY)


def cosine_similarity(v1: List[float], v2: List[float]) -> float:
    """Compute cosine similarity between two unit vectors."""
    dot = sum(a * b for a, b in zip(v1, v2))
    return max(0.0, min(1.0, dot))


async def compute_concept_heuristic_search(
    query: str,
    top_k: int = 5,
    alpha: float = 0.5,
) -> HybridSearchResult:
    """
    Execute search using BM25 + CONCEPT_HEURISTIC (not real embeddings).
    Explicitly labeled as heuristic - never claim production RAG readiness.
    """
    query_tokens = tokenize(query)
    if not query_tokens:
        return HybridSearchResult(
            query=query, total_hits=0, alpha=alpha, results=[]
        )

    query_vector = encode_concept_vector(query_tokens)
    query_token_set = set(query_tokens)

    hits: List[HybridSearchHit] = []

    for doc in CANONICAL_INDEX:
        doc_tokens = (
            tokenize(doc["translation"])
            + tokenize(doc["arabic"])
            + [k.lower() for k in doc.get("keywords", [])]
        )
        doc_token_set = set(doc_tokens)
        doc_vector = encode_concept_vector(doc_tokens)

        # 1. Lexical BM25 component
        intersection = query_token_set.intersection(doc_token_set)
        if intersection:
            overlap = len(intersection) / math.sqrt(
                len(query_token_set) * len(doc_token_set)
            )
            bm25_score = min(
                0.99, round(overlap + 0.25 * (len(intersection) / len(query_token_set)), 3)
            )
        else:
            bm25_score = 0.0

        # 2. Concept heuristic component (NOT real embeddings)
        concept_score = round(cosine_similarity(query_vector, doc_vector), 3)

        # 3. Hybrid fusion
        if bm25_score == 0.0 and concept_score == 0.0:
            continue

        fused_score = round(alpha * bm25_score + (1.0 - alpha) * concept_score, 3)

        if bm25_score > 0.0 and concept_score > 0.0:
            match_type = "HYBRID_BM25_CONCEPT_HEURISTIC"
        elif concept_score > bm25_score:
            match_type = "CONCEPT_HEURISTIC"
        else:
            match_type = "LEXICAL_BM25"

        hits.append(
            HybridSearchHit(
                id=doc["id"],
                source_type=doc["source_type"],
                reference=doc["reference"],
                excerpt=doc["translation"],
                similarity_score=fused_score,
                bm25_score=bm25_score,
                dense_score=concept_score,
                match_type=match_type,
                embedding_model="concept-heuristic",
                embedding_version="heuristic-v1",
                embedding_dim=len(CONCEPT_VOCABULARY),
            )
        )

    hits.sort(key=lambda h: h["similarity_score"], reverse=True)
    selected_hits = hits[:top_k]

    return HybridSearchResult(
        query=query,
        total_hits=len(selected_hits),
        alpha=alpha,
        results=selected_hits,
    )
