/**
 * @moon/time — AEQ4 Temporal Engine
 *
 * ZERO EXTERNAL DEPENDENCIES. PURE MATHEMATICS ONLY.
 *
 * Desentralisasi sejati: setiap device menjalankan algoritma ini
 * secara independen. Hasilnya identik di seluruh dunia karena
 * berdasarkan hukum alam yang ALLAH tetapkan — bukan server,
 * bukan blockchain, bukan otoritas manusia.
 *
 * "Sesungguhnya bilangan bulan di sisi Allah ialah dua belas bulan..."
 * — QS At-Taubah: 36
 */

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 1: FUNDAMENTAL CONSTANTS (No external dependency)
// ─────────────────────────────────────────────────────────────────────────────

/** Jumlah milidetik per hari (UTC) */
const MS_PER_DAY = 86_400_000

/**
 * AEQ4 EPOCH — 1 Muharram 1449H
 *
 * Perkiraan UTC: 16 Juni 2027
 * CATATAN: Tanggal PASTI ditentukan oleh hilal (rukyat),
 * bukan oleh kalkulasi matematis ini. Kalkulasi ini hanya
 * untuk countdown perkiraan. ALLAH yang memutuskan melalui bulan.
 *
 * Jika hilal terlihat sehari lebih awal atau terlambat,
 * sistem hanya perlu diupdate epochUtcMs-nya — satu baris.
 */
export const AEQ4_EPOCH_UTC_MS = Date.UTC(2027, 5, 16, 0, 0, 0, 0) // 16 Juni 2027

/** Status mode AEQ4 */
export type AEQ4Mode = "PRE_ERA" | "ACTIVE"

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 2: HIJRI CALENDAR — Pure Math (No API, No Library)
// Algoritma: Kuwaiti Rules + Arithmetical Hijri Approximation
// Akurasi: ±1 hari (cukup untuk display, bukan rukyat)
// ─────────────────────────────────────────────────────────────────────────────

export interface HijriDate {
  year: number
  month: number
  day: number
  monthName: string
}

const HIJRI_MONTH_NAMES = [
  "Muharram", "Safar", "Rabi al-Awwal", "Rabi al-Thani",
  "Jumada al-Awwal", "Jumada al-Thani", "Rajab", "Sha'ban",
  "Ramadan", "Shawwal", "Dhu al-Qi'dah", "Dhu al-Hijjah",
]

/**
 * Konversi Julian Day Number ke Hijri.
 * Algoritma: Fliegel & Van Flandern (1968), diadaptasi untuk Hijri.
 * ZERO DEPENDENCY — hanya aritmatika integer murni.
 */
function jdnToHijri(jdn: number): HijriDate {
  const l = jdn - 1948440 + 10632
  const n = Math.floor((l - 1) / 10631)
  const l2 = l - 10631 * n + 354
  const j =
    Math.floor((10985 - l2) / 5316) * Math.floor((50 * l2) / 17719) +
    Math.floor(l2 / 5670) * Math.floor((43 * l2) / 15238)
  const l3 = l2 - Math.floor((30 - j) / 15) * Math.floor((17719 * j) / 50) -
    Math.floor(j / 16) * Math.floor((15238 * j) / 43) + 29
  const month = Math.floor((24 * l3) / 709)
  const day = l3 - Math.floor((709 * month) / 24)
  const year = 30 * n + j - 30

  return {
    year,
    month,
    day,
    monthName: HIJRI_MONTH_NAMES[month - 1] ?? "Unknown",
  }
}

/**
 * Konversi UTC timestamp ke Julian Day Number.
 * Formula standar astronomi — murni matematika.
 */
function utcToJdn(utcMs: number): number {
  const date = new Date(utcMs)
  const y = date.getUTCFullYear()
  const m = date.getUTCMonth() + 1
  const d = date.getUTCDate()

  const a = Math.floor((14 - m) / 12)
  const yr = y + 4800 - a
  const mo = m + 12 * a - 3

  return (
    d +
    Math.floor((153 * mo + 2) / 5) +
    365 * yr +
    Math.floor(yr / 4) -
    Math.floor(yr / 100) +
    Math.floor(yr / 400) -
    32045
  )
}

/** Konversi UTC timestamp ke HijriDate */
export function utcToHijri(utcMs: number): HijriDate {
  return jdnToHijri(utcToJdn(utcMs))
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 3: LUNAR EPHEMERIS — Jean Meeus Algorithm (Pure Math)
// Menghitung posisi bulan secara lokal tanpa API.
// Ini adalah "desentralisasi" sesungguhnya: hukum fisika ALLAH.
// ─────────────────────────────────────────────────────────────────────────────

export interface LunarPosition {
  /** Fase bulan 0.0–1.0 (0=new, 0.5=full, 1.0=new lagi) */
  phase: number
  /** Persen iluminasi 0–100 */
  illumination: number
  /** Nama fase */
  phaseName: string
  /** Apakah berpotensi hilal (fase baru + matahari terbenam) */
  isNewMoon: boolean
  /** Elongasi bulan dari matahari (derajat) */
  elongationDeg: number
}

/**
 * Hitung posisi bulan berdasarkan UTC timestamp.
 * Menggunakan algoritma Jean Meeus "Astronomical Algorithms" Ch.49.
 * PURE MATH — tidak ada fetch, tidak ada API, tidak ada library.
 */
export function getLunarPosition(utcMs: number): LunarPosition {
  // Julian Ephemeris Day
  const jd = utcMs / MS_PER_DAY + 2440587.5

  // Centuries from J2000.0
  const T = (jd - 2451545.0) / 36525.0

  // Moon's mean longitude (degrees)
  const L0 =
    218.3164477 +
    481267.88123421 * T -
    0.0015786 * T * T +
    (T * T * T) / 538841 -
    (T * T * T * T) / 65194000

  // Sun's mean anomaly (degrees)
  const M_sun =
    357.5291092 +
    35999.0502909 * T -
    0.0001536 * T * T +
    (T * T * T) / 24490000

  // Moon's mean anomaly (degrees)
  const M_moon =
    134.9633964 +
    477198.8675055 * T +
    0.0087414 * T * T +
    (T * T * T) / 69699 -
    (T * T * T * T) / 14712000

  // Moon's argument of latitude (degrees)
  const F =
    93.2720950 +
    483202.0175233 * T -
    0.0036539 * T * T -
    (T * T * T) / 3526000 +
    (T * T * T * T) / 863310000

  // Elongation of moon from sun (degrees)
  const D =
    297.8501921 +
    445267.1114034 * T -
    0.0018819 * T * T +
    (T * T * T) / 545868 -
    (T * T * T * T) / 113065000

  const toRad = (deg: number) => (deg * Math.PI) / 180

  // Sun's longitude (simplified)
  const sunLongitude =
    280.46646 + 36000.76983 * T + 0.0003032 * T * T

  // Moon's ecliptic longitude (simplified correction)
  const moonLongitude =
    L0 +
    6.289 * Math.sin(toRad(M_moon)) +
    1.274 * Math.sin(toRad(2 * D - M_moon)) +
    0.658 * Math.sin(toRad(2 * D)) +
    0.214 * Math.sin(toRad(2 * M_moon)) -
    0.186 * Math.sin(toRad(M_sun)) -
    0.114 * Math.sin(toRad(2 * F))

  // Elongation (angular distance between moon and sun)
  let elongation = ((moonLongitude - sunLongitude) % 360 + 360) % 360

  // Phase 0.0 = new moon, 0.5 = full moon
  const phase = elongation / 360

  // Illumination percentage
  const illumination = Math.round(((1 - Math.cos(toRad(elongation))) / 2) * 100)

  // Phase name
  let phaseName: string
  if (phase < 0.03 || phase > 0.97) phaseName = "New Moon"
  else if (phase < 0.22) phaseName = "Waxing Crescent"
  else if (phase < 0.28) phaseName = "First Quarter"
  else if (phase < 0.47) phaseName = "Waxing Gibbous"
  else if (phase < 0.53) phaseName = "Full Moon"
  else if (phase < 0.72) phaseName = "Waning Gibbous"
  else if (phase < 0.78) phaseName = "Last Quarter"
  else phaseName = "Waning Crescent"

  const isNewMoon = phase < 0.05 || phase > 0.95

  return {
    phase,
    illumination,
    phaseName,
    isNewMoon,
    elongationDeg: Math.round(elongation * 10) / 10,
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 4: AEQ4 TIMESTAMP ENGINE
// Format: ∞·AEQ4  Q1.Q2.Q3.Q4
// Q1=ERA(QUR'AN) Q2=CYCLE(TORAH) Q3=POSITION(ZABUR) Q4=MOMENT(GOSPEL)
// ─────────────────────────────────────────────────────────────────────────────

export interface AEQ4Timestamp {
  mode: AEQ4Mode

  // PRE_ERA fields (mode = PRE_ERA)
  countdown?: {
    days: number
    hours: number
    minutes: number
    seconds: number
    totalMs: number
  }

  // ACTIVE fields (mode = ACTIVE)
  era?: number      // Q1 — rooted in QUR'AN (scale)
  cycle?: number    // Q2 — rooted in TORAH (journey)
  position?: number // Q3 — rooted in ZABUR (position)
  moment?: string   // Q4 — rooted in GOSPEL (presence, HH:MM:SS)

  /** Formatted string: ∞·AEQ4 1.1.229.21:08:06 */
  formatted: string
  /** UTC bridge */
  utcBridge: string
  /** Hijri bridge */
  hijriBridge: string
}

/**
 * Hitung AEQ4 timestamp dari UTC timestamp.
 *
 * PRE_ERA: menampilkan countdown ke epoch 1 Muharram 1449H
 * ACTIVE: menampilkan Q1.Q2.Q3.Q4 dari epoch
 *
 * PURE MATH — tidak ada fetch, tidak ada API.
 * Setiap device menghasilkan nilai yang sama karena matematika.
 */
export function getAEQ4Timestamp(
  utcMs: number = Date.now(),
  epochMs: number = AEQ4_EPOCH_UTC_MS
): AEQ4Timestamp {
  const hijri = utcToHijri(utcMs)
  const utcDate = new Date(utcMs)

  const utcBridge = `UTC:${utcDate.toISOString().slice(0, 19)}Z`
  const hijriBridge = `HIJ:${hijri.year}-${String(hijri.month).padStart(2, "0")}-${String(hijri.day).padStart(2, "0")}`

  if (utcMs < epochMs) {
    // ── PRE_ERA MODE ──
    const diff = epochMs - utcMs
    const totalMs = diff

    const days = Math.floor(diff / MS_PER_DAY)
    const hours = Math.floor((diff % MS_PER_DAY) / 3_600_000)
    const minutes = Math.floor((diff % 3_600_000) / 60_000)
    const seconds = Math.floor((diff % 60_000) / 1_000)

    return {
      mode: "PRE_ERA",
      countdown: { days, hours, minutes, seconds, totalMs },
      formatted: "∞·AEQ4  AWAITING EPOCH",
      utcBridge,
      hijriBridge,
    }
  }

  // ── ACTIVE MODE ──
  const elapsed = utcMs - epochMs
  const totalDays = Math.floor(elapsed / MS_PER_DAY)

  // Q1: ERA — always 1 (era changes only by consensus, not automatically)
  const era = 1

  // Q2: CYCLE — lunar year, ~354 days per cycle
  // Each cycle resets at Muharram hilal (approximated as 354.36 days)
  const LUNAR_YEAR_DAYS = 354.36708
  const cycle = Math.floor(totalDays / LUNAR_YEAR_DAYS) + 1

  // Q3: POSITION — day within current cycle (1-indexed)
  const daysInCurrentCycle = totalDays % Math.floor(LUNAR_YEAR_DAYS)
  const position = daysInCurrentCycle + 1

  // Q4: MOMENT — current time HH:MM:SS
  const hh = String(utcDate.getUTCHours()).padStart(2, "0")
  const mm = String(utcDate.getUTCMinutes()).padStart(2, "0")
  const ss = String(utcDate.getUTCSeconds()).padStart(2, "0")
  const moment = `${hh}:${mm}:${ss}`

  const formatted = `∞·AEQ4  ${era}.${cycle}.${position}.${moment}`

  return {
    mode: "ACTIVE",
    era,
    cycle,
    position,
    moment,
    formatted,
    utcBridge,
    hijriBridge,
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 5: COUNTDOWN PROGRESS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Hitung persentase progress countdown (0–100%).
 * Referensi: dari 1 Muharram 1448H ke 1 Muharram 1449H.
 */
export function getCountdownProgress(nowMs: number = Date.now()): number {
  // Perkiraan awal periode countdown: 1 Muharram 1448H ≈ 19 Juli 2026
  const countdownStartMs = Date.UTC(2026, 6, 19, 0, 0, 0, 0)
  const total = AEQ4_EPOCH_UTC_MS - countdownStartMs
  const elapsed = Math.max(0, nowMs - countdownStartMs)
  return Math.min(100, Math.round((elapsed / total) * 100))
}

// ─────────────────────────────────────────────────────────────────────────────
// EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

export { HIJRI_MONTH_NAMES }
