import { createHash } from 'node:crypto'
import { readFileSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { createCtx, getDb, getModel, SUPERUSER_ID, Ctx } from '@moon/orm'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

function getDataDir(): string {
  const possiblePaths = [
    join(__dirname, 'data'),
    join(__dirname, '../src/data'),
    join(__dirname, '../dist/data'),
    join(__dirname, '../data'),
    join(process.cwd(), 'packages/moon-base/src/data'),
    join(process.cwd(), 'packages/moon-base/dist/data'),
  ]
  for (const p of possiblePaths) {
    if (existsSync(join(p, 'manifest.json'))) {
      return p
    }
  }
  return join(__dirname, 'data')
}

const dataDir = getDataDir()

export interface ManifestFile {
  filename: string
  hash: string
  size: number
}

export interface SeedManifest {
  version: string
  generatedAt: string
  files: ManifestFile[]
}

/**
 * Verify SHA-256 checksums of all seed data files against manifest.json
 */
export function verifySeedIntegrity(): { valid: boolean; errors: string[] } {
  const manifestPath = join(dataDir, 'manifest.json')
  if (!existsSync(manifestPath)) {
    return { valid: false, errors: ['manifest.json not found'] }
  }

  const manifest: SeedManifest = JSON.parse(readFileSync(manifestPath, 'utf8'))
  const errors: string[] = []

  for (const file of manifest.files) {
    const filePath = join(dataDir, file.filename)
    if (!existsSync(filePath)) {
      errors.push(`File missing: ${file.filename}`)
      continue
    }

    const content = readFileSync(filePath, 'utf8').replace(/\r\n/g, '\n')
    const calculatedHash = createHash('sha256').update(content).digest('hex')

    if (calculatedHash !== file.hash) {
      errors.push(
        `Checksum mismatch on ${file.filename}: expected ${file.hash}, got ${calculatedHash}`
      )
    }
  }

  return { valid: errors.length === 0, errors }
}

/**
 * Load all canonical reference datasets into the database with idempotency checks
 */
export async function loadCanonicalReferenceData(env?: Ctx): Promise<void> {
  const integrity = verifySeedIntegrity()
  if (!integrity.valid) {
    throw new Error(`Seed verification failed: ${integrity.errors.join(', ')}`)
  }

  const activeEnv = env || createCtx(SUPERUSER_ID, {}, getModel)

  const Country = getModel('vx.zone')
  const Currency = getModel('vx.coin')
  const Lang = getModel('ix.lang')
  const Timezone = getModel('ix.timezone')
  const Role = getModel('vx.role')
  const ConfigParam = getModel('ir.config_parameter')
  const Sequence = getModel('ir.sequence')

  // 1. Countries
  if (Country) {
    const countriesData = JSON.parse(readFileSync(join(dataDir, 'countries.json'), 'utf8'))
    for (const item of countriesData) {
      const existing = await Country.fetch(Country, activeEnv, [['code', '=', item.code]])
      if (existing.length === 0) {
        await Country.spawn(Country, activeEnv, item)
      } else {
        await Country.morph(Country, activeEnv, existing[0].id, item)
      }
    }
  }

  // 2. Currencies
  if (Currency) {
    const currenciesData = JSON.parse(readFileSync(join(dataDir, 'currencies.json'), 'utf8'))
    for (const item of currenciesData) {
      const existing = await Currency.fetch(Currency, activeEnv, [['code', '=', item.code]])
      if (existing.length === 0) {
        await Currency.spawn(Currency, activeEnv, item)
      } else {
        await Currency.morph(Currency, activeEnv, existing[0].id, item)
      }
    }
  }

  // 3. Languages
  if (Lang) {
    const languagesData = JSON.parse(readFileSync(join(dataDir, 'languages.json'), 'utf8'))
    for (const item of languagesData) {
      const existing = await Lang.fetch(Lang, activeEnv, [['code', '=', item.code]])
      if (existing.length === 0) {
        await Lang.spawn(Lang, activeEnv, item)
      } else {
        await Lang.morph(Lang, activeEnv, existing[0].id, item)
      }
    }
  }

  // 4. Timezones
  if (Timezone) {
    const timezonesData = JSON.parse(readFileSync(join(dataDir, 'timezones.json'), 'utf8'))
    for (const item of timezonesData) {
      const existing = await Timezone.fetch(Timezone, activeEnv, [['name', '=', item.name]])
      if (existing.length === 0) {
        await Timezone.spawn(Timezone, activeEnv, item)
      } else {
        await Timezone.morph(Timezone, activeEnv, existing[0].id, item)
      }
    }
  }

  // 5. System Data (Roles, Config, Sequences)
  const systemData = JSON.parse(readFileSync(join(dataDir, 'system-data.json'), 'utf8'))

  if (Role && systemData.roles) {
    for (const r of systemData.roles) {
      const existing = await Role.fetch(Role, activeEnv, [['name', '=', r.name]])
      if (existing.length === 0) {
        await Role.spawn(Role, activeEnv, r)
      } else {
        await Role.morph(Role, activeEnv, existing[0].id, r)
      }
    }
  }

  if (ConfigParam && systemData.configParameters) {
    for (const p of systemData.configParameters) {
      const existing = await ConfigParam.fetch(ConfigParam, activeEnv, [['key', '=', p.key]])
      if (existing.length === 0) {
        await ConfigParam.spawn(ConfigParam, activeEnv, p)
      } else {
        await ConfigParam.morph(ConfigParam, activeEnv, existing[0].id, p)
      }
    }
  }

  if (Sequence && systemData.sequences) {
    for (const s of systemData.sequences) {
      const existing = await Sequence.fetch(Sequence, activeEnv, [['code', '=', s.code]])
      if (existing.length === 0) {
        await Sequence.spawn(Sequence, activeEnv, s)
      } else {
        await Sequence.morph(Sequence, activeEnv, existing[0].id, s)
      }
    }
  }
}
