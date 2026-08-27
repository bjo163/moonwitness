import fs from 'fs';

const extraEvents = [
  {
    id: "penaklukan-yerusalem-umar",
    monthNumber: 3, // Rabiul Awwal
    dayNumber: 15, // 16 H
    title: "PENYERAHAN KUNCI BAITUL MAQDIS KEPADA UMAR",
    description: "Patriark Sophronius dari Yerusalem menolak menyerahkan kunci kota kepada siapapun kecuali langsung kepada Khalifah Umar bin Khattab. Umar datang hanya dengan satu unta bergantian dengan pembantunya, menandatangani 'Perjanjian Umar' yang menjamin kebebasan beragama bagi umat Kristen.",
    quranicReference: {
      surah: "Al-Ma'idah",
      ayah: "8",
      text: "وَلَا يَجْرِمَنَّكُمْ شَنَآنُ قَوْمٍ عَلَىٰ أَلَّا تَعْدِلُوا ۚ اعْدِلُوا هُوَ أَقْرَبُ لِلتَّقْوَىٰ",
      translation: "Dan janganlah sekali-kali kebencianmu terhadap sesuatu kaum, mendorong kamu untuk berlaku tidak adil. Berlaku adillah, karena adil itu lebih dekat kepada takwa."
    }
  },
  {
    id: "berdirinya-qarawiyyin",
    monthNumber: 9, // Ramadhan
    dayNumber: 1, // 245 H
    title: "BERDIRINYA UNIVERSITAS TERTUA (AL-QARAWIYYIN)",
    description: "Seorang wanita Muslimah visioner, Fatima al-Fihri, mewakafkan seluruh hartanya untuk membangun Masjid Al-Qarawiyyin di Fez, Maroko. Tempat ini berevolusi menjadi universitas pemberi gelar pertama dan tertua di dunia yang masih beroperasi hingga kini.",
    quranicReference: {
      surah: "Al-Mujadila",
      ayah: "11",
      text: "يَرْفَعِ اللَّهُ الَّذِينَ آمَنُوا مِنكُمْ وَالَّذِينَ أُوتُوا الْعِلْمَ دَرَجَاتٍ",
      translation: "Niscaya Allah akan meninggikan orang-orang yang beriman di antaramu dan orang-orang yang diberi ilmu pengetahuan beberapa derajat."
    }
  },
  {
    id: "pembukaan-al-azhar",
    monthNumber: 9, // Ramadhan
    dayNumber: 7, // 361 H
    title: "PEMBUKAAN UNIVERSITAS AL-AZHAR",
    description: "Masjid Al-Azhar di Kairo mengadakan shalat Jumat pertamanya. Dibangun oleh Kekhalifahan Fatimiyah, tempat ini kemudian diubah menjadi pusat keilmuan Sunni terbesar di dunia oleh Salahuddin Al-Ayyubi, dan bertahan selama lebih dari 1000 tahun.",
    quranicReference: {
      surah: "At-Taubah",
      ayah: "122",
      text: "فَلَوْلَا نَفَرَ مِن كُلِّ فِرْقَةٍ مِّنْهُمْ طَائِفَةٌ لِّيَتَفَقَّهُوا فِي الدِّينِ",
      translation: "Mengapa tidak pergi dari tiap-tiap golongan di antara mereka beberapa orang untuk memperdalam pengetahuan mereka tentang agama..."
    }
  },
  {
    id: "wadi-lakka",
    monthNumber: 9, // Ramadhan
    dayNumber: 28, // 92 H
    title: "KEMENANGAN WADI LAKKA (GUADALETE)",
    description: "Pasukan Tariq bin Ziyad berhasil menghancurkan pasukan raksasa Raja Roderic dari Visigoth. Momen ini adalah paku pertama yang menancapkan kekuasaan Islam di Semenanjung Iberia (Spanyol dan Portugal) yang akan memancarkan ilmu pengetahuan ke Eropa yang sedang dilanda Abad Kegelapan.",
    quranicReference: {
      surah: "Al-Anbiya",
      ayah: "105",
      text: "وَلَقَدْ كَتَبْنَا فِي الزَّبُورِ مِن بَعْدِ الذِّكْرِ أَنَّ الْأَرْضَ يَرِثُهَا عِبَادِيَ الصَّالِحُونَ",
      translation: "Dan sungguh telah Kami tulis di dalam Zabur sesudah (Kami tulis dalam) Lauh Mahfuzh, bahwasanya bumi ini dipusakai hamba-hamba-Ku yang saleh."
    }
  },
  {
    id: "perang-manzikert",
    monthNumber: 11, // Dzulqa'dah
    dayNumber: 20, // 463 H (Agustus 1071)
    title: "PERANG MANZIKERT (PEMBUKA GERBANG ANATOLIA)",
    description: "Sultan Alp Arslan dari Dinasti Seljuk dengan pasukan kecil secara brilian menghancurkan pasukan elit Kekaisaran Bizantium dan menawan Kaisar Romanos IV. Kemenangan ini membuka seluruh dataran Anatolia (kini Turki) untuk peradaban Islam.",
    quranicReference: {
      surah: "Al-Baqarah",
      ayah: "251",
      text: "فَهَزَمُوهُم بِإِذْنِ اللَّهِ وَقَتَلَ دَاوُودُ جَالُوتَ وَآتَاهُ اللَّهُ الْمُلْكَ وَالْحِكْمَةَ",
      translation: "Mereka (tentara Thalut) mengalahkan tentara Jalut dengan izin Allah dan (dalam peperangan itu) Daud membunuh Jalut, kemudian Allah memberikan kepadanya pemerintahan dan hikmah."
    }
  },
  {
    id: "balat-syuhada",
    monthNumber: 9, // Ramadhan
    dayNumber: 2, // 114 H (Oktober 732)
    title: "BALAT ASY-SYUHADA (PERTEMPURAN TOURS)",
    description: "Pasukan Islam pimpinan Abdurrahman Al-Ghafiqi dihentikan oleh Charles Martel di Prancis. Pertempuran berdarah ini menandai batas terjauh ekspansi militer Islam di Eropa Barat. Al-Ghafiqi gugur sebagai syahid bersama ribuan pasukannya.",
    quranicReference: {
      surah: "Ali 'Imran",
      ayah: "140",
      text: "إِن يَمْسَسْكُمْ قَرْحٌ فَقَدْ مَسَّ الْقَوْمَ قَرْحٌ مِّثْلُهُ ۚ وَتِلْكَ الْأَيَّامُ نُدَاوِلُهَا بَيْنَ النَّاسِ",
      translation: "Jika kamu (pada perang Uhud) mendapat luka, maka sesungguhnya kaum (kafir) itupun (pada perang Badar) mendapat luka yang serupa. Dan masa (kejayaan dan kehancuran) itu Kami pergilirkan di antara manusia."
    }
  },
  {
    id: "jatuhnya-yerusalem-salib",
    monthNumber: 8, // Sya'ban
    dayNumber: 22, // 492 H (Juli 1099)
    title: "JATUHNYA YERUSALEM (PERANG SALIB I)",
    description: "Tragedi kemanusiaan terburuk Abad Pertengahan. Pasukan Salib berhasil menembus tembok Yerusalem dan membantai 70.000 penduduk Muslim dan Yahudi di dalam Masjid Al-Aqsa, hingga darah menggenang setinggi mata kaki kuda.",
    quranicReference: {
      surah: "Al-Baqarah",
      ayah: "214",
      text: "أَمْ حَسِبْتُمْ أَن تَدْخُلُوا الْجَنَّةَ وَلَمَّا يَأْتِكُم مَّثَلُ الَّذِينَ خَلَوْا مِن قَبْلِكُم ۖ مَّسَّتْهُمُ الْبَأْسَاءُ وَالضَّرَّاءُ وَزُلْزِلُوا",
      translation: "Apakah kamu mengira bahwa kamu akan masuk surga, padahal belum datang kepadamu (cobaan) sebagaimana halnya orang-orang terdahulu sebelum kamu? Mereka ditimpa oleh malapetaka dan kesengsaraan, serta digoncangkan (dengan bermacam-macam cobaan)."
    }
  },
  {
    id: "wafat-salahuddin",
    monthNumber: 2, // Safar
    dayNumber: 27, // 589 H
    title: "WAFATNYA SANG PEMBEBAS (SALAHUDDIN AL-AYYUBI)",
    description: "Sultan Salahuddin Al-Ayyubi, pembebas Yerusalem dan pahlawan terbesar Perang Salib, wafat. Ia sangat dermawan hingga saat wafatnya, kas negaranya tidak cukup untuk biaya pemakamannya sendiri karena seluruh hartanya telah disedekahkan.",
    quranicReference: {
      surah: "At-Taubah",
      ayah: "111",
      text: "إِنَّ اللَّهَ اشْتَرَىٰ مِنَ الْمُؤْمِنِينَ أَنفُسَهُمْ وَأَمْوَالَهُم بِأَنَّ لَهُمُ الْجَنَّةَ ۚ يُقَاتِلُونَ فِي سَبِيلِ اللَّهِ",
      translation: "Sesungguhnya Allah telah membeli dari orang-orang mukmin diri dan harta mereka dengan memberikan surga untuk mereka. Mereka berperang pada jalan Allah."
    }
  },
  {
    id: "lahir-ibnu-sina",
    monthNumber: 2, // Safar
    dayNumber: 1, // 370 H
    title: "LAHIRNYA BAPAK KEDOKTERAN MODERN (IBNU SINA)",
    description: "Lahirnya Ibnu Sina (Avicenna) di Bukhara. Karya monumentalnya 'Qanun fi at-Tibb' (The Canon of Medicine) menjadi buku teks standar kedokteran di universitas-universitas Eropa selama lebih dari 600 tahun.",
    quranicReference: {
      surah: "Yunus",
      ayah: "57",
      text: "يَا أَيُّهَا النَّاسُ قَدْ جَاءَتْكُم مَّوْعِظَةٌ مِّن رَّبِّكُمْ وَشِفَاءٌ لِّمَا فِي الصُّدُورِ وَهُدًى وَرَحْمَةٌ لِّلْمُؤْمِنِينَ",
      translation: "Hai manusia, sesungguhnya telah datang kepadamu pelajaran dari Tuhanmu dan penyembuh bagi penyakit-penyakit (yang berada) dalam dada dan petunjuk serta rahmat bagi orang-orang yang beriman."
    }
  },
  {
    id: "lahir-ibnu-khaldun",
    monthNumber: 9, // Ramadhan
    dayNumber: 1, // 732 H
    title: "LAHIRNYA BAPAK SOSIOLOGI (IBNU KHALDUN)",
    description: "Lahirnya Ibnu Khaldun di Tunis. Melalui magnum opusnya 'Muqaddimah', ia merumuskan teori-teori pertama tentang sosiologi, ekonomi, demografi, dan siklus jatuh-bangunnya sebuah peradaban (Asabiyyah).",
    quranicReference: {
      surah: "Ar-Rum",
      ayah: "9",
      text: "أَوَلَمْ يَسِيرُوا فِي الْأَرْضِ فَيَنظُرُوا كَيْفَ كَانَ عَاقِبَةُ الَّذِينَ مِن قَبْلِهِمْ ۚ كَانُوا أَشَدَّ مِنْهُمْ قُوَّةً وَأَثَارُوا الْأَرْضَ وَعَمَرُوهَا أَكْثَرَ مِمَّا عَمَرُوهَا",
      translation: "Dan apakah mereka tidak mengadakan perjalanan di muka bumi dan memperhatikan bagaimana akibat (yang diderita) oleh orang-orang sebelum mereka? orang-orang itu adalah lebih kuat dari mereka (sendiri) dan telah mengolah bumi (tanah) serta memakmurkannya lebih banyak dari apa yang telah mereka makmurkan."
    }
  },
  {
    id: "wafat-abu-hanifah",
    monthNumber: 7, // Rajab
    dayNumber: 15, // 150 H
    title: "WAFATNYA IMAM ABU HANIFAH",
    description: "Wafatnya Nu'man bin Tsabit (Imam Abu Hanifah), pendiri mazhab Hanafi. Beliau wafat di dalam penjara karena menolak diangkat menjadi hakim agung (Qadhi) oleh Khalifah Al-Mansur, sebagai bentuk independensi ulama dari kekuasaan tiran.",
    quranicReference: {
      surah: "Al-Baqarah",
      ayah: "42",
      text: "وَلَا تَلْبِسُوا الْحَقَّ بِالْبَاطِلِ وَتَكْتُمُوا الْحَقَّ وَأَنتُمْ تَعْلَمُونَ",
      translation: "Dan janganlah kamu campur adukkan yang hak dengan yang bathil dan janganlah kamu sembunyikan yang hak itu, sedang kamu mengetahui."
    }
  },
  {
    id: "wafat-imam-malik",
    monthNumber: 3, // Rabiul Awwal
    dayNumber: 14, // 179 H
    title: "WAFATNYA IMAM DARUL HIJRAH (IMAM MALIK)",
    description: "Wafatnya Malik bin Anas, pendiri mazhab Maliki dan penulis kitab hadits tertua 'Al-Muwatta'. Beliau mendedikasikan seluruh hidupnya di Madinah dan tidak pernah mau menunggang kuda di kota itu demi menghormati jasad Rasulullah yang terkubur di bawahnya.",
    quranicReference: {
      surah: "Al-Ahzab",
      ayah: "56",
      text: "إِنَّ اللَّهَ وَمَلَائِكَتَهُ يُصَلُّونَ عَلَى النَّبِيِّ ۚ يَا أَيُّهَا الَّذِينَ آمَنُوا صَلُّوا عَلَيْهِ وَسَلِّمُوا تَسْلِيمًا",
      translation: "Sesungguhnya Allah dan malaikat-malaikat-Nya bershalawat untuk Nabi. Hai orang-orang yang beriman, bershalawatlah kamu untuk Nabi dan ucapkanlah salam penghormatan kepadanya."
    }
  },
  {
    id: "runtuhnya-cordoba",
    monthNumber: 12, // Dzulhijjah
    dayNumber: 30, // 422 H
    title: "RUNTUHNYA KEKHALIFAHAN CORDOBA",
    description: "Kekhalifahan Umayyah di Cordoba (Andalusia) secara resmi dihapuskan dan terpecah belah menjadi puluhan kerajaan kecil (Taifa) yang saling berperang satu sama lain. Titik awal kejatuhan total Islam di Spanyol.",
    quranicReference: {
      surah: "Al-Hashr",
      ayah: "14",
      text: "تَحْسَبُهُمْ جَمِيعًا وَقُلُوبُهُمْ شَتَّىٰ ۚ ذَٰلِكَ بِأَنَّهُمْ قَوْمٌ لَّا يَعْقِلُونَ",
      translation: "...Kamu kira mereka itu bersatu, sedang hati mereka berpecah belah. Yang demikian itu karena sesungguhnya mereka adalah kaum yang tidak mengerti."
    }
  },
  {
    id: "pengepungan-wina",
    monthNumber: 1, // Muharram
    dayNumber: 10, // 936 H (Oktober 1529)
    title: "PENGEPUNGAN WINA OLEH SULEIMAN AL-QANUNI",
    description: "Puncak kekuatan militer Kesultanan Utsmaniyah. Pasukan Suleiman the Magnificent mengepung Wina (Austria), jantung Eropa. Meskipun gagal direbut akibat badai salju dan wabah, peristiwa ini membuat seluruh Eropa Barat gemetar ketakutan selama berabad-abad.",
    quranicReference: {
      surah: "Al-Fath",
      ayah: "1-2",
      text: "إِنَّا فَتَحْنَا لَكَ فَتْحًا مُّبِينًا",
      translation: "Sesungguhnya Kami telah memberikan kepadamu kemenangan yang nyata."
    }
  },
  {
    id: "wafat-rabiatul-adawiyah",
    monthNumber: 8, // Sya'ban
    dayNumber: 10, // Sekitar 185 H
    title: "WAFATNYA IBU PARA SUFI (RABI'AH AL-ADAWIYAH)",
    description: "Wafatnya sufi wanita legendaris, Rabi'ah Al-Adawiyah. Ia adalah tokoh pertama yang mempopulerkan konsep 'Mahabbah' (Cinta Ilahi), yakni beribadah bukan karena takut neraka atau mengharap surga, melainkan murni karena cinta kepada Allah.",
    quranicReference: {
      surah: "Al-Ma'idah",
      ayah: "54",
      text: "يُحِبُّهُمْ وَيُحِبُّونَهُ أَذِلَّةٍ عَلَى الْمُؤْمِنِينَ أَعِزَّةٍ عَلَى الْكَافِرِينَ",
      translation: "...Allah akan mendatangkan suatu kaum yang Allah mencintai mereka dan merekapun mencintai-Nya, yang bersikap lemah lembut terhadap orang yang mukmin, yang bersikap keras terhadap orang-orang kafir..."
    }
  }
];

let content = fs.readFileSync('@core/db/data/prophetic-events.db.ts', 'utf-8');
const newEvents = extraEvents.map(e => JSON.stringify(e, null, 2)).join(',\n  ');
content = content.replace(/\]\s*$/, `  ,${newEvents}\n]`);
fs.writeFileSync('@core/db/data/prophetic-events.db.ts', content);
console.log("DB Expanded to Massive Scale with 15 more world-changing events!");
