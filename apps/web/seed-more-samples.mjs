import fs from 'fs'
import { createClient } from '@supabase/supabase-js'

const env = fs.readFileSync('.env.local', 'utf-8')
const url = env.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/)?.[1]
const key = env.match(/SUPABASE_SERVICE_ROLE_KEY=(.*)/)?.[1]

const sb = createClient(url, key)

async function seedMore() {
  console.log("Fetching IDs for Satanic Bible, Book of the Dead, and Bhagavad Gita...")
  const { data: scripts, error: fetchErr } = await sb.from('divine_scriptures')
    .select('id, name')
    .in('name', ['The Satanic Bible', 'Book of the Dead', 'Bhagavad Gita'])
  
  if (fetchErr || !scripts || scripts.length === 0) {
    return console.error("Failed to fetch scripture IDs", fetchErr)
  }
  
  const satanicId = scripts.find(s => s.name === 'The Satanic Bible')?.id
  const deadId = scripts.find(s => s.name === 'Book of the Dead')?.id
  const gitaId = scripts.find(s => s.name === 'Bhagavad Gita')?.id

  // Cleanup old books/verses
  await sb.from('scripture_books').delete().in('scripture_id', [satanicId, deadId, gitaId])

  console.log("Inserting Books...")
  const books = [
    { scripture_id: satanicId, book_number: 1, name: "The Book of Satan", original_name: "Ignis", chapters_count: 5, summary: "The Infernal Diatribe." },
    { scripture_id: deadId, book_number: 1, name: "Spell 1", original_name: "Pert Em Hru 1", chapters_count: 192, summary: "Spell for coming forth by day." },
    { scripture_id: gitaId, book_number: 1, name: "Chapter 1", original_name: "Arjuna Viṣāda Yoga", chapters_count: 18, summary: "The Yoga of Arjuna's Dejection." }
  ]
  const { data: insertedBooks, error: booksErr } = await sb.from('scripture_books').insert(books).select()
  if (booksErr) return console.error(booksErr)
  
  const bSatanId = insertedBooks.find(b => b.name === 'The Book of Satan').id
  const bDeadId = insertedBooks.find(b => b.name === 'Spell 1').id
  const bGitaId = insertedBooks.find(b => b.name === 'Chapter 1').id

  console.log("Inserting Verses...")
  const verses = [
    // THE SATANIC BIBLE (English / Occult)
    {
      scripture_id: satanicId, book_id: bSatanId, chapter_number: 1, verse_number: 1,
      text_original: "In this arid wilderness of steel and stone I raise up my voice that you may hear.",
      text_transliteration: "",
      text_translated: "Di belantara gersang dari baja dan batu ini, aku meninggikan suaraku agar kau dapat mendengar.",
      tafsir: "Sebuah deklarasi penolakan terhadap norma agama tradisional dan pemujaan terhadap rasionalitas serta kebebasan ego individual.",
      topic_tags: ["Pemberontakan", "Ego"]
    },
    // BOOK OF THE DEAD (Ancient Egyptian)
    {
      scripture_id: deadId, book_id: bDeadId, chapter_number: 1, verse_number: 1,
      text_original: "𓂋𓏤 𓈖 𓉐𓂋𓏏 𓅓 𓉔𓂋𓅱 𓂋 𓈖𓏏𓂋𓄿 𓐍𓂋𓏏 𓈖𓏏𓂋",
      text_transliteration: "Ra en peret em heru",
      text_translated: "Mantera untuk keluar di siang hari menuju ke alam para dewa.",
      tafsir: "Dipercaya oleh bangsa Mesir Kuno untuk membimbing roh (Ka) melewati alam baka dengan aman.",
      topic_tags: ["Afterlife", "Magic"]
    },
    // BHAGAVAD GITA (Sanskrit)
    {
      scripture_id: gitaId, book_id: bGitaId, chapter_number: 1, verse_number: 1,
      text_original: "धर्मक्षेत्रे कुरुक्षेत्रे समवेता युयुत्सवः । मामकाः पाण्डवाश्चैव किमकुर्वत सञ्जय ॥",
      text_transliteration: "Dharma-kṣetre kuru-kṣetre samavetā yuyutsavaḥ, māmakāḥ pāṇḍavāścaiva kimakurvata sañjaya",
      text_translated: "Dhrtarastra berkata: Wahai Sanjaya, apa yang dilakukan oleh putra-putraku dan putra-putra Pandu, setelah mereka berkumpul di tempat ziarah Kuruksetra dengan keinginan untuk bertempur?",
      tafsir: "Pertanyaan pembuka dari epik Mahabharata, melambangkan konflik batin manusia antara kebenaran (Dharma) dan kebatilan.",
      topic_tags: ["Dharma", "Peperangan Batin"]
    }
  ]

  const { error: versesErr } = await sb.from('scripture_verses').insert(verses)
  if (versesErr) return console.error(versesErr)

  console.log("✅ Successfully seeded Occult, Ancient Egyptian, and Hindu scriptures!")
}

seedMore()
