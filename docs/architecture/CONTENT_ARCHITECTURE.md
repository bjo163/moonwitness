# ◈ MOONWITNESS — PRODUCT CONTENT BLUEPRINT & ARCHITECTURE CONTRACT

```
╔══════════════════════════════════════════════════════════════════════════╗
║  CLASSIFICATION: CANONICAL PRODUCT & CONTENT AUTHORITY DOCUMENT          ║
║  SYSTEM:         MoonWitness OS (Dual-Portal & Canonical Engine)         ║
║  DOCUMENT ID:    MW-DOC-CONTENT-V1.0                                     ║
║  STATUS:         ████████████████████████████████ ACTIVE                 ║
╚══════════════════════════════════════════════════════════════════════════╝
```

---

## 1. Product Purpose & Content Philosophy

MoonWitness is a **Unified Knowledge Platform & Celestial Observatory**. It brings together canonical scriptures, prophetic traditions, morphological Arabic lexical roots, historical-revelation lineage, and pure astronomical/geophysical computation into a single, cohesive, verifiable knowledge graph.

### The Separation Rule
To maintain strict epistemic integrity, MoonWitness enforces absolute separation between:
1. **Source Content** (Pristine ancient text, immutable orthography)
2. **Translation** (Attributed human linguistic renderings)
3. **Reference & Metadata** (Canonical indexing and structural hierarchy)
4. **Relationships & Lineage** (Graph edges connecting entities and transmitters)
5. **Evidence & Assertions** (Polarized, weighted claims supporting research)
6. **Research & Engine Results** (Analytical computations produced by `@moon/compute` or `@moon/witness`)
7. **Product & Editorial Copy** (Application navigation, guidance, and explanatory copy)

No user interface view may silently blend or confuse these categories.

---

## 2. The 7-Layer Product Content Hierarchy

```text
┌────────────────────────────────────────────────────────────────────────┐
│ LAYER 7: Human-Readable Product & Editorial Copy (UI Guides, Hero)     │
├────────────────────────────────────────────────────────────────────────┤
│ LAYER 6: Research & Analytical Engine Runs (wx.research.run)          │
├────────────────────────────────────────────────────────────────────────┤
│ LAYER 5: Evidentiary Assertions & Findings (wx.assertion, wx.evidence) │
├────────────────────────────────────────────────────────────────────────┤
│ LAYER 4: Graph Relationships & Lineage (wx.relation, wx.figure)        │
├────────────────────────────────────────────────────────────────────────┤
│ LAYER 3: Translations & Commentary Editions (wx.text.edition)          │
├────────────────────────────────────────────────────────────────────────┤
│ LAYER 2: Structural Reference & Source Metadata (wx.source, wx.passage)│
├────────────────────────────────────────────────────────────────────────┤
│ LAYER 1: Canonical Source Content (wx.content, wx.tradition.unit)      │
└────────────────────────────────────────────────────────────────────────┘
```

### Layer Specification

| Layer | Domain Object | Mutability | Primary Model | Ownership |
|---|---|---|---|---|
| **Layer 1: Canonical Source** | Original Arabic Uthmani text, Hadith Matn | **Immutable** | `wx.content`, `wx.tradition.unit` | `moonwitness-corpus` |
| **Layer 2: Reference & Meta** | Surah/Ayah, Hadith book/number, Chapters | **Immutable** | `wx.source`, `wx.passage`, `wx.tradition.reference` | `moonwitness-corpus` |
| **Layer 3: Translations** | Indonesian (Kemenag), English (Saheeh) | **Attributed** | `wx.text.edition`, `wx.content` | `moonwitness-corpus` / Translators |
| **Layer 4: Lineage & Graph** | Prophets, Companions, Sanad Chains, Events | **Versioned** | `wx.relation`, `wx.figure`, `wx.transmission.chain` | `@moon/witness` |
| **Layer 5: Evidence** | Evidentiary weights, Affirmation/Negation | **Deterministic**| `wx.assertion`, `wx.evidence` | Witness Engine |
| **Layer 6: Research Runs** | Revelation chronological analysis, Queries | **Deterministic**| `wx.research.run`, `wx.engine.run` | Witness Engine |
| **Layer 7: Product Copy** | Landing hero text, tooltips, empty states | **Maintainable** | Application Source (`apps/web`, `apps/command-center`)| Product/Design Team |

---

## 3. Canonical Source Matrix & Licensing

| Domain | Dataset / Source | Provider / Origin | Release Version | License / Rights | Provenance Type |
|---|---|---|---|---|---|
| **Scripture (Quran)** | Tanzil Uthmani Text | Tanzil Project | `v1.0.0` (Pinned) | Tanzil Creative Commons Attribution | Immutable Corpus Release |
| **Translation (ID)** | Indonesian Translation | Kemenag RI | `v1.0.0` (Pinned) | Public Domain / Open Government | Immutable Corpus Release |
| **Translation (EN)** | Saheeh International | Saheeh International | `v1.0.0` (Pinned) | Permissive Educational Attribution | Immutable Corpus Release |
| **Hadith Traditions** | Kutub al-Sittah (Bukhari, Muslim) | OpenHadith / Canonical Hadith | `v1.0.0` (Pinned) | Public Domain Scholarly Archive | Immutable Corpus Release |
| **Lexical Corpus** | Arabic Roots & Lemmata | Quranic Arabic Corpus | `v1.0.0` (Pinned) | Open Linguistic License | Immutable Corpus Release |
| **Observatory / Astro**| Ephemeris & Sun Algorithms | USNO / Jean Meeus Pure Math | `@moon/compute` | MIT / Isomorphic Pure Engine | Local Computation |
| **Geophysical / Quakes**| Global Seismic Events | USGS / BMKG Data Streams | `@moon/geo` | Open Data Attribution | Telemetry Stream |

---

## 4. Witness Model & Domain Mapping

```text
Corpus Raw Entity       ───►  Witness Domain Model  ───►  Database Storage
───────────────────────────────────────────────────────────────────────────
sources[id]             ───►  wx.source             ───►  wx_sources
artifacts[sha256]       ───►  wx.source.artifact    ───►  wx_source_artifacts
snapshots[revision]     ───►  wx.source.snapshot    ───►  wx_source_snapshots
provenance[id]          ───►  wx.provenance         ───►  wx_provenance
works[quran] / surah    ───►  wx.passage            ───►  wx_passages
verses[surah:ayah]      ───►  wx.content            ───►  wx_contents
hadith_collections      ───►  wx.tradition.corpus   ───►  wx_tradition_corpora
hadith_units            ───►  wx.tradition.unit     ───►  wx_tradition_units
hadith_references       ───►  wx.tradition.reference───►  wx_tradition_references
figures / persons       ───►  wx.figure             ───►  wx_figures
relationships           ───►  wx.relation           ───►  wx_relations
assertions / evidence   ───►  wx.assertion / evidence───► wx_assertions / wx_evidence
research executions     ───►  wx.research.run       ───►  wx_research_runs
```

---

## 5. Application Route & Navigation Mesh

### 5.1 Public Web Portal (`apps/web` @ Port 3000)

| Public Route | Content Displayed | Primary Data Source | Audience | SEO Status |
|---|---|---|---|---|
| `/home` / `/` | Platform Overview, Daily Transmission, Search | Static Copy + `/api/witness/search` | Public | Indexable |
| `/s/[id]` | Direct Passage Reader (Scripture / Hadith Detail) | `GET /api/witness/lookup?ref=[id]` | Public | Indexable |
| `/knowledge/hub` | Knowledge Hub Overview & Domain Navigator | `@moon/witness` Domain Queries | Public | Indexable |
| `/knowledge/kitab` | Quranic Surah & Scripture Index | `wx.passage` (Parent passages) | Public | Indexable |
| `/knowledge/hadits` | Hadith Corpus Collections Explorer | `wx.tradition.corpus` & Units | Public | Indexable |
| `/knowledge/kamus-akar-kata` | Arabic Lexical Root Dictionary | `wx.root`, `wx.lexeme` | Public | Indexable |
| `/knowledge/graph` | Entity & Relationship Graph Explorer | `GET /api/witness/graph/relations` | Public | Indexable |
| `/observatory/daily-transmission` | Daily Astronomical & Ephemeris Telemetry | `@moon/compute` Isomorphic Engine | Public | Indexable |
| `/observatory/lunar-calendar` | Hijri Lunar Calendar & Moon Phases | `@moon/compute` Moon Simulator | Public | Indexable |
| `/seismix/quake-archive` | Global Tectonic & Seismic Event Archive | `@moon/geo` Geophysical Stream | Public | Indexable |

### 5.2 Operations Command Center (`apps/command-center` @ Port 3001)

| Admin Route | Administrative Capability | Primary API Endpoint | Audience |
|---|---|---|---|
| `/dashboard` | System Operations Health & Subsystem Telemetry | `GET /api/command-center/dashboard` | Admin / Operator |
| `/scriptures` | Scripture Corpus Administration & Verse Matrix | `GET /api/witness/corpus/status` | Content Admin |
| `/hadiths` | Hadith Tradition Operations & Sanad Checker | `GET /api/witness/lookup` | Content Admin |
| `/matrix/[model]` | Universal Server-Driven Matrix View (16 Addons)| `GET /api/meta/model/:name` | Operator / Admin |
| `/cab` | RFC Change Advisory Board & Governance | `GET /api/cab/rfc` | Superuser / Lead |
| `/terminal` | Developer Console & Engine Query Workbench | Fastify RPC `/rpc` | Developer |

---

## 6. Audience Model & Disclosure Levels

```text
[PUBLIC]       ──► Read-only canonical text, translations, citations, search, and observatory
[RESEARCH]     ──► Full relationship graph, evidence polarity/weight inspection, query runs
[ADMIN]        ──► Corpus sync, re-indexing, validation audits, snapshot inspections, CAB RFCs
[DEVELOPER]    ──► Raw Fastify RPC logs, memory heap diagnostics, Fastify schema introspection
```

### Access Control Matrix

| Capability | Public Reader | Authenticated Researcher | Operator / Admin | Superuser |
|---|---|---|---|---|
| Read Canonical Scripture / Hadith | `ALLOW` | `ALLOW` | `ALLOW` | `ALLOW` |
| View Citation & Provenance | `ALLOW` | `ALLOW` | `ALLOW` | `ALLOW` |
| Multi-Domain Full Text Search | `ALLOW` | `ALLOW` | `ALLOW` | `ALLOW` |
| Explore Graph Relationships | `ALLOW` | `ALLOW` | `ALLOW` | `ALLOW` |
| Inspect Evidentiary Weights | `DENY` | `ALLOW` | `ALLOW` | `ALLOW` |
| Trigger Research Run | `DENY` | `ALLOW` | `ALLOW` | `ALLOW` |
| Trigger Corpus Release Sync | `DENY` | `DENY` | `ALLOW` | `ALLOW` |
| Trigger Search Re-Index | `DENY` | `DENY` | `ALLOW` | `ALLOW` |
| Authorize RFC Production Deploy | `DENY` | `DENY` | `DENY` | `ALLOW` |

---

## 7. Citation & Progressive Provenance Contract

Every scripture and tradition item rendered in MoonWitness must provide a standard **Citation Box** with progressive disclosure:

1. **Standard Reader Citation**:
   - Title: `Surah Al-Fatihah (1:1)`
   - Edition: `Tanzil Uthmani Canonical Text`
   - Translation: `Indonesian Ministry of Religious Affairs (Kemenag RI, 2019)`
   - Reference URL: `https://moonwitness.app/s/quran:1:1`
2. **Scholarly & Evidentiary Provenance (Expanded)**:
   - Upstream Source: `bjo163/moonwitness-corpus`
   - Release Pin: `v1.0.0`
   - Artifact Checksum: `sha256:7f83b1657ff1...`
   - Snapshot Status: `COMMITTED`
   - Verification Date: `2026-08-29T15:09:07Z`

---

## 8. Content Lifecycle & Release Change Impact

```text
1. Release Discovery   ──► Upstream release tag v1.0.0 tagged on bjo163/moonwitness-corpus
2. Pre-Flight Check    ──► SHA-256 digest calculated and schema 1.0.0 validated
3. Ingestion & Mapping ──► Normalized passages and units committed to wx_contents / wx_tradition_units
4. Provenance Stamping ──► Immutable wx_provenance and wx_source_snapshots recorded
5. Search Index Swap   ──► Diacritic-insensitive index regenerated and active alias pointed
6. Portal Availability ──► Public Web /s/[id] and Command Center reflect updated corpus
```

---

## 9. SEO, Social Previews & Security Boundaries

- **Indexable Public Surfaces**:
  - Scripture Works & Passages (`/s/[id]`, `/knowledge/kitab`, `/knowledge/hadits`)
  - Astronomical Observatories (`/observatory/*`)
- **Blocked Surfaces (`robots.txt: Disallow`)**:
  - All Command Center paths (`/dashboard`, `/matrix/*`, `/cab`, `/terminal`)
  - All internal search mutation states & unauthenticated draft pages
- **Social Metadata (`OpenGraph` & `Twitter Cards`)**:
  - Dynamically generated with canonical reference metadata (`Surah [Name] [Chapter:Verse] — MoonWitness OS`).
- **Content Security**:
  - All scripture and tradition texts are rendered via React text nodes or strictly sanitized markdown.
  - Zero raw HTML injection allowed.

---

## 10. Product Copy Inventory & Editorial Standards

| Surface | Copy Role | Editorial Standard |
|---|---|---|
| Home Hero | Platform Introduction | Restrained, academic, factual SaaS introduction. Zero sci-fi or theological claims. |
| Search Empty State | Query Guidance | Helpful search syntax tips (e.g. `quran:1:1`, `bukhari:1`, Arabic root search). |
| Provenance Drawer | Epistemic Disclosure | Clear explanation that translations are human scholarly interpretations. |
| Error Boundaries | Crash Telemetry Guide | Clean user-friendly message with diagnostic incident ID. |
