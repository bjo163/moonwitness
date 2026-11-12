"""Source-aware lexical, concept-heuristic, and embedding retrieval helpers."""

from typing import Any, Dict, List, Optional, Protocol, TypedDict
import math
import re

EMBEDDING_CONTRACT_VERSION = "moonwitness.embedding.v1"


class Passage(TypedDict, total=False):
    id: str
    source_type: str
    reference: str
    arabic: str
    translation: str
    keywords: List[str]
    provenance_id: Optional[int]
    source_revision: str


class EmbeddingContract(TypedDict):
    contract_version: str
    provider: str
    model: str
    model_version: str
    dimensions: int
    text_normalization_version: str


class EmbeddingProvider(Protocol):
    contract: EmbeddingContract

    async def embed(self, texts: List[str]) -> List[List[float]]:
        ...


class ScoredPassage(TypedDict):
    id: str
    source_type: str
    reference: str
    similarity_score: float
    excerpt: str
    match_type: str
    provenance_id: Optional[int]
    source_revision: Optional[str]
    embedding_model: Optional[str]
    embedding_version: Optional[str]
    embedding_contract_version: Optional[str]
    embedding_dim: Optional[int]


class HybridSearchHit(ScoredPassage):
    bm25_score: float
    dense_score: float


class HybridSearchResult(TypedDict):
    query: str
    total_hits: int
    alpha: float
    results: List[HybridSearchHit]


class ConceptHeuristicHit(TypedDict):
    id: str
    source_type: str
    reference: str
    similarity_score: float
    lexical_score: float
    concept_score: float
    excerpt: str
    match_type: str
    provenance_id: Optional[int]
    source_revision: Optional[str]


class ConceptHeuristicResult(TypedDict):
    query: str
    total_hits: int
    alpha: float
    results: List[ConceptHeuristicHit]


class NullEmbeddingProvider:
    contract: EmbeddingContract = {
        "contract_version": EMBEDDING_CONTRACT_VERSION,
        "provider": "unconfigured",
        "model": "none",
        "model_version": "none",
        "dimensions": 0,
        "text_normalization_version": "arabic-normalization.v1",
    }

    async def embed(self, texts: List[str]) -> List[List[float]]:
        raise RuntimeError("No production embedding provider is configured")


_active_embedding_provider: EmbeddingProvider = NullEmbeddingProvider()


def set_embedding_provider(provider: EmbeddingProvider) -> None:
    contract = provider.contract
    if (
        contract.get("contract_version") != EMBEDDING_CONTRACT_VERSION
        or not contract.get("provider")
        or not contract.get("model")
        or not contract.get("model_version")
        or not isinstance(contract.get("dimensions"), int)
        or contract["dimensions"] <= 0
        or not contract.get("text_normalization_version")
    ):
        raise ValueError("Embedding provider does not satisfy the versioned embedding contract")
    global _active_embedding_provider
    _active_embedding_provider = provider


def reset_embedding_provider() -> None:
    global _active_embedding_provider
    _active_embedding_provider = NullEmbeddingProvider()


def get_embedding_provider() -> EmbeddingProvider:
    return _active_embedding_provider


def normalize_arabic(text: str) -> str:
    text = re.sub(r"[\u064B-\u0652\u0670\u0640]", "", text)
    text = re.sub(r"[إأآا]", "ا", text)
    text = re.sub(r"[يى]", "ي", text)
    text = re.sub(r"ة", "ه", text)
    return text.strip()


def tokenize(text: str) -> List[str]:
    normalized = normalize_arabic(text.lower())
    return [
        token for token in re.findall(r"[\w]+", normalized, flags=re.UNICODE)
        if len(token) > 1
    ]


def _passage_text(passage: Passage) -> str:
    return " ".join(
        [
            passage.get("arabic", ""),
            passage.get("translation", ""),
            *passage.get("keywords", []),
        ]
    )


def _passage_excerpt(passage: Passage) -> str:
    return passage.get("translation") or passage.get("arabic") or ""


def _base_hit(passage: Passage, score: float, match_type: str) -> ScoredPassage:
    return ScoredPassage(
        id=passage["id"],
        source_type=passage["source_type"],
        reference=passage["reference"],
        similarity_score=score,
        excerpt=_passage_excerpt(passage),
        match_type=match_type,
        provenance_id=passage.get("provenance_id"),
        source_revision=passage.get("source_revision"),
        embedding_model=None,
        embedding_version=None,
        embedding_contract_version=None,
        embedding_dim=None,
    )


def compute_bm25_similarity(
    query: str, passages: List[Passage], top_k: int = 5
) -> List[ScoredPassage]:
    query_terms = set(tokenize(query))
    if not query_terms or not passages:
        return []

    documents = [
        (passage, tokenize(_passage_text(passage)))
        for passage in passages
    ]
    average_length = sum(len(tokens) for _, tokens in documents) / len(documents)
    k1 = 1.2
    b = 0.75
    scored: List[ScoredPassage] = []

    for passage, tokens in documents:
        frequencies: Dict[str, int] = {}
        for token in tokens:
            frequencies[token] = frequencies.get(token, 0) + 1
        score = 0.0
        for term in query_terms:
            frequency = frequencies.get(term, 0)
            if not frequency:
                continue
            document_frequency = sum(
                1 for _, candidate_tokens in documents if term in candidate_tokens
            )
            inverse_document_frequency = math.log(
                1 + (len(documents) - document_frequency + 0.5)
                / (document_frequency + 0.5)
            )
            length_normalization = k1 * (
                1 - b + b * len(tokens) / average_length
            )
            score += inverse_document_frequency * (
                frequency * (k1 + 1) / (frequency + length_normalization)
            )
        if score > 0:
            scored.append(_base_hit(passage, score, "LEXICAL_BM25"))

    scored = [hit for hit in scored if hit["similarity_score"] > 0]
    scored.sort(key=lambda hit: (-hit["similarity_score"], hit["id"]))
    return scored[: max(0, top_k)]


def _validate_embeddings(
    embeddings: List[List[float]], expected_count: int, dimensions: int
) -> None:
    if len(embeddings) != expected_count:
        raise ValueError("Embedding provider returned an unexpected number of vectors")
    for vector in embeddings:
        if len(vector) != dimensions or any(not math.isfinite(value) for value in vector):
            raise ValueError("Embedding provider returned a vector with invalid dimensions or values")


def _cosine_similarity(left: List[float], right: List[float]) -> float:
    dot = sum(left_value * right_value for left_value, right_value in zip(left, right))
    left_norm = math.sqrt(sum(value * value for value in left))
    right_norm = math.sqrt(sum(value * value for value in right))
    return dot / (left_norm * right_norm) if left_norm and right_norm else 0.0


async def compute_embedding_similarity(
    query: str,
    passages: List[Passage],
    top_k: int = 5,
    provider: Optional[EmbeddingProvider] = None,
) -> List[ScoredPassage]:
    active_provider = provider or get_embedding_provider()
    contract = active_provider.contract
    if contract["provider"] == "unconfigured" or contract["dimensions"] <= 0:
        raise RuntimeError("No production embedding provider is configured")
    if not query.strip() or not passages:
        return []

    vectors = await active_provider.embed(
        [query, *[_passage_text(passage) for passage in passages]]
    )
    _validate_embeddings(vectors, len(passages) + 1, contract["dimensions"])
    query_vector = vectors[0]
    scored: List[ScoredPassage] = []

    for passage, vector in zip(passages, vectors[1:]):
        hit = _base_hit(
            passage,
            _cosine_similarity(query_vector, vector),
            "SEMANTIC_EMBEDDING",
        )
        hit["embedding_model"] = contract["model"]
        hit["embedding_version"] = contract["model_version"]
        hit["embedding_contract_version"] = contract["contract_version"]
        hit["embedding_dim"] = contract["dimensions"]
        scored.append(hit)

    scored.sort(key=lambda hit: (-hit["similarity_score"], hit["id"]))
    return scored[: max(0, top_k)]


async def compute_hybrid_search(
    query: str,
    passages: List[Passage],
    top_k: int = 5,
    alpha: float = 0.5,
    provider: Optional[EmbeddingProvider] = None,
) -> HybridSearchResult:
    if not math.isfinite(alpha) or not 0 <= alpha <= 1:
        raise ValueError("Hybrid lexical weight alpha must be between 0 and 1")
    active_provider = provider or get_embedding_provider()
    lexical_hits = compute_bm25_similarity(query, passages, top_k * 2)
    semantic_hits = await compute_embedding_similarity(
        query, passages, top_k * 2, active_provider
    )
    maximum_lexical_score = max(
        (hit["similarity_score"] for hit in lexical_hits), default=0.0
    )
    hit_map: Dict[str, HybridSearchHit] = {}

    for hit in lexical_hits:
        hit_map[hit["id"]] = HybridSearchHit(
            **hit,
            bm25_score=(
                hit["similarity_score"] / maximum_lexical_score
                if maximum_lexical_score
                else 0.0
            ),
            dense_score=0.0,
        )

    for hit in semantic_hits:
        existing = hit_map.get(hit["id"])
        if existing is None:
            existing = HybridSearchHit(
                **hit,
                bm25_score=0.0,
                dense_score=0.0,
            )
            hit_map[hit["id"]] = existing
        existing["dense_score"] = hit["similarity_score"]
        existing["embedding_model"] = hit["embedding_model"]
        existing["embedding_version"] = hit["embedding_version"]
        existing["embedding_contract_version"] = hit["embedding_contract_version"]
        existing["embedding_dim"] = hit["embedding_dim"]

    results = list(hit_map.values())
    for hit in results:
        has_lexical = hit["bm25_score"] > 0
        has_embedding = hit["dense_score"] != 0
        hit["similarity_score"] = (
            alpha * hit["bm25_score"] + (1 - alpha) * hit["dense_score"]
        )
        hit["match_type"] = (
            "HYBRID_FUSION" if has_lexical and has_embedding
            else "SEMANTIC_EMBEDDING" if has_embedding
            else "LEXICAL_BM25"
        )

    results = [hit for hit in results if hit["similarity_score"] > 0]
    results.sort(key=lambda hit: (-hit["similarity_score"], hit["id"]))
    selected = results[: max(0, top_k)]
    return {
        "query": query,
        "total_hits": len(selected),
        "alpha": alpha,
        "results": selected,
    }


CONCEPT_VOCABULARY: Dict[str, List[str]] = {
    "LUNAR_CALENDAR": [
        "hilal", "crescent", "bulan", "sabit", "manzilah", "ahillah",
        "orbit", "fase", "urjun", "lunar", "moon",
    ],
    "CELESTIAL_COSMOLOGY": [
        "matahari", "bulan", "bintang", "astronomi", "falak", "shams",
        "qamar", "celestial", "sun", "syams", "kosmos",
    ],
    "FASTING_RAMADHAN": [
        "puasa", "ramadhan", "shaum", "sawm", "iftar", "sahur",
        "syawal", "rukyah", "berpuasa", "fasting",
    ],
    "PRAYER_DEVOTION": [
        "salat", "sholat", "prayer", "qibla", "kiblat", "sujud",
        "ruku", "fajr", "maghrib", "dhuhr", "asr", "isha", "ibadah",
    ],
    "PILGRIMAGE_HAJJ": [
        "haji", "hajj", "umrah", "makkah", "kaaba", "tawaf",
        "arafah", "ihram", "pilgrimage",
    ],
    "TIME_CALCULATION": [
        "waktu", "tahun", "hisab", "perhitungan", "bilangan", "time",
        "calendar", "calculation", "years",
    ],
}


def _concept_vector(tokens: List[str]) -> List[float]:
    token_set = set(tokens)
    vector = [
        float(any(term in token_set for term in vocabulary))
        for vocabulary in CONCEPT_VOCABULARY.values()
    ]
    norm = math.sqrt(sum(component * component for component in vector))
    return [component / norm for component in vector] if norm else vector


def compute_concept_heuristic_search(
    query: str,
    passages: List[Passage],
    top_k: int = 5,
    alpha: float = 0.5,
) -> ConceptHeuristicResult:
    if not math.isfinite(alpha) or not 0 <= alpha <= 1:
        raise ValueError("Concept lexical weight alpha must be between 0 and 1")
    query_tokens = tokenize(query)
    query_vector = _concept_vector(query_tokens)
    lexical_hits = compute_bm25_similarity(query, passages, top_k=len(passages))
    lexical_scores = {
        hit["id"]: hit["similarity_score"] for hit in lexical_hits
    }
    lexical_max = max(lexical_scores.values(), default=0.0)
    lexical_scores = {
        key: value / lexical_max if lexical_max else 0.0
        for key, value in lexical_scores.items()
    }

    scored: List[ConceptHeuristicHit] = []
    for passage in passages:
        passage_vector = _concept_vector(tokenize(_passage_text(passage)))
        concept_score = _cosine_similarity(query_vector, passage_vector)
        lexical_score = lexical_scores.get(passage["id"], 0.0)
        if lexical_score == 0 and concept_score == 0:
            continue
        match_type = (
            "LEXICAL_CONCEPT"
            if lexical_score > 0 and concept_score > 0
            else "CONCEPT_HEURISTIC" if concept_score > 0
            else "LEXICAL_BM25"
        )
        scored.append(ConceptHeuristicHit(
            id=passage["id"],
            source_type=passage["source_type"],
            reference=passage["reference"],
            similarity_score=alpha * lexical_score + (1 - alpha) * concept_score,
            lexical_score=lexical_score,
            concept_score=concept_score,
            excerpt=_passage_excerpt(passage),
            match_type=match_type,
            provenance_id=passage.get("provenance_id"),
            source_revision=passage.get("source_revision"),
        ))

    scored.sort(key=lambda hit: (-hit["similarity_score"], hit["id"]))
    selected = scored[: max(0, top_k)]
    return {
        "query": query,
        "total_hits": len(selected),
        "alpha": alpha,
        "results": selected,
    }
