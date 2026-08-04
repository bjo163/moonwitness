/**
 * Moon Witness — Custom API Routes
 * 
 * Provides specialized endpoints beyond auto-generated CRUD.
 * These routes handle joined queries, search, and astronomy calculations.
 */
import { globalRoutes } from '@moon/server/dist/router.js'
import { getModel, createCtx, SUPERUSER_ID } from '@moon/orm'
import { getMoonData } from './astronomy/moon-phase.js'
import { getIslamicData, getDailyPrayerTimes } from './astronomy/prayer-times.js'
import { cache } from '@moon/cache'

const CORS = { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }

function env() {
  return createCtx(SUPERUSER_ID, {}, getModel as any)
}

function ok(res: any, data: any) {
  res.writeHead(200, CORS)
  res.end(JSON.stringify(data))
}

function err(res: any, status: number, msg: string) {
  res.writeHead(status, CORS)
  res.end(JSON.stringify({ error: msg }))
}

function parseQuery(url: string): Record<string, string> {
  const q: Record<string, string> = {}
  const idx = url.indexOf('?')
  if (idx === -1) return q
  const params = url.slice(idx + 1).split('&')
  for (const p of params) {
    const parts = p.split('=')
    const k = parts[0] || ''
    const v = parts[1] || ''
    q[decodeURIComponent(k)] = decodeURIComponent(v)
  }
  return q
}

// ═══════════════════════════════════════════
// 📖 SCRIPTURE ROUTES
// ═══════════════════════════════════════════

// GET /api/witness/scriptures — list all scriptures
globalRoutes.push({
  method: 'GET',
  path: '/api/witness/scriptures',
  handler: async (_req: any, res: any) => {
    try {
      const M = getModel('wx.scripture')
      if (!M) return err(res, 500, 'Model wx.scripture not found')
      const rows = await (M as any).fetch(M, env(), [], undefined, { order: 'id ASC' })
      ok(res, { scriptures: rows })
    } catch (e: any) { err(res, 500, e.message) }
  }
})

// GET /api/witness/quran/surahs — list 114 surahs
globalRoutes.push({
  method: 'GET',
  path: '/api/witness/quran/surahs',
  handler: async (_req: any, res: any) => {
    try {
      const Scripture = getModel('wx.scripture')
      const Book = getModel('wx.scripture.book')
      if (!Scripture || !Book) return err(res, 500, 'Models not found')

      const [quran] = await (Scripture as any).fetch(Scripture, env(), [['slug', '=', 'quran']])
      if (!quran) return err(res, 404, 'Quran scripture not found')

      const surahs = await (Book as any).fetch(Book, env(), [['scriptureId', '=', quran.id]], undefined, { order: 'bookNumber ASC' })
      ok(res, {
        scripture: { id: quran.id, name: quran.name, versesCount: quran.versesCount },
        surahs: surahs.map((s: any) => ({
          number: s.bookNumber,
          name: s.name,
          nameOriginal: s.nameOriginal,
          versesCount: s.versesCount,
          revelationType: s.revelationType,
          description: s.description
        }))
      })
    } catch (e: any) { err(res, 500, e.message) }
  }
})

// GET /api/witness/quran/surah/:number — surah detail + ayahs
globalRoutes.push({
  method: 'GET',
  path: '/api/witness/quran/surah',
  handler: async (req: any, res: any) => {
    try {
      const query = parseQuery(req.url)
      const surahNumber = parseInt(query.number || '0')
      if (surahNumber < 1 || surahNumber > 114) return err(res, 400, 'Surah number must be 1-114')

      const Scripture = getModel('wx.scripture')
      const Book = getModel('wx.scripture.book')
      const Verse = getModel('wx.scripture.verse')
      if (!Scripture || !Book || !Verse) return err(res, 500, 'Models not found')

      const [quran] = await (Scripture as any).fetch(Scripture, env(), [['slug', '=', 'quran']])
      if (!quran) return err(res, 404, 'Quran not found')

      const [surah] = await (Book as any).fetch(Book, env(), [
        ['scriptureId', '=', quran.id],
        ['bookNumber', '=', surahNumber]
      ])
      if (!surah) return err(res, 404, `Surah ${surahNumber} not found`)

      const ayahs = await (Verse as any).fetch(Verse, env(), [['bookId', '=', surah.id]], undefined, { order: 'verseNumber ASC' })

      ok(res, {
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
      })
    } catch (e: any) { err(res, 500, e.message) }
  }
})

// GET /api/witness/quran/search?q=...&limit=20
globalRoutes.push({
  method: 'GET',
  path: '/api/witness/quran/search',
  handler: async (req: any, res: any) => {
    try {
      const query = parseQuery(req.url)
      const q = query.q || ''
      const limit = Math.min(parseInt(query.limit || '20'), 100)
      if (!q || q.length < 2) return err(res, 400, 'Query must be at least 2 characters')

      const Scripture = getModel('wx.scripture')
      const Verse = getModel('wx.scripture.verse')
      if (!Scripture || !Verse) return err(res, 500, 'Models not found')

      const [quran] = await (Scripture as any).fetch(Scripture, env(), [['slug', '=', 'quran']])
      if (!quran) return err(res, 404, 'Quran not found')

      const results = await (Verse as any).fetch(Verse, env(), [
        ['scriptureId', '=', quran.id],
        ['translationId', 'ilike', `%${q}%`]
      ], undefined, { limit, order: 'bookId ASC, verseNumber ASC' })

      ok(res, { query: q, count: results.length, results })
    } catch (e: any) { err(res, 500, e.message) }
  }
})

// ═══════════════════════════════════════════
// 📜 HADITH & TRADITION ROUTES
// ═══════════════════════════════════════════

// GET /api/witness/hadith/books
globalRoutes.push({
  method: 'GET',
  path: '/api/witness/hadith/books',
  handler: async (_req: any, res: any) => {
    try {
      const M = getModel('wx.tradition')
      if (!M) return err(res, 500, 'Model not found')
      const books = await (M as any).fetch(M, env(), [], undefined, { order: 'id ASC' })
      ok(res, { books })
    } catch (e: any) { err(res, 500, e.message) }
  }
})

// GET /api/witness/hadith?slug=bukhari&page=1&limit=20
globalRoutes.push({
  method: 'GET',
  path: '/api/witness/hadith',
  handler: async (req: any, res: any) => {
    try {
      const query = parseQuery(req.url)
      const slug = query.slug
      const page = parseInt(query.page || '1')
      const limit = Math.min(parseInt(query.limit || '20'), 100)
      const offset = (page - 1) * limit

      if (!slug) return err(res, 400, 'slug parameter required')

      const Tradition = getModel('wx.tradition')
      const Item = getModel('wx.tradition.item')
      if (!Tradition || !Item) return err(res, 500, 'Models not found')

      const [book] = await (Tradition as any).fetch(Tradition, env(), [['slug', '=', slug]])
      if (!book) return err(res, 404, `Hadith book '${slug}' not found`)

      const items = await (Item as any).fetch(Item, env(), [['collectionId', '=', book.id]], undefined, {
        limit, offset, order: 'number ASC'
      })

      ok(res, {
        book: { id: book.id, name: book.name, slug: book.slug, totalItems: book.totalItems, gradeLevel: book.gradeLevel },
        page, limit,
        items
      })
    } catch (e: any) { err(res, 500, e.message) }
  }
})

// GET /api/witness/traditions — prophetic traditions (non-Islamic)
globalRoutes.push({
  method: 'GET',
  path: '/api/witness/traditions',
  handler: async (_req: any, res: any) => {
    try {
      const Tradition = getModel('wx.tradition')
      const Item = getModel('wx.tradition.item')
      if (!Tradition || !Item) return err(res, 500, 'Models not found')

      const collections = await (Tradition as any).fetch(Tradition, env(), [['category', '=', 'Prophetic Tradition']], undefined, { order: 'id ASC' })

      const result = []
      for (const col of collections) {
        const items = await (Item as any).fetch(Item, env(), [['collectionId', '=', col.id]], undefined, { order: 'number ASC' })
        result.push({ collection: col, items })
      }
      ok(res, { traditions: result })
    } catch (e: any) { err(res, 500, e.message) }
  }
})

// ═══════════════════════════════════════════
// ✨ ASMAUL HUSNA
// ═══════════════════════════════════════════

// GET /api/witness/asmaul-husna
globalRoutes.push({
  method: 'GET',
  path: '/api/witness/asmaul-husna',
  handler: async (_req: any, res: any) => {
    try {
      const M = getModel('wx.asmaul.husna')
      if (!M) return err(res, 500, 'Model not found')
      const names = await (M as any).fetch(M, env(), [], undefined, { order: 'number ASC' })
      ok(res, { count: names.length, names })
    } catch (e: any) { err(res, 500, e.message) }
  }
})

// ═══════════════════════════════════════════
// 🤲 DEVOTION ROUTES
// ═══════════════════════════════════════════

// GET /api/witness/devotions?type=dhikr&category=Harian
globalRoutes.push({
  method: 'GET',
  path: '/api/witness/devotions',
  handler: async (req: any, res: any) => {
    try {
      const query = parseQuery(req.url)
      const M = getModel('wx.devotion')
      if (!M) return err(res, 500, 'Model not found')

      const domain: any[] = []
      if (query.type) domain.push(['type', '=', query.type])
      if (query.category) domain.push(['category', '=', query.category])

      const devotions = await (M as any).fetch(M, env(), domain, undefined, { order: 'number ASC' })
      ok(res, { count: devotions.length, devotions })
    } catch (e: any) { err(res, 500, e.message) }
  }
})

// ═══════════════════════════════════════════
// 🌙 ASTRONOMY ROUTES
// ═══════════════════════════════════════════

// GET /api/witness/astronomy/moon-phase?date=2024-01-01
globalRoutes.push({
  method: 'GET',
  path: '/api/witness/astronomy/moon-phase',
  handler: async (req: any, res: any) => {
    try {
      const query = parseQuery(req.url)
      const date = query.date ? new Date(query.date) : new Date()
      const data = getMoonData(date)
      ok(res, { date: date.toISOString(), ...data })
    } catch (e: any) { err(res, 500, e.message) }
  }
})

// GET /api/witness/astronomy/prayer-times?lat=-6.2&lng=106.8&date=2024-01-01
globalRoutes.push({
  method: 'GET',
  path: '/api/witness/astronomy/prayer-times',
  handler: async (req: any, res: any) => {
    try {
      const query = parseQuery(req.url)
      const lat = parseFloat(query.lat || '-6.2')
      const lng = parseFloat(query.lng || '106.8')
      const date = query.date ? new Date(query.date) : new Date()

      const prayerData = getIslamicData(lat, lng, date)
      const dailyTimes = getDailyPrayerTimes(lat, lng, date)

      ok(res, {
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
      })
    } catch (e: any) { err(res, 500, e.message) }
  }
})

// ═══════════════════════════════════════════
// 🌍 EXTERNAL DATA PROXIES (MOCK / REAL)
// ═══════════════════════════════════════════

globalRoutes.push({
  method: 'GET',
  path: '/api/external/usgs/earthquakes',
  handler: async (_req: any, res: any) => {
    try {
      const resp = await fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_day.geojson')
      const data = await resp.json()
      ok(res, data)
    } catch (e: any) { err(res, 500, e.message) }
  }
})

globalRoutes.push({
  method: 'GET',
  path: '/api/external/iss',
  handler: async (_req: any, res: any) => {
    try {
      const resp = await fetch('http://api.open-notify.org/iss-now.json')
      const data = await resp.json()
      ok(res, data)
    } catch (e: any) { err(res, 500, e.message) }
  }
})

globalRoutes.push({
  method: 'GET',
  path: '/api/external/trends',
  handler: async (_req: any, res: any) => {
    try {
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
      ok(res, items.slice(0, 10))
    } catch (e: any) { err(res, 500, e.message) }
  }
})

globalRoutes.push({
  method: 'GET',
  path: '/api/external/nasa/donki/cme',
  handler: async (req: any, res: any) => {
    try {
      const query = parseQuery(req.url)
      const startDate = query.startDate || new Date().toISOString().split('T')[0]
      const data = await cache.remember(`nasa-cme-${startDate}`, 3600, async () => {
        const resp = await fetch(`https://api.nasa.gov/DONKI/CME?startDate=${startDate}&api_key=DEMO_KEY`)
        return await resp.json()
      })
      ok(res, data)
    } catch (e: any) { err(res, 500, e.message) }
  }
})

globalRoutes.push({
  method: 'GET',
  path: '/api/external/opensky',
  handler: async (_req: any, res: any) => {
    try {
      const data = await cache.remember('opensky-europe', 300, async () => {
        const resp = await fetch('https://opensky-network.org/api/states/all?lamin=45.8389&lomin=5.9962&lamax=47.8229&lomax=10.4921')
        return await resp.json()
      })
      ok(res, data)
    } catch (e: any) { err(res, 500, e.message) }
  }
})

globalRoutes.push({
  method: 'GET',
  path: '/api/external/weather',
  handler: async (req: any, res: any) => {
    try {
      const query = parseQuery(req.url)
      const lat = query.latitude || '-6.2'
      const lng = query.longitude || '106.8'
      const data = await cache.remember(`weather-${lat}-${lng}`, 1800, async () => {
        const resp = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current_weather=true`)
        return await resp.json()
      })
      ok(res, data)
    } catch (e: any) { err(res, 500, e.message) }
  }
})

globalRoutes.push({
  method: 'GET',
  path: '/api/external/binance/ticker',
  handler: async (req: any, res: any) => {
    try {
      const query = parseQuery(req.url)
      const symbol = query.symbol || 'BTCUSDT'
      const data = await cache.remember(`binance-${symbol}`, 60, async () => {
        const resp = await fetch(`https://api.binance.com/api/v3/ticker/24hr?symbol=${symbol}`)
        return await resp.json()
      })
      ok(res, data)
    } catch (e: any) { err(res, 500, e.message) }
  }
})

globalRoutes.push({
  method: 'GET',
  path: '/api/witness/bookmarks',
  handler: async (req: any, res: any) => {
    try {
      const query = parseQuery(req.url)
      const userId = parseInt(query.userId || '0')
      if (!userId) return err(res, 401, 'User ID required')

      const Bookmark = getModel('wx.bookmark')
      if (!Bookmark) return err(res, 500, 'Model not found')
      
      const results = await (Bookmark as any).fetch(Bookmark, env(), [['userId', '=', userId]], undefined, { with: ['bookId', 'verseId'] })
      ok(res, results)
    } catch (e: any) { err(res, 500, e.message) }
  }
})

globalRoutes.push({
  method: 'GET',
  path: '/api/witness/history',
  handler: async (req: any, res: any) => {
    try {
      const query = parseQuery(req.url)
      const userId = parseInt(query.userId || '0')
      if (!userId) return err(res, 401, 'User ID required')

      const History = getModel('wx.history')
      if (!History) return err(res, 500, 'Model not found')
      
      const results = await (History as any).fetch(History, env(), [['userId', '=', userId]], undefined, { with: ['bookId', 'lastVerseId'], order: 'updatedAt DESC' })
      ok(res, results)
    } catch (e: any) { err(res, 500, e.message) }
  }
})

export function registerWitnessRoutes() {
  console.log('[moon-witness] custom API routes registered')
}
