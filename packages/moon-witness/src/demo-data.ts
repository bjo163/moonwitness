import { createCtx, getModel, SUPERUSER_ID } from '@moon/orm'

export async function loadDemoData() {
  const Scripture = getModel('wx.scripture')
  const Book = getModel('wx.scripture.book')
  const Verse = getModel('wx.scripture.verse')
  const Tradition = getModel('wx.tradition')
  const TraditionItem = getModel('wx.tradition.item')
  const AsmaulHusna = getModel('wx.asmaul.husna')
  const Devotion = getModel('wx.devotion')

  if (!Scripture || !Book || !Verse || !Tradition || !TraditionItem || !AsmaulHusna || !Devotion) return

  const env = createCtx(SUPERUSER_ID, {}, getModel)

  // ── 1. Asmaul Husna (First 10 Names) ──
  const asmaulHusnaSeeds = [
    { number: 1, nameArabic: 'الرَّحْمَنُ', nameLatin: 'Ar-Rahman', translationId: 'Yang Maha Pengasih', translationEn: 'The Most Gracious', quranReference: 'QS 1:1, 55:1', meaning: 'Mencurahkan kasih sayang-Nya kepada seluruh makhluk tanpa terkecuali di dunia.' },
    { number: 2, nameArabic: 'الرَّحِيمُ', nameLatin: 'Ar-Rahim', translationId: 'Yang Maha Penyayang', translationEn: 'The Most Merciful', quranReference: 'QS 1:1, 2:163', meaning: 'Memberikan kasih sayang khusus bagi orang-orang beriman di akhirat kelak.' },
    { number: 3, nameArabic: 'الْمَلِكُ', nameLatin: 'Al-Malik', translationId: 'Yang Maha Merajai', translationEn: 'The King / Sovereign', quranReference: 'QS 59:23, 20:114', meaning: 'Penguasa mutlak atas seluruh alam semesta beserta segala isinya.' },
    { number: 4, nameArabic: 'الْقُدُّوسُ', nameLatin: 'Al-Quddus', translationId: 'Yang Maha Suci', translationEn: 'The Most Holy', quranReference: 'QS 59:23, 62:1', meaning: 'Maha Suci dari segala kekurangan, cela, dan kelemahan.' },
    { number: 5, nameArabic: 'السَّلاَمُ', nameLatin: 'As-Salam', translationId: 'Yang Maha Memberi Kesejahteraan', translationEn: 'The Source of Peace', quranReference: 'QS 59:23', meaning: 'Sumber kedamaian, keselamatan, dan ketenteraman bagi segenap makhluk.' },
    { number: 6, nameArabic: 'الْمُؤْمِنُ', nameLatin: 'Al-Mu’min', translationId: 'Yang Maha Memberi Keamanan', translationEn: 'The Granter of Security', quranReference: 'QS 59:23', meaning: 'Memberikan rasa aman dan kepastian kepada hamba-hamba yang beriman.' },
    { number: 7, nameArabic: 'الْمُهَيْمِنُ', nameLatin: 'Al-Muhaymin', translationId: 'Yang Maha Memelihara', translationEn: 'The Guardian / Preserver', quranReference: 'QS 59:23', meaning: 'Mengawasi, memelihara, dan menjaga seluruh ciptaan secara sempurna.' },
    { number: 8, nameArabic: 'الْعَزِيزُ', nameLatin: 'Al-Aziz', translationId: 'Yang Maha Perkasa', translationEn: 'The Almighty', quranReference: 'QS 59:23, 3:6', meaning: 'Kemuliaan dan keperkasaan yang tidak terkalahkan oleh kekuatan apa pun.' },
    { number: 9, nameArabic: 'الْجَبَّارُ', nameLatin: 'Al-Jabbar', translationId: 'Yang Maha Memaksa / Memperbaiki', translationEn: 'The Compeller / Restorer', quranReference: 'QS 59:23', meaning: 'Mampu memulihkan segala yang rusak dan menjalankan kehendak-Nya secara mutlak.' },
    { number: 10, nameArabic: 'الْمُتَكَبِّرُ', nameLatin: 'Al-Mutakabbir', translationId: 'Yang Maha Memiliki Kebesaran', translationEn: 'The Supreme / Majestic', quranReference: 'QS 59:23', meaning: 'Pemilik hakiki segala keagungan dan kebesaran yang tiada tanding.' }
  ]

  for (const item of asmaulHusnaSeeds) {
    const rows = await AsmaulHusna.fetch(AsmaulHusna, env, [['number', '=', item.number]])
    if (!rows.length) {
      await AsmaulHusna.spawn(AsmaulHusna, env, item)
    }
  }

  // ── 2. Scripture (Al-Qur'an) ──
  let quranScriptureId: number
  const quranRows = await Scripture.fetch(Scripture, env, [['slug', '=', 'al-quran']])
  if (!quranRows.length) {
    const qRow = await Scripture.spawn(Scripture, env, {
      name: 'Al-Qur’an Al-Karim',
      originalName: 'القرآن الكريم',
      slug: 'al-quran',
      canonicalCode: 'QURAN',
      sourceClass: 'REVELATION',
      religion: 'Islam',
      type: 'canonical',
      booksCount: 114,
      versesCount: 6236,
      prophet: 'Nabi Muhammad SAW',
      revelationEra: '610–632 M',
      description: 'Kalamullah yang diturunkan kepada Nabi Muhammad SAW sebagai mukjizat abadi dan petunjuk bagi seluruh umat manusia.'
    })
    quranScriptureId = qRow.id as number
  } else {
    quranScriptureId = quranRows[0].id as number
  }

  // ── 3. Scripture Books (Surah Al-Fatihah, Al-Baqarah, Al-Ikhlas) ──
  const bookSeeds = [
    { bookNumber: 1, name: 'Al-Fatihah', nameOriginal: 'الفاتحة', slug: 'al-fatihah', versesCount: 7, revelationType: 'MAKKIYAH', summary: 'Pembuka Al-Qur’an yang memuat intisari tauhid, ibadah, dan permohonan hidayah.' },
    { bookNumber: 2, name: 'Al-Baqarah', nameOriginal: 'البقرة', slug: 'al-baqarah', versesCount: 286, revelationType: 'MADANIYAH', summary: 'Surah terpanjang yang memuat petunjuk syariat, keimanan, kisah para nabi, dan ayat Kursi.' },
    { bookNumber: 112, name: 'Al-Ikhlas', nameOriginal: 'الإخلاص', slug: 'al-ikhlas', versesCount: 4, revelationType: 'MAKKIYAH', summary: 'Pernyataan kemurnian tauhid yang setara dengan sepertiga Al-Qur’an.' }
  ]

  const bookIds: Record<number, number> = {}
  for (const b of bookSeeds) {
    const rows = await Book.fetch(Book, env, [['scriptureId', '=', quranScriptureId], ['bookNumber', '=', b.bookNumber]])
    if (!rows.length) {
      const row = await Book.spawn(Book, env, {
        scriptureId: quranScriptureId,
        bookNumber: b.bookNumber,
        name: b.name,
        nameOriginal: b.nameOriginal,
        slug: b.slug,
        versesCount: b.versesCount,
        revelationType: b.revelationType,
        summary: b.summary
      })
      bookIds[b.bookNumber] = row.id as number
    } else {
      bookIds[b.bookNumber] = rows[0].id as number
    }
  }

  // ── 4. Sample Verses (Al-Fatihah 1-3, Al-Baqarah 255, Al-Ikhlas 1) ──
  const verseSeeds = [
    {
      bookNum: 1,
      verseNumber: 1,
      textOriginal: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
      textTransliteration: 'Bismillahir-rahmanir-rahim',
      translationId: 'Dengan nama Allah Yang Maha Pengasih, Maha Penyayang.',
      translationEn: 'In the name of Allah, the Entirely Merciful, the Especially Merciful.',
      juz: 1
    },
    {
      bookNum: 1,
      verseNumber: 2,
      textOriginal: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ',
      textTransliteration: 'Al-hamdu lillahi rabbil-alamin',
      translationId: 'Segala puji bagi Allah, Tuhan semesta alam.',
      translationEn: '[All] praise is [due] to Allah, Lord of the worlds.',
      juz: 1
    },
    {
      bookNum: 1,
      verseNumber: 3,
      textOriginal: 'الرَّحْمَٰنِ الرَّحِيمِ',
      textTransliteration: 'Ar-rahmanir-rahim',
      translationId: 'Maha Pengasih, Maha Penyayang.',
      translationEn: 'The Entirely Merciful, the Especially Merciful.',
      juz: 1
    },
    {
      bookNum: 2,
      verseNumber: 255,
      textOriginal: 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ',
      textTransliteration: 'Allahu la ilaha illa huwal-hayyul-qayyum, la ta’khudhuhu sinatuw-wa la nawm...',
      translationId: 'Allah, tidak ada tuhan selain Dia. Yang Mahahidup, Yang terus-menerus mengurus (makhluk-Nya), tidak mengantuk dan tidak tidur. Milik-Nya apa yang ada di langit dan apa yang ada di bumi.',
      translationEn: 'Allah - there is no deity except Him, the Ever-Living, the Sustainer of [all] existence. Neither drowsiness overtakes Him nor sleep.',
      juz: 3
    },
    {
      bookNum: 112,
      verseNumber: 1,
      textOriginal: 'قُلْ هُوَ اللَّهُ أَحَدٌ',
      textTransliteration: 'Qul huwallahu ahad',
      translationId: 'Katakanlah (Muhammad), “Dialah Allah, Yang Maha Esa.”',
      translationEn: 'Say, "He is Allah, [who is] One."',
      juz: 30
    }
  ]

  for (const v of verseSeeds) {
    const bId = bookIds[v.bookNum]
    if (!bId) continue
    const rows = await Verse.fetch(Verse, env, [['bookId', '=', bId], ['verseNumber', '=', v.verseNumber]])
    if (!rows.length) {
      await Verse.spawn(Verse, env, {
        scriptureId: quranScriptureId,
        bookId: bId,
        verseNumber: v.verseNumber,
        textOriginal: v.textOriginal,
        textTransliteration: v.textTransliteration,
        translationId: v.translationId,
        translationEn: v.translationEn,
        juz: v.juz
      })
    }
  }

  // ── 5. Traditions / Hadith Collections ──
  const traditionSeeds = [
    {
      slug: 'bukhari',
      name: 'Shahih al-Bukhari',
      originalName: 'صحيح البخاري',
      author: 'Imam Muhammad bin Ismail al-Bukhari (194–256 H)',
      totalItems: 7563,
      gradeLevel: 'SHAHIH',
      category: 'Hadits Shahih',
      description: 'Kitab hadits paling otentik setelah Al-Qur’an, memuat riwayat shahih dengan sanad tersambung mutawatir.'
    },
    {
      slug: 'nawawi-40',
      name: 'Al-Arba’in An-Nawawiyyah',
      originalName: 'الأربعون النووية',
      author: 'Imam Abu Zakariya Yahya bin Syaraf an-Nawawi (631–676 H)',
      totalItems: 42,
      gradeLevel: 'SHAHIH',
      category: 'Kompilasi Tematik',
      description: 'Kumpulan 42 hadits pokok yang merangkum kaidah-kaidah agung ajaran Islam.'
    }
  ]

  const traditionIds: Record<string, number> = {}
  for (const t of traditionSeeds) {
    const rows = await Tradition.fetch(Tradition, env, [['slug', '=', t.slug]])
    if (!rows.length) {
      const row = await Tradition.spawn(Tradition, env, {
        scriptureId: quranScriptureId,
        slug: t.slug,
        name: t.name,
        originalName: t.originalName,
        author: t.author,
        totalItems: t.totalItems,
        gradeLevel: t.gradeLevel,
        category: t.category,
        description: t.description
      })
      traditionIds[t.slug] = row.id as number
    } else {
      traditionIds[t.slug] = rows[0].id as number
    }
  }

  // ── 6. Tradition Items ──
  const hadithSeeds = [
    {
      collectionSlug: 'nawawi-40',
      number: 1,
      title: 'Semua Amal Bergantung pada Niat',
      textOriginal: 'إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى',
      textTransliteration: 'Innamal-a’malu bin-niyyat, wa innama likullimri’in ma nawa',
      translationId: 'Sesungguhnya setiap amal perbuatan bergantung pada niatnya, dan sesungguhnya setiap orang akan mendapatkan sesuai apa yang dia niatkan.',
      translationEn: 'Actions are according to intentions, and everyone will get what was intended for.',
      narrator: 'Umar bin al-Khattab RA',
      grade: 'SHAHIH'
    },
    {
      collectionSlug: 'bukhari',
      number: 1,
      title: 'Awal Mula Turunnya Wahyu',
      textOriginal: 'بَدْءُ الْوَحْيِ إِلَى رَسُولِ اللَّهِ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ الرُّؤْيَا الصَّالِحَةُ فِي النَّوْمِ',
      textTransliteration: 'Bad’ul-wahyi ila Rasulillahi shallallahu ‘alaihi wa sallam ar-ru’yash-shalihatu fin-nawm',
      translationId: 'Permulaan wahyu yang datang kepada Rasulullah SAW adalah mimpi yang benar dalam tidur.',
      translationEn: 'The commencement of the Divine Inspiration to Allah’s Messenger was in the form of good dreams.',
      narrator: 'Aisyah RA',
      grade: 'SHAHIH'
    }
  ]

  for (const h of hadithSeeds) {
    const cId = traditionIds[h.collectionSlug]
    if (!cId) continue
    const rows = await TraditionItem.fetch(TraditionItem, env, [['collectionId', '=', cId], ['number', '=', h.number]])
    if (!rows.length) {
      await TraditionItem.spawn(TraditionItem, env, {
        collectionId: cId,
        number: h.number,
        title: h.title,
        textOriginal: h.textOriginal,
        textTransliteration: h.textTransliteration,
        translationId: h.translationId,
        translationEn: h.translationEn,
        narrator: h.narrator,
        grade: h.grade
      })
    }
  }

  // ── 7. Devotions (Adhkar & Prayers) ──
  const devotionSeeds = [
    {
      type: 'dhikr',
      number: 1,
      title: 'Tasbih & Tahmid Harian',
      textOriginal: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ سُبْحَانَ اللَّهِ الْعَظِيمِ',
      textTransliteration: 'Subhanallahi wa bihamdihi, subhanallahil-azim',
      translationId: 'Maha Suci Allah dengan segala puji bagi-Nya, Maha Suci Allah Yang Maha Agung.',
      translationEn: 'Glory be to Allah and His praise, glory be to Allah the Supreme.',
      category: 'Dzikir Pagi & Petang',
      source: 'HR. Bukhari & Muslim'
    },
    {
      type: 'dua',
      number: 2,
      title: 'Doa Kebaikan Dunia & Akhirat',
      textOriginal: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ',
      textTransliteration: 'Rabbana atina fid-dunya hasanah wa fil-akhirati hasanah wa qina ‘adhaban-nar',
      translationId: 'Ya Tuhan kami, berilah kami kebaikan di dunia dan kebaikan di akhirat, dan lindungilah kami dari azab neraka.',
      translationEn: 'Our Lord, give us in this world that which is good and in the Hereafter that which is good and save us from the torment of the Fire.',
      category: 'Doa Universal',
      reference: 'QS 2:201'
    }
  ]

  for (const d of devotionSeeds) {
    const rows = await Devotion.fetch(Devotion, env, [['title', '=', d.title]])
    if (!rows.length) {
      await Devotion.spawn(Devotion, env, {
        type: d.type,
        number: d.number,
        title: d.title,
        textOriginal: d.textOriginal,
        textTransliteration: d.textTransliteration,
        translationId: d.translationId,
        translationEn: d.translationEn,
        category: d.category,
        source: d.source,
        reference: d.reference
      })
    }
  }

  console.log('[moon-witness] Demo data loaded: 10 Asmaul Husna, 1 Scripture, 3 Books, 5 Verses, 2 Traditions, 2 Hadith items, 2 Devotions')
}
