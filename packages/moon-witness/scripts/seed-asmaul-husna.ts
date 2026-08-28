/**
 * Seed 99 Asmaul Husna into wx_asmaul_husna
 * Source: Hardcoded canonical data
 */
import { initSeedDb, batchInsert } from './seed-utils.ts'

const ASMAUL_HUSNA = [
  { number: 1, name_arabic: 'الرَّحْمَنُ', name_latin: 'Ar-Rahman', translation_id: 'Maha Pengasih', quran_reference: 'QS. Al-Fatihah: 1' },
  { number: 2, name_arabic: 'الرَّحِيمُ', name_latin: 'Ar-Rahim', translation_id: 'Maha Penyayang', quran_reference: 'QS. Al-Fatihah: 1' },
  { number: 3, name_arabic: 'الْمَلِكُ', name_latin: 'Al-Malik', translation_id: 'Maha Merajai', quran_reference: 'QS. Al-Hasyr: 23' },
  { number: 4, name_arabic: 'الْقُدُّوسُ', name_latin: 'Al-Quddus', translation_id: 'Maha Suci', quran_reference: 'QS. Al-Hasyr: 23' },
  { number: 5, name_arabic: 'السَّلاَمُ', name_latin: 'As-Salam', translation_id: 'Maha Memberi Kesejahteraan', quran_reference: 'QS. Al-Hasyr: 23' },
  { number: 6, name_arabic: 'الْمُؤْمِنُ', name_latin: "Al-Mu'min", translation_id: 'Maha Memberi Keamanan', quran_reference: 'QS. Al-Hasyr: 23' },
  { number: 7, name_arabic: 'الْمُهَيْمِنُ', name_latin: 'Al-Muhaimin', translation_id: 'Maha Pemelihara', quran_reference: 'QS. Al-Hasyr: 23' },
  { number: 8, name_arabic: 'الْعَزِيزُ', name_latin: 'Al-Aziz', translation_id: 'Maha Perkasa', quran_reference: 'QS. Al-Hasyr: 23' },
  { number: 9, name_arabic: 'الْجَبَّارُ', name_latin: 'Al-Jabbar', translation_id: 'Yang Memiliki Mutlak Kegagahan', quran_reference: 'QS. Al-Hasyr: 23' },
  { number: 10, name_arabic: 'الْمُتَكَبِّرُ', name_latin: 'Al-Mutakabbir', translation_id: 'Maha Megah', quran_reference: 'QS. Al-Hasyr: 23' },
  { number: 11, name_arabic: 'الْخَالِقُ', name_latin: 'Al-Khaliq', translation_id: 'Maha Pencipta', quran_reference: 'QS. Al-Hasyr: 24' },
  { number: 12, name_arabic: 'الْبَارِئُ', name_latin: "Al-Bari'", translation_id: 'Maha Melepaskan', quran_reference: 'QS. Al-Hasyr: 24' },
  { number: 13, name_arabic: 'الْمُصَوِّرُ', name_latin: 'Al-Musawwir', translation_id: 'Maha Membentuk Rupa', quran_reference: 'QS. Al-Hasyr: 24' },
  { number: 14, name_arabic: 'الْغَفَّارُ', name_latin: 'Al-Ghaffar', translation_id: 'Maha Pengampun', quran_reference: 'QS. Nuh: 10' },
  { number: 15, name_arabic: 'الْقَهَّارُ', name_latin: 'Al-Qahhar', translation_id: 'Maha Menundukkan', quran_reference: 'QS. Az-Zumar: 4' },
  { number: 16, name_arabic: 'الْوَهَّابُ', name_latin: 'Al-Wahhab', translation_id: 'Maha Pemberi Karunia', quran_reference: "QS. Ali 'Imran: 8" },
  { number: 17, name_arabic: 'الرَّزَّاقُ', name_latin: 'Ar-Razzaq', translation_id: 'Maha Pemberi Rezeki', quran_reference: 'QS. Az-Zariyat: 58' },
  { number: 18, name_arabic: 'الْفَتَّاحُ', name_latin: 'Al-Fattah', translation_id: 'Maha Pembuka Rahmat', quran_reference: "QS. Saba': 26" },
  { number: 19, name_arabic: 'الْعَلِيمُ', name_latin: "Al-'Alim", translation_id: 'Maha Mengetahui', quran_reference: 'QS. Al-Baqarah: 29' },
  { number: 20, name_arabic: 'الْقَابِضُ', name_latin: 'Al-Qabid', translation_id: 'Maha Menyempitkan', quran_reference: 'QS. Al-Baqarah: 245' },
  { number: 21, name_arabic: 'الْبَاسِطُ', name_latin: 'Al-Basit', translation_id: 'Maha Melapangkan', quran_reference: 'QS. Al-Baqarah: 245' },
  { number: 22, name_arabic: 'الْخَافِضُ', name_latin: 'Al-Khafid', translation_id: 'Maha Merendahkan', quran_reference: "QS. Al-Waqi'ah: 3" },
  { number: 23, name_arabic: 'الرَّافِعُ', name_latin: "Ar-Rafi'", translation_id: 'Maha Meninggikan', quran_reference: "QS. Al-An'am: 83" },
  { number: 24, name_arabic: 'الْمُعِزُّ', name_latin: "Al-Mu'izz", translation_id: 'Maha Memuliakan', quran_reference: "QS. Ali 'Imran: 26" },
  { number: 25, name_arabic: 'الْمُذِلُّ', name_latin: 'Al-Muzill', translation_id: 'Maha Menghinakan', quran_reference: "QS. Ali 'Imran: 26" },
  { number: 26, name_arabic: 'السَّمِيعُ', name_latin: "As-Sami'", translation_id: 'Maha Mendengar', quran_reference: 'QS. Al-Baqarah: 127' },
  { number: 27, name_arabic: 'الْبَصِيرُ', name_latin: 'Al-Basir', translation_id: 'Maha Melihat', quran_reference: "QS. Al-Isra': 1" },
  { number: 28, name_arabic: 'الْحَكَمُ', name_latin: 'Al-Hakam', translation_id: 'Maha Menetapkan Hukum', quran_reference: "QS. Al-An'am: 114" },
  { number: 29, name_arabic: 'الْعَدْلُ', name_latin: "Al-'Adl", translation_id: 'Maha Adil', quran_reference: "QS. Al-An'am: 115" },
  { number: 30, name_arabic: 'الَّطِيفُ', name_latin: 'Al-Latif', translation_id: 'Maha Lembut', quran_reference: "QS. Al-An'am: 103" },
  { number: 31, name_arabic: 'الْخَبِيرُ', name_latin: 'Al-Khabir', translation_id: 'Maha Mengenal', quran_reference: "QS. Al-An'am: 18" },
  { number: 32, name_arabic: 'الْحَلِيمُ', name_latin: 'Al-Halim', translation_id: 'Maha Penyantun', quran_reference: 'QS. Al-Baqarah: 225' },
  { number: 33, name_arabic: 'الْعَظِيمُ', name_latin: "Al-'Azim", translation_id: 'Maha Agung', quran_reference: 'QS. Al-Baqarah: 255' },
  { number: 34, name_arabic: 'الْغَفُورُ', name_latin: 'Al-Ghafur', translation_id: 'Maha Pengampun', quran_reference: 'QS. Al-Baqarah: 173' },
  { number: 35, name_arabic: 'الشَّكُورُ', name_latin: 'Asy-Syakur', translation_id: 'Maha Pembalas Budi', quran_reference: 'QS. Fatir: 30' },
  { number: 36, name_arabic: 'الْعَلِيُّ', name_latin: "Al-'Ali", translation_id: 'Maha Tinggi', quran_reference: 'QS. Al-Baqarah: 255' },
  { number: 37, name_arabic: 'الْكَبِيرُ', name_latin: 'Al-Kabir', translation_id: 'Maha Besar', quran_reference: "QS. Ar-Ra'd: 9" },
  { number: 38, name_arabic: 'الْحَفِيظُ', name_latin: 'Al-Hafiz', translation_id: 'Maha Memelihara', quran_reference: 'QS. Hud: 57' },
  { number: 39, name_arabic: 'الْمُقِيتُ', name_latin: 'Al-Muqit', translation_id: 'Maha Pemberi Kecukupan', quran_reference: "QS. An-Nisa': 85" },
  { number: 40, name_arabic: 'الْحَسِيبُ', name_latin: 'Al-Hasib', translation_id: 'Maha Membuat Perhitungan', quran_reference: "QS. An-Nisa': 6" },
  { number: 41, name_arabic: 'الْجَلِيلُ', name_latin: 'Al-Jalil', translation_id: 'Maha Mulia', quran_reference: 'QS. Ar-Rahman: 27' },
  { number: 42, name_arabic: 'الْكَرِيمُ', name_latin: 'Al-Karim', translation_id: 'Maha Pemurah', quran_reference: 'QS. Al-Infitar: 6' },
  { number: 43, name_arabic: 'الرَّقِيبُ', name_latin: 'Ar-Raqib', translation_id: 'Maha Mengawasi', quran_reference: "QS. An-Nisa': 1" },
  { number: 44, name_arabic: 'الْمُجِيبُ', name_latin: 'Al-Mujib', translation_id: 'Maha Mengabulkan', quran_reference: 'QS. Hud: 61' },
  { number: 45, name_arabic: 'الْوَاسِعُ', name_latin: "Al-Wasi'", translation_id: 'Maha Luas', quran_reference: 'QS. Al-Baqarah: 268' },
  { number: 46, name_arabic: 'الْحَكِيمُ', name_latin: 'Al-Hakim', translation_id: 'Maha Bijaksana', quran_reference: 'QS. Al-Baqarah: 129' },
  { number: 47, name_arabic: 'الْوَدُودُ', name_latin: 'Al-Wadud', translation_id: 'Maha Mengasihi', quran_reference: 'QS. Hud: 90' },
  { number: 48, name_arabic: 'الْمَجِيدُ', name_latin: 'Al-Majid', translation_id: 'Maha Mulia', quran_reference: 'QS. Hud: 73' },
  { number: 49, name_arabic: 'الْبَاعِثُ', name_latin: "Al-Ba'ith", translation_id: 'Maha Membangkitkan', quran_reference: 'QS. Al-Hajj: 7' },
  { number: 50, name_arabic: 'الشَّهِيدُ', name_latin: 'Asy-Syahid', translation_id: 'Maha Menyaksikan', quran_reference: 'QS. Al-Maidah: 117' },
  { number: 51, name_arabic: 'الْحَقُّ', name_latin: 'Al-Haqq', translation_id: 'Maha Benar', quran_reference: 'QS. Al-Hajj: 62' },
  { number: 52, name_arabic: 'الْوَكِيلُ', name_latin: 'Al-Wakil', translation_id: 'Maha Memelihara', quran_reference: "QS. Ali 'Imran: 173" },
  { number: 53, name_arabic: 'الْقَوِيُّ', name_latin: 'Al-Qawi', translation_id: 'Maha Kuat', quran_reference: 'QS. Al-Hajj: 40' },
  { number: 54, name_arabic: 'الْمَتِينُ', name_latin: 'Al-Matin', translation_id: 'Maha Kokoh', quran_reference: 'QS. Az-Zariyat: 58' },
  { number: 55, name_arabic: 'الْوَلِيُّ', name_latin: 'Al-Wali', translation_id: 'Maha Melindungi', quran_reference: 'QS. Asy-Syura: 9' },
  { number: 56, name_arabic: 'الْحَمِيدُ', name_latin: 'Al-Hamid', translation_id: 'Maha Terpuji', quran_reference: 'QS. Ibrahim: 1' },
  { number: 57, name_arabic: 'الْمُحْصِي', name_latin: 'Al-Muhsi', translation_id: 'Maha Menghitung', quran_reference: 'QS. Maryam: 94' },
  { number: 58, name_arabic: 'الْمُبْدِئُ', name_latin: "Al-Mubdi'", translation_id: 'Maha Memulai', quran_reference: 'QS. Al-Buruj: 13' },
  { number: 59, name_arabic: 'الْمُعِيدُ', name_latin: "Al-Mu'id", translation_id: 'Maha Mengembalikan', quran_reference: 'QS. Al-Buruj: 13' },
  { number: 60, name_arabic: 'الْمُحْيِي', name_latin: 'Al-Muhyi', translation_id: 'Maha Menghidupkan', quran_reference: 'QS. Ar-Rum: 50' },
  { number: 61, name_arabic: 'الْمُمِيتُ', name_latin: 'Al-Mumit', translation_id: 'Maha Mematikan', quran_reference: 'QS. Al-Mulk: 2' },
  { number: 62, name_arabic: 'الْحَيُّ', name_latin: 'Al-Hayy', translation_id: 'Maha Hidup', quran_reference: 'QS. Al-Baqarah: 255' },
  { number: 63, name_arabic: 'الْقَيُّومُ', name_latin: 'Al-Qayyum', translation_id: 'Maha Mandiri', quran_reference: 'QS. Al-Baqarah: 255' },
  { number: 64, name_arabic: 'الْوَاجِدُ', name_latin: 'Al-Wajid', translation_id: 'Maha Menemukan', quran_reference: "QS. Ad-Duha: 6-8" },
  { number: 65, name_arabic: 'الْمَاجِدُ', name_latin: 'Al-Majid', translation_id: 'Maha Mulia', quran_reference: 'QS. Hud: 73' },
  { number: 66, name_arabic: 'الْواحِدُ', name_latin: 'Al-Wahid', translation_id: 'Maha Esa', quran_reference: "QS. Ar-Ra'd: 16" },
  { number: 67, name_arabic: 'الاَحَدُ', name_latin: 'Al-Ahad', translation_id: 'Maha Esa', quran_reference: 'QS. Al-Ikhlas: 1' },
  { number: 68, name_arabic: 'الصَّمَدُ', name_latin: 'As-Samad', translation_id: 'Maha Dibutuhkan', quran_reference: 'QS. Al-Ikhlas: 2' },
  { number: 69, name_arabic: 'الْقَادِرُ', name_latin: 'Al-Qadir', translation_id: 'Maha Menentukan', quran_reference: "QS. Al-An'am: 65" },
  { number: 70, name_arabic: 'الْمُقْتَدِرُ', name_latin: 'Al-Muqtadir', translation_id: 'Maha Berkuasa', quran_reference: 'QS. Al-Qamar: 42' },
  { number: 71, name_arabic: 'الْمُقَدِّمُ', name_latin: 'Al-Muqaddim', translation_id: 'Maha Mendahulukan', quran_reference: 'QS. Qaf: 28' },
  { number: 72, name_arabic: 'الْمُؤَخِّرُ', name_latin: "Al-Mu'akhkhir", translation_id: 'Maha Mengakhirkan', quran_reference: 'QS. Ibrahim: 42' },
  { number: 73, name_arabic: 'الأوَّلُ', name_latin: 'Al-Awwal', translation_id: 'Maha Awal', quran_reference: 'QS. Al-Hadid: 3' },
  { number: 74, name_arabic: 'الآخِرُ', name_latin: 'Al-Akhir', translation_id: 'Maha Akhir', quran_reference: 'QS. Al-Hadid: 3' },
  { number: 75, name_arabic: 'الظَّاهِرُ', name_latin: 'Az-Zahir', translation_id: 'Maha Nyata', quran_reference: 'QS. Al-Hadid: 3' },
  { number: 76, name_arabic: 'الْبَاطِنُ', name_latin: 'Al-Batin', translation_id: 'Maha Tersembunyi', quran_reference: 'QS. Al-Hadid: 3' },
  { number: 77, name_arabic: 'الْوَالِي', name_latin: 'Al-Wali', translation_id: 'Maha Memerintah', quran_reference: "QS. Ar-Ra'd: 11" },
  { number: 78, name_arabic: 'الْمُتَعَالِي', name_latin: "Al-Muta'ali", translation_id: 'Maha Tinggi', quran_reference: "QS. Ar-Ra'd: 9" },
  { number: 79, name_arabic: 'الْبَرُّ', name_latin: 'Al-Barr', translation_id: 'Maha Baik', quran_reference: 'QS. At-Tur: 28' },
  { number: 80, name_arabic: 'التَّوَابُ', name_latin: 'At-Tawwab', translation_id: 'Maha Penerima Taubat', quran_reference: 'QS. Al-Baqarah: 37' },
  { number: 81, name_arabic: 'الْمُنْتَقِمُ', name_latin: 'Al-Muntaqim', translation_id: 'Maha Penyiksa', quran_reference: 'QS. As-Sajdah: 22' },
  { number: 82, name_arabic: 'العَفُوُّ', name_latin: "Al-'Afuw", translation_id: 'Maha Pemaaf', quran_reference: "QS. An-Nisa': 149" },
  { number: 83, name_arabic: 'الرَّؤُوفُ', name_latin: "Ar-Ra'uf", translation_id: 'Maha Pengasih', quran_reference: 'QS. Al-Baqarah: 143' },
  { number: 84, name_arabic: 'مَالِكُ الْمُلْكِ', name_latin: 'Malik Al-Mulk', translation_id: 'Maha Penguasa Kerajaan', quran_reference: "QS. Ali 'Imran: 26" },
  { number: 85, name_arabic: 'ذُوالْجَلاَلِ وَالإكْرَامِ', name_latin: "Zul Jalal Wal Ikram", translation_id: 'Maha Pemilik Kebesaran dan Kemuliaan', quran_reference: 'QS. Ar-Rahman: 27' },
  { number: 86, name_arabic: 'الْمُقْسِطُ', name_latin: 'Al-Muqsit', translation_id: 'Maha Pemberi Keadilan', quran_reference: 'QS. Al-Anbiya: 47' },
  { number: 87, name_arabic: 'الْجَامِعُ', name_latin: "Al-Jami'", translation_id: 'Maha Mengumpulkan', quran_reference: "QS. Ali 'Imran: 9" },
  { number: 88, name_arabic: 'الْغَنِيُّ', name_latin: 'Al-Ghani', translation_id: 'Maha Kaya', quran_reference: 'QS. Al-Baqarah: 263' },
  { number: 89, name_arabic: 'الْمُغْنِي', name_latin: 'Al-Mughni', translation_id: 'Maha Pemberi Kekayaan', quran_reference: 'QS. At-Taubah: 74' },
  { number: 90, name_arabic: 'الْمَانِعُ', name_latin: "Al-Mani'", translation_id: 'Maha Mencegah', quran_reference: "QS. Ali 'Imran: 26" },
  { number: 91, name_arabic: 'الضَّارَّ', name_latin: 'Ad-Darr', translation_id: 'Maha Pemberi Derita', quran_reference: "QS. Al-An'am: 17" },
  { number: 92, name_arabic: 'النَّافِعُ', name_latin: "An-Nafi'", translation_id: 'Maha Pemberi Manfaat', quran_reference: 'QS. Al-Fath: 11' },
  { number: 93, name_arabic: 'النُّورُ', name_latin: 'An-Nur', translation_id: 'Maha Bercahaya', quran_reference: 'QS. An-Nur: 35' },
  { number: 94, name_arabic: 'الْهَادِي', name_latin: 'Al-Hadi', translation_id: 'Maha Pemberi Petunjuk', quran_reference: 'QS. Al-Hajj: 54' },
  { number: 95, name_arabic: 'الْبَدِيعُ', name_latin: "Al-Badi'", translation_id: 'Maha Pencipta Keindahan', quran_reference: 'QS. Al-Baqarah: 117' },
  { number: 96, name_arabic: 'الْبَاقِي', name_latin: 'Al-Baqi', translation_id: 'Maha Kekal', quran_reference: 'QS. Ar-Rahman: 27' },
  { number: 97, name_arabic: 'الْوَارِثُ', name_latin: 'Al-Waris', translation_id: 'Maha Pewaris', quran_reference: 'QS. Al-Hijr: 23' },
  { number: 98, name_arabic: 'الرَّشِيدُ', name_latin: 'Ar-Rasyid', translation_id: 'Maha Pandai', quran_reference: 'QS. Hud: 87' },
  { number: 99, name_arabic: 'الصَّبُورُ', name_latin: 'As-Sabur', translation_id: 'Maha Sabar', quran_reference: 'QS. Al-Baqarah: 153' },
]

export async function seedAsmaulHusna() {
  const db = await initSeedDb()
  
  const existing = await db('wx_asmaul_husna').count('id as cnt').first()
  if (Number(existing?.cnt) >= 99) {
    console.log('  ✅ 99 Asmaul Husna already seeded, skipping')
    return
  }

  const rows = ASMAUL_HUSNA.map(h => ({ ...h, is_active: true }))
  await batchInsert('wx_asmaul_husna', rows, 100)
  console.log('  ✅ 99 Asmaul Husna seeded!')
}

// Run standalone
if (import.meta.url === `file://${process.argv[1]?.replace(/\\/g, '/')}`) {
  seedAsmaulHusna().catch(console.error).finally(() => process.exit())
}
