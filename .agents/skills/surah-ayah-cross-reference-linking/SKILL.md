---
name: surah-ayah-cross-reference-linking
description: >-
  Use this skill when auditing, constructing, or traversing inter-ayah thematic links,
  Quranic cross-reference networks (Tafsir al-Qur'an bi al-Qur'an), and semantic cluster edges.
---

# Surah & Ayah Cross-Reference Linking (Subatomic Skill)

Governs the construction and traversal of thematic, conceptual, and hermeneutic relations between Quranic passages, implementing the principle of *Tafsir al-Qur'an bi al-Qur'an* (Quran interpreting itself).

## Cross-Reference Edge Types & Graph Topology

Let the Quranic graph be $G = (V, E)$ where vertices $V$ represent Ayahs ($1:1 \dots 114:6$):
Edges $e = (u, v, \tau)$ possess typed semantics:
1. **`ELABORATIVE`**: Passage $v$ clarifies, details, or expands a concise mention in $u$ (e.g. general creation in 2:29 elaborated in 41:9-12).
2. **`RESTRICTIVE_OR_QUALIFYING`**: Passage $v$ provides conditions or qualifications to $u$.
3. **`LEXICAL_PARALLEL`**: Ayahs sharing unique Quranic hapax legomena or rare theological vocabulary.
4. **`CHRONOLOGICAL_HISTORICAL`**: Passages recalling the same prophetic narrative from different thematic perspectives (e.g. Prophet Musa in Al-A'raf vs Ta-Ha vs Al-Qasas).

## Edge Data Structure
```typescript
interface AyahCrossReference {
  id: string                   // e.g. "xref:2:189->10:5"
  sourceAyahId: string         // "2:189"
  targetAyahId: string         // "10:5"
  relationType: "ELABORATIVE" | "THEMATIC_PARALLEL" | "LEXICAL_ECHO"
  sharedKeywords: string[]     // ["hilal", "manzilah", "hisab"]
  scholarlyTafsirCitation: string // "Ibn Kathir, Tafsir al-Qur'an al-Azim"
  thematicCluster: "COSMOLOGY_ASTRONOMY" | "ESCHATOLOGY" | "LEGAL_RULING"
}
```

## Traversal & UI Reading Integration
- In `apps/web` research reading mode, clicking any qualified ayah displays the interactive citation drawer with bidirectional links.
- In `apps/command-center`, relation graphs are visualized in the Knowledge Matrix view.

## Canonical Source Files
- `packages/moon-witness/src/models/`
- `packages/moon-witness/src/views.ts`
- `apps/web/app/surah/`

## Verification Command
```bash
pnpm --filter=@moon/witness test
```
