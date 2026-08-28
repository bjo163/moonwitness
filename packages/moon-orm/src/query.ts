import { Ctx } from './env.ts'
import { Vertex, Recordset, ModelRecord } from './base.ts'

export class QueryBuilder<M extends typeof Vertex, W extends string = never> {
  private _modelClass: M
  private _env: Ctx
  private _domain: unknown[] = []
  private _limit?: number
  private _offset?: number
  private _order?: string
  private _with: string[] = []
  private _groupBy: string[] = []
  private _aggregates: string[] = []

  constructor(modelClass: M, env: Ctx) {
    this._modelClass = modelClass
    this._env = env
  }

  where(field: string, value: unknown): this
  where(field: string, operator: string, value: unknown): this
  where(field: string, opOrVal: unknown, value?: unknown): this {
    if (value === undefined) {
      this._domain.push([field, '=', opOrVal])
    } else {
      this._domain.push([field, opOrVal, value])
    }
    return this
  }

  andWhere(field: string, value: unknown): this
  andWhere(field: string, operator: string, value: unknown): this
  andWhere(field: string, opOrVal: unknown, value?: unknown): this {
    if (this._domain.length > 0) {
      this._domain.unshift('&')
    }
    if (value === undefined) {
      this._domain.push([field, '=', opOrVal])
    } else {
      this._domain.push([field, opOrVal, value])
    }
    return this
  }
  
  orWhere(field: string, value: unknown): this
  orWhere(field: string, operator: string, value: unknown): this
  orWhere(field: string, opOrVal: unknown, value?: unknown): this {
    if (this._domain.length > 0) {
      this._domain.unshift('|')
    }
    if (value === undefined) {
      this._domain.push([field, '=', opOrVal])
    } else {
      this._domain.push([field, opOrVal, value])
    }
    return this
  }

  limit(n: number): this {
    this._limit = n
    return this
  }

  offset(n: number): this {
    this._offset = n
    return this
  }

  orderBy(field: string, direction: 'asc' | 'desc' = 'asc'): this {
    this._order = `${field} ${direction}`
    return this
  }

  with<R extends Extract<keyof InstanceType<M>, string>>(relation: R): QueryBuilder<M, W | R> {
    if (Array.isArray(relation)) {
      this._with.push(...relation)
    } else {
      this._with.push(relation)
    }
    return this as unknown as QueryBuilder<M, W | R>
  }

  groupBy(...fields: string[]): this {
    this._groupBy.push(...fields)
    return this
  }

  sum(field: string, alias?: string): this {
    this._aggregates.push(`${field}:sum${alias ? `:${alias}` : ''}`)
    return this
  }

  countAgg(field: string, alias?: string): this {
    this._aggregates.push(`${field}:count${alias ? `:${alias}` : ''}`)
    return this
  }
  
  avg(field: string, alias?: string): this {
    this._aggregates.push(`${field}:avg${alias ? `:${alias}` : ''}`)
    return this
  }

  min(field: string, alias?: string): this {
    this._aggregates.push(`${field}:min${alias ? `:${alias}` : ''}`)
    return this
  }

  max(field: string, alias?: string): this {
    this._aggregates.push(`${field}:max${alias ? `:${alias}` : ''}`)
    return this
  }
  
  async aggregate(): Promise<Record<string, any>[]> {
    return await (this._modelClass as any).readGroup(
      this._modelClass,
      this._env,
      this._domain,
      this._aggregates,
      this._groupBy
    )
  }

  async count(): Promise<number> {
    return await (this._modelClass as any).searchCount(
      this._modelClass,
      this._env,
      this._domain
    )
  }

  async paginate(page: number, pageSize: number): Promise<{ data: Recordset<M, W>, meta: { total: number, page: number, pageSize: number, lastPage: number } }> {
    const total = await this.count()
    this.limit(pageSize).offset((page - 1) * pageSize)
    const data = await this.fetch()
    const lastPage = Math.ceil(total / pageSize)
    return { data, meta: { total, page, pageSize, lastPage } }
  }

  async fetch(fields?: string[]): Promise<Recordset<M, W>> {
    const rows = await (this._modelClass as any).fetch(
      this._modelClass,
      this._env,
      this._domain,
      fields,
      { limit: this._limit, offset: this._offset, order: this._order, with: this._with.length > 0 ? this._with : undefined }
    )
    return new Recordset(this._modelClass, this._env, rows)
  }

  async first(fields?: string[]): Promise<ModelRecord<M, W> | null> {
    this.limit(1)
    const rs = await this.fetch(fields)
    return rs.length > 0 ? rs[0] as unknown as ModelRecord<M, W> : null
  }
}
