"""FastAPI bridge to canonical Witness retrieval."""

import asyncio
import json
import os
from typing import List, Optional
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field

app = FastAPI(
    title="MoonWitness AI Knowledge Agent",
    description="Source-backed retrieval bridge to the canonical Witness API",
    version="0.2.0",
)


class HealthResponse(BaseModel):
    status: str
    service: str = "ai-agent"
    version: str = "0.2.0"
    retrieval_source: str
    vector_index: str = "not_configured"


class SemanticQueryRequest(BaseModel):
    query: str = Field(..., min_length=1)
    top_k: int = Field(5, ge=1, le=100)


class PassageResult(BaseModel):
    id: str
    collection: str
    source_type: str
    reference: str
    excerpt: str
    language: Optional[str] = None
    source: Optional[str] = None
    edition: Optional[str] = None
    provenance_id: Optional[int] = None
    match_type: str
    retrieval_version: str


class SemanticSearchResponse(BaseModel):
    query: str
    normalized_query: str
    total_hits: int
    total_found: int
    results: List[PassageResult]


class HybridQueryRequest(BaseModel):
    query: str = Field(..., min_length=1)
    top_k: int = Field(5, ge=1, le=100)
    alpha: float = Field(0.5, ge=0.0, le=1.0)


class HybridHitModel(BaseModel):
    id: str
    source_type: str
    reference: str
    excerpt: str
    similarity_score: float
    bm25_score: float
    dense_score: float
    match_type: str
    provenance_id: Optional[int] = None
    source_revision: Optional[str] = None
    embedding_model: Optional[str] = None
    embedding_version: Optional[str] = None
    embedding_contract_version: Optional[str] = None
    embedding_dim: Optional[int] = None


class HybridSearchResponseModel(BaseModel):
    query: str
    total_hits: int
    alpha: float
    results: List[HybridHitModel]


def _post_to_canonical_api(path: str, payload: dict) -> dict:
    api_base = os.getenv("MOONWITNESS_API_URL", "").rstrip("/")
    if not api_base:
        raise HTTPException(
            status_code=503,
            detail="Canonical Witness API is not configured for this service.",
        )

    request = Request(
        f"{api_base}{path}",
        data=json.dumps(payload).encode("utf-8"),
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    try:
        with urlopen(request, timeout=15) as response:
            return json.loads(response.read().decode("utf-8"))
    except HTTPError as error:
        response_body = error.read().decode("utf-8", errors="replace")
        try:
            details = json.loads(response_body)
        except json.JSONDecodeError:
            details = {"detail": "Canonical Witness API returned an error"}
        raise HTTPException(status_code=error.code, detail=details) from error
    except (TimeoutError, URLError) as error:
        raise HTTPException(
            status_code=503,
            detail="Canonical Witness API is unavailable.",
        ) from error


async def _forward_search(path: str, payload: dict) -> dict:
    return await asyncio.to_thread(_post_to_canonical_api, path, payload)


@app.get("/health", response_model=HealthResponse)
def health_check():
    configured = bool(os.getenv("MOONWITNESS_API_URL"))
    return HealthResponse(
        status="ok" if configured else "degraded",
        retrieval_source="canonical-witness-api" if configured else "unavailable",
    )


@app.post("/semantic/search", response_model=SemanticSearchResponse)
async def search_passages(req: SemanticQueryRequest):
    result = await _forward_search(
        "/api/services/ai/semantic/search",
        {"query": req.query, "top_k": req.top_k},
    )
    return SemanticSearchResponse(**result)


@app.post("/semantic/hybrid-search", response_model=HybridSearchResponseModel)
async def hybrid_search_passages(req: HybridQueryRequest):
    result = await _forward_search(
        "/api/services/ai/semantic/hybrid-search",
        {"query": req.query, "top_k": req.top_k, "alpha": req.alpha},
    )
    return HybridSearchResponseModel(**result)
