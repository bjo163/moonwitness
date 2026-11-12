# AI Agent Service

The Python service is a thin bridge to the canonical Witness search API. It does
not maintain a second corpus or claim vector-search readiness.

---

## Retrieval status
- Lexical search forwards to `@moon/witness` and returns canonical source provenance.
- Concept matching is an explicitly labeled heuristic in the tested search helpers.
- Embedding and hybrid retrieval fail explicitly until a production provider and
  canonical vector index are configured.
- The service requires `MOONWITNESS_API_URL`; without it, search responds with
  HTTP 503 rather than returning fixture results.

---

## Running Locally

```bash
# Run service with the canonical API available
MOONWITNESS_API_URL=http://localhost:4000 \
uv run uvicorn src.main:app --reload --port 8002

# Run tests
uv run pytest
```
