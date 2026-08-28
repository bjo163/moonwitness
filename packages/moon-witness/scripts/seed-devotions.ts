/**
 * Seed Devotional Content (Adhkar / Doa / Dzikir) into wx_devotion
 * Source: Hardcoded canonical data
 */
import { initSeedDb, batchInsert } from './seed-utils.js'

const ADHKAR_DATA = [
  { type: 'dhikr', title: 'Istighfar', text_original: 'أَسْتَغْفِرُ اللَّهَ الْعَظِيمَ', text_transliteration: "Astaghfirullaahal 'Azhiim", translation_id: 'Aku memohon ampunan kepada Allah Yang Maha Agung', category: 'Harian', timing: 'Pagi & Petang', source: 'HR. Bukhari & Muslim', benefit: 'Penghapus dosa dan pembuka rezeki' },
  { type: 'dhikr', title: 'Tasbih', text_original: 'سُبْحَانَ اللَّهِ', text_transliteration: 'SubhanAllah', translation_id: 'Maha Suci Allah', category: 'Harian', timing: 'Setelah Shalat', source: 'HR. Muslim', benefit: 'Menambah pahala dan mendekatkan diri kepada Allah' },
  { type: 'dhikr', title: 'Tahmid', text_original: 'الْحَمْدُ لِلَّهِ', text_transliteration: 'Alhamdulillah', translation_id: 'Segala puji bagi Allah', category: 'Harian', timing: 'Setelah Shalat', source: 'HR. Muslim', benefit: 'Memenuhi timbangan kebaikan' },
  { type: 'dhikr', title: 'Takbir', text_original: 'اللَّهُ أَكْبَرُ', text_transliteration: 'Allahu Akbar', translation_id: 'Allah Maha Besar', category: 'Harian', timing: 'Setelah Shalat', source: 'HR. Muslim', benefit: 'Memenuhi langit dan bumi dengan kebaikan' },
  { type: 'dhikr', title: 'Tahlil', text_original: 'لاَ إِلَهَ إِلاَّ اللَّهُ', text_transliteration: 'Laa ilaha illallah', translation_id: 'Tidak ada Tuhan selain Allah', category: 'Harian', timing: 'Semua', source: 'HR. Bukhari & Muslim', benefit: 'Kalimat terbaik yang diucapkan; penghapus dosa' },
  { type: 'dhikr', title: 'Hauqalah', text_original: 'لاَ حَوْلَ وَلاَ قُوَّةَ إِلاَّ بِاللَّهِ', text_transliteration: 'Laa haula walaa quwwata illaa billah', translation_id: 'Tidak ada daya dan upaya kecuali dengan pertolongan Allah', category: 'Harian', timing: 'Semua', source: 'HR. Bukhari & Muslim', benefit: 'Harta karun surga' },
  { type: 'dua', title: 'Doa Sebelum Tidur', text_original: 'بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا', text_transliteration: "Bismikallaahumma amuutu wa ahyaa", translation_id: 'Dengan nama-Mu ya Allah aku mati dan aku hidup', category: 'Tidur', timing: 'Malam', source: 'HR. Bukhari', benefit: 'Ketenangan tidur' },
  { type: 'dua', title: 'Doa Bangun Tidur', text_original: 'الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ', text_transliteration: "Alhamdulillaahilladzi ahyaanaa ba'da maa amaatanaa wa ilaihin nusyuur", translation_id: 'Segala puji bagi Allah yang menghidupkan kami setelah mematikan kami, dan kepada-Nya lah kami dikembalikan', category: 'Tidur', timing: 'Pagi', source: 'HR. Bukhari', benefit: 'Bersyukur atas kehidupan baru' },
  { type: 'dua', title: 'Doa Masuk Masjid', text_original: 'اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ', text_transliteration: "Allaahummaftah lii abwaaba rahmatik", translation_id: 'Ya Allah, bukalah untukku pintu-pintu rahmat-Mu', category: 'Masjid', timing: 'Semua', source: 'HR. Muslim', benefit: 'Mendapat rahmat Allah' },
  { type: 'dua', title: 'Doa Keluar Masjid', text_original: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ مِنْ فَضْلِكَ', text_transliteration: "Allaahumma innii as'aluka min fadlik", translation_id: 'Ya Allah, sesungguhnya aku memohon karunia-Mu', category: 'Masjid', timing: 'Semua', source: 'HR. Muslim', benefit: 'Mendapat karunia Allah' },
  { type: 'dhikr', title: 'Sayyidul Istighfar', text_original: 'اللَّهُمَّ أَنْتَ رَبِّي لاَ إِلَهَ إِلاَّ أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ', text_transliteration: "Allaahumma Anta Rabbii laa ilaaha illaa Anta, khalaqtanii wa ana 'abduk", translation_id: 'Ya Allah, Engkau Tuhanku, tidak ada tuhan selain Engkau, Engkau menciptakan aku dan aku hamba-Mu', category: 'Harian', timing: 'Pagi & Petang', source: 'HR. Bukhari', benefit: 'Penghulu istighfar, jaminan surga bagi yang membacanya dengan keyakinan' },
  { type: 'dua', title: 'Doa Sebelum Makan', text_original: 'بِسْمِ اللَّهِ', text_transliteration: 'Bismillah', translation_id: 'Dengan menyebut nama Allah', category: 'Makan', timing: 'Semua', source: 'HR. Abu Daud & Tirmidzi', benefit: 'Keberkahan makanan' },
]

export async function seedDevotions() {
  const db = await initSeedDb()

  const existing = await db('wx_devotion').count('id as cnt').first()
  if (Number(existing?.cnt) >= ADHKAR_DATA.length) {
    console.log(`  ✅ ${ADHKAR_DATA.length} Adhkar/Doa already seeded, skipping`)
    return
  }

  const rows = ADHKAR_DATA.map((d, idx) => ({
    ...d,
    number: idx + 1,
    is_active: true
  }))
  await batchInsert('wx_devotion', rows, 50)
  console.log(`  ✅ ${rows.length} Adhkar & Doa seeded!`)
}

// Run standalone
if (import.meta.url === `file://${process.argv[1]?.replace(/\\/g, '/')}`) {
  seedDevotions().catch(console.error).finally(() => process.exit())
}
