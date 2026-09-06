/**
 * ◈ @moon/orm — Dialect Adapter
 *
 * Provides dialect-aware SQL utilities that abstract differences
 * between PostgreSQL and SQLite. All ORM layers should use these
 */

import fs from 'node:fs'
import path from 'node:path'

export type Dialect = 'pg' | 'sqlite'

let currentDialect: Dialect = 'pg'

/**
 * Set the active database dialect. Called once during ORM setup.
 */
export function setDialect(dialect: Dialect): void {
  currentDialect = dialect
}

/**
 * Get the active database dialect.
 */
export function getDialect(): Dialect {
  return currentDialect
}

/**
 * Check if the current dialect is PostgreSQL.
 */
export function isPg(): boolean {
  return currentDialect === 'pg'
}

/**
 * Check if the current dialect is SQLite.
 */
export function isSqlite(): boolean {
  return currentDialect === 'sqlite'
}

/**
 * Detect dialect from a database URL or Knex client string.
 *
 * - `postgres://...` or `postgresql://...` → 'pg'
 * - `sqlite://...` or `better-sqlite3` → 'sqlite'
 * - Plain file path ending in `.db` or `.sqlite` → 'sqlite'
 */
export function detectDialect(urlOrClient: string): Dialect {
  const lower = urlOrClient.toLowerCase().trim()

  if (
    lower.startsWith('postgres://') ||
    lower.startsWith('postgresql://') ||
    lower === 'pg' ||
    lower === 'postgres' ||
    lower === 'postgresql'
  ) {
    return 'pg'
  }

  if (
    lower.startsWith('sqlite://') ||
    lower.startsWith('sqlite3://') ||
    lower === 'sqlite3' ||
    lower === 'sqlite' ||
    lower === 'better-sqlite3' ||
    lower.endsWith('.db') ||
    lower.endsWith('.sqlite') ||
    lower.endsWith('.sqlite3')
  ) {
    return 'sqlite'
  }

  // Default to pg for unknown URLs
  return 'pg'
}

/**
 * Parse a database URL into a Knex-compatible configuration.
 *
 * - PostgreSQL: `postgres://user:pass@host:port/db` → `{ client: 'pg', connection: url }`
 * - SQLite: `sqlite://./data/dev.db` → `{ client: 'better-sqlite3', connection: { filename } }`
 * - Plain path: `./data/dev.db` → `{ client: 'better-sqlite3', connection: { filename } }`
 */
export function parseDbUrl(url: string): { client: string; connection: any; useNullAsDefault?: boolean } {
  const dialect = detectDialect(url)

  if (dialect === 'sqlite') {
    let filename: string

    if (url.startsWith('sqlite://') || url.startsWith('sqlite3://')) {
      // Strip protocol
      filename = url.replace(/^sqlite3?:\/\//, '')
    } else {
      filename = url
    }

    if (filename !== ':memory:') {
      try {
        const resolvedPath = path.resolve(filename)
        const dir = path.dirname(resolvedPath)
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true })
        }
        filename = resolvedPath
      } catch {
        // Fall back to original filename if path resolution fails
      }
    }

    return {
      client: 'better-sqlite3',
      connection: { filename },
      useNullAsDefault: true,
    }
  }

  // PostgreSQL
  return {
    client: 'pg',
    connection: url,
  }
}

// ── Dialect-Aware SQL Helpers ─────────────────────────────────────────────────

/**
 * Map ORM field type to database column type.
 *
 * Handles differences like:
 * - `json` → `jsonb` (PG) or `text` (SQLite, stores JSON as text)
 * - `vector` → `vector(N)` (PG with pgvector) or `text` (SQLite, disabled)
 * - `datetime` → `timestamp` (PG) or `text` (SQLite ISO8601)
 */
export function mapColumnType(
  ormType: string,
  options?: { size?: number; precision?: number; scale?: number; vectorDim?: number }
): string {
  if (isPg()) {
    switch (ormType) {
      case 'char': return options?.size ? `varchar(${options.size})` : 'varchar(255)'
      case 'text': return 'text'
      case 'integer': return 'integer'
      case 'float': return 'double precision'
      case 'decimal': return `numeric(${options?.precision ?? 16}, ${options?.scale ?? 4})`
      case 'boolean': return 'boolean'
      case 'date': return 'date'
      case 'datetime': return 'timestamp'
      case 'binary': return 'bytea'
      case 'json': return 'jsonb'
      case 'vector': return options?.vectorDim ? `vector(${options.vectorDim})` : 'vector(1536)'
      case 'many2one': return 'integer'
      default: return 'text'
    }
  }

  // SQLite
  switch (ormType) {
    case 'char': return 'text'
    case 'text': return 'text'
    case 'integer': return 'integer'
    case 'float': return 'real'
    case 'decimal': return 'real'
    case 'boolean': return 'integer'  // SQLite uses 0/1
    case 'date': return 'text'        // ISO8601 string
    case 'datetime': return 'text'    // ISO8601 string
    case 'binary': return 'blob'
    case 'json': return 'text'        // JSON stored as text
    case 'vector': return 'text'      // Vectors stored as JSON array string (fallback)
    case 'many2one': return 'integer'
    default: return 'text'
  }
}

/**
 * Whether the current dialect supports vector operations (pgvector).
 */
export function supportsVectors(): boolean {
  return isPg()
}

/**
 * Whether the current dialect supports JSONB operators.
 */
export function supportsJsonb(): boolean {
  return isPg()
}

/**
 * Whether the current dialect supports advisory locks.
 */
export function supportsAdvisoryLocks(): boolean {
  return isPg()
}

/**
 * Whether the current dialect supports RETURNING clause.
 * Both PostgreSQL and SQLite 3.35+ support RETURNING.
 */
export function supportsReturning(): boolean {
  return true
}

/**
 * Get the boolean literal for the current dialect.
 * PostgreSQL uses true/false, SQLite uses 1/0.
 */
export function booleanLiteral(value: boolean): string | number {
  if (isPg()) return value ? 'true' : 'false'
  return value ? 1 : 0
}

/**
 * Get the current timestamp expression for the current dialect.
 */
export function nowExpression(): string {
  if (isPg()) return 'NOW()'
  return "datetime('now')"
}
