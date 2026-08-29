/**
 * Witness Corpus Sync CLI
 *
 * Usage:
 *   pnpm --filter=@moon/witness sync --manifest <code|path> [--dry-run]
 *
 * Implements deterministic sync from a release artifact or pinned revision
 * into the canonical @moon/witness domain graph models.
 */
import { existsSync, readFileSync } from 'node:fs'
import { resolve, join } from 'node:path'
import { createCtx, setupOrm, registerModel, SUPERUSER_ID } from '@moon/orm'
import {
  registerAdapter,
  executeImport,
  moonwitnessCorpusAdapter
} from '../src/index.js'
import { importCanonicalCorpus } from '../src/services/canonical-corpus-importer.js'
import WxSourcePolicy from '../src/models/wx-source-policy.js'
import WxSourceManifest from '../src/models/wx-source-manifest.js'
import WxSourceArtifact from '../src/models/wx-source-artifact.js'
import WxSourceSnapshot from '../src/models/wx-source-snapshot.js'
import WxSource from '../src/models/wx-source.js'
import WxProvenance from '../src/models/wx-provenance.js'
import WxTextEdition from '../src/models/wx-text-edition.js'
import WxPassage from '../src/models/wx-passage.js'
import WxContent from '../src/models/wx-content.js'
import WxEntity from '../src/models/wx-entity.js'
import WxTraditionCorpus from '../src/models/wx-tradition-corpus.js'
import WxTraditionUnit from '../src/models/wx-tradition-unit.js'

async function main() {
  const args = process.argv.slice(2)
  const isDryRun = args.includes('--dry-run')
  const manifestIdx = args.indexOf('--manifest')
  const manifestCode = manifestIdx !== -1 ? args[manifestIdx + 1] : 'quran-canonical-manifest'
  const artifactIdx = args.indexOf('--artifact')
  const artifactPath = artifactIdx !== -1 ? args[artifactIdx + 1] : undefined

  console.log('◈ MOONWITNESS — CANONICAL CORPUS SYNC')
  console.log(`Mode: ${isDryRun ? 'DRY RUN (No database mutation)' : 'LIVE SYNC'}`)
  console.log(`Manifest: ${manifestCode}`)

  // Register all models
  const models = [
    WxSourcePolicy,
    WxSourceManifest,
    WxSourceArtifact,
    WxSourceSnapshot,
    WxSource,
    WxProvenance,
    WxTextEdition,
    WxPassage,
    WxContent,
    WxEntity,
    WxTraditionCorpus,
    WxTraditionUnit
  ]

  const modelMap: Record<string, any> = {}
  for (const m of models) {
    registerModel(m)
    modelMap[m._name] = m
  }

  registerAdapter(moonwitnessCorpusAdapter)

  const env = createCtx(SUPERUSER_ID, {}, (name) => modelMap[name] || null)

  if (!artifactPath || !existsSync(artifactPath)) {
    console.log(`[STATUS] No local artifact provided or found at: ${artifactPath || '(none)'}`)
    console.log('[STATUS] Ready to consume pinned immutable release artifacts from moonwitness-corpus.')
    return
  }

  const baseDir = resolve(process.cwd())
  const result = await executeImport(
    manifestCode,
    artifactPath,
    env,
    baseDir,
    isDryRun ? undefined : importCanonicalCorpus
  )

  console.log(`\nImport Status: ${result.status}`)
  console.log(`Records Processed: ${result.recordsProcessed}`)
  console.log(`Records Created: ${result.recordsCreated}`)
  console.log(`Records Skipped: ${result.recordsSkipped}`)
  console.log(`Fingerprint: ${result.fingerprint}`)
}

if (process.env.NODE_ENV !== 'test') {
  main().catch((err) => {
    console.error('Corpus sync failed:', err)
    process.exit(1)
  })
}
