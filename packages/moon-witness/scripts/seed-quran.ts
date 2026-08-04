/**
 * Seed Quran Surahs & Ayahs into wx_scripture_book + wx_scripture_verse
 * 
 * Source: equran.id API v2
 * Data: 114 Surahs, 6,236 Ayahs
 */
import { initSeedDb, batchInsert, progress } from './seed-utils.js'

const EQURAN_API = 'https://equran.id/api/v2'

export async function seedQuranSurahsAyahs() {
  const db = await initSeedDb()

  // 1. Ensure Quran scripture exists
  const existing = await db('wx_scripture').where({ slug: 'quran' }).first()
  let scriptureId: number
  if (!existing) {
    const [row] = await db('wx_scripture').insert({
      name: 'Al-Quran Al-Karim',
      original_name: 'القرآن الكريم',
      slug: 'quran',
      religion: 'Islam',
      type: 'canonical',
      books_count: 114,
      chapters_count: 114,
      verses_count: 6236,
      authenticity_status: '100% Authentic — Preserved by Allah SWT',
      revelation_era: '610-632 M',
      prophet: 'Muhammad SAW',
      description: 'Kitab suci umat Islam, wahyu terakhir dari Allah SWT kepada Nabi Muhammad SAW melalui malaikat Jibril.',
      theme_color: '#1B5E20',
      is_active: true
    }).returning('id')
    scriptureId = row.id
    console.log('  📖 Created Quran scripture entry')
  } else {
    scriptureId = existing.id
    console.log('  📖 Quran scripture already exists')
  }

  // 2. Fetch all 114 surahs from equran.id
  console.log('  📡 Fetching 114 Surahs from equran.id...')
  const surahListRes = await fetch(`${EQURAN_API}/surat`)
  if (!surahListRes.ok) throw new Error('Failed to fetch surah list from equran.id')
  const surahListJson = await surahListRes.json()
  const surahs = surahListJson.data

  // 3. Seed each surah and its ayahs
  for (let i = 0; i < surahs.length; i++) {
    const s = surahs[i]
    const surahNum = s.nomor

    // Check if surah book already exists
    const existingBook = await db('wx_scripture_book')
      .where({ scripture_id: scriptureId, book_number: surahNum })
      .first()

    if (existingBook) {
      progress(i + 1, surahs.length, 'Surahs (skipped existing)')
      continue
    }

    // Fetch detail surah with ayahs
    const detailRes = await fetch(`${EQURAN_API}/surat/${surahNum}`)
    if (!detailRes.ok) {
      console.warn(`\n  ⚠️ Failed to fetch Surah ${surahNum}`)
      continue
    }
    const detailJson = await detailRes.json()
    const detail = detailJson.data

    const audioFull = detail.audioFull ? detail.audioFull['05'] || detail.audioFull['01'] : null

    // Insert surah as wx_scripture_book
    const [bookRow] = await db('wx_scripture_book').insert({
      scripture_id: scriptureId,
      book_number: detail.nomor,
      name: detail.namaLatin,
      name_original: detail.nama,
      slug: detail.namaLatin.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      chapters_count: 1,
      verses_count: detail.jumlahAyat,
      description: detail.deskripsi || '',
      audio_url: audioFull,
      revelation_type: detail.tempatTurun === 'Mekah' ? 'MAKKIYAH' : 'MADANIYAH',
      is_active: true
    }).returning('id')

    // Insert ayahs as wx_scripture_verse
    const verseRows = detail.ayat.map((a: any) => ({
      scripture_id: scriptureId,
      book_id: bookRow.id,
      chapter_number: 1,
      verse_number: a.nomorAyat,
      text_original: a.teksArab,
      text_transliteration: a.teksLatin || '',
      translation_id: a.teksIndonesia,
      translation_en: '',
      audio_url: a.audio ? a.audio['05'] || a.audio['01'] : null,
      is_active: true
    }))

    await batchInsert('wx_scripture_verse', verseRows, 200)
    progress(i + 1, surahs.length, 'Surahs + Ayahs')

    // Small delay to be nice to the API
    if (i < surahs.length - 1) {
      await new Promise(r => setTimeout(r, 200))
    }
  }

  console.log('  🎉 Quran: 114 Surahs + 6,236 Ayahs seeded!')
}

// Run standalone
if (import.meta.url === `file://${process.argv[1]?.replace(/\\/g, '/')}`) {
  seedQuranSurahsAyahs().catch(console.error).finally(() => process.exit())
}
