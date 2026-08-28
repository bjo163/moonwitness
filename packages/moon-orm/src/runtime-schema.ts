import {
  forge as runSchemaSync,
  type SchemaSyncResult,
} from './schema-sync.ts'

export interface RuntimeSchemaEnvironment {
  NODE_ENV?: string
}

/**
 * Runtime application startup must never perform production DDL. Production
 * schema changes are applied through the explicit migration lifecycle instead.
 */
export function isRuntimeSchemaSyncAllowed(
  env: RuntimeSchemaEnvironment = process.env
): boolean {
  return env.NODE_ENV !== 'production'
}

export async function forge(
  options: { dryRun?: boolean; silent?: boolean } = {}
): Promise<SchemaSyncResult> {
  if (!options.dryRun && !isRuntimeSchemaSyncAllowed()) {
    if (!options.silent) {
      console.warn(
        '[moon.schema] Runtime schema sync skipped in production; use db:install/db:migrate/db:verify.'
      )
    }
    return {
      applied: [],
      pending: [],
      migrations: [],
      summary: {
        totalModels: 0,
        totalColumns: 0,
        tablesCreated: 0,
        columnsAdded: 0,
        columnsAltered: 0,
        foreignKeysAdded: 0,
        indexesCreated: 0,
        m2mTablesCreated: 0,
      },
    }
  }

  return runSchemaSync(options)
}
