# ◈ AI Agent Service

Vector semantic search, knowledge graph retrieval, and multilingual RAG assistant service for MoonWitness.

---

## Capabilities
- Semantic embeddings generation for Quranic passages and Hadith text
- Vector similarity search over the canonical Witness Graph
- Retrieval-Augmented Generation (RAG) synthesis for complex queries

---

## Running Locally

```bash
# Run service
uv run uvicorn src.main:app --reload --port 8002

# Run tests
uv run pytest
```
