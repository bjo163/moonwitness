import { serializeKindList } from './contracts.js'

export interface RelationTypeSeed {
  code: string
  name: string
  inverseCode?: string
  symmetric?: boolean
  transitive?: boolean
  selfLoopAllowed?: boolean
  provenanceRequired?: boolean
  reviewRequired?: boolean
  sourceKinds?: string[]
  targetKinds?: string[]
  semantics: string
}

export const WITNESS_RELATION_ONTOLOGY_VERSION = 'WITNESS_RELATION_V1'

export const WITNESS_RELATION_TYPES: RelationTypeSeed[] = [
  { code: 'SAME_AS', name: 'Same As', symmetric: true, reviewRequired: true, provenanceRequired: true, semantics: 'Strict identity equivalence. Review is mandatory; similarity alone is insufficient.' },
  { code: 'ALIAS_OF', name: 'Alias Of', provenanceRequired: true, semantics: 'Source-attested alternate label or identity surface.' },
  { code: 'ASSOCIATED_WITH', name: 'Associated With', symmetric: true, provenanceRequired: true, semantics: 'General sourced association; does not imply identity or authority equivalence.' },
  { code: 'MEMBER_OF', name: 'Member Of', inverseCode: 'HAS_MEMBER', provenanceRequired: true, semantics: 'Membership/context relation.' },
  { code: 'HAS_MEMBER', name: 'Has Member', inverseCode: 'MEMBER_OF', provenanceRequired: true, semantics: 'Inverse of MEMBER_OF.' },
  { code: 'ROLE_IN', name: 'Role In', provenanceRequired: true, semantics: 'Person/entity has a sourced role in another entity/context.' },
  { code: 'MENTIONS', name: 'Mentions', provenanceRequired: true, sourceKinds: ['PASSAGE', 'TRADITION_UNIT', 'CONTENT_WITNESS'], semantics: 'A source unit explicitly mentions the target.' },
  { code: 'ABOUT', name: 'About', provenanceRequired: true, semantics: 'A source/content unit is about a target concept/entity.' },
  { code: 'REFERS_TO', name: 'Refers To', provenanceRequired: true, semantics: 'Explicit or accepted reference relation.' },
  { code: 'QUOTES', name: 'Quotes', provenanceRequired: true, sourceKinds: ['PASSAGE', 'TRADITION_UNIT', 'CONTENT_WITNESS', 'WORK'], targetKinds: ['PASSAGE', 'CONTENT_WITNESS', 'TRADITION_UNIT', 'WORK'], semantics: 'Source content quotes another content witness/unit.' },
  { code: 'PARALLELS', name: 'Parallels', symmetric: true, provenanceRequired: true, reviewRequired: true, semantics: 'Reviewed textual/conceptual parallel. It never implies same-as or fulfillment.' },
  { code: 'EXPLAINS', name: 'Explains', provenanceRequired: true, semantics: 'Interpretive/explanatory relation; authority remains source-specific.' },
  { code: 'TRANSLATES', name: 'Translates', inverseCode: 'TRANSLATED_BY', provenanceRequired: true, sourceKinds: ['CONTENT_WITNESS'], targetKinds: ['CONTENT_WITNESS'], semantics: 'Content witness translates another content witness.' },
  { code: 'TRANSLATED_BY', name: 'Translated By', inverseCode: 'TRANSLATES', provenanceRequired: true, sourceKinds: ['CONTENT_WITNESS'], targetKinds: ['CONTENT_WITNESS'], semantics: 'Inverse of TRANSLATES.' },
  { code: 'DERIVED_FROM', name: 'Derived From', inverseCode: 'HAS_DERIVATION', provenanceRequired: true, semantics: 'Derived record was produced from a source record.' },
  { code: 'HAS_DERIVATION', name: 'Has Derivation', inverseCode: 'DERIVED_FROM', provenanceRequired: true, semantics: 'Inverse of DERIVED_FROM.' },
  { code: 'SUPPORTS', name: 'Supports', provenanceRequired: true, semantics: 'Evidence supports a claim/relation without making it automatically true.' },
  { code: 'CONTRADICTS', name: 'Contradicts', symmetric: true, provenanceRequired: true, semantics: 'Material contradiction/conflict relation; both sides remain preserved.' },
  { code: 'CORROBORATES', name: 'Corroborates', symmetric: true, provenanceRequired: true, semantics: 'Independent/source-aware corroboration. Lineage independence must be checked by scoring.' },
  { code: 'CONTEXTUALIZES', name: 'Contextualizes', provenanceRequired: true, semantics: 'Provides context without replacing or overriding the target.' },
  { code: 'QUALIFIES', name: 'Qualifies', provenanceRequired: true, semantics: 'Narrows or qualifies a claim/relation.' },
  { code: 'TEACHER_OF', name: 'Teacher Of', inverseCode: 'STUDENT_OF', provenanceRequired: true, sourceKinds: ['PERSON'], targetKinds: ['PERSON'], semantics: 'Sourced teaching relation.' },
  { code: 'STUDENT_OF', name: 'Student Of', inverseCode: 'TEACHER_OF', provenanceRequired: true, sourceKinds: ['PERSON'], targetKinds: ['PERSON'], semantics: 'Inverse of TEACHER_OF.' },
  { code: 'PARENT_OF', name: 'Parent Of', inverseCode: 'CHILD_OF', provenanceRequired: true, sourceKinds: ['PERSON'], targetKinds: ['PERSON'], semantics: 'Sourced parent relation.' },
  { code: 'CHILD_OF', name: 'Child Of', inverseCode: 'PARENT_OF', provenanceRequired: true, sourceKinds: ['PERSON'], targetKinds: ['PERSON'], semantics: 'Inverse of PARENT_OF.' },
  { code: 'DESCENDANT_OF', name: 'Descendant Of', provenanceRequired: true, sourceKinds: ['PERSON'], targetKinds: ['PERSON'], semantics: 'Sourced descent relation; not assumed transitive unless domain certification allows it.' },
  { code: 'LIVED_IN', name: 'Lived In', provenanceRequired: true, sourceKinds: ['PERSON'], targetKinds: ['PLACE'], semantics: 'Sourced person/place association.' },
  { code: 'OCCURRED_AT', name: 'Occurred At', provenanceRequired: true, sourceKinds: ['EVENT'], targetKinds: ['PLACE'], semantics: 'Event/place relation with explicit occurrence state handled by Event domain.' },
  { code: 'ASSOCIATED_WITH_RELIGION', name: 'Associated With Religion', provenanceRequired: true, targetKinds: ['RELIGION'], semantics: 'Context only. This relation never changes Revelation/source authority.' },
  { code: 'ASSOCIATED_WITH_COMMUNITY', name: 'Associated With Community', provenanceRequired: true, targetKinds: ['COMMUNITY'], semantics: 'Community/tradition context only.' },
  { code: 'USED_BY', name: 'Used By', provenanceRequired: true, targetKinds: ['RELIGION', 'COMMUNITY'], semantics: 'A source/text tradition is used by a community/religion context.' },
  { code: 'PRESERVED_IN', name: 'Preserved In', provenanceRequired: true, semantics: 'A textual/source witness is preserved in an edition, manuscript, corpus or community context.' }
]

export function relationSeedValues(seed: RelationTypeSeed) {
  return {
    code: seed.code,
    name: seed.name,
    isSymmetric: seed.symmetric ?? false,
    transitive: seed.transitive ?? false,
    selfLoopAllowed: seed.selfLoopAllowed ?? false,
    provenanceRequired: seed.provenanceRequired ?? true,
    reviewRequired: seed.reviewRequired ?? false,
    allowedSourceKinds: serializeKindList(seed.sourceKinds ?? []),
    allowedTargetKinds: serializeKindList(seed.targetKinds ?? []),
    ontologyVersion: WITNESS_RELATION_ONTOLOGY_VERSION,
    semantics: seed.semantics,
    active: true
  }
}
