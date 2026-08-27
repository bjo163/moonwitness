import fs from 'fs';

const extraEvents = [
  {
    id: "penyerahan-kunci-yerusalem",
    monthNumber: 3, // Rabiul Awwal
    dayNumber: 15,
    title: "PENYERAHAN KUNCI BAITUL MAQDIS",
    description: "Patriark Sophronius menyerahkan kunci Yerusalem HANYA kepada Khalifah Umar bin Khattab. Umar menjamin keamanan penuh bagi umat Kristen melalui 'Perjanjian Umar' (Al-Uhda Al-Omariyya).",
    quranicReference: {
      surah: "Al-Ma'idah",
      ayah: "8",
      text: "وَلَا يَجْرِمَنَّكُمْ شَنَآنُ قَوْمٍ عَلَىٰ أَلَّا تَعْدِلُوا",
      translation: "Dan janganlah kebencianmu terhadap suatu kaum mendorong kamu untuk berlaku tidak adil."
    }
  },
  {
    id: "lahir-ibnu-haytham",
    monthNumber: 1, // Muharram
    dayNumber: 1, // 354 H
    title: "LAHIRNYA BAPAK OPTIK MODERN (IBNU AL-HAYTHAM)",
    description: "Lahirnya fisikawan jenius yang mematahkan teori penglihatan Yunani Kuno. Lewat karyanya 'Kitab al-Manazir' (Book of Optics), ia membuktikan bahwa cahaya bergerak dari benda ke mata, menemukan prinsip kamera obscura.",
    quranicReference: {
      surah: "An-Nur",
      ayah: "35",
      text: "اللَّهُ نُورُ السَّمَاوَاتِ وَالْأَرْضِ",
      translation: "Allah (Pemberi) cahaya (kepada) langit dan bumi."
    }
  },
  {
    id: "wafat-umar-abdul-aziz",
    monthNumber: 7, // Rajab
    dayNumber: 25, // 101 H
    title: "WAFATNYA KHALIFAH UMAR BIN ABDUL AZIZ",
    description: "Meninggalnya Khulafaur Rasyidin ke-5. Dalam masa jabatannya yang hanya 2,5 tahun, kesejahteraan memuncak hingga tidak ada satupun orang miskin yang berhak menerima zakat di seluruh wilayah kekhalifahan.",
    quranicReference: {
      surah: "An-Nisa",
      ayah: "58",
      text: "إِنَّ اللَّهَ يَأْمُرُكُمْ أَن تُؤَدُّوا الْأَمَانَاتِ إِلَىٰ أَهْلِهَا",
      translation: "Sesungguhnya Allah menyuruh kamu menyampaikan amanat kepada yang berhak menerimanya."
    }
  },
  {
    id: "penaklukan-sindh",
    monthNumber: 9, // Ramadhan
    dayNumber: 10, // 93 H
    title: "PENAKLUKAN SINDH (INDIA)",
    description: "Panglima muda Muhammad bin Qasim (17 tahun) memimpin pasukan Muslim menaklukkan Lembah Sungai Indus (Sindh), membawa cahaya Islam ke perbatasan anak benua India.",
    quranicReference: {
      surah: "Al-Hajj",
      ayah: "41",
      text: "الَّذِينَ إِن مَّكَّنَّاهُمْ فِي الْأَرْضِ أَقَامُوا الصَّلَاةَ وَآتَوُا الزَّكَاةَ",
      translation: "(Yaitu) orang-orang yang jika Kami teguhkan kedudukan mereka di muka bumi niscaya mereka mendirikan sembahyang, menunaikan zakat..."
    }
  },
  {
    id: "penaklukan-sisilia",
    monthNumber: 3, // Rabiul Awwal
    dayNumber: 18, // 212 H
    title: "PENAKLUKAN SISILIA (ITALIA)",
    description: "Panglima sekaligus ahli fikih, Asad bin Al-Furat, mendarat dan menaklukkan Pulau Sisilia, mengubah pulau di selatan Italia tersebut menjadi salah satu pusat peradaban dan pertanian Islam di Eropa selama lebih dari 200 tahun.",
    quranicReference: {
      surah: "Al-Baqarah",
      ayah: "269",
      text: "يُؤْتِي الْحِكْمَةَ مَن يَشَاءُ",
      translation: "Allah menganugerahkan hikmah kepada siapa yang dikehendaki-Nya."
    }
  },
  {
    id: "jatuhnya-akko",
    monthNumber: 6, // Jumadil Akhir
    dayNumber: 17, // 690 H
    title: "JATUHNYA AKKO (AKHIR PERANG SALIB)",
    description: "Kesultanan Mamluk berhasil merebut kota benteng Akko, menandai pengusiran total dan permanen Pasukan Salib dari Tanah Suci dan Suriah setelah dua abad penjajahan brutal.",
    quranicReference: {
      surah: "Al-Isra",
      ayah: "81",
      text: "وَقُلْ جَاءَ الْحَقُّ وَزَهَقَ الْبَاطِلُ ۚ إِنَّ الْبَاطِلَ كَانَ زَهُوقًا",
      translation: "Dan katakanlah: 'Yang benar telah datang dan yang batil telah lenyap'. Sesungguhnya yang batil itu adalah sesuatu yang pasti lenyap."
    }
  },
  {
    id: "pengepungan-konstantinopel-pertama",
    monthNumber: 10, // Syawal
    dayNumber: 2, // Sekitar 52 H
    title: "PENGEPUNGAN KONSTANTINOPEL PERTAMA",
    description: "Ekspedisi laut pertama umat Islam yang mengepung Konstantinopel. Sahabat Nabi yang sangat tua, Abu Ayyub Al-Ansari (tuan rumah Nabi saat Hijrah), ikut serta dan gugur syahid di bawah tembok raksasa Bizantium tersebut.",
    quranicReference: {
      surah: "At-Taubah",
      ayah: "41",
      text: "انفِرُوا خِفَافًا وَثِقَالًا وَجَاهِدُوا بِأَمْوَالِكُمْ وَأَنفُسِكُمْ فِي سَبِيلِ اللَّهِ",
      translation: "Berangkatlah kamu baik dalam keadaan merasa ringan maupun berat, dan berjihadlah kamu dengan harta dan dirimu di jalan Allah."
    }
  },
  {
    id: "pertempuran-lepanto",
    monthNumber: 5, // Jumadil Awal
    dayNumber: 17, // 979 H (Oktober 1571)
    title: "PERTEMPURAN LAUT LEPANTO",
    description: "Kekalahan besar pertama armada laut Kesultanan Utsmaniyah oleh Liga Suci Katolik di Teluk Patras. Ratusan kapal galley tenggelam dan puluhan ribu pelaut elit gugur, meruntuhkan mitos tak terkalahkannya angkatan laut Turki.",
    quranicReference: {
      surah: "Ali 'Imran",
      ayah: "140",
      text: "وَتِلْكَ الْأَيَّامُ نُدَاوِلُهَا بَيْنَ النَّاسِ",
      translation: "...Dan masa (kejayaan dan kehancuran) itu Kami pergilirkan di antara manusia..."
    }
  },
  {
    id: "wafat-ibnu-battuta",
    monthNumber: 8, // Sya'ban
    dayNumber: 25, // Sekitar 770 H
    title: "WAFATNYA PENJELAJAH TERBESAR (IBNU BATTUTA)",
    description: "Wafatnya Ibnu Battuta, pelancong terbesar dalam sejarah umat manusia yang menempuh jarak 117.000 km (melebihi Marco Polo), dari Maroko hingga Nusantara (Samudera Pasai) dan Tiongkok, demi menuntut ilmu.",
    quranicReference: {
      surah: "Al-Ankabut",
      ayah: "20",
      text: "قُلْ سِيرُوا فِي الْأَرْضِ فَانظُرُوا كَيْفَ بَدَأَ الْخَلْقَ",
      translation: "Katakanlah: 'Berjalanlah di (muka) bumi, maka perhatikanlah bagaimana Allah menciptakan (manusia) dari permulaannya'."
    }
  },
  {
    id: "kelahiran-al-khawarizmi",
    monthNumber: 1, // Muharram
    dayNumber: 1, // Sekitar 164 H
    title: "LAHIRNYA BAPAK ALJABAR (AL-KHAWARIZMI)",
    description: "Lahirnya jenius matematika Persia yang menemukan konsep Aljabar (Algebra) dan memperkenalkan angka nol (0) dari sistem Hindu-Arab ke dunia. Kata 'Algoritma' diambil dari ejaan Latin namanya (Algoritmi).",
    quranicReference: {
      surah: "Al-Baqarah",
      ayah: "164",
      text: "إِنَّ فِي خَلْقِ السَّمَاوَاتِ وَالْأَرْضِ وَاخْتِلَافِ اللَّيْلِ وَالنَّهَارِ... لَآيَاتٍ لِّقَوْمٍ يَعْقِلُونَ",
      translation: "Sesungguhnya dalam penciptaan langit dan bumi, silih bergantinya malam dan siang... sungguh (terdapat) tanda-tanda (keesaan dan kebesaran Allah) bagi kaum yang memikirkan."
    }
  },
  {
    id: "ghadir-khumm",
    monthNumber: 12, // Dzulhijjah
    dayNumber: 18, // 10 H
    title: "PERISTIWA GHADIR KHUMM",
    description: "Sekembalinya dari Haji Wada', Rasulullah SAW menghentikan karavan di oase Ghadir Khumm. Di sanalah beliau mengangkat tangan Ali bin Abi Thalib dan bersabda: 'Barangsiapa yang menjadikan aku maulanya (pemimpinnya), maka Ali adalah maulanya.'",
    quranicReference: {
      surah: "Al-Ma'idah",
      ayah: "67",
      text: "يَا أَيُّهَا الرَّسُولُ بَلِّغْ مَا أُنزِلَ إِلَيْكَ مِن رَّبِّكَ",
      translation: "Hai Rasul, sampaikanlah apa yang diturunkan kepadamu dari Tuhanmu."
    }
  }
];

let content = fs.readFileSync('@core/db/data/prophetic-events.db.ts', 'utf-8');
const newEvents = extraEvents.map(e => JSON.stringify(e, null, 2)).join(',\n  ');
content = content.replace(/\]\s*$/, `  ,${newEvents}\n]`);
fs.writeFileSync('@core/db/data/prophetic-events.db.ts', content);
console.log("DB Extended up to massive ~60+ events!");
