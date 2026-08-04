/**
 * Seed Prophetic Traditions into wx_tradition + wx_tradition_item
 * 
 * For Taurat (Mishna Pirkei Avot), Zabur (Tasbih Daud), Injil (Didache)
 * Source: Hardcoded canonical data from quran-core
 */
import { initSeedDb } from './seed-utils.js'

const TRADITIONS_DATA = [
  // TAURAT — Mishna Pirkei Avot
  {
    scripture_slug: 'taurat',
    collection: { slug: 'mishna-pirkei-avot', name: 'Mishna Pirkei Avot', author: 'Tradisi Lisan Nabi Musa a.s.', grade: 'MIXED', desc: 'Tradisi lisan etika Taurat yang diterima dari Nabi Musa a.s.' },
    items: [
      { chapter: 1, number: 1, title: 'Mata Rantai Sanad Penyerahan Wahyu Lisan', text_original: 'מֹשֶׁה קִבֵּל תּוֹרָה מִסִּינַי, וּמְסָרָהּ לִיהוֹשֻׁעַ, וִיהוֹשֻׁעַ לִזְקֵנִים', text_transliteration: 'Moshe kibel Torah miSinai, umesarah liYehoshua, viYehoshua lizkenim', translation_id: 'Nabi Musa menerima wahyu Taurat di Gunung Sinai, lalu meneruskannya secara lisan kepada Yusha\' (Yosua), dan Yusha\' meneruskannya kepada para tetua pemimpin.', notes: 'Mishna 1:1 — sanad penyerahan lisan tradisi hukum Taurat.' },
      { chapter: 1, number: 2, title: 'Tiga Pilar Tegaknya Dunia', text_original: 'עַל שְׁלֹשָׁה דְבָרִים הָעוֹלָם עוֹמֵד, עַל הַתּוֹרָה וְעַל הָעֲבוֹדָה וְעַל גְּמִילוּת חֲסָדִים', text_transliteration: "Al shlosha devarim ha'olam omed, al haTorah ve'al haAvodah ve'al gemilut chasadim", translation_id: 'Atas tiga hal dunia ini berdiri tegak: atas Firman Taurat (ilmu), atas ibadah penyembahan kepada Allah, dan atas perbuatan kasih sayang sesama.', notes: 'Mishna 1:2 — Tiga fondasi etika hidup.' },
    ]
  },
  // ZABUR — Tasbih & Zikir Daud
  {
    scripture_slug: 'zabur',
    collection: { slug: 'tasbih-daud', name: 'Tasbih & Zikir Lisan Nabi Daud a.s.', author: 'Nabi Daud a.s.', grade: 'SHAHIH', desc: 'Tradisi lisan zikir Nabi Daud a.s. mengagungkan Allah SWT.' },
    items: [
      { chapter: 1, number: 1, title: 'Tasbih Pengagungan Asma Allah', text_original: 'הַלְלוּ אֶת־יְהוָה כָּל־גּוֹיִם שַׁבְּחוּהוּ כָּל־הָאֻמִּים', text_transliteration: "Halelu 'et-YHWH kol-goyim shabchuhu kol-ha'umim", translation_id: 'Pujilah TUHAN, hai segala bangsa, megahkanlah Dia, hai segala suku bangsa!', notes: 'Tradisi lisan zikir Nabi Daud a.s.' },
    ]
  },
  // INJIL — Didache
  {
    scripture_slug: 'injil',
    collection: { slug: 'didache', name: 'Didache (Ajaran 12 Rasul / Hawariyyun)', author: 'Al-Hawariyyun Nabi Isa a.s.', grade: 'MIXED', desc: 'Catatan lisan abad pertama murid-murid Nabi Isa a.s.' },
    items: [
      { chapter: 1, number: 1, title: 'Dua Jalan Kehidupan & Kematian', text_original: 'Δύο ὁδοί εἰσι, μία της ζωής καὶ μία τοῦ θανάτου', text_transliteration: 'Dyo hodoi eisi, mia tes zoes kai mia tou thanatou', translation_id: 'Ada dua jalan hidup manusia: satu Jalan Kehidupan (Kebajikan) dan satu Jalan Kematian (Keburukan); dan ada perbedaan sangat besar antara kedua jalan tersebut.', notes: 'Didache 1:1 — ajaran pokok kesucian moral.' },
      { chapter: 1, number: 2, title: 'Perintah Utama Mencintai Allah & Sesama', text_original: 'Πρῶτον, ἀγαπήσεις τὸν Θεὸν τὸν ποιήσαντά σε· δεύτερον, τὸν πλησίον σου ὡς σεαυτόν', text_transliteration: 'Proton, agapeseis ton Theon ton poiesanta se; deuteron, ton plesion sou hos seauton', translation_id: 'Jalan Kehidupan ialah: Pertama, kasihilah Allah yang menciptakan engkau; Kedua, kasihilah sesamamu manusia seperti dirimu sendiri.', notes: 'Didache 1:2 — sabda Nabi Isa a.s.' },
    ]
  }
]

export async function seedTraditions() {
  const db = await initSeedDb()

  for (const trad of TRADITIONS_DATA) {
    // Find scripture
    const scripture = await db('wx_scripture').where({ slug: trad.scripture_slug }).first()

    // Seed collection
    const existing = await db('wx_tradition').where({ slug: trad.collection.slug }).first()
    let collectionId: number
    if (!existing) {
      const [row] = await db('wx_tradition').insert({
        scripture_id: scripture?.id || null,
        slug: trad.collection.slug,
        name: trad.collection.name,
        total_items: trad.items.length,
        grade_level: trad.collection.grade,
        category: 'Prophetic Tradition',
        author: trad.collection.author,
        description: trad.collection.desc,
        is_active: true
      }).returning('id')
      collectionId = row.id
    } else {
      collectionId = existing.id
    }

    // Seed items
    for (const item of trad.items) {
      const existingItem = await db('wx_tradition_item')
        .where({ collection_id: collectionId, number: item.number, chapter_number: item.chapter })
        .first()
      if (!existingItem) {
        await db('wx_tradition_item').insert({
          collection_id: collectionId,
          number: item.number,
          chapter_number: item.chapter,
          title: item.title,
          text_original: item.text_original,
          text_transliteration: item.text_transliteration,
          translation_id: item.translation_id,
          grade: trad.collection.grade,
          notes: item.notes,
          is_active: true
        })
      }
    }
    console.log(`  ✅ ${trad.collection.name}: ${trad.items.length} traditions seeded`)
  }
}

// Run standalone
if (import.meta.url === `file://${process.argv[1]?.replace(/\\/g, '/')}`) {
  seedTraditions().catch(console.error).finally(() => process.exit())
}
