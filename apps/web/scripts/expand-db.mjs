import fs from 'fs';

const extraEvents = [
  {
    id: "karbala",
    monthNumber: 1,
    dayNumber: 10,
    title: "TRAGEDI KARBALA",
    description: "Gugurnya cucu kesayangan Rasulullah SAW, Husain bin Ali RA, beserta keluarganya di Padang Karbala. Sebuah tragedi paling memilukan dalam sejarah perpolitikan Islam yang mengajarkan keberanian melawan tirani.",
    quranicReference: {
      surah: "Al-Ahzab",
      ayah: "33",
      text: "إِنَّمَا يُرِيدُ اللَّهُ لِيُذْهِبَ عَنكُمُ الرِّجْسَ أَهْلَ الْبَيْتِ وَيُطَهِّرَكُمْ تَطْهِيرًا",
      translation: "Sesungguhnya Allah bermaksud hendak menghilangkan dosa dari kamu, hai ahlul bait dan membersihkan kamu sebersih-bersihnya."
    }
  },
  {
    id: "perang-khandaq",
    monthNumber: 10,
    dayNumber: 5,
    title: "PERANG KHANDAQ (AHZAB)",
    description: "Pasukan sekutu (Ahzab) Quraisy dan Yahudi mengepung Madinah. Atas usul Salman Al-Farisi, umat Islam menggali parit raksasa (Khandaq) sebagai sistem pertahanan, yang sukses menggagalkan invasi musuh.",
    quranicReference: {
      surah: "Al-Ahzab",
      ayah: "9",
      text: "يَا أَيُّهَا الَّذِينَ آمَنُوا اذْكُرُوا نِعْمَةَ اللَّهِ عَلَيْكُمْ إِذْ جَاءَتْكُمْ جُنُودٌ فَأَرْسَلْنَا عَلَيْهِمْ رِيحًا وَجُنُودًا لَّمْ تَرَوْهَا",
      translation: "Hai orang-orang yang beriman, ingatlah akan nikmat Allah (yang telah dikaruniakan) kepadamu ketika datang kepadamu tentara-tentara, lalu Kami kirimkan kepada mereka angin topan dan tentara yang tidak dapat kamu melihatnya."
    }
  },
  {
    id: "perang-tabuk",
    monthNumber: 7,
    dayNumber: 10,
    title: "PERANG TABUK",
    description: "Ekspedisi militer terbesar dan terakhir yang dipimpin langsung oleh Nabi Muhammad SAW menuju perbatasan Romawi di musim panas yang ekstrem. Pasukan Romawi akhirnya mundur tanpa pertempuran.",
    quranicReference: {
      surah: "At-Taubah",
      ayah: "117",
      text: "لَّقَد تَّابَ اللَّهُ عَلَى النَّبِيِّ وَالْمُهَاجِرِينَ وَالْأَنصَارِ الَّذِينَ اتَّبَعُوهُ فِي سَاعَةِ الْعُسْرَةِ",
      translation: "Sesungguhnya Allah telah menerima taubat Nabi, orang-orang muhajirin dan orang-orang anshar yang mengikuti Nabi dalam masa kesulitan (Perang Tabuk)."
    }
  },
  {
    id: "haji-wada",
    monthNumber: 12,
    dayNumber: 9,
    title: "KHUTBAH HAJI WADA'",
    description: "Khutbah perpisahan monumental Nabi Muhammad SAW di Lembah Uranah, Arafah. Menetapkan prinsip dasar hak asasi manusia, kesetaraan ras, penghapusan riba, dan hak-hak wanita dalam Islam.",
    quranicReference: {
      surah: "Al-Hujurat",
      ayah: "13",
      text: "يَا أَيُّهَا النَّاسُ إِنَّا خَلَقْنَاكُم مِّن ذَكَرٍ وَأُنثَىٰ وَجَعَلْنَاكُمْ شُعُوبًا وَقَبَائِلَ لِتَعَارَفُوا ۚ إِنَّ أَكْرَمَكُمْ عِندَ اللَّهِ أَتْقَاكُمْ",
      translation: "Hai manusia, sesungguhnya Kami menciptakan kamu dari seorang laki-laki dan seorang perempuan dan menjadikan kamu berbangsa-bangsa dan bersuku-suku supaya kamu saling kenal-mengenal. Sesungguhnya orang yang paling mulia di antara kamu di sisi Allah ialah orang yang paling takwa."
    }
  },
  {
    id: "pembebasan-al-aqsa",
    monthNumber: 7, // Rajab
    dayNumber: 27,
    title: "PEMBEBASAN BAITUL MAQDIS (AL-AQSA)",
    description: "Bertepatan dengan peringatan Isra Mi'raj, Salahuddin Al-Ayyubi berhasil membebaskan kembali Masjidil Aqsa dan kota Yerusalem dari Pasukan Salib setelah 88 tahun dikuasai, tanpa ada pembantaian balasan.",
    quranicReference: {
      surah: "Al-Isra",
      ayah: "7",
      text: "إِنْ أَحْسَنتُمْ أَحْسَنتُمْ لِأَنفُسِكُمْ ۖ وَإِنْ أَسَأْتُمْ فَلَهَا ۚ فَإِذَا جَاءَ وَعْدُ الْآخِرَةِ لِيَسُوءُوا وُجُوهَكُمْ وَلِيَدْخُلُوا الْمَسْجِدَ كَمَا دَخَلُوهُ أَوَّلَ مَرَّةٍ وَلِيُتَبِّرُوا مَا عَلَوْا تَتْبِيرًا",
      translation: "Jika kamu berbuat baik (berarti) kamu berbuat baik bagi dirimu sendiri dan jika kamu berbuat jahat, maka (kejahatan) itu bagi dirimu sendiri, dan apabila datang saat hukuman bagi (kejahatan) yang kedua, (Kami datangkan orang-orang lain) untuk menyuramkan muka-muka kamu dan mereka masuk ke dalam masjid (Al-Aqsa), sebagaimana musuh-musuhmu memasukinya pada kali pertama dan untuk membinasakan sehabis-habisnya apa saja yang mereka kuasai."
    }
  }
];

let content = fs.readFileSync('@core/db/data/prophetic-events.db.ts', 'utf-8');
const newEvents = extraEvents.map(e => JSON.stringify(e, null, 2)).join(',\n  ');
content = content.replace(/\]\s*$/, `  ,${newEvents}\n]`);
fs.writeFileSync('@core/db/data/prophetic-events.db.ts', content);
console.log("DB Expanded!");
