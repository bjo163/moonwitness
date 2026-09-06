"""
◈ MoonWitness AI Knowledge & Semantic Agent API
FastAPI service exposing vector search and semantic passage retrieval.
"""
from fastapi import FastAPI
from pydantic import BaseModel, Field
from typing import List
from src.search import compute_bm25_similarity

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
