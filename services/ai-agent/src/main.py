"""
◈ MoonWitness AI Knowledge & Semantic Agent API
FastAPI service exposing vector search and semantic passage retrieval.
"""
from fastapi import FastAPI
from pydantic import BaseModel, Field
from typing import List
from src.search import compute_bm25_similarity, compute_hybrid_search

app = FastAPI(
    title="MoonWitness AI Knowledge Agent",
    description="Vector search, embeddings, and semantic reasoning engine",
    version="0.1.0",
)



class HealthResponse(BaseModel):
    status: str = "ok"
    service: str = "ai-agent"
    version: str = "0.1.0"


class SemanticQueryRequest(BaseModel):
    query: str = Field(..., min_length=1, description="Natural language search or semantic question")
    top_k: int = Field(5, ge=1, le=50, description="Max passage results to return")


class PassageResult(BaseModel):
    id: str
    source_type: str
    reference: str
    similarity_score: float
    excerpt: str


class SemanticSearchResponse(BaseModel):
    query: str
    results: List[PassageResult]
    total_found: int


class HybridQueryRequest(BaseModel):
    query: str = Field(..., min_length=1, description="Natural language search or semantic concept query")
    top_k: int = Field(5, ge=1, le=50, description="Max passage results to return")
    alpha: float = Field(0.5, ge=0.0, le=1.0, description="Weighting factor: 1.0 = pure BM25, 0.0 = pure dense vector")


class HybridHitModel(BaseModel):
    id: str
    source_type: str
    reference: str
    excerpt: str
    similarity_score: float
    bm25_score: float
    dense_score: float
    match_type: str


class HybridSearchResponseModel(BaseModel):
    query: str
    total_hits: int
    alpha: float
    results: List[HybridHitModel]


@app.get("/health", response_model=HealthResponse)
def health_check():
    return HealthResponse()


@app.post("/semantic/search", response_model=SemanticSearchResponse)
def search_passages(req: SemanticQueryRequest):
    matches = compute_bm25_similarity(req.query, top_k=req.top_k)
    return SemanticSearchResponse(
        query=req.query,
        results=[PassageResult(**p) for p in matches],
        total_found=len(matches),
    )


@app.post("/semantic/hybrid-search", response_model=HybridSearchResponseModel)
def hybrid_search_passages(req: HybridQueryRequest):
    result = compute_hybrid_search(query=req.query, top_k=req.top_k, alpha=req.alpha)
    return HybridSearchResponseModel(
        query=result["query"],
        total_hits=result["total_hits"],
        alpha=result["alpha"],
        results=[HybridHitModel(**h) for h in result["results"]],
    )

