---
name: witness-knowledge-graph-and-corpus
description: >-
  Use this skill when ingesting canonical Islamic corpus artifacts, maintaining the Witness Knowledge Graph,
  managing source provenance, and integrating vector RAG retrieval pipelines.
---

# Witness Knowledge Graph & Canonical Corpus Skill

Governs source-aware ingestion, provenance verification, graph entity normalization, and textual retrieval across `@moon/witness` and `services/ai-agent`.

## Canonical Ingestion Pipeline

The flow of canonical corpus data follows strict unidirectional ownership:

```text
moonwitness-corpus (External release/pinned manifest)
        ↓
Corpus Artifact + SHA-256 Checksum
        ↓
@moon/witness Ingestion Service (CanonicalCorpusImporter)
        ↓
Witness Knowledge Graph (Sources, Artifacts, Snapshots, Passages)
        ↓
MoonWitness Unified API & RAG Embeddings
```

## Core Models & Boundaries (`@moon/witness`)

1. **Source & Provenance**:
   - `moon.witness.source`: Authoritative registry of primary texts (Quran, Hadith collections, Tafsir).
   - `moon.witness.artifact`: Raw physical file with cryptographic sha256 checksum and verification status.
   - `moon.witness.snapshot`: Pinned revision snapshot preventing silent content mutation.
   - `moon.witness.provenance`: Immutable audit record of translation, transmission, and curation chain.

2. **Textual Content & Graph Entities**:
   - `moon.witness.passage`: Segmented canonical passage with stable citation key (`canonical_reference`).
   - `moon.witness.content`: Text body with Uthmani script (`.arabic-text`), transliteration, and language code.
   - `moon.witness.entity` & `moon.witness.relation`: Graph nodes and directed relations connecting divine concepts, revelation contexts, and historical actors.

3. **Prophetic & Theological Domains**:
   - `moon.witness.asmaul.husna`: The 99 Divine Names with linguistic root analysis and scriptural citations.
   - `moon.witness.tradition`: Hadith corpus collection, sanad transmission chain, and matn text.

## Python AI Agent & Vector Search (`services/ai-agent`)

- Multilingual sentence embeddings for semantic passage retrieval.
- Cosine similarity matching against `pgvector` store.
- Strict constraint: AI-generated synthesis must never overwrite or masquerade as primary canonical source text.

## Canonical Runbook & Commands

```bash
# Sync canonical corpus artifacts into the local workspace
pnpm corpus:sync

# Run complete knowledge graph certification test suite
pnpm certify:knowledge

# Verify canonical ingestion tests
pnpm test packages/moon-witness/tests/knowledge-certification.test.ts
```

## Invariant Rules

- Do not create a competing corpus store inside application modules.
- Preserve source identity, edition, revision, and license across all transformations.
- Ensure Arabic text fields render with Uthmani orthography using font-arabic (`Amiri`).
