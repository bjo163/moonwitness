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

  let phaseName = "New Moon"
  let phaseIcon = "🌑"
  let statusText = "Hilal observation pending"

  if (ageInDays < 1.5) {
    phaseName = lang === "id" ? "Bulan Baru (Hilal Awal)" : "New Moon (Hilal)"
    phaseIcon = "🌑"
    statusText =
      lang === "id"
        ? "Fase konjungsi — Hilal baru terbentuk"
        : "Conjunction phase — New Crescent forming"
  } else if (ageInDays < 7.4) {
    phaseName = lang === "id" ? "Bulan Sabit Awal" : "Waxing Crescent"
    phaseIcon = "🌒"
    statusText =
      lang === "id"
        ? "Cahaya bulan bertambah setiap malam"
        : "Moonlight increasing each night"
  } else if (ageInDays < 9.0) {
    phaseName = lang === "id" ? "Kuartal Pertama" : "First Quarter"
    phaseIcon = "🌓"
    statusText =
      lang === "id"
        ? "Separuh piringan bulan tampak bercahaya"
        : "Half of the lunar disk illuminated"
  } else if (ageInDays < 14.0) {
    phaseName = lang === "id" ? "Bulan Cembung Awal" : "Waxing Gibbous"
    phaseIcon = "🌔"
    statusText =
      lang === "id"
        ? "Menuju fase purnama penuh (Ayyamul Bidh)"
        : "Approaching Full Moon (Ayyamul Bidh)"
  } else if (ageInDays < 16.0) {
    phaseName = lang === "id" ? "Bulan Purnama (Badr)" : "Full Moon (Badr)"
    phaseIcon = "🌕"
    statusText =
      lang === "id"
        ? "Iluminasi maksimal — Waktu utama puasa Ayyamul Bidh"
        : "Max illumination — Prime Ayyamul Bidh fasting window"
  } else if (ageInDays < 22.1) {
    phaseName = lang === "id" ? "Bulan Cembung Akhir" : "Waning Gibbous"
    phaseIcon = "🌖"
    statusText =
      lang === "id"
        ? "Cahaya bulan mulai berkurang perlahan"
        : "Illumination decreasing gradually"
  } else if (ageInDays < 23.6) {
    phaseName = lang === "id" ? "Kuartal Akhir" : "Last Quarter"
    phaseIcon = "🌗"
    statusText =
      lang === "id"
        ? "Separuh bulan tampak di paruh akhir malam"
        : "Half illuminated in late night"
  } else {
    phaseName = lang === "id" ? "Bulan Sabit Akhir" : "Waning Crescent"
    phaseIcon = "🌘"
    statusText =
      lang === "id"
        ? "Akhir bulan Hijriyah — Mempersiapkan rukyat hilal baru"
        : "End of lunar month — Preparing for new moon sighting"
  }

  const hijriDayEstimate = Math.min(30, Math.max(1, Math.floor(ageInDays) + 1))

  return {
    phaseName,
    phaseIcon,
    illuminationPercent,
    hijriDayEstimate,
    lunarStatusText: statusText,
  }
}
