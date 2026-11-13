export type RandomInspirationData = {
  surahNumber: number
  surahName: string
  ayahNumber: number
  textArabic: string
  textLatin: string
  translationId: string
  asmaulName: string
  asmaulArabic: string
  hadithText: string
  audioUrl?: string
}

export const SAMPLE_VERSES: RandomInspirationData[] = [
  {
    surahNumber: 2,
    surahName: "Al-Baqarah",
    ayahNumber: 255,
    textArabic: "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ",
    textLatin: "Allāhu lā ilāha illā huwal-ḥayyul-qayyūm.",
    translationId:
      "Allah, tidak ada tuhan selain Dia Yang Mahahidup lagi terus-menerus mengurus (makhluk-Nya).",
    asmaulName: "Al-Hayyu (Maha Hidup)",
    asmaulArabic: "الْحَيُّ",
    hadithText:
      "Ayat Kursi adalah ayat yang paling agung dalam Al-Qur'anul Karim. (HR. Muslim)",
    audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/262.mp3",
  },
  {
    surahNumber: 67,
    surahName: "Al-Mulk",
    ayahNumber: 1,
    textArabic:
      "تَبَارَكَ الَّذِي بِيَدِهِ الْمُلْكُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ",
    textLatin:
      "Tabārakallażī biyadihil-mulku wa huwa 'alā kulli syai'in qadīr.",
    translationId:
      "Mahasuci Allah yang menguasai segala kerajaan, dan Dia Mahakuasa atas segala sesuatu.",
    asmaulName: "Al-Malik (Maha Raja)",
    asmaulArabic: "الْمَلِكُ",
    hadithText:
      "Surah Al-Mulk adalah penyelamat dan pelindung dari siksa kubur. (HR. At-Tirmidzi)",
    audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/5242.mp3",
  },
  {
    surahNumber: 59,
    surahName: "Al-Hasyr",
    ayahNumber: 23,
    textArabic:
      "هُوَ اللَّهُ الَّذِي لَا إِلَٰهَ إِلَّا هُوَ الْمَلِكُ الْقُدُّوسُ السَّلَامُ",
    textLatin: "Huwallāhul-lażī lā ilāha illā huw, al-malikul-quddūsus-salāmu.",
    translationId:
      "Dialah Allah tidak ada tuhan selain Dia. Maharaja, Yang Mahasuci, Yang Mahasejahtera.",
    asmaulName: "As-Salam (Maha Memberi Kesejahteraan)",
    asmaulArabic: "السَّلاَمُ",
    hadithText:
      "Barangsiapa membaca akhir Surah Al-Hasyr di pagi hari, 70.000 malaikat berselawat untuknya. (HR. At-Tirmidzi)",
    audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/5149.mp3",
  },
  {
    surahNumber: 55,
    surahName: "Ar-Rahman",
    ayahNumber: 1,
    textArabic:
      "الرَّحْمَٰنُ ﴿١﴾ عَلَّمَ الْقُرْآنَ ﴿٢﴾ خَلَقَ الْإِنسَانَ ﴿٣﴾ عَلَّمَهُ الْبَيَانَ",
    textLatin: "Ar-Raḥmān. 'Allamal-qur'ān. Khalaqal-insān. 'Allamahul-bayān.",
    translationId:
      "(Allah) Yang Maha Pengasih. Yang telah mengajarkan Al-Qur'an. Dia menciptakan manusia. Mengajarnya pandai berbicara.",
    asmaulName: "Ar-Rahman (Maha Pengasih)",
    asmaulArabic: "الرَّحْمَٰنُ",
    hadithText:
      "Segala sesuatu memiliki pengantin (puncak keindahan), dan pengantin Al-Qur'an adalah Surah Ar-Rahman. (HR. Al-Baihaqi)",
    audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/4902.mp3",
  },
]
