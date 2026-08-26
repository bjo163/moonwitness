# Witness Graph Core v1

Status: implementation slice for #50 under architecture freeze #64 and Analyze/Mizan contract #67.

## Purpose

`@moon/witness` is moving from flat scripture/tradition tables to a connected, provenance-first knowledge graph. The graph core is deliberately thin: domain models keep their own strong relational fields, while `wx.entity` provides a stable cross-domain anchor.

```text
DOMAIN MODEL
  -> 1:1 wx.entity
       -> wx.entity.alias[]
       -> wx.relation[]
            -> wx.relation.type
            -> wx.provenance
                 -> wx.source
```

## Four orthogonal dimensions

Graph records preserve separate concepts:

- entity kind: what the object is;
- source class: where the information came from;
- epistemic lane: CORE / DERIVED / UNRESOLVED;
- authority/output class: how the engine may present/use it.

A score or relation never upgrades any of these categories automatically.

## Stable identity

`wx.entity.canonicalKey` is the immutable semantic identity inside Witness, for example:

```text
figure:musa
religion:islam
concept:mercy
passage:quran:2:255
```

Base `ir.model.data` remains the module external-ID mechanism. Do not create a second XML-ID system inside Witness.

## Relations

Relations are stored as first-class `wx.relation` records with a typed `wx.relation.type` predicate. Every edge has a deterministic `edgeKey` generated from endpoint IDs, predicate code, source revision and temporal validity.

Symmetric predicates canonicalize endpoint order before hashing, so `A PARALLELS B` and `B PARALLELS A` converge on one active edge.

Strict identity (`SAME_AS`) is review-only. Similarity, embeddings or fuzzy matching may propose a candidate assertion but may not directly create an established identity edge.

Domain structural relations stay as strong FKs. Examples: scripture passage hierarchy, report->collection, and ordered transmission-chain links must not be replaced by generic semantic edges.

## Provenance

`wx.source` identifies the admitted corpus/edition/revision. `wx.provenance` records the exact source reference/checksum/importer/parser lineage used for a semantic record. Evidence is a record of support, not an oracle.

Raw immutable artifact snapshots and full corpus ingestion belong to #65.

## Religion/community

`wx.religion` and `wx.community` are contextual/taxonomic nodes only. Association with Islam, Judaism, Christianity or a historical community cannot change a source's Revelation authority.

## Security

Graph models are not `_public`. `WitnessGraphService` uses Moon ORM fetches for endpoint access and skips inaccessible targets during traversal, avoiding label/count leakage. Traversal is bounded to depth 4 and 500 visible nodes.

## Legacy models

Existing `wx.scripture`, `wx.scripture.book`, `wx.scripture.verse`, `wx.tradition`, `wx.tradition.item`, and fixed-list `wx.asmaul.husna` remain registered only for migration compatibility in this slice. #51/#53/#54 introduce canonical domain models and #55 owns migration/certification.

Do not build new engine logic against the legacy fixed-99 Asma model.
