import fs from 'fs';

const extraEvents = [
  {
    id: "wafat-utsman",
    monthNumber: 12, // Dzulhijjah
    dayNumber: 18,
    title: "SYAHIDNYA KHALIFAH UTSMAN BIN AFFAN",
    description: "Khalifah ketiga, Utsman bin Affan (Dzunnurain - Pemilik Dua Cahaya), gugur syahid dibunuh oleh pemberontak saat beliau sedang membaca Al-Qur'an di rumahnya. Darah beliau menetes tepat di atas ayat 'Maka Allah akan memelihara kamu dari mereka'.",
    quranicReference: {
      surah: "Al-Baqarah",
      ayah: "137",
      text: "فَسَيَكْفِيكَهُمُ اللَّهُ ۚ وَهُوَ السَّمِيعُ الْعَلِيمُ",
      translation: "Maka Allah akan memelihara kamu dari mereka. Dan Dialah Yang Maha Mendengar lagi Maha Mengetahui."
    }
  },
  {
    id: "perang-khaibar",
    monthNumber: 1, // Muharram
    dayNumber: 15, // Awal Muharram / Pertengahan Muharram 7 H
    title: "PERANG KHAIBAR",
    description: "Penaklukan benteng terkuat Yahudi di Semenanjung Arab (Khaibar) oleh pasukan Muslim. Ali bin Abi Thalib mendobrak pintu benteng raksasa Kamus seorang diri setelah pahlawan-pahlawan lain gagal menembusnya.",
    quranicReference: {
      surah: "Al-Fath",
      ayah: "20",
      text: "وَعَدَكُمُ اللَّهُ مَغَانِمَ كَثِيرَةً تَأْخُذُونَهَا فَعَجَّلَ لَكُمْ هَٰذِهِ وَكَفَّ أَيْدِيَ النَّاسِ عَنكُمْ",
      translation: "Allah menjanjikan kepadamu harta rampasan yang banyak yang dapat kamu ambil, maka disegerakan-Nya harta rampasan ini untukmu dan Dia menahan tangan manusia dari (membinasakan)mu."
    }
  },
  {
    id: "baiat-aqabah",
    monthNumber: 12, // Dzulhijjah
    dayNumber: 12, // Musim haji
    title: "BAIAT AQABAH KEDUA (SUMPAH SETIA YATSRIB)",
    description: "73 pria dan 2 wanita dari Yatsrib (Madinah) bersumpah setia secara rahasia di bukit Aqabah untuk melindungi Nabi Muhammad SAW dengan harta dan nyawa mereka, membuka jalan bagi peristiwa Hijrah raksasa ke Madinah.",
    quranicReference: {
      surah: "Al-Fath",
      ayah: "18",
      text: "لَّقَدْ رَضِيَ اللَّهُ عَنِ الْمُؤْمِنِينَ إِذْ يُبَايِعُونَكَ تَحْتَ الشَّجَرَةِ فَعَلِمَ مَا فِي قُلُوبِهِمْ فَأَنزَلَ السَّكِينَةَ عَلَيْهِمْ وَأَثَابَهُمْ فَتْحًا قَرِيبًا",
      translation: "Sesungguhnya Allah telah ridha terhadap orang-orang mukmin ketika mereka berjanji setia kepadamu di bawah pohon, maka Allah mengetahui apa yang ada dalam hati mereka lalu menurunkan ketenangan atas mereka dan memberi balasan kepada mereka dengan kemenangan yang dekat."
    }
  },
  {
    id: "perang-yarmuk",
    monthNumber: 7, // Rajab
    dayNumber: 5, // Rajab 15 H
    title: "PERANG YARMUK (PENGHANCURAN ROMAWI)",
    description: "Pertempuran paling menentukan di Timur Tengah. 40.000 pasukan Muslim pimpinan Khalid bin Walid secara heroik menghancurkan lebih dari 100.000 pasukan Kekaisaran Bizantium (Romawi), mengakhiri kekuasaan Romawi di wilayah Syam selamanya.",
    quranicReference: {
      surah: "Muhammad",
      ayah: "7",
      text: "يَا أَيُّهَا الَّذِينَ آمَنُوا إِن تَنصُرُوا اللَّهَ يَنصُرْكُمْ وَيُثَبِّتْ أَقْدَامَكُمْ",
      translation: "Hai orang-orang mukmin, jika kamu menolong (agama) Allah, niscaya Dia akan menolongmu dan meneguhkan kedudukanmu."
    }
  },
  {
    id: "perang-qadisiyyah",
    monthNumber: 1, // Muharram
    dayNumber: 13, // Muharram 14 H
    title: "PERANG AL-QADISIYYAH (RUNTUHNYA PERSIA SASSANID)",
    description: "Kemenangan absolut pasukan Muslim pimpinan Sa'ad bin Abi Waqqas atas Kekaisaran Persia Sassanid yang membawa pasukan gajah. Pertempuran 4 hari ini meruntuhkan imperium Persia yang telah berkuasa ribuan tahun.",
    quranicReference: {
      surah: "Ar-Rum",
      ayah: "4-5",
      text: "لِّلَّهِ الْأَمْرُ مِن قَبْلُ وَمِن بَعْدُ ۚ وَيَوْمَئِذٍ يَفْرَحُ الْمُؤْمِنُونَ ۝ بِنَصْرِ اللَّهِ ۚ يَنصُرُ مَن يَشَاءُ ۖ وَهُوَ الْعَزِيزُ الرَّحِيمُ",
      translation: "Bagi Allah-lah urusan sebelum dan sesudah (mereka menang). Dan di hari (kemenangan bangsa Romawi) itu bergembiralah orang-orang yang beriman, karena pertolongan Allah. Dia menolong siapa yang dikehendaki-Nya."
    }
  },
  {
    id: "penaklukan-mesir",
    monthNumber: 1, // Muharram
    dayNumber: 20, // Muharram 20 H
    title: "PENAKLUKAN MESIR OLEH AMR BIN ASH",
    description: "Panglima Amr bin Ash berhasil membebaskan Mesir dari penindasan Romawi Bizantium, dan membangun kota Fustat (Kairo modern). Penduduk Koptik Mesir menyambut umat Islam sebagai pembebas.",
    quranicReference: {
      surah: "Yusuf",
      ayah: "21",
      text: "وَكَذَٰلِكَ مَكَّنَّا لِيُوسُفَ فِي الْأَرْضِ وَلِنُعَلِّمَهُ مِن تَأْوِيلِ الْأَحَادِيثِ ۚ وَاللَّهُ غَالِبٌ عَلَىٰ أَمْرِهِ",
      translation: "Dan demikianlah Kami memberikan kedudukan yang baik kepada Yusuf di muka bumi (Mesir)... Dan Allah berkuasa terhadap urusan-Nya, tetapi kebanyakan manusia tiada mengetahuinya."
    }
  },
  {
    id: "perang-hittin",
    monthNumber: 4, // Rabiul Akhir
    dayNumber: 25, // 583 H
    title: "PERANG HITTIN (TITIK BALIK PERANG SALIB)",
    description: "Pasukan Salahuddin Al-Ayyubi menjebak pasukan Salib di sebuah bukit tanpa air. Kekalahan total Pasukan Salib di Hittin ini menjadi pembuka jalan untuk pembebasan kembali kota suci Yerusalem (Al-Aqsa).",
    quranicReference: {
      surah: "Al-Ma'idah",
      ayah: "21",
      text: "يَا قَوْمِ ادْخُلُوا الْأَرْضَ الْمُقَدَّسَةَ الَّتِي كَتَبَ اللَّهُ لَكُمْ وَلَا تَرْتَدُّوا عَلَىٰ أَدْبَارِكُمْ فَتَنقَلِبُوا خَاسِرِينَ",
      translation: "Hai kaumku, masuklah ke tanah suci (Palestina) yang telah ditentukan Allah bagimu, dan janganlah kamu lari ke belakang (karena takut kepada musuh), maka kamu menjadi orang-orang yang merugi."
    }
  },
  {
    id: "runtuhnya-baghdad",
    monthNumber: 2, // Safar
    dayNumber: 4, // 656 H
    title: "RUNTUHNYA BAGHDAD (TRAGEDI MONGOL)",
    description: "Kejatuhan tragis pusat peradaban dunia, Baghdad, ke tangan invasi biadab bangsa Mongol pimpinan Hulagu Khan. Jutaan umat Islam dibantai, dan perpustakaan terbesar dunia (Baitul Hikmah) dibuang ke Sungai Tigris hingga airnya menghitam oleh tinta.",
    quranicReference: {
      surah: "Al-Baqarah",
      ayah: "155-156",
      text: "وَلَنَبْلُوَنَّكُم بِشَيْءٍ مِّنَ الْخَوْفِ وَالْجُوعِ وَنَقْصٍ مِّنَ الْأَمْوَالِ وَالْأَنفُسِ وَالثَّمَرَاتِ ۗ وَبَشِّرِ الصَّابِرِينَ ۝ الَّذِينَ إِذَا أَصَابَتْهُم مُّصِيبَةٌ قَالُوا إِنَّا لِلَّهِ وَإِنَّا إِلَيْهِ رَاجِعُونَ",
      translation: "Dan sungguh akan Kami berikan cobaan kepadamu, dengan sedikit ketakutan, kelaparan, kekurangan harta, jiwa dan buah-buahan. Dan berikanlah berita gembira kepada orang-orang yang sabar. (yaitu) orang-orang yang apabila ditimpa musibah, mereka mengucapkan: Inna lillaahi wa innaa ilaihi raaji'uun."
    }
  },
  {
    id: "masjid-quba",
    monthNumber: 3, // Rabiul Awwal
    dayNumber: 8, // Tiba di Quba 8 Rabiul Awwal
    title: "PEMBANGUNAN MASJID PERTAMA (QUBA)",
    description: "Dalam perjalanan Hijrah sebelum tiba di pusat Madinah, Rasulullah SAW singgah di Quba dan mendirikan masjid pertama dalam sejarah Islam yang didirikan atas dasar takwa sejak hari pertama.",
    quranicReference: {
      surah: "At-Taubah",
      ayah: "108",
      text: "لَّمَسْجِدٌ أُسِّسَ عَلَى التَّقْوَىٰ مِنْ أَوَّلِ يَوْمٍ أَحَقُّ أَن تَقُومَ فِيهِ ۚ فِيهِ رِجَالٌ يُحِبُّونَ أَن يَتَطَهَّرُوا ۚ وَاللَّهُ يُحِبُّ الْمُطَّهِّرِينَ",
      translation: "Sesungguhnya masjid yang didirikan atas dasar takwa (masjid Quba), sejak hari pertama adalah lebih patut kamu sholat di dalamnya. Di dalamnya masjid itu ada orang-orang yang ingin membersihkan diri. Dan sesungguhnya Allah menyukai orang-orang yang bersih."
    }
  }
];

let content = fs.readFileSync('@core/db/data/prophetic-events.db.ts', 'utf-8');
const newEvents = extraEvents.map(e => JSON.stringify(e, null, 2)).join(',\n  ');
content = content.replace(/\]\s*$/, `  ,${newEvents}\n]`);
fs.writeFileSync('@core/db/data/prophetic-events.db.ts', content);
console.log("DB Highly Expanded AGAIN with 9 more massive historical events!");
