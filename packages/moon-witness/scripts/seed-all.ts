/**
 * Master Seed Script — Seeds ALL data into moon-witness tables
 * 
 * Run: pnpm --filter @moon/witness seed
 * Or:  npx tsx packages/moon-witness/scripts/seed-all.ts
 * 
 * Order matters! Scriptures must exist before Quran & Traditions.
 */
import { initSeedDb } from './seed-utils.js'
import { seedScriptures } from './seed-scriptures.js'
import { seedQuranSurahsAyahs } from './seed-quran.js'
import { seedHadithBooks, seedHadiths } from './seed-hadiths.js'
import { seedAsmaulHusna } from './seed-asmaul-husna.js'
import { seedTraditions } from './seed-traditions.js'
import { seedDevotions } from './seed-devotions.js'

async function seedAll() {
  console.log('🌙 ══════════════════════════════════════════')
  console.log('   Moon Witness — Full Data Seed')
  console.log('══════════════════════════════════════════════\n')

  await initSeedDb()

  // Phase 1: Scripture metadata (Quran, Taurat, Zabur, Injil)
  console.log('📖 Phase 1: Scriptures Metadata...')
  await seedScriptures()

  // Phase 2: Quran Surahs & Ayahs (114 surahs, 6236 ayahs)
  console.log('\n📖 Phase 2: Quran Surahs & Ayahs...')
  await seedQuranSurahsAyahs()

  // Phase 3: Hadith Collections + Individual Hadiths
  console.log('\n📜 Phase 3: Hadith Books...')
  await seedHadithBooks()
  // Note: Full 38K hadiths take ~10-15 min. Run separately if needed:
  //   npx tsx packages/moon-witness/scripts/seed-hadiths.ts
  console.log('  ℹ️  To seed full 38K hadiths, run: npx tsx packages/moon-witness/scripts/seed-hadiths.ts')

  // Phase 4: 99 Asmaul Husna
  console.log('\n✨ Phase 4: Asmaul Husna...')
  await seedAsmaulHusna()

  // Phase 5: Prophetic Traditions (Mishna, Tasbih Daud, Didache)
  console.log('\n📜 Phase 5: Prophetic Traditions...')
  await seedTraditions()

  // Phase 6: Devotional Content (Adhkar, Doa)
  console.log('\n🤲 Phase 6: Adhkar & Doa...')
  await seedDevotions()

  console.log('\n══════════════════════════════════════════════')
  console.log('🎉 ALL DATA SEEDED SUCCESSFULLY!')
  console.log('══════════════════════════════════════════════')
}

seedAll().catch(console.error).finally(() => process.exit())
