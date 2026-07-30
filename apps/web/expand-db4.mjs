import fs from 'fs';

const extraEvents = [
  {
    id: "perang-siffin",
    monthNumber: 2, // Safar
    dayNumber: 1, // Dimulai awal Safar 37 H
    title: "PERANG SIFFIN (FITNAH KUBRA)",
    description: "Perang saudara paling memilukan antara pasukan Khalifah Ali bin Abi Thalib dan Gubernur Syam, Mu'awiyah. Tragedi ini mengajarkan betapa berbahayanya fitnah internal dan politisasi agama, memecah umat Islam menjadi Sunni, Syiah, dan Khawarij.",
    quranicReference: {
      surah: "Al-Hujurat",
      ayah: "9",
      text: "وَإِن طَائِفَتَانِ مِنَ الْمُؤْمِنِينَ اقْتَتَلُوا فَأَصْلِحُوا بَيْنَهُمَا",
      translation: "Dan jika ada dua golongan dari orang-orang mukmin berperang maka damaikanlah antara keduanya."
    }
  },
  {
    id: "jatuhnya-granada",
    monthNumber: 3, // Rabiul Awwal
    dayNumber: 2, // 2 Rabiul Awwal 897 H (1492 M)
    title: "JATUHNYA GRANADA (RUNTUHNYA AL-ANDALUS)",
    description: "Setelah 800 tahun memancarkan cahaya peradaban, ilmu, dan toleransi di daratan Eropa (Spanyol), benteng terakhir Islam, Granada, jatuh ke tangan monarki Katolik akibat perpecahan internal, kelemahan pemimpin, dan intrik kekuasaan.",
    quranicReference: {
      surah: "Al-Anfal",
      ayah: "46",
      text: "وَأَطِيعُوا اللَّهَ وَرَسُولَهُ وَلَا تَنَازَعُوا فَتَفْشَلُوا وَتَذْهَبَ رِيحُكُمْ ۖ وَاصْبِرُوا ۚ إِنَّ اللَّهَ مَعَ الصَّابِرِينَ",
      translation: "Dan taatlah kepada Allah dan Rasul-Nya dan janganlah kamu berbantah-bantahan, yang menyebabkan kamu menjadi gentar dan hilang kekuatanmu dan bersabarlah. Sesungguhnya Allah beserta orang-orang yang sabar."
    }
  },
  {
    id: "mihna-ahmad",
    monthNumber: 9, // Ramadhan
    dayNumber: 1, // Berlangsung lama, memuncak di Ramadhan
    title: "AL-MIHNA (INKUISISI IMAM AHMAD BIN HANBAL)",
    description: "Fase gelap kebebasan berpendapat. Khalifah Al-Ma'mun memaksakan doktrin Mu'tazilah bahwa 'Al-Qur'an adalah makhluk'. Imam Ahmad disiksa dengan kejam karena menolak tunduk, mempertahankan akidah kemurnian Firman Allah.",
    quranicReference: {
      surah: "Al-Buruj",
      ayah: "8",
      text: "وَمَا نَقَمُوا مِنْهُمْ إِلَّا أَن يُؤْمِنُوا بِاللَّهِ الْعَزِيزِ الْحَمِيدِ",
      translation: "Dan mereka tidak menyiksa orang-orang mukmin itu melainkan karena orang-orang mukmin itu beriman kepada Allah Yang Maha Perkasa lagi Maha Terpuji."
    }
  },
  {
    id: "pencurian-hajar-aswad",
    monthNumber: 12, // Dzulhijjah
    dayNumber: 8, // 8 Dzulhijjah 317 H
    title: "PENCURIAN HAJAR ASWAD OLEH QARAMITAH",
    description: "Sekte ekstrem Qaramitah menyerang Mekah di musim Haji, membantai puluhan ribu jamaah, mencampakkan jasad mereka ke sumur Zamzam, dan mencuri Hajar Aswad. Batu hitam itu disandera selama 22 tahun sebelum dikembalikan.",
    quranicReference: {
      surah: "Al-Fil",
      ayah: "1-2",
      text: "أَلَمْ تَرَ كَيْفَ فَعَلَ رَبُّكَ بِأَصْحَابِ الْفِيلِ ۝ أَلَمْ يَجْعَلْ كَيْدَهُمْ فِي تَضْلِيلٍ",
      translation: "Apakah kamu tidak memperhatikan bagaimana Tuhanmu telah bertindak terhadap tentara bergajah? Bukankah Dia telah menjadikan tipu daya mereka (untuk menghancurkan Ka'bah) itu sia-sia?"
    }
  },
  {
    id: "wafat-ghazali",
    monthNumber: 6, // Jumadil Akhir
    dayNumber: 14, // 14 Jumadil Akhir 505 H
    title: "WAFATNYA SANG HUJJATUL ISLAM (AL-GHAZALI)",
    description: "Imam Abu Hamid Al-Ghazali, sang jenius yang berhasil merekonsiliasi filsafat, fikih, dan tasawuf melalui 'Ihya Ulumuddin', menghembuskan napas terakhirnya. Beliau adalah titik temu akal dan mata hati dalam tradisi intelektual Islam.",
    quranicReference: {
      surah: "Al-Mujadila",
      ayah: "11",
      text: "يَرْفَعِ اللَّهُ الَّذِينَ آمَنُوا مِنكُمْ وَالَّذِينَ أُوتُوا الْعِلْمَ دَرَجَاتٍ ۚ وَاللَّهُ بِمَا تَعْمَلُونَ خَبِيرٌ",
      translation: "Niscaya Allah akan meninggikan orang-orang yang beriman di antaramu dan orang-orang yang diberi ilmu pengetahuan beberapa derajat."
    }
  },
  {
    id: "wafat-syafii",
    monthNumber: 7, // Rajab
    dayNumber: 30, // Akhir Rajab 204 H
    title: "WAFATNYA SANG ARSITEK FIKIH (IMAM ASY-SYAFI'I)",
    description: "Wafatnya Muhammad bin Idris Asy-Syafi'i. Beliau adalah orang pertama yang membakukan metodologi hukum Islam (Ushul Fiqh) melalui kitab 'Ar-Risalah', menyelamatkan umat dari perdebatan rasionalis vs tradisionalis.",
    quranicReference: {
      surah: "An-Nahl",
      ayah: "43",
      text: "فَاسْأَلُوا أَهْلَ الذِّكْرِ إِن كُنتُمْ لَا تَعْلَمُونَ",
      translation: "Maka bertanyalah kepada orang yang mempunyai pengetahuan jika kamu tidak mengetahui."
    }
  },
  {
    id: "revolusi-abbasiyah",
    monthNumber: 6, // Jumadil Akhir
    dayNumber: 11, // Pertempuran Zab Raya 132 H
    title: "REVOLUSI ABBASIYAH (RUNTUHNYA UMAYYAH)",
    description: "Pertempuran Zab Raya menandai berakhirnya dominasi aristokrasi Arab Bani Umayyah. Berdirinya Kekhalifahan Abbasiyah mengubah wajah Islam menjadi peradaban metropolitan dan kosmopolitan yang merangkul Persia dan Asia.",
    quranicReference: {
      surah: "Al-Qasas",
      ayah: "5",
      text: "وَنُرِيدُ أَن نَّمُنَّ عَلَى الَّذِينَ اسْتُضْعِفُوا فِي الْأَرْضِ وَنَجْعَلَهُمْ أَئِمَّةً وَنَجْعَلَهُمُ الْوَارِثِينَ",
      translation: "Dan Kami hendak memberi karunia kepada orang-orang yang tertindas di bumi itu dan hendak menjadikan mereka pemimpin dan menjadikan mereka orang-orang yang mewarisi (bumi)."
    }
  },
  {
    id: "eksekusi-al-hallaj",
    monthNumber: 11, // Dzulqa'dah
    dayNumber: 24, // 24 Dzulqa'dah 309 H
    title: "EKSEKUSI AL-HALLAJ (BENTURAN SYARIAT & HAKIKAT)",
    description: "Sufi mistik Al-Hallaj dieksekusi brutal oleh otoritas Abbasiyah atas tuduhan murtad karena ucapan 'Ana Al-Haqq' (Akulah Kebenaran). Peristiwa ini adalah monumen abadi benturan antara hukum fikih eksoterik dengan tasawuf esoterik yang belum matang pada masanya.",
    quranicReference: {
      surah: "Taha",
      ayah: "114",
      text: "فَتَعَالَى اللَّهُ الْمَلِكُ الْحَقُّ ۗ وَلَا تَعْجَلْ بِالْقُرْآنِ مِن قَبْلِ أَن يُقْضَىٰ إِلَيْكَ وَحْيُهُ ۖ وَقُل رَّبِّ زِدْنِي عِلْمًا",
      translation: "Maka Maha Tinggi Allah Raja Yang Sebenar-benarnya (Al-Haqq), dan janganlah kamu tergesa-gesa membaca Al-Quran sebelum disempurnakan mewahyukannya kepadamu, dan katakanlah: 'Ya Tuhanku, tambahkanlah kepadaku ilmu pengetahuan'."
    }
  },
  {
    id: "perang-yamamah",
    monthNumber: 4, // Rabiul Akhir
    dayNumber: 1, // Sekitar Rabiul Awwal/Akhir 11 H
    title: "PERANG YAMAMAH & PENGUMPULAN AL-QUR'AN",
    description: "Bentrokan berdarah melawan nabi palsu Musailamah Al-Kazzab. 70 penghafal Al-Qur'an (Huffaz) dari kalangan sahabat gugur. Tragedi ini memicu kepanikan Umar bin Khattab dan berujung pada proyek raksasa kodifikasi Al-Qur'an menjadi satu Mushaf.",
    quranicReference: {
      surah: "Al-Hijr",
      ayah: "9",
      text: "إِنَّا نَحْنُ نَزَّلْنَا الذِّكْرَ وَإِنَّا لَهُ لَحَافِظُونَ",
      translation: "Sesungguhnya Kami-lah yang menurunkan Al Quran, dan sesungguhnya Kami benar-benar memeliharanya."
    }
  },
  {
    id: "perang-jamal",
    monthNumber: 6, // Jumadil Akhir
    dayNumber: 15, // 15 Jumadil Akhir 36 H
    title: "PERANG JAMAL (TRAGEDI UNTA)",
    description: "Perang saudara pertama dalam Islam akibat intrik kaum munafik. Pasukan Khalifah Ali berhadapan dengan sayap Aisyah (Istri Nabi). Mengajarkan kedewasaan bahwa konflik politik dapat terjadi bahkan di antara para Sahabat yang dijamin masuk surga.",
    quranicReference: {
      surah: "Al-Ahzab",
      ayah: "33",
      text: "وَقَرْنَ فِي بُيُوتِكُنَّ وَلَا تَبَرَّجْنَ تَبَرُّجَ الْجَاهِلِيَّةِ الْأُولَىٰ",
      translation: "Dan hendaklah kamu (istri-istri Nabi) tetap di rumahmu dan janganlah kamu berhias dan bertingkah laku seperti orang-orang Jahiliyah yang dahulu..."
    }
  }
];

let content = fs.readFileSync('@core/db/data/prophetic-events.db.ts', 'utf-8');
const newEvents = extraEvents.map(e => JSON.stringify(e, null, 2)).join(',\n  ');
content = content.replace(/\]\s*$/, `  ,${newEvents}\n]`);
fs.writeFileSync('@core/db/data/prophetic-events.db.ts', content);
console.log("DB Deep Insights Expanded with 10 more massive historical events!");
