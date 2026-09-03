import type { Knex } from 'knex'

type PostgresConnection = {
  query: (sql: string, params: string[], callback: (error: Error | null, result?: { rows?: unknown[] }) => void) => void
}

type PoolCompletion = (error: Error | null, connection?: PostgresConnection) => void

export interface PostgresConnectionProfile {
  url: string
  mode: 'direct' | 'session'
  schema: string
  ca?: string
  poolMax?: number
}

export function createPostgresConnectionConfig(profile: PostgresConnectionProfile): Knex.Config {
  let url: URL
  try { url = new URL(profile.url) } catch { throw new Error('Invalid PostgreSQL connection URL') }
  if (!['postgres:', 'postgresql:'].includes(url.protocol) || !url.hostname || !url.username || !url.pathname.slice(1)) throw new Error('PostgreSQL URL requires host, user, and database')
  if (profile.mode !== 'direct' && profile.mode !== 'session') throw new Error('Moon ORM requires a direct or session connection')
  if (url.port === '6543') throw new Error('Transaction pooler endpoint is not supported by this profile')
  if (!/^[a-z_][a-z0-9_]{0,62}$/.test(profile.schema) || ['auth', 'storage', 'extensions', 'information_schema'].includes(profile.schema) || profile.schema.startsWith('pg_')) throw new Error('Use an explicit application-owned PostgreSQL schema')
  for (const [key, value] of url.searchParams) if (key !== 'sslmode' || value !== 'verify-full') throw new Error('Unsupported connection URL option; configure TLS with the connection profile')
  const max = profile.poolMax ?? 5
  if (!Number.isInteger(max) || max < 1 || max > 100) throw new Error('poolMax must be an integer from 1 to 100')
  let user: string, password: string, database: string
  try { user = decodeURIComponent(url.username); password = decodeURIComponent(url.password); database = decodeURIComponent(url.pathname.slice(1)) } catch { throw new Error('Invalid PostgreSQL URL encoding') }
  return {
    client: 'pg',
    connection: { host: url.hostname, port: Number(url.port || 5432), user, password, database, ssl: { rejectUnauthorized: true, ...(profile.ca ? { ca: profile.ca } : {}) } },
    searchPath: [profile.schema, 'extensions'],
    pool: { min: 0, max, afterCreate(connection: PostgresConnection, done: PoolCompletion) {
      connection.query('SELECT 1 FROM pg_namespace WHERE nspname = $1', [profile.schema], (error: Error | null, result?: { rows?: unknown[] }) => {
        if (error) return done(new Error(sanitizedDatabaseError(error)))
        if (!result?.rows?.length) return done(new Error('Application schema must be provisioned before opening the ORM connection'))
        done(null, connection)
      })
    } },
    acquireConnectionTimeout: 10_000,
  }
}

export function sanitizedDatabaseError(error: unknown): string {
  const code = error && typeof error === 'object' && 'code' in error ? String(error.code) : ''
  return /^[0-9A-Z]{5}$/.test(code) ? `Database operation failed (SQLSTATE ${code})` : 'Database operation failed'
}
export function databaseOperation(sql: string): string {
  const first = sql.trim().split(/\s+/, 1)[0]?.toUpperCase()
  return ['SELECT', 'INSERT', 'UPDATE', 'DELETE', 'CREATE', 'ALTER', 'DROP', 'BEGIN', 'COMMIT', 'ROLLBACK'].includes(first ?? '') ? first! : 'QUERY'
}
