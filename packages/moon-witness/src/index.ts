import WxScripture from './models/wx-scripture.js'
import WxScriptureBook from './models/wx-scripture-book.js'
import WxScriptureVerse from './models/wx-scripture-verse.js'
import WxTradition from './models/wx-tradition.js'
import WxTraditionItem from './models/wx-tradition-item.js'
import WxDevotion from './models/wx-devotion.js'
import WxAsmaulHusna from './models/wx-asmaul-husna.js'
import WxBookmark from './models/wx-bookmark.js'
import WxHistory from './models/wx-history.js'

// Astronomy (pure compute — no DB)
export { getMoonData, type MoonData } from './astronomy/moon-phase.js'
export { getIslamicData, getDailyPrayerTimes, type PrayerData, type DailyPrayerTimes } from './astronomy/prayer-times.js'
export { getSunPosition, getDuhaTime, type SunPositionData, type DuhaTimeData, type DuhaStatus } from './astronomy/sun-position.js'

// Routes
export { registerWitnessRoutes } from './routes.js'

// Models export
export {
  WxScripture,
  WxScriptureBook,
  WxScriptureVerse,
  WxTradition,
  WxTraditionItem,
  WxDevotion,
  WxAsmaulHusna,
  WxBookmark,
  WxHistory
}

/**
 * @moon/witness — Divine Knowledge Addon
 * 
 * 📖 Scripture:  wx.scripture → wx.scripture.book → wx.scripture.verse
 * 📜 Tradition:  wx.tradition → wx.tradition.item
 * 🤲 Devotion:   wx.devotion (Adhkar, Doa, Hymns)
 * ✨ Asmaul Husna: wx.asmaul.husna (99 Names of Allah)
 * 🔖 User:       wx.bookmark, wx.history
 * 🌙 Astronomy:  getMoonData(), getIslamicData(), getDailyPrayerTimes()
 */
export default {
  name: 'witness',
  description: 'Divine Knowledge, Scriptures, Traditions & Astronomy',
  depends: ['base'],
  models: [
    WxScripture,
    WxScriptureBook,
    WxScriptureVerse,
    WxTradition,
    WxTraditionItem,
    WxDevotion,
    WxAsmaulHusna,
    WxBookmark,
    WxHistory
  ]
}
