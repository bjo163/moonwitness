import { getDb } from './config.js'
import type { Ctx } from './env.js'
import type { Vertex } from './base.js'

export async function checkAccessRights(
  modelClass: typeof Vertex,
  env: Ctx,
  operation: 'permRead' | 'permWrite' | 'permCreate' | 'permUnlink'
): Promise<void> {
  // bypass for superuser or if model is security itself
  if (env.uid === 1) return;
  if (env.uid === 0) {
    if (modelClass._public && operation === 'permRead') return;
    throw new Error(`Unauthorized: Token required to ${operation.replace('perm', '').toLowerCase()} ${modelClass._name}`);
  }
  
  if (modelClass._name.startsWith('ir.')) return; 
  if (modelClass._name === 'vx.user' || modelClass._name === 'vx.role') return; // let's bypass base users for now to prevent deadlock during auth

  const MxGrant = env.getModel?.('mx.grant');
  if (!MxGrant) return;
  const db = getDb()
  const conn = env.trx || db;

  const userGroups = await conn('vx_user_vx_role_rel')
    .where('vx_user_id', env.uid)
    .select('vx_role_id');
  
  const groupIds = userGroups.map((r: any) => r.vx_role_id);
  if (groupIds.length === 0) {
    throw new Error(`Access Denied: No groups assigned to user. Cannot ${operation} on ${modelClass._name}`);
  }

  const MxModel = env.getModel?.('mx.model');
  if (!MxModel) return;
  const models = await MxModel.scan(MxModel, env, [['model', '=', modelClass._name]]);
  if (models.length === 0) return; 

  const modelId = models.records[0]!.id;

  const rights = await (MxGrant as any).scan(MxGrant, env, [
    ['modelId', '=', modelId],
    ['groupId', 'in', groupIds],
    [operation, '=', true]
  ]);

  if (rights.length === 0) {
    throw new Error(`Access Denied: Missing ${operation} on ${modelClass._name}`);
  }
}

export async function getRecordRulesDomain(
  modelClass: typeof Vertex,
  env: Ctx
): Promise<unknown[]> {
  if (env.uid === 1) return [];
  if (modelClass._name.startsWith('ir.')) return []; 
  if (modelClass._name === 'vx.user' || modelClass._name === 'vx.role') return [];

  const MxRule = env.getModel?.('mx.rule');
  if (!MxRule) return [];

  const db = getDb();
  const conn = env.trx || db;

  const userGroups = await conn('vx_user_vx_role_rel')
    .where('vx_user_id', env.uid)
    .select('vx_role_id');
  const groupIds = userGroups.map((r: any) => r.vx_role_id);
  if (groupIds.length === 0) return [];

  const MxModel = env.getModel?.('mx.model');
  if (!MxModel) return [];
  const models = await MxModel.scan(MxModel, env, [['model', '=', modelClass._name]]);
  if (models.length === 0) return [];
  const modelId = models.records[0]!.id;

  const ruleGroupRows = await conn('ir_rule_res_groups_rel')
    .whereIn('vx_role_id', groupIds)
    .select('ir_rule_id');
  const ruleIds = ruleGroupRows.map((r: any) => r.ir_rule_id);

  if (ruleIds.length === 0) return []; 

  const rules = await (MxRule as any).scan(MxRule, env, [
    ['modelId', '=', modelId],
    ['id', 'in', ruleIds]
  ]);

  if (rules.length === 0) return [];

  const User = env.getModel?.('vx.user');
  if (!User) return [];
  const users = await User.pick(User, env, env.uid);
  const user = users.records[0];

  let combinedDomain: unknown[] = [];
  
  for (const rule of (rules as any)) {
    try {
      const domainFn = new Function('user', `return ${rule.domainForce}`);
      const evaluated = domainFn(user);
      if (Array.isArray(evaluated)) {
        if (combinedDomain.length === 0) {
          combinedDomain = evaluated;
        } else {
          combinedDomain = ['|', ...combinedDomain, ...evaluated];
        }
      }
    } catch (err: any) {
      console.warn(`Failed to eval rule ${rule.name}:`, err.message);
    }
  }

  return combinedDomain;
}
