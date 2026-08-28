import { IrModelData } from '@moon/base'
import { createCtx, getModel, SUPERUSER_ID } from '@moon/orm'
import WxEntity from '../models/wx-entity.ts'
import WxReligion from '../models/wx-religion.ts'
import WxRelationType from '../models/wx-relation-type.ts'
import {
  relationSeedValues,
  WITNESS_RELATION_ONTOLOGY_VERSION,
  WITNESS_RELATION_TYPES
} from '../graph/relation-ontology.ts'

const RELIGION_CONTEXTS = [
  { code: 'ISLAM', name: 'Islam' },
  { code: 'JUDAISM', name: 'Judaism' },
  { code: 'CHRISTIANITY', name: 'Christianity' }
] as const

/**
 * Idempotent canonical seed for Witness graph primitives.
 *
 * Kept inside src/ so runtime boot, installers and explicit seed commands all
 * execute the same implementation. Uses Moon ORM only and stable external IDs.
 */
export async function seedWitnessGraphCore() {
  const env = createCtx(SUPERUSER_ID, {}, getModel)
  const relationIds = new Map<string, number>()

  for (const seed of WITNESS_RELATION_TYPES) {
    const rows = await WxRelationType.fetch(WxRelationType, env, [['code', '=', seed.code]])
    const values = relationSeedValues(seed)
    let id: number

    if (rows.length) {
      id = rows[0].id as number
      await WxRelationType.morph(WxRelationType, env, id, values)
    } else {
      const row = await WxRelationType.spawn(WxRelationType, env, values)
      id = row.id as number
    }

    relationIds.set(seed.code, id)
    await IrModelData.setXmlid(
      env,
      `witness.relation_${seed.code.toLowerCase()}`,
      WxRelationType._name,
      id,
      true
    )
  }

  // Resolve inverse links after every predicate exists.
  for (const seed of WITNESS_RELATION_TYPES) {
    if (!seed.inverseCode) continue
    const id = relationIds.get(seed.code)
    const inverseTypeId = relationIds.get(seed.inverseCode)
    if (!id || !inverseTypeId) {
      throw new Error(`Witness relation ontology inverse is incomplete: ${seed.code} -> ${seed.inverseCode}`)
    }
    await WxRelationType.morph(WxRelationType, env, id, { inverseTypeId })
  }

  let religionCount = 0
  for (const context of RELIGION_CONTEXTS) {
    const canonicalKey = `religion:${context.code.toLowerCase()}`
    const entityRows = await WxEntity.fetch(WxEntity, env, [['canonicalKey', '=', canonicalKey]])
    let entityId: number

    if (entityRows.length) {
      entityId = entityRows[0].id as number
    } else {
      const entity = await WxEntity.spawn(WxEntity, env, {
        canonicalKey,
        kind: 'RELIGION',
        label: context.name,
        sourceClass: 'GOVERNANCE_RECORD',
        epistemicLane: 'CORE',
        authorityClass: 'NOT_APPLICABLE',
        operationalStatus: 'ESTABLISHED',
        active: true
      })
      entityId = entity.id as number
    }

    const religionRows = await WxReligion.fetch(WxReligion, env, [['code', '=', context.code]])
    let religionId: number
    if (religionRows.length) {
      religionId = religionRows[0].id as number
      await WxReligion.morph(WxReligion, env, religionId, {
        entityId,
        name: context.name,
        active: true
      })
    } else {
      const religion = await WxReligion.spawn(WxReligion, env, {
        entityId,
        code: context.code,
        name: context.name,
        active: true
      })
      religionId = religion.id as number
    }

    await IrModelData.setXmlid(env, `witness.entity_religion_${context.code.toLowerCase()}`, WxEntity._name, entityId, true)
    await IrModelData.setXmlid(env, `witness.religion_${context.code.toLowerCase()}`, WxReligion._name, religionId, true)
    religionCount += 1
  }

  return {
    ontologyVersion: WITNESS_RELATION_ONTOLOGY_VERSION,
    relationTypeCount: relationIds.size,
    religionContextCount: religionCount
  }
}
