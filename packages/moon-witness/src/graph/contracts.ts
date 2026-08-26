export const ENTITY_KIND_SELECTION: Array<[string, string]> = [
  ['RELIGION', 'Religion'],
  ['COMMUNITY', 'Community'],
  ['SCRIPTURE_FAMILY', 'Scripture Family'],
  ['TEXT_TRADITION', 'Text Tradition'],
  ['CORPUS', 'Corpus'],
  ['WORK', 'Work'],
  ['BOOK', 'Book'],
  ['SECTION', 'Section'],
  ['PASSAGE', 'Passage'],
  ['CONTENT_WITNESS', 'Content Witness'],
  ['PERSON', 'Person'],
  ['EVENT', 'Event'],
  ['PLACE', 'Place'],
  ['TRADITION_CORPUS', 'Tradition Corpus'],
  ['TRADITION_UNIT', 'Tradition Unit'],
  ['TRANSMISSION_CHAIN', 'Transmission Chain'],
  ['LEXEME', 'Lexeme'],
  ['ROOT', 'Root'],
  ['CONCEPT', 'Concept'],
  ['ASSERTION', 'Assertion'],
  ['EVIDENCE', 'Evidence'],
  ['SOURCE', 'Source'],
  ['EDITION', 'Edition'],
  ['ENGINE_RUN', 'Engine Run'],
  ['ENGINE_FINDING', 'Engine Finding']
]

export const SOURCE_CLASS_SELECTION: Array<[string, string]> = [
  ['REVELATION', 'Revelation'],
  ['TEXTUAL_WITNESS', 'Textual Witness'],
  ['SCRIPTURAL_METADATA', 'Scriptural Metadata'],
  ['TRADITION_REPORT', 'Tradition Report'],
  ['HISTORICAL_REPORT', 'Historical Report'],
  ['SCHOLARLY_SOURCE', 'Scholarly Source'],
  ['OBSERVATION', 'Observation'],
  ['RESEARCH_DATASET', 'Research Dataset'],
  ['ENGINE_DERIVED', 'Engine Derived'],
  ['AI_OUTPUT', 'AI Output'],
  ['GOVERNANCE_RECORD', 'Governance Record'],
  ['UNKNOWN', 'Unknown']
]

export const EPISTEMIC_LANE_SELECTION: Array<[string, string]> = [
  ['CORE', 'Core'],
  ['DERIVED', 'Derived'],
  ['UNRESOLVED', 'Unresolved']
]

export const AUTHORITY_CLASS_SELECTION: Array<[string, string]> = [
  ['PRIMARY_SOURCE', 'Primary Source'],
  ['TRANSLATION', 'Translation'],
  ['TRANSMISSION_REPORT', 'Transmission Report'],
  ['SOURCE_SUMMARY', 'Source Summary'],
  ['SCHOLARLY_INTERPRETATION', 'Scholarly Interpretation'],
  ['DERIVED', 'Derived'],
  ['HYPOTHESIS', 'Hypothesis'],
  ['AI_ASSISTED', 'AI Assisted'],
  ['NOT_APPLICABLE', 'Not Applicable']
]

export const OPERATIONAL_STATUS_SELECTION: Array<[string, string]> = [
  ['ESTABLISHED', 'Established'],
  ['PROVISIONAL', 'Provisional'],
  ['INSUFFICIENT_EVIDENCE', 'Insufficient Evidence'],
  ['CONFLICTED', 'Conflicted'],
  ['RESERVED', 'Reserved'],
  ['SUPERSEDED', 'Superseded']
]

export const RELATION_POLARITY_SELECTION: Array<[string, string]> = [
  ['AFFIRMED', 'Affirmed'],
  ['NEGATED', 'Negated'],
  ['QUALIFIED', 'Qualified'],
  ['UNKNOWN', 'Unknown']
]

export const RELATION_MODALITY_SELECTION: Array<[string, string]> = [
  ['ASSERTED', 'Asserted'],
  ['REPORTED', 'Reported'],
  ['POSSIBLE', 'Possible'],
  ['HYPOTHETICAL', 'Hypothetical'],
  ['CONDITIONAL', 'Conditional'],
  ['UNKNOWN', 'Unknown']
]

export const ALIAS_TYPE_SELECTION: Array<[string, string]> = [
  ['CANONICAL', 'Canonical'],
  ['ALTERNATE', 'Alternate'],
  ['HISTORICAL', 'Historical'],
  ['ABBREVIATION', 'Abbreviation'],
  ['TRANSLITERATION', 'Transliteration'],
  ['SOURCE_LOCAL', 'Source Local'],
  ['OTHER', 'Other']
]

export const SOURCE_CAPABILITY_SELECTION: Array<[string, string]> = [
  ['REFERENCE_ONLY', 'Reference Only'],
  ['TEXT_AVAILABLE', 'Text Available'],
  ['TOKENIZABLE', 'Tokenizable'],
  ['MANUSCRIPT_METADATA', 'Manuscript Metadata'],
  ['STRUCTURED_DATASET', 'Structured Dataset']
]

export const PASSAGE_TYPE_SELECTION: Array<[string, string]> = [
  ['SURAH', 'Surah'],
  ['AYAH', 'Ayah'],
  ['BOOK', 'Book'],
  ['CHAPTER', 'Chapter'],
  ['PSALM', 'Psalm'],
  ['VERSE', 'Verse'],
  ['SECTION', 'Section'],
  ['PERICOPE', 'Pericope'],
  ['UNIT', 'Unit']
]

export const CONTENT_TYPE_SELECTION: Array<[string, string]> = [
  ['ORIGINAL_TEXT', 'Original Text'],
  ['TEXTUAL_WITNESS', 'Textual Witness'],
  ['TRANSLATION', 'Translation'],
  ['TRANSLITERATION', 'Transliteration'],
  ['LEXICAL_GLOSS', 'Lexical Gloss'],
  ['COMMENTARY', 'Commentary'],
  ['TAFSIR', 'Tafsir'],
  ['SUMMARY', 'Summary'],
  ['FOOTNOTE', 'Footnote'],
  ['MATN', 'Matn']
]

export const TEXT_EDITION_TYPE_SELECTION: Array<[string, string]> = [
  ['ORIGINAL', 'Original Text Edition'],
  ['TEXTUAL_WITNESS', 'Textual Witness'],
  ['TRANSLATION', 'Translation'],
  ['COMMENTARY', 'Commentary'],
  ['MANUSCRIPT', 'Manuscript'],
  ['DATASET', 'Dataset']
]

export const RECORD_STATUS_SELECTION: Array<[string, string]> = [
  ['DRAFT', 'Draft'],
  ['APPROVED', 'Approved'],
  ['PROVISIONAL', 'Provisional'],
  ['SUPERSEDED', 'Superseded'],
  ['EXCLUDED', 'Excluded']
]

export const SOURCE_POLICY_ROLE_SELECTION: Array<[string, string]> = [
  ['PRIMARY_NORMATIVE', 'Primary Normative'],
  ['COMPLEMENTARY_REVELATION_REFERENCE', 'Complementary Revelation Reference'],
  ['CORROBORATIVE_TEXTUAL_WITNESS', 'Corroborative Textual Witness'],
  ['TRADITION_CONTEXT', 'Tradition Context'],
  ['INTERPRETIVE_CONTEXT', 'Interpretive Context'],
  ['RESEARCH_ONLY', 'Research Only'],
  ['EXCLUDED', 'Excluded']
]

export function parseKindList(value: unknown): string[] {
  if (typeof value !== 'string' || !value.trim()) return []
  return [...new Set(value.split(',').map((item) => item.trim().toUpperCase()).filter(Boolean))].sort()
}

export function serializeKindList(values: string[]): string {
  return [...new Set(values.map((item) => item.trim().toUpperCase()).filter(Boolean))].sort().join(',')
}
