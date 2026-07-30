export type PropheticEvent = {
  id: string
  monthNumber: number // 1 to 12
  dayNumber: number // 1 to 30
  title: string
  description: string
  quranicReference?: {
    surah: string
    ayah: string
    text: string
    translation: string
  }
}

// FAKEDB: Arsip Sirah Nabawiyah (Prophetic Chronicle) super lengkap dan akurat.
// Mencakup sejarah para Rasul dan peristiwa krusial umat Islam.
export const PROPHETIC_EVENTS: PropheticEvent[] = [
  // ==================== MUHARRAM ====================
  {
    id: "hijrah-start",
    monthNumber: 1, // Muharram
    dayNumber: 1,
    title: "AWAL PENANGGALAN HIJRIYAH",
    description: "Titik nol kalender peradaban Islam yang ditetapkan oleh Khalifah Umar bin Khattab, mengambil momentum persiapan Hijrah Nabi Muhammad SAW dari Mekah ke Madinah. Hijrah adalah simbol transisi dari penindasan menuju peradaban (Madani).",
    quranicReference: {
      surah: "Al-Anfal",
      ayah: "74",
      text: "وَالَّذِينَ آمَنُوا وَهَاجَرُوا وَجَاهَدُوا فِي سَبِيلِ اللَّهِ وَالَّذِينَ آوَوا وَّنَصَرُوا أُولَٰئِكَ هُمُ الْمُؤْمِنُونَ حَقًّا",
      translation: "Dan orang-orang yang beriman dan berhijrah serta berjihad pada jalan Allah, dan orang-orang yang memberi tempat kediaman dan memberi pertolongan, mereka itulah orang-orang yang benar-benar beriman."
    }
  },
  {
    id: "asyura-musa",
    monthNumber: 1, // Muharram
    dayNumber: 10,
    title: "KEMENANGAN NABI MUSA AS (YAUWM ASYURA)",
    description: "Pada hari Asyura (10 Muharram), Allah SWT membelah Laut Merah untuk menyelamatkan Nabi Musa AS dan Bani Israil dari kejaran Fir'aun. Sebuah epik kehancuran rezim tiran oleh keajaiban Ilahi.",
    quranicReference: {
      surah: "Asy-Syu'ara",
      ayah: "63",
      text: "فَأَوْحَيْنَا إِلَىٰ مُوسَىٰ أَنِ اضْرِب بِّعَصَاكَ الْبَحْرَ ۖ فَانفَلَقَ فَكَانَ كُلُّ فِرْقٍ كَالطَّوْدِ الْعَظِيمِ",
      translation: "Lalu Kami wahyukan kepada Musa: 'Pukullah lautan itu dengan tongkatmu'. Maka terbelahlah lautan itu dan tiap-tiap belahan adalah seperti gunung yang besar."
    }
  },
  {
    id: "asyura-nuh",
    monthNumber: 1, // Muharram
    dayNumber: 10,
    title: "BERLABUHNYA BAHTERA NABI NUH AS",
    description: "Bahtera raksasa Nabi Nuh AS akhirnya berlabuh dengan selamat di Bukit Judi setelah badai banjir bandang global yang menenggelamkan peradaban ingkar. Titik ulang (reset) bagi umat manusia.",
    quranicReference: {
      surah: "Hud",
      ayah: "44",
      text: "وَقِيلَ يَا أَرْضُ ابْلَعِي مَاءَكِ وَيَا سَمَاءُ أَقْلِعِي وَغِيضَ الْمَاءُ وَقُضِيَ الْأَمْرُ وَاسْتَوَتْ عَلَى الْجُودِيِّ",
      translation: "Dan difirmankan: 'Hai bumi telanlah airmu, dan hai langit (hujan) berhentilah,' dan airpun disurutkan, perintahpun diselesaikan dan bahtera itupun berlabuh di atas bukit Judi."
    }
  },
  {
    id: "asyura-yunus",
    monthNumber: 1, // Muharram
    dayNumber: 10,
    title: "PEMBEBASAN NABI YUNUS AS DARI PERUT PAUS",
    description: "Allah SWT menerima taubat Nabi Yunus AS dan membebaskannya dari kegelapan perut ikan paus raksasa. Menandakan kekuatan zikir 'La ilaha illa anta subhanaka inni kuntu minaz-zalimin'.",
    quranicReference: {
      surah: "Al-Anbiya",
      ayah: "87-88",
      text: "فَنَادَىٰ فِي الظُّلُمَاتِ أَن لَّا إِلَٰهَ إِلَّا أَنتَ سُبْحَانَكَ إِنِّي كُنتُ مِنَ الظَّالِمِينَ ۝ فَاسْتَجَبْنَا لَهُ وَنَجَّيْنَاهُ مِنَ الْغَمِّ",
      translation: "Maka ia menyeru dalam keadaan yang sangat gelap: 'Bahwa tidak ada Tuhan selain Engkau. Maha Suci Engkau, sesungguhnya aku adalah termasuk orang-orang yang zalim.' Maka Kami telah memperkenankan doanya dan menyelamatkannya dari kedukaan."
    }
  },
  
  // ==================== SAFAR ====================
  {
    id: "hijrah-departure",
    monthNumber: 2, // Safar
    dayNumber: 27,
    title: "AWAL PERJALANAN HIJRAH NABI SAW",
    description: "Di bawah ancaman pembunuhan dari pemuda-pemuda Quraisy, Nabi Muhammad SAW dan Abu Bakar meninggalkan Mekah di malam hari menuju Gua Tsur. Allah membutakan mata para pengepung.",
    quranicReference: {
      surah: "Ya-Sin",
      ayah: "9",
      text: "وَجَعَلْنَا مِن بَيْنِ أَيْدِيهِمْ سَدًّا وَمِنْ خَلْفِهِمْ سَدًّا فَأَغْشَيْنَاهُمْ فَهُمْ لَا يُبْصِرُونَ",
      translation: "Dan Kami adakan di hadapan mereka sekat (dinding) dan di belakang mereka sekat, dan Kami tutup (mata) mereka sehingga mereka tidak dapat melihat."
    }
  },

  // ==================== RABI'UL AWWAL ====================
  {
    id: "maulid-nabi",
    monthNumber: 3, // Rabiul Awwal
    dayNumber: 12,
    title: "KELAHIRAN SANG PENCERAH (MAULID NABI)",
    description: "Lahirnya Nabi Muhammad SAW di Mekah (Tahun Gajah). Kelahiran manusia paling berpengaruh dalam sejarah yang diutus sebagai Rahmatan Lil 'Alamin (Rahmat bagi semesta alam).",
    quranicReference: {
      surah: "Al-Anbiya",
      ayah: "107",
      text: "وَمَا أَرْسَلْنَاكَ إِلَّا رَحْمَةً لِّلْعَالَمِينَ",
      translation: "Dan tiadalah Kami mengutus kamu, melainkan untuk (menjadi) rahmat bagi semesta alam."
    }
  },
  {
    id: "wafat-nabi",
    monthNumber: 3, // Rabiul Awwal
    dayNumber: 12,
    title: "WAFATNYA NABI MUHAMMAD SAW",
    description: "Pada hari dan bulan yang sama dengan kelahirannya, Sang Rasul menghembuskan napas terakhir. Menguji iman para sahabat dan menandai berakhirnya wahyu langit turun ke bumi.",
    quranicReference: {
      surah: "Ali 'Imran",
      ayah: "144",
      text: "وَمَا مُحَمَّدٌ إِلَّا رَسُولٌ قَدْ خَلَتْ مِن قَبْلِهِ الرُّسُلُ ۚ أَفَإِن مَّاتَ أَوْ قُتِلَ انقَلَبْتُمْ عَلَىٰ أَعْقَابِكُمْ",
      translation: "Muhammad itu tidak lain hanyalah seorang rasul, sungguh telah berlalu sebelumnya beberapa orang rasul. Apakah Jika dia wafat atau dibunuh kamu berbalik ke belakang (murtad)?"
    }
  },

  // ==================== RAJAB ====================
  {
    id: "isra-miraj",
    monthNumber: 7, // Rajab
    dayNumber: 27,
    title: "ISRA' MI'RAJ & PERJALANAN LINTAS DIMENSI",
    description: "Perjalanan malam Nabi Muhammad SAW dari Masjidil Haram ke Masjidil Aqsa (Isra'), dilanjutkan dengan teleportasi naik menembus 7 lapis langit menuju Sidratul Muntaha (Mi'raj) untuk menerima perintah shalat wajib secara langsung dari Allah.",
    quranicReference: {
      surah: "Al-Isra",
      ayah: "1",
      text: "سُبْحَانَ الَّذِي أَسْرَىٰ بِعَبْدِهِ لَيْلًا مِّنَ الْمَسْجِدِ الْحَرَامِ إِلَى الْمَسْجِدِ الْأَقْصَى الَّذِي بَارَكْنَا حَوْلَهُ لِنُرِيَهُ مِنْ آيَاتِنَا",
      translation: "Maha Suci Allah, yang telah memperjalankan hamba-Nya pada suatu malam dari Al Masjidil Haram ke Al Masjidil Aqsha yang telah Kami berkahi sekelilingnya..."
    }
  },

  // ==================== SYA'BAN ====================
  {
    id: "qibla-change",
    monthNumber: 8, // Sya'ban
    dayNumber: 15, // Pertengahan Sya'ban
    title: "PERALIHAN ARAH KIBLAT (PERISTIWA KIBLATAIN)",
    description: "Perintah turun di pertengahan Sya'ban saat shalat jamaah berlangsung. Arah kiblat Muslim diubah secara permanen dari Baitul Maqdis (Yerusalem) kembali ke Ka'bah (Mekah).",
    quranicReference: {
      surah: "Al-Baqarah",
      ayah: "144",
      text: "قَدْ نَرَىٰ تَقَلُّبَ وَجْهِكَ فِي السَّمَاءِ ۖ فَلَنُوَلِّيَنَّكَ قِبْلَةً تَرْضَاهَا ۚ فَوَلِّ وَجْهَكَ شَطْرَ الْمَسْجِدِ الْحَرَامِ",
      translation: "Sungguh Kami (sering) melihat mukamu menengadah ke langit, maka sungguh Kami akan memalingkan kamu ke kiblat yang kamu sukai. Palingkanlah mukamu ke arah Masjidil Haram."
    }
  },

  // ==================== RAMADHAN ====================
  {
    id: "nuzulul-quran",
    monthNumber: 9, // Ramadhan
    dayNumber: 17,
    title: "NUZULUL QUR'AN (TURUNNYA WAHYU PERTAMA)",
    description: "Malam hari di Gua Hira, Malaikat Jibril merengkuh Nabi Muhammad SAW dan menyampaikan wahyu pertama (Al-Alaq 1-5). Detik dimana kegelapan jahiliyah mulai diterangi cahaya samawi.",
    quranicReference: {
      surah: "Al-Qadr",
      ayah: "1-3",
      text: "إِنَّا أَنزَلْنَاهُ فِي لَيْلَةِ الْقَدْرِ ۝ وَمَا أَدْرَاكَ مَا لَيْلَةُ الْقَدْرِ ۝ لَيْلَةُ الْقَدْرِ خَيْرٌ مِّنْ أَلْفِ شَهْرٍ",
      translation: "Sesungguhnya Kami telah menurunkannya (Al Quran) pada malam kemuliaan. Dan tahukah kamu apakah malam kemuliaan itu? Malam kemuliaan itu lebih baik dari seribu bulan."
    }
  },
  {
    id: "badar-war",
    monthNumber: 9, // Ramadhan
    dayNumber: 17,
    title: "PERANG BADAR AL-KUBRA (AL-FURQAN)",
    description: "Bentrokan militer epik pertama umat Islam. Secara matematis mustahil: 313 Muslimin (dengan persenjataan seadanya) menghancurkan 1.000 pasukan elit Quraisy. Allah mengirimkan bala bantuan ribuan Malaikat ke medan tempur.",
    quranicReference: {
      surah: "Ali 'Imran",
      ayah: "123-124",
      text: "وَلَقَدْ نَصَرَكُمُ اللَّهُ بِبَدْرٍ وَأَنتُمْ أَذِلَّةٌ ۖ ... إِذْ تَقُولُ لِلْمُؤْمِنِينَ أَلَن يَكْفِيَكُمْ أَن يُمِدَّكُمْ رَبُّكُم بِثَلَاثَةِ آلَافٍ مِّنَ الْمَلَائِكَةِ مُنزَلِينَ",
      translation: "Sungguh Allah telah menolong kamu dalam peperangan Badar... (Ingatlah), ketika kamu mengatakan kepada orang mukmin: 'Apakah tidak cukup bagi kamu Allah membantu kamu dengan tiga ribu malaikat yang diturunkan (dari langit)?'"
    }
  },
  {
    id: "fathu-makkah",
    monthNumber: 9, // Ramadhan
    dayNumber: 20,
    title: "FATHU MAKKAH (PENAKLUKAN KOTA MEKAH)",
    description: "10.000 pasukan Muslim memasuki Mekah tanpa pertumpahan darah. Nabi Muhammad SAW menghancurkan 360 berhala di sekitar Ka'bah dengan tongkatnya dan memberikan amnesti massal kepada para musuhnya.",
    quranicReference: {
      surah: "An-Nasr",
      ayah: "1-2",
      text: "إِذَا جَاءَ نَصْرُ اللَّهِ وَالْفَتْحُ ۝ وَرَأَيْتَ النَّاسَ يَدْخُلُونَ فِي دِينِ اللَّهِ أَفْوَاجًا",
      translation: "Apabila telah datang pertolongan Allah dan kemenangan (Fathu Makkah). Dan kamu lihat manusia masuk agama Allah dengan berbondong-bondong."
    }
  },

  // ==================== SYAWAL ====================
  {
    id: "idul-fitri",
    monthNumber: 10, // Syawal
    dayNumber: 1,
    title: "IDUL FITRI (HARI KEMENANGAN)",
    description: "Hari perayaan setelah satu bulan penuh melawan hawa nafsu di bulan Ramadhan. Momen di mana umat Islam diharamkan untuk berpuasa dan kembali berbuka.",
    quranicReference: {
      surah: "Al-Baqarah",
      ayah: "185",
      text: "وَلِتُكْمِلُوا الْعِدَّةَ وَلِتُكَبِّرُوا اللَّهَ عَلَىٰ مَا هَدَاكُمْ وَلَعَلَّكُمْ تَشْكُرُونَ",
      translation: "...dan hendaklah kamu mencukupkan bilangannya dan hendaklah kamu mengagungkan Allah atas petunjuk-Nya yang diberikan kepadamu, supaya kamu bersyukur."
    }
  },
  {
    id: "uhud-war",
    monthNumber: 10, // Syawal
    dayNumber: 15, // Sebagian riwayat 7 Syawal atau pertengahan
    title: "PERANG UHUD & GUGURNYA HAMZAH",
    description: "Ujian kedisiplinan terberat umat Islam. Karena pasukan pemanah turun dari Bukit Ainain mengincar pundi rampasan, formasi pecah. Pasukan Khalid bin Walid menyapu dari belakang, menyebabkan paman Nabi, Hamzah (Singa Allah) gugur syahid.",
    quranicReference: {
      surah: "Ali 'Imran",
      ayah: "152",
      text: "وَلَقَدْ صَدَقَكُمُ اللَّهُ وَعْدَهُ إِذْ تَحُسُّونَهُم بِإِذْنِهِ ۖ حَتَّىٰ إِذَا فَشِلْتُمْ وَتَنَازَعْتُمْ فِي الْأَمْرِ وَعَصَيْتُم مِّن بَعْدِ مَا أَرَاكُم مَّا تُحِبُّونَ",
      translation: "Dan sesungguhnya Allah telah memenuhi janji-Nya kepada kamu, ketika kamu membunuh mereka dengan izin-Nya sampai pada saat kamu lemah dan berselisih dalam urusan itu dan mendurhakai perintah (Rasul) sesudah Allah memperlihatkan kepadamu apa yang kamu sukai (harta rampasan)..."
    }
  },

  // ==================== DZULQA'DAH ====================
  {
    id: "hudaibiyah",
    monthNumber: 11, // Dzulqa'dah
    dayNumber: 1, // Awal bulan
    title: "PERJANJIAN HUDAIBIYAH",
    description: "Tampak seperti kekalahan diplomatik di mata para Sahabat, namun Allah menyebutnya sebagai 'Fathan Mubiina' (Kemenangan Nyata). Perjanjian damai dengan Quraisy ini membuahkan ekspansi dakwah Islam secara eksponensial.",
    quranicReference: {
      surah: "Al-Fath",
      ayah: "1",
      text: "إِنَّا فَتَحْنَا لَكَ فَتْحًا مُّبِينًا",
      translation: "Sesungguhnya Kami telah memberikan kepadamu kemenangan yang nyata."
    }
  },

  // ==================== DZULHIJJAH ====================
  {
    id: "arafah",
    monthNumber: 12, // Dzulhijjah
    dayNumber: 9,
    title: "WUKUF DI ARAFAH & TURUNNYA AYAT TERAKHIR",
    description: "Puncak ibadah Haji (Wukuf). Di tempat ini pula, pada Haji Wada' (Haji Perpisahan), turun wahyu yang memproklamirkan kesempurnaan agama Islam. Tidak ada lagi aturan agama baru setelahnya.",
    quranicReference: {
      surah: "Al-Ma'idah",
      ayah: "3",
      text: "الْيَوْمَ أَكْمَلْتُ لَكُمْ دِينَكُمْ وَأَتْمَمْتُ عَلَيْكُمْ نِعْمَتِي وَرَضِيتُ لَكُمُ الْإِسْلَامَ دِينًا",
      translation: "Pada hari ini telah Kusempurnakan untuk kamu agamamu, dan telah Ku-cukupkan kepadamu nikmat-Ku, dan telah Ku-ridhai Islam itu jadi agama bagimu."
    }
  },
  {
    id: "ibrahim-sacrifice",
    monthNumber: 12, // Dzulhijjah
    dayNumber: 10,
    title: "PENGORBANAN NABI IBRAHIM (IDUL ADHA)",
    description: "Manifestasi ketauhidan tingkat puncak. Nabi Ibrahim AS tanpa ragu menjalankan perintah Ilahi untuk mengorbankan putranya, Nabi Ismail AS. Karena kepatuhan absolut tersebut, pedang menjadi tumpul dan sembelihan diganti dengan Gibas (domba jantan) dari Surga.",
    quranicReference: {
      surah: "As-Saffat",
      ayah: "102",
      text: "فَلَمَّا بَلَغَ مَعَهُ السَّعْيَ قَالَ يَا بُنَيَّ إِنِّي أَرَىٰ فِي الْمَنَامِ أَنِّي أَذْبَحُكَ فَانظُرْ مَاذَا تَرَىٰ ۚ قَالَ يَا أَبَتِ افْعَلْ مَا تُؤْمَرُ ۖ سَتَجِدُنِي إِن شَاءَ اللَّهُ مِنَ الصَّابِرِينَ",
      translation: "Maka tatkala anak itu sampai (pada umur sanggup) berusaha bersama-sama Ibrahim, Ibrahim berkata: 'Hai anakku sesungguhnya aku melihat dalam mimpi bahwa aku menyembelihmu. Maka fikirkanlah apa pendapatmu!' Ia menjawab: 'Hai bapakku, kerjakanlah apa yang diperintahkan kepadamu; insya Allah kamu akan mendapatiku termasuk orang-orang yang sabar'."
    }
  }
  ,{
  "id": "karbala",
  "monthNumber": 1,
  "dayNumber": 10,
  "title": "TRAGEDI KARBALA",
  "description": "Gugurnya cucu kesayangan Rasulullah SAW, Husain bin Ali RA, beserta keluarganya di Padang Karbala. Sebuah tragedi paling memilukan dalam sejarah perpolitikan Islam yang mengajarkan keberanian melawan tirani.",
  "quranicReference": {
    "surah": "Al-Ahzab",
    "ayah": "33",
    "text": "إِنَّمَا يُرِيدُ اللَّهُ لِيُذْهِبَ عَنكُمُ الرِّجْسَ أَهْلَ الْبَيْتِ وَيُطَهِّرَكُمْ تَطْهِيرًا",
    "translation": "Sesungguhnya Allah bermaksud hendak menghilangkan dosa dari kamu, hai ahlul bait dan membersihkan kamu sebersih-bersihnya."
  }
},
  {
  "id": "perang-khandaq",
  "monthNumber": 10,
  "dayNumber": 5,
  "title": "PERANG KHANDAQ (AHZAB)",
  "description": "Pasukan sekutu (Ahzab) Quraisy dan Yahudi mengepung Madinah. Atas usul Salman Al-Farisi, umat Islam menggali parit raksasa (Khandaq) sebagai sistem pertahanan, yang sukses menggagalkan invasi musuh.",
  "quranicReference": {
    "surah": "Al-Ahzab",
    "ayah": "9",
    "text": "يَا أَيُّهَا الَّذِينَ آمَنُوا اذْكُرُوا نِعْمَةَ اللَّهِ عَلَيْكُمْ إِذْ جَاءَتْكُمْ جُنُودٌ فَأَرْسَلْنَا عَلَيْهِمْ رِيحًا وَجُنُودًا لَّمْ تَرَوْهَا",
    "translation": "Hai orang-orang yang beriman, ingatlah akan nikmat Allah (yang telah dikaruniakan) kepadamu ketika datang kepadamu tentara-tentara, lalu Kami kirimkan kepada mereka angin topan dan tentara yang tidak dapat kamu melihatnya."
  }
},
  {
  "id": "perang-tabuk",
  "monthNumber": 7,
  "dayNumber": 10,
  "title": "PERANG TABUK",
  "description": "Ekspedisi militer terbesar dan terakhir yang dipimpin langsung oleh Nabi Muhammad SAW menuju perbatasan Romawi di musim panas yang ekstrem. Pasukan Romawi akhirnya mundur tanpa pertempuran.",
  "quranicReference": {
    "surah": "At-Taubah",
    "ayah": "117",
    "text": "لَّقَد تَّابَ اللَّهُ عَلَى النَّبِيِّ وَالْمُهَاجِرِينَ وَالْأَنصَارِ الَّذِينَ اتَّبَعُوهُ فِي سَاعَةِ الْعُسْرَةِ",
    "translation": "Sesungguhnya Allah telah menerima taubat Nabi, orang-orang muhajirin dan orang-orang anshar yang mengikuti Nabi dalam masa kesulitan (Perang Tabuk)."
  }
},
  {
  "id": "haji-wada",
  "monthNumber": 12,
  "dayNumber": 9,
  "title": "KHUTBAH HAJI WADA'",
  "description": "Khutbah perpisahan monumental Nabi Muhammad SAW di Lembah Uranah, Arafah. Menetapkan prinsip dasar hak asasi manusia, kesetaraan ras, penghapusan riba, dan hak-hak wanita dalam Islam.",
  "quranicReference": {
    "surah": "Al-Hujurat",
    "ayah": "13",
    "text": "يَا أَيُّهَا النَّاسُ إِنَّا خَلَقْنَاكُم مِّن ذَكَرٍ وَأُنثَىٰ وَجَعَلْنَاكُمْ شُعُوبًا وَقَبَائِلَ لِتَعَارَفُوا ۚ إِنَّ أَكْرَمَكُمْ عِندَ اللَّهِ أَتْقَاكُمْ",
    "translation": "Hai manusia, sesungguhnya Kami menciptakan kamu dari seorang laki-laki dan seorang perempuan dan menjadikan kamu berbangsa-bangsa dan bersuku-suku supaya kamu saling kenal-mengenal. Sesungguhnya orang yang paling mulia di antara kamu di sisi Allah ialah orang yang paling takwa."
  }
},
  {
  "id": "pembebasan-al-aqsa",
  "monthNumber": 7,
  "dayNumber": 27,
  "title": "PEMBEBASAN BAITUL MAQDIS (AL-AQSA)",
  "description": "Bertepatan dengan peringatan Isra Mi'raj, Salahuddin Al-Ayyubi berhasil membebaskan kembali Masjidil Aqsa dan kota Yerusalem dari Pasukan Salib setelah 88 tahun dikuasai, tanpa ada pembantaian balasan.",
  "quranicReference": {
    "surah": "Al-Isra",
    "ayah": "7",
    "text": "إِنْ أَحْسَنتُمْ أَحْسَنتُمْ لِأَنفُسِكُمْ ۖ وَإِنْ أَسَأْتُمْ فَلَهَا ۚ فَإِذَا جَاءَ وَعْدُ الْآخِرَةِ لِيَسُوءُوا وُجُوهَكُمْ وَلِيَدْخُلُوا الْمَسْجِدَ كَمَا دَخَلُوهُ أَوَّلَ مَرَّةٍ وَلِيُتَبِّرُوا مَا عَلَوْا تَتْبِيرًا",
    "translation": "Jika kamu berbuat baik (berarti) kamu berbuat baik bagi dirimu sendiri dan jika kamu berbuat jahat, maka (kejahatan) itu bagi dirimu sendiri, dan apabila datang saat hukuman bagi (kejahatan) yang kedua, (Kami datangkan orang-orang lain) untuk menyuramkan muka-muka kamu dan mereka masuk ke dalam masjid (Al-Aqsa), sebagaimana musuh-musuhmu memasukinya pada kali pertama dan untuk membinasakan sehabis-habisnya apa saja yang mereka kuasai."
  }
}
  ,{
  "id": "wafat-khadijah",
  "monthNumber": 9,
  "dayNumber": 10,
  "title": "WAFATNYA SAYYIDAH KHADIJAH (AMUL HUZNI)",
  "description": "Khadijah binti Khuwailid, istri tercinta sekaligus pilar finansial dan emosional utama Rasulullah SAW, wafat. Tahun ini disebut 'Amul Huzni' (Tahun Kesedihan) karena tak lama kemudian paman beliau, Abu Thalib, juga wafat.",
  "quranicReference": {
    "surah": "Al-Fajr",
    "ayah": "27-28",
    "text": "يَا أَيَّتُهَا النَّفْسُ الْمُطْمَئِنَّةُ ۝ ارْجِعِي إِلَىٰ رَبِّكِ رَاضِيَةً مَّرْضِيَّةً",
    "translation": "Hai jiwa yang tenang. Kembalilah kepada Tuhanmu dengan hati yang puas lagi diridhai-Nya."
  }
},
  {
  "id": "wafat-ali",
  "monthNumber": 9,
  "dayNumber": 21,
  "title": "SYAHIDNYA KHALIFAH ALI BIN ABI THALIB",
  "description": "Khalifah keempat, Ali bin Abi Thalib RA, wafat setelah ditebas pedang beracun oleh pengkhianat Khawarij (Abdurrahman bin Muljam) saat sedang mengimami shalat Subuh di Masjid Kufah.",
  "quranicReference": {
    "surah": "Al-Baqarah",
    "ayah": "207",
    "text": "وَمِنَ النَّاسِ مَن يَشْرِي نَفْسَهُ ابْتِغَاءَ مَرْضَاتِ اللَّهِ ۗ وَاللَّهُ رَءُوفٌ بِالْعِبَادِ",
    "translation": "Dan di antara manusia ada orang yang mengorbankan dirinya karena mencari keridhaan Allah; dan Allah Maha Penyantun kepada hamba-hamba-Nya."
  }
},
  {
  "id": "penaklukan-andalusia",
  "monthNumber": 9,
  "dayNumber": 28,
  "title": "PENAKLUKAN ANDALUSIA (SPANYOL)",
  "description": "Panglima Tariq bin Ziyad menyeberangi selat Gibraltar dan memerintahkan pasukannya untuk membakar kapal-kapal mereka sendiri. Mereka meraih kemenangan atas pasukan Visigoth, membuka gerbang peradaban Islam di Eropa selama 800 tahun.",
  "quranicReference": {
    "surah": "Al-Hajj",
    "ayah": "40",
    "text": "وَلَيَنصُرَنَّ اللَّهُ مَن يَنصُرُهُ ۗ إِنَّ اللَّهَ لَقَوِيٌّ عَزِيزٌ",
    "translation": "Sesungguhnya Allah pasti menolong orang yang menolong (agama)-Nya. Sesungguhnya Allah benar-benar Maha Kuat lagi Maha Perkasa."
  }
},
  {
  "id": "perang-ain-jalut",
  "monthNumber": 9,
  "dayNumber": 15,
  "title": "PERANG AIN JALUT (PENGHANCURAN MONGOL)",
  "description": "Pasukan Mamluk dari Mesir pimpinan Saifuddin Qutuz berhasil menghentikan dan menghancurkan invasi brutal pasukan Mongol (yang sebelumnya menghancurkan Baghdad). Penyelamatan besar bagi sisa-sisa peradaban Islam.",
  "quranicReference": {
    "surah": "Al-Baqarah",
    "ayah": "249",
    "text": "كَم مِّن فِئَةٍ قَلِيلَةٍ غَلَبَتْ فِئَةً كَثِيرَةً بِإِذْنِ اللَّهِ ۗ وَاللَّهُ مَعَ الصَّابِرِينَ",
    "translation": "Berapa banyak terjadi golongan yang sedikit dapat mengalahkan golongan yang banyak dengan izin Allah. Dan Allah beserta orang-orang yang sabar."
  }
},
  {
  "id": "penaklukan-konstantinopel",
  "monthNumber": 5,
  "dayNumber": 20,
  "title": "PENAKLUKAN KONSTANTINOPEL",
  "description": "Pemenuhan nubuat Rasulullah SAW 800 tahun sebelumnya. Sultan Muhammad Al-Fatih (Mehmed II) menembus tembok raksasa Konstantinopel, menjatuhkan Kekaisaran Bizantium, dan mengubah kota itu menjadi Istanbul.",
  "quranicReference": {
    "surah": "As-Saff",
    "ayah": "13",
    "text": "وَأُخْرَىٰ تُحِبُّونَهَا ۖ نَصْرٌ مِّنَ اللَّهِ وَفَتْحٌ قَرِيبٌ ۗ وَبَشِّرِ الْمُؤْمِنِينَ",
    "translation": "Dan (ada lagi) karunia yang lain yang kamu sukai (yaitu) pertolongan dari Allah dan kemenangan yang dekat (waktunya). Dan sampaikanlah berita gembira kepada orang-orang yang beriman."
  }
},
  {
  "id": "runtuhnya-khilafah",
  "monthNumber": 7,
  "dayNumber": 27,
  "title": "RUNTUHNYA KEKHALIFAHAN TURKI UTSMANI",
  "description": "Bertepatan dengan hari Isra' Mi'raj (27 Rajab 1342 H / 3 Maret 1924 M), Majelis Agung Nasional Turki secara resmi menghapus institusi Kekhalifahan, menandai berakhirnya sistem kepemimpinan politik global umat Islam yang telah berdiri sejak wafatnya Nabi.",
  "quranicReference": {
    "surah": "Ali 'Imran",
    "ayah": "140",
    "text": "وَتِلْكَ الْأَيَّامُ نُدَاوِلُهَا بَيْنَ النَّاسِ وَلِيَعْلَمَ اللَّهُ الَّذِينَ آمَنُوا",
    "translation": "Dan masa (kejayaan dan kehancuran) itu Kami pergilirkan di antara manusia (agar mereka mendapat pelajaran); dan supaya Allah membedakan orang-orang yang beriman..."
  }
},
  {
  "id": "nuzulul-taurat",
  "monthNumber": 9,
  "dayNumber": 6,
  "title": "TURUNNYA KITAB TAURAT",
  "description": "Bulan Ramadhan adalah bulan kitab suci. Dalam salah satu riwayat sahih disebutkan bahwa Allah menurunkan kitab Taurat kepada Nabi Musa AS pada tanggal 6 Ramadhan.",
  "quranicReference": {
    "surah": "Al-Ma'idah",
    "ayah": "44",
    "text": "إِنَّا أَنزَلْنَا التَّوْرَاةَ فِيهَا هُدًى وَنُورٌ",
    "translation": "Sesungguhnya Kami telah menurunkan Kitab Taurat di dalamnya (ada) petunjuk dan cahaya (yang menerangi)..."
  }
},
  {
  "id": "nuzulul-injil",
  "monthNumber": 9,
  "dayNumber": 13,
  "title": "TURUNNYA KITAB INJIL",
  "description": "Melanjutkan tradisi wahyu di bulan suci, Allah menurunkan kitab Injil kepada Nabi Isa AS pada tanggal 13 Ramadhan sebagai petunjuk bagi Bani Israil.",
  "quranicReference": {
    "surah": "Al-Ma'idah",
    "ayah": "46",
    "text": "وَآتَيْنَاهُ الْإِنجِيلَ فِيهِ هُدًى وَنُورٌ وَمُصَدِّقًا لِّمَا بَيْنَ يَدَيْهِ مِنَ التَّوْرَاةِ",
    "translation": "Dan Kami telah memberikan kepadanya Kitab Injil sedang di dalamnya (ada) petunjuk dan cahaya (yang menerangi), dan membenarkan kitab yang sebelumnya, yaitu Kitab Taurat."
  }
},
  {
  "id": "nuzulul-zabur",
  "monthNumber": 9,
  "dayNumber": 18,
  "title": "TURUNNYA KITAB ZABUR",
  "description": "Kitab Zabur diturunkan kepada Nabi Dawud AS pada tanggal 18 Ramadhan, berisi nyanyian, puji-pujian kepada Allah, dan nasihat kebijaksanaan.",
  "quranicReference": {
    "surah": "An-Nisa'",
    "ayah": "163",
    "text": "وَآتَيْنَا دَاوُودَ زَبُورًا",
    "translation": "...dan Kami berikan Zabur kepada Daud."
  }
},
  {
  "id": "wafat-umar",
  "monthNumber": 12,
  "dayNumber": 26,
  "title": "SYAHIDNYA UMAR BIN KHATTAB",
  "description": "Khalifah kedua, Al-Faruq Umar bin Khattab, ditikam oleh Abu Lu'luah (seorang Majusi) saat sedang memimpin shalat Subuh berjamaah. Beliau adalah pemimpin paling tegas yang ditakuti iblis, penakluk dua adidaya (Persia & Romawi).",
  "quranicReference": {
    "surah": "Al-Anbiya",
    "ayah": "105",
    "text": "وَلَقَدْ كَتَبْنَا فِي الزَّبُورِ مِن بَعْدِ الذِّكْرِ أَنَّ الْأَرْضَ يَرِثُهَا عِبَادِيَ الصَّالِحُونَ",
    "translation": "Dan sungguh telah Kami tulis di dalam Zabur sesudah (Kami tulis dalam) Lauh Mahfuzh, bahwasanya bumi ini dipusakai hamba-hamba-Ku yang saleh."
  }
},
  {
  "id": "perang-mutah",
  "monthNumber": 5,
  "dayNumber": 1,
  "title": "PERANG MU'TAH (MELAWAN ROMAWI)",
  "description": "Bentrokan pertama dengan Kekaisaran Romawi Timur. Tiga panglima gugur syahid berturut-turut (Zaid bin Haritsah, Ja'far bin Abi Thalib, Abdullah bin Rawahah) sebelum Khalid bin Walid mengambil alih komando dan berhasil menyelamatkan pasukan.",
  "quranicReference": {
    "surah": "Al-Ahzab",
    "ayah": "23",
    "text": "مِّنَ الْمُؤْمِنِينَ رِجَالٌ صَدَقُوا مَا عَاهَدُوا اللَّهَ عَلَيْهِ ۖ فَمِنْهُم مَّن قَضَىٰ نَحْبَهُ وَمِنْهُم مَّن يَنتَظِرُ",
    "translation": "Di antara orang-orang mukmin itu ada orang-orang yang menepati apa yang telah mereka janjikan kepada Allah; maka di antara mereka ada yang gugur. Dan di antara mereka ada (pula) yang menunggu-nunggu."
  }
},
  {
  "id": "perang-hunain",
  "monthNumber": 10,
  "dayNumber": 10,
  "title": "PERANG HUNAIN",
  "description": "Pasukan Muslim yang berjumlah besar sempat kocar-kacir akibat kesombongan (merasa pasti menang karena jumlah). Terjebak dalam penyergapan suku Hawazin, sebelum akhirnya Rasulullah memanggil mereka kembali dan meraih kemenangan.",
  "quranicReference": {
    "surah": "At-Taubah",
    "ayah": "25",
    "text": "لَقَدْ نَصَرَكُمُ اللَّهُ فِي مَوَاطِنَ كَثِيرَةٍ ۙ وَيَوْمَ حُنَيْنٍ ۙ إِذْ أَعْجَبَتْكُمْ كَثْرَتُكُمْ فَلَمْ تُغْنِ عَنكُمْ شَيْئًا",
    "translation": "Sesungguhnya Allah telah menolong kamu (hai para mukminin) di medan peperangan yang banyak, dan (ingatlah) peperangan Hunain, yaitu diwaktu kamu menjadi congkak karena banyaknya jumlah(mu), maka jumlah yang banyak itu tidak memberi manfaat kepadamu sedikitpun..."
  }
}
  ,{
  "id": "wafat-utsman",
  "monthNumber": 12,
  "dayNumber": 18,
  "title": "SYAHIDNYA KHALIFAH UTSMAN BIN AFFAN",
  "description": "Khalifah ketiga, Utsman bin Affan (Dzunnurain - Pemilik Dua Cahaya), gugur syahid dibunuh oleh pemberontak saat beliau sedang membaca Al-Qur'an di rumahnya. Darah beliau menetes tepat di atas ayat 'Maka Allah akan memelihara kamu dari mereka'.",
  "quranicReference": {
    "surah": "Al-Baqarah",
    "ayah": "137",
    "text": "فَسَيَكْفِيكَهُمُ اللَّهُ ۚ وَهُوَ السَّمِيعُ الْعَلِيمُ",
    "translation": "Maka Allah akan memelihara kamu dari mereka. Dan Dialah Yang Maha Mendengar lagi Maha Mengetahui."
  }
},
  {
  "id": "perang-khaibar",
  "monthNumber": 1,
  "dayNumber": 15,
  "title": "PERANG KHAIBAR",
  "description": "Penaklukan benteng terkuat Yahudi di Semenanjung Arab (Khaibar) oleh pasukan Muslim. Ali bin Abi Thalib mendobrak pintu benteng raksasa Kamus seorang diri setelah pahlawan-pahlawan lain gagal menembusnya.",
  "quranicReference": {
    "surah": "Al-Fath",
    "ayah": "20",
    "text": "وَعَدَكُمُ اللَّهُ مَغَانِمَ كَثِيرَةً تَأْخُذُونَهَا فَعَجَّلَ لَكُمْ هَٰذِهِ وَكَفَّ أَيْدِيَ النَّاسِ عَنكُمْ",
    "translation": "Allah menjanjikan kepadamu harta rampasan yang banyak yang dapat kamu ambil, maka disegerakan-Nya harta rampasan ini untukmu dan Dia menahan tangan manusia dari (membinasakan)mu."
  }
},
  {
  "id": "baiat-aqabah",
  "monthNumber": 12,
  "dayNumber": 12,
  "title": "BAIAT AQABAH KEDUA (SUMPAH SETIA YATSRIB)",
  "description": "73 pria dan 2 wanita dari Yatsrib (Madinah) bersumpah setia secara rahasia di bukit Aqabah untuk melindungi Nabi Muhammad SAW dengan harta dan nyawa mereka, membuka jalan bagi peristiwa Hijrah raksasa ke Madinah.",
  "quranicReference": {
    "surah": "Al-Fath",
    "ayah": "18",
    "text": "لَّقَدْ رَضِيَ اللَّهُ عَنِ الْمُؤْمِنِينَ إِذْ يُبَايِعُونَكَ تَحْتَ الشَّجَرَةِ فَعَلِمَ مَا فِي قُلُوبِهِمْ فَأَنزَلَ السَّكِينَةَ عَلَيْهِمْ وَأَثَابَهُمْ فَتْحًا قَرِيبًا",
    "translation": "Sesungguhnya Allah telah ridha terhadap orang-orang mukmin ketika mereka berjanji setia kepadamu di bawah pohon, maka Allah mengetahui apa yang ada dalam hati mereka lalu menurunkan ketenangan atas mereka dan memberi balasan kepada mereka dengan kemenangan yang dekat."
  }
},
  {
  "id": "perang-yarmuk",
  "monthNumber": 7,
  "dayNumber": 5,
  "title": "PERANG YARMUK (PENGHANCURAN ROMAWI)",
  "description": "Pertempuran paling menentukan di Timur Tengah. 40.000 pasukan Muslim pimpinan Khalid bin Walid secara heroik menghancurkan lebih dari 100.000 pasukan Kekaisaran Bizantium (Romawi), mengakhiri kekuasaan Romawi di wilayah Syam selamanya.",
  "quranicReference": {
    "surah": "Muhammad",
    "ayah": "7",
    "text": "يَا أَيُّهَا الَّذِينَ آمَنُوا إِن تَنصُرُوا اللَّهَ يَنصُرْكُمْ وَيُثَبِّتْ أَقْدَامَكُمْ",
    "translation": "Hai orang-orang mukmin, jika kamu menolong (agama) Allah, niscaya Dia akan menolongmu dan meneguhkan kedudukanmu."
  }
},
  {
  "id": "perang-qadisiyyah",
  "monthNumber": 1,
  "dayNumber": 13,
  "title": "PERANG AL-QADISIYYAH (RUNTUHNYA PERSIA SASSANID)",
  "description": "Kemenangan absolut pasukan Muslim pimpinan Sa'ad bin Abi Waqqas atas Kekaisaran Persia Sassanid yang membawa pasukan gajah. Pertempuran 4 hari ini meruntuhkan imperium Persia yang telah berkuasa ribuan tahun.",
  "quranicReference": {
    "surah": "Ar-Rum",
    "ayah": "4-5",
    "text": "لِّلَّهِ الْأَمْرُ مِن قَبْلُ وَمِن بَعْدُ ۚ وَيَوْمَئِذٍ يَفْرَحُ الْمُؤْمِنُونَ ۝ بِنَصْرِ اللَّهِ ۚ يَنصُرُ مَن يَشَاءُ ۖ وَهُوَ الْعَزِيزُ الرَّحِيمُ",
    "translation": "Bagi Allah-lah urusan sebelum dan sesudah (mereka menang). Dan di hari (kemenangan bangsa Romawi) itu bergembiralah orang-orang yang beriman, karena pertolongan Allah. Dia menolong siapa yang dikehendaki-Nya."
  }
},
  {
  "id": "penaklukan-mesir",
  "monthNumber": 1,
  "dayNumber": 20,
  "title": "PENAKLUKAN MESIR OLEH AMR BIN ASH",
  "description": "Panglima Amr bin Ash berhasil membebaskan Mesir dari penindasan Romawi Bizantium, dan membangun kota Fustat (Kairo modern). Penduduk Koptik Mesir menyambut umat Islam sebagai pembebas.",
  "quranicReference": {
    "surah": "Yusuf",
    "ayah": "21",
    "text": "وَكَذَٰلِكَ مَكَّنَّا لِيُوسُفَ فِي الْأَرْضِ وَلِنُعَلِّمَهُ مِن تَأْوِيلِ الْأَحَادِيثِ ۚ وَاللَّهُ غَالِبٌ عَلَىٰ أَمْرِهِ",
    "translation": "Dan demikianlah Kami memberikan kedudukan yang baik kepada Yusuf di muka bumi (Mesir)... Dan Allah berkuasa terhadap urusan-Nya, tetapi kebanyakan manusia tiada mengetahuinya."
  }
},
  {
  "id": "perang-hittin",
  "monthNumber": 4,
  "dayNumber": 25,
  "title": "PERANG HITTIN (TITIK BALIK PERANG SALIB)",
  "description": "Pasukan Salahuddin Al-Ayyubi menjebak pasukan Salib di sebuah bukit tanpa air. Kekalahan total Pasukan Salib di Hittin ini menjadi pembuka jalan untuk pembebasan kembali kota suci Yerusalem (Al-Aqsa).",
  "quranicReference": {
    "surah": "Al-Ma'idah",
    "ayah": "21",
    "text": "يَا قَوْمِ ادْخُلُوا الْأَرْضَ الْمُقَدَّسَةَ الَّتِي كَتَبَ اللَّهُ لَكُمْ وَلَا تَرْتَدُّوا عَلَىٰ أَدْبَارِكُمْ فَتَنقَلِبُوا خَاسِرِينَ",
    "translation": "Hai kaumku, masuklah ke tanah suci (Palestina) yang telah ditentukan Allah bagimu, dan janganlah kamu lari ke belakang (karena takut kepada musuh), maka kamu menjadi orang-orang yang merugi."
  }
},
  {
  "id": "runtuhnya-baghdad",
  "monthNumber": 2,
  "dayNumber": 4,
  "title": "RUNTUHNYA BAGHDAD (TRAGEDI MONGOL)",
  "description": "Kejatuhan tragis pusat peradaban dunia, Baghdad, ke tangan invasi biadab bangsa Mongol pimpinan Hulagu Khan. Jutaan umat Islam dibantai, dan perpustakaan terbesar dunia (Baitul Hikmah) dibuang ke Sungai Tigris hingga airnya menghitam oleh tinta.",
  "quranicReference": {
    "surah": "Al-Baqarah",
    "ayah": "155-156",
    "text": "وَلَنَبْلُوَنَّكُم بِشَيْءٍ مِّنَ الْخَوْفِ وَالْجُوعِ وَنَقْصٍ مِّنَ الْأَمْوَالِ وَالْأَنفُسِ وَالثَّمَرَاتِ ۗ وَبَشِّرِ الصَّابِرِينَ ۝ الَّذِينَ إِذَا أَصَابَتْهُم مُّصِيبَةٌ قَالُوا إِنَّا لِلَّهِ وَإِنَّا إِلَيْهِ رَاجِعُونَ",
    "translation": "Dan sungguh akan Kami berikan cobaan kepadamu, dengan sedikit ketakutan, kelaparan, kekurangan harta, jiwa dan buah-buahan. Dan berikanlah berita gembira kepada orang-orang yang sabar. (yaitu) orang-orang yang apabila ditimpa musibah, mereka mengucapkan: Inna lillaahi wa innaa ilaihi raaji'uun."
  }
},
  {
  "id": "masjid-quba",
  "monthNumber": 3,
  "dayNumber": 8,
  "title": "PEMBANGUNAN MASJID PERTAMA (QUBA)",
  "description": "Dalam perjalanan Hijrah sebelum tiba di pusat Madinah, Rasulullah SAW singgah di Quba dan mendirikan masjid pertama dalam sejarah Islam yang didirikan atas dasar takwa sejak hari pertama.",
  "quranicReference": {
    "surah": "At-Taubah",
    "ayah": "108",
    "text": "لَّمَسْجِدٌ أُسِّسَ عَلَى التَّقْوَىٰ مِنْ أَوَّلِ يَوْمٍ أَحَقُّ أَن تَقُومَ فِيهِ ۚ فِيهِ رِجَالٌ يُحِبُّونَ أَن يَتَطَهَّرُوا ۚ وَاللَّهُ يُحِبُّ الْمُطَّهِّرِينَ",
    "translation": "Sesungguhnya masjid yang didirikan atas dasar takwa (masjid Quba), sejak hari pertama adalah lebih patut kamu sholat di dalamnya. Di dalamnya masjid itu ada orang-orang yang ingin membersihkan diri. Dan sesungguhnya Allah menyukai orang-orang yang bersih."
  }
}
  ,{
  "id": "perang-siffin",
  "monthNumber": 2,
  "dayNumber": 1,
  "title": "PERANG SIFFIN (FITNAH KUBRA)",
  "description": "Perang saudara paling memilukan antara pasukan Khalifah Ali bin Abi Thalib dan Gubernur Syam, Mu'awiyah. Tragedi ini mengajarkan betapa berbahayanya fitnah internal dan politisasi agama, memecah umat Islam menjadi Sunni, Syiah, dan Khawarij.",
  "quranicReference": {
    "surah": "Al-Hujurat",
    "ayah": "9",
    "text": "وَإِن طَائِفَتَانِ مِنَ الْمُؤْمِنِينَ اقْتَتَلُوا فَأَصْلِحُوا بَيْنَهُمَا",
    "translation": "Dan jika ada dua golongan dari orang-orang mukmin berperang maka damaikanlah antara keduanya."
  }
},
  {
  "id": "jatuhnya-granada",
  "monthNumber": 3,
  "dayNumber": 2,
  "title": "JATUHNYA GRANADA (RUNTUHNYA AL-ANDALUS)",
  "description": "Setelah 800 tahun memancarkan cahaya peradaban, ilmu, dan toleransi di daratan Eropa (Spanyol), benteng terakhir Islam, Granada, jatuh ke tangan monarki Katolik akibat perpecahan internal, kelemahan pemimpin, dan intrik kekuasaan.",
  "quranicReference": {
    "surah": "Al-Anfal",
    "ayah": "46",
    "text": "وَأَطِيعُوا اللَّهَ وَرَسُولَهُ وَلَا تَنَازَعُوا فَتَفْشَلُوا وَتَذْهَبَ رِيحُكُمْ ۖ وَاصْبِرُوا ۚ إِنَّ اللَّهَ مَعَ الصَّابِرِينَ",
    "translation": "Dan taatlah kepada Allah dan Rasul-Nya dan janganlah kamu berbantah-bantahan, yang menyebabkan kamu menjadi gentar dan hilang kekuatanmu dan bersabarlah. Sesungguhnya Allah beserta orang-orang yang sabar."
  }
},
  {
  "id": "mihna-ahmad",
  "monthNumber": 9,
  "dayNumber": 1,
  "title": "AL-MIHNA (INKUISISI IMAM AHMAD BIN HANBAL)",
  "description": "Fase gelap kebebasan berpendapat. Khalifah Al-Ma'mun memaksakan doktrin Mu'tazilah bahwa 'Al-Qur'an adalah makhluk'. Imam Ahmad disiksa dengan kejam karena menolak tunduk, mempertahankan akidah kemurnian Firman Allah.",
  "quranicReference": {
    "surah": "Al-Buruj",
    "ayah": "8",
    "text": "وَمَا نَقَمُوا مِنْهُمْ إِلَّا أَن يُؤْمِنُوا بِاللَّهِ الْعَزِيزِ الْحَمِيدِ",
    "translation": "Dan mereka tidak menyiksa orang-orang mukmin itu melainkan karena orang-orang mukmin itu beriman kepada Allah Yang Maha Perkasa lagi Maha Terpuji."
  }
},
  {
  "id": "pencurian-hajar-aswad",
  "monthNumber": 12,
  "dayNumber": 8,
  "title": "PENCURIAN HAJAR ASWAD OLEH QARAMITAH",
  "description": "Sekte ekstrem Qaramitah menyerang Mekah di musim Haji, membantai puluhan ribu jamaah, mencampakkan jasad mereka ke sumur Zamzam, dan mencuri Hajar Aswad. Batu hitam itu disandera selama 22 tahun sebelum dikembalikan.",
  "quranicReference": {
    "surah": "Al-Fil",
    "ayah": "1-2",
    "text": "أَلَمْ تَرَ كَيْفَ فَعَلَ رَبُّكَ بِأَصْحَابِ الْفِيلِ ۝ أَلَمْ يَجْعَلْ كَيْدَهُمْ فِي تَضْلِيلٍ",
    "translation": "Apakah kamu tidak memperhatikan bagaimana Tuhanmu telah bertindak terhadap tentara bergajah? Bukankah Dia telah menjadikan tipu daya mereka (untuk menghancurkan Ka'bah) itu sia-sia?"
  }
},
  {
  "id": "wafat-ghazali",
  "monthNumber": 6,
  "dayNumber": 14,
  "title": "WAFATNYA SANG HUJJATUL ISLAM (AL-GHAZALI)",
  "description": "Imam Abu Hamid Al-Ghazali, sang jenius yang berhasil merekonsiliasi filsafat, fikih, dan tasawuf melalui 'Ihya Ulumuddin', menghembuskan napas terakhirnya. Beliau adalah titik temu akal dan mata hati dalam tradisi intelektual Islam.",
  "quranicReference": {
    "surah": "Al-Mujadila",
    "ayah": "11",
    "text": "يَرْفَعِ اللَّهُ الَّذِينَ آمَنُوا مِنكُمْ وَالَّذِينَ أُوتُوا الْعِلْمَ دَرَجَاتٍ ۚ وَاللَّهُ بِمَا تَعْمَلُونَ خَبِيرٌ",
    "translation": "Niscaya Allah akan meninggikan orang-orang yang beriman di antaramu dan orang-orang yang diberi ilmu pengetahuan beberapa derajat."
  }
},
  {
  "id": "wafat-syafii",
  "monthNumber": 7,
  "dayNumber": 30,
  "title": "WAFATNYA SANG ARSITEK FIKIH (IMAM ASY-SYAFI'I)",
  "description": "Wafatnya Muhammad bin Idris Asy-Syafi'i. Beliau adalah orang pertama yang membakukan metodologi hukum Islam (Ushul Fiqh) melalui kitab 'Ar-Risalah', menyelamatkan umat dari perdebatan rasionalis vs tradisionalis.",
  "quranicReference": {
    "surah": "An-Nahl",
    "ayah": "43",
    "text": "فَاسْأَلُوا أَهْلَ الذِّكْرِ إِن كُنتُمْ لَا تَعْلَمُونَ",
    "translation": "Maka bertanyalah kepada orang yang mempunyai pengetahuan jika kamu tidak mengetahui."
  }
},
  {
  "id": "revolusi-abbasiyah",
  "monthNumber": 6,
  "dayNumber": 11,
  "title": "REVOLUSI ABBASIYAH (RUNTUHNYA UMAYYAH)",
  "description": "Pertempuran Zab Raya menandai berakhirnya dominasi aristokrasi Arab Bani Umayyah. Berdirinya Kekhalifahan Abbasiyah mengubah wajah Islam menjadi peradaban metropolitan dan kosmopolitan yang merangkul Persia dan Asia.",
  "quranicReference": {
    "surah": "Al-Qasas",
    "ayah": "5",
    "text": "وَنُرِيدُ أَن نَّمُنَّ عَلَى الَّذِينَ اسْتُضْعِفُوا فِي الْأَرْضِ وَنَجْعَلَهُمْ أَئِمَّةً وَنَجْعَلَهُمُ الْوَارِثِينَ",
    "translation": "Dan Kami hendak memberi karunia kepada orang-orang yang tertindas di bumi itu dan hendak menjadikan mereka pemimpin dan menjadikan mereka orang-orang yang mewarisi (bumi)."
  }
},
  {
  "id": "eksekusi-al-hallaj",
  "monthNumber": 11,
  "dayNumber": 24,
  "title": "EKSEKUSI AL-HALLAJ (BENTURAN SYARIAT & HAKIKAT)",
  "description": "Sufi mistik Al-Hallaj dieksekusi brutal oleh otoritas Abbasiyah atas tuduhan murtad karena ucapan 'Ana Al-Haqq' (Akulah Kebenaran). Peristiwa ini adalah monumen abadi benturan antara hukum fikih eksoterik dengan tasawuf esoterik yang belum matang pada masanya.",
  "quranicReference": {
    "surah": "Taha",
    "ayah": "114",
    "text": "فَتَعَالَى اللَّهُ الْمَلِكُ الْحَقُّ ۗ وَلَا تَعْجَلْ بِالْقُرْآنِ مِن قَبْلِ أَن يُقْضَىٰ إِلَيْكَ وَحْيُهُ ۖ وَقُل رَّبِّ زِدْنِي عِلْمًا",
    "translation": "Maka Maha Tinggi Allah Raja Yang Sebenar-benarnya (Al-Haqq), dan janganlah kamu tergesa-gesa membaca Al-Quran sebelum disempurnakan mewahyukannya kepadamu, dan katakanlah: 'Ya Tuhanku, tambahkanlah kepadaku ilmu pengetahuan'."
  }
},
  {
  "id": "perang-yamamah",
  "monthNumber": 4,
  "dayNumber": 1,
  "title": "PERANG YAMAMAH & PENGUMPULAN AL-QUR'AN",
  "description": "Bentrokan berdarah melawan nabi palsu Musailamah Al-Kazzab. 70 penghafal Al-Qur'an (Huffaz) dari kalangan sahabat gugur. Tragedi ini memicu kepanikan Umar bin Khattab dan berujung pada proyek raksasa kodifikasi Al-Qur'an menjadi satu Mushaf.",
  "quranicReference": {
    "surah": "Al-Hijr",
    "ayah": "9",
    "text": "إِنَّا نَحْنُ نَزَّلْنَا الذِّكْرَ وَإِنَّا لَهُ لَحَافِظُونَ",
    "translation": "Sesungguhnya Kami-lah yang menurunkan Al Quran, dan sesungguhnya Kami benar-benar memeliharanya."
  }
},
  {
  "id": "perang-jamal",
  "monthNumber": 6,
  "dayNumber": 15,
  "title": "PERANG JAMAL (TRAGEDI UNTA)",
  "description": "Perang saudara pertama dalam Islam akibat intrik kaum munafik. Pasukan Khalifah Ali berhadapan dengan sayap Aisyah (Istri Nabi). Mengajarkan kedewasaan bahwa konflik politik dapat terjadi bahkan di antara para Sahabat yang dijamin masuk surga.",
  "quranicReference": {
    "surah": "Al-Ahzab",
    "ayah": "33",
    "text": "وَقَرْنَ فِي بُيُوتِكُنَّ وَلَا تَبَرَّجْنَ تَبَرُّجَ الْجَاهِلِيَّةِ الْأُولَىٰ",
    "translation": "Dan hendaklah kamu (istri-istri Nabi) tetap di rumahmu dan janganlah kamu berhias dan bertingkah laku seperti orang-orang Jahiliyah yang dahulu..."
  }
}
  ,{
  "id": "penaklukan-yerusalem-umar",
  "monthNumber": 3,
  "dayNumber": 15,
  "title": "PENYERAHAN KUNCI BAITUL MAQDIS KEPADA UMAR",
  "description": "Patriark Sophronius dari Yerusalem menolak menyerahkan kunci kota kepada siapapun kecuali langsung kepada Khalifah Umar bin Khattab. Umar datang hanya dengan satu unta bergantian dengan pembantunya, menandatangani 'Perjanjian Umar' yang menjamin kebebasan beragama bagi umat Kristen.",
  "quranicReference": {
    "surah": "Al-Ma'idah",
    "ayah": "8",
    "text": "وَلَا يَجْرِمَنَّكُمْ شَنَآنُ قَوْمٍ عَلَىٰ أَلَّا تَعْدِلُوا ۚ اعْدِلُوا هُوَ أَقْرَبُ لِلتَّقْوَىٰ",
    "translation": "Dan janganlah sekali-kali kebencianmu terhadap sesuatu kaum, mendorong kamu untuk berlaku tidak adil. Berlaku adillah, karena adil itu lebih dekat kepada takwa."
  }
},
  {
  "id": "berdirinya-qarawiyyin",
  "monthNumber": 9,
  "dayNumber": 1,
  "title": "BERDIRINYA UNIVERSITAS TERTUA (AL-QARAWIYYIN)",
  "description": "Seorang wanita Muslimah visioner, Fatima al-Fihri, mewakafkan seluruh hartanya untuk membangun Masjid Al-Qarawiyyin di Fez, Maroko. Tempat ini berevolusi menjadi universitas pemberi gelar pertama dan tertua di dunia yang masih beroperasi hingga kini.",
  "quranicReference": {
    "surah": "Al-Mujadila",
    "ayah": "11",
    "text": "يَرْفَعِ اللَّهُ الَّذِينَ آمَنُوا مِنكُمْ وَالَّذِينَ أُوتُوا الْعِلْمَ دَرَجَاتٍ",
    "translation": "Niscaya Allah akan meninggikan orang-orang yang beriman di antaramu dan orang-orang yang diberi ilmu pengetahuan beberapa derajat."
  }
},
  {
  "id": "pembukaan-al-azhar",
  "monthNumber": 9,
  "dayNumber": 7,
  "title": "PEMBUKAAN UNIVERSITAS AL-AZHAR",
  "description": "Masjid Al-Azhar di Kairo mengadakan shalat Jumat pertamanya. Dibangun oleh Kekhalifahan Fatimiyah, tempat ini kemudian diubah menjadi pusat keilmuan Sunni terbesar di dunia oleh Salahuddin Al-Ayyubi, dan bertahan selama lebih dari 1000 tahun.",
  "quranicReference": {
    "surah": "At-Taubah",
    "ayah": "122",
    "text": "فَلَوْلَا نَفَرَ مِن كُلِّ فِرْقَةٍ مِّنْهُمْ طَائِفَةٌ لِّيَتَفَقَّهُوا فِي الدِّينِ",
    "translation": "Mengapa tidak pergi dari tiap-tiap golongan di antara mereka beberapa orang untuk memperdalam pengetahuan mereka tentang agama..."
  }
},
  {
  "id": "wadi-lakka",
  "monthNumber": 9,
  "dayNumber": 28,
  "title": "KEMENANGAN WADI LAKKA (GUADALETE)",
  "description": "Pasukan Tariq bin Ziyad berhasil menghancurkan pasukan raksasa Raja Roderic dari Visigoth. Momen ini adalah paku pertama yang menancapkan kekuasaan Islam di Semenanjung Iberia (Spanyol dan Portugal) yang akan memancarkan ilmu pengetahuan ke Eropa yang sedang dilanda Abad Kegelapan.",
  "quranicReference": {
    "surah": "Al-Anbiya",
    "ayah": "105",
    "text": "وَلَقَدْ كَتَبْنَا فِي الزَّبُورِ مِن بَعْدِ الذِّكْرِ أَنَّ الْأَرْضَ يَرِثُهَا عِبَادِيَ الصَّالِحُونَ",
    "translation": "Dan sungguh telah Kami tulis di dalam Zabur sesudah (Kami tulis dalam) Lauh Mahfuzh, bahwasanya bumi ini dipusakai hamba-hamba-Ku yang saleh."
  }
},
  {
  "id": "perang-manzikert",
  "monthNumber": 11,
  "dayNumber": 20,
  "title": "PERANG MANZIKERT (PEMBUKA GERBANG ANATOLIA)",
  "description": "Sultan Alp Arslan dari Dinasti Seljuk dengan pasukan kecil secara brilian menghancurkan pasukan elit Kekaisaran Bizantium dan menawan Kaisar Romanos IV. Kemenangan ini membuka seluruh dataran Anatolia (kini Turki) untuk peradaban Islam.",
  "quranicReference": {
    "surah": "Al-Baqarah",
    "ayah": "251",
    "text": "فَهَزَمُوهُم بِإِذْنِ اللَّهِ وَقَتَلَ دَاوُودُ جَالُوتَ وَآتَاهُ اللَّهُ الْمُلْكَ وَالْحِكْمَةَ",
    "translation": "Mereka (tentara Thalut) mengalahkan tentara Jalut dengan izin Allah dan (dalam peperangan itu) Daud membunuh Jalut, kemudian Allah memberikan kepadanya pemerintahan dan hikmah."
  }
},
  {
  "id": "balat-syuhada",
  "monthNumber": 9,
  "dayNumber": 2,
  "title": "BALAT ASY-SYUHADA (PERTEMPURAN TOURS)",
  "description": "Pasukan Islam pimpinan Abdurrahman Al-Ghafiqi dihentikan oleh Charles Martel di Prancis. Pertempuran berdarah ini menandai batas terjauh ekspansi militer Islam di Eropa Barat. Al-Ghafiqi gugur sebagai syahid bersama ribuan pasukannya.",
  "quranicReference": {
    "surah": "Ali 'Imran",
    "ayah": "140",
    "text": "إِن يَمْسَسْكُمْ قَرْحٌ فَقَدْ مَسَّ الْقَوْمَ قَرْحٌ مِّثْلُهُ ۚ وَتِلْكَ الْأَيَّامُ نُدَاوِلُهَا بَيْنَ النَّاسِ",
    "translation": "Jika kamu (pada perang Uhud) mendapat luka, maka sesungguhnya kaum (kafir) itupun (pada perang Badar) mendapat luka yang serupa. Dan masa (kejayaan dan kehancuran) itu Kami pergilirkan di antara manusia."
  }
},
  {
  "id": "jatuhnya-yerusalem-salib",
  "monthNumber": 8,
  "dayNumber": 22,
  "title": "JATUHNYA YERUSALEM (PERANG SALIB I)",
  "description": "Tragedi kemanusiaan terburuk Abad Pertengahan. Pasukan Salib berhasil menembus tembok Yerusalem dan membantai 70.000 penduduk Muslim dan Yahudi di dalam Masjid Al-Aqsa, hingga darah menggenang setinggi mata kaki kuda.",
  "quranicReference": {
    "surah": "Al-Baqarah",
    "ayah": "214",
    "text": "أَمْ حَسِبْتُمْ أَن تَدْخُلُوا الْجَنَّةَ وَلَمَّا يَأْتِكُم مَّثَلُ الَّذِينَ خَلَوْا مِن قَبْلِكُم ۖ مَّسَّتْهُمُ الْبَأْسَاءُ وَالضَّرَّاءُ وَزُلْزِلُوا",
    "translation": "Apakah kamu mengira bahwa kamu akan masuk surga, padahal belum datang kepadamu (cobaan) sebagaimana halnya orang-orang terdahulu sebelum kamu? Mereka ditimpa oleh malapetaka dan kesengsaraan, serta digoncangkan (dengan bermacam-macam cobaan)."
  }
},
  {
  "id": "wafat-salahuddin",
  "monthNumber": 2,
  "dayNumber": 27,
  "title": "WAFATNYA SANG PEMBEBAS (SALAHUDDIN AL-AYYUBI)",
  "description": "Sultan Salahuddin Al-Ayyubi, pembebas Yerusalem dan pahlawan terbesar Perang Salib, wafat. Ia sangat dermawan hingga saat wafatnya, kas negaranya tidak cukup untuk biaya pemakamannya sendiri karena seluruh hartanya telah disedekahkan.",
  "quranicReference": {
    "surah": "At-Taubah",
    "ayah": "111",
    "text": "إِنَّ اللَّهَ اشْتَرَىٰ مِنَ الْمُؤْمِنِينَ أَنفُسَهُمْ وَأَمْوَالَهُم بِأَنَّ لَهُمُ الْجَنَّةَ ۚ يُقَاتِلُونَ فِي سَبِيلِ اللَّهِ",
    "translation": "Sesungguhnya Allah telah membeli dari orang-orang mukmin diri dan harta mereka dengan memberikan surga untuk mereka. Mereka berperang pada jalan Allah."
  }
},
  {
  "id": "lahir-ibnu-sina",
  "monthNumber": 2,
  "dayNumber": 1,
  "title": "LAHIRNYA BAPAK KEDOKTERAN MODERN (IBNU SINA)",
  "description": "Lahirnya Ibnu Sina (Avicenna) di Bukhara. Karya monumentalnya 'Qanun fi at-Tibb' (The Canon of Medicine) menjadi buku teks standar kedokteran di universitas-universitas Eropa selama lebih dari 600 tahun.",
  "quranicReference": {
    "surah": "Yunus",
    "ayah": "57",
    "text": "يَا أَيُّهَا النَّاسُ قَدْ جَاءَتْكُم مَّوْعِظَةٌ مِّن رَّبِّكُمْ وَشِفَاءٌ لِّمَا فِي الصُّدُورِ وَهُدًى وَرَحْمَةٌ لِّلْمُؤْمِنِينَ",
    "translation": "Hai manusia, sesungguhnya telah datang kepadamu pelajaran dari Tuhanmu dan penyembuh bagi penyakit-penyakit (yang berada) dalam dada dan petunjuk serta rahmat bagi orang-orang yang beriman."
  }
},
  {
  "id": "lahir-ibnu-khaldun",
  "monthNumber": 9,
  "dayNumber": 1,
  "title": "LAHIRNYA BAPAK SOSIOLOGI (IBNU KHALDUN)",
  "description": "Lahirnya Ibnu Khaldun di Tunis. Melalui magnum opusnya 'Muqaddimah', ia merumuskan teori-teori pertama tentang sosiologi, ekonomi, demografi, dan siklus jatuh-bangunnya sebuah peradaban (Asabiyyah).",
  "quranicReference": {
    "surah": "Ar-Rum",
    "ayah": "9",
    "text": "أَوَلَمْ يَسِيرُوا فِي الْأَرْضِ فَيَنظُرُوا كَيْفَ كَانَ عَاقِبَةُ الَّذِينَ مِن قَبْلِهِمْ ۚ كَانُوا أَشَدَّ مِنْهُمْ قُوَّةً وَأَثَارُوا الْأَرْضَ وَعَمَرُوهَا أَكْثَرَ مِمَّا عَمَرُوهَا",
    "translation": "Dan apakah mereka tidak mengadakan perjalanan di muka bumi dan memperhatikan bagaimana akibat (yang diderita) oleh orang-orang sebelum mereka? orang-orang itu adalah lebih kuat dari mereka (sendiri) dan telah mengolah bumi (tanah) serta memakmurkannya lebih banyak dari apa yang telah mereka makmurkan."
  }
},
  {
  "id": "wafat-abu-hanifah",
  "monthNumber": 7,
  "dayNumber": 15,
  "title": "WAFATNYA IMAM ABU HANIFAH",
  "description": "Wafatnya Nu'man bin Tsabit (Imam Abu Hanifah), pendiri mazhab Hanafi. Beliau wafat di dalam penjara karena menolak diangkat menjadi hakim agung (Qadhi) oleh Khalifah Al-Mansur, sebagai bentuk independensi ulama dari kekuasaan tiran.",
  "quranicReference": {
    "surah": "Al-Baqarah",
    "ayah": "42",
    "text": "وَلَا تَلْبِسُوا الْحَقَّ بِالْبَاطِلِ وَتَكْتُمُوا الْحَقَّ وَأَنتُمْ تَعْلَمُونَ",
    "translation": "Dan janganlah kamu campur adukkan yang hak dengan yang bathil dan janganlah kamu sembunyikan yang hak itu, sedang kamu mengetahui."
  }
},
  {
  "id": "wafat-imam-malik",
  "monthNumber": 3,
  "dayNumber": 14,
  "title": "WAFATNYA IMAM DARUL HIJRAH (IMAM MALIK)",
  "description": "Wafatnya Malik bin Anas, pendiri mazhab Maliki dan penulis kitab hadits tertua 'Al-Muwatta'. Beliau mendedikasikan seluruh hidupnya di Madinah dan tidak pernah mau menunggang kuda di kota itu demi menghormati jasad Rasulullah yang terkubur di bawahnya.",
  "quranicReference": {
    "surah": "Al-Ahzab",
    "ayah": "56",
    "text": "إِنَّ اللَّهَ وَمَلَائِكَتَهُ يُصَلُّونَ عَلَى النَّبِيِّ ۚ يَا أَيُّهَا الَّذِينَ آمَنُوا صَلُّوا عَلَيْهِ وَسَلِّمُوا تَسْلِيمًا",
    "translation": "Sesungguhnya Allah dan malaikat-malaikat-Nya bershalawat untuk Nabi. Hai orang-orang yang beriman, bershalawatlah kamu untuk Nabi dan ucapkanlah salam penghormatan kepadanya."
  }
},
  {
  "id": "runtuhnya-cordoba",
  "monthNumber": 12,
  "dayNumber": 30,
  "title": "RUNTUHNYA KEKHALIFAHAN CORDOBA",
  "description": "Kekhalifahan Umayyah di Cordoba (Andalusia) secara resmi dihapuskan dan terpecah belah menjadi puluhan kerajaan kecil (Taifa) yang saling berperang satu sama lain. Titik awal kejatuhan total Islam di Spanyol.",
  "quranicReference": {
    "surah": "Al-Hashr",
    "ayah": "14",
    "text": "تَحْسَبُهُمْ جَمِيعًا وَقُلُوبُهُمْ شَتَّىٰ ۚ ذَٰلِكَ بِأَنَّهُمْ قَوْمٌ لَّا يَعْقِلُونَ",
    "translation": "...Kamu kira mereka itu bersatu, sedang hati mereka berpecah belah. Yang demikian itu karena sesungguhnya mereka adalah kaum yang tidak mengerti."
  }
},
  {
  "id": "pengepungan-wina",
  "monthNumber": 1,
  "dayNumber": 10,
  "title": "PENGEPUNGAN WINA OLEH SULEIMAN AL-QANUNI",
  "description": "Puncak kekuatan militer Kesultanan Utsmaniyah. Pasukan Suleiman the Magnificent mengepung Wina (Austria), jantung Eropa. Meskipun gagal direbut akibat badai salju dan wabah, peristiwa ini membuat seluruh Eropa Barat gemetar ketakutan selama berabad-abad.",
  "quranicReference": {
    "surah": "Al-Fath",
    "ayah": "1-2",
    "text": "إِنَّا فَتَحْنَا لَكَ فَتْحًا مُّبِينًا",
    "translation": "Sesungguhnya Kami telah memberikan kepadamu kemenangan yang nyata."
  }
},
  {
  "id": "wafat-rabiatul-adawiyah",
  "monthNumber": 8,
  "dayNumber": 10,
  "title": "WAFATNYA IBU PARA SUFI (RABI'AH AL-ADAWIYAH)",
  "description": "Wafatnya sufi wanita legendaris, Rabi'ah Al-Adawiyah. Ia adalah tokoh pertama yang mempopulerkan konsep 'Mahabbah' (Cinta Ilahi), yakni beribadah bukan karena takut neraka atau mengharap surga, melainkan murni karena cinta kepada Allah.",
  "quranicReference": {
    "surah": "Al-Ma'idah",
    "ayah": "54",
    "text": "يُحِبُّهُمْ وَيُحِبُّونَهُ أَذِلَّةٍ عَلَى الْمُؤْمِنِينَ أَعِزَّةٍ عَلَى الْكَافِرِينَ",
    "translation": "...Allah akan mendatangkan suatu kaum yang Allah mencintai mereka dan merekapun mencintai-Nya, yang bersikap lemah lembut terhadap orang yang mukmin, yang bersikap keras terhadap orang-orang kafir..."
  }
}
  ,{
  "id": "penyerahan-kunci-yerusalem",
  "monthNumber": 3,
  "dayNumber": 15,
  "title": "PENYERAHAN KUNCI BAITUL MAQDIS",
  "description": "Patriark Sophronius menyerahkan kunci Yerusalem HANYA kepada Khalifah Umar bin Khattab. Umar menjamin keamanan penuh bagi umat Kristen melalui 'Perjanjian Umar' (Al-Uhda Al-Omariyya).",
  "quranicReference": {
    "surah": "Al-Ma'idah",
    "ayah": "8",
    "text": "وَلَا يَجْرِمَنَّكُمْ شَنَآنُ قَوْمٍ عَلَىٰ أَلَّا تَعْدِلُوا",
    "translation": "Dan janganlah kebencianmu terhadap suatu kaum mendorong kamu untuk berlaku tidak adil."
  }
},
  {
  "id": "lahir-ibnu-haytham",
  "monthNumber": 1,
  "dayNumber": 1,
  "title": "LAHIRNYA BAPAK OPTIK MODERN (IBNU AL-HAYTHAM)",
  "description": "Lahirnya fisikawan jenius yang mematahkan teori penglihatan Yunani Kuno. Lewat karyanya 'Kitab al-Manazir' (Book of Optics), ia membuktikan bahwa cahaya bergerak dari benda ke mata, menemukan prinsip kamera obscura.",
  "quranicReference": {
    "surah": "An-Nur",
    "ayah": "35",
    "text": "اللَّهُ نُورُ السَّمَاوَاتِ وَالْأَرْضِ",
    "translation": "Allah (Pemberi) cahaya (kepada) langit dan bumi."
  }
},
  {
  "id": "wafat-umar-abdul-aziz",
  "monthNumber": 7,
  "dayNumber": 25,
  "title": "WAFATNYA KHALIFAH UMAR BIN ABDUL AZIZ",
  "description": "Meninggalnya Khulafaur Rasyidin ke-5. Dalam masa jabatannya yang hanya 2,5 tahun, kesejahteraan memuncak hingga tidak ada satupun orang miskin yang berhak menerima zakat di seluruh wilayah kekhalifahan.",
  "quranicReference": {
    "surah": "An-Nisa",
    "ayah": "58",
    "text": "إِنَّ اللَّهَ يَأْمُرُكُمْ أَن تُؤَدُّوا الْأَمَانَاتِ إِلَىٰ أَهْلِهَا",
    "translation": "Sesungguhnya Allah menyuruh kamu menyampaikan amanat kepada yang berhak menerimanya."
  }
},
  {
  "id": "penaklukan-sindh",
  "monthNumber": 9,
  "dayNumber": 10,
  "title": "PENAKLUKAN SINDH (INDIA)",
  "description": "Panglima muda Muhammad bin Qasim (17 tahun) memimpin pasukan Muslim menaklukkan Lembah Sungai Indus (Sindh), membawa cahaya Islam ke perbatasan anak benua India.",
  "quranicReference": {
    "surah": "Al-Hajj",
    "ayah": "41",
    "text": "الَّذِينَ إِن مَّكَّنَّاهُمْ فِي الْأَرْضِ أَقَامُوا الصَّلَاةَ وَآتَوُا الزَّكَاةَ",
    "translation": "(Yaitu) orang-orang yang jika Kami teguhkan kedudukan mereka di muka bumi niscaya mereka mendirikan sembahyang, menunaikan zakat..."
  }
},
  {
  "id": "penaklukan-sisilia",
  "monthNumber": 3,
  "dayNumber": 18,
  "title": "PENAKLUKAN SISILIA (ITALIA)",
  "description": "Panglima sekaligus ahli fikih, Asad bin Al-Furat, mendarat dan menaklukkan Pulau Sisilia, mengubah pulau di selatan Italia tersebut menjadi salah satu pusat peradaban dan pertanian Islam di Eropa selama lebih dari 200 tahun.",
  "quranicReference": {
    "surah": "Al-Baqarah",
    "ayah": "269",
    "text": "يُؤْتِي الْحِكْمَةَ مَن يَشَاءُ",
    "translation": "Allah menganugerahkan hikmah kepada siapa yang dikehendaki-Nya."
  }
},
  {
  "id": "jatuhnya-akko",
  "monthNumber": 6,
  "dayNumber": 17,
  "title": "JATUHNYA AKKO (AKHIR PERANG SALIB)",
  "description": "Kesultanan Mamluk berhasil merebut kota benteng Akko, menandai pengusiran total dan permanen Pasukan Salib dari Tanah Suci dan Suriah setelah dua abad penjajahan brutal.",
  "quranicReference": {
    "surah": "Al-Isra",
    "ayah": "81",
    "text": "وَقُلْ جَاءَ الْحَقُّ وَزَهَقَ الْبَاطِلُ ۚ إِنَّ الْبَاطِلَ كَانَ زَهُوقًا",
    "translation": "Dan katakanlah: 'Yang benar telah datang dan yang batil telah lenyap'. Sesungguhnya yang batil itu adalah sesuatu yang pasti lenyap."
  }
},
  {
  "id": "pengepungan-konstantinopel-pertama",
  "monthNumber": 10,
  "dayNumber": 2,
  "title": "PENGEPUNGAN KONSTANTINOPEL PERTAMA",
  "description": "Ekspedisi laut pertama umat Islam yang mengepung Konstantinopel. Sahabat Nabi yang sangat tua, Abu Ayyub Al-Ansari (tuan rumah Nabi saat Hijrah), ikut serta dan gugur syahid di bawah tembok raksasa Bizantium tersebut.",
  "quranicReference": {
    "surah": "At-Taubah",
    "ayah": "41",
    "text": "انفِرُوا خِفَافًا وَثِقَالًا وَجَاهِدُوا بِأَمْوَالِكُمْ وَأَنفُسِكُمْ فِي سَبِيلِ اللَّهِ",
    "translation": "Berangkatlah kamu baik dalam keadaan merasa ringan maupun berat, dan berjihadlah kamu dengan harta dan dirimu di jalan Allah."
  }
},
  {
  "id": "pertempuran-lepanto",
  "monthNumber": 5,
  "dayNumber": 17,
  "title": "PERTEMPURAN LAUT LEPANTO",
  "description": "Kekalahan besar pertama armada laut Kesultanan Utsmaniyah oleh Liga Suci Katolik di Teluk Patras. Ratusan kapal galley tenggelam dan puluhan ribu pelaut elit gugur, meruntuhkan mitos tak terkalahkannya angkatan laut Turki.",
  "quranicReference": {
    "surah": "Ali 'Imran",
    "ayah": "140",
    "text": "وَتِلْكَ الْأَيَّامُ نُدَاوِلُهَا بَيْنَ النَّاسِ",
    "translation": "...Dan masa (kejayaan dan kehancuran) itu Kami pergilirkan di antara manusia..."
  }
},
  {
  "id": "wafat-ibnu-battuta",
  "monthNumber": 8,
  "dayNumber": 25,
  "title": "WAFATNYA PENJELAJAH TERBESAR (IBNU BATTUTA)",
  "description": "Wafatnya Ibnu Battuta, pelancong terbesar dalam sejarah umat manusia yang menempuh jarak 117.000 km (melebihi Marco Polo), dari Maroko hingga Nusantara (Samudera Pasai) dan Tiongkok, demi menuntut ilmu.",
  "quranicReference": {
    "surah": "Al-Ankabut",
    "ayah": "20",
    "text": "قُلْ سِيرُوا فِي الْأَرْضِ فَانظُرُوا كَيْفَ بَدَأَ الْخَلْقَ",
    "translation": "Katakanlah: 'Berjalanlah di (muka) bumi, maka perhatikanlah bagaimana Allah menciptakan (manusia) dari permulaannya'."
  }
},
  {
  "id": "kelahiran-al-khawarizmi",
  "monthNumber": 1,
  "dayNumber": 1,
  "title": "LAHIRNYA BAPAK ALJABAR (AL-KHAWARIZMI)",
  "description": "Lahirnya jenius matematika Persia yang menemukan konsep Aljabar (Algebra) dan memperkenalkan angka nol (0) dari sistem Hindu-Arab ke dunia. Kata 'Algoritma' diambil dari ejaan Latin namanya (Algoritmi).",
  "quranicReference": {
    "surah": "Al-Baqarah",
    "ayah": "164",
    "text": "إِنَّ فِي خَلْقِ السَّمَاوَاتِ وَالْأَرْضِ وَاخْتِلَافِ اللَّيْلِ وَالنَّهَارِ... لَآيَاتٍ لِّقَوْمٍ يَعْقِلُونَ",
    "translation": "Sesungguhnya dalam penciptaan langit dan bumi, silih bergantinya malam dan siang... sungguh (terdapat) tanda-tanda (keesaan dan kebesaran Allah) bagi kaum yang memikirkan."
  }
},
  {
  "id": "ghadir-khumm",
  "monthNumber": 12,
  "dayNumber": 18,
  "title": "PERISTIWA GHADIR KHUMM",
  "description": "Sekembalinya dari Haji Wada', Rasulullah SAW menghentikan karavan di oase Ghadir Khumm. Di sanalah beliau mengangkat tangan Ali bin Abi Thalib dan bersabda: 'Barangsiapa yang menjadikan aku maulanya (pemimpinnya), maka Ali adalah maulanya.'",
  "quranicReference": {
    "surah": "Al-Ma'idah",
    "ayah": "67",
    "text": "يَا أَيُّهَا الرَّسُولُ بَلِّغْ مَا أُنزِلَ إِلَيْكَ مِن رَّبِّكَ",
    "translation": "Hai Rasul, sampaikanlah apa yang diturunkan kepadamu dari Tuhanmu."
  }
}
]