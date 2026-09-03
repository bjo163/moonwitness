# Public Content Acceptance Matrix

Phase 22 public routes are backed by the existing MoonWitness Witness API. No corpus records are copied into `apps/web`.

| Page | Real data | API | Source/reference | Provenance | Search/deep link | Responsive/theme | Keyboard |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Home | PASS (capability copy only) | PASS (links to public routes) | N/A | N/A | PASS | PASS (semantic tokens) | PASS (native links/form) |
| Search | PASS | PASS `/api/witness/search` | PASS when returned | PASS on content page | PASS | PASS | PASS |
| Sources | PASS | PASS `/api/wx.source` | PASS | PASS in detail metadata | PASS to source detail | PASS | PASS |
| Scripture | PASS | PASS `/api/witness/quran/surahs` | PASS | PASS through passage | PASS to `/s/quran:s:a` | PASS incl. RTL | PASS |
| Passage | PASS | PASS `/api/witness/lookup` | PASS when `sourceId` exists | PASS via `CitationBox`/`ProvenanceCard` | PASS stable `/s/[id]` | PASS incl. Arabic wrapping | PASS |
| Hadith | PASS when collections exist | PASS `/api/witness/hadith/books` and `/api/witness/hadith` | PASS when returned | PASS through lookup/source metadata | PASS to `/s/[collection:number]` | PASS | PASS |
| About | PASS (product copy) | N/A | N/A | Explains boundary | N/A | PASS | PASS |
| Methodology | PASS (architecture copy) | N/A | Describes source → corpus → Witness → API | PASS | N/A | PASS | PASS |

## Representative API-to-UI mappings

- Scripture: `quran:1:1` → `GET /api/witness/lookup?ref=quran%3A1%3A1` → `/s/quran:1:1` → original content, available translations, source, citation, provenance.
- Hadith: `bukhari:1` → `GET /api/witness/lookup?ref=bukhari%3A1` → `/s/bukhari:1` when the reference resolves.
- Search: a corpus term → `GET /api/witness/search` → result `link` → stable content route.

The API contract remains the source of truth for record availability, counts, translations, licenses, revisions, and provenance fields. Missing metadata is displayed as an honest neutral state.
