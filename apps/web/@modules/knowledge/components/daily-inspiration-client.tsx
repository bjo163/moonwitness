"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useLanguage } from "@core/contexts"
import { useGlobalAudio } from "@core/contexts"
import { InspirationCommentsClient } from "./inspiration-comments-client"
import { ShareCardGeneratorModal } from "@core/widgets/modals/share-card-generator-modal"
import { AsbabunNuzulModal } from "./modals/asbabun-nuzul-modal"
import { WordByWordModal } from "./modals/word-by-word-modal"
import { AudioWaveformVisualizer } from "@core/ui"
import { HifzTrainerModal } from "./modals/hifz-trainer-modal"

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
  const [expandHadith, setExpandHadith] = useState(false)
  const [isPlayingAudio, setIsPlayingAudio] = useState(false)
  const [mounted, setMounted] = useState(false)

  const [liveTime, setLiveTime] = useState<string>("")
  const [nextPrayer, setNextPrayer] = useState<{
    name: string
    formattedCountdown: string
  } | null>(null)

  useEffect(() => {
    setTimeout(() => setMounted(true), 0)

    async function fetchDailyData() {
      try {
        const res = await fetch("/api/daily")
        if (res.ok) {
          const json = await res.json()
          setData(json)
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

      if (!data?.nextPeriod) return

      const periodStartMap: Record<
        string,
        { h: number; m: number; labelEn: string; labelId: string }
      > = {
        subuh: { h: 4, m: 35, labelEn: "DAWN / SUBUH", labelId: "SUBUH" },
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

      const targetInfo = periodStartMap[data.nextPeriod.code] || {
        h: 18,
        m: 0,
        labelEn: data.nextPeriod.name.toUpperCase(),
        labelId: data.nextPeriod.name.toUpperCase(),
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
        setNextPrayer({
          name: labelName,
          formattedCountdown: formatted,
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
    if (!data)
      return typeof window !== "undefined"
        ? window.location.origin
        : "http://localhost:3000"
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

  function copyVerseForWhatsApp() {
    if (!data) return
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

    if (data.asmaulSurah) {
      textToCopy += `✨ Surah Pair Runic (#${data.asmaulSurah.number}): ${data.asmaulSurah.nameLatin} (${data.asmaulSurah.nameArabic}) — "${asmaulSurahMeaning}"\n`
    }

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

    navigator.clipboard.writeText(textToCopy)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
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
      {/* ──── TOP HUD TRANSMISSION BAR ──── */}
      <div className="mb-3 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-col gap-3">
          <div className="mb-1 flex flex-wrap items-center gap-2 text-[9px] font-medium tracking-widest text-primary uppercase">
            <span className="flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-emerald-400">
              <span className="font-bold">⊕</span>
              <span>100% GLOBAL UNIFORM</span>
            </span>

            {data.globalStats && (
              <Link
                href="/observatory"
                title="Click to view full unlocked verse archives"
                className="flex items-center gap-1.5 rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-amber-400 transition-all hover:bg-amber-500/20"
              >
                <span className="font-black">⬡</span>
                <span>
                  {t("ROTATION", "ROTASI")}{" "}
                  {data.globalStats.seenAyahsCount.toLocaleString("en-US")} /{" "}
                  {data.globalStats.totalAyahs.toLocaleString("en-US")} (
                  {rotationPercentFormatted}%)
                </span>
                <span className="opacity-50">&rarr; {t("LOG", "RIWAYAT")}</span>
              </Link>
            )}

            <span className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1">
              {periodLabel} {liveTime && `• ${liveTime}`}
            </span>

            {nextPrayer && (
              <span className="flex items-center gap-1.5 rounded-full border border-fuchsia-500/20 bg-fuchsia-500/10 px-3 py-1 text-fuchsia-400">
                <span className="font-bold">◷</span>
                <span>
                  {nextPrayer.name} ({nextPrayer.formattedCountdown}{" "}
                  {t("REMAINING", "LAGI")})
                </span>
              </span>
            )}
          </div>

          <h2 className="text-xl font-light tracking-[0.2em] text-foreground uppercase drop-shadow-[0_0_10px_rgba(255,255,255,0.2)] sm:text-2xl">
            {t(
              "CELESTIAL CONTEMPLATION & PRIMORDIAL WISDOM",
              "KONTEMPLASI ANGKASA & KHAZANAH PRIMORDIAL"
            )}
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={copyDynamicShareUrl}
            className="flex items-center gap-2 rounded border border-primary/30 bg-cyan-500/5 px-5 py-2.5 text-[10px] font-medium tracking-widest text-primary uppercase backdrop-blur-md transition-all duration-300 hover:border-primary hover:bg-cyan-500/15"
          >
            <span className="font-bold">⌗</span>
            <span>
              {copiedUrl
                ? t("COPIED", "TERSALIN")
                : t("COPY LINK", "SALIN TAUTAN")}
            </span>
          </button>

          <button
            onClick={copyVerseForWhatsApp}
            className="flex items-center gap-2 rounded border border-emerald-500/30 bg-emerald-500/10 px-6 py-2.5 text-[10px] font-medium tracking-widest text-emerald-400 uppercase backdrop-blur-md transition-all duration-300 hover:border-emerald-400 hover:bg-emerald-500/20"
          >
            <span className="font-bold">◈</span>
            <span>
              {copied
                ? t("COPIED", "TERSALIN")
                : t("SHARE TRANSMISSION", "BAGIKAN HIKMAH")}
            </span>
          </button>
        </div>
      </div>

      {/* ──── XP PROGRESS BAR ──── */}
      {data.globalStats && (
        <div className="mt-4 mb-6 flex items-center gap-3 rounded border border-white/5 bg-black/40 px-4 py-2 text-[10px] backdrop-blur-md">
          <span className="font-light tracking-[0.2em] text-primary uppercase">
            GLOBAL ROTATION
          </span>
          <div className="relative h-1 flex-1 overflow-hidden rounded-full bg-white/5">
            <div
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-emerald-400 shadow-[0_0_10px_#00F0FF] transition-all duration-1000"
              style={{ width: `${Math.max(0.1, rotationPercentRaw)}%` }}
            />
          </div>
          <span className="font-mono font-bold tracking-wider text-primary">
            {rotationPercentFormatted}%
          </span>
        </div>
      )}

      {/* ═══ TACTICAL MISSION SCREEN CONTAINER ═══ */}
      <div
        id="whatsapp-share-card"
        className="bg-space/80 relative space-y-8 overflow-hidden rounded-2xl border border-cyan-500/10 p-6 shadow-[0_15px_50px_rgba(0,0,0,0.6)] backdrop-blur-2xl sm:p-10"
      >
        {/* Hologram Bar Effect */}
        <div className="absolute top-0 left-0 h-[1px] w-full bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent opacity-50" />

        {/* ──── HEADER BRANDING ──── */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/5 pb-6">
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-primary/20 bg-cyan-500/5 text-lg text-primary shadow-[0_0_15px_rgba(0,240,255,0.1)]">
              ◐
            </div>
            <div>
              <h3 className="font-sans text-sm font-light tracking-[0.3em] text-primary uppercase">
                MOONWITNESS MISSION TERMINAL
              </h3>
              <p className="mt-1 text-[10px] font-medium tracking-[0.2em] text-primary/70 uppercase">
                DIVINE SCRIPTURES &amp; SACRED LORE REPOSITORY
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-[10px] font-medium tracking-widest text-primary uppercase">
            <span>{periodLabel}</span>
            <span className="mx-2 opacity-30">•</span>
            <span>{headerFormattedDate}</span>
          </div>
        </div>

        {/* ──── 1. ANCIENT SCRIPTURE TRANSMISSION (AYAH) ──── */}
        <div className="space-y-6 rounded-xl border border-white/5 bg-black/40 p-6 backdrop-blur-xl sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/5 pb-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-[10px] font-medium tracking-widest text-emerald-400 uppercase">
                <span className="font-bold">⬡</span>
                <span>{surahLabelText}</span>
              </span>

              {/* Compact Integrated Audio Player & Phase 5/6 Modals */}
              <div className="flex flex-wrap items-center gap-2">
                {data.ayah.audioUrl && (
                  <div className="flex items-center gap-2">
                    <audio
                      id="daily-ayah-audio"
                      src={data.ayah.audioUrl}
                      onEnded={() => setIsPlayingAudio(false)}
                    />
                    <button
                      onClick={toggleAudio}
                      className="flex items-center gap-1.5 rounded-full border border-primary/30 bg-cyan-500/5 px-3 py-1.5 text-[10px] font-medium tracking-widest text-primary uppercase transition-all duration-300 hover:border-primary hover:bg-cyan-500/15"
                      title="Play Audio Recitation"
                    >
                      <span className="font-bold">
                        {isPlayingAudio ? "⏸" : "▶"}
                      </span>
                      <span>
                        {isPlayingAudio
                          ? t("PAUSE TELEMETRY", "JEDA TELEMETRI")
                          : t("PLAY MUROTTAL", "STREAM AUDIO")}
                      </span>
                    </button>
                    <AudioWaveformVisualizer isPlaying={isPlayingAudio} />
                  </div>
                )}

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

                <ShareCardGeneratorModal
                  surahName={data.ayah.surahName}
                  surahNumber={data.ayah.surahNumber}
                  ayahNumber={data.ayah.ayahNumber}
                  textArabic={data.ayah.textArabic}
                  textLatin={data.ayah.textLatin || ""}
                  translationId={activeAyahTranslation}
                />
              </div>
            </div>

            <div className="flex items-center gap-2 text-[9px] font-medium tracking-widest text-primary uppercase">
              <span className="animate-pulse text-primary">
                📡 AUDIO FEED: ONLINE
              </span>
              <span className="opacity-30">•</span>
              <span>MISYARI RASYID</span>
              <span className="opacity-30">•</span>
              <span>FREQ: 114.30 MHz</span>
            </div>
          </div>

          {/* Calligraphy Arabic */}
          <div
            className="arabic-text py-2 text-right text-2xl leading-[2.3] font-bold text-foreground sm:text-4xl"
            style={{ textShadow: "0 0 15px rgba(255,255,255,0.1)" }}
          >
            {data.ayah.textArabic}
          </div>

          {/* Transliteration */}
          {data.ayah.textLatin && (
            <p
              className="font-serif text-xs font-medium text-emerald-400 italic sm:text-sm"
              style={{ textShadow: "0 0 10px rgba(16,185,129,0.2)" }}
            >
              &ldquo;{data.ayah.textLatin}&rdquo;
            </p>
          )}

          {/* Translation */}
          <div className="mt-4 rounded-xl border border-white/5 bg-black/30 p-5">
            <div className="mb-2 text-[9px] font-medium tracking-[0.2em] text-primary uppercase">
              {t("TRANSLATION RECORD", "REKAMAN TERJEMAHAN")}
            </div>
            <p className="text-sm leading-relaxed font-light text-foreground">
              &ldquo;{activeAyahTranslation}&rdquo;
            </p>
          </div>

          {/* Catatan Tafsir & Hikmah */}
          <div className="mt-4 rounded-xl border border-amber-500/10 bg-amber-500/5 p-5">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-[10px] font-medium tracking-[0.2em] text-amber-500 uppercase">
                DIVINE TAFSIR &amp; LORE NOTES:
              </span>
              <span className="rounded-full border border-amber-500/20 bg-amber-500/10 px-2 py-0.5 text-[8px] text-amber-500">
                SYNC
              </span>
            </div>
            <p className="text-sm leading-relaxed font-light text-foreground italic">
              &ldquo;{getCustomTafsirNote()}&rdquo;
            </p>
          </div>
        </div>

        {/* ──── 2. DIVINE ATTRIBUTE RUNES (ASMAUL HUSNA) ──── */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {data.asmaulSurah && (
            <div className="flex items-center justify-between gap-4 rounded-xl border border-primary/20 bg-cyan-500/5 p-5 backdrop-blur-xl">
              <div className="flex items-center gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-primary/30 bg-cyan-500/10 text-xs font-medium text-primary shadow-[0_0_15px_rgba(0,240,255,0.1)]">
                  #{data.asmaulSurah.number}
                </span>
                <div>
                  <span className="mb-1 block text-[9px] font-medium tracking-widest text-primary/70 uppercase">
                    SURAH PAIR RUNIC #{data.ayah.surahNumber}
                  </span>
                  <h4 className="text-sm font-medium text-foreground">
                    {data.asmaulSurah.nameLatin}
                  </h4>
                  <p className="mt-0.5 text-[10px] text-primary">
                    &ldquo;{asmaulSurahMeaning}&rdquo;
                  </p>
                </div>
              </div>
              <div className="shrink-0 text-right font-serif text-2xl font-bold text-primary opacity-90 drop-shadow-[0_0_10px_rgba(0,240,255,0.3)]">
                {data.asmaulSurah.nameArabic}
              </div>
            </div>
          )}

          {data.asmaulAyah && (
            <div className="flex items-center justify-between gap-4 rounded-xl border border-fuchsia-500/20 bg-fuchsia-500/5 p-5 backdrop-blur-xl">
              <div className="flex items-center gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-fuchsia-500/30 bg-fuchsia-500/10 text-xs font-medium text-fuchsia-400 shadow-[0_0_15px_rgba(217,70,239,0.1)]">
                  #{data.asmaulAyah.number}
                </span>
                <div>
                  <span className="mb-1 block text-[9px] font-medium tracking-widest text-fuchsia-500/70 uppercase">
                    AYAH PAIR RUNIC #{data.ayah.ayahNumber}
                  </span>
                  <h4 className="text-sm font-medium text-foreground">
                    {data.asmaulAyah.nameLatin}
                  </h4>
                  <p className="mt-0.5 text-[10px] text-primary">
                    &ldquo;{asmaulAyahMeaning}&rdquo;
                  </p>
                </div>
              </div>
              <div className="shrink-0 text-right font-serif text-2xl font-bold text-fuchsia-400 opacity-90 drop-shadow-[0_0_10px_rgba(217,70,239,0.3)]">
                {data.asmaulAyah.nameArabic}
              </div>
            </div>
          )}
        </div>

        {/* ──── 3. HADITS & WISDOM ARCHIVES (RPG ITEM RARITY CARDS) ──── */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {data.hadith && (
            <div className="flex flex-col justify-between space-y-4 rounded-2xl border border-amber-500/20 bg-amber-500/5 p-6 shadow-[0_0_30px_rgba(245,158,11,0.05)] backdrop-blur-xl">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-[9px] font-medium tracking-[0.2em] text-amber-500 uppercase">
                    {t("LEGENDARY LORE CHANNEL", "KODE TRANSMISI LEGENDARIS")}
                  </span>
                  <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[9px] font-bold tracking-widest text-emerald-400">
                    {hadithGradeText.toUpperCase()}
                  </span>
                </div>

                <h4 className="text-sm font-light tracking-[0.1em] text-amber-500 uppercase">
                  {data.hadith.bookName}{" "}
                  <span className="mx-2 opacity-50">•</span> RECORD_NO.{" "}
                  {data.hadith.number}
                </h4>

                <div className="relative">
                  <p className="rounded-xl border border-white/5 bg-black/40 p-4 text-sm leading-relaxed font-light text-foreground italic">
                    &ldquo;
                    {lang === "en"
                      ? data.hadith.textEn || data.hadith.textId
                      : data.hadith.textId}
                    &rdquo;
                  </p>
                </div>
              </div>
            </div>
          )}

          {data.wisdom && (
            <div className="flex flex-col justify-between space-y-4 rounded-2xl border border-primary/20 bg-cyan-500/5 p-6 shadow-[0_0_30px_rgba(6,182,212,0.05)] backdrop-blur-xl">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="rounded-full border border-primary/20 bg-cyan-500/10 px-3 py-1 text-[9px] font-medium tracking-[0.2em] text-primary uppercase">
                    {t("EPIC TRANSMISSION MATRIX", "MATRIKS REFLEKSI EPIK")}
                  </span>
                  <span className="text-[9px] font-medium tracking-widest text-primary/60 uppercase">
                    CORE_LORE_SEAL
                  </span>
                </div>

                <h4 className="text-sm font-light tracking-[0.1em] text-primary uppercase">
                  {t(
                    "Sacred Scripture Reflection",
                    data.wisdom.title || "Perenungan Khazanah Kitab Suci"
                  )}
                </h4>

                <p className="rounded-xl border border-white/5 bg-black/40 p-4 text-sm leading-relaxed font-light text-foreground italic">
                  &ldquo;
                  {lang === "en"
                    ? data.wisdom.quoteEn || data.wisdom.quote
                    : data.wisdom.quote}
                  &rdquo;
                </p>
              </div>

              <p className="flex items-center justify-between border-t border-cyan-500/10 pt-4 text-[10px] font-medium tracking-[0.2em] text-primary/80 uppercase">
                <span>— SOURCE DECODED</span>
                <span>
                  {lang === "en"
                    ? data.wisdom.sourceEn || data.wisdom.source
                    : data.wisdom.source}
                </span>
              </p>
            </div>
          )}
        </div>

        {/* ──── COMMENTS TERMINAL ──── */}
        <InspirationCommentsClient
          periodCode={data.prayerPeriod?.code || "zuhur"}
          dateStr={data.dateStr || "2026-07-26"}
          itemId={data.ayah.id}
          itemTitle={`Surah ${data.ayah.surahName} (${data.ayah.surahNumber}:${data.ayah.ayahNumber})`}
        />

        {/* ──── FOOTER WATERMARK ──── */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/5 pt-6 text-[10px] font-medium tracking-widest text-primary uppercase">
          <div className="flex items-center gap-3">
            <span>◈ MOONWITNESS PLATFORM</span>
            <span className="opacity-30">•</span>
            <span className="font-light italic opacity-70">
              &ldquo;WHEN THE MOON WITNESS, WE SHARE MESSAGES.&rdquo;
            </span>
          </div>

          <span className="text-primary">MOONWITNESS.COM</span>
        </div>
      </div>
    </section>
  )
}
