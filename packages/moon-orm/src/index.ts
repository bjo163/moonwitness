export { Vertex, Recordset } from './base.js'
export { QueryBuilder } from './query.js'
export type { ModelFields, ModelRecord } from './base.js'
export { fields, isFieldDef } from './fields.js'
export { onchange } from './hooks.js'
export type { FieldDef, InferFieldType, WidgetHint } from './fields.js'
export {
  validateDecimalSpec, decimalUnits, decimalFromUnits, normalizeDecimal,
  addDecimal, subtractDecimal, compareDecimal,
} from './decimal.js'
export type { DecimalSpec, RoundingMode } from './decimal.js'
export { validateViewContracts, assertViewContracts } from './view-contract.js'
export type { ViewContractIssue } from './view-contract.js'
export { 
  type Ctx, 
  createCtx, 
  SUPERUSER_ID, 
  ANONYMOUS_ID 
} from './env.js'
export {
  AuthorizationError,
  authSecurityContext,
  evaluateRecordRuleDomain,
  parseDeclarativeDomain,
  type AuthorizationErrorCode,
  type AuthSecurityScope,
  type PermissionOperation,
} from './security.js'
export { registry, getModel, loadModels, registerModel } from './registry.js'
export { forge, getLastPending, validateAutomaticAlteration } from './schema-sync.js'
export type { SchemaSyncOptions } from './schema-sync.js'
export { evaluateLegacyRows, reconcileLegacyData, preflightLegacyMigration } from './legacy-reconciliation.js'
export type { LegacyReconciliationReport, LegacyReconciliationInput, ReconciliationIssue } from './legacy-reconciliation.js'
export { diff, diffAdditive, up, down, status, check, snapshot, bootstrap } from './migrator.js'
export type { MigrationStatus } from './migrator.js'
export { setupOrm, getDb, teardownOrm, closeDb, checkDbConnection } from './config.js'
export type { DbConfig, DbHealthStatus } from './config.js'
export { createPostgresConnectionConfig } from './connection-profile.js'
export type { PostgresConnectionProfile } from './connection-profile.js'
export type {
  ViewManifest,
  MatrixViewMode,
  MatrixAccentColor,
  MatrixTableConfig,
  MatrixKanbanConfig,
  MatrixFormConfig,
  MatrixFormSection,
  MatrixFormAction,
} from './manifest.js'
export {
  checkModelAccess,
  registerGrant,
  type RbacContext,
  type RbacOperation,
  type ModelPermissionGrant
} from './rbac-evaluator.js'
export {
  isOtelEnabled,
  startDbSpan,
  withDbSpan,
  sanitizeSql,
  trackAttribute,
  shouldSampleQuery,
  resetQuerySampler,
} from './telemetry.js'