"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useLanguage } from "@workspace/state"
import { useGlobalAudio } from "@workspace/state"
import { AsbabunNuzulModal } from "./modals/asbabun-nuzul-modal"
import { WordByWordModal } from "./modals/word-by-word-modal"
import { AudioWaveformVisualizer } from "@workspace/ui"
import { HifzTrainerModal } from "./modals/hifz-trainer-modal"
import { toPng } from "html-to-image"
import {
  Share2,
  Loader2,
  Play,
  Pause,
  Moon,
  Link as LinkIcon,
  MessageSquare,
  Palette,
} from "lucide-react"

const SURAH_TRANSLATIONS_EN: Record<number, string> = {
  1: "The Opening",
  2: "The Cow",
  3: "Family of Imran",
  4: "The Women",
  5: "The Table Spread",
  6: "The Cattle",
  7: "The Heights",
  8: "The Spoils of War",
  9: "The Repentance",
  10: "Jonah",
  11: "Hud",
  12: "Joseph",
  13: "The Thunder",
  14: "Abraham",
  15: "The Rocky Tract",
  16: "The Bee",
  17: "The Night Journey",
  18: "The Cave",
  19: "Mary",
  20: "Ta-Ha",
  21: "The Prophets",
  22: "The Pilgrimage",
  23: "The Believers",
  24: "The Light",
  25: "The Criterion",
  26: "The Poets",
  27: "The Ant",
  28: "The Stories",
  29: "The Spider",
  30: "The Romans",
  31: "Luqman",
  32: "The Prostration",
  33: "The Combined Forces",
  34: "Sheba",
  35: "Originator",
  36: "Ya-Sin",
  37: "Those who set the Ranks",
  38: "The Letter Sad",
  39: "The Troops",
  40: "The Forgiver",
  41: "Explained in Detail",
  42: "The Consultation",
  43: "The Ornaments of Gold",
  44: "The Smoke",
  45: "The Crouching",
  46: "The Wind-curved Sandhills",
  47: "Muhammad",
  48: "The Victory",
  49: "The Dwellings",
  50: "The Letter Qaf",
  51: "The Winnowing Winds",
  52: "The Mount",
  53: "The Star",
  54: "The Moon",
  55: "The Beneficent",
  56: "The Inevitable",
  57: "The Iron",
  58: "The Pleading Woman",
  59: "The Exile",
  60: "She that is to be examined",
  61: "The Ranks",
  62: "The Congregation",
  63: "The Hypocrites",
  64: "Mutual Disillusion",
  65: "The Divorce",
  66: "The Prohibition",
  67: "The Sovereignty",
  68: "The Pen",
  69: "The Inevitable",
  70: "The Ascending Stairways",
  71: "Noah",
  72: "The Jinn",
  73: "The Enshrouded One",
  74: "The Cloaked One",
  75: "The Resurrection",
  76: "Man",
  77: "The Emissaries",
  78: "The Tidings",
  79: "Those who drag forth",
  80: "He Frowned",
  81: "The Overthrowing",
  82: "The Cleaving",
  83: "The Defrauding",
  84: "The Sundering",
  85: "The Mansions of the Stars",
  86: "The Morning Star",
  87: "The Most High",
  88: "The Overwhelming",
  89: "The Dawn",
  90: "The City",
  91: "The Sun",
  92: "The Night",
  93: "The Morning Hours",
  94: "The Relief",
  95: "The Fig",
  96: "The Clot",
  97: "The Power",
  98: "The Clear Proof",
  99: "The Earthquake",
  100: "The Courser",
  101: "The Calamity",
  102: "Rivalry in world increase",
  103: "The Declining Day",
  104: "The Traducer",
  105: "The Elephant",
  106: "Quraysh",
  107: "Small Kindnesses",
  108: "Abundance",
  109: "The Disbelievers",
  110: "Divine Support",
  111: "The Palm Fibre",
  112: "Sincerity / Monotheism",
  113: "The Daybreak",
  114: "Mankind",
}

const ASMAUL_HUSNA_EN: Record<number, string> = {
  1: "The All-Merciful",
  2: "The Most Merciful",
  3: "The Sovereign",
  4: "The Most Holy",
  5: "The Source of Peace",
  6: "The Giver of Security",
  7: "The Guardian",
  8: "The Almighty",
  9: "The Compeller",
  10: "The Supreme",
  11: "The Creator",
  12: "The Maker of Order",
  13: "The Shaper of Beauty",
  14: "The Forgiving",
  15: "The Subduer",
  16: "The Bestower",
  17: "The Provider",
  18: "The Opener",
  19: "The All-Knowing",
  20: "The Withholder",
  21: "The Extender",
  22: "The Abaser",
  23: "The Exalter",
  24: "The Bestower of Honour",
  25: "The Humiliator",
  26: "The All-Hearing",
  27: "The All-Seeing",
  28: "The Judge",
  29: "The Just",
  30: "The Subtle One",
  31: "The All-Aware",
  32: "The Forbearing",
  33: "The Magnificent",
  34: "The Forgiving",
  35: "The Grateful",
  36: "The Most High",
  37: "The Most Great",
  38: "The Preserver",
  39: "The Sustainer",
  40: "The Reckoner",
  41: "The Majestic",
  42: "The Bountiful",
  43: "The Watchful",
  44: "The Answerer of Prayers",
  45: "The All-Encompassing",
  46: "The All-Wise",
  47: "The Loving One",
  48: "The Most Glorious",
  49: "The Resurrecter",
  50: "The Witness",
  51: "The Absolute Truth",
  52: "The Trustee",
  53: "The All-Strong",
  54: "The Firm",
  55: "The Protecting Friend",
  56: "The Praiseworthy",
  57: "The Reckoner of All",
  58: "The Originator",
  59: "The Restorer",
  60: "The Giver of Life",
  61: "The Creator of Death",
  62: "The Ever-Living",
  63: "The Self-Subsisting",
  64: "The Finder",
  65: "The Glorious",
  66: "The Unique",
  67: "The One",
  68: "The Eternal Refuge",
  69: "The Omnipotent",
  70: "The Powerful",
  71: "The Expediter",
  72: "The Delayer",
  73: "The First",
  74: "The Last",
  75: "The Manifest",
  76: "The Hidden",
  77: "The Governor",
  78: "The Most Exalted",
  79: "The Source of All Goodness",
  80: "The Acceptor of Repentance",
  81: "The Avenger",
  82: "The Pardoner",
  83: "The Most Kind",
  84: "Owner of All Sovereignty",
  85: "Lord of Majesty and Honour",
  86: "The Equitable",
  87: "The Gatherer",
  88: "The Self-Sufficient",
  89: "The Enricher",
  90: "The Preventer",
  91: "The Distresser",
  92: "The Propitiator",
  93: "The Light",
  94: "The Guide",
  95: "The Incomparable Originator",
  96: "The Everlasting",
  97: "The Inheritor",
  98: "The Guide to the Right Path",
  99: "The Patient",
}

type DailyData = {
  sequenceNumber: number
  dateStr: string
  formattedDate: string
  prayerPeriod: {
    code: string
    name: string
    icon: string
    timeRange: string
  }
  nextPeriod?: {
    code: string
    name: string
    timeRange: string
  }
  ayah: {
    id: number
    surahNumber: number
    surahName: string
    surahTranslationId?: string
    surahTranslationEn?: string
    ayahNumber: number
    textArabic: string
    textLatin: string
    translationId: string
    translationEn?: string
    audioUrl?: string
  }
  asmaulSurah?: {
    number: number
    nameArabic: string
    nameLatin: string
    translationId: string
  }
  asmaulAyah?: {
    number: number
    nameArabic: string
    nameLatin: string
    translationId: string
  }
  hadith?: {
    bookId: string
    bookName: string
    number: number
    textId: string
    textEn?: string
    grade?: string
    levelBadge?: string
  }
  wisdom?: {
    title: string
    quote: string
    quoteEn?: string
    source: string
    sourceEn?: string
  }
  globalStats?: {
    totalAyahs: number
    seenAyahsCount: number
    totalPeriodsElapsed: number
  }
}

export function DailyInspirationClient() {
  const { t, lang } = useLanguage()
  const { isPlaying, play, togglePlay: globalTogglePlay } = useGlobalAudio()
  const [data, setData] = useState<DailyData | null>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const [copiedPrompt, setCopiedPrompt] = useState(false)
  const [expandHadith, setExpandHadith] = useState(false)
  const [isPlayingAudio, setIsPlayingAudio] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [isZapping, setIsZapping] = useState(false)

  const [liveTime, setLiveTime] = useState<string>("")
  const [nextPrayer, setNextPrayer] = useState<{
    name: string
    formattedCountdown: string
    percentage: number
  } | null>(null)

  const [isExporting, setIsExporting] = useState(false)

  async function exportDashboardPNG() {
    const node = document.getElementById("whatsapp-share-card")
    if (!node || !data) return

    setIsExporting(true)
    try {
      const dataUrl = await toPng(node, { cacheBust: true, pixelRatio: 2 })
      const link = document.createElement("a")
      link.download = `MoonWitness_Transmission_${data.dateStr}.png`
      link.href = dataUrl
      link.click()
    } catch (err) {
      console.error("Failed to export dashboard:", err)
    } finally {
      setIsExporting(false)
    }
  }

  const triggerZapEffect = () => {
    setIsZapping(true)
    setTimeout(() => setIsZapping(false), 400) // End visual glitch

    try {
      const AudioContextClass =
        window.AudioContext || (window as any).webkitAudioContext
      if (!AudioContextClass) return

      const ctx = new AudioContextClass()
      const now = ctx.currentTime

      // 1. High Voltage Electric Crackle (Sawtooth)
      const crackle = ctx.createOscillator()
      const crackleGain = ctx.createGain()
      crackle.type = "sawtooth"
      crackle.connect(crackleGain)
      crackleGain.connect(ctx.destination)

      crackle.frequency.setValueAtTime(150, now)
      crackle.frequency.exponentialRampToValueAtTime(1200, now + 0.3) // Sweep up for sci-fi feel

      // 2. Modulator to create the "Zzzzzzt" stutter effect (Square wave LFO at 50Hz)
      const modulator = ctx.createOscillator()
      const modGain = ctx.createGain()
      modulator.type = "square"
      modulator.frequency.value = 50 // 50 Hz electric hum rate
      modulator.connect(modGain)

      // Modulate the volume of the crackle to make it stutter rapidly
      modGain.connect(crackleGain.gain)
      modGain.gain.setValueAtTime(0.4, now)

      // Overall volume envelope for the zap
      crackleGain.gain.setValueAtTime(0, now)
      crackleGain.gain.linearRampToValueAtTime(0.4, now + 0.02) // Sharp attack
      crackleGain.gain.exponentialRampToValueAtTime(0.01, now + 0.4) // Fast decay

      crackle.start(now)
      modulator.start(now)
      crackle.stop(now + 0.4)
      modulator.stop(now + 0.4)

      // 3. Sub-bass Thump (Gives the electric shock some weight/punch)
      const sub = ctx.createOscillator()
      const subGain = ctx.createGain()
      sub.type = "sine"
      sub.connect(subGain)
      subGain.connect(ctx.destination)

      sub.frequency.setValueAtTime(120, now)
      sub.frequency.exponentialRampToValueAtTime(30, now + 0.3)

      subGain.gain.setValueAtTime(0, now)
      subGain.gain.linearRampToValueAtTime(0.5, now + 0.02)
      subGain.gain.exponentialRampToValueAtTime(0.01, now + 0.3)

      sub.start(now)
      sub.stop(now + 0.3)
    } catch (e) {
      console.warn("Futuristic audio play failed", e)
    }
  }

  useEffect(() => {
    setTimeout(() => setMounted(true), 0)

    async function fetchDailyData() {
      try {
        const res = await fetch("/api/daily")
        if (res.ok) {
          const json = await res.json()
          setData(json)
          // Play sound and visual effect when transmission descends
          setTimeout(triggerZapEffect, 300)
        }
      } catch (err) {
        console.warn("Failed to load daily inspiration:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchDailyData()
  }, [])

  useEffect(() => {
    if (!mounted) return

    function updateTimeAndCountdown() {
      const now = new Date()
      const hours = now.getHours().toString().padStart(2, "0")
      const minutes = now.getMinutes().toString().padStart(2, "0")
      const seconds = now.getSeconds().toString().padStart(2, "0")
      setLiveTime(
        `${hours}:${minutes}:${seconds} ${lang === "en" ? "UTC+7" : "WIB"}`
      )

      if (!data?.prayerPeriod) return

      const periodStartMap: Record<
        string,
        { h: number; m: number; labelEn: string; labelId: string }
      > = {
        subuh: { h: 4, m: 35, labelEn: "DAWN / SUBUH", labelId: "SUBUH" },
        dhuha: { h: 6, m: 0, labelEn: "MORNING / DHUHA", labelId: "DHUHA" },
        zuhur: { h: 12, m: 5, labelEn: "NOON / ZUHUR", labelId: "ZUHUR" },
        asar: { h: 15, m: 25, labelEn: "AFTERNOON / ASAR", labelId: "ASAR" },
        maghrib: {
          h: 18,
          m: 0,
          labelEn: "SUNSET / MAGHRIB",
          labelId: "MAGHRIB",
        },
        isya: { h: 19, m: 15, labelEn: "NIGHT / ISYA", labelId: "ISYA" },
      }

      const nextMap: Record<string, string> = {
        subuh: "dhuha",
        dhuha: "zuhur",
        zuhur: "asar",
        asar: "maghrib",
        maghrib: "isya",
        isya: "subuh",
      }

      const currentCode = data.prayerPeriod.code
      const nextCode = nextMap[currentCode] || "subuh"

      const targetInfo = periodStartMap[nextCode] || {
        h: 4,
        m: 35,
        labelEn: "DAWN / SUBUH",
        labelId: "SUBUH",
      }

      const target = new Date()
      target.setHours(targetInfo.h, targetInfo.m, 0, 0)
      if (target.getTime() <= now.getTime()) {
        target.setDate(target.getDate() + 1)
      }

      const diffMs = target.getTime() - now.getTime()
      if (diffMs > 0) {
        const diffHrs = Math.floor(diffMs / (1000 * 60 * 60))
        const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))
        const diffSecs = Math.floor((diffMs % (1000 * 60)) / 1000)

        const labelName =
          lang === "en" ? targetInfo.labelEn : targetInfo.labelId
        const formatted = `${diffHrs > 0 ? `${diffHrs}H ` : ""}${diffMins}M ${diffSecs}S`
        const totalMs = 4 * 60 * 60 * 1000 // roughly 4 hours
        const percentage = Math.max(0, Math.min(100, (diffMs / totalMs) * 100))

        setNextPrayer({
          name: labelName,
          formattedCountdown: formatted,
          percentage: percentage,
        })
      }
    }

    updateTimeAndCountdown()
    const timer = setInterval(updateTimeAndCountdown, 1000)
    return () => clearInterval(timer)
  }, [mounted, data, lang])

  // Sync global play state to local audio element
  useEffect(() => {
    const audioEl = document.getElementById(
      "daily-ayah-audio"
    ) as HTMLAudioElement
    if (!audioEl) return

    if (isPlaying) {
      audioEl.play().catch((e) => console.error("Audio play failed", e))
      setTimeout(() => setIsPlayingAudio(true), 0)
    } else {
      audioEl.pause()
      setIsPlayingAudio(false)
    }
  }, [isPlaying])

  const toggleAudio = () => {
    const audioEl = document.getElementById(
      "daily-ayah-audio"
    ) as HTMLAudioElement
    if (!audioEl) return

    if (!isPlaying) {
      play({
        number: data?.ayah?.surahNumber || 1,
        name: data?.ayah?.surahName || "Al-Fatihah",
      })
    } else {
      globalTogglePlay()
    }
  }

  function getCustomTafsirNote(): string {
    if (!data)
      return t(
        "Contemplation of universal obedience to the Almighty Creator and Divine Unity.",
        "Perenungan tentang ketaatan alam kepada Perintah Tuhan dan keagungan tauhid."
      )

    try {
      const erpSaved = localStorage.getItem("mw_erp_scripture_items")
      if (erpSaved) {
        const parsed = JSON.parse(erpSaved)
        if (Array.isArray(parsed) && parsed.length > 0) {
          const match = parsed.find(
            (item: any) =>
              item.surah_number === data.ayah.surahNumber &&
              item.ayah_number === data.ayah.ayahNumber
          )
          if (match && match.notes) {
            return match.notes
          }
        }
      }

      const notesSaved = localStorage.getItem("mw_erp_scriptures_notes")
      if (notesSaved) {
        const parsed = JSON.parse(notesSaved)
        if (Array.isArray(parsed) && parsed.length > 0) {
          const match = parsed.find((n: any) =>
            n.surah?.toLowerCase().includes(data.ayah.surahName?.toLowerCase())
          )
          if (match?.noteText) {
            return match.noteText.replace(
              /^Rotasi\s+Periode\s+Shalat\s+[^-]+-\s*/i,
              ""
            )
          }
        }
      }
    } catch (e) {
      console.warn("Failed to parse tafsir notes:", e)
    }

    return t(
      "Contemplation of cosmic obedience to the Sovereign Creator and Divine Unity.",
      "Tadabbur tentang ketaatan semesta alam kepada Sang Maha Pencipta dan keagungan tauhid."
    )
  }

  const [copiedUrl, setCopiedUrl] = useState(false)

  function getCoolShareUrl(): string {
    if (typeof window === "undefined") return ""
    if (!data) return window.location.origin
    const s = data.ayah.surahNumber
    const a = data.ayah.ayahNumber
    const period = data.prayerPeriod?.code || "maghrib"
    const coolId = `MW-${s}-${a}-${period}`
    return `${window.location.origin}/s/${coolId}`
  }

  function copyDynamicShareUrl() {
    if (!data) return
    const dynamicUrl = getCoolShareUrl()
    navigator.clipboard.writeText(dynamicUrl)
    setCopiedUrl(true)
    setTimeout(() => setCopiedUrl(false), 2500)
  }

  function buildTransmissionText(): string {
    if (!data) return ""
    const dynamicUrl = getCoolShareUrl()
    const currentTranslation =
      lang === "en"
        ? data.ayah.translationEn || data.ayah.translationId
        : data.ayah.translationId

    let textToCopy = `✦ MOONWITNESS — ANCIENT SCRIPTURE & COSMIC LORE TRANSMISSION\n`
    textToCopy += `◈ ${data.prayerPeriod?.name || "Prayer Period"} (${formatBilingualDate(data.dateStr, data.formattedDate)} • ${liveTime || "UTC+7"})\n`
    textToCopy += `-------------------------------------------\n\n`
    textToCopy += `⬡ Q.S ${data.ayah.surahName} (${data.ayah.surahNumber}:${data.ayah.ayahNumber})\n\n`
    textToCopy += `${data.ayah.textArabic}\n\n`
    if (data.ayah.textLatin) {
      textToCopy += `_"${data.ayah.textLatin}"_\n\n`
    }
    textToCopy += `Translation:\n"${currentTranslation}"\n\n`

    textToCopy += `✦ Divine Tafsir & Lore Notes: \n"${getCustomTafsirNote()}"\n\n`

    const asmaulSurahMeaning =
      lang === "en" && data.asmaulSurah
        ? ASMAUL_HUSNA_EN[data.asmaulSurah.number] ||
          data.asmaulSurah.translationId
        : data.asmaulSurah?.translationId

    if (data.asmaulSurah) {
      textToCopy += `✨ Surah Pair Runic (#${data.asmaulSurah.number}): ${data.asmaulSurah.nameLatin} (${data.asmaulSurah.nameArabic}) — "${asmaulSurahMeaning}"\n`
    }

    const asmaulAyahMeaning =
      lang === "en" && data.asmaulAyah
        ? ASMAUL_HUSNA_EN[data.asmaulAyah.number] ||
          data.asmaulAyah.translationId
        : data.asmaulAyah?.translationId

    if (data.asmaulAyah) {
      textToCopy += `✨ Ayah Pair Runic (#${data.asmaulAyah.number}): ${data.asmaulAyah.nameLatin} (${data.asmaulAyah.nameArabic}) — "${asmaulAyahMeaning}"\n`
    }

    if (data.hadith) {
      const hText =
        lang === "en"
          ? data.hadith.textEn || data.hadith.textId
          : data.hadith.textId
      textToCopy += `\n◈ Prophetic Hadith (${data.hadith.bookName} No. ${data.hadith.number}):\n"${hText}"\n`
    }

    if (data.wisdom) {
      const wText =
        lang === "en"
          ? data.wisdom.quoteEn || data.wisdom.quote
          : data.wisdom.quote
      const wSource =
        lang === "en"
          ? data.wisdom.sourceEn || data.wisdom.source
          : data.wisdom.source
      textToCopy += `\n◆ Ancient Wisdom & Sacred Lore: \n"${wText}"\n— _${wSource}_\n`
    }

    textToCopy += `\n-------------------------------------------\n`
    textToCopy += `⌗ Official Link: ${dynamicUrl}\n`
    textToCopy += `◈ MoonWitness Platform: When the Moon Witness, We Share Messages.`

    return textToCopy
  }

  function copyVerseForWhatsApp() {
    if (!data) return
    const textToCopy = buildTransmissionText()
    navigator.clipboard.writeText(textToCopy)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  // ──── GEN-Z TITLE GENERATOR ────
  const GEN_Z_TITLES: Record<number, string> = {
    1: "DIVINE UNLOCK",
    2: "SACRED GRIND",
    3: "FAITH BUFF",
    4: "QUEEN ENERGY",
    5: "HALAL FEAST",
    6: "BEAST ORIGIN",
    7: "PEAK ASCEND",
    8: "LOOT DROP",
    9: "NO CAP REPENT",
    10: "JONAH ARC",
    11: "SIGMA FAITH",
    12: "GOAT STORY",
    13: "THUNDER BUFF",
    14: "RIZZ LEGACY",
    15: "ROCKY PATH",
    16: "BEE PROTOCOL",
    17: "NIGHT QUEST",
    18: "CAVE LORE",
    19: "BLESSED SPAWN",
    20: "MAIN QUEST",
    21: "PROPHET META",
    22: "PILGRIM GRIND",
    23: "BASED BELIEF",
    24: "LIGHT BEAM",
    25: "TRUTH CHECK",
    26: "POET STANCE",
    27: "ANT RAID",
    28: "EPIC LORE",
    29: "SPIDER WEB",
    30: "ROMAN ERA",
    31: "WISE SAGE",
    32: "BOW DOWN",
    33: "SQUAD GOALS",
    34: "SHEBA DRIP",
    35: "ORIGIN STORY",
    36: "CORE WISDOM",
    37: "RANK CHECK",
    38: "SIGMA LETTER",
    39: "TROOP RALLY",
    40: "MERCY DROP",
    41: "DEEP LORE",
    42: "COUNCIL CHAT",
    43: "GOLD FLEX",
    44: "SMOKE SIGNAL",
    45: "KNEEL CHECK",
    46: "SAND DRIFT",
    47: "GOAT PATH",
    48: "W SECURED",
    49: "CRIB RULES",
    50: "LETTER DROP",
    51: "WIND FORCE",
    52: "MOUNT BUFF",
    53: "STAR PULL",
    54: "MOON SPLIT",
    55: "MERCY RAIN",
    56: "FINAL BOSS",
    57: "IRON WILL",
    58: "HEARD THAT",
    59: "EXILE MODE",
    60: "VIBE CHECK",
    61: "RANK UP",
    62: "SQUAD MEET",
    63: "FAKE DETECT",
    64: "REAL TALK",
    65: "SPLIT PATH",
    66: "BAN HAMMER",
    67: "KING ENERGY",
    68: "PEN GAME",
    69: "CLUTCH MOMENT",
    70: "STAIR CLIMB",
    71: "NOAH BUILT",
    72: "JINN REVEAL",
    73: "COZY GRIND",
    74: "CLOAK MODE",
    75: "RESPAWN DAY",
    76: "HUMAN PATCH",
    77: "SENT FORTH",
    78: "NEWS FLASH",
    79: "DRAG FORCE",
    80: "HUMBLE PIE",
    81: "FLIP RESET",
    82: "CRACK OPEN",
    83: "SCAM ALERT",
    84: "SPLIT OPEN",
    85: "STAR HOUSE",
    86: "DAWN STAR",
    87: "TOP TIER",
    88: "OVERWHELMED",
    89: "DAWN RAID",
    90: "CITY WALK",
    91: "SUN OATH",
    92: "NIGHT SHIFT",
    93: "MORNING GLOW",
    94: "RELIEF ERA",
    95: "FIG SEASON",
    96: "FIRST READ",
    97: "POWER NIGHT",
    98: "PROOF CHECK",
    99: "EARTH SHAKE",
    100: "SPEED RUN",
    101: "CHAOS MODE",
    102: "FLEX TRAP",
    103: "TIME DIFF",
    104: "ROAST MODE",
    105: "ELEPHANT W",
    106: "TRIBE LORE",
    107: "SMALL WINS",
    108: "ABUNDANCE W",
    109: "NO DEBATE",
    110: "DIVINE BUFF",
    111: "L RATIO",
    112: "ONE TRUTH",
    113: "DAWN SHIELD",
    114: "FINAL GUARD",
  }

  function copyImagePrompt() {
    if (!data) return

    const transmissionText = buildTransmissionText()

    const prompt = `Bertindaklah sebagai Creative Director yang sangat imajinatif, absurd, dan sangat paham kultur Gen-Z & Gamers. Buatkan konsep dan langsung generate gambar berdasarkan konteks ayat yang dilampirkan.

[PENTING: Gunakan orientasi vertikal (aspect ratio 9:16). Sebelum membuat gambar, ACAK secara otomatis 3 elemen di bawah ini agar hasil gambarnya selalu unik, bervariasi, dan futuristik!]

**1. ACAK FORMAT/MEDIUM GAMBAR (Pilih 1 secara acak):**
- Cinematic Game Poster (Gaya cover game AAA/film fiksi ilmiah dengan teks dramatis).
- Manga/Comic Book Panel (Terdapat panel komik terpisah, garis aksi cepat, dan efek suara komik).
- RPG Game UI Screen (Gambar seolah-olah screenshot dari game, lengkap dengan Bar HP, Inventory, dan kotak dialog).
- Holographic Infographic (Banyak elemen grafis sci-fi, statistik absurd, peta digital, dan data fiksi).
- Rare Trading Card (Desain seperti kartu TCG Yu-Gi-Oh!/Pokemon, tapi bernuansa cyber, lengkap dengan bintang/status card).

**2. ACAK GAYA VISUAL (Pilih 1 secara acak):**
- Cyberpunk 2077 Street-art (Neon terang, distopia, jalanan kotor tapi futuristik)
- Y2K Retro-Futurism (Gaya estetika tahun 2000-an, material krom, warna pop cerah)
- Mecha / Sci-Fi Anime (Gaya mecha Jepang, dramatis, kosmik, ledakan energi)
- Vaporwave / Synthwave (Warna ungu/pink neon, estetika 80-an retro-modern)

**3. ACAK KOMPOSISI KONTRAS (Pilih 1 secara acak untuk membedakan "Makna Spiritual" vs "Kelakuan Manusia Zaman Now"):**
- Diagonal Split-Screen (Terpotong miring secara tajam dan dramatis).
- Hologram Projection (Satu adegan adalah dunia nyata, adegan lain diproyeksikan dari kacamata VR/layar raksasa).
- Mirror/Puddle Reflection (Karakter melihat ke cermin/genangan air, tapi bayangan yang dipantulkan adalah realitas yang berbeda).
- Glitch Portal (Gambar setengah tersedot ke portal dimensi atau layar error).

**Instruksi Elemen Tetap (Wajib Ada di semua format):**
1. **JUDUL BESAR**: "GOD PROMISE - [1-2 Kata Bahasa Inggris]". Kata tambahannya harus bergaya hype/slang/gamers menyesuaikan ayat. Gunakan font ala Cyberpunk/Game.
2. **KARAKTER UTAMA**: 
   - **"Rocksoul"**: Visualisasikan mirip Crayon Shinchan tapi memakai hoodie techwear/gamer, kacamata futuristik/headset RGB, ekspresi tengil & absurd.
   - **"Master"**: Visualisasikan mirip Master Muthen Roshi tapi bergaya cyborg/cyberpunk.
   - **Karakter Ekstra (Opsional/Acak)**: Robot kecil lucu bergaya Arale.
3. **TEKS DOA (Dalam Gambar)**: Buatkan kotak teks/balon dialog berisi doa absurd/lucu maksimal 1-2 kalimat.
   - Wajib diawali kata: "Biiznillah,".
   - Wajib menyebutkan Asmaul Husna yang terlampir di data konteks.
   - Doanya harus spesifik, tajam, dan menyindir kelakuan "NPC/manusia zaman now" sesuai konteks ayat.
4. **FOOTER/QUOTES BAWAH**: 1 kalimat penutup di bawah gambar yang absurd, bergaya bahasa Gen-Z, tapi menyimpan pukulan hikmah yang dalam.

*(SANGAT KRITIKAL: Pastikan penulisan teks di dalam gambar dieja dengan bahasa Indonesia/Inggris yang sangat akurat tanpa typo!)*

Gunakan data konteks di bawah ini sebagai bahan racikanmu, pilih racikan elemen yang paling epik, lalu silakan langsung generate gambarnya:

=== KONTEKS TRANSMISSION LENGKAP ===
${transmissionText}`

    navigator.clipboard.writeText(prompt)
    setCopiedPrompt(true)
    setTimeout(() => setCopiedPrompt(false), 3000)
  }

  function formatBilingualDate(dateStr?: string, defaultFormatted?: string) {
    if (!dateStr) return defaultFormatted?.toUpperCase() || ""
    try {
      const parts = dateStr.split("-").map(Number)
      if (parts.length === 3 && parts[0] && parts[1] && parts[2]) {
        const date = new Date(Date.UTC(parts[0], parts[1] - 1, parts[2]))
        if (lang === "en") {
          return new Intl.DateTimeFormat("en-US", {
            dateStyle: "full",
            timeZone: "UTC",
          })
            .format(date)
            .toUpperCase()
        }
      }
    } catch {}
    return defaultFormatted?.toUpperCase() || ""
  }

  const rotationPercentRaw = data?.globalStats
    ? (data.globalStats.seenAyahsCount / data.globalStats.totalAyahs) * 100
    : 0
  const rotationPercentFormatted = rotationPercentRaw.toFixed(3)

  if (!mounted || (loading && !data)) {
    return (
      <div className="my-8 flex h-64 w-full flex-col items-center justify-center rounded-2xl border border-white/5 bg-black/40 font-sans backdrop-blur-xl">
        <div className="mb-2 flex animate-pulse items-center gap-3 text-primary">
          <span className="h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_10px_#00F0FF]" />
          <span className="text-xs font-light tracking-[0.3em] uppercase">
            ACQUIRING TRANSMISSION...
          </span>
        </div>
      </div>
    )
  }

  if (!data) return null

  // Format Prayer Period Name
  const pCode = (data.prayerPeriod?.code || "").toLowerCase()
  const periodLabel = t(
    pCode === "subuh"
      ? "DAWN CYCLE (SUBUH)"
      : pCode === "dhuha"
        ? "MORNING CYCLE (DHUHA)"
        : pCode === "zuhur"
          ? "NOON CYCLE (ZUHUR)"
          : pCode === "asar" || pCode === "ashar"
            ? "AFTERNOON CYCLE (ASAR)"
            : pCode === "maghrib"
              ? "SUNSET CYCLE (MAGHRIB)"
              : "NIGHT CYCLE (ISYA)",
    `PERIODE ${data.prayerPeriod?.name?.toUpperCase() || "SHALAT"}`
  )

  const surahMeaning =
    lang === "en"
      ? SURAH_TRANSLATIONS_EN[data.ayah.surahNumber] ||
        data.ayah.surahTranslationEn ||
        data.ayah.surahTranslationId
      : data.ayah.surahTranslationId

  const surahLabelText =
    surahMeaning &&
    surahMeaning.toLowerCase() !== data.ayah.surahName.toLowerCase()
      ? `Q.S ${data.ayah.surahName} (${surahMeaning.toUpperCase()}) (${data.ayah.surahNumber}:${data.ayah.ayahNumber})`
      : `Q.S ${data.ayah.surahName} (${data.ayah.surahNumber}:${data.ayah.ayahNumber})`

  const asmaulSurahMeaning =
    lang === "en" && data.asmaulSurah
      ? ASMAUL_HUSNA_EN[data.asmaulSurah.number] ||
        data.asmaulSurah.translationId
      : data.asmaulSurah?.translationId

  const asmaulAyahMeaning =
    lang === "en" && data.asmaulAyah
      ? ASMAUL_HUSNA_EN[data.asmaulAyah.number] || data.asmaulAyah.translationId
      : data.asmaulAyah?.translationId

  const hadithGradeText =
    lang === "en"
      ? data.hadith?.levelBadge === "Shahih" ||
        data.hadith?.levelBadge === "SAHIH"
        ? "AUTHENTIC"
        : data.hadith?.levelBadge?.toUpperCase() || "AUTHENTIC"
      : data.hadith?.levelBadge || "SHAHIH"

  const headerFormattedDate = formatBilingualDate(
    data.dateStr,
    data.formattedDate
  )
  const activeAyahTranslation =
    lang === "en"
      ? data.ayah.translationEn || data.ayah.translationId
      : data.ayah.translationId

  return (
    <section className="my-8 font-sans">
      {/* ──── TOP HUD (Sleek Dashboard Header) ──── */}
      <div className="mb-4 flex flex-wrap items-center justify-between border-b border-white/10 pb-3 text-[9px] tracking-widest text-white/70 uppercase">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]"></span>
            GLOBAL SIGNAL{" "}
            <span className="font-bold text-cyan-400">ONLINE</span>
          </div>
          <div className="flex items-center gap-2 text-blue-300">
            <Moon className="h-3 w-3" />
            {data.prayerPeriod?.name?.toUpperCase() || "NIGHT CYCLE"}{" "}
            <span className="font-medium text-cyan-400">{liveTime}</span>
          </div>
        </div>

        {data.globalStats && (
          <div className="flex items-center gap-4">
            {/* Minimalist Action Buttons */}
            <div className="flex items-center gap-1.5 border-r border-white/10 pr-4">
              <button
                onClick={copyDynamicShareUrl}
                title={
                  copiedUrl
                    ? t("COPIED", "TERSALIN")
                    : t("COPY LINK", "SALIN TAUTAN")
                }
                className="flex h-6 w-6 items-center justify-center rounded bg-white/5 text-[10px] text-cyan-400 transition-colors hover:bg-cyan-500/20 hover:text-cyan-300"
              >
                <LinkIcon className="h-3 w-3" />
              </button>
              <button
                onClick={copyVerseForWhatsApp}
                title={
                  copied
                    ? t("COPIED", "TERSALIN")
                    : t("SHARE TRANSMISSION", "BAGIKAN HIKMAH")
                }
                className="flex h-6 w-6 items-center justify-center rounded bg-white/5 text-[10px] text-emerald-400 transition-colors hover:bg-emerald-500/20 hover:text-emerald-300"
              >
                <MessageSquare className="h-3 w-3" />
              </button>
              <button
                onClick={copyImagePrompt}
                title={
                  copiedPrompt
                    ? t("PROMPT COPIED!", "PROMPT TERSALIN!")
                    : t("SHARE PROMPT", "SHARE PROMPT")
                }
                className="flex h-6 w-6 items-center justify-center rounded bg-white/5 text-[10px] text-fuchsia-400 transition-colors hover:bg-fuchsia-500/20 hover:text-fuchsia-300"
              >
                <Palette className="h-3 w-3" />
              </button>
              <button
                onClick={exportDashboardPNG}
                disabled={isExporting}
                title={
                  isExporting
                    ? t("EXPORTING...", "MENGEKSPOR...")
                    : t("EXPORT FULL DASHBOARD", "EKSPOR INFOGRAFIS")
                }
                className="flex h-6 w-6 items-center justify-center rounded bg-white/5 text-[10px] text-indigo-400 transition-colors hover:bg-indigo-500/20 hover:text-indigo-300 disabled:opacity-50"
              >
                {isExporting ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <Share2 className="h-3 w-3" />
                )}
              </button>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex flex-col text-right">
                <span className="text-[8px] text-amber-400/80 uppercase">
                  ROTATION{" "}
                  {data.globalStats.seenAyahsCount.toLocaleString("en-US")} /{" "}
                  {data.globalStats.totalAyahs.toLocaleString("en-US")}
                </span>
                <span>GLOBAL PROGRESS</span>
              </div>
              <span className="text-lg font-bold text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]">
                {rotationPercentFormatted}%
              </span>
              {/* Mini Waveform visualization */}
              <div className="flex h-4 items-end gap-[2px]">
                {[40, 70, 45, 90, 65, 80, 50, 100, 60, 30].map((h, i) => (
                  <div
                    key={i}
                    className="w-[2px] rounded-t bg-cyan-500/50"
                    style={{ height: `${h}%` }}
                  ></div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ═══ TACTICAL MISSION SCREEN CONTAINER (The Premium Glow Card) ═══ */}
      <div
        id="whatsapp-share-card"
        className={`relative w-full overflow-hidden rounded-[2rem] border border-white/5 p-6 font-sans text-white shadow-[0_20px_60px_rgba(0,10,30,0.8)] backdrop-blur-2xl sm:p-10 ${
          isZapping
            ? "translate-x-[2px] -translate-y-[2px] bg-cyan-500/30 brightness-150 contrast-125 saturate-150 transition-none"
            : "bg-[#0a0f1d]/60 transition-all duration-700"
        }`}
      >
        {/* Cosmic Background Image with Mask Transparency (Matching Home Page) */}
        <div
          className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
          style={{
            maskImage:
              "linear-gradient(to right, transparent 0%, black 60%, black 100%)",
            WebkitMaskImage:
              "linear-gradient(to right, transparent 0%, black 60%, black 100%)",
          }}
        >
          <div
            className="absolute inset-0 bg-cover bg-[center_right] bg-no-repeat opacity-100"
            style={{ backgroundImage: "url('/blueprint/BG-HERO-01.png')" }}
          />
        </div>

        {/* Subtle radial overlay to ensure text readability on the left */}
        <div className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-r from-[#030614] via-[#030614]/80 to-transparent" />

        {/* Hologram Bar Effect */}
        <div className="absolute top-0 left-0 h-[1px] w-full bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent opacity-50" />

        {/* ──── HEADER BRANDING ──── */}
        <div className="relative z-10 mb-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div
              onClick={triggerZapEffect}
              className={`flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border bg-gradient-to-br shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-transform hover:scale-105 active:scale-95 ${
                isZapping
                  ? "scale-110 border-cyan-400 bg-cyan-400/50 shadow-[0_0_40px_rgba(34,211,238,1)]"
                  : "border-blue-500/30 from-blue-500/20 to-purple-500/10"
              }`}
              title="Play Futuristic Scan Sound"
            >
              <Moon className="h-6 w-6 text-blue-300 drop-shadow-[0_0_8px_rgba(96,165,250,0.8)]" />
            </div>
            <div>
              <h3 className="text-sm font-medium tracking-[0.3em] text-blue-50 uppercase drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">
                MOONWITNESS MISSION TERMINAL
              </h3>
              <p className="mt-1 text-[10px] font-medium tracking-[0.2em] text-blue-300/70 uppercase">
                DIVINE SCRIPTURES &amp; SACRED LORE REPOSITORY
              </p>
            </div>
          </div>
        </div>

        {/* ──── MAIN GRID ──── */}
        <div className="relative z-10 flex flex-col gap-6">
          {/* ROW 1: Current Cycle (Left) + Ayah Panel (Right) */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            {/* Left: Current Cycle Timer */}
            <div className="relative flex flex-col items-center justify-center overflow-hidden rounded-3xl border border-white/5 bg-[#0a0f1d]/40 p-8 backdrop-blur-xl lg:col-span-3">
              <div className="pointer-events-none absolute top-0 left-0 h-full w-full bg-gradient-to-b from-blue-900/10 to-transparent" />

              {/* Mosque Background Silhouette (Subtle) */}
              <div className="pointer-events-none absolute right-0 bottom-0 h-32 w-full bg-[url('https://www.svgrepo.com/show/305267/mosque.svg')] bg-contain bg-right-bottom bg-no-repeat opacity-10 mix-blend-screen" />

              <span className="text-[9px] font-bold tracking-widest text-amber-500 uppercase">
                CURRENT <span className="text-blue-300">CYCLE</span>
              </span>
              <h2 className="mt-2 text-center text-2xl font-light tracking-widest text-white uppercase drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] md:text-4xl">
                {data.prayerPeriod?.name || "ISYA'"}
              </h2>
              <p className="mt-2 text-[10px] tracking-widest text-gray-400">
                19:25 - 20:40 WIB
              </p>
              <p className="text-[10px] tracking-widest text-gray-500">
                Jakarta, Indonesia
              </p>

              {/* Functional SVG Circular Timer */}
              <div className="relative mt-8 flex h-40 w-40 items-center justify-center rounded-full shadow-[0_0_30px_rgba(79,70,229,0.2)]">
                <svg
                  className="absolute inset-0 h-full w-full -rotate-90 transform drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]"
                  viewBox="0 0 100 100"
                >
                  {/* Background track */}
                  <circle
                    cx="50"
                    cy="50"
                    r="46"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-white/10"
                  />
                  {/* Progress track */}
                  <circle
                    cx="50"
                    cy="50"
                    r="46"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    className="text-cyan-400 transition-all duration-1000 ease-linear"
                    strokeDasharray="289"
                    strokeDashoffset={
                      289 - (289 * (nextPrayer?.percentage || 0)) / 100
                    }
                  />
                </svg>
                {/* Spinning inner dashed ring for tech vibe */}
                <div className="absolute inset-2 animate-[spin_15s_linear_infinite] rounded-full border border-dashed border-blue-500/30" />
                <div className="absolute inset-4 animate-[spin_10s_linear_infinite_reverse] rounded-full border border-indigo-500/20" />

                <div className="z-10 text-center">
                  <div className="text-xl font-bold tracking-widest text-white">
                    {nextPrayer?.formattedCountdown || "00:00:00"}
                  </div>
                  <div className="mt-1 text-[8px] tracking-widest text-blue-400 uppercase">
                    REMAINING
                  </div>
                </div>
              </div>

              <div className="mt-6 text-[10px] tracking-widest text-blue-300/70 uppercase">
                NEXT: {nextPrayer?.name || "SUBUH"}
              </div>
            </div>

            {/* Right: Ayah Panel (No outer borders, floating freely) */}
            <div className="relative z-10 flex min-h-[400px] flex-col justify-center lg:col-span-9">
              {/* Giant SVG Watermark */}
              <div className="pointer-events-none absolute top-1/2 left-1/2 z-0 flex h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 items-center justify-center opacity-[0.03] mix-blend-screen">
                <img
                  src={`/assets/surah-emblems/surah-${data.ayah.surahNumber}.svg`}
                  alt=""
                  className="h-full w-full animate-[spin_180s_linear_infinite] object-contain"
                />
              </div>

              <div className="relative z-10 flex h-full w-full flex-col">
                {/* Header with Minimalist Action Icons & Surah Details */}
                <div className="mb-8 flex flex-wrap items-center justify-between border-b border-white/10 pb-4">
                  <div className="flex flex-col items-start gap-1 sm:flex-row sm:items-center sm:gap-3">
                    <span className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-1.5 text-[10px] font-medium tracking-widest text-cyan-400 uppercase">
                      Q.S {data.ayah.surahName.toUpperCase()}{" "}
                      {data.ayah.surahNumber}:{data.ayah.ayahNumber}
                    </span>
                    <span className="ml-2 text-[10px] tracking-[0.2em] text-cyan-300/60 uppercase italic sm:ml-0">
                      "
                      {SURAH_TRANSLATIONS_EN[data.ayah.surahNumber] ||
                        "The Surah"}
                      "
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {data.ayah.audioUrl && (
                      <div className="flex items-center gap-3">
                        <audio
                          id="daily-ayah-audio"
                          src={data.ayah.audioUrl}
                          onEnded={() => setIsPlayingAudio(false)}
                        />
                        <button
                          onClick={toggleAudio}
                          className="flex items-center gap-1.5 text-[10px] font-bold tracking-widest text-white transition-colors hover:text-cyan-400"
                          title="Play Audio Recitation"
                        >
                          {isPlayingAudio ? (
                            <Pause className="h-3.5 w-3.5" />
                          ) : (
                            <Play className="h-3.5 w-3.5" />
                          )}
                          <span>PLAY</span>
                        </button>
                        <AudioWaveformVisualizer isPlaying={isPlayingAudio} />
                        <span className="mx-1 text-white/20">|</span>
                      </div>
                    )}
                    {/* The Modals - they render as buttons internally, but we can override or keep them minimalist in CSS later. For now, they fit fine. */}
                    <div className="flex items-center gap-2 opacity-70 transition-opacity hover:opacity-100">
                      <AsbabunNuzulModal
                        surahName={data.ayah.surahName}
                        surahNumber={data.ayah.surahNumber}
                        ayahNumber={data.ayah.ayahNumber}
                      />
                      <WordByWordModal
                        surahName={data.ayah.surahName}
                        surahNumber={data.ayah.surahNumber}
                        ayahNumber={data.ayah.ayahNumber}
                      />
                      <HifzTrainerModal
                        surahName={data.ayah.surahName}
                        surahNumber={data.ayah.surahNumber}
                        ayahNumber={data.ayah.ayahNumber}
                        textArabic={data.ayah.textArabic}
                        translationId={activeAyahTranslation}
                      />
                    </div>
                  </div>
                </div>

                {/* Arabic & Number Marker */}
                <div className="mb-4 flex items-start justify-end gap-6">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/20 bg-[#030614]/50 font-serif text-lg text-white">
                    {data.ayah.ayahNumber.toLocaleString("ar-EG")}
                  </div>
                  <div className="arabic-text max-w-4xl text-right text-4xl leading-[2.5] font-bold text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.2)] sm:text-5xl lg:text-6xl">
                    {data.ayah.textArabic}
                  </div>
                </div>

                {/* Latin */}
                {data.ayah.textLatin && (
                  <p className="mb-12 text-right font-serif text-base font-medium text-cyan-400 italic drop-shadow-[0_0_8px_rgba(34,211,238,0.3)]">
                    "{data.ayah.textLatin}"
                  </p>
                )}

                {/* 3-Column Footer grid for Ayah details */}
                <div className="mt-auto grid grid-cols-1 gap-8 border-t border-white/10 pt-8 md:grid-cols-3">
                  <div className="border-r border-white/10 pr-6">
                    <h4 className="mb-3 text-[10px] tracking-[0.2em] text-cyan-500 uppercase">
                      Translation
                    </h4>
                    <p className="text-sm leading-relaxed font-light text-gray-200">
                      "{activeAyahTranslation}"
                    </p>
                  </div>
                  <div className="border-r border-white/10 pr-6">
                    <h4 className="mb-3 text-[10px] tracking-[0.2em] text-cyan-400 uppercase">
                      Tafsir &amp; Lore Notes
                    </h4>
                    <p className="text-sm leading-relaxed font-light text-slate-200 italic">
                      "{getCustomTafsirNote()}"
                    </p>
                  </div>
                  <div>
                    <h4 className="mb-3 text-[10px] tracking-[0.2em] text-cyan-400 uppercase">
                      Source
                    </h4>
                    <p className="text-sm leading-relaxed font-light text-slate-300">
                      Tafsir As-Sa'di | Tafsir Ibnu Katsir
                      <br />
                      Sahih International Translation
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ROW 2: 2 Cards (Next Verse Pair & Ayah Pair) */}
          <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2">
            {/* 1. Next Verse Pair */}
            <div
              className={`flex flex-col justify-between rounded-2xl border border-emerald-500/20 bg-[#0a0f1d]/40 p-6 backdrop-blur-xl transition-colors hover:border-emerald-500/40 ${!data.asmaulSurah ? "opacity-50" : ""}`}
            >
              <div className="mb-4 flex items-start justify-between">
                <h4 className="text-[10px] tracking-[0.2em] text-emerald-400 uppercase">
                  Next Verse Pair
                </h4>
                {data.asmaulSurah && (
                  <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-[9px] text-emerald-300">
                    #{data.asmaulSurah.number}
                  </span>
                )}
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <h3 className="text-xl font-medium text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">
                    {data.asmaulSurah?.nameLatin || "—"}
                  </h3>
                  <p className="mt-1 text-[11px] text-emerald-300">
                    {data.asmaulSurah ? asmaulSurahMeaning : "No pair"}
                  </p>
                </div>
                <div className="font-serif text-3xl font-bold text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.4)]">
                  {data.asmaulSurah?.nameArabic || ""}
                </div>
              </div>
              {/* Mini subtle wave at bottom */}
              <div className="relative mt-2 h-4 w-full overflow-hidden border-b border-emerald-500/10">
                <div className="absolute bottom-0 h-[1px] w-full bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent"></div>
              </div>
            </div>

            {/* 2. Ayah Pair */}
            <div
              className={`flex flex-col justify-between rounded-2xl border border-fuchsia-500/20 bg-[#0a0f1d]/40 p-6 backdrop-blur-xl transition-colors hover:border-fuchsia-500/40 ${!data.asmaulAyah ? "opacity-50" : ""}`}
            >
              <div className="mb-4 flex items-start justify-between">
                <h4 className="text-[10px] tracking-[0.2em] text-fuchsia-400 uppercase">
                  Ayah Pair
                </h4>
                {data.asmaulAyah && (
                  <span className="rounded-full border border-fuchsia-500/20 bg-fuchsia-500/10 px-3 py-1 text-[9px] text-fuchsia-300">
                    #{data.asmaulAyah.number}
                  </span>
                )}
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <h3 className="text-xl font-medium text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">
                    {data.asmaulAyah?.nameLatin || "—"}
                  </h3>
                  <p className="mt-1 text-[11px] text-fuchsia-300">
                    {data.asmaulAyah ? asmaulAyahMeaning : "No pair"}
                  </p>
                </div>
                <div className="font-serif text-3xl font-bold text-fuchsia-400 drop-shadow-[0_0_10px_rgba(217,70,239,0.4)]">
                  {data.asmaulAyah?.nameArabic || ""}
                </div>
              </div>
              <div className="relative mt-2 h-4 w-full overflow-hidden border-b border-fuchsia-500/10">
                <div className="absolute bottom-0 h-[1px] w-full bg-gradient-to-r from-transparent via-fuchsia-500/50 to-transparent"></div>
              </div>
            </div>
          </div>

          {/* ROW 3: Lore & Wisdom */}
          <div className="mt-2 grid grid-cols-1 gap-6 md:grid-cols-2">
            {data.hadith ? (
              <div className="rounded-2xl border border-amber-500/20 bg-gradient-to-br from-[#0a0f1d]/60 to-[#040816]/80 p-8 shadow-lg backdrop-blur-xl transition-colors hover:border-amber-500/40">
                <div className="mb-6 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-base text-amber-500">👑</span>
                    <h4 className="text-[11px] tracking-[0.2em] text-amber-400 uppercase">
                      Legendary Lore Channel
                    </h4>
                  </div>
                  <span className="rounded border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-[9px] tracking-widest text-amber-300">
                    {hadithGradeText.toUpperCase()}
                  </span>
                </div>
                <h3 className="mb-6 text-[12px] font-medium tracking-[0.1em] text-amber-300 uppercase drop-shadow-[0_0_8px_rgba(251,191,36,0.4)]">
                  {data.hadith.bookName} • RECORD_NO. {data.hadith.number}
                </h3>
                <div className="flex gap-6">
                  <div className="mt-1 text-4xl opacity-30">📖</div>
                  <p className="text-sm leading-relaxed font-light text-slate-200 italic">
                    "
                    {lang === "en"
                      ? data.hadith.textEn || data.hadith.textId
                      : data.hadith.textId}
                    "
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center rounded-2xl border border-white/5 bg-[#0a0f1d]/20 p-8 text-xs text-white/20 backdrop-blur-xl">
                NO LORE DETECTED
              </div>
            )}

            {data.wisdom ? (
              <div className="relative overflow-hidden rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-[#0a0f1d]/60 to-[#040816]/80 p-8 shadow-lg backdrop-blur-xl transition-colors hover:border-cyan-500/40">
                <div className="pointer-events-none absolute top-[10%] right-[-10%] h-40 w-40 rounded-full border border-cyan-500/10 bg-cyan-500/10 blur-2xl" />
                <div className="relative z-10 mb-8 flex items-center gap-3">
                  <span className="text-base text-cyan-500">🪐</span>
                  <h4 className="text-[11px] tracking-[0.2em] text-cyan-400 uppercase">
                    Sacred Scripture Reflection
                  </h4>
                </div>
                <div className="relative z-10 mb-6 rounded-xl border border-cyan-500/10 bg-black/40 p-6">
                  <p className="text-base leading-relaxed font-light text-white italic drop-shadow-md">
                    "
                    {lang === "en"
                      ? data.wisdom.quoteEn || data.wisdom.quote
                      : data.wisdom.quote}
                    "
                  </p>
                </div>
                <p className="relative z-10 text-[9px] tracking-[0.2em] text-cyan-300 uppercase">
                  SOURCE KEY:{" "}
                  {lang === "en"
                    ? data.wisdom.sourceEn || data.wisdom.source
                    : data.wisdom.source}
                </p>
              </div>
            ) : (
              <div className="flex items-center justify-center rounded-2xl border border-white/5 bg-[#0a0f1d]/20 p-8 text-xs text-white/20 backdrop-blur-xl">
                NO SCRIPTURE DETECTED
              </div>
            )}
          </div>
        </div>

        {/* ──── FOOTER WATERMARK ──── */}
        <div className="relative z-10 mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-8 text-[10px] font-medium tracking-[0.2em] text-white/40 uppercase">
          <div className="flex items-center gap-3">
            <span>+ MOONWITNESS PLATFORM</span>
            <span className="opacity-30">•</span>
            <span className="hidden font-light italic sm:inline">
              "WHEN THE MOON WITNESSES, WE SHARE MESSAGES."
            </span>
          </div>
          <span className="tracking-[0.3em]">MOONWITNESS.COM</span>
        </div>
      </div>
    </section>
  )
}
