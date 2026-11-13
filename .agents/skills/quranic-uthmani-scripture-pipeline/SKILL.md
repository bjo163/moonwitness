---
name: quranic-uthmani-scripture-pipeline
description: >-
  Use this skill when processing Quranic scriptures, formatting Uthmani orthography,
  rendering Arabic Amiri typography, or indexing Surah and Ayah entities.
---

# Quranic Uthmani Scripture Pipeline (Subatomic Skill)

Governs the textual normalization, indexing, and typography rendering of Qur'anic verses across `@moon/witness` and `@workspace/ui`.

## Data Models (`@moon/witness`)

- **`moon.witness.scripture.book`**: Surah record (Surah number $1 \dots 114$, name in Arabic, English transliteration, revelation order, revelation type: Makkiyyah/Madaniyyah, ayah count).
- **`moon.witness.scripture.verse`**: Ayah record (Surah number, Ayah number, canonical reference e.g. `2:255`, Uthmani text, simplified text, sajda indicator).
- **`moon.witness.content`**: Multilingual translation lines (Indonesian Kemenag, English Sahih International) mapped to the canonical verse ID.

## Typography & UI Standards

1. **Font Token**:
   - Quranic text MUST render using `font-arabic` (`var(--font-arabic)` configured with **Amiri** font).
   - Display elements must use the canonical CSS class: `.arabic-text`.
   - Direction: `dir="rtl"`.
   - Line height: `leading-loose` or `leading-[2.5]` to ensure diacritics (harakat, tanwin, maddah) do not overlap adjacent lines.
2. **Verse Number End Ornament**:
   - Format verse markers with standard Uthmani end-of-ayah glyphs `\u06DD` (Arabic End of Ayah) with embedded Eastern Arabic digits.

```tsx
<p className="arabic-text text-2xl leading-loose text-right font-arabic" dir="rtl">
  {verse.uthmaniText} ۝{toEasternArabicDigits(verse.verseNumber)}
</p>
```

## Quality Checklist

- [ ] Uthmani text preserves all diacritical signs without stripping hamza, waslah, or dagger alif.
- [ ] Non-Arabic explanations are kept strictly outside `.arabic-text` tags.
- [ ] Verse references conform to `<surah>:<ayah>` standard indexing format.
