const fs = require('fs');
let code = fs.readFileSync('packages/moon-orm/src/base.ts', 'utf8');

const brokenChunk = `  static async purge(
    modelClass: typeof Vertex,
    env: Ctx,
    id: number
    idArray: number[]
  ) {
    const db = getDb()
    await checkAccessRights(modelClass, env, 'permUnlink')
    const table = this.tableName(modelClass)
    const conn = env.trx || db
    // Note: The parent purge happens above, but we also emit the event for the child
    await conn(table).whereIn('id', idArray).delete()
    this.emitEvent('purge', { model: modelClass._name, ids: idArray })
    return true
  }`;

const fixedChunk = `  static async purge(
    modelClass: typeof Vertex,
    env: Ctx,
    ids: number | number[]
  ) {
    const idArray = Array.isArray(ids) ? ids : [ids]
    if (idArray.length === 0) return true

    await checkAccessRights(modelClass, env, 'permUnlink')
    
    if (modelClass._inherits && env.getModel) {
      for (const [parentModelName, fkField] of Object.entries(modelClass._inherits)) {
        const ParentModel = env.getModel(parentModelName)
        if (ParentModel) {
          const childRecs = await this.fetch(modelClass, env, [['id', 'in', idArray]])
          const pIds = childRecs.map((rec: any) => rec[fkField.replace(/[A-Z]/g, letter => \`_\${letter.toLowerCase()}\`)] || rec[fkField]).filter(Boolean) as number[]
          if (pIds.length > 0) {
            await ParentModel.purge(ParentModel, env, pIds)
          }
        }
      }
    }

    const db = getDb()
    const table = this.tableName(modelClass)
    const conn = env.trx || db
    
    // Note: The parent purge happens above, but we also emit the event for the child
    await conn(table).whereIn('id', idArray).delete()
    this.emitEvent('purge', { model: modelClass._name, ids: idArray })
    return true
  }`;

code = code.replace(brokenChunk, fixedChunk);
fs.writeFileSync('packages/moon-orm/src/base.ts', code);
console.log('purge fixed');
