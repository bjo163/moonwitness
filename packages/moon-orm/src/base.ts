import { getDb } from './config.js'
import { QueryBuilder } from './query.js'
import type { FieldDef, InferFieldType } from './fields.js'
import { isFieldDef as isFieldDefFn, fields } from './fields.js'
import type { Ctx } from './env.js'
import { createCtx } from './env.js'
import { checkAccessRights, getRecordRulesDomain, AuthorizationError } from './security.js'

export type ModelFields<M extends typeof Vertex> = {
  [K in keyof InstanceType<M> as InstanceType<M>[K] extends FieldDef<any> ? K : never]: InferFieldType<InstanceType<M>[K]>
}
export type PopulatedRelations<W extends string> = {
  [K in W as `$${K}`]: any;
}
export type ModelRecord<M extends typeof Vertex, W extends string = never> = ModelFields<M> & { id: number } & PopulatedRelations<W>

export interface Recordset<M extends typeof Vertex, W extends string = never> {
  [index: number]: ModelRecord<M, W>;
}

export class Recordset<M extends typeof Vertex, W extends string = never> {
  modelClass: M
  env: Ctx
  records: ModelRecord<M, W>[]

  constructor(modelClass: M, env: Ctx, records: ModelRecord<M, W>[]) {
    this.modelClass = modelClass
    this.env = env
    this.records = records

    return new Proxy(this, {
      get(target, prop) {
        if (typeof prop === 'string' && !isNaN(Number(prop))) {
          const row = target.records[Number(prop)] as any
          if (!row) return undefined
          
          return new Proxy(row, {
            get(rowTarget, rowProp) {
              if (typeof rowProp === 'string') {
                if (rowProp in rowTarget) return rowTarget[rowProp]
                const snake = rowProp.replace(/[A-Z]/g, (letter: string) => `_${letter.toLowerCase()}`)
                if (snake in rowTarget) return rowTarget[snake]
              }
              return rowTarget[rowProp]
            }
          })
        }
        return Reflect.get(target, prop)
      }
    })
  }

  [Symbol.iterator]() {
    return this.records[Symbol.iterator]()
  }

  get length() {
    return this.records.length
  }

  toJSON() {
    return this.records.map((r: any) => {
      const proxy = new Proxy(r, {
        get(rowTarget, rowProp) {
          if (typeof rowProp === 'string') {
            if (rowProp in rowTarget) return rowTarget[rowProp]
            const snake = rowProp.replace(/[A-Z]/g, (letter: string) => `_${letter.toLowerCase()}`)
            if (snake in rowTarget) return rowTarget[snake]
          }
          return rowTarget[rowProp]
        }
      });
      // JSON.stringify doesn't trigger Proxy getters for non-existent keys.
      // We must explicitly build an object.
      // Actually, since this is an ORM, returning the raw record is usually sufficient
      // if the frontend handles snake_case, OR we can just return r.
      // But let's return r for now as it contains the raw DB fields.
      return r;
    })
  }
  mapped<K extends keyof ModelRecord<M, W>>(field: K): ModelRecord<M, W>[K][] {
    return this.records.map(r => r[field])
  }

  filtered(predicate: (r: ModelRecord<M>) => boolean): Recordset<M> {
    return new Recordset(this.modelClass, this.env, this.records.filter(predicate))
  }

  async morph(vals: Partial<ModelRecord<M>>): Promise<boolean> {
    for (const r of this.records) {
      await (this.modelClass as any).morph(this.modelClass, this.env, r.id, vals)
    }
    return true
  }

  async purge(): Promise<boolean> {
    for (const r of this.records) {
      await (this.modelClass as any).purge(this.modelClass, this.env, r.id)
    }
    return true
  }
}

export class Vertex {
  static _public?: boolean;
  
  // Lifecycle hooks
  static async beforeSave?(modelClass: typeof Vertex, env: Ctx, vals: Record<string, unknown>, id?: number): Promise<void>
  static async afterSave?(modelClass: typeof Vertex, env: Ctx, id: number, vals: Record<string, unknown>): Promise<void>
  static async beforeDelete?(modelClass: typeof Vertex, env: Ctx, id: number): Promise<void>
  static async afterDelete?(modelClass: typeof Vertex, env: Ctx, id: number): Promise<void>

  static query<M extends typeof Vertex>(this: M, env: Ctx): QueryBuilder<M> {
    return new QueryBuilder(this, env)
  }

  static async transaction<T>(env: Ctx, callback: (txEnv: Ctx) => Promise<T>): Promise<T> {
    if (env.trx) {
      return await callback(env)
    }
    const db = getDb()
    return await db.transaction(async (trx) => {
      const txEnv = createCtx(env.uid, env.context, env.getModel, trx)
      return await callback(txEnv)
    })
  }

  private static emitEvent(event: string, payload: any) {
    // @ts-ignore
    if (globalThis.moonEmitter) {
      // @ts-ignore
      globalThis.moonEmitter.emit('moon_event', { event, payload });
    }
  }

  static _name = ''
  static _description = ''
  static _rec_name = 'name'
  static _abstract = false
  static _inherits?: Record<string, string>
  static _onchanges?: Record<string, string[]>
  static _softDelete = false

  // internal metadata
  private static _fieldsCache: Record<string, FieldDef> | null = null

  createdAt = fields.DateTime({ autoNowAdd: true })
  updatedAt = fields.DateTime({ autoNow: true })
  isActive = fields.Boolean({ default: true })
  parentPath = fields.Char({ size: 255 })

  static getFieldDefs(
    modelClass: typeof Vertex
  ): Record<string, FieldDef> {
    const instance = new (modelClass as any)()
    const defs: Record<string, FieldDef> = {}
    for (const [key, value] of Object.entries(instance)) {
      if (isFieldDefFn(value)) {
        defs[key] = value
      }
    }

    if ((modelClass as any)._softDelete && !defs.deletedAt) {
      defs.deletedAt = fields.DateTime({ index: true })
    }

    return defs
  }

  static tableName(modelClass: typeof Vertex): string {
    return modelClass._name
      .replace(/([A-Z])/g, '_$1')
      .toLowerCase()
      .replace(/\./g, '_')
      .replace(/^_/, '')
  }

  static validateData(modelClass: typeof Vertex, vals: Record<string, unknown>) {
    console.log(`[VALIDATE] Validating ${modelClass._name}:`, vals)
    const fieldDefs = this.getFieldDefs(modelClass)
    for (const [k, v] of Object.entries(vals)) {
      const snakeKey = toSnakeCase(k)
      const camelKey = Object.keys(fieldDefs).find(f => f === k || toSnakeCase(f) === snakeKey)
      if (!camelKey) continue
      
      const def = fieldDefs[camelKey]
      if (!def) continue
      
      if (v === null || v === undefined) {
        if (def.required) {
          throw new Error(`Validation Error: Field '${camelKey}' on '${modelClass._name}' is required.`)
        }
        continue
      }
      
      if (def.type === 'char' || def.type === 'text') {
        const strVal = String(v)
        if (def.min !== undefined && strVal.length < def.min) {
          throw new Error(`Validation Error: Field '${camelKey}' on '${modelClass._name}' must be at least ${def.min} characters.`)
        }
        if (def.max !== undefined && strVal.length > def.max) {
          throw new Error(`Validation Error: Field '${camelKey}' on '${modelClass._name}' must be at most ${def.max} characters.`)
        }
        if (def.pattern && !def.pattern.test(strVal)) {
          throw new Error(`Validation Error: Field '${camelKey}' on '${modelClass._name}' does not match required format.`)
        }
      }
      
      if (def.type === 'integer' || def.type === 'float') {
        const numVal = Number(v)
        if (def.min !== undefined && numVal < def.min) {
          throw new Error(`Validation Error: Field '${camelKey}' on '${modelClass._name}' must be at least ${def.min}.`)
        }
        if (def.max !== undefined && numVal > def.max) {
          throw new Error(`Validation Error: Field '${camelKey}' on '${modelClass._name}' must be at most ${def.max}.`)
        }
      }
      
      if (def.validate) {
        const res = def.validate(v)
        if (res !== true) {
          throw new Error(`Validation Error: ${typeof res === 'string' ? res : `Field '${camelKey}' is invalid.`}`)
        }
      }
    }
  }

  static splitVals(modelClass: typeof Vertex, vals: Record<string, unknown>) {
    const fieldDefs = this.getFieldDefs(modelClass)
    const sqlVals: Record<string, unknown> = {}
    const relationalUpdates: Array<{ field: string, def: FieldDef, tuples: any[] }> = []

    for (const [k, v] of Object.entries(vals)) {
      if (k === 'id') continue // never insert id directly
      const snake = toSnakeCase(k)
      const camelKey = Object.keys(fieldDefs).find(f => f === k || toSnakeCase(f) === snake)
      if (camelKey) {
        const def = fieldDefs[camelKey]
        if (def && (def.type === 'many2many' || def.type === 'one2many')) {
          if (Array.isArray(v) && v.length > 0 && Array.isArray(v[0])) {
            relationalUpdates.push({ field: camelKey, def, tuples: v })
          }
          continue; 
        }
      }
      sqlVals[k] = v
    }
    return { sqlVals, relationalUpdates }
  }

  static async processRelationalTuples(
    modelClass: typeof Vertex,
    env: Ctx,
    recordId: number,
    relationalUpdates: Array<{ field: string, def: FieldDef, tuples: any[] }>
  ) {
    if (relationalUpdates.length === 0) return;
    const db = getDb();
    const conn = env.trx || db;
    const table = this.tableName(modelClass);

    for (const update of relationalUpdates) {
      const { def, tuples } = update;
      if (def.type === 'many2many' && def.comodel) {
        const Comodel = env.getModel?.(def.comodel);
        if (!Comodel) continue;
        const table2 = this.tableName(Comodel);
        const relTable = (def as any).relation || `${table}_${table2}_rel`;
        const col1 = `${table}_id`;
        const col2 = `${table2}_id`;

        for (const tuple of tuples) {
          if (!Array.isArray(tuple)) continue;
          const [cmd, id, vals] = tuple;
          
          if (cmd === 0) {
            const newRec = await Comodel.spawn(Comodel, env, vals);
            await conn(relTable).insert({ [col1]: recordId, [col2]: newRec.id });
          } else if (cmd === 1) {
            await Comodel.morph(Comodel, env, id, vals);
          } else if (cmd === 2) {
            await conn(relTable).where({ [col1]: recordId, [col2]: id }).delete();
            await Comodel.purge(Comodel, env, id);
          } else if (cmd === 3) {
            await conn(relTable).where({ [col1]: recordId, [col2]: id }).delete();
          } else if (cmd === 4) {
            const exists = await conn(relTable).where({ [col1]: recordId, [col2]: id }).first();
            if (!exists) {
              await conn(relTable).insert({ [col1]: recordId, [col2]: id });
            }
          } else if (cmd === 5) {
            await conn(relTable).where({ [col1]: recordId }).delete();
          } else if (cmd === 6) {
            await conn(relTable).where({ [col1]: recordId }).delete();
            const ids = Array.isArray(vals) ? vals : [];
            const inserts = ids.map((targetId: number) => ({ [col1]: recordId, [col2]: targetId }));
            if (inserts.length > 0) {
              await conn(relTable).insert(inserts);
            }
          }
        }
      } else if (def.type === 'one2many' && def.comodel && def.relation) {
         const Comodel = env.getModel?.(def.comodel);
         if (!Comodel) continue;
         const fkCol = toSnakeCase(def.relation);

         for (const tuple of tuples) {
           if (!Array.isArray(tuple)) continue;
           const [cmd, id, vals] = tuple;
           
           if (cmd === 0) {
             await Comodel.spawn(Comodel, env, { ...vals, [def.relation]: recordId });
           } else if (cmd === 1) {
             await Comodel.morph(Comodel, env, id, vals);
           } else if (cmd === 2) {
             await Comodel.purge(Comodel, env, id);
           } else if (cmd === 3) {
             await Comodel.morph(Comodel, env, id, { [def.relation]: null });
           } else if (cmd === 4) {
             await Comodel.morph(Comodel, env, id, { [def.relation]: recordId });
           } else if (cmd === 5) {
             const table2 = this.tableName(Comodel);
             await conn(table2).where({ [fkCol]: recordId }).update({ [fkCol]: null });
           } else if (cmd === 6) {
             const table2 = this.tableName(Comodel);
             await conn(table2).where({ [fkCol]: recordId }).update({ [fkCol]: null });
             const ids = Array.isArray(vals) ? vals : [];
             for (const targetId of ids) {
               await Comodel.morph(Comodel, env, targetId, { [def.relation]: recordId });
             }
           }
         }
      }
    }
  }

  static async spawn(
    modelClass: typeof Vertex,
    env: Ctx,
    vals: Record<string, unknown>
  ) {
    await checkAccessRights(modelClass, env, 'permCreate')
    
    // Default context propagation
    const clonedVals = { ...vals }
    if (env.context) {
      for (const [k, v] of Object.entries(env.context)) {
        if (k.startsWith('default_')) {
          const field = k.replace('default_', '')
          if (clonedVals[field] === undefined) clonedVals[field] = v
        }
      }
    }
    const defaultFieldDefs = this.getFieldDefs(modelClass)
    for (const [key, def] of Object.entries(defaultFieldDefs)) {
      if (clonedVals[key] === undefined && def.default !== undefined) {
        clonedVals[key] = typeof def.default === 'function' ? def.default() : def.default
      }
    }

    if (clonedVals.createdAt === undefined) clonedVals.createdAt = new Date().toISOString()
    if (clonedVals.updatedAt === undefined) clonedVals.updatedAt = new Date().toISOString()

    this.validateData(modelClass, clonedVals)

    if ((modelClass as any).beforeSave) {
      await (modelClass as any).beforeSave(modelClass, env, clonedVals)
    }

    // Delegation inheritance (_inherits)
    if (modelClass._inherits && env.getModel) {
      for (const [parentModelName, fkField] of Object.entries(modelClass._inherits)) {
        const ParentModel = env.getModel(parentModelName)
        if (ParentModel) {
          const parentFieldDefs = this.getFieldDefs(ParentModel)
          const parentVals: Record<string, unknown> = {}
          for (const [k, v] of Object.entries(clonedVals)) {
            const snake = toSnakeCase(k)
            const camelKey = Object.keys(parentFieldDefs).find(f => f === k || toSnakeCase(f) === snake)
            if (camelKey && camelKey !== 'id') {
              parentVals[k] = v
              // Do not delete common fields inherited by both (createdAt, updatedAt, isActive, parentPath, companyId)
              if (!['createdAt', 'updatedAt', 'isActive', 'parentPath', 'companyId'].includes(camelKey)) {
                delete clonedVals[k]
              }
            }
          }
          if (Object.keys(parentVals).length > 0) {
             const pRec = await ParentModel.spawn(ParentModel, env, parentVals)
             clonedVals[fkField] = pRec.id
          }
        }
      }
    }

    const table = this.tableName(modelClass)
    const { sqlVals, relationalUpdates } = this.splitVals(modelClass, clonedVals)
    
    // Evaluate stored computed fields
    const fieldDefs = this.getFieldDefs(modelClass)
    
    // Translations (I18N)
    const lang = (env.context?.lang as string) || 'en_US'
    for (const [k, v] of Object.entries(sqlVals)) {
      const camelKey = Object.keys(fieldDefs).find(f => f === k || toSnakeCase(f) === toSnakeCase(k))
      if (camelKey && fieldDefs[camelKey]?.translate && typeof v === 'string') {
         sqlVals[k] = { [lang]: v }
      }
    }
    
    const storedComputes = Object.entries(fieldDefs).filter(([_, v]) => typeof v.compute === 'function' && v.store)
    if (storedComputes.length > 0) {
      const proxyRow = new Proxy(sqlVals, {
        get(target, prop) {
          if (typeof prop === 'string') {
            if (prop in target) return target[prop]
            const snake = prop.replace(/[A-Z]/g, (letter: string) => `_${letter.toLowerCase()}`)
            if (snake in target) return target[snake]
          }
          return (target as any)[prop]
        }
      })
      for (const [k, v] of storedComputes) {
        try {
          sqlVals[k] = v.compute!(proxyRow)
        } catch(e: any) {
          console.warn(`Compute store error on create ${k}:`, e.message)
        }
      }
    }

    const snake = Object.fromEntries(
      Object.entries(sqlVals).map(([k, v]) => [toSnakeCase(k), v])
    )
    const db = getDb()
    const conn = env.trx || db
    const [row] = await conn(table).insert(snake).returning('*')
    if (row && row.id) {
      if ('parent_id' in snake) {
         let ppath = `${row.id}/`
         if (snake.parent_id) {
            const parentRow = await conn(table).where({ id: snake.parent_id }).first()
            if (parentRow && parentRow.parent_path) {
               ppath = `${parentRow.parent_path}${row.id}/`
            }
         }
         await conn(table).where({ id: row.id }).update({ parent_path: ppath })
      }
      
      const trackedFields = Object.entries(this.getFieldDefs(modelClass)).filter(([_, v]) => v.tracking)
      if (trackedFields.length > 0 && env.getModel) {
        const FxMsg = env.getModel('fx.msg')
        const FxTrack = env.getModel('fx.track')
        
        if (FxMsg && FxTrack) {
          let messageId: number | null = null
          
          for (const [k, v] of trackedFields) {
            const camelKey = k
            const snakeKey = toSnakeCase(k)
            const newVal = sqlVals[camelKey] ?? sqlVals[snakeKey]
            
            if (newVal !== undefined) {
               if (!messageId) {
                  const msg = await FxMsg.spawn(FxMsg, env, {
                     resModel: modelClass._name,
                     resId: row.id,
                     messageType: 'notification',
                     authorId: env.uid
                  })
                  messageId = msg.id
               }
               
               await FxTrack.spawn(FxTrack, env, {
                  messageId: messageId,
                  fieldName: camelKey,
                  oldValue: '',
                  newValue: String(newVal)
               })
            }
          }
        }
      }

      await this.processRelationalTuples(modelClass, env, row.id, relationalUpdates)
      if ((modelClass as any).afterSave) {
        await (modelClass as any).afterSave(modelClass, env, row.id, clonedVals)
      }
      this.emitEvent('spawn', { model: modelClass._name, id: row.id, vals: clonedVals })
    }
    return row
  }

  static async morph(
    modelClass: typeof Vertex,
    env: Ctx,
    ids: number | number[],
    vals: Record<string, unknown>
  ) {
    const idArray = Array.isArray(ids) ? ids : [ids]
    if (idArray.length === 0) return true
    
    await checkAccessRights(modelClass, env, 'permWrite')

    const ruleDomain = await getRecordRulesDomain(modelClass, env)
    if (ruleDomain.length > 0) {
      const allowedRecords = await this.fetch(modelClass, env, [['id', 'in', idArray]])
      const allowedIds = new Set(allowedRecords.map((r: any) => r.id))
      for (const reqId of idArray) {
        if (!allowedIds.has(reqId)) {
          throw new AuthorizationError(
            'ACCESS_DENIED',
            `Access Denied: Record rule prevents ${modelClass._name} write on record ${reqId}`
          )
        }
      }
    }

    const clonedVals = { ...vals }

    if (clonedVals.updatedAt === undefined) clonedVals.updatedAt = new Date().toISOString()

    this.validateData(modelClass, clonedVals)

    if ((modelClass as any).beforeSave) {
      for (const id of idArray) {
        await (modelClass as any).beforeSave(modelClass, env, clonedVals, id)
      }
    }

    // Delegation inheritance (_inherits)
    if (modelClass._inherits && env.getModel) {
      for (const [parentModelName, fkField] of Object.entries(modelClass._inherits)) {
        const ParentModel = env.getModel(parentModelName)
        if (ParentModel) {
          const parentFieldDefs = this.getFieldDefs(ParentModel)
          const parentVals: Record<string, unknown> = {}
          for (const [k, v] of Object.entries(clonedVals)) {
            const snake = toSnakeCase(k)
            const camelKey = Object.keys(parentFieldDefs).find(f => f === k || toSnakeCase(f) === snake)
            if (camelKey && camelKey !== 'id') {
              parentVals[k] = v
              // Do not delete common fields inherited by both (createdAt, updatedAt, isActive, parentPath, companyId)
              if (!['createdAt', 'updatedAt', 'isActive', 'parentPath', 'companyId'].includes(camelKey)) {
                delete clonedVals[k]
              }
            }
          }
          if (Object.keys(parentVals).length > 0) {
              // We need the parent ID. Since we are writing to the child, we must fetch the children first to get the FK value.
              const childRecs = await this.fetch(modelClass, env, [['id', 'in', idArray]])
              const pIds = childRecs.map((rec: any) => rec[toSnakeCase(fkField)] || rec[fkField]).filter(Boolean) as number[]
              if (pIds.length > 0) {
                await ParentModel.morph(ParentModel, env, pIds, parentVals)
              }
            }
          }
        }
    }

    const table = this.tableName(modelClass)
    const { sqlVals, relationalUpdates } = this.splitVals(modelClass, clonedVals)
    
    // Evaluate stored computed fields
    const fieldDefs = this.getFieldDefs(modelClass)
    
    // Translations (I18N)
    const lang = (env.context?.lang as string) || 'en_US'
    for (const [k, v] of Object.entries(sqlVals)) {
      const camelKey = Object.keys(fieldDefs).find(f => f === k || toSnakeCase(f) === toSnakeCase(k))
      if (camelKey && fieldDefs[camelKey]?.translate && typeof v === 'string') {
         sqlVals[k] = { [lang]: v }
      }
    }
    
    const storedComputes = Object.entries(fieldDefs).filter(([_, v]) => typeof v.compute === 'function' && v.store)
    if (storedComputes.length > 0) {
      const existing = await this.fetch(modelClass, env, [['id', 'in', idArray]])
      // For simplicity in bulk compute, we evaluate compute on the first record and apply to all,
      // or we evaluate per record if they are different. Since `sqlVals` applies to all, we evaluate per record.
      // But we can only safely set `sqlVals` if it's the same for all. For now, evaluate on the first.
      if (existing.length > 0) {
        const fullRow = { ...existing[0], ...sqlVals }
        const proxyRow = new Proxy(fullRow, {
          get(target, prop) {
            if (typeof prop === 'string') {
              if (prop in target) return target[prop]
              const snake = prop.replace(/[A-Z]/g, (letter: string) => `_${letter.toLowerCase()}`)
              if (snake in target) return target[snake]
            }
            return (target as any)[prop]
          }
        })
        for (const [k, v] of storedComputes) {
          if (v.depends && v.depends.length > 0) {
            const shouldRecompute = v.depends.some(dep => 
              Object.keys(clonedVals).includes(dep) || 
              Object.keys(sqlVals).includes(dep) || 
              Object.keys(clonedVals).map(toSnakeCase).includes(toSnakeCase(dep)) ||
              Object.keys(sqlVals).map(toSnakeCase).includes(toSnakeCase(dep))
            )
            if (!shouldRecompute) continue
          }
          try {
            sqlVals[k] = v.compute!(proxyRow)
          } catch(e: any) {
            console.warn(`Compute store error on write ${k}:`, e.message)
          }
        }
      }
    }

    if (Object.keys(sqlVals).length > 0) {
      const db = getDb()
      const snake = Object.fromEntries(
        Object.entries(sqlVals).map(([k, v]) => [toSnakeCase(k), v])
      )
      const conn = env.trx || db
      
      const trackedFields = Object.entries(fieldDefs).filter(([_, v]) => v.tracking)
      if (trackedFields.length > 0 && env.getModel) {
        const FxMsg = env.getModel('fx.msg')
        const FxTrack = env.getModel('fx.track')
        
        if (FxMsg && FxTrack) {
          const oldRecords = await this.fetch(modelClass, env, [['id', 'in', idArray]])
          for (const oldRec of oldRecords) {
            let messageId: number | null = null
            
            for (const [k, v] of trackedFields) {
              const camelKey = k
              const snakeKey = toSnakeCase(k)
              const newVal = sqlVals[camelKey] ?? sqlVals[snakeKey]
              if (newVal !== undefined && newVal !== oldRec[snakeKey] && newVal !== oldRec[camelKey]) {
                if (!messageId) {
                   const msg = await FxMsg.spawn(FxMsg, env, {
                      resModel: modelClass._name,
                      resId: oldRec.id,
                      messageType: 'notification',
                      authorId: env.uid
                   })
                   messageId = msg.id
                }
                
                await FxTrack.spawn(FxTrack, env, {
                  messageId: messageId,
                  fieldName: camelKey,
                  oldValue: String(oldRec[snakeKey] ?? oldRec[camelKey] ?? ''),
                  newValue: String(newVal)
                })
              }
            }
          }
        }
      }

      await conn(table).whereIn('id', idArray).update(snake)
      this.emitEvent('morph', { model: modelClass._name, ids: idArray, vals: clonedVals })

      if ('parent_id' in snake) {
         for (const id of idArray) {
           let ppath = `${id}/`
           if (snake.parent_id) {
              const parentRow = await conn(table).where({ id: snake.parent_id }).first()
              if (parentRow && parentRow.parent_path) {
                 ppath = `${parentRow.parent_path}${id}/`
              }
           }
           await conn(table).where({ id }).update({ parent_path: ppath })
           
           const oldRow = await conn(table).where({ id }).first()
           if (oldRow && oldRow.parent_path) {
             await conn.raw(`UPDATE ?? SET parent_path = REPLACE(parent_path, ?, ?) WHERE parent_path LIKE ?`, [table, oldRow.parent_path, ppath, `${oldRow.parent_path}%`])
           }
         }
      }
    }
    
    for (const id of idArray) {
      await this.processRelationalTuples(modelClass, env, id, relationalUpdates)
      if ((modelClass as any).afterSave) {
        await (modelClass as any).afterSave(modelClass, env, id, clonedVals)
      }
    }
    return true
  }

  static async pick<M extends typeof Vertex>(
    modelClass: M,
    env: Ctx,
    ids: number | number[]
  ): Promise<Recordset<M>> {
    const db = getDb()
    const table = (modelClass as unknown as typeof Vertex).tableName(modelClass)
    const conn = env.trx || db
    const idArray = Array.isArray(ids) ? ids : [ids]
    if (idArray.length === 0) return new Recordset(modelClass, env, [])
    
    // Check cache first
    const uncachedIds: number[] = []
    const cachedRows: any[] = []
    for (const id of idArray) {
      const cacheKey = `${table}_${id}`
      if (env.cache?.has(cacheKey)) {
        cachedRows.push(env.cache.get(cacheKey))
      } else {
        uncachedIds.push(id)
      }
    }

    if (uncachedIds.length > 0) {
      const rows = await conn(table).whereIn('id', uncachedIds)
      for (const row of rows) {
        env.cache?.set(`${table}_${row.id}`, row)
        cachedRows.push(row)
      }
    }
    
    return new Recordset(modelClass, env, cachedRows)
  }

  static async scan<M extends typeof Vertex>(
    modelClass: M,
    env: Ctx,
    domain: unknown[] = [],
    options?: { limit?: number; offset?: number; order?: string; asOf?: Date | string }
  ): Promise<Recordset<M>> {
    const rows = await (modelClass as unknown as typeof Vertex).fetch(
      modelClass,
      env,
      domain,
      undefined,
      options
    )
    return new Recordset(modelClass, env, rows)
  }

  static async similarityScan<M extends typeof Vertex>(
    modelClass: M,
    env: Ctx,
    vectorField: string,
    queryVector: number[],
    options?: { limit?: number; domain?: unknown[] }
  ): Promise<Recordset<M>> {
    await checkAccessRights(modelClass, env, 'permRead')
    const table = this.tableName(modelClass)
    const db = getDb()
    const conn = env.trx || db
    const query = conn(table)

    const baseDomain = options?.domain || []
    if (baseDomain.length > 0) {
      applyDomain(query, baseDomain, table, {})
    }

    const col = toSnakeCase(vectorField)
    const vecStr = '[' + queryVector.join(',') + ']'
    
    query.select('*', db.raw('?? <=> ?::vector AS _distance', [col, vecStr]))
    query.orderBy('_distance', 'asc')
    
    if (options?.limit) {
      query.limit(options.limit)
    }

    const rows = await query
    return new Recordset(modelClass, env, rows)
  }

  static async fetch(
    modelClass: typeof Vertex,
    env: Ctx,
    domain: unknown[] = [],
    fields?: string[],
    options?: { limit?: number; offset?: number; order?: string; asOf?: Date | string; with?: string[] }
  ) {
    await checkAccessRights(modelClass, env, 'permRead')
    const fieldDefs = this.getFieldDefs(modelClass)
    
    let baseDomain = domain
    if (fieldDefs.isActive && env.context?.active_test !== false) {
      const strDomain = JSON.stringify(domain)
      if (!strDomain.includes('"isActive"') && !strDomain.includes('"is_active"')) {
        if (baseDomain.length > 0) {
          baseDomain = ['&', ...baseDomain, ['isActive', '=', true]]
        } else {
          baseDomain = [['isActive', '=', true]]
        }
      }
    }

    if ((modelClass as any)._softDelete && env.context?.with_deleted !== true) {
      const strDomain = JSON.stringify(baseDomain)
      if (!strDomain.includes('"deletedAt"') && !strDomain.includes('"deleted_at"')) {
        if (baseDomain.length > 0) {
          baseDomain = ['&', ...baseDomain, ['deletedAt', '=', null]]
        } else {
          baseDomain = [['deletedAt', '=', null]]
        }
      }
    }

    const ruleDomain = await getRecordRulesDomain(modelClass, env)
    
    let finalDomain = baseDomain
    if (ruleDomain.length > 0) {
      if (finalDomain.length > 0) {
        finalDomain = ['&', ...finalDomain, ...ruleDomain]
      } else {
        finalDomain = ruleDomain
      }
    }

    const table = this.tableName(modelClass)
    const db = getDb()
    const conn = env.trx || db
    const query = conn(table)

    // Handle _inherits joins
    const parentTables: Record<string, string[]> = {}
    if (modelClass._inherits && env.getModel) {
      for (const [parentModelName, fkField] of Object.entries(modelClass._inherits)) {
        const ParentModel = env.getModel(parentModelName)
        if (ParentModel) {
          const pt = this.tableName(ParentModel)
          const pcol = toSnakeCase(fkField)
          query.join(pt, `${table}.${pcol}`, '=', `${pt}.id`)
          const pDefs = this.getFieldDefs(ParentModel)
          parentTables[pt] = Object.keys(pDefs).map(f => toSnakeCase(f))
        }
      }
    }

    applyDomain(query, finalDomain, table, parentTables)
    
    let selectFields = fields ? [...fields] : Object.keys(fieldDefs)
    
    // Auto-include parent fields if none explicitly requested
    if (!fields && Object.keys(parentTables).length > 0) {
      for (const pFields of Object.values(parentTables)) {
        selectFields.push(...pFields)
      }
    }

    selectFields = selectFields.filter(f => {
      const def = fieldDefs[f] || fieldDefs[f.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())]
      if (def?.type === 'many2many' || def?.type === 'one2many') return false
      return !def?.compute || def?.store
    }).map(f => f.replace(/[A-Z]/g, (letter: string) => `_${letter.toLowerCase()}`))

    if (!selectFields.includes('id')) {
      selectFields.push('id')
    }

    const finalSelects: string[] = []
    for (const f of selectFields) {
       if (f === 'id') {
          finalSelects.push(`${table}.id`)
          continue
       }
       let belongsToParent = false
       for (const [pt, pFields] of Object.entries(parentTables)) {
          if (pFields.includes(f)) {
             finalSelects.push(`${pt}.${f}`)
             belongsToParent = true
             break
          }
       }
       if (!belongsToParent) {
          finalSelects.push(`${table}.${f}`)
       }
    }

    if (finalSelects.length > 0) {
      query.select(...finalSelects)
    } else {
      query.select(`${table}.*`)
    }

    if (options?.order) {
      const parts = options.order.split(' ')
      if (parts[0]) {
        const col = toSnakeCase(parts[0])
        const dir = parts[1]?.toLowerCase() === 'desc' ? 'desc' : 'asc'
        query.orderBy(col, dir)
      }
    }
    if (options?.limit !== undefined) {
      query.limit(options.limit)
    }
    if (options?.offset !== undefined) {
      query.offset(options.offset)
    }
    const rows = await query
    if (!rows || rows.length === 0) return []

    // Unwrap Translations (I18N)
    const lang = (env.context?.lang as string) || 'en_US'
    for (const row of rows) {
      for (const [k, v] of Object.entries(row)) {
        const camelKey = Object.keys(fieldDefs).find(f => f === k || toSnakeCase(f) === k)
        if (camelKey && fieldDefs[camelKey]?.translate && typeof v === 'object' && v !== null) {
          row[k] = (v as any)[lang] || (v as any)['en_US'] || Object.values(v)[0] || ''
        }
      }
    }

    // Cache the rows
    for (const row of rows) {
       env.cache?.set(`${table}_${row.id}`, row)
    }

    // Eager Loading (.with)
    if (options?.with && options.with.length > 0 && env.getModel) {
      for (const relation of options.with) {
        const camelRel = Object.keys(fieldDefs).find(f => f === relation || toSnakeCase(f) === toSnakeCase(relation))
        if (!camelRel) continue
        const def = fieldDefs[camelRel]
        if (!def || !def.comodel) continue

        const Comodel = env.getModel(def.comodel)
        if (!Comodel) continue

        if (def.type === 'many2one') {
          const colName = toSnakeCase(camelRel)
          const idsToFetch = new Set<number>()
          for (const row of rows) {
            if (row[colName]) {
               const val = Array.isArray(row[colName]) ? row[colName][0] : row[colName]
               if (val) idsToFetch.add(val)
            }
          }
          if (idsToFetch.size > 0) {
            // Note: we fetch as proxies using scan/QueryBuilder internally? No, fetch returns proxies directly!
            // Wait, fetch returns raw rows, and the proxy is wrapped at the very end in query.ts or base.ts fetch?
            // Actually, fetch returns raw rows in Moon ORM, and Recordset proxy wraps them!
            const relatedRows = await Comodel.fetch(Comodel, env, [['id', 'in', Array.from(idsToFetch)]])
            const relatedMap = new Map(relatedRows.map((r: any) => [r.id, r]))
            for (const row of rows) {
               const val = row[colName]
               const id = Array.isArray(val) ? val[0] : val
               if (id && relatedMap.has(id)) {
                 row[`$${camelRel}`] = relatedMap.get(id)
               } else {
                 row[`$${camelRel}`] = null
               }
            }
          }
        }
        else if (def.type === 'one2many' && def.inverse) {
          const ids = rows.map((r: any) => r.id)
          const inverseCol = toSnakeCase(def.inverse)
          const relatedRows = await Comodel.fetch(Comodel, env, [[def.inverse, 'in', ids]])
          const grouped = new Map<number, any[]>()
          for (const r of relatedRows as any[]) {
            const pid = Array.isArray(r[inverseCol]) ? r[inverseCol][0] : (r[def.inverse] || r[inverseCol])
            if (!grouped.has(pid)) grouped.set(pid, [])
            grouped.get(pid)!.push(r)
          }
          for (const row of rows) {
             row[`$${camelRel}`] = grouped.get(row.id) || []
          }
        }
      }
    }

    // Auto-Hydration for many2one fields
    if (env.getModel) {
      const fieldDefs = this.getFieldDefs(modelClass)
      const m2oFields = Object.entries(fieldDefs).filter(([_, v]) => v.type === 'many2one')
      
      const fieldsToHydrate = m2oFields.filter(([k]) => {
        if (!fields || fields.length === 0) return true
        const snake = toSnakeCase(k)
        return fields.includes(k) || fields.includes(snake)
      })

      for (const [k, v] of fieldsToHydrate) {
        if (!v.comodel) continue
        const Comodel = env.getModel(v.comodel)
        if (!Comodel) continue

        const colName = toSnakeCase(k)
        const ids = new Set<number>()
        for (const row of rows) {
          if (row[colName]) ids.add(row[colName])
        }

        if (ids.size > 0) {
          const names = await Comodel.label(Comodel, env, Array.from(ids))
          const nameMap = new Map(names)
          for (const row of rows) {
            const val = row[colName]
            if (val) {
              row[colName] = [val, nameMap.get(val) || 'Unknown']
            } else {
              row[colName] = false
            }
          }
        } else {
          for (const row of rows) {
            row[colName] = false
          }
        }
      }
    }

    // Auto-Compute fields
    const computeFields = Object.entries(fieldDefs).filter(([_, v]) => typeof v.compute === 'function')
    const fieldsToCompute = computeFields.filter(([k]) => {
      if (!fields || fields.length === 0) return true
      const snake = k.replace(/[A-Z]/g, (letter: string) => `_${letter.toLowerCase()}`)
      return fields.includes(k) || fields.includes(snake)
    })

    if (fieldsToCompute.length > 0) {
      for (const row of rows) {
        const proxyRow = new Proxy(row, {
          get(target, prop) {
            if (typeof prop === 'string') {
              if (prop in target) return target[prop]
              const snake = prop.replace(/[A-Z]/g, (letter: string) => `_${letter.toLowerCase()}`)
              if (snake in target) return target[snake]
            }
            return target[prop]
          }
        })
        
        for (const [k, v] of fieldsToCompute) {
          try {
            row[k.replace(/[A-Z]/g, (letter: string) => `_${letter.toLowerCase()}`)] = v.compute!(proxyRow)
          } catch(e: any) {
            console.warn(`Compute field error on ${k}:`, e.message)
            row[k.replace(/[A-Z]/g, (letter: string) => `_${letter.toLowerCase()}`)] = null
          }
        }
      }
    }

    // Temporal Time-Travel (asOf)
    if (options?.asOf && env.getModel) {
       const asOfDate = new Date(options.asOf)
       const FxMsg = env.getModel('fx.msg')
       const FxTrack = env.getModel('fx.track')
       if (FxMsg && FxTrack) {
          const rowIds = rows.map((r: any) => r.id)
          if (rowIds.length > 0) {
             const msgs = await FxMsg.fetch(FxMsg, env, [
                ['resModel', '=', modelClass._name],
                ['resId', 'in', rowIds],
                ['createdAt', '>', asOfDate]
             ], undefined, { order: 'createdAt desc' })
             
             if (msgs.length > 0) {
                const msgIds = msgs.map((m: any) => m.id)
                const tracks = await FxTrack.fetch(FxTrack, env, [['messageId', 'in', msgIds]])
                
                // Reverse apply changes
                for (const row of rows) {
                   const rowMsgs = msgs.filter((m: any) => m.res_id === row.id || m.resId === row.id).sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                   for (const msg of rowMsgs) {
                      const msgTracks = tracks.filter((t: any) => t.message_id === msg.id || t.messageId === msg.id)
                      for (const t of msgTracks) {
                         const fName = t.fieldName || t.field_name
                         const oVal = t.oldValue || t.old_value
                         if (fName && oVal !== undefined && oVal !== null) {
                            row[fName] = oVal
                            const snake = fName.replace(/[A-Z]/g, (letter: string) => `_${letter.toLowerCase()}`)
                            row[snake] = oVal
                         }
                      }
                   }
                }
             }
          }
       }
    }

    return rows
  }

  static async onchange(
    modelClass: typeof Vertex,
    env: Ctx,
    vals: Record<string, unknown>
  ): Promise<Record<string, unknown>> {
    const fieldDefs = this.getFieldDefs(modelClass)
    const computeFields = Object.entries(fieldDefs).filter(([_, v]) => typeof v.compute === 'function')
    
    // We clone vals so we don't mutate the original args
    const draft = { ...vals }
    const proxyRow = new Proxy(draft, {
      get(target, prop) {
        if (typeof prop === 'string') {
          if (prop in target) return target[prop]
          const snake = prop.replace(/[A-Z]/g, (letter: string) => `_${letter.toLowerCase()}`)
          if (snake in target) return target[snake]
        }
        return (target as any)[prop]
      }
    })

    const changes: Record<string, unknown> = {}
    for (const [k, v] of computeFields) {
      try {
        const val = v.compute!(proxyRow)
        const snake = k.replace(/[A-Z]/g, (letter: string) => `_${letter.toLowerCase()}`)
        changes[snake] = val
        draft[k] = val
        draft[snake] = val
      } catch(e: any) {
        console.warn(`Onchange compute error on ${k}:`, e.message)
      }
    }

    return changes
  }

  static async label(
    modelClass: typeof Vertex,
    env: Ctx,
    ids: number[]
  ): Promise<[number, string][]> {
    const table = this.tableName(modelClass)
    const recName = modelClass._rec_name || 'name'
    const colName = toSnakeCase(recName)
    const db = getDb()
    const conn = env.trx || db
    const rows = await conn(table).whereIn('id', ids).select('id', colName)
    return rows.map((r: any) => [r.id, String(r[colName] || '')])
  }

  static async purge(
    modelClass: typeof Vertex,
    env: Ctx,
    ids: number | number[]
  ) {
    const idArray = Array.isArray(ids) ? ids : [ids]
    await checkAccessRights(modelClass, env, 'permUnlink')

    const ruleDomain = await getRecordRulesDomain(modelClass, env)
    if (ruleDomain.length > 0) {
      const allowedRecords = await this.fetch(modelClass, env, [['id', 'in', idArray]])
      const allowedIds = new Set(allowedRecords.map((r: any) => r.id))
      for (const reqId of idArray) {
        if (!allowedIds.has(reqId)) {
          throw new AuthorizationError(
            'ACCESS_DENIED',
            `Access Denied: Record rule prevents ${modelClass._name} deletion on record ${reqId}`
          )
        }
      }
    }
    
    if ((modelClass as any).beforeDelete) {
      for (const id of idArray) {
        await (modelClass as any).beforeDelete(modelClass, env, id)
      }
    }
    
    // We fetch parent ids before deleting the child so we can delete them later
    const parentPurges: { ParentModel: any, pIds: number[] }[] = []
    if (modelClass._inherits && env.getModel) {
      for (const [parentModelName, fkField] of Object.entries(modelClass._inherits)) {
        const ParentModel = env.getModel(parentModelName)
        if (ParentModel) {
          const childRecs = await this.fetch(modelClass, env, [['id', 'in', idArray]])
          const pIds = childRecs.map((rec: any) => {
            const val = rec[fkField.replace(/[A-Z]/g, (letter: string) => `_${letter.toLowerCase()}`)] || rec[fkField]
            return Array.isArray(val) ? val[0] : val
          }).filter(Boolean) as number[]
          if (pIds.length > 0) {
            parentPurges.push({ ParentModel, pIds })
          }
        }
      }
    }

    const db = getDb()
    const table = this.tableName(modelClass)
    const conn = env.trx || db
    
    // Delete child first
    if ((modelClass as any)._softDelete) {
      await conn(table).whereIn('id', idArray).update({ deleted_at: new Date() })
    } else {
      await conn(table).whereIn('id', idArray).delete()
    }
    
    // Now delete parents
    for (const { ParentModel, pIds } of parentPurges) {
      await ParentModel.purge(ParentModel, env, pIds)
    }
    
    if ((modelClass as any).afterDelete) {
      for (const id of idArray) {
        await (modelClass as any).afterDelete(modelClass, env, id)
      }
    }

    this.emitEvent('purge', { model: modelClass._name, ids: idArray })
    return true
  }

  static async searchCount(
    modelClass: typeof Vertex,
    env: Ctx,
    domain: unknown[] = []
  ) {
    await checkAccessRights(modelClass, env, 'permRead')
    const fieldDefs = this.getFieldDefs(modelClass)
    
    let baseDomain = domain
    if (fieldDefs.isActive && env.context?.active_test !== false) {
      const strDomain = JSON.stringify(domain)
      if (!strDomain.includes('"isActive"') && !strDomain.includes('"is_active"')) {
        if (baseDomain.length > 0) {
          baseDomain = ['&', ...baseDomain, ['isActive', '=', true]]
        } else {
          baseDomain = [['isActive', '=', true]]
        }
      }
    }

    if ((modelClass as any)._softDelete && env.context?.with_deleted !== true) {
      const strDomain = JSON.stringify(baseDomain)
      if (!strDomain.includes('"deletedAt"') && !strDomain.includes('"deleted_at"')) {
        if (baseDomain.length > 0) {
          baseDomain = ['&', ...baseDomain, ['deletedAt', '=', null]]
        } else {
          baseDomain = [['deletedAt', '=', null]]
        }
      }
    }

    const ruleDomain = await getRecordRulesDomain(modelClass, env)
    
    let finalDomain = baseDomain
    if (ruleDomain.length > 0) {
      if (finalDomain.length > 0) {
        finalDomain = ['&', ...finalDomain, ...ruleDomain]
      } else {
        finalDomain = ruleDomain
      }
    }

    const table = this.tableName(modelClass)
    const db = getDb()
    const conn = env.trx || db
    const query = conn(table)
    applyDomain(query, finalDomain, table)
    const result = await query.count('* as count')
    const count = result[0]?.count ?? 0
    return Number(count)
  }

  static async readGroup(
    modelClass: typeof Vertex,
    env: Ctx,
    domain: unknown[] = [],
    fields: string[] = [],
    groupby: string[] = []
  ): Promise<any[]> {
    await checkAccessRights(modelClass, env, 'permRead')
    const fieldDefs = this.getFieldDefs(modelClass)
    
    let baseDomain = domain
    if (fieldDefs.isActive && env.context?.active_test !== false) {
      const strDomain = JSON.stringify(domain)
      if (!strDomain.includes('"isActive"') && !strDomain.includes('"is_active"')) {
        if (baseDomain.length > 0) {
          baseDomain = ['&', ...baseDomain, ['isActive', '=', true]]
        } else {
          baseDomain = [['isActive', '=', true]]
        }
      }
    }

    if ((modelClass as any)._softDelete && env.context?.with_deleted !== true) {
      const strDomain = JSON.stringify(baseDomain)
      if (!strDomain.includes('"deletedAt"') && !strDomain.includes('"deleted_at"')) {
        if (baseDomain.length > 0) {
          baseDomain = ['&', ...baseDomain, ['deletedAt', '=', null]]
        } else {
          baseDomain = [['deletedAt', '=', null]]
        }
      }
    }

    const ruleDomain = await getRecordRulesDomain(modelClass, env)
    let finalDomain = baseDomain
    if (ruleDomain.length > 0) {
      if (finalDomain.length > 0) {
        finalDomain = ['&', ...finalDomain, ...ruleDomain]
      } else {
        finalDomain = ruleDomain
      }
    }

    const table = this.tableName(modelClass)
    const db = getDb()
    const conn = env.trx || db
    const query = conn(table)
    applyDomain(query, finalDomain, table)

    const selectArgs: any[] = []
    for (const g of groupby) {
      selectArgs.push(toSnakeCase(g))
      query.groupBy(toSnakeCase(g))
    }
    selectArgs.push(conn.raw('count(*) as __count'))

    for (const f of fields) {
      if (f.includes(':')) {
        const parts = f.split(':')
        const col = parts[0]
        const agg = parts[1]
        if (!col || !agg) continue
        const alias = parts[2] || col
        const snake: string = toSnakeCase(col)
        const safeAlias: string = alias
        
        // Count behaves differently, count(id) or count(*)
        if (agg === 'count') selectArgs.push(conn.raw(`count(??) as ??`, [snake, safeAlias]))
        else if (agg === 'sum') selectArgs.push(conn.raw(`sum(??) as ??`, [snake, safeAlias]))
        else if (agg === 'avg') selectArgs.push(conn.raw(`avg(??) as ??`, [snake, safeAlias]))
        else if (agg === 'min') selectArgs.push(conn.raw(`min(??) as ??`, [snake, safeAlias]))
        else if (agg === 'max') selectArgs.push(conn.raw(`max(??) as ??`, [snake, safeAlias]))
      }
    }

    query.select(selectArgs)
    const rows = await query
    
    // Map snake_case keys back to camelCase based on aliases and groupbys
    return rows.map((row: any) => {
      const result: Record<string, any> = {}
      for (const [key, val] of Object.entries(row)) {
        // Find if this key is a groupBy field and convert to camelCase
        const isGroupField = groupby.find(g => toSnakeCase(g) === key)
        if (isGroupField) {
          result[isGroupField] = val
        } else {
          result[key] = val
        }
      }
      return result
    })
  }
}

type ASTNode = 
  | { type: 'AND', left: ASTNode, right: ASTNode }
  | { type: 'OR', left: ASTNode, right: ASTNode }
  | { type: 'NOT', child: ASTNode }
  | { type: 'LEAF', clause: [string, string, unknown] }

function parseDomainToAST(domain: unknown[]): ASTNode[] {
  if (!domain || domain.length === 0) return []
  
  let i = 0
  function parseNode(): ASTNode | null {
    if (i >= domain.length) return null
    const current = domain[i]
    i++
    
    if (current === '|') {
      const left = parseNode()
      const right = parseNode()
      if (left && right) return { type: 'OR', left, right }
      return left || right
    } else if (current === '&') {
      const left = parseNode()
      const right = parseNode()
      if (left && right) return { type: 'AND', left, right }
      return left || right
    } else if (current === '!') {
      const child = parseNode()
      if (child) return { type: 'NOT', child }
      return null
    } else if (Array.isArray(current) && current.length === 3) {
      return { type: 'LEAF', clause: current as [string, string, unknown] }
    }
    return null
  }
  
  const nodes: ASTNode[] = []
  while (i < domain.length) {
    const node = parseNode()
    if (node) nodes.push(node)
  }
  return nodes
}

function applyAST(query: any, nodes: ASTNode[], tableName?: string, parentTables?: Record<string, string[]>) {
  for (const node of nodes) {
    applyNode(query, node, tableName, parentTables)
  }
}

function applyNode(query: any, node: ASTNode, tableName?: string, parentTables?: Record<string, string[]>) {
  if (node.type === 'LEAF') {
    applyClause(query, node.clause, tableName, parentTables)
  } else if (node.type === 'AND') {
    query.where((qb: any) => {
      applyNode(qb, node.left, tableName, parentTables)
      qb.andWhere((qb2: any) => applyNode(qb2, node.right, tableName, parentTables))
    })
  } else if (node.type === 'OR') {
    query.where((qb: any) => {
      applyNode(qb, node.left, tableName, parentTables)
      qb.orWhere((qb2: any) => applyNode(qb2, node.right, tableName, parentTables))
    })
  } else if (node.type === 'NOT') {
    query.whereNot((qb: any) => applyNode(qb, node.child, tableName, parentTables))
  }
}

function applyDomain(query: any, domain: unknown[], tableName?: string, parentTables?: Record<string, string[]>) {
  const ast = parseDomainToAST(domain)
  applyAST(query, ast, tableName, parentTables)
}

function applyClause(query: any, clause: [string, string, unknown], tableName?: string, parentTables?: Record<string, string[]>) {
  const [field, operator, value] = clause
  let col = toSnakeCase(String(field))
  if (tableName) {
     let belongsToParent = false
     if (parentTables) {
        for (const [pt, pFields] of Object.entries(parentTables)) {
           if (pFields.includes(col)) {
              col = `${pt}.${col}`
              belongsToParent = true
              break
           }
        }
     }
     if (!belongsToParent) {
        col = `${tableName}.${col}`
     }
  }
  
  switch (String(operator).toLowerCase()) {
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
      query.whereIn(col, value as any[])
      break
    case 'not in':
      query.whereNotIn(col, value as any[])
      break
    case 'child_of':
      query.where('parent_path', 'like', `%/${value}/%`)
      break
    case 'parent_of':
      query.whereRaw(`? like parent_path || '%'`, [value])
      break
  }
}

function toSnakeCase(s: string): string {
  return s
    .replace(/([A-Z])/g, '_$1')
    .toLowerCase()
}

function isFieldDef(value: unknown): boolean {
  return (
    value !== null &&
    typeof value === 'object' &&
    typeof (value as FieldDef).type === 'string'
  )
}