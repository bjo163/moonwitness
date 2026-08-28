/**
 * Master Seed Script — Seeds moon-witness data.
 *
 * Run: pnpm --filter @moon/witness seed
 * Or:  npx tsx packages/moon-witness/scripts/seed-all.ts
 *
 * New canonical graph data is seeded first. Legacy flat scripture/tradition
 * seeds remain temporarily for migration compatibility until #55.
 *
 * External API-dependent seeds (Quran, Hadith) are gated behind --with-external
 * to keep canonical seeding deterministic and offline-capable.
 */
import { initSeedDb } from './seed-utils.js'
import { seedWitnessGraphCore } from './seed-graph-core.js'
import { seedScriptures } from './seed-scriptures.js'
import { seedQuranSurahsAyahs } from './seed-quran.js'
import { seedHadithBooks } from './seed-hadiths.js'
import { seedAsmaulHusna } from './seed-asmaul-husna.js'
import { seedTraditions } from './seed-traditions.js'
import { seedDevotions } from './seed-devotions.js'

const withExternal = process.argv.includes('--with-external')

async function seedAll() {
  console.log('Moon Witness — Full Data Seed')
  console.log('================================\n')

  await initSeedDb()

  console.log('[Phase 0] Witness Graph Core...')
  const graph = await seedWitnessGraphCore()
  console.log(`  ${graph.relationTypeCount} relation types (${graph.ontologyVersion})`)

  console.log('\n[Phase 1] Scriptures Metadata...')
  await seedScriptures()

  console.log('\n[Phase 2] Asmaul Husna...')
  await seedAsmaulHusna()

  console.log('\n[Phase 3] Traditions...')
  await seedTraditions()

  console.log('\n[Phase 4] Devotional Content...')
  await seedDevotions()

  if (withExternal) {
    console.log('\n[Phase 5] Quran Surahs & Ayahs (external API)...')
    await seedQuranSurahsAyahs()

    console.log('\n[Phase 6] Hadith Books...')
    await seedHadithBooks()
    console.log('  Full legacy hadith seeding remains a separate migration source.')
  } else {
    console.log('\n[Phase 5-6] Skipped external API seeds (use --with-external to enable)')
  }

  console.log('\n================================')
  console.log('ALL DATA SEEDED SUCCESSFULLY!')
  console.log('================================')
}

seedAll().catch(console.error).finally(() => process.exit())
