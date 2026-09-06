#!/usr/bin/env tsx

/**
 * ◈ MOONWITNESS — CONTRACT DRIFT DETECTOR
 *
 * Verifies that the committed contracts/openapi/openapi.json exactly matches
 * the canonical `@moon/protocol` and `@moon/server` registry without any drift.
 * Used in CI/CD pre-flight checks and release verification.
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { generateOpenApi } from '../packages/moon-server/src/openapi-schema.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, '..')
const targetFile = path.join(rootDir, 'contracts', 'openapi', 'openapi.json')

if (!fs.existsSync(targetFile)) {
  console.error(`❌ Contract file missing: ${path.relative(rootDir, targetFile)}`)
  console.error(`Run 'pnpm contracts:export' to generate the initial contract artifact.`)
  process.exit(1)
}

const savedContent = fs.readFileSync(targetFile, 'utf8')
const expectedSpec = generateOpenApi()
const expectedContent = JSON.stringify(expectedSpec, null, 2) + '\n'

// Normalize CRLF to LF for cross-platform stability
const normSaved = savedContent.replace(/\r\n/g, '\n')
const normExpected = expectedContent.replace(/\r\n/g, '\n')

if (normSaved !== normExpected) {
  console.error(`\n❌ CONTRACT DRIFT DETECTED!`)
  console.error(`contracts/openapi/openapi.json does not match the canonical protocol registry.`)
  console.error(`Run 'pnpm contracts:export' to synchronize the universal contract with code.\n`)
  process.exit(1)
}

console.log(`✅ Universal Contract Verified: contracts/openapi/openapi.json matches protocol registry 100%.`)
process.exit(0)
