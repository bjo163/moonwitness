import fs from 'fs';

const extraEvents = [
  {
    id: "wafat-khadijah",
    monthNumber: 9, // Ramadhan
    dayNumber: 10,
    title: "WAFATNYA SAYYIDAH KHADIJAH (AMUL HUZNI)",
    description: "Khadijah binti Khuwailid, istri tercinta sekaligus pilar finansial dan emosional utama Rasulullah SAW, wafat. Tahun ini disebut 'Amul Huzni' (Tahun Kesedihan) karena tak lama kemudian paman beliau, Abu Thalib, juga wafat.",
    quranicReference: {
      surah: "Al-Fajr",
      ayah: "27-28",
      text: "يَا أَيَّتُهَا النَّفْسُ الْمُطْمَئِنَّةُ ۝ ارْجِعِي إِلَىٰ رَبِّكِ رَاضِيَةً مَّرْضِيَّةً",
      translation: "Hai jiwa yang tenang. Kembalilah kepada Tuhanmu dengan hati yang puas lagi diridhai-Nya."
    }
  },
  {
    id: "wafat-ali",
    monthNumber: 9, // Ramadhan
    dayNumber: 21,
    title: "SYAHIDNYA KHALIFAH ALI BIN ABI THALIB",
    description: "Khalifah keempat, Ali bin Abi Thalib RA, wafat setelah ditebas pedang beracun oleh pengkhianat Khawarij (Abdurrahman bin Muljam) saat sedang mengimami shalat Subuh di Masjid Kufah.",
    quranicReference: {
      surah: "Al-Baqarah",
      ayah: "207",
      text: "وَمِنَ النَّاسِ مَن يَشْرِي نَفْسَهُ ابْتِغَاءَ مَرْضَاتِ اللَّهِ ۗ وَاللَّهُ رَءُوفٌ بِالْعِبَادِ",
      translation: "Dan di antara manusia ada orang yang mengorbankan dirinya karena mencari keridhaan Allah; dan Allah Maha Penyantun kepada hamba-hamba-Nya."
    }
  },
  {
    id: "penaklukan-andalusia",
    monthNumber: 9, // Ramadhan
    dayNumber: 28,
    title: "PENAKLUKAN ANDALUSIA (SPANYOL)",
    description: "Panglima Tariq bin Ziyad menyeberangi selat Gibraltar dan memerintahkan pasukannya untuk membakar kapal-kapal mereka sendiri. Mereka meraih kemenangan atas pasukan Visigoth, membuka gerbang peradaban Islam di Eropa selama 800 tahun.",
    quranicReference: {
      surah: "Al-Hajj",
      ayah: "40",
      text: "وَلَيَنصُرَنَّ اللَّهُ مَن يَنصُرُهُ ۗ إِنَّ اللَّهَ لَقَوِيٌّ عَزِيزٌ",
      translation: "Sesungguhnya Allah pasti menolong orang yang menolong (agama)-Nya. Sesungguhnya Allah benar-benar Maha Kuat lagi Maha Perkasa."
    }
  },
  {
    id: "perang-ain-jalut",
    monthNumber: 9, // Ramadhan
    dayNumber: 15,
    title: "PERANG AIN JALUT (PENGHANCURAN MONGOL)",
    description: "Pasukan Mamluk dari Mesir pimpinan Saifuddin Qutuz berhasil menghentikan dan menghancurkan invasi brutal pasukan Mongol (yang sebelumnya menghancurkan Baghdad). Penyelamatan besar bagi sisa-sisa peradaban Islam.",
    quranicReference: {
      surah: "Al-Baqarah",
      ayah: "249",
      text: "كَم مِّن فِئَةٍ قَلِيلَةٍ غَلَبَتْ فِئَةً كَثِيرَةً بِإِذْنِ اللَّهِ ۗ وَاللَّهُ مَعَ الصَّابِرِينَ",
      translation: "Berapa banyak terjadi golongan yang sedikit dapat mengalahkan golongan yang banyak dengan izin Allah. Dan Allah beserta orang-orang yang sabar."
    }
  },
  {
    id: "penaklukan-konstantinopel",
    monthNumber: 5, // Jumadil Awal
    dayNumber: 20,
    title: "PENAKLUKAN KONSTANTINOPEL",
    description: "Pemenuhan nubuat Rasulullah SAW 800 tahun sebelumnya. Sultan Muhammad Al-Fatih (Mehmed II) menembus tembok raksasa Konstantinopel, menjatuhkan Kekaisaran Bizantium, dan mengubah kota itu menjadi Istanbul.",
    quranicReference: {
      surah: "As-Saff",
      ayah: "13",
      text: "وَأُخْرَىٰ تُحِبُّونَهَا ۖ نَصْرٌ مِّنَ اللَّهِ وَفَتْحٌ قَرِيبٌ ۗ وَبَشِّرِ الْمُؤْمِنِينَ",
      translation: "Dan (ada lagi) karunia yang lain yang kamu sukai (yaitu) pertolongan dari Allah dan kemenangan yang dekat (waktunya). Dan sampaikanlah berita gembira kepada orang-orang yang beriman."
    }
  },
  {
    id: "runtuhnya-khilafah",
    monthNumber: 7, // Rajab
    dayNumber: 27,
    title: "RUNTUHNYA KEKHALIFAHAN TURKI UTSMANI",
    description: "Bertepatan dengan hari Isra' Mi'raj (27 Rajab 1342 H / 3 Maret 1924 M), Majelis Agung Nasional Turki secara resmi menghapus institusi Kekhalifahan, menandai berakhirnya sistem kepemimpinan politik global umat Islam yang telah berdiri sejak wafatnya Nabi.",
    quranicReference: {
      surah: "Ali 'Imran",
      ayah: "140",
      text: "وَتِلْكَ الْأَيَّامُ نُدَاوِلُهَا بَيْنَ النَّاسِ وَلِيَعْلَمَ اللَّهُ الَّذِينَ آمَنُوا",
      translation: "Dan masa (kejayaan dan kehancuran) itu Kami pergilirkan di antara manusia (agar mereka mendapat pelajaran); dan supaya Allah membedakan orang-orang yang beriman..."
    }
  },
  {
    id: "nuzulul-taurat",
    monthNumber: 9, // Ramadhan
    dayNumber: 6,
    title: "TURUNNYA KITAB TAURAT",
    description: "Bulan Ramadhan adalah bulan kitab suci. Dalam salah satu riwayat sahih disebutkan bahwa Allah menurunkan kitab Taurat kepada Nabi Musa AS pada tanggal 6 Ramadhan.",
    quranicReference: {
      surah: "Al-Ma'idah",
      ayah: "44",
      text: "إِنَّا أَنزَلْنَا التَّوْرَاةَ فِيهَا هُدًى وَنُورٌ",
      translation: "Sesungguhnya Kami telah menurunkan Kitab Taurat di dalamnya (ada) petunjuk dan cahaya (yang menerangi)..."
    }
  },
  {
    id: "nuzulul-injil",
    monthNumber: 9, // Ramadhan
    dayNumber: 13,
    title: "TURUNNYA KITAB INJIL",
    description: "Melanjutkan tradisi wahyu di bulan suci, Allah menurunkan kitab Injil kepada Nabi Isa AS pada tanggal 13 Ramadhan sebagai petunjuk bagi Bani Israil.",
    quranicReference: {
      surah: "Al-Ma'idah",
      ayah: "46",
      text: "وَآتَيْنَاهُ الْإِنجِيلَ فِيهِ هُدًى وَنُورٌ وَمُصَدِّقًا لِّمَا بَيْنَ يَدَيْهِ مِنَ التَّوْرَاةِ",
      translation: "Dan Kami telah memberikan kepadanya Kitab Injil sedang di dalamnya (ada) petunjuk dan cahaya (yang menerangi), dan membenarkan kitab yang sebelumnya, yaitu Kitab Taurat."
    }
  },
  {
    id: "nuzulul-zabur",
    monthNumber: 9, // Ramadhan
    dayNumber: 18,
    title: "TURUNNYA KITAB ZABUR",
    description: "Kitab Zabur diturunkan kepada Nabi Dawud AS pada tanggal 18 Ramadhan, berisi nyanyian, puji-pujian kepada Allah, dan nasihat kebijaksanaan.",
    quranicReference: {
      surah: "An-Nisa'",
      ayah: "163",
      text: "وَآتَيْنَا دَاوُودَ زَبُورًا",
      translation: "...dan Kami berikan Zabur kepada Daud."
    }
  },
  {
    id: "wafat-umar",
    monthNumber: 12, // Dzulhijjah
    dayNumber: 26, // Ditusuk tanggal 26, wafat 1 Muharram
    title: "SYAHIDNYA UMAR BIN KHATTAB",
    description: "Khalifah kedua, Al-Faruq Umar bin Khattab, ditikam oleh Abu Lu'luah (seorang Majusi) saat sedang memimpin shalat Subuh berjamaah. Beliau adalah pemimpin paling tegas yang ditakuti iblis, penakluk dua adidaya (Persia & Romawi).",
    quranicReference: {
      surah: "Al-Anbiya",
      ayah: "105",
      text: "وَلَقَدْ كَتَبْنَا فِي الزَّبُورِ مِن بَعْدِ الذِّكْرِ أَنَّ الْأَرْضَ يَرِثُهَا عِبَادِيَ الصَّالِحُونَ",
      translation: "Dan sungguh telah Kami tulis di dalam Zabur sesudah (Kami tulis dalam) Lauh Mahfuzh, bahwasanya bumi ini dipusakai hamba-hamba-Ku yang saleh."
    }
  },
  {
    id: "perang-mutah",
    monthNumber: 5, // Jumadil Awal
    dayNumber: 1, // Perkiraan awal bulan
    title: "PERANG MU'TAH (MELAWAN ROMAWI)",
    description: "Bentrokan pertama dengan Kekaisaran Romawi Timur. Tiga panglima gugur syahid berturut-turut (Zaid bin Haritsah, Ja'far bin Abi Thalib, Abdullah bin Rawahah) sebelum Khalid bin Walid mengambil alih komando dan berhasil menyelamatkan pasukan.",
    quranicReference: {
      surah: "Al-Ahzab",
      ayah: "23",
      text: "مِّنَ الْمُؤْمِنِينَ رِجَالٌ صَدَقُوا مَا عَاهَدُوا اللَّهَ عَلَيْهِ ۖ فَمِنْهُم مَّن قَضَىٰ نَحْبَهُ وَمِنْهُم مَّن يَنتَظِرُ",
      translation: "Di antara orang-orang mukmin itu ada orang-orang yang menepati apa yang telah mereka janjikan kepada Allah; maka di antara mereka ada yang gugur. Dan di antara mereka ada (pula) yang menunggu-nunggu."
    }
  },
  {
    id: "perang-hunain",
    monthNumber: 10, // Syawal
    dayNumber: 10,
    title: "PERANG HUNAIN",
    description: "Pasukan Muslim yang berjumlah besar sempat kocar-kacir akibat kesombongan (merasa pasti menang karena jumlah). Terjebak dalam penyergapan suku Hawazin, sebelum akhirnya Rasulullah memanggil mereka kembali dan meraih kemenangan.",
    quranicReference: {
      surah: "At-Taubah",
      ayah: "25",
      text: "لَقَدْ نَصَرَكُمُ اللَّهُ فِي مَوَاطِنَ كَثِيرَةٍ ۙ وَيَوْمَ حُنَيْنٍ ۙ إِذْ أَعْجَبَتْكُمْ كَثْرَتُكُمْ فَلَمْ تُغْنِ عَنكُمْ شَيْئًا",
      translation: "Sesungguhnya Allah telah menolong kamu (hai para mukminin) di medan peperangan yang banyak, dan (ingatlah) peperangan Hunain, yaitu diwaktu kamu menjadi congkak karena banyaknya jumlah(mu), maka jumlah yang banyak itu tidak memberi manfaat kepadamu sedikitpun..."
    }
  }
];

let content = fs.readFileSync('@core/db/data/prophetic-events.db.ts', 'utf-8');
const newEvents = extraEvents.map(e => JSON.stringify(e, null, 2)).join(',\n  ');
content = content.replace(/\]\s*$/, `  ,${newEvents}\n]`);
fs.writeFileSync('@core/db/data/prophetic-events.db.ts', content);
console.log("DB Highly Expanded with 12 more massive historical events!");
