import { AuthorizationError } from './security.js'
import type { Ctx } from './env.js'
import type { FieldDef } from './fields.js'

type Row = Record<string, any>
type Model = { fetch: (model: Model, env: Ctx, domain?: unknown[]) => Promise<Row[]> }

function toSnakeCase(value: string): string {
  return value.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`)
}

function relationField(fieldDefs: Record<string, FieldDef>, relation: string): string | undefined {
  return Object.keys(fieldDefs).find((field) => field === relation || toSnakeCase(field) === toSnakeCase(relation))
}

function relationId(value: unknown): number {
  const raw = Array.isArray(value) ? value[0] : value
  return Number(raw || 0)
}

async function hydrateManyToOne(rows: Row[], relation: string, column: string, model: Model, env: Ctx): Promise<void> {
  const ids = new Set<number>()
  for (const row of rows) {
    const id = relationId(row[column])
    if (id) ids.add(id)
  }
  if (ids.size === 0) return

  try {
    const relatedRows = await model.fetch(model, env, [['id', 'in', Array.from(ids)]])
    const relatedMap = new Map(relatedRows.map((row) => [row.id, row]))
    for (const row of rows) {
      const id = relationId(row[column])
      row[`$${relation}`] = id && relatedMap.has(id) ? relatedMap.get(id) : null
    }
  } catch (error) {
    if (!(error instanceof AuthorizationError)) throw error
    for (const row of rows) row[`$${relation}`] = null
  }
}

async function hydrateOneToMany(rows: Row[], relation: string, inverse: string, model: Model, env: Ctx): Promise<void> {
  const inverseColumn = toSnakeCase(inverse)
  try {
    const relatedRows = await model.fetch(model, env, [[inverse, 'in', rows.map((row) => row.id)]])
    const grouped = new Map<number, Row[]>()
    for (const related of relatedRows) {
      const parentId = relationId(related[inverseColumn] ?? related[inverse])
      if (!grouped.has(parentId)) grouped.set(parentId, [])
      grouped.get(parentId)!.push(related)
    }
    for (const row of rows) row[`$${relation}`] = grouped.get(row.id) || []
  } catch (error) {
    if (!(error instanceof AuthorizationError)) throw error
    for (const row of rows) row[`$${relation}`] = []
  }
}

export async function hydrateRelations(
  rows: Row[],
  fieldDefs: Record<string, FieldDef>,
  relations: string[] | undefined,
  env: Ctx,
): Promise<void> {
  if (!relations?.length) return

  for (const requested of relations) {
    const field = relationField(fieldDefs, requested)
    if (!field) continue
    const definition = fieldDefs[field]
    if (!definition?.comodel) continue
    const model = env.getModel?.(definition.comodel) as Model | undefined
    if (!model) continue

    if (definition.type === 'many2one') {
      await hydrateManyToOne(rows, field, toSnakeCase(field), model, env)
    } else if (definition.type === 'one2many' && definition.inverse) {
      await hydrateOneToMany(rows, field, definition.inverse, model, env)
    }
  }
}
