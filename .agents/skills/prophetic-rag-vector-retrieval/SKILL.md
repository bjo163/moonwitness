---
name: prophetic-rag-vector-retrieval
description: >-
  Use this skill when developing, testing, or auditing RAG vector retrieval pipelines over Quranic
  and Hadith corpora, cosine similarity ranking, HNSW indexing, and multilingual semantic search.
---

# Prophetic RAG Vector Retrieval (Subatomic Skill)

Governs semantic and hybrid vector retrieval over Quranic passages, Hadith collections, and scientific commentary, integrating dense vector embeddings with sparse BM25 lexical ranking.

## Mathematical Formulation: Hybrid Scoring

For user query $q$, retrieved candidate passage $d \in D$:
$$\text{Score}(q, d) = \alpha \cdot S_{\text{dense}}(q, d) + (1 - \alpha) \cdot S_{\text{BM25}}(q, d)$$
Where:
- $\alpha = 0.70$ (empirically tuned weighting favoring semantic alignment while respecting exact keywords).
- Dense Cosine Similarity:
  $$S_{\text{dense}}(q, d) = \frac{\vec{E}(q) \cdot \vec{E}(d)}{\|\vec{E}(q)\| \|\vec{E}(d)\|}$$
- BM25 Term Weighting:
  $$S_{\text{BM25}}(q, d) = \sum_{t \in q \cap d} \operatorname{IDF}(t) \cdot \frac{f(t, d) \cdot (k_1 + 1)}{f(t, d) + k_1 \cdot \left(1 - b + b \cdot \frac{|d|}{\text{avgdl}}\right)}$$
  With $k_1 = 1.2, b = 0.75$.

## Text Normalization & Diacritic Invariance
Before embedding generation or BM25 indexing, Arabic text must be normalized:
```python
def normalize_arabic_for_retrieval(text: str) -> str:
    # 1. Remove Tashkeel / Harakat
    tashkeel = re.compile(r'[\u064B-\u0652\u0670\u0640]')
    clean = tashkeel.sub('', text)
    # 2. Standardize Alif forms: [إ, أ, آ] -> ا
    clean = re.sub(r'[إأآ]', 'ا', clean)
    # 3. Standardize Taa Marbuta & Yaa: ة -> ه, ى -> ي
    clean = re.sub(r'ة', 'ه', clean)
    clean = re.sub(r'ى', 'ي', clean)
    return clean.strip()
```

## Anti-Hallucination Grounding Constraint
Every synthesized AI response must cite exact canonical source IDs:
```text
[SOURCE: quran:2:189 | Surah Al-Baqarah 2:189 | Manifest: v1.4.0]
[SOURCE: hadith:bukhari:1909 | Sahih Bukhari | Bab Wujub Sawm Ramadan]
```
Any assertion unsupported by a verified retrieved chunk must be discarded.

## Canonical Source Files
- `services/ai-agent/src/search.py`
- `services/ai-agent/src/models/contracts.py`
- `packages/moon-witness/src/models/`

## Verification Command
```bash
pytest services/ai-agent/ -v
```
