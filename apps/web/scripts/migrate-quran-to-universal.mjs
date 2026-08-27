import fs from 'fs'
import { createClient } from '@supabase/supabase-js'

const env = fs.readFileSync('.env.local', 'utf-8')
const url = env.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/)?.[1]
const key = env.match(/SUPABASE_SERVICE_ROLE_KEY=(.*)/)?.[1]

const sb = createClient(url, key)

async function migrateQuran() {
  console.log("Fetching Al-Quran ID from divine_scriptures...")
  const { data: quranScripture, error: qErr } = await sb.from('divine_scriptures').select('id').eq('name', "Al-Qur'an").single()
  
  if (qErr || !quranScripture) {
    return console.error("Al-Qur'an not found in divine_scriptures", qErr)
  }
  const quranId = quranScripture.id

  console.log(`Al-Qur'an ID is ${quranId}. Fetching all Surahs...`)
  const { data: surahs } = await sb.from('surahs').select('*').order('number', { ascending: true })
  
  if (!surahs || surahs.length === 0) return console.log("No surahs found to migrate.")

  console.log(`Found ${surahs.length} Surahs. Inserting into scripture_books...`)
  
  // Clean up first just in case
  await sb.from('scripture_books').delete().eq('scripture_id', quranId)

  const booksToInsert = surahs.map(s => ({
    scripture_id: quranId,
    book_number: s.number,
    name: s.name_latin,
    original_name: s.name_arabic,
    chapters_count: s.number_of_ayahs, // for Quran, 'chapters' count here means ayahs
    summary: `${s.revelation_type} • ${s.number_of_ayahs} Ayat`,
    audio_url: s.audio_full
  }))

  const { data: insertedBooks, error: bErr } = await sb.from('scripture_books').insert(booksToInsert).select()
  if (bErr) return console.error("Error inserting books", bErr)

  console.log("Surahs inserted successfully! Now fetching all Ayahs (this might take a moment)...")
  
  // Fetch ayahs in chunks or just all (6236 is not that huge for a backend script)
  const { data: ayahs, error: aErr } = await sb.from('ayahs').select('*')
  if (aErr) return console.error("Error fetching ayahs", aErr)
  
  console.log(`Found ${ayahs.length} Ayahs. Preparing migration...`)
  
  const versesToInsert = ayahs.map(a => {
    // Find the corresponding book_id for this surah
    const book = insertedBooks.find(b => b.book_number === a.surah_number)
    return {
      scripture_id: quranId,
      book_id: book.id,
      chapter_number: a.surah_number,
      verse_number: a.ayah_number,
      text_original: a.text_arabic,
      text_transliteration: a.text_latin || "",
      text_translated: a.translation_id,
      audio_url: a.audio_url
    }
  })

  // Insert verses in chunks of 1000 to avoid payload limits
  const chunkSize = 1000
  let insertedCount = 0
  for (let i = 0; i < versesToInsert.length; i += chunkSize) {
    const chunk = versesToInsert.slice(i, i + chunkSize)
    const { error: vErr } = await sb.from('scripture_verses').insert(chunk)
    if (vErr) {
      console.error(`Error inserting chunk starting at index ${i}`, vErr)
    } else {
      insertedCount += chunk.length
      console.log(`Inserted ${insertedCount}/${versesToInsert.length} verses...`)
    }
  }

  console.log("✅ Al-Qur'an successfully migrated to Universal Schema!")
}

migrateQuran()
