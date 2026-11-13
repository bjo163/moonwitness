"""
Unit tests for Arabic normalization and semantic passage search.
"""
from src.search import normalize_arabic, compute_bm25_similarity


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
    assert any("hilal" in r["excerpt"].lower() or "bulan sabit" in r["excerpt"].lower() for r in results)
    assert results[0]["similarity_score"] > 0.0


def test_search_sun_celestial():
    results = compute_bm25_similarity("matahari dan orbit")
    assert len(results) >= 1
    assert "10:5" in results[0]["id"] or "36:39" in results[0]["id"]


def test_hybrid_search_scoring():
    from src.search import compute_hybrid_search
    res = compute_hybrid_search(query="waktu hisab perhitungan bulan", top_k=3, alpha=0.6)
    assert res["total_hits"] >= 1
    assert res["alpha"] == 0.6
    top = res["results"][0]
    assert top["similarity_score"] > 0.0
    assert top["bm25_score"] >= 0.0
    assert top["dense_score"] >= 0.0
    assert top["match_type"] in ["HYBRID", "SEMANTIC", "LEXICAL"]


def test_hybrid_concept_matching():
    from src.search import compute_hybrid_search
    # Query with celestial concepts
    res = compute_hybrid_search(query="celestial cosmology sun moon calculation", top_k=2, alpha=0.3)
    assert res["total_hits"] >= 1
    assert res["results"][0]["dense_score"] > 0.0

