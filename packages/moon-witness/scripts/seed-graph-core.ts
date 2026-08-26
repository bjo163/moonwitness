import { IrModelData } from '@moon/base'
import { createCtx, getModel, SUPERUSER_ID } from '@moon/orm'
import WxRelationType from '../src/models/wx-relation-type.js'
import {
  relationSeedValues,
  WITNESS_RELATION_TYPES
} from '../src/graph/relation-ontology.js'

/**
 * Idempotent seed for the small Witness relation ontology.
 * Uses Moon ORM only and registers stable external IDs through ir.model.data.
 */
export async function seedWitnessGraphCore() {
  const env = createCtx(SUPERUSER_ID, {}, getModel)
  const ids = new Map<string, number>()

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

    ids.set(seed.code, id)
    await IrModelData.setXmlid(
      env,
      `witness.relation_${seed.code.toLowerCase()}`,
      WxRelationType._name,
      id,
      true
    )
  }

  // Resolve inverses after all predicate rows exist.
  for (const seed of WITNESS_RELATION_TYPES) {
    if (!seed.inverseCode) continue
    const id = ids.get(seed.code)
    const inverseTypeId = ids.get(seed.inverseCode)
    if (!id || !inverseTypeId) {
      throw new Error(`Witness relation ontology inverse is incomplete: ${seed.code} -> ${seed.inverseCode}`)
    }
    await WxRelationType.morph(WxRelationType, env, id, { inverseTypeId })
  }

  return { ontologyVersion: 'WITNESS_RELATION_V1', relationTypeCount: ids.size }
}
