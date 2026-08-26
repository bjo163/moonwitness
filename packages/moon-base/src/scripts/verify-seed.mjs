import { readFileSync, existsSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const dataDir = join(__dirname, '../data')

const manifestPath = join(dataDir, 'manifest.json')
if (!existsSync(manifestPath)) {
  console.error('Error: manifest.json not found in data directory')
  process.exit(1)
}

const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'))
let failed = false

console.log(`Verifying ${manifest.files.length} seed files (Manifest version: ${manifest.version})...`)

for (const file of manifest.files) {
  const filePath = join(dataDir, file.filename)
  if (!existsSync(filePath)) {
    console.error(`❌ Missing: ${file.filename}`)
    failed = true
    continue
  }

  const content = readFileSync(filePath, 'utf8').replace(/\r\n/g, '\n')
  const calculatedHash = createHash('sha256').update(content).digest('hex')

  if (calculatedHash !== file.hash) {
    console.error(`❌ Mismatch in ${file.filename}: expected ${file.hash}, got ${calculatedHash}`)
    failed = true
  } else {
    console.log(`✅ Verified: ${file.filename} (${file.size} bytes, SHA-256: ${calculatedHash.slice(0, 12)}...)`)
  }
}

if (failed) {
  console.error('\nSeed verification failed!')
  process.exit(1)
} else {
  console.log('\nAll seed files verified successfully against provenance manifest.')
  process.exit(0)
}
