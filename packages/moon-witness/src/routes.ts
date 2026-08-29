/**
 * ◈ Moon Witness — Custom API Routes
 * 
 * Provides specialized endpoints beyond auto-generated CRUD.
 * Uses declarative defineRoute() from @moon/server.
 */
import { defineRoute } from '@moon/server'
import { getModel } from '@moon/orm'
import { getMoonData, getIslamicData, getDailyPrayerTimes } from '@moon/compute'
import { cache } from '@moon/cache'
import { registerWitnessGraphRoutes } from './graph/routes.js'
import { registerWitnessEngineRoutes } from './engine-routes.js'
import {
  searchWitnessGraph,
  lookupReference,
  getSearchIndexDiagnostics
} from './services/retrieval.js'

// ═══════════════════════════════════════════
// 📖 SCRIPTURE ROUTES
// ═══════════════════════════════════════════

// GET /api/witness/scriptures — list all scriptures
defineRoute({
  method: 'GET',
  path: '/api/witness/scriptures',
  handler: async ({ env }) => {
    const M = getModel('wx.scripture')
    if (!M) throw new Error('Model wx.scripture not found')
    const rows = await (M as any).fetch(M, env, [], undefined, { order: 'id ASC' })
    return { scriptures: rows }
  },
})

// GET /api/witness/quran/surahs — list 114 surahs
defineRoute({
  method: 'GET',
  path: '/api/witness/quran/surahs',
  handler: async ({ env }) => {
    const Scripture = getModel('wx.scripture')
    const Book = getModel('wx.scripture.book')
    if (!Scripture || !Book) throw new Error('Models not found')

    const [quran] = await (Scripture as any).fetch(Scripture, env, [['slug', '=', 'quran']])
    if (!quran) {
      const err = new Error('Quran scripture not found')
      ;(err as any).statusCode = 404
      throw err
    }

    const surahs = await (Book as any).fetch(Book, env, [['scriptureId', '=', quran.id]], undefined, { order: 'bookNumber ASC' })
    return {
      scripture: { id: quran.id, name: quran.name, versesCount: quran.versesCount },
      surahs: surahs.map((s: any) => ({
        number: s.bookNumber,
        name: s.name,
        nameOriginal: s.nameOriginal,
        versesCount: s.versesCount,
        revelationType: s.revelationType,
        description: s.description
      }))
    }
  },
})

// GET /api/witness/quran/surah — surah detail + ayahs (?number=1)
defineRoute({
  method: 'GET',
  path: '/api/witness/quran/surah',
  handler: async ({ query, env }) => {
    const surahNumber = parseInt(query.number || '0', 10)
    if (surahNumber < 1 || surahNumber > 114) {
      const err = new Error('Surah number must be 1-114')
      ;(err as any).statusCode = 400
      throw err
    }

    const Scripture = getModel('wx.scripture')
    const Book = getModel('wx.scripture.book')
    const Verse = getModel('wx.scripture.verse')
    if (!Scripture || !Book || !Verse) throw new Error('Models not found')

    const [quran] = await (Scripture as any).fetch(Scripture, env, [['slug', '=', 'quran']])
    if (!quran) {
      const err = new Error('Quran not found')
      ;(err as any).statusCode = 404
      throw err
    }

    const [surah] = await (Book as any).fetch(Book, env, [
      ['scriptureId', '=', quran.id],
      ['bookNumber', '=', surahNumber]
    ])
    if (!surah) {
      const err = new Error(`Surah ${surahNumber} not found`)
      ;(err as any).statusCode = 404
      throw err
    }

    const ayahs = await (Verse as any).fetch(Verse, env, [['bookId', '=', surah.id]], undefined, { order: 'verseNumber ASC' })

    return {
      surah: {
        number: surah.bookNumber,
        name: surah.name,
        nameOriginal: surah.nameOriginal,
        versesCount: surah.versesCount,
        revelationType: surah.revelationType,
        description: surah.description,
        audioUrl: surah.audioUrl
      },
      ayahs: ayahs.map((a: any) => ({
        number: a.verseNumber,
        textArabic: a.textOriginal,
        textLatin: a.textTransliteration,
        translationId: a.translationId,
        audioUrl: a.audioUrl,
        juz: a.juz,
        page: a.page
      }))
    }
  },
})

// GET /api/witness/search?q=...&filter=ALL&limit=20&page=1
defineRoute({
  method: 'GET',
  path: '/api/witness/search',
  handler: async ({ query, env }) => {
    const q = query.q || ''
    const filter = (query.filter || 'ALL') as any
    const limit = Math.min(parseInt(query.limit || '20', 10), 100)
    const page = Math.max(parseInt(query.page || '1', 10), 1)

    const searchResult = await searchWitnessGraph(env, {
      query: q,
      filter,
      limit,
      page
    })

    return {
      query: q,
      filter,
      total: searchResult.total,
      page,
      limit,
      results: searchResult.results
    }
  },
})

// GET /api/witness/lookup?ref=...
defineRoute({
  method: 'GET',
  path: '/api/witness/lookup',
  handler: async ({ query, env }) => {
    const ref = query.ref || query.reference || ''
    if (!ref) {
      const err = new Error('Reference query parameter required')
      ;(err as any).statusCode = 400
      throw err
    }

    const resolved = await lookupReference(env, ref)
    return resolved
  },
})

// GET /api/witness/search/diagnostics
defineRoute({
  method: 'GET',
  path: '/api/witness/search/diagnostics',
  handler: async ({ env }) => {
    return await getSearchIndexDiagnostics(env)
  },
})

// GET /api/witness/quran/search?q=...&limit=20 (Legacy / Compatibility route)
defineRoute({
  method: 'GET',
  path: '/api/witness/quran/search',
  handler: async ({ query, env }) => {
    const q = query.q || ''
    const limit = Math.min(parseInt(query.limit || '20', 10), 100)
    if (!q || q.length < 2) {
      const err = new Error('Query must be at least 2 characters')
      ;(err as any).statusCode = 400
      throw err
    }

    // Try canonical search first
    const canonicalSearch = await searchWitnessGraph(env, {
      query: q,
      filter: 'SCRIPTURE',
      limit
    })

    if (canonicalSearch.results.length > 0) {
      return {
        query: q,
        count: canonicalSearch.total,
        results: canonicalSearch.results.map((r) => ({
          verseNumber: r.reference,
          translationId: r.snippet,
          textOriginal: r.title
        }))
      }
    }

    // Fallback to legacy models
    const Scripture = getModel('wx.scripture')
    const Verse = getModel('wx.scripture.verse')
    if (!Scripture || !Verse) {
      return { query: q, count: 0, results: [] }
    }

    const [quran] = await (Scripture as any).fetch(Scripture, env, [['slug', '=', 'quran']])
    if (!quran) {
      return { query: q, count: 0, results: [] }
    }

    const results = await (Verse as any).fetch(Verse, env, [
      ['scriptureId', '=', quran.id],
      ['translationId', 'ilike', `%${q}%`]
    ], undefined, { limit, order: 'bookId ASC, verseNumber ASC' })

    return { query: q, count: results.length, results }
  },
})

// GET /api/witness/provenance?id=... or ?stableKey=...
defineRoute({
  method: 'GET',
  path: '/api/witness/provenance',
  handler: async ({ query, env }) => {
    const Provenance = getModel('wx.provenance')
    const Source = getModel('wx.source')
    if (!Provenance) throw new Error('Model wx.provenance not found')

    const id = query.id ? parseInt(query.id, 10) : 0
    const stableKey = query.stableKey || ''

    const domain: any[] = [['active', '=', true]]
    if (id > 0) domain.push(['id', '=', id])
    if (stableKey) domain.push(['stableKey', '=', stableKey])

    const rows = await (Provenance as any).fetch(Provenance, env, domain)
    if (rows.length === 0) {
      const err = new Error('Provenance record not found')
      ;(err as any).statusCode = 404
      throw err
    }

    const prov = rows[0]
    let sourceRecord = null
    if (prov.sourceId && Source) {
      const sources = await (Source as any).fetch(Source, env, [['id', '=', prov.sourceId]])
      sourceRecord = sources[0] || null
    }

    return {
      provenance: {
        id: prov.id,
        stableKey: prov.stableKey,
        name: prov.name,
        sourceRevision: prov.sourceRevision,
        artifactChecksum: prov.artifactChecksum,
        parserVersion: prov.parserVersion,
        importerVersion: prov.importerVersion,
        evidenceNote: prov.evidenceNote,
        source: sourceRecord
      }
    }
  },
})

// GET /api/witness/citation?reference=...
defineRoute({
  method: 'GET',
  path: '/api/witness/citation',
  handler: async ({ query, env }) => {
    const reference = query.reference || query.ref || ''
    if (!reference) {
      const err = new Error('Reference query parameter required')
      ;(err as any).statusCode = 400
      throw err
    }

    const lookup = await lookupReference(env, reference)
    if (!lookup.resolved) {
      return {
        reference,
        citationText: reference,
        resolved: false
      }
    }

    let sourceName = 'Al-Qur\'an al-Karim'
    let edition = 'Uthmani'
    let language = 'ar'

    if (lookup.type === 'HADITH') {
      sourceName = (lookup.tradition as any)?.reference?.referenceScheme || 'Hadith Tradition'
      edition = 'Classical Compendium'
      language = 'ar'
    } else if (lookup.type === 'LEXICAL') {
      sourceName = 'Quranic Arabic Lexicon'
      edition = 'Classical Lexicography'
      language = 'ar'
    }

    const citationText = `${sourceName} [${edition}] — ${lookup.reference}`

    return {
      reference: lookup.reference,
      sourceName,
      edition,
      language,
      type: lookup.type,
      citationText,
      resolved: true,
      deepLink: lookup.type === 'HADITH' ? `/hadiths?ref=${encodeURIComponent(lookup.reference)}` : `/scripture/1?ref=${encodeURIComponent(lookup.reference)}`
    }
  },
})

// ═══════════════════════════════════════════
// 📜 HADITH & TRADITION ROUTES
// ═══════════════════════════════════════════

// GET /api/witness/hadith/books
defineRoute({
  method: 'GET',
  path: '/api/witness/hadith/books',
  handler: async ({ env }) => {
    const M = getModel('wx.tradition')
    if (!M) throw new Error('Model not found')
    const books = await (M as any).fetch(M, env, [], undefined, { order: 'id ASC' })
    return { books }
  },
})

// GET /api/witness/hadith?slug=bukhari&page=1&limit=20
defineRoute({
  method: 'GET',
  path: '/api/witness/hadith',
  handler: async ({ query, env }) => {
    const slug = query.slug
    const page = parseInt(query.page || '1', 10)
    const limit = Math.min(parseInt(query.limit || '20', 10), 100)
    const offset = (page - 1) * limit

    if (!slug) {
      const err = new Error('slug parameter required')
      ;(err as any).statusCode = 400
      throw err
    }

    const Tradition = getModel('wx.tradition')
    const Item = getModel('wx.tradition.item')
    if (!Tradition || !Item) throw new Error('Models not found')

    const [book] = await (Tradition as any).fetch(Tradition, env, [['slug', '=', slug]])
    if (!book) {
      const err = new Error(`Hadith book '${slug}' not found`)
      ;(err as any).statusCode = 404
      throw err
    }

    const items = await (Item as any).fetch(Item, env, [['collectionId', '=', book.id]], undefined, {
      limit, offset, order: 'number ASC'
    })

    return {
      book: { id: book.id, name: book.name, slug: book.slug, totalItems: book.totalItems, gradeLevel: book.gradeLevel },
      page, limit,
      items
    }
  },
})

// GET /api/witness/traditions — prophetic traditions (non-Islamic)
defineRoute({
  method: 'GET',
  path: '/api/witness/traditions',
  handler: async ({ env }) => {
    const Tradition = getModel('wx.tradition')
    const Item = getModel('wx.tradition.item')
    if (!Tradition || !Item) throw new Error('Models not found')

    const collections = await (Tradition as any).fetch(Tradition, env, [['category', '=', 'Prophetic Tradition']], undefined, { order: 'id ASC' })

    const result = []
    for (const col of collections) {
      const items = await (Item as any).fetch(Item, env, [['collectionId', '=', col.id]], undefined, { order: 'number ASC' })
      result.push({ collection: col, items })
    }
    return { traditions: result }
  },
})

// ═══════════════════════════════════════════
// ✨ ASMAUL HUSNA
// ═══════════════════════════════════════════

// GET /api/witness/asmaul-husna
defineRoute({
  method: 'GET',
  path: '/api/witness/asmaul-husna',
  handler: async ({ env }) => {
    const M = getModel('wx.asmaul.husna')
    if (!M) throw new Error('Model not found')
    const names = await (M as any).fetch(M, env, [], undefined, { order: 'number ASC' })
    return { count: names.length, names }
  },
})

// ═══════════════════════════════════════════
// 🤲 DEVOTION ROUTES
// ═══════════════════════════════════════════

// GET /api/witness/devotions?type=dhikr&category=Harian
defineRoute({
  method: 'GET',
  path: '/api/witness/devotions',
  handler: async ({ query, env }) => {
    const M = getModel('wx.devotion')
    if (!M) throw new Error('Model not found')

    const domain: any[] = []
    if (query.type) domain.push(['type', '=', query.type])
    if (query.category) domain.push(['category', '=', query.category])

    const devotions = await (M as any).fetch(M, env, domain, undefined, { order: 'number ASC' })
    return { count: devotions.length, devotions }
  },
})

// ═══════════════════════════════════════════
// 🌙 ASTRONOMY ROUTES
// ═══════════════════════════════════════════

// GET /api/witness/astronomy/moon-phase?date=2024-01-01
defineRoute({
  method: 'GET',
  path: '/api/witness/astronomy/moon-phase',
  handler: async ({ query }) => {
    const date = query.date ? new Date(query.date) : new Date()
    const data = getMoonData(date)
    return { date: date.toISOString(), ...data }
  },
})

// GET /api/witness/astronomy/prayer-times?lat=-6.2&lng=106.8&date=2024-01-01
defineRoute({
  method: 'GET',
  path: '/api/witness/astronomy/prayer-times',
  handler: async ({ query }) => {
    const lat = parseFloat(query.lat || '-6.2')
    const lng = parseFloat(query.lng || '106.8')
    const date = query.date ? new Date(query.date) : new Date()

    const prayerData = getIslamicData(lat, lng, date)
    const dailyTimes = getDailyPrayerTimes(lat, lng, date)

    return {
      date: date.toISOString(),
      coordinates: { lat, lng },
      ...prayerData,
      times: {
        fajr: dailyTimes.fajr.toISOString(),
        sunrise: dailyTimes.sunrise.toISOString(),
        dhuhr: dailyTimes.dhuhr.toISOString(),
        asr: dailyTimes.asr.toISOString(),
        maghrib: dailyTimes.maghrib.toISOString(),
        isha: dailyTimes.isha.toISOString()
      }
    }
  },
})

// ═══════════════════════════════════════════
// 🌍 EXTERNAL DATA PROXIES (MOCK / REAL)
// ═══════════════════════════════════════════

defineRoute({
  method: 'GET',
  path: '/api/external/usgs/earthquakes',
  handler: async () => {
    const resp = await fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_day.geojson')
    return await resp.json()
  },
})

defineRoute({
  method: 'GET',
  path: '/api/external/iss',
  handler: async () => {
    const resp = await fetch('http://api.open-notify.org/iss-now.json')
    return await resp.json()
  },
})

defineRoute({
  method: 'GET',
  path: '/api/external/trends',
  handler: async () => {
    const resp = await fetch("https://trends.google.com/trending/rss?geo=US&t=" + Date.now(), {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      }
    })
    const xmlText = await resp.text()
    const items = []
    const itemRegex = /<item>([\s\S]*?)<\/item>/g
    let match
    while ((match = itemRegex.exec(xmlText)) !== null) {
      const itemContent = match[1]
      if (!itemContent) continue
      const titleMatch = /<title>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?<\/title>/.exec(itemContent)
      const trafficMatch = /<ht:approx_traffic>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?<\/ht:approx_traffic>/.exec(itemContent)
      const pubDateMatch = /<pubDate>(.*?)<\/pubDate>/.exec(itemContent)
      if (titleMatch) {
        items.push({
          title: titleMatch[1],
          traffic: trafficMatch ? trafficMatch[1] : "Unknown",
          pubDate: pubDateMatch ? pubDateMatch[1] : "",
        })
      }
    }
    return items.slice(0, 10)
  },
})

defineRoute({
  method: 'GET',
  path: '/api/external/nasa/donki/cme',
  handler: async ({ query }) => {
    const startDate = query.startDate || new Date().toISOString().split('T')[0]
    return await cache.remember(`nasa-cme-${startDate}`, 3600, async () => {
      const resp = await fetch(`https://api.nasa.gov/DONKI/CME?startDate=${startDate}&api_key=DEMO_KEY`)
      return await resp.json()
    })
  },
})

defineRoute({
  method: 'GET',
  path: '/api/external/opensky',
  handler: async () => {
    return await cache.remember('opensky-europe', 300, async () => {
      const resp = await fetch('https://opensky-network.org/api/states/all?lamin=45.8389&lomin=5.9962&lamax=47.8229&lomax=10.4921')
      return await resp.json()
    })
  },
})

defineRoute({
  method: 'GET',
  path: '/api/external/weather',
  handler: async ({ query }) => {
    const lat = query.latitude || '-6.2'
    const lng = query.longitude || '106.8'
    return await cache.remember(`weather-${lat}-${lng}`, 1800, async () => {
      const resp = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current_weather=true`)
      return await resp.json()
    })
  },
})

defineRoute({
  method: 'GET',
  path: '/api/external/binance/ticker',
  handler: async ({ query }) => {
    const symbol = query.symbol || 'BTCUSDT'
    return await cache.remember(`binance-${symbol}`, 60, async () => {
      const resp = await fetch(`https://api.binance.com/api/v3/ticker/24hr?symbol=${symbol}`)
      return await resp.json()
    })
  },
})

defineRoute({
  method: 'GET',
  path: '/api/witness/bookmarks',
  handler: async ({ query, env }) => {
    const userId = parseInt(query.userId || '0', 10)
    if (!userId) {
      const err = new Error('User ID required')
      ;(err as any).statusCode = 401
      throw err
    }

    const Bookmark = getModel('wx.bookmark')
    if (!Bookmark) throw new Error('Model not found')
    
    return await (Bookmark as any).fetch(Bookmark, env, [['userId', '=', userId]], undefined, { with: ['bookId', 'verseId'] })
  },
})

defineRoute({
  method: 'GET',
  path: '/api/witness/history',
  handler: async ({ query, env }) => {
    const userId = parseInt(query.userId || '0', 10)
    if (!userId) {
      const err = new Error('User ID required')
      ;(err as any).statusCode = 401
      throw err
    }

    const History = getModel('wx.history')
    if (!History) throw new Error('Model not found')
    
    return await (History as any).fetch(History, env, [['userId', '=', userId]], undefined, { with: ['bookId', 'lastVerseId'], order: 'updatedAt DESC' })
  },
})

export function registerWitnessRoutes(jwtSecret = process.env.JWT_SECRET || '') {
  registerWitnessGraphRoutes(jwtSecret)
  registerWitnessEngineRoutes(jwtSecret)
  console.log('[moon-witness] custom API routes registered')
}
