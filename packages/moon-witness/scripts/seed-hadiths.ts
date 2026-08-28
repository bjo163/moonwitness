/**
 * Seed Hadith Books & Hadiths into wx_tradition + wx_tradition_item
 * 
 * Source: hadis-api-id.vercel.app
 * Data: 9 Kutubut Tis'ah, ~38,500 Hadiths
 */
import { initSeedDb, batchInsert, progress } from './seed-utils.ts'

const HADITH_API = 'https://hadis-api-id.vercel.app/hadith'

const HADITH_BOOKS = [
  { slug: 'bukhari', name: 'Shahih Al-Bukhari', total: 6638, grade: 'SHAHIH', author: 'Imam Al-Bukhari r.a.', desc: 'Kitab himpunan hadits paling shahih.' },
  { slug: 'muslim', name: 'Shahih Muslim', total: 4930, grade: 'SHAHIH', author: 'Imam Muslim r.a.', desc: 'Kitab himpunan hadits shahih.' },
  { slug: 'tirmidzi', name: 'Sunan At-Tirmidzi', total: 3625, grade: 'HASAN', author: 'Imam At-Tirmidzi r.a.', desc: 'Kitab hadits hukum & fiqih.' },
  { slug: 'abudaud', name: 'Sunan Abu Daud', total: 4419, grade: 'HASAN', author: 'Imam Abu Daud r.a.', desc: 'Kitab hadits hukum fiqih.' },
  { slug: 'nasai', name: "Sunan An-Nasa'i", total: 5364, grade: 'HASAN', author: "Imam An-Nasa'i r.a.", desc: 'Kitab sunan.' },
  { slug: 'ibnumajah', name: 'Sunan Ibnu Majah', total: 4285, grade: 'MIXED', author: 'Imam Ibnu Majah r.a.', desc: 'Kitab sunan.' },
  { slug: 'malik', name: 'Muwatta Malik', total: 1594, grade: 'SHAHIH', author: 'Imam Malik bin Anas r.a.', desc: 'Kitab hadits dan fiqih tertua.' },
  { slug: 'ahmad', name: 'Musnad Ahmad', total: 4305, grade: 'HASAN', author: 'Imam Ahmad bin Hanbal r.a.', desc: 'Kitab musnad hadits.' },
  { slug: 'darimi', name: 'Sunan Ad-Darimi', total: 3367, grade: 'HASAN', author: 'Imam Ad-Darimi r.a.', desc: 'Kitab sunan.' },
]

export async function seedHadithBooks() {
  const db = await initSeedDb()

  // Ensure Quran scripture exists for linking
  const quranScripture = await db('wx_scripture').where({ slug: 'quran' }).first()

  console.log('  📚 Seeding 9 Hadith Book Collections...')
  for (const book of HADITH_BOOKS) {
    const existing = await db('wx_tradition').where({ slug: book.slug }).first()
    if (!existing) {
      await db('wx_tradition').insert({
        scripture_id: quranScripture?.id || null,
        slug: book.slug,
        name: book.name,
        total_items: book.total,
        grade_level: book.grade,
        category: 'Kutubut Tisah',
        author: book.author,
        description: book.desc,
        is_active: true
      })
    }
  }
  console.log('  ✅ 9 Hadith Book Collections registered!')
}

export async function seedHadiths() {
  const db = await initSeedDb()

  console.log('  📜 Seeding ~38,500 Hadiths from API...')
  for (const book of HADITH_BOOKS) {
    const tradition = await db('wx_tradition').where({ slug: book.slug }).first()
    if (!tradition) {
      console.warn(`  ⚠️ Tradition ${book.slug} not found, skipping`)
      continue
    }

    // Check how many already seeded
    const countResult = await db('wx_tradition_item').where({ collection_id: tradition.id }).count('id as cnt').first()
    const existingCount = Number(countResult?.cnt || 0)
    if (existingCount >= book.total * 0.9) {
      console.log(`  ⏭️  ${book.name}: ${existingCount} hadiths already seeded, skipping`)
      continue
    }

    const totalPages = Math.ceil(book.total / 20)
    let seededCount = 0

    for (let page = 1; page <= totalPages; page++) {
      try {
        const res = await fetch(`${HADITH_API}/${book.slug}?page=${page}`)
        if (!res.ok) continue
        const json = await res.json()
        if (!json?.items?.length) continue

        const rows = json.items.map((item: any, idx: number) => ({
          collection_id: tradition.id,
          number: (page - 1) * 20 + (idx + 1),
          chapter_number: 1,
          text_original: item.arab || '',
          translation_id: item.id || '',
          translation_en: '',
          grade: book.grade,
          is_active: true
        }))

        await batchInsert('wx_tradition_item', rows, 50, 'id')
        seededCount += rows.length
        progress(page, totalPages, `${book.slug.toUpperCase()} pages`)
      } catch (err: any) {
        console.warn(`\n  ⚠️ Error page ${page} for ${book.slug}: ${err.message}`)
      }

      // Rate limit
      await new Promise(r => setTimeout(r, 100))
    }
    console.log(`  ✅ ${book.name}: ${seededCount} hadiths seeded`)
  }
}

// Run standalone
if (import.meta.url === `file://${process.argv[1]?.replace(/\\/g, '/')}`) {
  seedHadithBooks().then(() => seedHadiths()).catch(console.error).finally(() => process.exit())
}
