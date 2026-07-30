import fs from 'fs'
import { createClient } from '@supabase/supabase-js'

const env = fs.readFileSync('.env.local', 'utf-8')
const url = env.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/)?.[1]
const key = env.match(/SUPABASE_SERVICE_ROLE_KEY=(.*)/)?.[1]

const sb = createClient(url, key)

async function ingestBible() {
  console.log("Downloading full Bible (BBE) JSON from github...")
  const res = await fetch('https://raw.githubusercontent.com/thiagobodruk/bible/master/json/en_bbe.json')
  const bible = await res.json()
  
  console.log(`Downloaded ${bible.length} books.`)

  console.log("Fetching IDs for Taurat, Zabur, Injil...")
  const { data: scripts, error: fetchErr } = await sb.from('divine_scriptures').select('id, name').in('name', ['Taurat', 'Zabur', 'Injil'])
  if (fetchErr || !scripts) return console.error(fetchErr)
  
  const tauratId = scripts.find(s => s.name === 'Taurat')?.id
  const zaburId = scripts.find(s => s.name === 'Zabur')?.id
  const injilId = scripts.find(s => s.name === 'Injil')?.id

  // Wipe old data for these 3 scriptures
  console.log("Wiping old data...")
  await sb.from('scripture_books').delete().in('scripture_id', [tauratId, zaburId, injilId])

  // Mapping
  // Taurat = Books 0-4
  // Zabur = Book 18
  // Injil = Books 39-65
  const targets = [
    { scriptId: tauratId, startIndex: 0, endIndex: 4 },
    { scriptId: zaburId, startIndex: 18, endIndex: 18 },
    { scriptId: injilId, startIndex: 39, endIndex: 65 }
  ]

  let bookCounter = 1

  for (const target of targets) {
    if (!target.scriptId) continue

    for (let i = target.startIndex; i <= target.endIndex; i++) {
      const bookData = bible[i]
      console.log(`Processing Book: ${bookData.name}`)

      // Insert Book
      const { data: insertedBook, error: bErr } = await sb.from('scripture_books').insert({
        scripture_id: target.scriptId,
        book_number: bookCounter++,
        name: bookData.name,
        original_name: bookData.abbrev,
        chapters_count: bookData.chapters.length,
        summary: `Full ingestion of ${bookData.name}`
      }).select().single()

      if (bErr) {
         console.error(bErr)
         continue
      }

      // Collect Verses
      const verses = []
      bookData.chapters.forEach((chapter, chIdx) => {
        chapter.forEach((verseText, vIdx) => {
           verses.push({
             scripture_id: target.scriptId,
             book_id: insertedBook.id,
             chapter_number: chIdx + 1,
             verse_number: vIdx + 1,
             text_translated: verseText, // We put English text in translated
             topic_tags: []
           })
        })
      })

      // Insert verses in chunks
      const chunkSize = 1000
      let insertedCount = 0
      for (let j = 0; j < verses.length; j += chunkSize) {
        const chunk = verses.slice(j, j + chunkSize)
        const { error: vErr } = await sb.from('scripture_verses').insert(chunk)
        if (vErr) {
          console.error(`Error inserting chunk in ${bookData.name}`, vErr)
        } else {
          insertedCount += chunk.length
        }
      }
      console.log(`  -> Inserted ${insertedCount} verses for ${bookData.name}.`)
    }
  }

  console.log("✅ Full Bible Ingestion Complete!")
}

ingestBible()
