import fs from 'fs'
import { createClient } from '@supabase/supabase-js'

const env = fs.readFileSync('.env.local', 'utf-8')
const url = env.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/)?.[1]
const key = env.match(/SUPABASE_SERVICE_ROLE_KEY=(.*)/)?.[1]

const sb = createClient(url, key)

async function seed() {
  console.log("Fetching IDs for Taurat, Zabur, Injil...")
  const { data: scripts, error: fetchErr } = await sb.from('divine_scriptures').select('id, name').in('name', ['Taurat', 'Zabur', 'Injil'])
  
  if (fetchErr || !scripts || scripts.length === 0) {
    console.error("Failed to fetch scripture IDs", fetchErr)
    return
  }
  
  const tauratId = scripts.find(s => s.name === 'Taurat')?.id
  const zaburId = scripts.find(s => s.name === 'Zabur')?.id
  const injilId = scripts.find(s => s.name === 'Injil')?.id

  // Cleanup old books/verses for these 3 so we don't duplicate on re-runs
  console.log("Cleaning up old books/verses...")
  await sb.from('scripture_books').delete().in('scripture_id', [tauratId, zaburId, injilId])

  console.log("Inserting Books...")
  const books = [
    { scripture_id: tauratId, book_number: 1, name: "Kejadian", original_name: "Bereshit", chapters_count: 50, summary: "Penciptaan alam semesta dan awal mula umat manusia." },
    { scripture_id: zaburId, book_number: 1, name: "Mazmur", original_name: "Tehillim", chapters_count: 150, summary: "Kumpulan puji-pujian dan doa Nabi Daud a.s." },
    { scripture_id: injilId, book_number: 4, name: "Yohanes", original_name: "Kata Ioannen", chapters_count: 21, summary: "Kabar baik menurut kesaksian Yohanes." }
  ]
  const { data: insertedBooks, error: booksErr } = await sb.from('scripture_books').insert(books).select()
  if (booksErr) return console.error(booksErr)
  
  const genId = insertedBooks.find(b => b.name === 'Kejadian').id
  const psmId = insertedBooks.find(b => b.name === 'Mazmur').id
  const jhnId = insertedBooks.find(b => b.name === 'Yohanes').id

  console.log("Inserting Verses...")
  const verses = [
    // TAURAT (Kejadian 1)
    {
      scripture_id: tauratId, book_id: genId, chapter_number: 1, verse_number: 1,
      text_original: "בְּרֵאשִׁית בָּרָא אֱלֹהִים אֵת הַשָּׁמַיִם וְאֵת הָאָרֶץ",
      text_transliteration: "Bereshit bara Elohim et hashamayim ve'et ha'aretz",
      text_translated: "Pada mulanya Allah menciptakan langit dan bumi.",
      tafsir: "Merupakan fondasi tauhid monoteistik, bahwa alam semesta ini memiliki Sang Pencipta Tunggal yang absolut.",
      topic_tags: ["Tauhid", "Penciptaan"]
    },
    {
      scripture_id: tauratId, book_id: genId, chapter_number: 1, verse_number: 2,
      text_original: "וְהָאָרֶץ הָיְתָה תֹהוּ וָבֹהוּ וְחֹשֶׁךְ עַל־פְּנֵי תְהוֹם וְרוּחַ אֱלֹהִים מְרַחֶפֶת עַל־פְּנֵי הַמָּיִם",
      text_transliteration: "Veha'aretz hayetah tohu vavohu vechoshech al-penei tehom veruach Elohim merachefet al-penei hamayim",
      text_translated: "Bumi belum berbentuk dan kosong; gelap gulita menutupi samudera raya, dan Roh Allah melayang-layang di atas permukaan air.",
      topic_tags: ["Penciptaan"]
    },
    {
      scripture_id: tauratId, book_id: genId, chapter_number: 1, verse_number: 3,
      text_original: "וַיֹּאמֶר אֱלֹהִים יְהִי אוֹר וַיְהִי־אוֹר",
      text_transliteration: "Vayomer Elohim yehi or vayehi or",
      text_translated: "Berfirmanlah Allah: 'Jadilah terang.' Lalu terang itu jadi.",
      topic_tags: ["Kehendak Tuhan", "Cahaya"]
    },

    // ZABUR (Mazmur 23)
    {
      scripture_id: zaburId, book_id: psmId, chapter_number: 23, verse_number: 1,
      text_original: "מִזְמוֹר לְדָוִד יְהוָה רֹעִי לֹא אֶחְסָר",
      text_transliteration: "Mizmor ledavid Adonai ro'i lo echsar",
      text_translated: "Mazmur Daud. Tuhan adalah gembalaku, takkan kekurangan aku.",
      tafsir: "Nabi Daud mempersonifikasikan Allah sebagai 'Gembala' yang menuntun jiwa, metafora perlindungan dan pemeliharaan ilahi.",
      topic_tags: ["Perlindungan", "Keyakinan"]
    },
    {
      scripture_id: zaburId, book_id: psmId, chapter_number: 23, verse_number: 2,
      text_original: "בִּנְאוֹת דֶּשֶׁא יַרְבִּיצֵנִי עַל־מֵי מְנֻחוֹת יְנַהֲלֵנִי",
      text_transliteration: "Binot deshe yarbitzeni al-mei menuchot yenahaleni",
      text_translated: "Ia membaringkan aku di padang yang berumput hijau, Ia membimbing aku ke air yang tenang.",
      topic_tags: ["Kedamaian"]
    },

    // INJIL (Yohanes 1)
    {
      scripture_id: injilId, book_id: jhnId, chapter_number: 1, verse_number: 1,
      text_original: "Ἐν ἀρχῇ ἦν ὁ λόγος, καὶ ὁ λόγος ἦν πρὸς τὸν θεόν, καὶ θεὸς ἦν ὁ λόγος",
      text_transliteration: "En archē ēn ho logos, kai ho logos ēn pros ton theon, kai theos ēn ho logos",
      text_translated: "Pada mulanya adalah Firman (Logos); Firman itu bersama-sama dengan Allah dan Firman itu adalah Allah.",
      tafsir: "Konsep Logos (Kalimatullah), dalam sudut pandang monoteistik dapat direlasikan dengan firman penciptaan 'Kun Fayakun'.",
      topic_tags: ["Firman", "Tauhid"]
    },
    {
      scripture_id: injilId, book_id: jhnId, chapter_number: 1, verse_number: 2,
      text_original: "οὗτος ἦν ἐν ἀρχῇ πρὸς τὸν θεόν",
      text_transliteration: "houtos ēn en archē pros ton theon",
      text_translated: "Ia pada mulanya bersama-sama dengan Allah.",
      topic_tags: ["Kekekalan Tuhan"]
    }
  ]

  const { error: versesErr } = await sb.from('scripture_verses').insert(verses)
  if (versesErr) return console.error(versesErr)

  console.log("✅ Successfully seeded Genesis, Psalms, and John verses with actual Hebrew/Greek text and Tafsir!")
}

seed()
