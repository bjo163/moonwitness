from fastapi.testclient import TestClient

from src import main


client = TestClient(main.app)


def test_health_reports_canonical_api_configuration(monkeypatch):
    monkeypatch.delenv("MOONWITNESS_API_URL", raising=False)

    response = client.get("/health")

    assert response.status_code == 200
    assert response.json()["status"] == "degraded"
    assert response.json()["retrieval_source"] == "unavailable"


def test_search_fails_explicitly_without_canonical_api(monkeypatch):
    monkeypatch.delenv("MOONWITNESS_API_URL", raising=False)

    response = client.post("/semantic/search", json={"query": "moon"})

    assert response.status_code == 503
    assert "Canonical Witness API is not configured" in response.json()["detail"]


def test_search_forwards_to_canonical_corpus(monkeypatch):
    monkeypatch.setenv("MOONWITNESS_API_URL", "http://witness-api:4000")
    forwarded = {}

    def fake_post(path, payload):
        forwarded["path"] = path
        forwarded["payload"] = payload
        return {
            "query": "moon",
            "normalized_query": "moon",
            "total_hits": 1,
            "total_found": 1,
            "results": [
                {
                    "id": "passage:7",
                    "collection": "scripture",
                    "source_type": "SCRIPTURE",
                    "reference": "Quran 2:189",
                    "excerpt": "They ask about the new moons.",
                    "provenance_id": 41,
                    "match_type": "LEXICAL_CANONICAL",
                    "retrieval_version": "witness-search.v1",
                }
            ],
        }

    monkeypatch.setattr(main, "_post_to_canonical_api", fake_post)
    response = client.post(
        "/semantic/search",
        json={"query": "moon", "top_k": 3},
    )

    assert response.status_code == 200
    assert forwarded["path"] == "/api/services/ai/semantic/search"
    assert forwarded["payload"] == {"query": "moon", "top_k": 3}
    assert response.json()["results"][0]["provenance_id"] == 41
