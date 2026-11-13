import { describe, expect, it, afterEach } from 'vitest'
import { readFileSync, existsSync, writeFileSync, unlinkSync, chmodSync, mkdirSync, rmSync } from 'node:fs'
import { join } from 'node:path'
import { spawnSync } from 'node:child_process'

const CLI_PATH = join(process.cwd(), 'packages/cli/mw.mjs')

function runProdCheck(cwd: string) {
  const result = spawnSync(process.execPath, [CLI_PATH, 'prod-check'], {
    encoding: 'utf8',
    cwd,
    env: { ...process.env, PATH: process.env.PATH || '' },
  })
  return {
    stdout: result.stdout || '',
    stderr: result.stderr || '',
    status: result.status ?? 0,
  }
}

describe('Evidence-based prod-check (#99)', () => {
  const root = process.cwd()

  afterEach(() => {
    const tempDir = join(root, 'test-prod-check-*')
    // Cleanup handled per-test via rmSync in each test or via afterAll
  })

  it('returns non-zero when required files are missing', () => {
    const tempDir = join(root, 'test-prod-check-missing')
    if (existsSync(tempDir)) rmSync(tempDir, { recursive: true })
    mkdirSync(tempDir, { recursive: true })

    const result = runProdCheck(tempDir)
    expect(result.status).not.toBe(0)
    expect(result.stdout).toContain('MISSING')

    rmSync(tempDir, { recursive: true })
  })

  it('detects placeholder tokens in production env file', () => {
    const tempDir = join(root, 'test-prod-check-env')
    if (existsSync(tempDir)) rmSync(tempDir, { recursive: true })
    mkdirSync(tempDir, { recursive: true })

    writeFileSync(join(tempDir, 'Dockerfile'), 'FROM node:20')
    writeFileSync(join(tempDir, 'docker-compose.yml'), 'services: {}')
    writeFileSync(join(tempDir, 'ecosystem.config.cjs'), 'module.exports = {}')
    writeFileSync(join(tempDir, '.env.production.example'), 'JWT_SECRET=REPLACE_WITH_SECRET\n')
    mkdirSync(join(tempDir, 'deploy', 'nginx'), { recursive: true })
    writeFileSync(join(tempDir, 'deploy/nginx/moonwitness.conf'), 'server {}')
    mkdirSync(join(tempDir, 'scripts'), { recursive: true })
    writeFileSync(join(tempDir, 'scripts/deploy-prod.sh'), '#!/bin/bash\necho ok')
    writeFileSync(join(tempDir, 'scripts/deploy-prod.ps1'), 'Write-Host ok')
    writeFileSync(join(tempDir, '.gitattributes'), '*.text eol=lf')

    writeFileSync(join(tempDir, '.env.production'), 'JWT_SECRET=REPLACE_WITH_SECRET\nDATABASE_URL=postgres://user:pass@postgres:5432/db\n')

    const result = runProdCheck(tempDir)
    expect(result.stdout).toContain('Production Env Placeholders')
    expect(result.status).not.toBe(0)

    rmSync(tempDir, { recursive: true })
  })

  it('detects exposed DB/Redis ports in docker-compose', () => {
    const tempDir = join(root, 'test-prod-check-expose')
    if (existsSync(tempDir)) rmSync(tempDir, { recursive: true })
    mkdirSync(tempDir, { recursive: true })

    writeFileSync(join(tempDir, 'Dockerfile'), 'FROM node:20')
    writeFileSync(join(tempDir, 'docker-compose.yml'), `services:\n  postgres:\n    ports:\n      - "5432:5432"\n  redis:\n    ports:\n      - "6379:6379"\n`)
    writeFileSync(join(tempDir, 'ecosystem.config.cjs'), 'module.exports = {}')
    writeFileSync(join(tempDir, '.env.production.example'), 'JWT_SECRET=some-secret\n')
    mkdirSync(join(tempDir, 'deploy', 'nginx'), { recursive: true })
    writeFileSync(join(tempDir, 'deploy/nginx/moonwitness.conf'), 'server {}')
    mkdirSync(join(tempDir, 'scripts'), { recursive: true })
    writeFileSync(join(tempDir, 'scripts/deploy-prod.sh'), '#!/bin/bash\necho ok')
    writeFileSync(join(tempDir, 'scripts/deploy-prod.ps1'), 'Write-Host ok')
    writeFileSync(join(tempDir, '.gitattributes'), '*.text eol=lf')

    const result = runProdCheck(tempDir)
    expect(result.stdout).toContain('Private Service Exposure Policy')
    expect(result.status).not.toBe(0)

    rmSync(tempDir, { recursive: true })
  })

  it('passes when production env has no placeholders and compose is safe', () => {
    const tempDir = join(root, 'test-prod-check-pass')
    if (existsSync(tempDir)) rmSync(tempDir, { recursive: true })
    mkdirSync(tempDir, { recursive: true })

    writeFileSync(join(tempDir, 'Dockerfile'), 'FROM node:20')
    writeFileSync(join(tempDir, 'docker-compose.yml'), `services:\n  api:\n    build: .\n    ports:\n      - "4000:4000"\n`)
    writeFileSync(join(tempDir, 'ecosystem.config.cjs'), 'module.exports = {}')
    writeFileSync(join(tempDir, '.env.production.example'), 'JWT_SECRET=some-secret\n')
    mkdirSync(join(tempDir, 'deploy', 'nginx'), { recursive: true })
    writeFileSync(join(tempDir, 'deploy/nginx/moonwitness.conf'), 'server {}')
    mkdirSync(join(tempDir, 'scripts'), { recursive: true })
    writeFileSync(join(tempDir, 'scripts/deploy-prod.sh'), '#!/bin/bash\necho ok')
    writeFileSync(join(tempDir, 'scripts/deploy-prod.ps1'), 'Write-Host ok')
    writeFileSync(join(tempDir, '.gitattributes'), '*.text eol=lf')

    writeFileSync(join(tempDir, '.env.production'), 'JWT_SECRET=actual-secret-here\nDATABASE_URL=postgres://user:pass@postgres:5432/db\n')
    chmodSync(join(tempDir, 'scripts/deploy-prod.sh'), 0o755)

    const result = runProdCheck(tempDir)
    expect(result.status).toBe(0)
    expect(result.stdout).toContain('PASSED')

    try {
      rmSync(tempDir, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 })
    } catch {}
  })
})
