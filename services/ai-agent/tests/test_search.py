import asyncio

import pytest

from src.search import (
    EMBEDDING_CONTRACT_VERSION,
    compute_bm25_similarity,
    compute_concept_heuristic_search,
    compute_embedding_similarity,
    compute_hybrid_search,
    normalize_arabic,
)


PASSAGES = [
    {
        "id": "quran:2:189",
        "source_type": "SCRIPTURE",
        "reference": "Quran 2:189",
        "arabic": "يَسْأَلُونَكَ عَنِ الْأَهِلَّةِ",
        "translation": "They ask about the new moons.",
        "keywords": ["hilal", "moon"],
        "provenance_id": 41,
        "source_revision": "corpus-2026-01",
    },
    {
        "id": "hadith:bukhari:1909",
        "source_type": "HADITH",
        "reference": "Sahih Bukhari 1909",
        "arabic": "صُومُوا لِرُؤْيَتِهِ",
        "translation": "Fast when you see it.",
        "keywords": ["fasting", "rukyah"],
        "provenance_id": 72,
        "source_revision": "corpus-2026-01",
    },
]


class FixtureEmbeddingProvider:
    contract = {
        "contract_version": EMBEDDING_CONTRACT_VERSION,
        "provider": "test-provider",
        "model": "fixture-embedding",
        "model_version": "fixture-embedding-v1",
        "dimensions": 2,
        "text_normalization_version": "arabic-normalization.v1",
    }

    async def embed(self, texts):
        return [
            [1.0, 0.0] if index == 0 or "new moons" in text else [0.0, 1.0]
            for index, text in enumerate(texts)
        ]


class InvalidDimensionProvider(FixtureEmbeddingProvider):
    async def embed(self, texts):
        return [[1.0] for _ in texts]


def test_arabic_normalization_removes_diacritics_and_standardizes_letters():
    normalized = normalize_arabic("يَسْأَلُونَكَ عَنِ الْأَهِلَّةِ")
    assert "َ" not in normalized
    assert "ْ" not in normalized
    assert "اهله" in normalized or "الاهله" in normalized


def test_bm25_lexical_ranking_is_deterministic_and_source_aware():
    results = compute_bm25_similarity("hilal moon", PASSAGES)

    assert [result["id"] for result in results] == ["quran:2:189"]
    assert results[0]["match_type"] == "LEXICAL_BM25"
    assert results[0]["provenance_id"] == 41
    assert results[0]["source_revision"] == "corpus-2026-01"


def test_embedding_similarity_reports_model_contract_and_cosine():
    results = asyncio.run(compute_embedding_similarity(
        "moon query",
        PASSAGES,
        provider=FixtureEmbeddingProvider(),
    ))

    assert results[0]["id"] == "quran:2:189"
    assert results[0]["similarity_score"] == 1.0
    assert results[0]["match_type"] == "SEMANTIC_EMBEDDING"
    assert results[0]["embedding_model"] == "fixture-embedding"
    assert results[0]["embedding_version"] == "fixture-embedding-v1"
    assert results[0]["embedding_contract_version"] == EMBEDDING_CONTRACT_VERSION
    assert results[0]["embedding_dim"] == 2


def test_embedding_provider_dimension_mismatch_fails_explicitly():
    with pytest.raises(ValueError, match="invalid dimensions"):
        asyncio.run(compute_embedding_similarity(
            "moon query",
            PASSAGES,
            provider=InvalidDimensionProvider(),
        ))


def test_unconfigured_embedding_provider_does_not_return_empty_success():
    with pytest.raises(RuntimeError, match="No production embedding provider"):
        asyncio.run(compute_hybrid_search("moon query", PASSAGES))


def test_hybrid_ranking_is_reproducible_and_preserves_provenance():
    first = asyncio.run(compute_hybrid_search(
        "moon query",
        PASSAGES,
        top_k=2,
        alpha=0.5,
        provider=FixtureEmbeddingProvider(),
    ))
    second = asyncio.run(compute_hybrid_search(
        "moon query",
        PASSAGES,
        top_k=2,
        alpha=0.5,
        provider=FixtureEmbeddingProvider(),
    ))

    assert first == second
    assert first["results"][0]["id"] == "quran:2:189"
    assert first["results"][0]["match_type"] == "HYBRID_FUSION"
    assert first["results"][0]["provenance_id"] == 41
    assert first["results"][0]["embedding_version"] == "fixture-embedding-v1"


def test_concept_heuristic_is_not_reported_as_an_embedding():
    result = compute_concept_heuristic_search(
        "moon crescent lunar",
        PASSAGES,
        top_k=2,
    )

    assert result["total_hits"] > 0
    assert result["results"][0]["concept_score"] > 0
    assert "dense_score" not in result["results"][0]
    assert result["results"][0]["match_type"] in {
        "LEXICAL_CONCEPT",
        "CONCEPT_HEURISTIC",
        "LEXICAL_BM25",
    }
