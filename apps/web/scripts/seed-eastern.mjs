import fs from 'fs'
import { createClient } from '@supabase/supabase-js'

const env = fs.readFileSync('.env.local', 'utf-8')
const url = env.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/)?.[1]
const key = env.match(/SUPABASE_SERVICE_ROLE_KEY=(.*)/)?.[1]

const sb = createClient(url, key)

async function seedOthers() {
  console.log("Fetching IDs for Dhammapada and Dao De Jing...")
  const { data: scripts, error: fetchErr } = await sb.from('divine_scriptures').select('id, name').in('name', ['Dhammapada', 'Dao De Jing'])
  
  if (fetchErr || !scripts || scripts.length === 0) {
    return console.error("Failed to fetch scripture IDs", fetchErr)
  }
  
  const dhammaId = scripts.find(s => s.name === 'Dhammapada')?.id
  const daoId = scripts.find(s => s.name === 'Dao De Jing')?.id

  // Cleanup old books/verses for these 2
  await sb.from('scripture_books').delete().in('scripture_id', [dhammaId, daoId])

  console.log("Inserting Books...")
  const books = [
    { scripture_id: dhammaId, book_number: 1, name: "Yamakavagga", original_name: "Yamakavagga", chapters_count: 20, summary: "Bab tentang Pasangan (Kebaikan dan Keburukan)." },
    { scripture_id: daoId, book_number: 1, name: "Bab 1", original_name: "Chapter 1", chapters_count: 81, summary: "Kebenaran Dao yang tak terkatakan." }
  ]
  const { data: insertedBooks, error: booksErr } = await sb.from('scripture_books').insert(books).select()
  if (booksErr) return console.error(booksErr)
  
  const yamaId = insertedBooks.find(b => b.name === 'Yamakavagga').id
  const chap1Id = insertedBooks.find(b => b.name === 'Bab 1').id

  console.log("Inserting Verses...")
  const verses = [
    // DHAMMAPADA (Pali)
    {
      scripture_id: dhammaId, book_id: yamaId, chapter_number: 1, verse_number: 1,
      text_original: "Mano pubbaṅgamā dhammā, mano seṭṭhā manomayā.",
      text_transliteration: "Mano pubbangama dhamma, mano settha manomaya",
      text_translated: "Pikiran adalah pelopor dari segala sesuatu, pikiran adalah pemimpin, pikiran adalah pembentuk.",
      tafsir: "Segala tindakan jasmani maupun ucapan bersumber dari pikiran (kesadaran).",
      topic_tags: ["Pikiran", "Karma"]
    },
    // DAO DE JING (Chinese)
    {
      scripture_id: daoId, book_id: chap1Id, chapter_number: 1, verse_number: 1,
      text_original: "道可道，非常道。名可名，非常名。",
      text_transliteration: "Dào kě dào, fēi cháng dào. Míng kě míng, fēi cháng míng.",
      text_translated: "Dao (Jalan) yang dapat diungkapkan dengan kata-kata, bukanlah Dao yang abadi. Nama yang dapat disebutkan, bukanlah Nama yang abadi.",
      tafsir: "Kebenaran Mutlak melampaui konsep bahasa manusia.",
      topic_tags: ["Kebijaksanaan", "Ketakterbatasan"]
    }
  ]

  const { error: versesErr } = await sb.from('scripture_verses').insert(verses)
  if (versesErr) return console.error(versesErr)

  console.log("✅ Successfully seeded Eastern scriptures!")
}

seedOthers()
