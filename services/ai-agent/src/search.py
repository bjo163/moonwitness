"""
◈ MoonWitness AI Knowledge Agent — Semantic & Lexical Search Engine
Multilingual text normalization (Arabic, Indonesian, English), BM25 term weighting,
and vector similarity scoring.
"""
from typing import List, Dict, Any, TypedDict
import re
import math


class ScoredPassage(TypedDict):
    id: str
    source_type: str
    reference: str
    similarity_score: float
    excerpt: str


# Canonical sample passages for in-memory semantic indexing
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
        "keywords": ["puasa", "rukyah", "hilal", "ramadhan", "syawal", "bukhari"],
    },
]


def normalize_arabic(text: str) -> str:
    """Normalize Arabic text by stripping diacritics (tashkeel) and standardizing glyphs."""
    # Remove harakat / diacritics
    tashkeel = re.compile(r'[\u064B-\u0652\u0670\u0640]')
    text = tashkeel.sub('', text)
    # Standardize Alef
    text = re.sub(r'[إأآا]', 'ا', text)
    # Standardize Yaa & Alef Maqsura
    text = re.sub(r'[يى]', 'ي', text)
    # Standardize Taa Marbuta & Haa
    text = re.sub(r'ة', 'ه', text)
    return text.strip()


def tokenize(text: str) -> List[str]:
    """Tokenize and lowercase text, stripping punctuation."""
    norm = normalize_arabic(text.lower())
    words = re.findall(r'\b\w+\b', norm)
    return [w for w in words if len(w) > 1]


def compute_bm25_similarity(query: str, top_k: int = 5) -> List[ScoredPassage]:
    """
    Search indexed canonical passages using term-frequency and keyword relevance scoring.
    """
    query_tokens = set(tokenize(query))
    if not query_tokens:
        return []

    scored: List[ScoredPassage] = []

    for doc in CANONICAL_INDEX:
        doc_tokens = set(
            tokenize(doc["translation"]) +
            tokenize(doc["arabic"]) +
            [k.lower() for k in doc.get("keywords", [])]
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
            )
        )

    # Sort descending by similarity score
    scored.sort(key=lambda p: p["similarity_score"], reverse=True)
    return scored[:top_k]


class HybridSearchHit(TypedDict):
    id: str
    source_type: str
    reference: str
    excerpt: str
    similarity_score: float
    bm25_score: float
    dense_score: float
    match_type: str


class HybridSearchResult(TypedDict):
    query: str
    total_hits: int
    alpha: float
    results: List[HybridSearchHit]


# Semantic concept dimensions for dense vector representation
CONCEPT_VOCABULARY: Dict[str, List[str]] = {
    "LUNAR_CALENDAR": ["hilal", "crescent", "bulan", "sabit", "manzilah", "ahillah", "orbit", "fase", "urjun", "lunar", "moon"],
    "CELESTIAL_COSMOLOGY": ["matahari", "bulan", "bintang", "astronomi", "falak", "shams", "qamar", "celestial", "sun", "syams", "kosmos"],
    "FASTING_RAMADHAN": ["puasa", "ramadhan", "shaum", "sawm", "iftar", "sahur", "syawal", "rukyah", "berpuasa", "fasting"],
    "PRAYER_DEVOTION": ["salat", "sholat", "prayer", "qibla", "kiblat", "sujud", "ruku", "fajr", "maghrib", "dhuhr", "asr", "isha", "ibadah"],
    "PILGRIMAGE_HAJJ": ["haji", "hajj", "umrah", "makkah", "kaaba", "tawaf", "arafah", "ihram", "pilgrimage"],
    "TIME_CALCULATION": ["waktu", "tahun", "hisab", "perhitungan", "bilangan", "time", "calendar", "calculation", "years"],
}


def encode_concept_vector(tokens: List[str]) -> List[float]:
    """
    Project text tokens into a dense normalized vector space based on semantic concept dimensions.
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


def compute_hybrid_search(
    query: str,
    top_k: int = 5,
    alpha: float = 0.5,
) -> HybridSearchResult:
    """
    Execute hybrid search fusing BM25 lexical term overlap with dense semantic concept embeddings:
    Score = alpha * BM25 + (1 - alpha) * CosineSimilarity(Dense)
    """
    query_tokens = tokenize(query)
    if not query_tokens:
        return HybridSearchResult(query=query, total_hits=0, alpha=alpha, results=[])

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
            overlap = len(intersection) / math.sqrt(len(query_token_set) * len(doc_token_set))
            bm25_score = min(0.99, round(overlap + 0.25 * (len(intersection) / len(query_token_set)), 3))
        else:
            bm25_score = 0.0

        # 2. Dense Semantic component
        dense_score = round(cosine_similarity(query_vector, doc_vector), 3)

        # 3. Hybrid fusion
        if bm25_score == 0.0 and dense_score == 0.0:
            continue

        fused_score = round(alpha * bm25_score + (1.0 - alpha) * dense_score, 3)

        if bm25_score > 0.0 and dense_score > 0.0:
            match_type = "HYBRID"
        elif dense_score > bm25_score:
            match_type = "SEMANTIC"
        else:
            match_type = "LEXICAL"

        hits.append(
            HybridSearchHit(
                id=doc["id"],
                source_type=doc["source_type"],
                reference=doc["reference"],
                excerpt=doc["translation"],
                similarity_score=fused_score,
                bm25_score=bm25_score,
                dense_score=dense_score,
                match_type=match_type,
            )
        )

    # Sort descending by fused similarity score
    hits.sort(key=lambda h: h["similarity_score"], reverse=True)
    selected_hits = hits[:top_k]

    return HybridSearchResult(
        query=query,
        total_hits=len(selected_hits),
        alpha=alpha,
        results=selected_hits,
    )

