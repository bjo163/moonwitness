import WxEntity from './models/wx-entity.js'
import WxEntityAlias from './models/wx-entity-alias.js'
import WxEntityIdentifier from './models/wx-entity-identifier.js'
import WxSource from './models/wx-source.js'
import WxSourcePolicy from './models/wx-source-policy.js'
import WxProvenance from './models/wx-provenance.js'
import WxRelationType from './models/wx-relation-type.js'
import WxRelation from './models/wx-relation.js'
import WxReligion from './models/wx-religion.js'
import WxCommunity from './models/wx-community.js'
import WxScripture from './models/wx-scripture.js'
import WxScriptureBook from './models/wx-scripture-book.js'
import WxScriptureVerse from './models/wx-scripture-verse.js'
import WxTradition from './models/wx-tradition.js'
import WxTraditionItem from './models/wx-tradition-item.js'
import WxDevotion from './models/wx-devotion.js'
import WxAsmaulHusna from './models/wx-asmaul-husna.js'
import WxBookmark from './models/wx-bookmark.js'
import WxHistory from './models/wx-history.js'

// Graph core
export * from './graph/contracts.js'
export * from './graph/identity.js'
export * from './graph/relation-ontology.js'
export { WitnessGraphService } from './graph/service.js'
export { seedWitnessGraphCore } from './seed/graph-core.js'

// Astronomy (pure compute — no DB)
export { getMoonData, type MoonData } from './astronomy/moon-phase.js'
export { getIslamicData, getDailyPrayerTimes, type PrayerData, type DailyPrayerTimes } from './astronomy/prayer-times.js'
export { getSunPosition, getDuhaTime, type SunPositionData, type DuhaTimeData, type DuhaStatus } from './astronomy/sun-position.js'

// Routes
export { registerWitnessRoutes } from './routes.js'

// Models export
export {
  WxEntity,
  WxEntityAlias,
  WxEntityIdentifier,
  WxSource,
  WxSourcePolicy,
  WxProvenance,
  WxRelationType,
  WxRelation,
  WxReligion,
  WxCommunity,
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
 * @moon/witness — connected Revelation Knowledge Graph addon.
 *
 * Canonical graph core:
 *   wx.entity -> aliases / identifiers / typed relations
 *   wx.relation -> wx.provenance -> wx.source -> wx.source.policy
 *
 * Legacy Scripture/Tradition/Asma models remain registered temporarily for
 * migration compatibility. New canonical domain work binds to wx.entity and
 * follows #64/#67 authority, provenance and epistemic contracts.
 */
export default {
  name: 'witness',
  description: 'Connected Revelation Knowledge Graph, Traditions, Evidence & Astronomy',
  depends: ['base'],
  models: [
    WxEntity,
    WxEntityAlias,
    WxEntityIdentifier,
    WxSource,
    WxSourcePolicy,
    WxProvenance,
    WxRelationType,
    WxRelation,
    WxReligion,
    WxCommunity,
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
