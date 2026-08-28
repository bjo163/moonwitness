import { describe, expect, it, vi, beforeEach } from 'vitest'
import { getMigrationFiles } from '../src/migrator.js'

const MOCK_MIGRATIONS_DIR = '/tmp/moon-migrations-test'
const MOCK_MIGRATION_CONTENT = `import type { Knex } from 'knex'
export async function up(db: Knex): Promise<void> {
  await db.schema.createTable('test_table', (table) => {
    table.increments('id')
    table.string('name')
  })
}
export async function down(db: Knex): Promise<void> {
  await db.schema.dropTable('test_table')
}
`

const { mockExistsSync, mockReaddirSync, mockReadFileSync } = vi.hoisted(() => {
  const existsSync = vi.fn((p: string) => p === MOCK_MIGRATIONS_DIR)
  const readdirSync = vi.fn(() => ['20240101000001_test_migration.ts'])
  const readFileSync = vi.fn((p: string) => {
    if (p.endsWith('.ts') || p.endsWith('.js')) return MOCK_MIGRATION_CONTENT
    return ''
  })
  return { mockExistsSync: existsSync, mockReaddirSync: readdirSync, mockReadFileSync: readFileSync }
})

vi.mock('fs', async () => {
  const actual = await vi.importActual<typeof import('fs')>('fs')
  return {
    ...actual,
    existsSync: mockExistsSync,
    mkdirSync: vi.fn(),
    readdirSync: mockReaddirSync,
    readFileSync: mockReadFileSync,
    writeFileSync: vi.fn(),
  }
})

describe('Migration Runner Hardening (#20)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockExistsSync.mockImplementation((p: string) => p === MOCK_MIGRATIONS_DIR)
    mockReaddirSync.mockReturnValue(['20240101000001_test_migration.ts'])
  })

  it('validates migration file naming convention (timestamp prefix)', async () => {
    const files = await getMigrationFiles(MOCK_MIGRATIONS_DIR)
    expect(files.every((f) => /^\d{14}_[a-zA-Z0-9_-]+\.(ts|js)$/.test(f))).toBe(true)
  })

  it('rejects non-conforming migration files', async () => {
    mockReaddirSync.mockReturnValue(['bad_name.ts', '20240101000001_good.ts'])

    const files = await getMigrationFiles(MOCK_MIGRATIONS_DIR)
    expect(files).toEqual(['20240101000001_good.ts'])
  })
})
