export { Vertex, Recordset } from './base.ts'
export { QueryBuilder } from './query.ts'
export type { ModelFields, ModelRecord } from './base.ts'
export { fields, isFieldDef } from './fields.ts'
export { onchange } from './hooks.ts'
export type { FieldDef, InferFieldType, WidgetHint } from './fields.ts'
export { 
  type Ctx, 
  createCtx, 
  SUPERUSER_ID, 
  ANONYMOUS_ID 
} from './env.ts'
export {
  AuthorizationError,
  authSecurityContext,
  evaluateRecordRuleDomain,
  parseDeclarativeDomain,
  type AuthorizationErrorCode,
  type AuthSecurityScope,
  type PermissionOperation,
} from './security.ts'
export { registry, getModel, loadModels, registerModel } from './registry.ts'
export { forge, isRuntimeSchemaSyncAllowed } from './runtime-schema.ts'
export { getLastPending, validateAutomaticAlteration } from './schema-sync.ts'
export { diff, up, down, status, check } from './migrator.ts'
export type { MigrationStatus } from './migrator.ts'
export { setupOrm, getDb, teardownOrm, closeDb, checkDbConnection } from './config.ts'
export type { DbConfig, DbHealthStatus } from './config.ts'
export type {
  ViewManifest,
  MatrixViewMode,
  MatrixAccentColor,
  MatrixTableConfig,
  MatrixKanbanConfig,
  MatrixFormConfig,
  MatrixFormSection,
  MatrixFormAction,
} from './manifest.ts'
export {
  checkModelAccess,
  registerGrant,
  type RbacContext,
  type RbacOperation,
  type ModelPermissionGrant
} from './rbac-evaluator.ts'

