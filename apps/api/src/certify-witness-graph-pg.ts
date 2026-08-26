import assert from "node:assert/strict"
import baseAddons from "@moon/base"
import {
  WitnessGraphService,
  WxEntity,
  WxEntityAlias,
  WxEngineResult,
  MoonOrmEngineRunStore,
  WitnessEngineRegistry,
  WitnessEngineRuntime,
  checksumEngineResult,
  createFigureAnalysisModule,
  createTraditionTransmissionModule,
  WxProvenance,
  WxRelation,
  WxRelationType,
  WxReligion,
  WxSource,
  WxSourcePolicy,
  WxFigure,
  WxFigureName,
  WxFigureRole,
  WxTraditionCorpus,
  WxTraditionUnit,
  WxTraditionReference,
  WxTraditionAttribution,
  WxTransmissionChain,
  WxTransmissionLink,
  WxTraditionAssessment,
  seedWitnessGraphCore,
  default as witnessAddons,
} from "@moon/witness"
import {
  createCtx,
  forge,
  getDb,
  getModel,
  registerModel,
  setupOrm,
  SUPERUSER_ID,
} from "@moon/orm"

const databaseUrl = process.env.TEST_DATABASE_URL
const CHECKSUM_LENGTH = 64
if (!databaseUrl) {
  throw new Error(
    "TEST_DATABASE_URL is required for Witness PostgreSQL certification"
  )
}
const resolvedDatabaseUrl: string = databaseUrl

function scalarId(
  row: Record<string, any>,
  camel: string,
  snake: string
): number {
  const raw = row[camel] ?? row[snake]
  return Number(Array.isArray(raw) ? raw[0] : (raw ?? 0))
}

async function count(table: string): Promise<number> {
  const db = getDb()
  const result = await db(table).count<{ count: string | number }[]>({
    count: "*",
  })
  return Number(result[0]?.count ?? 0)
}

async function tableExists(table: string): Promise<boolean> {
  const db = getDb()
  const row = await db("information_schema.tables")
    .select("table_name")
    .where({ table_schema: "public", table_name: table })
    .first()
  return Boolean(row)
}

async function hasForeignKey(
  table: string,
  column: string,
  target: string
): Promise<boolean> {
  const db = getDb()
  const result = await db.raw(
    `
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
  `,
    [table, column, target]
  )
  return (result.rows?.length ?? 0) > 0
}

async function main() {
  for (const model of [...baseAddons.models, ...witnessAddons.models]) {
    registerModel(model)
  }
  setupOrm(resolvedDatabaseUrl)

  const firstForge = await forge()
  assert.equal(
    firstForge.pending.length,
    0,
    "fresh PostgreSQL forge must have no pending unsafe changes"
  )

  const requiredTables = [
    "wx_entity",
    "wx_entity_alias",
    "wx_entity_identifier",
    "wx_source",
    "wx_source_policy",
    "wx_provenance",
    "wx_relation_type",
    "wx_relation",
    "wx_religion",
    "wx_community",
    "wx_passage",
    "wx_text_edition",
    "wx_content",
    "wx_root",
    "wx_lexeme",
    "wx_lexical_occurrence",
    "wx_revelation_event",
    "wx_revelation_event_passage",
    "wx_figure",
    "wx_figure_name",
    "wx_figure_role",
    "wx_tradition_corpus",
    "wx_tradition_unit",
    "wx_tradition_reference",
    "wx_tradition_attribution",
    "wx_transmission_chain",
    "wx_transmission_link",
    "wx_tradition_assessment",
    "wx_concept",
    "wx_assertion",
    "wx_evidence",
    "wx_divine_expression",
    "wx_divine_expression_occurrence",
    "wx_legacy_mapping",
    "wx_engine_run",
    "wx_engine_result",
    "wx_research_hypothesis",
    "wx_research_run",
    "wx_score_result",
  ]
  for (const table of requiredTables) {
    assert.equal(await tableExists(table), true, `forge must create ${table}`)
  }

  assert.equal(
    await hasForeignKey("wx_relation", "from_entity_id", "wx_entity"),
    true
  )
  assert.equal(
    await hasForeignKey("wx_relation", "to_entity_id", "wx_entity"),
    true
  )
  assert.equal(
    await hasForeignKey("wx_relation", "provenance_id", "wx_provenance"),
    true
  )
  assert.equal(
    await hasForeignKey("wx_provenance", "source_id", "wx_source"),
    true
  )
  assert.equal(
    await hasForeignKey("wx_source_policy", "source_id", "wx_source"),
    true
  )
  assert.equal(
    await hasForeignKey("wx_passage", "scripture_id", "wx_scripture"),
    true
  )
  assert.equal(
    await hasForeignKey("wx_passage", "parent_id", "wx_passage"),
    true
  )
  assert.equal(
    await hasForeignKey("wx_content", "passage_id", "wx_passage"),
    true
  )
  assert.equal(
    await hasForeignKey("wx_content", "edition_id", "wx_text_edition"),
    true
  )
  assert.equal(await hasForeignKey("wx_figure", "entity_id", "wx_entity"), true)
  assert.equal(
    await hasForeignKey(
      "wx_tradition_unit",
      "corpus_id",
      "wx_tradition_corpus"
    ),
    true
  )
  assert.equal(
    await hasForeignKey(
      "wx_transmission_link",
      "chain_id",
      "wx_transmission_chain"
    ),
    true
  )
  assert.equal(
    await hasForeignKey("wx_evidence", "assertion_id", "wx_assertion"),
    true
  )
  assert.equal(
    await hasForeignKey(
      "wx_divine_expression_occurrence",
      "passage_id",
      "wx_passage"
    ),
    true
  )
  assert.equal(
    await hasForeignKey("wx_engine_run", "parent_run_id", "wx_engine_run"),
    true
  )
  assert.equal(
    await hasForeignKey("wx_engine_run", "rerun_of_id", "wx_engine_run"),
    true
  )
  assert.equal(
    await hasForeignKey("wx_engine_result", "run_id", "wx_engine_run"),
    true
  )
  assert.equal(await hasForeignKey("wx_research_run", "hypothesis_id", "wx_research_hypothesis"), true)
  assert.equal(await hasForeignKey("wx_research_run", "engine_run_id", "wx_engine_run"), true)
  assert.equal(await hasForeignKey("wx_score_result", "target_entity_id", "wx_entity"), true)

  const seedOne = await seedWitnessGraphCore()
  const relationTypesAfterFirstSeed = await count("wx_relation_type")
  const religionsAfterFirstSeed = await count("wx_religion")
  const seedTwo = await seedWitnessGraphCore()

  assert.equal(seedOne.ontologyVersion, seedTwo.ontologyVersion)
  assert.equal(seedOne.relationTypeCount, seedTwo.relationTypeCount)
  assert.equal(
    await count("wx_relation_type"),
    relationTypesAfterFirstSeed,
    "relation ontology seed must be idempotent"
  )
  assert.equal(
    await count("wx_religion"),
    religionsAfterFirstSeed,
    "religion context seed must be idempotent"
  )
  assert.equal(
    religionsAfterFirstSeed,
    3,
    "graph core must seed only the three initial context taxonomies"
  )

  const env = createCtx(SUPERUSER_ID, {}, getModel)

  const source = await WxSource.spawn(WxSource, env, {
    stableKey: "cert:quran:witness:r1",
    name: "Witness Graph Certification Qur’an Fixture",
    sourceClass: "REVELATION",
    capability: "TEXT_AVAILABLE",
    scriptureFamily: "QURAN",
    revision: "cert-r1",
    artifactChecksum: "a".repeat(CHECKSUM_LENGTH),
    active: true,
  })

  const policy = await WxSourcePolicy.spawn(WxSourcePolicy, env, {
    code: "CERT_QURAN_CORE",
    name: "Certification Qur’an Core Policy",
    authorityClass: "REVELATION",
    allowedEngineUse: "NORMATIVE_CORE",
    revelationFamily: "QURAN",
    stableKey: "cert:policy:quran-core:v1",
    policyCode: "CERT_QURAN_CORE",
    policyVersion: "1",
    sourceId: source.id,
    sourceRevision: "cert-r1",
    role: "PRIMARY_NORMATIVE",
    originalRevelationEquated: false,
    allowedEngineUses: "certification",
    active: true,
  })
  assert.equal(
    policy.original_revelation_equated ?? policy.originalRevelationEquated,
    false
  )

  const provenance = await WxProvenance.spawn(WxProvenance, env, {
    stableKey: "cert:prov:quran:2:255:r1",
    sourceId: source.id,
    sourceReference: "QURAN 2:255 certification fixture",
    sourceRevision: "cert-r1",
    artifactChecksum: "a".repeat(CHECKSUM_LENGTH),
    parserVersion: "cert-v1",
    importerVersion: "cert-v1",
    superseded: false,
    active: true,
  })

  const engineStore = new MoonOrmEngineRunStore()
  const engineRun = await engineStore.create(env, {
    runKey: "cert:engine:run:1",
    moduleCode: "cert.fixture",
    moduleVersion: "1.0.0",
    runtimeVersion: "1.0.0",
    inputSchemaVersion: "CERT_INPUT_V1",
    outputSchemaVersion: "CERT_OUTPUT_V1",
    deterministic: true,
    input: { fixture: true },
    inputChecksum: "b".repeat(CHECKSUM_LENGTH),
    scope: {
      scriptureFamilies: ["QURAN", "TAWRAT", "ZABUR", "INJIL"],
      sourceRevisions: [],
      languagePreferences: [],
      authorityClasses: ["PRIMARY_SOURCE"],
      includeHadith: false,
      includeDerivedAssertions: false,
      figureIds: [],
      conceptIds: [],
      relationCodes: [],
      eventIds: [],
      placeIds: [],
      traversal: { maxDepth: 2, maxNodes: 100 },
    },
    scopeChecksum: "c".repeat(CHECKSUM_LENGTH),
    sourceRevisions: [],
    ontologyVersion: "WITNESS_RELATION_V1",
    identityChecksum: "d".repeat(CHECKSUM_LENGTH),
    status: "RUNNING",
    startedAt: "2026-01-01T00:00:00.000Z",
    completedAt: undefined,
  })
  const engineResult = {
    protocol: "WITNESS_ENGINE_RESULT_V1" as const,
    runId: engineRun.id,
    summary: "Certification engine result",
    findings: [],
    conflicts: [],
    unresolved: [],
    sourceRevisions: [],
    provenanceSummary: { evidenceCount: 0, provenanceRefs: [] },
    diagnostics: [],
  }
  await engineStore.complete(
    env,
    engineRun.id,
    engineResult,
    "e".repeat(CHECKSUM_LENGTH)
  )
  const storedEngineResult = await engineStore.getResult(env, engineRun.id)
  assert.equal(storedEngineResult?.runId, engineRun.id)
  const engineResultRows = await WxEngineResult.fetch(WxEngineResult, env, [
    ["runId", "=", Number(engineRun.id)],
  ])
  assert.equal(
    scalarId(engineResultRows[0], "runId", "run_id"),
    Number(engineRun.id)
  )
  await assert.rejects(
    engineStore.complete(
      env,
      engineRun.id,
      engineResult,
      "e".repeat(CHECKSUM_LENGTH)
    ),
    /immutable/
  )

  const passage = await WxEntity.spawn(WxEntity, env, {
    canonicalKey: "cert:passage:quran:2:255",
    kind: "PASSAGE",
    label: "Qur’an 2:255 Certification Fixture",
    sourceClass: "REVELATION",
    epistemicLane: "CORE",
    authorityClass: "PRIMARY_SOURCE",
    operationalStatus: "ESTABLISHED",
    sourceRevision: "cert-r1",
    active: true,
  })
  const musa = await WxEntity.spawn(WxEntity, env, {
    canonicalKey: "cert:figure:musa",
    kind: "PERSON",
    label: "Musa",
    sourceClass: "SCRIPTURAL_METADATA",
    epistemicLane: "CORE",
    authorityClass: "SOURCE_SUMMARY",
    operationalStatus: "ESTABLISHED",
    active: true,
  })
  const isa = await WxEntity.spawn(WxEntity, env, {
    canonicalKey: "cert:figure:isa",
    kind: "PERSON",
    label: "Isa",
    sourceClass: "SCRIPTURAL_METADATA",
    epistemicLane: "CORE",
    authorityClass: "SOURCE_SUMMARY",
    operationalStatus: "ESTABLISHED",
    active: true,
  })

  await WxEntityAlias.spawn(WxEntityAlias, env, {
    entityId: musa.id,
    label: "Moses",
    normalizedLabel: "moses",
    aliasType: "ALTERNATE",
    epistemicLane: "CORE",
    active: true,
  })

  const mentionOne = await WitnessGraphService.createRelation(env, {
    fromEntityId: passage.id,
    relationTypeCode: "MENTIONS",
    toEntityId: musa.id,
    provenanceId: provenance.id,
    confidenceBp: 9300,
  })
  const mentionTwo = await WitnessGraphService.createRelation(env, {
    fromEntityId: passage.id,
    relationTypeCode: "MENTIONS",
    toEntityId: musa.id,
    provenanceId: provenance.id,
    confidenceBp: 9300,
  })
  assert.equal(
    mentionOne.id,
    mentionTwo.id,
    "same sourced relation must be idempotent"
  )
  assert.equal(scalarId(mentionOne, "sourceId", "source_id"), source.id)
  assert.equal(mentionOne.source_class ?? mentionOne.sourceClass, "REVELATION")

  const parallelOne = await WitnessGraphService.createRelation(env, {
    fromEntityId: musa.id,
    relationTypeCode: "PARALLELS",
    toEntityId: isa.id,
    provenanceId: provenance.id,
    operationalStatus: "PROVISIONAL",
    confidenceBp: 5000,
  })
  const parallelTwo = await WitnessGraphService.createRelation(env, {
    fromEntityId: isa.id,
    relationTypeCode: "PARALLELS",
    toEntityId: musa.id,
    provenanceId: provenance.id,
    operationalStatus: "PROVISIONAL",
    confidenceBp: 5000,
  })
  assert.equal(
    parallelOne.id,
    parallelTwo.id,
    "symmetric relation must converge to one edge"
  )

  const path = await WitnessGraphService.pathBetween(env, passage.id, isa.id, 2)
  assert.deepEqual(
    path?.nodes.map((row) => row.id),
    [passage.id, musa.id, isa.id]
  )
  assert.equal(path?.relations.length, 2)

  const aliases = await WitnessGraphService.aliases(env, musa.id)
  assert.equal(
    aliases.some((row) => row.label === "Moses"),
    true
  )

  const provenanceBundle = await WitnessGraphService.relationProvenance(
    env,
    mentionOne.id
  )
  assert.equal(provenanceBundle?.provenance?.id, provenance.id)
  assert.equal(provenanceBundle?.source?.id, source.id)

  await assert.rejects(
    WitnessGraphService.createRelation(env, {
      fromEntityId: passage.id,
      relationTypeCode: "MENTIONS",
      toEntityId: musa.id,
      provenanceId: 999999,
    }),
    /Provenance 999999/
  )

  await assert.rejects(
    WitnessGraphService.createRelation(env, {
      fromEntityId: passage.id,
      relationTypeCode: "MENTIONS",
      toEntityId: isa.id,
      provenanceId: provenance.id,
      sourceClass: "TEXTUAL_WITNESS",
    }),
    /does not match source classification/
  )

  await assert.rejects(
    WitnessGraphService.createRelation(env, {
      fromEntityId: musa.id,
      relationTypeCode: "SAME_AS",
      toEntityId: isa.id,
      provenanceId: provenance.id,
      operationalStatus: "ESTABLISHED",
      confidenceBp: 10000,
    }),
    /requires review before ESTABLISHED/
  )

  await assert.rejects(
    WxEntity.spawn(WxEntity, env, {
      canonicalKey: "cert:figure:musa",
      kind: "PERSON",
      sourceClass: "UNKNOWN",
      epistemicLane: "UNRESOLVED",
      authorityClass: "NOT_APPLICABLE",
      operationalStatus: "PROVISIONAL",
      active: true,
    }),
    /duplicate key|unique/i,
    "PostgreSQL must enforce canonical entity uniqueness"
  )

  const seededReligionRows = await WxReligion.fetch(WxReligion, env, [
    ["active", "=", true],
  ])
  assert.equal(seededReligionRows.length, 3)
  for (const religion of seededReligionRows) {
    const entityId = scalarId(religion, "entityId", "entity_id")
    const religionEntity = await WitnessGraphService.entity(env, entityId)
    assert.equal(
      religionEntity?.source_class ?? religionEntity?.sourceClass,
      "GOVERNANCE_RECORD"
    )
    assert.equal(
      religionEntity?.authority_class ?? religionEntity?.authorityClass,
      "NOT_APPLICABLE"
    )
  }

  // ── Figure & Tradition Analysis Engines Certification (#59) ──
  const figure = await WxFigure.spawn(WxFigure, env, {
    entityId: musa.id,
    name: "Musa",
    canonicalKey: "cert:figure:musa:profile",
    active: true,
  })

  await WxFigureName.spawn(WxFigureName, env, {
    figureId: figure.id,
    name: "Musa ibn Imran",
    provenanceId: provenance.id,
    sourceReference: "Qur’anic lineage tradition",
    active: true,
  })

  await WxFigureRole.spawn(WxFigureRole, env, {
    figureId: figure.id,
    roleCode: "PROPHET",
    provenanceId: provenance.id,
    sourceReference: "Qur’an 19:51",
    active: true,
  })

  const traditionCorpus = await WxTraditionCorpus.spawn(WxTraditionCorpus, env, {
    title: "Sahih Al-Bukhari Fixture",
    traditionType: "HADITH",
    authoritySourceId: source.id,
    active: true,
  })

  const traditionUnit = await WxTraditionUnit.spawn(WxTraditionUnit, env, {
    corpusId: traditionCorpus.id,
    stableKey: "cert:hadith:unit:1",
    active: true,
  })

  await WxTraditionReference.spawn(WxTraditionReference, env, {
    unitId: traditionUnit.id,
    stableKey: "bukhari:1:1",
    provenanceId: provenance.id,
    active: true,
  })

  await WxTraditionAttribution.spawn(WxTraditionAttribution, env, {
    unitId: traditionUnit.id,
    figureId: figure.id,
    roleCode: "PRIMARY_TRANSMITTER",
    provenanceId: provenance.id,
    active: true,
  })

  const traditionChain = await WxTransmissionChain.spawn(WxTransmissionChain, env, {
    traditionUnitId: traditionUnit.id,
    chainType: "ISNAD_CONTINUOUS",
    provenanceId: provenance.id,
    active: true,
  })

  await WxTransmissionLink.spawn(WxTransmissionLink, env, {
    chainId: traditionChain.id,
    sequence: 1,
    personEntityId: musa.id,
    transmissionMode: "DIRECT_HEARING",
    active: true,
  })

  await WxTraditionAssessment.spawn(WxTraditionAssessment, env, {
    traditionUnitId: traditionUnit.id,
    assessmentScheme: "HADITH_AUTHENTICITY",
    rawValue: "SAHIH",
    provenanceId: provenance.id,
    active: true,
  })

  const engineRegistry = new WitnessEngineRegistry()
  engineRegistry.register(createFigureAnalysisModule())
  engineRegistry.register(createTraditionTransmissionModule())

  const runtime = new WitnessEngineRuntime(engineStore, {
    registry: engineRegistry,
    revisionResolver: {
      async verify() {
        return { missing: [] }
      }
    }
  })

  // 1. Run Figure Analysis Engine
  const figureResult = await runtime.runModule(env, {
    moduleCode: "figure.analysis",
    moduleVersion: "1.0.0",
    input: { figureId: figure.id },
  })
  assert.equal(figureResult.protocol, "WITNESS_ENGINE_RESULT_V1")
  assert.equal(
    figureResult.findings.length >= 3,
    true,
    "Figure analysis must return names, roles, and mentions"
  )

  // 2. Run Tradition Transmission Engine
  const traditionResult = await runtime.runModule(env, {
    moduleCode: "tradition.transmission",
    moduleVersion: "1.0.0",
    input: { unitId: traditionUnit.id },
  })
  assert.equal(traditionResult.protocol, "WITNESS_ENGINE_RESULT_V1")
  assert.equal(
    traditionResult.findings.length >= 4,
    true,
    "Tradition transmission must return reference, attribution, chain, and assessment"
  )

  // 3. Verify Deterministic Replay
  const figureReplay = await runtime.replayRun(env, figureResult.runId)
  assert.equal(
    checksumEngineResult(figureResult),
    checksumEngineResult(figureReplay),
    "Figure analysis replay must be checksum-identical"
  )

  const traditionReplay = await runtime.replayRun(env, traditionResult.runId)
  assert.equal(
    checksumEngineResult(traditionResult),
    checksumEngineResult(traditionReplay),
    "Tradition transmission replay must be checksum-identical"
  )

  const secondForge = await forge()
  assert.equal(
    secondForge.pending.length,
    0,
    "second forge must have no pending changes"
  )
  assert.equal(
    secondForge.applied.length,
    0,
    "second forge must be schema-idempotent"
  )

  assert.equal(
    await count("wx_relation"),
    2,
    "cert fixture must contain exactly one MENTIONS and one PARALLELS relation"
  )
  assert.equal(await count("wx_relation_type"), relationTypesAfterFirstSeed)

  console.log(
    JSON.stringify({
      ok: true,
      postgres: true,
      ontologyVersion: seedOne.ontologyVersion,
      relationTypes: relationTypesAfterFirstSeed,
      religionContexts: religionsAfterFirstSeed,
      figureAnalysisResult: figureResult.findings.length,
      traditionTransmissionResult: traditionResult.findings.length,
      appliedOnFreshForge: firstForge.applied.length,
      appliedOnSecondForge: secondForge.applied.length,
    })
  )
}

main()
  .catch((error) => {
    console.error("[witness.pg-certification] FAILED", error)
    process.exitCode = 1
  })
  .finally(async () => {
    try {
      await getDb().destroy()
    } catch {
      // setup errors may occur before a DB handle is available
    }
  })
