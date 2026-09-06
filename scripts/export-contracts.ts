#!/usr/bin/env tsx

/**
 * ◈ MOONWITNESS — UNIVERSAL CONTRACT EXPORTER
 *
 * Exports the canonical OpenAPI 3.0 specification from the @moon/protocol
 * and @moon/server registries to contracts/openapi/openapi.json for polyglot
 * consumption (Python, Go, Rust, and client generators).
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { generateOpenApi } from '../packages/moon-server/src/openapi-schema.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, '..')
const targetDir = path.join(rootDir, 'contracts', 'openapi')
const targetFile = path.join(targetDir, 'openapi.json')

fs.mkdirSync(targetDir, { recursive: true })

const spec = generateOpenApi()
fs.writeFileSync(targetFile, JSON.stringify(spec, null, 2) + '\n', 'utf8')

console.log(`✅ Universal OpenAPI contract exported to: ${path.relative(rootDir, targetFile)}`)
