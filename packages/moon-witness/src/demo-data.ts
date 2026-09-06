import { createCtx, getModel, SUPERUSER_ID, loadJsonSeed } from '@moon/orm'
import https from 'node:https'
import http from 'node:http'

function request(url: string): Promise<any> {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http
    client.get(url, (res: any) => {
      let data = ''
      res.on('data', (chunk: Buffer | string) => data += chunk)
      res.on('end', () => {
        try {
          resolve(JSON.parse(data))
        } catch (e: unknown) {
          reject(new Error(`Failed to parse JSON from ${url}: ${e instanceof Error ? e.message : String(e)}`))
        }
      })
    }).on('error', (err: unknown) => reject(err))
  })
}

async function fetchQuranSurah(number: number): Promise<any> {
  const url = `https://api.quran.com/api/v4/verses/by_chapter/${number}?translations=33&language=id&per_page=300`
  return await request(url)
}

export async function loadDemoData() {
  const Scripture = getModel('wx.scripture')
  const Book = getModel('wx.scripture.book')
  const Verse = getModel('wx.scripture.verse')
  const Tradition = getModel('wx.tradition')
  const TraditionItem = getModel('wx.tradition.item')
  const AsmaulHusna = getModel('wx.asmaul.husna')
  const Devotion = getModel('wx.devotion')
  const Figure = getModel('wx.figure')
  const FigureRole = getModel('wx.figure.role')
  const Religion = getModel('wx.religion')
  const Entity = getModel('wx.entity')
  const Provenance = getModel('wx.provenance')
  const Source = getModel('wx.source')

  if (!Scripture || !Book || !Verse || !Tradition || !TraditionItem || !AsmaulHusna || !Devotion || !Figure || !FigureRole || !Religion || !Entity || !Provenance || !Source) return

  const env = createCtx(SUPERUSER_ID, {}, getModel)

  console.log('[seeder] Starting comprehensive demo data seeding from credible sources...')

  // ── 0. Religions (12 Major World Religions) ──
  const religionSeeds = [
    { code: 'ISLAM', name: 'Islam', description: 'Abrahamic monotheistic religion centered on the Quran and the teachings of Prophet Muhammad.' },
    { code: 'CHRISTIANITY', name: 'Christianity', description: 'Abrahamic religion centered on the life and teachings of Jesus Christ.' },
    { code: 'JUDAISM', name: 'Judaism', description: 'Abrahamic religion of the Jewish people, based on the Torah and Talmud.' },
    { code: 'HINDUISM', name: 'Hinduism', description: 'Dharma religion from the Indian subcontinent with diverse traditions and scriptures like Vedas and Bhagavad Gita.' },
    { code: 'BUDDHISM', name: 'Buddhism', description: 'Dharma religion founded by Siddhartha Gautama (Buddha) focusing on the path to enlightenment.' },
    { code: 'SIKHISM', name: 'Sikhism', description: 'Monotheistic religion founded by Guru Nanak in Punjab, centered on Guru Granth Sahib.' },
    { code: 'JAINISM', name: 'Jainism', description: 'Ancient Indian religion emphasizing non-violence (ahimsa) and spiritual liberation.' },
    { code: 'TAOISM', name: 'Taoism', description: 'Chinese philosophy and religion based on the Tao Te Ching and teachings of Laozi.' },
    { code: 'CONFUCIANISM', name: 'Confucianism', description: 'Chinese ethical and philosophical system based on the teachings of Confucius.' },
    { code: 'SHINTO', name: 'Shinto', description: 'Indigenous spirituality of Japan centered on kami (spirits) and shrine worship.' },
    { code: 'ZOROASTRIANISM', name: 'Zoroastrianism', description: 'Ancient Persian monotheistic religion founded by Zoroaster (Zarathustra).' },
    { code: 'BAHAI', name: "Bahá'í", description: "Monotheistic religion founded by Bahá'u'lláh emphasizing unity of humanity and religions." }
  ]
  for (const r of religionSeeds) {
    const rows = await Religion.fetch(Religion, env, [['code', '=', r.code]])
    if (!rows.length) {
      const entity = await Entity.spawn(Entity, env, {
        canonicalKey: `religion:${r.code.toLowerCase()}`,
        kind: 'RELIGION',
        label: r.name,
        name: r.name,
        sourceClass: 'GOVERNANCE_RECORD',
        epistemicLane: 'CORE',
        authorityClass: 'NOT_APPLICABLE',
        operationalStatus: 'ESTABLISHED',
        active: true
      })
      await Religion.spawn(Religion, env, { entityId: entity.id as number, code: r.code, name: r.name, description: r.description, active: true })
    }
  }

  // ── 1. Sources first (required by Provenance) ──
  const sourceSeeds = [
    { stableKey: 'source:quran-com-api', name: 'Quran.com API v4', notes: 'REST API for Quran text, translations, and audio', sourceUrl: 'https://api.quran.com/api/v4' },
    { stableKey: 'source:sahih-bukhari', name: 'Sahih Bukhari Digital', notes: 'Digital edition of Sahih Bukhari hadith collection', sourceUrl: 'https://sahihbukhari.com' },
    { stableKey: 'source:sahih-muslim', name: 'Sahih Muslim Digital', notes: 'Digital edition of Sahih Muslim hadith collection', sourceUrl: 'https://sunnah.com' }
  ]
  const sourceIds: Record<string, number> = {}
  for (const s of sourceSeeds) {
    const rows = await Source.fetch(Source, env, [['name', '=', s.name]])
    if (!rows.length) {
      const row = await Source.spawn(Source, env, s)
      sourceIds[s.name] = row.id as number
    } else {
      sourceIds[s.name] = rows[0].id as number
    }
  }

  // ── 2. Provenance (depends on Source) ──
  const provenanceSeeds = [
    { stableKey: 'provenance:quran-com-api', name: 'Quran.com API', evidenceNote: 'Primary source for Quranic text, translation, and audio from https://quran.com', sourceReference: 'https://quran.com', sourceId: sourceIds['Quran.com API v4'] },
    { stableKey: 'provenance:sahih-bukhari', name: 'Sahih Bukhari', evidenceNote: 'Authentic hadith collection by Imam Bukhari (194–256 H)', sourceReference: 'https://sahihbukhari.com', sourceId: sourceIds['Sahih Bukhari Digital'] },
    { stableKey: 'provenance:sahih-muslim', name: 'Sahih Muslim', evidenceNote: 'Authentic hadith collection by Imam Muslim (202–261 H)', sourceReference: 'https://sunnah.com', sourceId: sourceIds['Sahih Muslim Digital'] }
  ]
  const provenanceIds: Record<string, number> = {}
  for (const p of provenanceSeeds) {
    const rows = await Provenance.fetch(Provenance, env, [['stableKey', '=', p.stableKey]])
    if (!rows.length) {
      const row = await Provenance.spawn(Provenance, env, p)
      provenanceIds[p.name] = row.id as number
    } else {
      provenanceIds[p.name] = rows[0].id as number
    }
  }

  // ── 3. Figures / Prophets ──
  const figureSeeds = [
    { name: 'Adam AS', stableKey: 'figure:adam', lifeStart: '4000-01-01 BC', lifeEnd: '3000-01-01 BC', notes: 'First human and prophet in Islamic tradition.', roleCode: 'PROPHET', religionCode: 'ISLAM', certainty: 'ESTABLISHED' },
    { name: 'Nuh AS', stableKey: 'figure:nuh', lifeStart: '2900-01-01 BC', lifeEnd: '2800-01-01 BC', notes: 'Prophet Noah, built the ark.', roleCode: 'PROPHET', religionCode: 'ISLAM', certainty: 'ESTABLISHED' },
    { name: 'Ibrahim AS', stableKey: 'figure:ibrahim', lifeStart: '2000-01-01 BC', lifeEnd: '1850-01-01 BC', notes: 'Prophet Abraham, father of monotheism.', roleCode: 'PROPHET', religionCode: 'ISLAM', certainty: 'ESTABLISHED' },
    { name: 'Musa AS', stableKey: 'figure:musa', lifeStart: '1400-01-01 BC', lifeEnd: '1280-01-01 BC', notes: 'Prophet Moses, received the Taurat.', roleCode: 'PROPHET', religionCode: 'ISLAM', certainty: 'ESTABLISHED' },
    { name: 'Daud AS', stableKey: 'figure:daud', lifeStart: '1000-01-01 BC', lifeEnd: '0960-01-01 BC', notes: 'Prophet David, received the Zabur.', roleCode: 'PROPHET', religionCode: 'ISLAM', certainty: 'ESTABLISHED' },
    { name: 'Isa AS', stableKey: 'figure:isa', lifeStart: '0005-01-01 BC', lifeEnd: '0030-01-01', notes: 'Prophet Jesus, received the Injil.', roleCode: 'PROPHET', religionCode: 'ISLAM', certainty: 'ESTABLISHED' },
    { name: 'Muhammad SAW', stableKey: 'figure:muhammad', lifeStart: '0570-01-01', lifeEnd: '0632-01-01', notes: 'Last prophet of Islam, received the Quran.', roleCode: 'PROPHET', religionCode: 'ISLAM', certainty: 'ESTABLISHED' },
    { name: 'Abraham', stableKey: 'figure:abraham', lifeStart: '2000-01-01 BC', lifeEnd: '1850-01-01 BC', notes: 'Patriarch of Judaism, Christianity, and Islam.', roleCode: 'PATRIARCH', religionCode: 'JUDAISM', certainty: 'ESTABLISHED' },
    { name: 'Moses', stableKey: 'figure:moses', lifeStart: '1400-01-01 BC', lifeEnd: '1280-01-01 BC', notes: 'Greatest prophet in Judaism, received the Torah.', roleCode: 'PROPHET', religionCode: 'JUDAISM', certainty: 'ESTABLISHED' },
    { name: 'David', stableKey: 'figure:david', lifeStart: '1000-01-01 BC', lifeEnd: '0960-01-01 BC', notes: 'King of Israel and author of Psalms.', roleCode: 'KING', religionCode: 'JUDAISM', certainty: 'ESTABLISHED' },
    { name: 'Jesus Christ', stableKey: 'figure:jesus', lifeStart: '0005-01-01 BC', lifeEnd: '0030-01-01', notes: 'Central figure of Christianity.', roleCode: 'MESSIAH', religionCode: 'CHRISTIANITY', certainty: 'ESTABLISHED' },
    { name: 'Mary', stableKey: 'figure:mary', lifeStart: '0005-01-01 BC', lifeEnd: '0035-01-01', notes: 'Mother of Jesus Christ.', roleCode: 'MOTHER', religionCode: 'CHRISTIANITY', certainty: 'ESTABLISHED' },
    { name: 'Paul', stableKey: 'figure:paul', lifeStart: '0005-01-01', lifeEnd: '0067-01-01', notes: 'Apostle who spread Christianity.', roleCode: 'APOSTLE', religionCode: 'CHRISTIANITY', certainty: 'ESTABLISHED' },
    { name: 'Krishna', stableKey: 'figure:krishna', lifeStart: '1000-01-01 BC', lifeEnd: '1000-01-01 BC', notes: 'Hindu deity and avatar of Vishnu.', roleCode: 'DEITY', religionCode: 'HINDUISM', certainty: 'ESTABLISHED' },
    { name: 'Rama', stableKey: 'figure:rama', lifeStart: '1500-01-01 BC', lifeEnd: '1500-01-01 BC', notes: 'Hindu deity and avatar of Vishnu, hero of Ramayana.', roleCode: 'DEITY', religionCode: 'HINDUISM', certainty: 'ESTABLISHED' },
    { name: 'Vyasa', stableKey: 'figure:vyasa', lifeStart: '1500-01-01 BC', lifeEnd: '1400-01-01 BC', notes: 'Sage who compiled the Vedas and authored Mahabharata.', roleCode: 'SAGE', religionCode: 'HINDUISM', certainty: 'PROVISIONAL' },
    { name: 'Siddhartha Gautama', stableKey: 'figure:buddha', lifeStart: '0483-01-01 BC', lifeEnd: '0403-01-01 BC', notes: 'Founder of Buddhism, attained enlightenment under the Bodhi tree.', roleCode: 'BUDDHA', religionCode: 'BUDDHISM', certainty: 'ESTABLISHED' },
    { name: 'Ananda', stableKey: 'figure:ananda', lifeStart: '0483-01-01 BC', lifeEnd: '0400-01-01 BC', notes: 'Primary attendant of Buddha.', roleCode: 'DISCIPLE', religionCode: 'BUDDHISM', certainty: 'ESTABLISHED' },
    { name: 'Guru Nanak', stableKey: 'figure:nanak', lifeStart: '1469-01-01', lifeEnd: '1539-01-01', notes: 'Founder of Sikhism.', roleCode: 'GURU', religionCode: 'SIKHISM', certainty: 'ESTABLISHED' },
    { name: 'Guru Gobind Singh', stableKey: 'figure:gobind', lifeStart: '1666-01-01', lifeEnd: '1708-01-01', notes: 'Tenth and last Sikh Guru.', roleCode: 'GURU', religionCode: 'SIKHISM', certainty: 'ESTABLISHED' },
    { name: 'Mahavira', stableKey: 'figure:mahavira', lifeStart: '0600-01-01 BC', lifeEnd: '0540-01-01 BC', notes: '24th Tirthankara of Jainism.', roleCode: 'TIRTHANKARA', religionCode: 'JAINISM', certainty: 'ESTABLISHED' },
    { name: 'Laozi', stableKey: 'figure:laozi', lifeStart: '0600-01-01 BC', lifeEnd: '0530-01-01 BC', notes: 'Founder of Taoism, author of Tao Te Ching.', roleCode: 'FOUNDER', religionCode: 'TAOISM', certainty: 'PROVISIONAL' },
    { name: 'Confucius', stableKey: 'figure:confucius', lifeStart: '0551-01-01 BC', lifeEnd: '0479-01-01 BC', notes: 'Chinese philosopher, founder of Confucianism.', roleCode: 'FOUNDER', religionCode: 'CONFUCIANISM', certainty: 'ESTABLISHED' },
    { name: 'Amaterasu', stableKey: 'figure:amaterasu', lifeStart: '1000-01-01 BC', lifeEnd: '1000-01-01 BC', notes: 'Shinto sun goddess.', roleCode: 'DEITY', religionCode: 'SHINTO', certainty: 'PROVISIONAL' },
    { name: 'Zoroaster', stableKey: 'figure:zoroaster', lifeStart: '1500-01-01 BC', lifeEnd: '1400-01-01 BC', notes: 'Founder of Zoroastrianism.', roleCode: 'PROPHET', religionCode: 'ZOROASTRIANISM', certainty: 'PROVISIONAL' },
    { name: "Bahá'u'lláh", stableKey: 'figure:bahaullah', lifeStart: '1817-01-01', lifeEnd: '1892-01-01', notes: "Founder of the Bahá'í Faith.", roleCode: 'FOUNDER', religionCode: 'BAHAI', certainty: 'ESTABLISHED' }
  ]
  const figureIds: Record<string, number> = {}
  for (const f of figureSeeds) {
    const rows = await Figure.fetch(Figure, env, [['stableKey', '=', f.stableKey]])
    let figureId: number
    if (!rows.length) {
      const religionRows = await Religion.fetch(Religion, env, [['code', '=', f.religionCode]])
      const religionId = religionRows[0]?.id as number | undefined
      const existingEntity = await Entity.fetch(Entity, env, [['canonicalKey', '=', f.stableKey]])
      let entityId: number
      if (existingEntity.length) {
        entityId = existingEntity[0].id as number
      } else {
        const entity = await Entity.spawn(Entity, env, {
          canonicalKey: f.stableKey,
          kind: 'PERSON',
          label: f.name,
          name: f.name,
          sourceClass: 'SCRIPTURE',
          epistemicLane: 'CORE',
          authorityClass: 'PRIMARY_SOURCE',
          operationalStatus: 'ESTABLISHED',
          active: true
        })
        entityId = entity.id as number
      }
      const figure = await Figure.spawn(Figure, env, {
        entityId,
        stableKey: f.stableKey,
        name: f.name,
        lifeStart: f.lifeStart,
        lifeEnd: f.lifeEnd,
        notes: f.notes,
        status: 'APPROVED',
        active: true
      })
      figureId = figure.id as number
      figureIds[f.stableKey] = figureId
      if (religionId) {
        await FigureRole.spawn(FigureRole, env, {
          figureId,
          roleCode: f.roleCode,
          religionId,
          provenanceId: provenanceIds['Quran.com API'],
          certainty: f.certainty as any,
          status: 'APPROVED',
          active: true
        })
      }
    } else {
      figureIds[f.stableKey] = rows[0].id as number
    }
  }

  // ── 3. Scripture (Al-Quran) ──
  let quranScriptureId: number
  const quranRows = await Scripture.fetch(Scripture, env, [['slug', '=', 'al-quran']])
  if (!quranRows.length) {
    const qRow = await Scripture.spawn(Scripture, env, {
      name: 'Al-Qur\'an Al-Karim',
      originalName: 'القرآن الكريم',
      slug: 'al-quran',
      canonicalCode: 'QURAN',
      sourceClass: 'REVELATION',
      authorityClass: 'PRIMARY_SOURCE',
      status: 'APPROVED',
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

  // ── 4. Fetch & Seed Quran Verses from API ──
  console.log('[seeder] Fetching Quran verses from api.quran.com...')
  const surahList = [1, 2, 18, 36, 55, 56, 67, 112, 113, 114]
  for (const surahNum of surahList) {
    try {
      const apiData = await fetchQuranSurah(surahNum)
      const verses = apiData?.verses || []
      if (!verses.length) {
        console.log(`[seeder] No verses found for surah ${surahNum}`)
        continue
      }

      const bookRows = await Book.fetch(Book, env, [['scriptureId', '=', quranScriptureId], ['bookNumber', '=', surahNum]])
      let bookId: number
      if (!bookRows.length) {
        const surahInfo = apiData.chapter || {}
        const book = await Book.spawn(Book, env, {
          scriptureId: quranScriptureId,
          bookNumber: surahNum,
          name: surahInfo.name_simple || `Surah ${surahNum}`,
          nameOriginal: surahInfo.name_arabic || '',
          slug: surahInfo.name_slug || `surah-${surahNum}`,
          versesCount: verses.length,
          revelationType: surahInfo.revelation_place?.toLowerCase() === 'mecca' ? 'MAKKIYAH' : 'MADANIYAH',
          summary: surahInfo.summary || `Surah ${surahNum} from the Holy Quran.`,
          audioUrl: `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${String(surahNum).padStart(3, '0')}.mp3`
        })
        bookId = book.id as number
      } else {
        bookId = bookRows[0].id as number
      }

      let seededCount = 0
      for (const v of verses) {
        const vNum = v.verse_number
        const existing = await Verse.fetch(Verse, env, [['bookId', '=', bookId], ['verseNumber', '=', vNum]])
        if (existing.length) continue

        const translation = (v.translations || []).find((t: any) => t.resource_id === 33) || (v.translations || [])[0]
        const textUthmani = v.text_uthmani || v.text_imlaei || ''

        await Verse.spawn(Verse, env, {
          scriptureId: quranScriptureId,
          bookId,
          verseNumber: vNum,
          textOriginal: textUthmani,
          textTransliteration: '',
          translationId: translation?.text || '',
          translationEn: translation?.text || '',
          juz: v.juz_number,
          audioUrl: `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${String(surahNum).padStart(3, '0')}_${String(vNum).padStart(3, '0')}.mp3`
        })
        seededCount++
      }
      console.log(`[seeder] Surah ${surahNum}: ${seededCount} new verses seeded`)
    } catch (err: unknown) {
      console.error(`[seeder] Failed to fetch surah ${surahNum}:`, err instanceof Error ? err.message : String(err))
    }
  }

  // ── 5. Asmaul Husna (99 Names - First 20) ──
  const asmaulHusnaSeeds = [
    { number: 1, nameArabic: 'الرَّحْمَنُ', nameLatin: 'Ar-Rahman', translationId: 'Yang Maha Pengasih', translationEn: 'The Most Gracious', quranReference: 'QS 1:1, 55:1', meaning: 'Mencurahkan kasih sayang-Nya kepada seluruh makhluk.' },
    { number: 2, nameArabic: 'الرَّحِيمُ', nameLatin: 'Ar-Rahim', translationId: 'Yang Maha Penyayang', translationEn: 'The Most Merciful', quranReference: 'QS 1:1, 2:163', meaning: 'Memberikan kasih sayang khusus bagi orang-orang beriman.' },
    { number: 3, nameArabic: 'الْمَلِكُ', nameLatin: 'Al-Malik', translationId: 'Yang Maha Merajai', translationEn: 'The King', quranReference: 'QS 59:23', meaning: 'Penguasa mutlak atas seluruh alam semesta.' },
    { number: 4, nameArabic: 'الْقُدُّوسُ', nameLatin: 'Al-Quddus', translationId: 'Yang Maha Suci', translationEn: 'The Most Holy', quranReference: 'QS 59:23', meaning: 'Maha Suci dari segala kekurangan.' },
    { number: 5, nameArabic: 'السَّلاَمُ', nameLatin: 'As-Salam', translationId: 'Yang Maha Memberi Kesejahteraan', translationEn: 'The Source of Peace', quranReference: 'QS 59:23', meaning: 'Sumber kedamaian dan keselamatan.' },
    { number: 6, nameArabic: 'الْمُؤْمِنُ', nameLatin: 'Al-Mu\'min', translationId: 'Yang Maha Memberi Keamanan', translationEn: 'The Granter of Security', quranReference: 'QS 59:23', meaning: 'Memberikan rasa aman kepada hamba-hamba-Nya.' },
    { number: 7, nameArabic: 'الْمُهَيْمِنُ', nameLatin: 'Al-Muhaymin', translationId: 'Yang Maha Memelihara', translationEn: 'The Guardian', quranReference: 'QS 59:23', meaning: 'Mengawasi dan memelihara seluruh ciptaan.' },
    { number: 8, nameArabic: 'الْعَزِيزُ', nameLatin: 'Al-Aziz', translationId: 'Yang Maha Perkasa', translationEn: 'The Almighty', quranReference: 'QS 59:23', meaning: 'Kemuliaan dan keperkasaan yang tidak terkalahkan.' },
    { number: 9, nameArabic: 'الْجَبَّارُ', nameLatin: 'Al-Jabbar', translationId: 'Yang Maha Memaksa', translationEn: 'The Compeller', quranReference: 'QS 59:23', meaning: 'Mampu memulihkan segala yang rusak.' },
    { number: 10, nameArabic: 'الْمُتَكَبِّرُ', nameLatin: 'Al-Mutakabbir', translationId: 'Yang Maha Memiliki Kebesaran', translationEn: 'The Supreme', quranReference: 'QS 59:23', meaning: 'Pemilik segala keagungan dan kebesaran.' },
    { number: 11, nameArabic: 'الْخَالِقُ', nameLatin: 'Al-Khaliq', translationId: 'Yang Maha Pencipta', translationEn: 'The Creator', quranReference: 'QS 59:24', meaning: 'Menciptakan seluruh alam semesta dari tiada.' },
    { number: 12, nameArabic: 'الْبَارِئُ', nameLatin: 'Al-Bari\'', translationId: 'Yang Maha Membuat', translationEn: 'The Evolver', quranReference: 'QS 59:24', meaning: 'Membuat dan menciptakan tanpa contoh.' },
    { number: 13, nameArabic: 'الْمُصَوِّرُ', nameLatin: 'Al-Mushawwir', translationId: 'Yang Maha Membentuk Rupa', translationEn: 'The Fashioner of Forms', quranReference: 'QS 59:24', meaning: 'Membentuk rupa dan keperadian setiap makhluk.' },
    { number: 14, nameArabic: 'الْغَفَّارُ', nameLatin: 'Al-Ghaffar', translationId: 'Yang Maha Pengampun', translationEn: 'The Forgiving', quranReference: 'QS 20:82', meaning: 'Mengampuni dosa hambanya berulang kali.' },
    { number: 15, nameArabic: 'الْقَهَّارُ', nameLatin: 'Al-Qahhar', translationId: 'Yang Maha Memaksa', translationEn: 'The Subduer', quranReference: 'QS 12:39', meaning: 'Mampu menundukkan dan menguasai segala sesuatu.' },
    { number: 16, nameArabic: 'الْوَهَّابُ', nameLatin: 'Al-Wahhab', translationId: 'Yang Maha Pemberi Karunia', translationEn: 'The Bestower', quranReference: 'QS 38:9', meaning: 'Menganugerahkan nikmat tanpa batas.' },
    { number: 17, nameArabic: 'الرَّزَّاقُ', nameLatin: 'Ar-Razzaq', translationId: 'Yang Maha Pemberi Rezeki', translationEn: 'The Provider', quranReference: 'QS 51:58', meaning: 'Menyediakan rezeki bagi seluruh makhluk.' },
    { number: 18, nameArabic: 'الْفَتَّاحُ', nameLatin: 'Al-Fattah', translationId: 'Yang Maha Pembuka', translationEn: 'The Opener', quranReference: 'QS 34:26', meaning: 'Membuka pintu rezeki dan kemenangan.' },
    { number: 19, nameArabic: 'اَلْعَلِيْمُ', nameLatin: 'Al-\'Alim', translationId: 'Yang Maha Mengetahui', translationEn: 'The All-Knowing', quranReference: 'QS 2:158', meaning: 'Maha Mengetahui segala yang tersembunyi dan yang terlihat.' },
    { number: 20, nameArabic: 'الْقَابِضُ', nameLatin: 'Al-Qabid', translationId: 'Yang Maha Menyempitkan', translationEn: 'The Constrictor', quranReference: 'QS 2:245', meaning: 'Menyempitkan atau meluaskan rezeki sesuai kehendak-Nya.' }
  ]
  for (const item of asmaulHusnaSeeds) {
    const rows = await AsmaulHusna.fetch(AsmaulHusna, env, [['number', '=', item.number]])
    if (!rows.length) await AsmaulHusna.spawn(AsmaulHusna, env, item)
  }

  // ── 6. Traditions / Hadith Collections ──
  const jsonWitness = loadJsonSeed<{
    traditions?: any[]
    hadiths?: any[]
    devotions?: any[]
  }>('witness')

  const traditionSeeds = jsonWitness?.traditions || [
    { name: 'Shahih al-Bukhari', originalName: 'صحيح البخاري', author: 'Imam Muhammad bin Ismail al-Bukhari (194–256 H)', totalItems: 7563, gradeLevel: 'SHAHIH', category: 'Hadits Shahih', description: 'Kitab hadits paling otentik setelah Al-Qur\'an.', slug: 'shahih-al-bukhari' },
    { name: 'Sahih Muslim', originalName: 'صحيح مسلم', author: 'Imam Muslim bin al-Hajjaj (202–261 H)', totalItems: 7458, gradeLevel: 'SHAHIH', category: 'Hadits Shahih', description: 'Kitab hadits shahih yang kedua paling otentik setelah Sahih Bukhari.', slug: 'sahih-muslim' },
    { name: 'Sunan Abi Dawud', originalName: 'سنن أبي داود', author: 'Imam Abu Dawud Sulayman bin al-Ash\'ath (202–275 H)', totalItems: 5274, gradeLevel: 'SHAHIH', category: 'Sunan', description: 'Koleksi hadits fikih dan hukum Islam terkemuka.', slug: 'sunan-abi-dawud' },
    { name: 'Jami\' at-Tirmidhi', originalName: 'جامع الترمذي', author: 'Imam Abu Isa Muhammad at-Tirmidhi (209–279 H)', totalItems: 3956, gradeLevel: 'HASAN', category: 'Sunan & Jami\'', description: 'Koleksi hadits komprehensif disertai kajian derajat hadits.', slug: 'jami-at-tirmidhi' },
    { name: 'Arba\'in An-Nawawiyyah', originalName: 'الأربعون النووية', author: 'Imam An-Nawawi (631–676 H)', totalItems: 42, gradeLevel: 'SHAHIH', category: 'Kompilasi Tematik', description: 'Kumpulan 42 hadits pokok yang merangkum kaidah-kaidah ajaran Islam.', slug: 'arbain-nawawiyyah' }
  ]
  const traditionIds: Record<string, number> = {}
  for (const t of traditionSeeds) {
    const rows = await Tradition.fetch(Tradition, env, [['name', '=', t.name]])
    if (!rows.length) {
      const row = await Tradition.spawn(Tradition, env, { scriptureId: quranScriptureId, ...t })
      traditionIds[t.name] = row.id as number
    } else {
      traditionIds[t.name] = rows[0].id as number
    }
  }

  // ── 7. Tradition Items (Selected Authentic Hadiths) ──
  const hadithSeeds = jsonWitness?.hadiths || [
    { collectionName: 'Arba\'in An-Nawawiyyah', number: 1, title: 'Semua Amal Bergantung pada Niat', textOriginal: 'إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى', textTransliteration: 'Innamal-a\'malu bin-niyyat, wa innama likullimri\'in ma nawa', translationId: 'Sesungguhnya setiap amal perbuatan bergantung pada niatnya, dan sesungguhnya setiap orang akan mendapatkan sesuai dengan apa yang dia niatkan.', translationEn: 'Actions are according to intentions, and everyone will get what was intended for.', narrator: 'Umar bin al-Khattab RA', grade: 'SHAHIH' },
    { collectionName: 'Arba\'in An-Nawawiyyah', number: 2, title: 'Hadits Jibril tentang Islam, Iman, dan Ihsan', textOriginal: 'فَأَخْبِرْنِي عَنِ الإِحْسَانِ قَالَ أَنْ تَعْبُدَ اللَّهَ كَأَنَّكَ تَرَاهُ فَإِنْ لَمْ تَكُنْ تَرَاهُ فَإِنَّهُ يَرَاكَ', textTransliteration: 'Fa akhbirni \'anil-ihsan, qala: an ta\'budallaha ka\'annaka tarahu, fa in lam takun tarahu fa innahu yarak', translationId: 'Maka beritahukanlah kepadaku tentang Ihsan. Beliau bersabda: "Hendaklah engkau beribadah kepada Allah seakan-akan engkau melihat-Nya; jika engkau tidak dapat melihat-Nya, maka sesungguhnya Dia melihatmu."', translationEn: 'Inform me about Ihsan. He replied: "That you worship Allah as if you see Him, for if you do not see Him, surely He sees you."', narrator: 'Umar bin al-Khattab RA', grade: 'SHAHIH' },
    { collectionName: 'Shahih al-Bukhari', number: 1, title: 'Awal Mula Turunnya Wahyu', textOriginal: 'بَدْءُ الْوَحْيِ إِلَى رَسُولِ اللَّهِ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ الرُّؤْيَا الصَّالِحَةُ فِي النَّوْمِ', textTransliteration: 'Bad\'ul-wahyi ila Rasulillahi shallallahu \'alaihi wa sallam ar-ru\'yash-shalihatu fin-nawm', translationId: 'Permulaan wahyu yang datang kepada Rasulullah SAW adalah mimpi yang benar dalam tidur.', translationEn: 'The commencement of the Divine Inspiration to Allah\'s Messenger was in the form of good dreams.', narrator: 'Aisyah RA', grade: 'SHAHIH' },
    { collectionName: 'Shahih al-Bukhari', number: 1909, title: 'Pedoman Rukyatul Hilal & Kalender Qamariyah', textOriginal: 'صُومُوا لِرُؤْيَتِهِ وَأَفْطِرُوا لِرُؤْيَتِهِ فَإِنْ غُبِّيَ عَلَيْكُمْ فَأَكْمِلُوا عِدَّةَ شَعْبَانَ ثَلَاثِينَ', textTransliteration: 'Shumu li ru\'yatihi wa afthiru li ru\'yatihi fa in ghubbiya \'alaikum fa akmilu \'iddata sya\'bana tsalatsin', translationId: 'Berpuasalah kalian karena melihat hilal dan berbukalah (berhari raya) karena melihat hilal. Jika hilal tertutup awan bagi kalian, maka genapkanlah bilangan bulan Sya\'ban tiga puluh hari.', translationEn: 'Fast when you see the crescent moon and break your fast when you see it; if it is obscured from you, complete thirty days of Sha\'ban.', narrator: 'Abu Hurairah RA', grade: 'SHAHIH' },
    { collectionName: 'Sahih Muslim', number: 1, title: 'Pernyataan Iman & Fondasi Islam', textOriginal: 'قَالَ اللَّهُ تَعَالَىٰ أَنَا اللَّهُ لَا إِلَٰهَ إِلَّا أَنَا فَاعْبُدْنِي وَأَقِمِ الصَّلَاةَ لِذِكْرِي', textTransliteration: 'Qala Allahu ta\'ala ana Allah la ilaha illa ana fa\'buduni wa aqimis-salata li dhikri', translationId: 'Allah berfirman, "Aku lah Allah, tiada tuhan selain Aku, maka sembahlah Aku dan tetaplah melaksanakan shalat untuk mengingat Aku."', translationEn: 'Allah said, "I am Allah, there is no deity except Me, so worship Me and establish prayer for My remembrance."', narrator: 'Umar bin al-Khattab RA', grade: 'SHAHIH' },
    { collectionName: 'Sahih Muslim', number: 1080, title: 'Bulan Berjumlah 29 atau 30 Hari', textOriginal: 'الشَّهْرُ هَكَذَا وَهَكَذَا وَهَكَذَا وَعَقَدَ إِبْهَامَهُ فِي الثَّالِثَةِ وَالشَّهْرُ هَكَذَا وَهَكَذَا وَهَكَذَا وَتَمَّامَ ثَلَاثِينَ', textTransliteration: 'Asy-syahru hakadha wa hakadha wa hakadha... wa tamam tsalatsin', translationId: 'Bulan (qamariyah) itu ada kalanya 29 hari dan ada kalanya 30 hari.', translationEn: 'The month can be twenty-nine days or thirty days.', narrator: 'Ibnu Umar RA', grade: 'SHAHIH' },
    { collectionName: 'Sunan Abi Dawud', number: 2320, title: 'Kesaksian Penglihatan Hilal', textOriginal: 'تَرَاءَى النَّاسُ الْهِلَالَ فَأَخْبَرْتُ رَسُولَ اللَّهِ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ أَنِّي رَأَيْتُهُ فَصَامَ وَأَمَرَ النَّاسَ بِصِيَامِهِ', textTransliteration: 'Tara\'an-nasu al-hilala fa akhbartu Rasulallahi shallallahu \'alaihi wa sallam anni ra\'aytuhu fa shama wa amaran-nasa bi shiyamihi', translationId: 'Masyarakat berusaha melihat hilal, lalu aku mengabarkan kepada Rasulullah SAW bahwa aku telah melihatnya, maka beliau berpuasa dan memerintahkan orang-orang untuk berpuasa.', translationEn: 'The people looked for the crescent moon, and I informed Allah\'s Messenger that I had sighted it. So he fasted and ordered the people to fast.', narrator: 'Ibnu Umar RA', grade: 'SHAHIH' },
    { collectionName: 'Jami\' at-Tirmidhi', number: 3451, title: 'Doa Ketika Melihat Bulan Sabit (Hilal)', textOriginal: 'اللَّهُمَّ أَهِلَّهُ عَلَيْنَا بِالأَمْنِ وَالإِيمَانِ وَالسَّلاَمَةِ وَالإِسْلاَمِ رَبِّي وَرَبُّكَ اللَّهُ هِلاَلُ رُشْدٍ وَخَيْرٍ', textTransliteration: 'Allahumma ahillahu \'alaina bil-amni wal-iman was-salamati wal-islam, rabbi wa rabbukallah, hilalu rusydin wa khayr', translationId: 'Ya Allah, jadikanlah bulan sabit ini terbit kepada kami dengan membawa keamanan, keimanan, keselamatan, dan keislaman. Rabb-ku dan Rabb-mu adalah Allah. Bulan sabit petunjuk dan kebaikan.', translationEn: 'O Allah, let the crescent appear upon us with security and faith, safety and Islam. My Lord and your Lord is Allah; a crescent of guidance and goodness.', narrator: 'Thalhah bin Ubaidillah RA', grade: 'HASAN' }
  ]
  for (const h of hadithSeeds) {
    const cId = traditionIds[h.collectionName]
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

  // ── 8. Devotions ──
  const devotionSeeds = jsonWitness?.devotions || [
    { type: 'dhikr', number: 1, title: 'Tasbih & Tahmid Harian', textOriginal: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ سُبْحَانَ اللَّهِ الْعَظِيمِ', textTransliteration: 'Subhanallahi wa bihamdihi, subhanallahil-azim', translationId: 'Maha Suci Allah dengan segala puji bagi-Nya, Maha Suci Allah Yang Maha Agung.', translationEn: 'Glory be to Allah and His praise, glory be to Allah the Supreme.', category: 'Dzikir Pagi & Petang', source: 'HR. Bukhari & Muslim', reference: '' },
    { type: 'dua', number: 2, title: 'Doa Kebaikan Dunia & Akhirat', textOriginal: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ', textTransliteration: 'Rabbana atina fid-dunya hasanah wa fil-akhirati hasanah wa qina \'adhaban-nar', translationId: 'Ya Tuhan kami, berilah kami kebaikan di dunia dan kebaikan di akhirat, dan lindungilah kami dari azab neraka.', translationEn: 'Our Lord, give us in this world that which is good and in the Hereafter that which is good and save us from the torment of the Fire.', category: 'Doa Universal', source: '', reference: 'QS 2:201' },
    { type: 'dhikr', number: 3, title: 'Sayyidul Istighfar', textOriginal: 'اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ خَلَقْتَنِي وَأَنَا عَبْدُكَ وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ', textTransliteration: 'Allahumma anta rabbi la ilaha illa anta khalaqtani wa ana \'abduka wa ana \'ala \'ahdika wa wa\'dika mastatha\'tu', translationId: 'Ya Allah, Engkau adalah Rabb-ku, tidak ada tuhan selain Engkau. Engkau yang menciptakan aku dan aku adalah hamba-Mu, dan aku berada dalam ikrar serta janji-Mu semampuku.', translationEn: 'O Allah, You are my Lord, none has the right to be worshiped but You. You created me and I am Your slave, and I am faithful to my covenant and my promise as much as I can.', category: 'Dzikir Pagi & Petang', source: 'HR. Bukhari', reference: '' },
    { type: 'dua', number: 4, title: 'Doa Ketetapan Hati dalam Kebenaran', textOriginal: 'يَا مُقَلِّبَ الْقُلُوبِ ثَبِّتْ قَلْبِي عَلَى دِينِكَ', textTransliteration: 'Ya muqallibal-qulub, tsabbit qalbi \'ala dinika', translationId: 'Wahai Dzat yang membolak-balikkan hati, teguhkanlah hatiku di atas agama-Mu.', translationEn: 'O Turner of the hearts, keep my heart firm upon Your religion.', category: 'Doa Hati', source: 'HR. Tirmidhi', reference: '' },
    { type: 'dua', number: 5, title: 'Doa Perlindungan dari Kesesatan & Ilmu yang Tidak Bermanfaat', textOriginal: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنْ عِلْمٍ لَا يَنْفَعُ وَمِنْ قَلْبٍ لَا يَخْشَعُ وَمِنْ نَفْسٍ لَا تَشْبَعُ وَمِنْ دَعْوَةٍ لَا يُسْتَجَابُ لَهَا', textTransliteration: 'Allahumma inni a\'udzu bika min \'ilmin la yanfa\' wa min qalbin la yakhsya\' wa min nafsin la tasyba\' wa min da\'watin la yustajabu laha', translationId: 'Ya Allah, sesungguhnya aku berlindung kepada-Mu dari ilmu yang tidak bermanfaat, hati yang tidak khusyuk, jiwa yang tidak pernah puas, dan doa yang tidak dikabulkan.', translationEn: 'O Allah, I seek refuge in You from knowledge that does not benefit, from a heart that does not fear You, from a soul that is never satisfied, and from a prayer that is not answered.', category: 'Doa Penuntut Ilmu', source: 'HR. Muslim', reference: '' }
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

  console.log(`[seeder] Demo data seeding completed: ${traditionSeeds.length} traditions, ${hadithSeeds.length} hadiths, ${devotionSeeds.length} devotions.`)
}
