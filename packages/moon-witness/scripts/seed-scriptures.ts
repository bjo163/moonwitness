/**
 * Seed Other Divine Scriptures (Taurat, Zabur, Injil) into wx_scripture
 * Source: Hardcoded metadata
 */
import { initSeedDb } from './seed-utils.ts'

const SCRIPTURES = [
  {
    name: 'Taurat (Torah)', original_name: 'תּוֹרָה', slug: 'taurat',
    religion: 'Judaism / Abrahamic', type: 'canonical',
    books_count: 5, chapters_count: 187, verses_count: 5853,
    authenticity_status: 'Preserved (Partial) — Historical Redactions',
    revelation_era: '~1400 SM', prophet: 'Nabi Musa a.s.',
    description: 'Lima Kitab Musa (Pentateuch): Genesis, Exodus, Leviticus, Numbers, Deuteronomy.',
    theme_color: '#1565C0'
  },
  {
    name: 'Zabur (Psalms)', original_name: 'תְּהִלִּים', slug: 'zabur',
    religion: 'Judaism / Abrahamic', type: 'canonical',
    books_count: 1, chapters_count: 150, verses_count: 2461,
    authenticity_status: 'Preserved (Partial) — Historical Compilations',
    revelation_era: '~1000 SM', prophet: 'Nabi Daud a.s.',
    description: 'Mazmur / Psalms — kitab nyanyian pujian dan doa Nabi Daud a.s.',
    theme_color: '#6A1B9A'
  },
  {
    name: 'Injil (Gospel)', original_name: 'Εὐαγγέλιον', slug: 'injil',
    religion: 'Christianity / Abrahamic', type: 'canonical',
    books_count: 4, chapters_count: 89, verses_count: 3779,
    authenticity_status: 'Preserved (Partial) — Canonical Compilation',
    revelation_era: '~30 M', prophet: 'Nabi Isa a.s.',
    description: 'Empat Injil Kanonik: Matius, Markus, Lukas, Yohanes — ajaran Nabi Isa a.s.',
    theme_color: '#C62828'
  }
]

export async function seedScriptures() {
  const db = await initSeedDb()

  for (const s of SCRIPTURES) {
    const existing = await db('wx_scripture').where({ slug: s.slug }).first()
    if (!existing) {
      await db('wx_scripture').insert({ ...s, is_active: true })
      console.log(`  ✅ ${s.name} registered`)
    } else {
      console.log(`  ⏭️  ${s.name} already exists`)
    }
  }
}

// Run standalone
if (import.meta.url === `file://${process.argv[1]?.replace(/\\/g, '/')}`) {
  seedScriptures().catch(console.error).finally(() => process.exit())
}
