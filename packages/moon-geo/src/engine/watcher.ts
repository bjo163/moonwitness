import { createHash } from 'node:crypto'
import { readFileSync, existsSync } from 'node:fs'

export interface IngestedSnapshot {
  sourceName: string
  revision: string
  checksum: string
  recordCount: number
  data: any
}

/**
 * Ingest and validate an official source snapshot archive
 */
export function ingestSourceSnapshot(
  sourceName: string,
  filePath: string,
  revision: string
): IngestedSnapshot {
  if (!existsSync(filePath)) {
    throw new Error(`Snapshot file not found: ${filePath}`)
  }

  const rawContent = readFileSync(filePath, 'utf8')
  const checksum = createHash('sha256').update(rawContent).digest('hex')
  const parsed = JSON.parse(rawContent)

  const recordCount =
    (parsed.provinces?.length || 0) +
    (parsed.cities?.length || 0) +
    (parsed.sampleDistricts?.length || 0) +
    (parsed.sampleVillages?.length || 0)

  return {
    sourceName,
    revision,
    checksum,
    recordCount,
    data: parsed
  }
}
