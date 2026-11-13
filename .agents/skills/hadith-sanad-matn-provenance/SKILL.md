---
name: hadith-sanad-matn-provenance
description: >-
  Use this skill when auditing, indexing, or parsing Hadith transmission chains (Isnad/Sanad),
  narrator graph nodes, reliability grades (Sahih, Hasan, Da'if), and canonical matn extraction.
---

# Hadith Sanad & Matn Provenance (Subatomic Skill)

Governs the extraction, structural normalization, and graph modeling of Hadith literature, preserving the transmission chain (Sanad) as a directed acyclic graph (DAG) linked to textual pronouncements (Matn).

## Structural Representation & Ontology

Each canonical Hadith record conforms to:
```typescript
interface HadithRecord {
  id: string              // e.g. "hadith:bukhari:1909"
  collection: "bukhari" | "muslim" | "abudawood" | "tirmidhi" | "nasai" | "ibnmajah"
  hadithNumber: number
  chapterId: number
  sanad: NarratorNode[]   // Sequence of transmitters [Narrator_N -> ... -> Companion -> Prophet]
  matn: {
    arabic: string        // Canonical Arabic text with Uthmani ligatures
    transliteration?: string
    translationId: string // Indonesian translation
    translationEn: string // English translation
  }
  grade: "SAHIH" | "HASAN" | "DAIF" | "MAWDU"
  scholarlyGradingSource: string
  crossReferences: string[] // Related Quranic ayahs or parallel hadith chains (Takhrij)
}

interface NarratorNode {
  narratorId: string
  fullNameArabic: string
  fullNameLatin: string
  generationTier: number // 1: Sahabi, 2: Tabi'i, 3: Atba' at-Tabi'in, etc.
  reliabilityStatus: "THIQAH" | "SADUQ" | "DAIF" | "MATRUK"
  deathHijri?: number
}
```

## Sanad DAG & Takhrij Multi-Chain Traversal
To verify Hadith authenticity without single-point narrator vulnerability, the transmission graph forms a DAG:
$$\text{Isnad Graph } G = (V, E)$$
Where $V$ represents transmitters (rawi) and directed edges $E = (u, v)$ represent direct oral transmission $u \xrightarrow{\text{haddathana / 'an}} v$.

### Invariance Rules
1. **Never alter canonical Matn**: Textual mutations violate sacred provenance.
2. **Preserve Chain Order**: Reverse traversal from collector to source must be preserved.
3. **No Synthetic AI Narrators**: Narrator nodes must map strictly to canonical Jarh wa Ta'dil biographical dictionaries (Tahdhib al-Kamal, Taqrib al-Tahdhib).

## Canonical Source Files
- `packages/moon-witness/src/models/`
- `services/ai-agent/src/search.py`
- `packages/moon-witness/src/index.ts`

## Verification Command
```bash
pnpm --filter=@moon/witness test
```
