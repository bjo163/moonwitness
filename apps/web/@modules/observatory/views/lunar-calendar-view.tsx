"use client"

import { useState, useEffect } from "react"
import {
  Moon,
  Sun,
  Clock,
  Compass,
  BookOpen,
  Quote,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  Target,
  FileText,
  AlertTriangle,
} from "lucide-react"
import Image from "next/image"

type LunarDayItem = {
  hijriDay: number
  hijriMonthName: string
  hijriYear: string
  gregorianDate: string
  gregorianDay: number
  gregorianMonthName: string
  gregorianYear: string
  phaseName: string
  illumination: number
  isAyyamulBidh: boolean
  moonrise: string
  moonset: string
  icon: string
  holidays?: string[]
}

export function LunarCalendarView() {
  const [days, setDays] = useState<LunarDayItem[]>([])
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(0)
  const [isLoading, setIsLoading] = useState(true)
  const [dailyData, setDailyData] = useState<any>(null)

  useEffect(() => {
    const fetchCalendar = async () => {
      try {
        const res = await fetch("/api/calendar")
        const json = await res.json()
        if (json.days && json.days.length > 0) {
          // Buat data mock untuk melengkapi grid 35 kotak (5 minggu)
          const mockDays = []
          for (let i = 0; i < 35; i++) {
            const apiDay = json.days[i % json.days.length]
            const hijriDay = i < 30 ? i + 1 : i - 29

            let phaseName = "Waxing Crescent"
            let icon = "🌒"
            let illumination = Math.min(100, Math.round((hijriDay / 15) * 100))
            if (hijriDay === 1) {
              phaseName = "New Moon (Hilal)"
              icon = "🌑"
              illumination = 2
            } else if (hijriDay <= 7) {
              phaseName = "Waxing Crescent"
              icon = "🌒"
            } else if (hijriDay === 8) {
              phaseName = "First Quarter"
              icon = "🌓"
              illumination = 50
            } else if (hijriDay <= 12) {
              phaseName = "Waxing Gibbous"
              icon = "🌔"
            } else if (hijriDay >= 13 && hijriDay <= 15) {
              phaseName = "Full Moon (Purnama)"
              icon = "🌕"
              illumination = 100
            } else if (hijriDay <= 22) {
              phaseName = "Waning Gibbous"
              icon = "🌖"
              illumination = Math.round(((30 - hijriDay) / 15) * 100)
            } else if (hijriDay === 23) {
              phaseName = "Last Quarter"
              icon = "🌗"
              illumination = 50
            } else {
              phaseName = "Waning Crescent"
              icon = "🌘"
              illumination = 15
            }

            mockDays.push({
              ...apiDay,
              hijriDay,
              hijriMonthName: i < 30 ? "Safar" : "Rabi' I",
              gregorianDay: 1 + i > 31 ? 1 + i - 31 : 1 + i,
              gregorianMonthName: 1 + i > 31 ? "Aug" : "Jul",
              isAyyamulBidh: hijriDay >= 13 && hijriDay <= 15,
              phaseName,
              icon,
              illumination,
            })
          }
          setDays(mockDays)
          setSelectedDayIndex(14) // Hari ke-15 Safar
        }
      } catch (e) {
        console.error("Failed to fetch calendar", e)
      }
    }

    const fetchDaily = async () => {
      try {
        const res = await fetch("/api/daily")
        const json = await res.json()
        setDailyData(json)
      } catch (e) {
        console.error("Failed to fetch daily data", e)
      }
    }

    Promise.all([fetchCalendar(), fetchDaily()]).finally(() => {
      setIsLoading(false)
    })
  }, [])

  if (isLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4 font-mono font-bold tracking-widest text-primary">
          <Moon className="h-8 w-8 animate-pulse text-cyan-500" />
          SYNCHRONIZING WITH ALADHAN CELESTIAL API...
        </div>
      </div>
    )
  }

  if (days.length === 0) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4 font-mono font-bold tracking-widest text-rose-500">
          <AlertTriangle className="h-8 w-8 animate-pulse text-rose-500" />
          GAGAL MENGAKSES DATA TELEMETRI ALADHAN
          <span className="mt-2 block text-[10px] text-white/50">
            Mohon periksa koneksi atau coba beberapa saat lagi.
          </span>
        </div>
      </div>
    )
  }

  const selectedDay = days[selectedDayIndex] || days[0]!

  return (
    <div className="min-h-screen bg-[#020813] px-4 py-6 font-sans text-[#8F9FB3] selection:bg-cyan-500/30">
      <div className="mx-auto max-w-[1400px] space-y-4">
        {/* ═══ HEADER BAR ═══ */}
        <div className="flex items-stretch justify-between overflow-hidden rounded-xl border border-white/10 bg-[#040C1A] shadow-[0_0_20px_rgba(0,0,0,0.5)]">
          <div className="flex w-2/3 items-center gap-4 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded border border-cyan-500/30 bg-[#0B1A2C]">
              <CalendarIcon />
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-widest text-white uppercase">
                KALENDER HIJRIYAH & LUNAR PHASE TRACKER
              </h1>
              <p className="mt-1 text-[10px]">
                Pemantauan fase bulan (Lunar Phases) secara presisi, jadwal
                Ayyamul Bidh, dan sinkronisasi penanggalan Hijriyah untuk ibadah
                puasa sunnah.
              </p>
            </div>

            <div className="ml-auto flex flex-col justify-center border-l border-white/10 pl-4 text-[9px] tracking-widest uppercase">
              <div className="mb-1 text-[#8F9FB3]">SYSTEM STATUS</div>
              <div className="flex items-center gap-1.5 font-bold text-emerald-400">
                <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />{" "}
                ONLINE
              </div>
            </div>

            <div className="ml-4 flex flex-col justify-center border-l border-white/10 pl-4 text-[9px] tracking-widest uppercase">
              <div className="mb-1 text-[#8F9FB3]">OPERATION MODE</div>
              <div className="font-bold text-white">LUNAR-ORBIT-TRACKER</div>
              <button className="mt-1 w-max rounded border border-white/10 px-2 py-0.5 text-[7px] transition-colors hover:bg-white/5">
                DETAIL SYSTEM
              </button>
            </div>
          </div>

          <div className="relative w-1/3 overflow-hidden border-l border-white/10">
            <div className="absolute inset-0">
              <img
                src="/assets/hero_bg.png"
                alt="Space"
                className="h-full w-full scale-110 object-cover opacity-60 mix-blend-screen"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-[#040C1A] via-[#040C1A]/80 to-transparent" />
          </div>
        </div>

        {/* ═══ HERO TELEMETRY (SELECTED DAY) ═══ */}
        <div className="relative flex items-center gap-6 overflow-hidden rounded-xl border border-white/10 bg-[#040C1A] p-6">
          <div className="pointer-events-none absolute top-0 right-0 h-full w-[500px] bg-cyan-900/10 blur-[100px]" />

          <div className="relative h-32 w-32 shrink-0 drop-shadow-[0_0_30px_rgba(255,255,255,0.15)]">
            <img
              src="/assets/moon_photorealistic.png"
              alt="Moon"
              className="h-full w-full object-contain mix-blend-screen"
            />
          </div>

          <div className="flex-1">
            <h2 className="text-xl font-bold tracking-widest text-cyan-400 uppercase">
              HARI KE-{selectedDay.hijriDay}{" "}
              {selectedDay.hijriMonthName.toUpperCase()} {selectedDay.hijriYear}{" "}
              H
            </h2>
            <div className="mt-1 font-mono text-xs tracking-widest text-white uppercase">
              {selectedDay.phaseName}
            </div>
            <div className="mt-2 text-[10px] text-[#8F9FB3]">
              {selectedDay.gregorianDay}{" "}
              {selectedDay.gregorianMonthName.toUpperCase()}{" "}
              {selectedDay.gregorianYear} • RABU
              <br />
              Lokasi: Jakarta, Indonesia (UTC+7)
            </div>
            <button className="mt-3 rounded border border-white/20 px-3 py-1.5 text-[8px] font-bold tracking-widest text-white uppercase transition-colors hover:bg-white/5">
              LIHAT DETAIL BULAN
            </button>
          </div>

          {/* 4 Stats */}
          <div className="flex gap-4">
            {/* Illumination */}
            <div className="relative w-32 overflow-hidden rounded-lg border border-white/10 bg-[#020610] p-3">
              <div className="mb-2 flex items-center gap-2 text-[8px] tracking-widest text-amber-500 uppercase">
                <Sun className="h-3 w-3" /> ILUMINASI
              </div>
              <div className="font-mono text-3xl font-black text-white">
                {selectedDay.illumination}%
              </div>
              <div className="text-[9px]">Cahaya Penuh</div>
              <div className="absolute bottom-0 left-0 h-1 w-full bg-amber-500" />
            </div>

            {/* Moonrise */}
            <div className="relative w-36 overflow-hidden rounded-lg border border-white/10 bg-[#020610] p-3">
              <div className="mb-2 flex items-center gap-2 text-[8px] tracking-widest text-cyan-400 uppercase">
                <Moon className="h-3 w-3" /> MOONRISE
              </div>
              <div className="font-mono text-2xl font-bold text-white">
                06:15 WIB
              </div>
              <div className="text-[9px]">Azimuth 85.2°</div>
              <div className="absolute bottom-0 left-0 h-1 w-full bg-cyan-500" />
            </div>

            {/* Moonset */}
            <div className="relative w-36 overflow-hidden rounded-lg border border-white/10 bg-[#020610] p-3">
              <div className="mb-2 flex items-center gap-2 text-[8px] tracking-widest text-purple-400 uppercase">
                <Moon className="h-3 w-3 rotate-180" /> MOONSET
              </div>
              <div className="font-mono text-2xl font-bold text-white">
                17:45 WIB
              </div>
              <div className="text-[9px]">Azimuth 274.8°</div>
              <div className="absolute bottom-0 left-0 h-1 w-full bg-purple-500" />
            </div>

            {/* Anjuran Ibadah */}
            <div className="relative w-40 overflow-hidden rounded-lg border border-white/10 bg-emerald-950/20 p-3">
              <div className="mb-2 flex items-center gap-2 text-[8px] tracking-widest text-emerald-400 uppercase">
                <BookOpen className="h-3 w-3" /> ANJURAN IBADAH
              </div>
              <div className="text-sm leading-tight font-bold text-white">
                Puasa Sunnah
                <br />& Qiyam
              </div>
              <button className="mt-2 w-full rounded border border-emerald-500/30 px-2 py-1 text-[8px] tracking-widest text-emerald-400 uppercase transition-colors hover:bg-emerald-500/20">
                LIHAT PANDUAN
              </button>
            </div>
          </div>
        </div>

        {/* ═══ UPCOMING EVENTS ROW ═══ */}
        <div className="grid grid-cols-4 gap-4">
          <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#040C1A] p-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 text-xl text-white/80 shadow-[0_0_10px_rgba(255,255,255,0.05)]">
              🌑
            </div>
            <div>
              <div className="text-[8px] tracking-widest text-cyan-400 uppercase">
                NEXT NEW MOON
              </div>
              <div className="text-xs font-bold text-white">
                12 Safar 1448 H
              </div>
              <div className="text-[9px]">13 Aug 2026 • 03:28 WIB</div>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#040C1A] p-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full border border-amber-500/30 text-xl shadow-[0_0_15px_rgba(245,158,11,0.2)]">
              🌕
            </div>
            <div>
              <div className="text-[8px] tracking-widest text-amber-500 uppercase">
                NEXT FULL MOON
              </div>
              <div className="text-xs font-bold text-white">
                15 Rabi' I 1448 H
              </div>
              <div className="text-[9px]">11 Sep 2026 • 09:52 WIB</div>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#040C1A] p-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full border border-rose-500/30 text-xl shadow-[0_0_15px_rgba(244,63,94,0.2)]">
              🌘
            </div>
            <div>
              <div className="text-[8px] tracking-widest text-[#8F9FB3] uppercase">
                NEXT ECLIPSE
              </div>
              <div className="text-xs font-bold text-white">
                Gerhana Bulan Sebagian
              </div>
              <div className="text-[9px]">27 Aug 2026 • 19:11 WIB</div>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#040C1A] p-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full border border-cyan-500/50">
              <Target className="h-4 w-4 text-cyan-500" />
            </div>
            <div>
              <div className="text-[8px] tracking-widest text-[#8F9FB3] uppercase">
                JARAK BULAN (SAAT INI)
              </div>
              <div className="text-xs font-bold text-white">357,344 km</div>
              <div className="text-[9px]">Apogee (Terjauh)</div>
            </div>
          </div>
        </div>

        {/* ═══ CALENDAR GRID (PETA ROTASI HIJRIYAH) ═══ */}
        <div className="rounded-xl border border-white/10 bg-[#040C1A] p-4">
          {/* Header Calendar */}
          <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2 text-[10px] font-bold tracking-widest text-cyan-400 uppercase">
              <CalendarIcon /> PETA ROTASI HIJRIYAH (BULAN INI)
            </div>
            <div className="flex items-center gap-4 text-white">
              <button className="hover:text-cyan-400">
                <ChevronLeft className="h-4 w-4" />
              </button>
              <div className="text-sm font-bold tracking-widest uppercase">
                SAFAR 1448 H
              </div>
              <button className="hover:text-cyan-400">
                <ChevronRight className="h-4 w-4" />
              </button>
              <button className="ml-4 rounded border border-white/20 px-2 py-1 text-[8px] hover:bg-white/5">
                Hari ini
              </button>
            </div>
            <button className="flex items-center gap-2 rounded border border-white/20 px-3 py-1.5 text-[9px] tracking-widest text-white uppercase hover:bg-white/5">
              <Target className="h-3 w-3 text-cyan-400" /> LIHAT TELEMETRI
              LENGKAP
            </button>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-7 gap-px overflow-hidden rounded-lg border border-white/10 bg-white/5">
            {/* Weekdays */}
            {[
              "SENIN",
              "SELASA",
              "RABU",
              "KAMIS",
              "JUMAT",
              "SABTU",
              "MINGGU",
            ].map((day, i) => (
              <div
                key={i}
                className="bg-[#020610] py-2 text-center text-[8px] font-bold tracking-widest text-[#8F9FB3]"
              >
                {i === 4 ? (
                  <span className="text-emerald-400">{day}</span>
                ) : (
                  day
                )}
              </div>
            ))}

            {/* Days (Mocked 35 days) */}
            {days.slice(0, 35).map((day, i) => {
              const isToday = i === 14 // Hari ke-15 Safar as Today
              const isAyyam = day.isAyyamulBidh
              const isHoliday = i === 10 || i === 27 // Random holidays

              return (
                <div
                  key={i}
                  onClick={() => setSelectedDayIndex(i)}
                  className={`relative flex min-h-[90px] cursor-pointer flex-col items-center justify-center border bg-[#040C1A] p-2 transition-colors hover:bg-white/5 ${isToday ? "border-cyan-500 shadow-[inset_0_0_15px_rgba(6,182,212,0.2)]" : "border-transparent"}`}
                >
                  {/* Date Hijri */}
                  <div className="mt-1 text-[28px] leading-none drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">
                    {day.icon}
                  </div>
                  <div
                    className={`mt-2 flex items-baseline gap-1 text-[11px] font-bold ${isToday ? "text-cyan-400" : "text-white"}`}
                  >
                    <span className="text-sm">{day.hijriDay}</span>{" "}
                    <span className="text-[9px] font-normal text-[#8F9FB3]">
                      {day.hijriMonthName.substring(0, 6)}
                    </span>
                  </div>
                  <div className="mt-1 text-[8px] text-[#8F9FB3]">
                    {day.gregorianDay} {day.gregorianMonthName}
                  </div>

                  {/* Badges/Indicators */}
                  {isToday && (
                    <div className="absolute top-1 right-1 rounded bg-cyan-500 px-1 py-0.5 text-[6px] font-bold text-black uppercase">
                      HARI INI
                    </div>
                  )}
                  {isToday && (
                    <div className="absolute bottom-1 rounded-full border border-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 text-[6px] font-bold whitespace-nowrap text-emerald-400 uppercase">
                      FULL MOON
                    </div>
                  )}
                  {isAyyam && !isToday && (
                    <div className="absolute top-2 right-2 h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-400 shadow-[0_0_5px_rgba(34,211,238,0.8)]" />
                  )}
                  {isHoliday && !isToday && (
                    <div className="absolute top-2 right-2 h-1.5 w-1.5 animate-pulse rounded-full bg-amber-500 shadow-[0_0_5px_rgba(245,158,11,0.8)]" />
                  )}
                </div>
              )
            })}
          </div>

          {/* Legend */}
          <div className="mt-4 flex justify-center gap-6 text-[9px] tracking-widest text-[#8F9FB3] uppercase">
            <div className="flex items-center gap-1.5">
              <div className="h-2 w-2 rounded-full border border-cyan-400" />{" "}
              Ayyamul Bidh (13-15)
            </div>
            <div className="flex items-center gap-1.5">
              <div className="mb-1 flex h-3 w-3 items-center justify-center text-xl leading-none text-amber-500">
                ★
              </div>{" "}
              Hari Penting Islam
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-2 w-2 rounded-full border border-emerald-400 bg-emerald-400/20" />{" "}
              Puasa Sunnah Disarankan
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-2 w-2 rounded-full border border-purple-400" />{" "}
              Gerhana / Fenomena
            </div>
          </div>
        </div>

        {/* ═══ BOTTOM 3 COLUMNS ═══ */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {/* COLUMN 1 */}
          <div className="flex flex-col gap-4">
            {/* Fase Bulan Saat Ini */}
            <div className="relative overflow-hidden rounded-xl border border-white/10 bg-[#040C1A] p-5">
              <div className="mb-4 text-[9px] font-bold tracking-widest text-cyan-400 uppercase">
                FASE BULAN SAAT INI
              </div>
              <div className="mb-6 flex items-center gap-4">
                <div className="relative h-20 w-20">
                  <img
                    src="/assets/moon_photorealistic.png"
                    className="h-full w-full object-contain mix-blend-screen"
                    alt="Moon"
                  />
                </div>
                <div>
                  <div className="font-mono text-3xl font-black text-white">
                    {selectedDay.illumination}%
                  </div>
                  <div className="mb-1 text-[9px] tracking-widest text-[#8F9FB3] uppercase">
                    ILUMINASI
                  </div>
                  <div className="text-xs font-bold tracking-widest text-cyan-400 uppercase">
                    FULL MOON
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-[10px]">
                <div className="flex items-center justify-between border-b border-white/5 py-1">
                  <div className="flex items-center gap-2 text-[#8F9FB3]">
                    <Clock className="h-3 w-3" /> Umur Bulan
                  </div>
                  <div className="font-mono text-white">15.3 hari</div>
                </div>
                <div className="flex items-center justify-between border-b border-white/5 py-1">
                  <div className="flex items-center gap-2 text-[#8F9FB3]">
                    <Target className="h-3 w-3" /> Jarak ke Bumi
                  </div>
                  <div className="font-mono text-white">357,344 km</div>
                </div>
                <div className="flex items-center justify-between border-b border-white/5 py-1">
                  <div className="flex items-center gap-2 text-[#8F9FB3]">
                    <Compass className="h-3 w-3" /> Sudut Elevasi
                  </div>
                  <div className="font-mono text-white">45.2°</div>
                </div>
                <div className="flex items-center justify-between py-1">
                  <div className="flex items-center gap-2 text-[#8F9FB3]">
                    <span className="text-amber-500">★</span> Zodiak
                  </div>
                  <div className="text-white">Capricornus</div>
                </div>
              </div>
            </div>

            {/* Event & Fenomena */}
            <div className="flex flex-1 flex-col justify-between rounded-xl border border-white/10 bg-[#040C1A] p-5">
              <div>
                <div className="mb-4 text-[9px] font-bold tracking-widest text-[#8F9FB3] uppercase">
                  EVENT & FENOMENA ASTRONOMI
                </div>
                <div className="space-y-4">
                  {[
                    {
                      i: "🌘",
                      d: "10 Aug 2026",
                      n: "Konjungsi Bulan & Saturnus",
                      t: "04:15 WIB",
                    },
                    {
                      i: "☄️",
                      d: "12 Aug 2026",
                      n: "Hujan Meteor Perseid (Puncak)",
                      t: "22:00 WIB",
                    },
                    {
                      i: "🌑",
                      d: "27 Aug 2026",
                      n: "Gerhana Bulan Sebagian",
                      t: "19:11 WIB",
                    },
                    {
                      i: "🌕",
                      d: "11 Sep 2026",
                      n: "Bulan Purnama",
                      t: "09:52 WIB",
                    },
                  ].map((ev, i) => (
                    <div key={i} className="flex items-center gap-3 text-[9px]">
                      <div className="text-lg">{ev.i}</div>
                      <div className="w-16 text-[#8F9FB3]">{ev.d}</div>
                      <div className="flex-1 truncate text-white">{ev.n}</div>
                      <div className="font-mono text-[#8F9FB3]">{ev.t}</div>
                    </div>
                  ))}
                </div>
              </div>
              <button className="mt-4 w-full rounded border border-white/10 py-2 text-[8px] tracking-widest text-[#8F9FB3] uppercase transition-colors hover:bg-white/5">
                LIHAT SEMUA EVENT
              </button>
            </div>
          </div>

          {/* COLUMN 2 */}
          <div className="flex flex-col gap-4">
            {/* Detail Astronomi */}
            <div className="rounded-xl border border-white/10 bg-[#040C1A] p-5">
              <div className="mb-4 text-[9px] font-bold tracking-widest text-[#8F9FB3] uppercase">
                DETAIL ASTRONOMI
              </div>
              <div className="space-y-2 text-[10px]">
                {[
                  { l: "Jarak ke Bumi", v: "357,344 km" },
                  { l: "Jarak ke Matahari", v: "152,083,000 km" },
                  { l: "Kecepatan Orbit", v: "1.022 km/s" },
                  { l: "Periode Orbit", v: "27.32 hari" },
                  { l: "Sudut Fase", v: "180.0°" },
                  { l: "Elongasi", v: "180.0°" },
                  { l: "Magnitudo", v: "-12.74" },
                  { l: "Diameter Tampak", v: "31.5'" },
                  { l: "Apogee / Perigee", v: "20 Jul (Apogee)" },
                ].map((d, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between border-b border-white/5 py-1 last:border-0"
                  >
                    <div className="flex items-center gap-2 text-[#8F9FB3]">
                      <span className="w-3 text-center opacity-50">⚬</span>{" "}
                      {d.l}
                    </div>
                    <div className="font-mono text-white">{d.v}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Lokasi & Arah Bulan */}
            <div className="flex flex-1 flex-col justify-between rounded-xl border border-white/10 bg-[#040C1A] p-5">
              <div>
                <div className="mb-4 text-[9px] font-bold tracking-widest text-[#8F9FB3] uppercase">
                  LOKASI & ARAH BULAN
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-4 text-[10px]">
                    <div>
                      <div className="mb-0.5 text-[#8F9FB3]">Azimuth Rise</div>
                      <div className="font-bold text-white">85.2° (Timur)</div>
                    </div>
                    <div>
                      <div className="mb-0.5 text-[#8F9FB3]">Azimuth Set</div>
                      <div className="font-bold text-white">274.8° (Barat)</div>
                    </div>
                    <div>
                      <div className="mb-0.5 text-[#8F9FB3]">Elevasi Maks</div>
                      <div className="font-bold text-white">65.3°</div>
                    </div>
                  </div>

                  {/* Compass Widget Mockup */}
                  <div className="relative mr-4 flex h-24 w-24 items-center justify-center rounded-full border border-white/20">
                    <div className="absolute top-1 text-[8px] text-[#8F9FB3]">
                      N
                    </div>
                    <div className="absolute bottom-1 text-[8px] text-[#8F9FB3]">
                      S
                    </div>
                    <div className="absolute left-1 text-[8px] text-[#8F9FB3]">
                      W
                    </div>
                    <div className="absolute right-1 text-[8px] text-[#8F9FB3]">
                      E
                    </div>
                    <div className="h-16 w-16 rounded-full border border-white/10" />
                    <div className="h-8 w-8 rounded-full border border-white/10" />
                    {/* Trajectory line */}
                    <svg
                      className="absolute inset-0 h-full w-full"
                      viewBox="0 0 100 100"
                    >
                      <path
                        d="M 20 80 Q 50 20 80 80"
                        fill="none"
                        stroke="rgba(255,255,255,0.2)"
                        strokeWidth="1"
                        strokeDasharray="2 2"
                      />
                    </svg>
                    {/* Moon blip */}
                    <div className="absolute top-[30%] left-[60%] h-2 w-2 rounded-full bg-amber-500 shadow-[0_0_10px_#F59E0B]" />
                    <div className="h-1 w-1 rounded-full bg-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* COLUMN 3 */}
          <div className="flex flex-col gap-4">
            {/* Waktu Ibadah */}
            <div className="rounded-xl border border-white/10 bg-[#040C1A] p-5">
              <div className="mb-4 text-[9px] font-bold tracking-widest text-[#8F9FB3] uppercase">
                WAKTU IBADAH HARI INI
              </div>
              <div className="space-y-1 text-[10px]">
                {[
                  {
                    n: "Subuh",
                    t: "04:32 WIB",
                    i: <Sun className="h-3 w-3 text-cyan-400" />,
                  },
                  {
                    n: "Dzuhur",
                    t: "12:05 WIB",
                    i: <Sun className="h-3 w-3 text-amber-500" />,
                  },
                  {
                    n: "Ashar",
                    t: "15:28 WIB",
                    i: <Sun className="h-3 w-3 text-amber-600" />,
                  },
                  {
                    n: "Maghrib",
                    t: "17:45 WIB",
                    i: <Sun className="h-3 w-3 text-rose-500" />,
                  },
                  {
                    n: "Isya'",
                    t: "19:05 WIB",
                    i: <Moon className="h-3 w-3 text-indigo-400" />,
                  },
                ].map((p, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between border-b border-white/5 py-1.5 last:border-0"
                  >
                    <div className="flex items-center gap-2 text-white">
                      {p.i} {p.n}
                    </div>
                    <div className="font-mono font-bold text-white">{p.t}</div>
                  </div>
                ))}
                <div className="mt-1 flex items-center justify-between border-t border-white/10 py-1.5 pt-2">
                  <div className="flex items-center gap-2 text-emerald-400">
                    <Moon className="h-3 w-3" /> Qiyam Lail (Start)
                  </div>
                  <div className="font-mono font-bold text-emerald-400">
                    00:45 WIB
                  </div>
                </div>
                <div className="flex items-center justify-between py-1.5">
                  <div className="flex items-center gap-2 text-cyan-400">
                    <RefreshCw className="h-3 w-3" /> Ayyamul Bidh
                  </div>
                  <div className="font-mono font-bold text-cyan-400">
                    13 - 15 Safar
                  </div>
                </div>
              </div>
            </div>

            {/* Ayat Hari Ini & Kalender Tahunan */}
            <div className="flex flex-1 gap-4">
              {/* Kiri: Ayat & Hadis */}
              <div className="flex flex-1 flex-col rounded-xl border border-white/10 bg-[#040C1A] p-5">
                <div className="mb-3 text-[9px] font-bold tracking-widest text-[#8F9FB3] uppercase">
                  AYAT HARI INI
                </div>
                <div
                  className="font-arabic mb-4 text-right text-3xl leading-[1.8] text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]"
                  dir="rtl"
                >
                  {dailyData?.ayah?.textArabic ||
                    "وَجَعَلْنَا اللَّيْلَ لِبَاسًا ۝ وَجَعَلْنَا النَّهَارَ مَعَاشًا"}
                </div>
                <div className="mb-1 text-[8px] font-bold tracking-widest text-emerald-400 uppercase">
                  (QS. {dailyData?.ayah?.surahName || "An-Naba'"}:{" "}
                  {dailyData?.ayah?.ayahNumber || "10-11"})
                </div>
                <div className="mb-4 text-[9px] leading-relaxed text-[#8F9FB3] italic">
                  "
                  {dailyData?.ayah?.translationId ||
                    "Dan Kami jadikan malam sebagai pakaian, dan Kami jadikan siang untuk mencari penghidupan."}
                  "
                </div>
                <button className="mb-4 w-full rounded border border-white/10 py-1.5 text-[7px] tracking-widest text-white uppercase transition-colors hover:bg-white/5">
                  LIHAT TAFSIR & KAITAN
                </button>

                <div className="mb-2 border-t border-white/5 pt-4 text-[9px] font-bold tracking-widest text-[#8F9FB3] uppercase">
                  HADIS PILIHAN
                </div>
                <div className="mb-2 line-clamp-4 text-[8px] leading-relaxed text-white italic">
                  "
                  {dailyData?.hadith?.textId ||
                    "Berpuasalah kamu karena melihat hilal, dan berbukalah kamu karena melihat hilal. Jika tertutup awan bagimu, maka cukupkanlah hitungan (bilangan) bulan itu menjadi tiga puluh."}
                  "
                </div>
                <div className="mb-4 text-[7px] tracking-widest text-[#8F9FB3] uppercase">
                  ({dailyData?.hadith?.bookName || "HR. Bukhari & Muslim"}
                  {dailyData?.hadith?.number
                    ? ` No. ${dailyData.hadith.number}`
                    : ""}
                  )
                </div>
                <button className="mt-auto w-full rounded border border-white/10 py-1.5 text-[7px] tracking-widest text-white uppercase transition-colors hover:bg-white/5">
                  LIHAT HADIS LAINNYA
                </button>
              </div>

              {/* Kanan: Kalender & Tips */}
              <div className="flex flex-1 flex-col gap-4">
                <div className="flex flex-1 flex-col rounded-xl border border-white/10 bg-[#040C1A] p-4">
                  <div className="mb-3 text-[8px] font-bold tracking-widest text-[#8F9FB3] uppercase">
                    KALENDER HIJRIYAH TAHUN INI
                  </div>
                  <div className="mb-4 space-y-2.5 text-[9px]">
                    {[
                      { m: "Muharram 1448", d: "26 Jun 2026", i: "🌑" },
                      {
                        m: "Safar 1448",
                        d: "25 Jul 2026",
                        i: "🌕",
                        c: "text-cyan-400",
                      },
                      { m: "Rabi' I 1448", d: "23 Aug 2026", i: "🌑" },
                      { m: "Rabi' II 1448", d: "22 Sep 2026", i: "🌑" },
                      { m: "Jumadil Ula 1448", d: "22 Okt 2026", i: "🌑" },
                    ].map((h, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between"
                      >
                        <div
                          className={`flex items-center gap-1.5 ${h.c || "text-white"}`}
                        >
                          <FileText className="h-3 w-3 opacity-50" /> {h.m}
                        </div>
                        <div className="font-mono text-[#8F9FB3]">{h.d}</div>
                      </div>
                    ))}
                  </div>
                  <button className="mt-auto w-full rounded border border-white/10 py-1.5 text-[7px] tracking-widest text-white uppercase transition-colors hover:bg-white/5">
                    LIHAT KALENDER LENGKAP
                  </button>
                </div>

                <div className="flex flex-col rounded-xl border border-white/10 bg-[#040C1A] p-4">
                  <div className="mb-3 text-[8px] font-bold tracking-widest text-[#8F9FB3] uppercase">
                    TIPS IBADAH
                  </div>
                  <div className="mb-4 space-y-2 text-[9px]">
                    <div className="flex items-center gap-2 text-white">
                      <span className="text-[12px] leading-none text-emerald-400">
                        ★
                      </span>{" "}
                      Puasa Ayyamul Bidh (13-15 Safar)
                    </div>
                    <div className="flex items-center gap-2 text-[#8F9FB3]">
                      <span className="text-[12px] leading-none text-emerald-400">
                        ◎
                      </span>{" "}
                      Qiyam Lail setelah Isya'
                    </div>
                    <div className="flex items-center gap-2 text-[#8F9FB3]">
                      <span className="text-[12px] leading-none text-emerald-400">
                        ◎
                      </span>{" "}
                      Perbanyak Dzikir & Istighfar
                    </div>
                    <div className="flex items-center gap-2 text-[#8F9FB3]">
                      <span className="text-[12px] leading-none text-emerald-400">
                        ◎
                      </span>{" "}
                      Sedekah di Hari Rabu
                    </div>
                    <div className="flex items-center gap-2 text-[#8F9FB3]">
                      <span className="text-[12px] leading-none text-emerald-400">
                        ◎
                      </span>{" "}
                      Baca Al-Kahfi di Hari Jumat
                    </div>
                  </div>
                  <button className="mt-auto w-full rounded border border-white/10 py-1.5 text-[7px] tracking-widest text-white uppercase transition-colors hover:bg-white/5">
                    LIHAT SEMUA TIPS
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ═══ FOOTER ═══ */}
        <div className="grid grid-cols-1 gap-4 pt-2 pb-10 md:grid-cols-3">
          <div className="flex items-center justify-between rounded-xl border border-white/10 bg-[#040C1A] p-4">
            <div>
              <div className="mb-1 flex items-center gap-2 text-[9px] font-bold tracking-widest text-cyan-400 uppercase">
                <MessageSquare className="h-3 w-3" /> HOLOGRAM COMMUNITY CHAT{" "}
                <span className="text-white">(8)</span>
              </div>
              <div className="text-[8px] text-[#8F9FB3]">
                Bergabung dalam diskusi global tentang fenomena langit & kajian
                Islam.
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                <div className="h-6 w-6 rounded-full border border-white bg-blue-900" />
                <div className="h-6 w-6 rounded-full border border-white bg-purple-900" />
                <div className="h-6 w-6 rounded-full border border-white bg-emerald-900" />
              </div>
              <button className="ml-2 rounded border border-white/20 px-3 py-1.5 text-[8px] font-bold tracking-widest text-white uppercase hover:bg-white/5">
                BUKA CHAT
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between rounded-xl border border-white/10 bg-[#040C1A] p-4">
            <div>
              <div className="mb-1 flex items-center gap-2 text-[9px] font-bold tracking-widest text-cyan-400 uppercase">
                <Quote className="h-3 w-3" /> REFLEKSI HARI INI
              </div>
              <div className="text-[8px] text-white italic">
                "Langit dan bumi adalah tanda-tanda (kekuasaan Allah) bagi
                orang-orang yang beriman." (QS. Fussilat: 53)
              </div>
            </div>
            <button className="ml-4 rounded border border-white/20 px-3 py-1.5 text-[8px] font-bold tracking-widest whitespace-nowrap text-white uppercase hover:bg-white/5">
              TULIS REFLEKSI ANDA
            </button>
          </div>

          <div className="rounded-xl border border-white/10 bg-[#040C1A] p-4">
            <div className="mb-1 flex items-center gap-2 text-[9px] font-bold tracking-widest text-[#8F9FB3] uppercase">
              <RefreshCw className="h-3 w-3" /> DATA SYNCHRONIZATION
            </div>
            <div className="flex items-end justify-between text-[8px] text-[#8F9FB3]">
              <div>
                Last Sync: 29 Jul 2026 06:01 WIB
                <br />
                Source: NASA JPL • USNO • BMKG • Hisab Rukyat
              </div>
              <button className="ml-2 rounded border border-white/10 px-2 py-1 text-[7px] font-bold tracking-widest text-white uppercase hover:bg-white/5">
                SINKRONISASI SEKARANG
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function CalendarIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-cyan-400"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
      <line x1="16" y1="2" x2="16" y2="6"></line>
      <line x1="8" y1="2" x2="8" y2="6"></line>
      <line x1="3" y1="10" x2="21" y2="10"></line>
      <path d="M8 14h.01"></path>
      <path d="M12 14h.01"></path>
      <path d="M16 14h.01"></path>
      <path d="M8 18h.01"></path>
      <path d="M12 18h.01"></path>
      <path d="M16 18h.01"></path>
    </svg>
  )
}
