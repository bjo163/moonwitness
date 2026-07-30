/* eslint-disable @typescript-eslint/no-magic-numbers -- Astronomical orbital geometry and lunar epoc calculations require precise numeric constants */
/**
 * Lunar Phase & Moon Status Astronomical Calculation Engine
 * Calculates real-time moon phase, illumination percentage, and Hijri lunar status.
 */

export type LunarPhaseInfo = {
  phaseName: string
  phaseIcon: string
  illuminationPercent: number
  hijriDayEstimate: number
  lunarStatusText: string
}

export function calculateLunarPhase(
  date: Date = new Date(),
  lang: "en" | "id" = "en"
): LunarPhaseInfo {
  // Known reference new moon: Jan 11, 2024 at 11:57 UTC
  const refNewMoon = new Date(Date.UTC(2024, 0, 11, 11, 57, 0)).getTime()
  const synodicMonth = 29.53058770576 * 86400 * 1000 // 29.53 days in ms

  const now = date.getTime()
  const diff = now - refNewMoon
  const cycles = (diff % synodicMonth) / synodicMonth
  const ageInDays = cycles * 29.53058770576

  // Illumination calculation (0% at New Moon, 100% at Full Moon)
  const illuminationPercent = Math.round(
    (1 - Math.cos(cycles * 2 * Math.PI)) * 50
  )
  const hijriDayEstimate = Math.min(30, Math.max(1, Math.floor(ageInDays) + 1))

  let phaseName = lang === "en" ? "Full Moon" : "Full Moon (Purnama)"
  let phaseIcon = "◐"
  let lunarStatusText =
    lang === "en"
      ? "Full Moon — Celestial Witness"
      : "Bulan Purnama — Rembulan Bersaksi Sempurna"

  if (ageInDays < 1.84566) {
    phaseName = lang === "en" ? "New Moon" : "New Moon (Hilal Awal)"
    phaseIcon = "◐"
    lunarStatusText =
      lang === "en"
        ? "New Moon — Celestial Rise"
        : "Hilal Awal — Terbitnya Bulan Baru"
  } else if (ageInDays < 5.53699) {
    phaseName =
      lang === "en" ? "Waxing Crescent" : "Waxing Crescent (Sabit Muda)"
    phaseIcon = "◐"
    lunarStatusText =
      lang === "en"
        ? "Waxing Crescent — Initial Orbit Witness"
        : "Bulan Sabit Muda — Rembulan Mulai Bersaksi"
  } else if (ageInDays < 9.22831) {
    phaseName = lang === "en" ? "First Quarter" : "First Quarter (Separuh Awal)"
    phaseIcon = "◐"
    lunarStatusText =
      lang === "en"
        ? "First Quarter — Lunar Illumination"
        : "Bulan Separuh Awal — Cahaya Rembulan"
  } else if (ageInDays < 12.91963) {
    phaseName =
      lang === "en" ? "Waxing Gibbous" : "Waxing Gibbous (Cembung Awal)"
    phaseIcon = "◐"
    lunarStatusText =
      lang === "en"
        ? "Waxing Gibbous — Approaching Full Witness"
        : "Bulan Cembung — Rembulan Mendekati Saksi Sempurna"
  } else if (ageInDays < 16.61096) {
    phaseName = lang === "en" ? "Full Moon" : "Full Moon (Purnama)"
    phaseIcon = "◐"
    lunarStatusText =
      lang === "en"
        ? "Full Moon — Sovereign Illumination"
        : "Bulan Purnama — Ketenangan Malam & Keagungan Pencipta"
  } else if (ageInDays < 20.30228) {
    phaseName =
      lang === "en" ? "Waning Gibbous" : "Waning Gibbous (Cembung Akhir)"
    phaseIcon = "◐"
    lunarStatusText =
      lang === "en"
        ? "Waning Gibbous — Radiant Orbit"
        : "Bulan Cembung Akhir — Cahaya Terang Menghiasi Langit"
  } else if (ageInDays < 23.99361) {
    phaseName =
      lang === "en" ? "Third Quarter" : "Third Quarter (Separuh Akhir)"
    phaseIcon = "◐"
    lunarStatusText =
      lang === "en"
        ? "Third Quarter — Night Reflection"
        : "Bulan Separuh Akhir — Keheningan Zikir Malam"
  } else if (ageInDays < 27.68493) {
    phaseName =
      lang === "en" ? "Waning Crescent" : "Waning Crescent (Sabit Tua)"
    phaseIcon = "◐"
    lunarStatusText =
      lang === "en"
        ? "Waning Crescent — Cycle Conclusion"
        : "Bulan Sabit Tua — Perenungan Penutup Bulan"
  } else {
    phaseName = lang === "en" ? "New Moon" : "New Moon (Hilal Penutup)"
    phaseIcon = "◐"
    lunarStatusText =
      lang === "en"
        ? "New Moon — Transition Phase"
        : "Hilal Penutup — Persiapan Rotasi Bulan Baru"
  }

  return {
    phaseName,
    phaseIcon,
    illuminationPercent,
    hijriDayEstimate,
    lunarStatusText,
  }
}
