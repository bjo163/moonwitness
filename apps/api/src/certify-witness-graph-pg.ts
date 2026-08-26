import assert from 'node:assert/strict'
import baseAddons from '@moon/base'
import {
  WitnessGraphService,
  WxEntity,
  WxEntityAlias,
  WxProvenance,
  WxRelation,
  WxRelationType,
  WxReligion,
  WxSource,
  WxSourcePolicy,
  seedWitnessGraphCore,
  default as witnessAddons
} from '@moon/witness'
import {
  createCtx,
  forge,
  getDb,
  getModel,
  registerModel,
  setupOrm,
  SUPERUSER_ID
} from '@moon/orm'

const databaseUrl = process.env.TEST_DATABASE_URL
if (!databaseUrl) {
  throw new Error('TEST_DATABASE_URL is required for Witness PostgreSQL certification')
}
const resolvedDatabaseUrl: string = databaseUrl

function scalarId(row: Record<string, any>, camel: string, snake: string): number {
  const raw = row[camel] ?? row[snake]
  return Number(Array.isArray(raw) ? raw[0] : raw ?? 0)
}

async function count(table: string): Promise<number> {
  const db = getDb()
  const result = await db(table).count<{ count: string | number }[]>({ count: '*' })
  return Number(result[0]?.count ?? 0)
}

async function tableExists(table: string): Promise<boolean> {
  const db = getDb()
  const row = await db('information_schema.tables')
    .select('table_name')
    .where({ table_schema: 'public', table_name: table })
    .first()
  return Boolean(row)
}

async function hasForeignKey(table: string, column: string, target: string): Promise<boolean> {
  const db = getDb()
  const result = await db.raw(`
    SELECT 1
    FROM information_schema.table_constraints tc
    JOIN information_schema.key_column_usage kcu
      ON tc.constraint_name = kcu.constraint_name
     AND tc.constraint_schema = kcu.constraint_schema
    JOIN information_schema.constraint_column_usage ccu
      ON tc.constraint_name = ccu.constraint_name
     AND tc.constraint_schema = ccu.constraint_schema
    WHERE tc.constraint_type = 'FOREIGN KEY'
      AND tc.table_schema = 'public'
      AND tc.table_name = ?
      AND kcu.column_name = ?
      AND ccu.table_name = ?
    LIMIT 1
  `, [table, column, target])
  return (result.rows?.length ?? 0) > 0
}

async function main() {
  for (const model of [...baseAddons.models, ...witnessAddons.models]) {
    registerModel(model)
  }
  setupOrm(resolvedDatabaseUrl)

  const firstForge = await forge()
  assert.equal(firstForge.pending.length, 0, 'fresh PostgreSQL forge must have no pending unsafe changes')

  const requiredTables = [
    'wx_entity',
    'wx_entity_alias',
    'wx_entity_identifier',
    'wx_source',
    'wx_source_policy',
    'wx_provenance',
    'wx_relation_type',
    'wx_relation',
    'wx_religion',
    'wx_community'
  ]
  for (const table of requiredTables) {
    assert.equal(await tableExists(table), true, `forge must create ${table}`)
  }

  assert.equal(await hasForeignKey('wx_relation', 'from_entity_id', 'wx_entity'), true)
  assert.equal(await hasForeignKey('wx_relation', 'to_entity_id', 'wx_entity'), true)
  assert.equal(await hasForeignKey('wx_relation', 'provenance_id', 'wx_provenance'), true)
  assert.equal(await hasForeignKey('wx_provenance', 'source_id', 'wx_source'), true)
  assert.equal(await hasForeignKey('wx_source_policy', 'source_id', 'wx_source'), true)

  const seedOne = await seedWitnessGraphCore()
  const relationTypesAfterFirstSeed = await count('wx_relation_type')
  const religionsAfterFirstSeed = await count('wx_religion')
  const seedTwo = await seedWitnessGraphCore()

  assert.equal(seedOne.ontologyVersion, seedTwo.ontologyVersion)
  assert.equal(seedOne.relationTypeCount, seedTwo.relationTypeCount)
  assert.equal(await count('wx_relation_type'), relationTypesAfterFirstSeed, 'relation ontology seed must be idempotent')
  assert.equal(await count('wx_religion'), religionsAfterFirstSeed, 'religion context seed must be idempotent')
  assert.equal(religionsAfterFirstSeed, 3, 'graph core must seed only the three initial context taxonomies')

  const env = createCtx(SUPERUSER_ID, {}, getModel)

  const source = await WxSource.spawn(WxSource, env, {
    stableKey: 'cert:quran:witness:r1',
    name: 'Witness Graph Certification Qur’an Fixture',
    sourceClass: 'REVELATION',
    capability: 'TEXT_AVAILABLE',
    scriptureFamily: 'QURAN',
    revision: 'cert-r1',
    artifactChecksum: 'a'.repeat(64),
    active: true
  })

  const policy = await WxSourcePolicy.spawn(WxSourcePolicy, env, {
    stableKey: 'cert:policy:quran-core:v1',
    policyCode: 'CERT_QURAN_CORE',
    policyVersion: '1',
    sourceId: source.id,
    sourceRevision: 'cert-r1',
    role: 'PRIMARY_NORMATIVE',
    originalRevelationEquated: false,
    allowedEngineUses: 'certification',
    active: true
  })
  assert.equal(policy.original_revelation_equated ?? policy.originalRevelationEquated, false)

  const provenance = await WxProvenance.spawn(WxProvenance, env, {
    stableKey: 'cert:prov:quran:2:255:r1',
    sourceId: source.id,
    sourceReference: 'QURAN 2:255 certification fixture',
    sourceRevision: 'cert-r1',
    artifactChecksum: 'a'.repeat(64),
    parserVersion: 'cert-v1',
    importerVersion: 'cert-v1',
    superseded: false,
    active: true
  })

  const passage = await WxEntity.spawn(WxEntity, env, {
    canonicalKey: 'cert:passage:quran:2:255',
    kind: 'PASSAGE',
    label: 'Qur’an 2:255 Certification Fixture',
    sourceClass: 'REVELATION',
    epistemicLane: 'CORE',
    authorityClass: 'PRIMARY_SOURCE',
    operationalStatus: 'ESTABLISHED',
    sourceRevision: 'cert-r1',
    active: true
  })
  const musa = await WxEntity.spawn(WxEntity, env, {
    canonicalKey: 'cert:figure:musa',
    kind: 'PERSON',
    label: 'Musa',
    sourceClass: 'SCRIPTURAL_METADATA',
    epistemicLane: 'CORE',
    authorityClass: 'SOURCE_SUMMARY',
    operationalStatus: 'ESTABLISHED',
    active: true
  })
  const isa = await WxEntity.spawn(WxEntity, env, {
    canonicalKey: 'cert:figure:isa',
    kind: 'PERSON',
    label: 'Isa',
    sourceClass: 'SCRIPTURAL_METADATA',
    epistemicLane: 'CORE',
    authorityClass: 'SOURCE_SUMMARY',
    operationalStatus: 'ESTABLISHED',
    active: true
  })

  await WxEntityAlias.spawn(WxEntityAlias, env, {
    entityId: musa.id,
    label: 'Moses',
    normalizedLabel: 'moses',
    aliasType: 'ALTERNATE',
    epistemicLane: 'CORE',
    active: true
  })

  const mentionOne = await WitnessGraphService.createRelation(env, {
    fromEntityId: passage.id,
    relationTypeCode: 'MENTIONS',
    toEntityId: musa.id,
    provenanceId: provenance.id,
    confidenceBp: 9300
  })
  const mentionTwo = await WitnessGraphService.createRelation(env, {
    fromEntityId: passage.id,
    relationTypeCode: 'MENTIONS',
    toEntityId: musa.id,
    provenanceId: provenance.id,
    confidenceBp: 9300
  })
  assert.equal(mentionOne.id, mentionTwo.id, 'same sourced relation must be idempotent')
  assert.equal(scalarId(mentionOne, 'sourceId', 'source_id'), source.id)
  assert.equal(mentionOne.source_class ?? mentionOne.sourceClass, 'REVELATION')

  const parallelOne = await WitnessGraphService.createRelation(env, {
    fromEntityId: musa.id,
    relationTypeCode: 'PARALLELS',
    toEntityId: isa.id,
    provenanceId: provenance.id,
    operationalStatus: 'PROVISIONAL',
    confidenceBp: 5000
  })
  const parallelTwo = await WitnessGraphService.createRelation(env, {
    fromEntityId: isa.id,
    relationTypeCode: 'PARALLELS',
    toEntityId: musa.id,
    provenanceId: provenance.id,
    operationalStatus: 'PROVISIONAL',
    confidenceBp: 5000
  })
  assert.equal(parallelOne.id, parallelTwo.id, 'symmetric relation must converge to one edge')

  const path = await WitnessGraphService.pathBetween(env, passage.id, isa.id, 2)
  assert.deepEqual(path?.nodes.map((row) => row.id), [passage.id, musa.id, isa.id])
  assert.equal(path?.relations.length, 2)

  const aliases = await WitnessGraphService.aliases(env, musa.id)
  assert.equal(aliases.some((row) => row.label === 'Moses'), true)

  const provenanceBundle = await WitnessGraphService.relationProvenance(env, mentionOne.id)
  assert.equal(provenanceBundle?.provenance?.id, provenance.id)
  assert.equal(provenanceBundle?.source?.id, source.id)

  await assert.rejects(
    WitnessGraphService.createRelation(env, {
      fromEntityId: passage.id,
      relationTypeCode: 'MENTIONS',
      toEntityId: musa.id,
      provenanceId: 999999
    }),
    /Provenance 999999/
  )

  await assert.rejects(
    WitnessGraphService.createRelation(env, {
      fromEntityId: passage.id,
      relationTypeCode: 'MENTIONS',
      toEntityId: isa.id,
      provenanceId: provenance.id,
      sourceClass: 'TEXTUAL_WITNESS'
    }),
    /does not match source classification/
  )

  await assert.rejects(
    WitnessGraphService.createRelation(env, {
      fromEntityId: musa.id,
      relationTypeCode: 'SAME_AS',
      toEntityId: isa.id,
      provenanceId: provenance.id,
      operationalStatus: 'ESTABLISHED',
      confidenceBp: 10000
    }),
    /requires review before ESTABLISHED/
  )

  await assert.rejects(
    WxEntity.spawn(WxEntity, env, {
      canonicalKey: 'cert:figure:musa',
      kind: 'PERSON',
      sourceClass: 'UNKNOWN',
      epistemicLane: 'UNRESOLVED',
      authorityClass: 'NOT_APPLICABLE',
      operationalStatus: 'PROVISIONAL',
      active: true
    }),
    /duplicate key|unique/i,
    'PostgreSQL must enforce canonical entity uniqueness'
  )

  const seededReligionRows = await WxReligion.fetch(WxReligion, env, [['active', '=', true]])
  assert.equal(seededReligionRows.length, 3)
  for (const religion of seededReligionRows) {
    const entityId = scalarId(religion, 'entityId', 'entity_id')
    const religionEntity = await WitnessGraphService.entity(env, entityId)
    assert.equal(religionEntity?.source_class ?? religionEntity?.sourceClass, 'GOVERNANCE_RECORD')
    assert.equal(religionEntity?.authority_class ?? religionEntity?.authorityClass, 'NOT_APPLICABLE')
  }

  const secondForge = await forge()
  assert.equal(secondForge.pending.length, 0, 'second forge must have no pending changes')
  assert.equal(secondForge.applied.length, 0, 'second forge must be schema-idempotent')

  assert.equal(await count('wx_relation'), 2, 'cert fixture must contain exactly one MENTIONS and one PARALLELS relation')
  assert.equal(await count('wx_relation_type'), relationTypesAfterFirstSeed)

  console.log(JSON.stringify({
    ok: true,
    postgres: true,
    ontologyVersion: seedOne.ontologyVersion,
    relationTypes: relationTypesAfterFirstSeed,
    religionContexts: religionsAfterFirstSeed,
    appliedOnFreshForge: firstForge.applied.length,
    appliedOnSecondForge: secondForge.applied.length
  }))
}

main()
  .catch((error) => {
    console.error('[witness.pg-certification] FAILED', error)
    process.exitCode = 1
  })
  .finally(async () => {
    try {
      await getDb().destroy()
    } catch {
      // setup errors may occur before a DB handle is available
    }
  })
