import { getDb, SUPERUSER_ID } from '@moon/orm'

export async function enforceCompanyScope(env: any, vals: Record<string, any>, parentModel?: string, parentId?: unknown) {
  if (env.uid === SUPERUSER_ID) return
  const db = env.trx || getDb()
  const user = await db('vx_user').where('id', env.uid).first()
  const rawAllowed = user?.company_ids ?? user?.companyIds ?? (user?.company_id ? [user.company_id] : [])
  const allowed = Array.isArray(rawAllowed) ? rawAllowed.map((value: any) => Number(Array.isArray(value) ? value[0] : value)) : []
  const companyId = user?.company_id ?? user?.companyId
  if (!companyId || !allowed.includes(Number(companyId))) throw new Error('Validation Error: active company is not available for this user')
  if (vals.companyId !== undefined && Number(vals.companyId) !== Number(companyId)) throw new Error('Validation Error: companyId must match the active user company')
  vals.companyId = Number(companyId)
  if (parentModel && parentId !== undefined) {
    const parent = await db(parentModel.replace('.', '_')).where('id', parentId).first()
    if (!parent || Number(parent.company_id) !== Number(companyId)) throw new Error('Validation Error: parent record belongs to another company')
  }
}

export async function enforceExistingCompanyScope(env: any, table: string, id: number | undefined, vals: Record<string, any>, parentModel?: string) {
  const db = env.trx || getDb()
  const existing = id === undefined ? undefined : await db(table).where('id', id).first()
  if (existing?.company_id !== undefined && vals.companyId !== undefined && Number(existing.company_id) !== Number(vals.companyId)) {
    throw new Error('Validation Error: companyId cannot be changed after creation')
  }
  const parentColumn = parentModel ? 'project_id' : undefined
  const parentId = parentColumn ? (vals.projectId ?? existing?.[parentColumn]) : undefined
  await enforceCompanyScope(env, vals, parentModel, parentId)
}
