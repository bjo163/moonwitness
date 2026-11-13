import { createHash } from 'node:crypto'
import { readdir, readFile, writeFile } from 'node:fs/promises'
import { join, relative } from 'node:path'

const root = process.argv[2] || 'packages/moon-mizan'
const output = process.argv[3] || '.audit/mizan-legacy-migration-report.json'
const keys = ['case', 'assessment', 'filter', 'reference']
const files = []
async function walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name)
    if (entry.isDirectory() && !entry.name.startsWith('.')) await walk(path)
    else if (/\.(json|jsonl|ts|js)$/.test(entry.name)) files.push(path)
  }
}
await walk(root)
const records = []
for (const file of files) {
  const text = await readFile(file, 'utf8')
  const lower = text.toLowerCase()
  if (!keys.some((key) => lower.includes(`mz.${key}`) || lower.includes(`'${key}'`))) continue
  records.push({ path: relative(process.cwd(), file).replaceAll('\\', '/'), checksum: createHash('sha256').update(text).digest('hex'), status: 'unresolved', warnings: ['Legacy source requires explicit field mapping and Witness provenance review.'], raw_payload_preserved: true })
}
const report = { source_root: root, record_count: records.length, duplicate_check: 'checksum-and-external-identity-required-at-import', records }
await writeFile(output, JSON.stringify(report, null, 2) + '\n')
console.log(JSON.stringify({ output, record_count: records.length }, null, 2))
