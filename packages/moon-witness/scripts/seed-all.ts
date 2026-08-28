/**
 * Master Seed Script — Seeds moon-witness data.
 *
 * Run: pnpm --filter @moon/witness seed
 * Or:  npx tsx packages/moon-witness/scripts/seed-all.ts
 *
 * New canonical graph data is seeded first. Legacy flat scripture/tradition
 * seeds remain temporarily for migration compatibility until #55.
 */
import { initSeedDb } from './seed-utils.ts'
import { seedWitnessGraphCore } from './seed-graph-core.ts'
import { seedScriptures } from './seed-scriptures.ts'
import { seedQuranSurahsAyahs } from './seed-quran.ts'
import { seedHadithBooks } from './seed-hadiths.ts'
import { seedAsmaulHusna } from './seed-asmaul-husna.ts'
import { seedTraditions } from './seed-traditions.ts'
import { seedDevotions } from './seed-devotions.ts'

async function seedAll() {
  console.log('🌙 ══════════════════════════════════════════')
  console.log('   Moon Witness — Full Data Seed')
  console.log('══════════════════════════════════════════════\n')

  await initSeedDb()

  // Phase 0: canonical relation ontology with stable external IDs.
  console.log('🕸️  Phase 0: Witness Graph Core...')
  const graph = await seedWitnessGraphCore()
  console.log(`  ✅ ${graph.relationTypeCount} relation types (${graph.ontologyVersion})`)

  // Legacy phases below remain until #51/#53/#54/#55 replace/migrate them.
  console.log('\n📖 Legacy Phase 1: Scriptures Metadata...')
  await seedScriptures()

  console.log('\n📖 Legacy Phase 2: Quran Surahs & Ayahs...')
  await seedQuranSurahsAyahs()

  console.log('\n📜 Legacy Phase 3: Hadith Books...')
  await seedHadithBooks()
  console.log('  ℹ️  Full legacy hadith seeding remains a separate migration source.')

  console.log('\n✨ Legacy Phase 4: Fixed Asma list (migration fixture only)...')
  await seedAsmaulHusna()

  console.log('\n📜 Legacy Phase 5: Traditions...')
  await seedTraditions()

  console.log('\n🤲 Legacy Phase 6: Devotional Content...')
  await seedDevotions()

  console.log('\n══════════════════════════════════════════════')
  console.log('🎉 ALL DATA SEEDED SUCCESSFULLY!')
  console.log('══════════════════════════════════════════════')
}

seedAll().catch(console.error).finally(() => process.exit())
