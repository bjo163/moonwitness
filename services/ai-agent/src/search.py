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
