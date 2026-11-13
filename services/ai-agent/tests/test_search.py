"""
Unit tests for Arabic normalization and semantic passage search.
"""
import asyncio
from src.search import (
    normalize_arabic,
    compute_bm25_similarity,
    compute_hybrid_search,
    compute_concept_heuristic_search,
    set_embedding_provider,
    NullEmbeddingProvider,
)


def test_arabic_normalization():
    # Strip diacritics and standardize alef
    raw = "يَسْأَلُونَكَ عَنِ الْأَهِلَّةِ"
    normalized = normalize_arabic(raw)
    assert "َ" not in normalized  # No fathah
    assert "ْ" not in normalized  # No sukoon
    assert "اهله" in normalized or "الاهله" in normalized


def test_search_hilal_query():
    results = compute_bm25_similarity("hilal bulan sabit")
    assert len(results) >= 1
    # First result should be Al-Baqarah 2:189 or Bukhari rukyah hadith
    assert any(
        "hilal" in r["excerpt"].lower() or "bulan sabit" in r["excerpt"].lower()
        for r in results
    )
    assert results[0]["similarity_score"] > 0.0
    assert results[0]["match_type"] == "LEXICAL_BM25"


def test_search_sun_celestial():
    results = compute_bm25_similarity("matahari dan orbit")
    assert len(results) >= 1
    assert "10:5" in results[0]["id"] or "36:39" in results[0]["id"]
    assert results[0]["match_type"] == "LEXICAL_BM25"


def test_embedding_provider_not_configured():
    """Test that null provider returns empty results without failing silently."""
    # Ensure null provider is set
    set_embedding_provider(NullEmbeddingProvider())
    results = asyncio.run(compute_hybrid_search(query="test query", top_k=5, alpha=0.5))
    assert results["total_hits"] == 0
    assert results["results"] == []


async def _test_concept_heuristic():
    """Test concept heuristic search explicitly labeled."""
    res = await compute_concept_heuristic_search(
        query="waktu hisab perhitungan bulan", top_k=3, alpha=0.6
    )
    assert res["total_hits"] >= 1
    assert res["alpha"] == 0.6
    top = res["results"][0]
    assert top["similarity_score"] > 0.0
    assert top["bm25_score"] >= 0.0
    assert top["dense_score"] >= 0.0
    assert top["match_type"] in [
        "HYBRID_BM25_CONCEPT_HEURISTIC",
        "CONCEPT_HEURISTIC",
        "LEXICAL_BM25",
    ]
    # Verify heuristic metadata
    assert top["embedding_model"] == "concept-heuristic"
    assert top["embedding_version"] == "heuristic-v1"
    assert top["embedding_dim"] == 6


async def _test_concept_celestial():
    """Test celestial concept matching with heuristic."""
    res = await compute_concept_heuristic_search(
        query="celestial cosmology sun moon calculation", top_k=2, alpha=0.3
    )
    assert res["total_hits"] >= 1
    assert res["results"][0]["dense_score"] > 0.0
    assert res["results"][0]["match_type"] in [
        "HYBRID_BM25_CONCEPT_HEURISTIC",
        "CONCEPT_HEURISTIC",
    ]


def test_concept_heuristic_search():
    asyncio.run(_test_concept_heuristic())


def test_concept_celestial_matching():
    asyncio.run(_test_concept_celestial())
