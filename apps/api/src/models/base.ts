import db from '../db.js'
import type { FieldDef } from './fields.js'
import { isFieldDef as isFieldDefFn } from './fields.js'
import { fields } from './fields.js'

export class BaseModel {
  static _name = ''
  static _description = ''

  createdAt = fields.DateTime({ autoNowAdd: true })
  updatedAt = fields.DateTime({ autoNow: true })
  isActive = fields.Boolean({ default: true })

  static getFieldDefs(
    modelClass: typeof BaseModel
  ): Record<string, FieldDef> {
    const instance = new (modelClass as any)()
    const defs: Record<string, FieldDef> = {}
    for (const [key, value] of Object.entries(instance)) {
      if (isFieldDefFn(value)) {
        defs[key] = value
      }
    }
    return defs
  }

  static tableName(modelClass: typeof BaseModel): string {
    return modelClass._name
      .replace(/([A-Z])/g, '_$1')
      .toLowerCase()
      .replace(/\./g, '_')
      .replace(/^_/, '')
  }

  static async create(
    modelClass: typeof BaseModel,
    vals: Record<string, unknown>
  ) {
    const table = this.tableName(modelClass)
    const { id, ...rest } = vals
    const snake = Object.fromEntries(
      Object.entries(rest).map(([k, v]) => [toSnakeCase(k), v])
    )
    const [row] = await db(table).insert(snake).returning('*')
    return row
  }

  static async write(
    modelClass: typeof BaseModel,
    id: number,
    vals: Record<string, unknown>
  ) {
    const table = this.tableName(modelClass)
    const snake = Object.fromEntries(
      Object.entries(vals).map(([k, v]) => [toSnakeCase(k), v])
    )
    const [row] = await db(table)
      .where({ id })
      .update(snake)
      .returning('*')
    return row
  }

  static async browse(
    modelClass: typeof BaseModel,
    id: number
  ) {
    const table = this.tableName(modelClass)
    const rows = await db(table).where({ id })
    return rows[0] ?? null
  }

  static async searchRead(
    modelClass: typeof BaseModel,
    domain: unknown[] = [],
    fields?: string[]
  ) {
    const table = this.tableName(modelClass)
    const query = db(table)
    applyDomain(query, domain)
    if (fields && fields.length > 0) {
      return query.select(...fields)
    }
    return query.select('*')
  }

  static async unlink(
    modelClass: typeof BaseModel,
    id: number
  ) {
    const table = this.tableName(modelClass)
    await db(table).where({ id }).delete()
    return true
  }

  static async searchCount(
    modelClass: typeof BaseModel,
    domain: unknown[] = []
  ) {
    const table = this.tableName(modelClass)
    const query = db(table)
    applyDomain(query, domain)
    const result = await query.count('* as count')
    const count = result[0]?.count ?? 0
    return Number(count)
  }
}

function applyDomain(query: any, domain: unknown[]) {
  for (const clause of domain) {
    if (!Array.isArray(clause) || clause.length !== 3) continue
    const [field, operator, value] = clause
    const col = toSnakeCase(String(field))
    switch (operator) {
      case 'ilike':
        query.where(col, 'ilike', `%${value}%`)
        break
      case 'like':
        query.where(col, 'like', `%${value}%`)
        break
      case '=':
      case '==':
        query.where(col, value)
        break
      case '!=':
      case '<>':
        query.whereNot(col, value)
        break
      case '>':
        query.where(col, '>', value)
        break
      case '<':
        query.where(col, '<', value)
        break
      case '>=':
        query.where(col, '>=', value)
        break
      case '<=':
        query.where(col, '<=', value)
        break
      case 'in':
        query.whereIn(col, value)
        break
      case 'not in':
        query.whereNotIn(col, value)
        break
    }
  }
}

function toSnakeCase(s: string): string {
  return s
    .replace(/[A-Z]/g, '_$1')
    .toLowerCase()
}

function isFieldDef(value: unknown): boolean {
  return (
    value !== null &&
    typeof value === 'object' &&
    typeof (value as FieldDef).type === 'string'
  )
}