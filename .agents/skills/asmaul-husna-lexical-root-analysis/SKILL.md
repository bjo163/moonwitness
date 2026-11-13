---
name: asmaul-husna-lexical-root-analysis
description: >-
  Use this skill when indexing, auditing, or performing morphological derivation and triconsonantal root
  decomposition on the 99 Divine Names of Allah (Asmaul Husna) and their Quranic occurrences.
---

# Asmaul Husna Lexical Root Analysis (Subatomic Skill)

Governs the linguistic, morphological, and semantic cross-referencing of the 99 Divine Names of Allah (*al-Asma' al-Husna*) based on Classical Arabic lexicography (Lisan al-Arab, Taj al-Arus, Mu'jam Maqayis al-Lughah).

## Root Decomposition Architecture

Every Divine Name is indexed by its triconsonantal Semitic root $R = (r_1, r_2, r_3)$:
$$\text{Name } \xrightarrow{\text{morphological analysis}} \text{Root } (r_1 - r_2 - r_3) \xrightarrow{\text{semantic field}} \text{Attributes \& Quranic Occurrences}$$

### Data Contract & Structure
```typescript
interface DivineNameRecord {
  number: number                // 1..99
  nameArabic: string            // e.g. "الرَّحْمَٰنُ"
  nameTransliteration: string   // "Ar-Rahman"
  root: string                  // "ر-ح-م" (r-h-m)
  wazn: string                  // Morphological pattern, e.g. "فَعْلَان" (Fa'lan)
  primaryMeaningEn: string
  primaryMeaningId: string
  theologicalAspect: "DHAT" | "SIFAT_FI'L" | "SIFAT_JALAL" | "SIFAT_JAMAL"
  totalQuranicOccurrences: number
  keyAyahReferences: string[]   // e.g. ["1:1", "1:3", "55:1"]
  relatedRoots: string[]
}
```

## Morphological Weighting & Intensive Forms
- **Fa'lan (فَعْلَان)**: Indicates overwhelming, comprehensive, immediate fullness (e.g. *Ar-Rahman* — mercy encompassing all creation).
- **Fa'il (فَعِيل)**: Indicates continuous, permanent, intrinsic manifestation (e.g. *Ar-Rahim* — specific, everlasting mercy for believers).
- **Fa''al (فَعَّال)**: Intensive agent of action (e.g. *Al-Khallaq*, *Al-Ghaffar*).

## Canonical Source Files
- `packages/ui/src/components/quran-root-matrix.tsx`
- `packages/moon-witness/src/models/`
- `services/ai-agent/src/search.py`

## Verification Command
```bash
pnpm --filter=@moon/witness test
```
