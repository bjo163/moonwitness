"use client"

import { useState, useEffect } from "react"
import {
  Search,
  Bookmark,
  Share2,
  PlayCircle,
  BookOpen,
  Clock,
  Shield,
  Sun,
  Moon,
  MapPin,
  Home,
  AlertCircle,
  Heart,
  CheckCircle2,
  Star,
  Target,
  Zap,
  LayoutGrid,
  List,
  Calendar,
  Download,
  Smartphone,
  Printer,
  Flame,
} from "lucide-react"

const topStats = [
  {
    icon: Heart,
    label: "TOTAL DUA",
    value: "1,248",
    sub: "Terverifikasi",
    color: "blue",
  },
  {
    icon: BookOpen,
    label: "SUMBER",
    value: "16",
    sub: "Kitab Shahih",
    color: "emerald",
  },
  {
    icon: Search,
    label: "BAHASA",
    value: "7",
    sub: "Tersedia",
    color: "amber",
  },
  {
    icon: Star,
    label: "DIAKSES HARI INI",
    value: "12,843",
    sub: "Akses",
    color: "purple",
  },
]

const tabs = [
  "SEMUA",
  "HARIAN",
  "PAGI",
  "SORE",
  "MALAM",
  "PERJALANAN",
  "PERLINDUNGAN",
  "RUMAH & KELUARGA",
  "SHALAT & IBADAH",
  "DARURAT",
  "LAINNYA",
]

export function DoaHarianView() {
  const [mounted, setMounted] = useState(false)
  const [activeTab, setActiveTab] = useState("HARIAN")
  const [searchQuery, setSearchQuery] = useState("")
  const [adhkarData, setAdhkarData] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setMounted(true)
    setIsLoading(true)
    fetch(`/api/adhkar`)
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          setAdhkarData(json.data)
        }
        setIsLoading(false)
      })
      .catch((err) => {
        console.error(err)
        setIsLoading(false)
      })
  }, [])

  if (!mounted || isLoading)
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#020813] font-mono text-sm tracking-widest text-blue-500">
        INITIALIZING ADHKAR SYSTEM...
      </div>
    )

  const filteredData = adhkarData.filter((item) => {
    if (activeTab !== "SEMUA") {
      if (
        activeTab === "HARIAN" &&
        !["Pagi", "Sore", "Malam"].includes(item.timing)
      )
        return false
      if (
        activeTab !== "HARIAN" &&
        item.category?.toUpperCase() !== activeTab &&
        item.timing?.toUpperCase() !== activeTab
      )
        return false
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      return (
        item.title.toLowerCase().includes(q) ||
        item.translation.toLowerCase().includes(q)
      )
    }
    return true
  })

  const dynamicTopStats = [
    {
      icon: Heart,
      label: "TOTAL DUA",
      value: adhkarData.length.toString(),
      sub: "Dari Hisnul Muslim",
      color: "blue",
    },
    {
      icon: BookOpen,
      label: "SUMBER",
      value: "Utama",
      sub: "Kitab Hisnul Muslim",
      color: "emerald",
    },
    {
      icon: Search,
      label: "BAHASA",
      value: "3",
      sub: "Arab, Latin, ID",
      color: "amber",
    },
    {
      icon: Star,
      label: "KATEGORI",
      value: new Set(adhkarData.map((d) => d.category)).size.toString(),
      sub: "Klasifikasi",
      color: "purple",
    },
  ]

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#020813] pb-20 font-sans text-white selection:bg-blue-500/30">
      {/* Background Effects */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute top-[10%] left-[20%] h-[500px] w-[500px] rounded-full bg-blue-600/5 blur-[120px]" />
        <div className="absolute right-[10%] bottom-[20%] h-[600px] w-[600px] rounded-full bg-emerald-600/5 blur-[150px]" />
        <div className="absolute top-[40%] left-[50%] h-[800px] w-[800px] -translate-x-1/2 rounded-full bg-purple-600/5 blur-[150px]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.015] mix-blend-overlay" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1600px] px-6 pt-24">
        {/* Header Section */}
        <div className="mb-8 flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
          <div className="flex items-center gap-5">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-blue-500/20 bg-[#040C1A] shadow-[0_0_30px_rgba(59,130,246,0.15)]">
              <Moon className="h-6 w-6 text-blue-400" />
            </div>
            <div>
              <h1 className="mb-1 flex items-center gap-3 text-2xl font-bold tracking-tight text-white drop-shadow-md lg:text-3xl">
                PROPHETIC ADHKAR & SUPPLICATIONS
              </h1>
              <p className="max-w-2xl text-sm text-[#8F9FB3]">
                Kumpulan doa, dzikir, dan shahih harian dari Rasulullah ﷺ
                sebagai benteng perlindungan jiwa raga dalam setiap helaan
                nafas.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 rounded-2xl border border-white/5 bg-[#040C1A] p-4 md:flex md:flex-wrap lg:gap-6">
            {dynamicTopStats.map((stat, idx) => (
              <div
                key={idx}
                className={`flex items-center gap-2 md:gap-3 ${idx !== dynamicTopStats.length - 1 ? "border-white/5 md:border-r md:pr-4 lg:pr-6" : ""}`}
              >
                <div
                  className={`h-10 w-10 shrink-0 rounded-full bg-${stat.color}-500/10 border border-${stat.color}-500/20 flex items-center justify-center text-${stat.color}-400`}
                >
                  <stat.icon className="h-4 w-4" />
                </div>
                <div>
                  <div className="mb-0.5 text-[8px] font-bold tracking-widest text-[#8F9FB3] uppercase">
                    {stat.label}
                  </div>
                  <div className="mb-0.5 font-mono text-base leading-none font-bold text-white md:text-lg">
                    {stat.value}
                  </div>
                  <div className="hidden text-[8px] text-[#8F9FB3] sm:block">
                    {stat.sub}
                  </div>
                </div>
              </div>
            ))}
            <div className="col-span-2 mt-2 flex items-center justify-center border-t border-white/5 pt-2 md:col-span-1 md:mt-0 md:border-t-0 md:border-l md:pt-0 md:pl-4 lg:pl-6">
              <div className="relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border border-amber-500/30 shadow-[0_0_20px_rgba(245,158,11,0.15)] md:h-16 md:w-16">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Allah-green.svg/1024px-Allah-green.svg.png"
                  className="h-8 w-8 object-contain opacity-80 mix-blend-screen hue-rotate-[180deg] md:h-10 md:w-10"
                  alt="Calligraphy"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Action Bar (Time, Benefits, Sync, Status) */}
        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
          <div className="rounded-xl border border-white/5 bg-[#040C1A] p-4">
            <div className="mb-3 text-[9px] font-bold tracking-widest text-blue-400 uppercase">
              WAKTU TERBAIK BERDZIKIR
            </div>
            <div className="flex items-center justify-between text-[10px] text-[#8F9FB3]">
              <div className="text-center">
                <Sun className="mx-auto mb-1 h-4 w-4 text-amber-400" />
                <span className="text-white">PAGI</span>
                <br />
                03:00 - 06:00
              </div>
              <div className="text-center">
                <Sun className="mx-auto mb-1 h-4 w-4 text-emerald-400" />
                <span className="text-white">SIANG</span>
                <br />
                11:00 - 13:00
              </div>
              <div className="text-center">
                <Moon className="mx-auto mb-1 h-4 w-4 text-orange-400" />
                <span className="text-white">SORE</span>
                <br />
                16:00 - 18:00
              </div>
              <div className="text-center">
                <Moon className="mx-auto mb-1 h-4 w-4 text-blue-400" />
                <span className="text-white">MALAM</span>
                <br />
                01:00 - 03:00
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-white/5 bg-[#040C1A] p-4">
            <div className="mb-3 text-[9px] font-bold tracking-widest text-blue-400 uppercase">
              NILAI & MANFAAT
            </div>
            <div className="flex items-center justify-around text-[9px] text-[#8F9FB3]">
              <div className="text-center">
                <Heart className="mx-auto mb-1 h-4 w-4 text-blue-400" />
                KETENANGAN HATI
              </div>
              <div className="text-center">
                <Shield className="mx-auto mb-1 h-4 w-4 text-emerald-400" />
                PERLINDUNGAN DIRI
              </div>
              <div className="text-center">
                <Star className="mx-auto mb-1 h-4 w-4 text-amber-400" />
                KEBERKAHAN HIDUP
              </div>
              <div className="text-center">
                <Target className="mx-auto mb-1 h-4 w-4 text-purple-400" />
                PENGAMPUNAN DOSA
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-center rounded-xl border border-white/5 bg-[#040C1A] p-4">
            <div className="mb-2 text-[9px] font-bold tracking-widest text-blue-400 uppercase">
              SINKRONISASI ADHKAR
            </div>
            <p className="mb-3 text-[10px] text-[#8F9FB3]">
              Dapatkan jadwal dzikir harian sesuai waktu & lokasi Anda.
            </p>
            <button className="w-full rounded border border-blue-500/30 bg-blue-500/10 py-1.5 text-[9px] font-bold tracking-widest text-blue-400 transition-colors hover:bg-blue-500/20">
              SINKRONKAN SEKARANG
            </button>
          </div>

          <div className="flex flex-col items-end justify-center rounded-xl border border-white/5 bg-[#040C1A] p-4 text-right">
            <div className="mb-1 text-[9px] font-bold tracking-widest text-[#8F9FB3] uppercase">
              STATUS SISTEM
            </div>
            <div className="mb-3 text-[8px] tracking-widest text-blue-500 uppercase">
              OPERATION MODE
              <br />
              <span className="text-white">ADHKAR-SYNC-ROUTINE</span>
            </div>
            <div className="flex items-center gap-1.5 text-[9px] font-bold tracking-widest text-emerald-400 uppercase">
              <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
              ONLINE
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="hide-scrollbar mb-6 flex snap-x items-center justify-between overflow-x-auto border-b border-white/10 pb-0">
          <div className="flex min-w-max gap-6 px-2">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`snap-center border-b-2 pb-3 text-[10px] font-bold tracking-widest whitespace-nowrap uppercase transition-all duration-300 ${
                  activeTab === tab
                    ? "border-blue-500 text-blue-400"
                    : "border-transparent text-[#8F9FB3] hover:text-white"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <button className="mb-2 hidden shrink-0 items-center gap-2 rounded border border-blue-500/30 bg-blue-500/10 px-3 py-1.5 text-[9px] font-bold tracking-widest text-blue-400 transition-colors hover:bg-blue-500/20 lg:flex">
            <Calendar className="h-3.5 w-3.5" />
            JADWAL HARIAN
          </button>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Left Sidebar */}
          <div className="flex flex-col gap-6 lg:col-span-2">
            {/* Kategori Adhkar */}
            <div className="rounded-xl border border-white/5 bg-[#040C1A] p-4">
              <div className="mb-4 border-b border-white/5 pb-2 text-[9px] font-bold tracking-widest text-blue-400 uppercase">
                KATEGORI ADHKAR
              </div>
              <div className="space-y-2 text-[10px] text-[#8F9FB3]">
                {[
                  {
                    icon: Sun,
                    label: "Harian (Pagi & Sore)",
                    count: adhkarData.filter((d) =>
                      ["Harian", "Pagi", "Sore"].includes(d.category)
                    ).length,
                  },
                  {
                    icon: Shield,
                    label: "Perlindungan",
                    count: adhkarData.filter(
                      (d) => d.category === "Perlindungan"
                    ).length,
                  },
                  {
                    icon: MapPin,
                    label: "Perjalanan",
                    count: adhkarData.filter((d) => d.category === "Perjalanan")
                      .length,
                  },
                  {
                    icon: Home,
                    label: "Rumah & Keluarga",
                    count: adhkarData.filter(
                      (d) => d.category === "Rumah & Keluarga"
                    ).length,
                  },
                  {
                    icon: Target,
                    label: "Shalat & Ibadah",
                    count: adhkarData.filter(
                      (d) => d.category === "Shalat & Ibadah"
                    ).length,
                  },
                  {
                    icon: AlertCircle,
                    label: "Darurat & Kesulitan",
                    count: adhkarData.filter(
                      (d) => d.category === "Darurat & Kesulitan"
                    ).length,
                  },
                  {
                    icon: LayoutGrid,
                    label: "Lainnya",
                    count: adhkarData.filter(
                      (d) =>
                        ![
                          "Harian",
                          "Pagi",
                          "Sore",
                          "Perlindungan",
                          "Perjalanan",
                          "Rumah & Keluarga",
                          "Shalat & Ibadah",
                          "Darurat & Kesulitan",
                        ].includes(d.category)
                    ).length,
                  },
                ].map((cat, i) => (
                  <div
                    key={i}
                    className="group flex cursor-pointer items-center justify-between transition-colors hover:text-white"
                    onClick={() =>
                      setActiveTab(
                        cat.label === "Harian (Pagi & Sore)"
                          ? "HARIAN"
                          : cat.label.toUpperCase()
                      )
                    }
                  >
                    <div className="flex items-center gap-2">
                      <cat.icon className="h-3.5 w-3.5 text-amber-500/70 group-hover:text-amber-400" />
                      {cat.label}
                    </div>
                    <span className="font-mono">{cat.count}</span>
                  </div>
                ))}
              </div>
              <button className="mt-4 w-full rounded border border-white/10 py-1.5 text-[9px] font-bold tracking-widest text-[#8F9FB3] transition-colors hover:bg-white/5 hover:text-white">
                LIHAT SEMUA KATEGORI
              </button>
            </div>

            {/* Sumber Kitab */}
            <div className="rounded-xl border border-white/5 bg-[#040C1A] p-4">
              <div className="mb-4 border-b border-white/5 pb-2 text-[9px] font-bold tracking-widest text-blue-400 uppercase">
                SUMBER KITAB
              </div>
              <div className="space-y-2 text-[10px] text-[#8F9FB3]">
                {[
                  {
                    label: "Hisnul Muslim",
                    count: adhkarData.length,
                    color: "emerald",
                  },
                  {
                    label: "Sahih Bukhari",
                    count: adhkarData.filter((d) =>
                      d.source?.toLowerCase().includes("bukhari")
                    ).length,
                    color: "blue",
                  },
                  {
                    label: "Sahih Muslim",
                    count: adhkarData.filter((d) =>
                      d.source?.toLowerCase().includes("muslim")
                    ).length,
                    color: "blue",
                  },
                  {
                    label: "Abu Dawud",
                    count: adhkarData.filter((d) =>
                      d.source?.toLowerCase().includes("dawud")
                    ).length,
                    color: "amber",
                  },
                  {
                    label: "Tirmidzi",
                    count: adhkarData.filter((d) =>
                      d.source?.toLowerCase().includes("tirmidzi")
                    ).length,
                    color: "purple",
                  },
                ].map((src, i) => (
                  <div
                    key={i}
                    className="group flex cursor-pointer items-center justify-between transition-colors hover:text-white"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`h-1.5 w-1.5 rounded-full bg-${src.color}-500`}
                      />
                      {src.label}
                    </div>
                    <span className="font-mono">{src.count}</span>
                  </div>
                ))}
              </div>
              <button className="mt-4 w-full rounded border border-white/10 py-1.5 text-[9px] font-bold tracking-widest text-[#8F9FB3] transition-colors hover:bg-white/5 hover:text-white">
                LIHAT SEMUA SUMBER
              </button>
            </div>

            {/* Pencarian Cepat */}
            <div className="rounded-xl border border-white/5 bg-[#040C1A] p-4">
              <div className="mb-3 border-b border-white/5 pb-2 text-[9px] font-bold tracking-widest text-blue-400 uppercase">
                PENCARIAN CEPAT
              </div>
              <div className="relative mb-3">
                <Search className="absolute top-2.5 left-2.5 h-3 w-3 text-[#8F9FB3]" />
                <input
                  type="text"
                  placeholder="Cari doa, keutamaan, atau tema..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-[#020813] py-2 pr-3 pl-8 text-[10px] text-white outline-none placeholder:text-[#8F9FB3] focus:border-blue-500/50"
                />
              </div>
              <div className="mb-2 text-[9px] text-[#8F9FB3]">
                Pencarian Populer:
              </div>
              <div className="flex flex-wrap gap-1.5">
                {[
                  "Perlindungan",
                  "Pagi",
                  "Tidur",
                  "Rezeki",
                  "Hati Tenang",
                  "Hutang",
                ].map((tag) => (
                  <span
                    key={tag}
                    className="cursor-pointer rounded border border-white/10 px-2 py-0.5 text-[8px] hover:bg-white/5"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Center Grid */}
          <div className="flex flex-col lg:col-span-7">
            <div className="mb-4 flex items-end justify-between">
              <div>
                <h2 className="mb-1 text-lg font-bold tracking-widest text-white uppercase">
                  {activeTab === "SEMUA"
                    ? "SEMUA ADHKAR"
                    : `ADHKAR ${activeTab}`}
                </h2>
                <p className="text-[10px] text-[#8F9FB3]">
                  Dzikir yang dibaca di waktu {activeTab.toLowerCase()} hari.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-[10px] text-[#8F9FB3]">
                  Menampilkan{" "}
                  <span className="text-white">
                    1 - {Math.min(12, filteredData.length)}
                  </span>{" "}
                  dari {filteredData.length}
                </div>
                <div className="flex gap-1">
                  <button className="flex h-6 w-6 items-center justify-center rounded bg-blue-500/20 text-blue-400">
                    <LayoutGrid className="h-3 w-3" />
                  </button>
                  <button className="flex h-6 w-6 items-center justify-center rounded border border-white/10 text-[#8F9FB3]">
                    <List className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>

            {filteredData.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center rounded-xl border border-white/5 bg-[#040C1A] p-10 text-[#8F9FB3]">
                <Search className="mb-3 h-8 w-8 opacity-20" />
                <div className="mb-1 text-sm font-bold tracking-widest uppercase">
                  TIDAK DITEMUKAN
                </div>
                <div className="text-[10px]">
                  Coba gunakan kata kunci yang berbeda.
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                {filteredData.slice(0, 12).map((item, idx) => {
                  const padId = (idx + 1).toString().padStart(2, "0")
                  let badgeColor = "blue"
                  let BadgeIcon = Sun

                  if (item.timing?.includes("Pagi")) {
                    badgeColor = "amber"
                    BadgeIcon = Sun
                  } else if (item.timing?.includes("Sore")) {
                    badgeColor = "orange"
                    BadgeIcon = Sun
                  } else if (item.timing?.includes("Malam")) {
                    badgeColor = "purple"
                    BadgeIcon = Moon
                  }

                  return (
                    <div
                      key={idx}
                      className="group relative flex flex-col overflow-hidden rounded-xl border border-white/5 bg-[#040C1A] p-5 transition-all hover:border-white/10"
                    >
                      {/* Top header of card */}
                      <div className="relative z-10 mb-6 flex items-center justify-between">
                        <div className="font-mono text-sm font-bold text-white">
                          {padId}
                        </div>
                        <div
                          className={`flex items-center gap-1.5 rounded border px-2 py-0.5 border-${badgeColor}-500/30 text-${badgeColor}-400 bg-${badgeColor}-500/10 font-sans text-[8px] font-bold tracking-widest uppercase`}
                        >
                          <BadgeIcon className="h-3 w-3" />
                          {item.timing === "Semua" ? "HARIAN" : item.timing}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="relative z-10 flex flex-1 flex-col">
                        <div className="font-arabic mb-4 flex min-h-[60px] items-center justify-end text-right text-xl leading-relaxed text-amber-500 drop-shadow-[0_0_8px_rgba(245,158,11,0.2)]">
                          {item.arabic}
                        </div>

                        <div className="mb-2 text-[10px] text-[#8F9FB3] italic">
                          {item.latin}
                        </div>

                        <div className="mb-4 line-clamp-3 text-[10px] text-white/90">
                          {item.translation}
                        </div>

                        <div className="mt-auto space-y-2 border-t border-white/5 pt-3">
                          <div className="text-[9px] font-bold text-emerald-400">
                            <span className="font-normal text-[#8F9FB3]">
                              Manfaat:
                            </span>{" "}
                            {item.benefit}
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="font-mono text-[8px] text-[#8F9FB3]">
                              {item.source}
                            </div>
                            <div className="flex gap-2">
                              <Bookmark className="h-3 w-3 cursor-pointer text-[#8F9FB3] hover:text-amber-400" />
                              <Share2 className="h-3 w-3 cursor-pointer text-[#8F9FB3] hover:text-white" />
                              <PlayCircle className="h-3 w-3 cursor-pointer text-blue-400 hover:text-blue-300" />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-blue-500/0 via-transparent to-blue-500/5 opacity-0 transition-opacity group-hover:opacity-100" />
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="flex flex-col gap-6 lg:col-span-3">
            {/* Hadis Pilihan */}
            <div className="relative overflow-hidden rounded-xl border border-white/5 bg-[#040C1A] p-5">
              <div className="pointer-events-none absolute top-0 right-0 h-32 w-32 rounded-full bg-amber-500/10 blur-[50px]" />
              <div className="relative z-10 mb-4 border-b border-white/5 pb-2 text-[9px] font-bold tracking-widest text-blue-400 uppercase">
                HADIS PILIHAN
              </div>

              <div className="relative z-10 mb-4 flex items-center justify-between font-mono text-[7px] text-[#8F9FB3]">
                <span>HR. BUKHARI 7/158</span>
                <span>HR. MUSLIM 4/2071</span>
              </div>

              <div className="font-arabic relative z-10 mb-4 text-center text-xl leading-relaxed text-white">
                مَنْ لَزِمَ عَلَىٰ دُعَاءِهِ
              </div>
              <div className="relative z-10 mb-2 text-center text-[9px] text-[#8F9FB3] italic">
                Man la yazal 'ala du'a'ihi hatta yudkhalal jannah.
              </div>
              <div className="relative z-10 mb-6 text-center text-[10px] text-white/90">
                Barangsiapa yang terus menerus berdoa kepada Allah sampai ia
                masuk surga.
              </div>
              <button className="relative z-10 w-full rounded border border-white/10 bg-white/5 py-2 text-[9px] font-bold tracking-widest text-white transition-colors hover:bg-white/10">
                LIHAT HADIS LENGKAP
              </button>
            </div>

            {/* Keutamaan Dzikir */}
            <div className="rounded-xl border border-white/5 bg-[#040C1A] p-5">
              <div className="mb-4 border-b border-white/5 pb-2 text-[9px] font-bold tracking-widest text-blue-400 uppercase">
                KEUTAMAAN DZIKIR
              </div>
              <div className="space-y-3">
                {[
                  { icon: CheckCircle2, text: "Menghapus dosa-dosa kecil" },
                  { icon: Heart, text: "Mendatangkan ketenangan hati" },
                  { icon: Shield, text: "Menolak gangguan setan" },
                  { icon: Star, text: "Mendatangkan rezeki & berkah" },
                  { icon: AlertCircle, text: "Melindungi dari keburukan" },
                  { icon: Target, text: "Meninggikan derajat di sisi Allah" },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2.5 text-[10px] text-[#8F9FB3]"
                  >
                    <div className="mt-0.5">
                      <item.icon className="h-3.5 w-3.5 text-amber-500" />
                    </div>
                    <div>{item.text}</div>
                  </div>
                ))}
              </div>
              <button className="mt-5 w-full rounded border border-white/10 py-2 text-[9px] font-bold tracking-widest text-[#8F9FB3] transition-colors hover:bg-white/5 hover:text-white">
                LIHAT SEMUA KEUTAMAAN
              </button>
            </div>

            {/* Adhkar Streak */}
            <div className="rounded-xl border border-white/5 bg-[#040C1A] p-5">
              <div className="mb-4 border-b border-white/5 pb-2 text-[9px] font-bold tracking-widest text-blue-400 uppercase">
                ADHKAR STREAK
              </div>

              <div className="mb-5 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-orange-500/30 bg-orange-500/10 text-orange-500">
                  <Flame className="h-6 w-6" />
                </div>
                <div>
                  <div className="mb-1 font-mono text-xl leading-none font-bold text-white">
                    23 HARI
                  </div>
                  <div className="text-[9px] text-emerald-400">
                    Tetap istiqomah!
                  </div>
                </div>
              </div>

              <div className="mb-2 flex items-center justify-between px-1">
                {["S", "S", "R", "K", "J", "S", "M"].map((day, i) => (
                  <div key={i} className="flex flex-col items-center gap-1.5">
                    <div className="text-[8px] font-bold text-[#8F9FB3]">
                      {day}
                    </div>
                    {i < 5 ? (
                      <div className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-500">
                        <CheckCircle2 className="h-3 w-3" />
                      </div>
                    ) : i === 5 ? (
                      <div className="flex h-4 w-4 items-center justify-center rounded-full bg-blue-500">
                        <CheckCircle2 className="h-3 w-3 text-white" />
                      </div>
                    ) : (
                      <div className="h-4 w-4 rounded-full border border-white/10 bg-white/5" />
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-4 border-t border-white/5 pt-4">
                <div className="mb-2 flex items-center justify-between text-[9px] text-[#8F9FB3]">
                  <span>TARGET HARIAN</span>
                  <span className="font-bold text-white">100%</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/5">
                  <div className="h-full w-full rounded-full bg-blue-500" />
                </div>
                <div className="mt-1.5 font-mono text-[8px] text-blue-400">
                  15/15 dzikir
                </div>
              </div>

              <button className="mt-4 w-full rounded border border-blue-500/30 bg-blue-500/10 py-2 text-[9px] font-bold tracking-widest text-blue-400 transition-colors hover:bg-blue-500/20">
                LIHAT PROGRESS
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-6 grid grid-cols-1 gap-6 border-t border-white/10 pt-6 md:grid-cols-4">
          <div className="rounded-xl border border-white/5 bg-[#040C1A] p-4">
            <div className="mb-3 text-[9px] font-bold tracking-widest text-blue-400 uppercase">
              ADHKAR HARI INI (REKOMENDASI)
            </div>
            <div className="mb-4 text-[10px] text-[#8F9FB3]">
              Dzikir pilihan sesuai waktu & kondisi Anda.
            </div>
            <div className="mb-4 flex items-center justify-between px-2 text-[10px]">
              <div className="text-center">
                <div className="mx-auto mb-1 flex h-6 w-6 items-center justify-center rounded bg-emerald-500/20 text-emerald-400">
                  <Sun className="h-3 w-3" />
                </div>
                Pagi
                <br />
                <span className="text-[8px] text-[#8F9FB3]">5 dzikir</span>
              </div>
              <div className="w-4 border-t border-dashed border-white/10" />
              <div className="text-center opacity-50">
                <div className="mx-auto mb-1 flex h-6 w-6 items-center justify-center rounded bg-white/5 text-[#8F9FB3]">
                  <Sun className="h-3 w-3" />
                </div>
                Siang
                <br />
                <span className="text-[8px]">4 dzikir</span>
              </div>
              <div className="w-4 border-t border-dashed border-white/10" />
              <div className="text-center opacity-50">
                <div className="mx-auto mb-1 flex h-6 w-6 items-center justify-center rounded bg-orange-500/10 text-orange-400">
                  <Moon className="h-3 w-3" />
                </div>
                Sore
                <br />
                <span className="text-[8px]">6 dzikir</span>
              </div>
              <div className="w-4 border-t border-dashed border-white/10" />
              <div className="text-center opacity-50">
                <div className="mx-auto mb-1 flex h-6 w-6 items-center justify-center rounded bg-purple-500/10 text-purple-400">
                  <Moon className="h-3 w-3" />
                </div>
                Malam
                <br />
                <span className="text-[8px]">6 dzikir</span>
              </div>
            </div>
            <button className="w-full rounded border border-white/10 py-1.5 text-[9px] font-bold tracking-widest text-white transition-colors hover:bg-white/5">
              LIHAT JADWAL SUMBER
            </button>
          </div>

          <div className="rounded-xl border border-white/5 bg-[#040C1A] p-4">
            <div className="mb-3 text-[9px] font-bold tracking-widest text-blue-400 uppercase">
              PANDUAN PEMULA
            </div>
            <div className="mb-4 text-[10px] text-[#8F9FB3]">
              Mulai perjalanan dzikir Anda dengan panduan lengkap.
            </div>
            <div className="mb-4 grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2 text-[9px] text-white">
                <BookOpen className="h-3.5 w-3.5 text-blue-400" /> Cara Memulai
                Dzikir
              </div>
              <div className="flex items-center gap-2 text-[9px] text-white">
                <Star className="h-3.5 w-3.5 text-amber-400" /> Tips Istiqomah
              </div>
              <div className="flex items-center gap-2 text-[9px] text-white">
                <Clock className="h-3.5 w-3.5 text-emerald-400" /> Adab & Waktu
                Terbaik
              </div>
              <div className="flex items-center gap-2 text-[9px] text-white">
                <Target className="h-3.5 w-3.5 text-purple-400" /> Menghafal
                Dzikir
              </div>
            </div>
            <button className="w-full rounded border border-white/10 py-1.5 text-[9px] font-bold tracking-widest text-white transition-colors hover:bg-white/5">
              LIHAT PANDUAN
            </button>
          </div>

          <div className="relative flex flex-col justify-center overflow-hidden rounded-xl border border-white/5 bg-[#040C1A] p-4">
            <div className="absolute inset-0 bg-blue-500/5" />
            <div className="pointer-events-none absolute top-0 right-0 h-32 w-32 rounded-full bg-blue-500/10 blur-[50px]" />
            <div className="relative z-10 mb-3 text-[9px] font-bold tracking-widest text-blue-400 uppercase">
              TADABBUR HARIAN
            </div>
            <div className="relative z-10 mb-4 px-4 text-center">
              <p className="mb-2 text-[11px] leading-relaxed text-white italic">
                "Ingatlah, hanya dengan mengingat Allah hati menjadi tenteram."
              </p>
              <p className="text-[8px] text-[#8F9FB3]">(QS. Ar-Ra'd: 28)</p>
            </div>
            <button className="relative z-10 mt-auto w-full rounded border border-white/10 py-1.5 text-[9px] font-bold tracking-widest text-white transition-colors hover:bg-white/5">
              LIHAT TADABBUR LENGKAP
            </button>
          </div>

          <div className="flex flex-col rounded-xl border border-white/5 bg-[#040C1A] p-4">
            <div className="mb-3 text-[9px] font-bold tracking-widest text-blue-400 uppercase">
              INTEGRASI & EKSPOR
            </div>
            <div className="mb-4 text-[10px] text-[#8F9FB3]">
              Sinkronkan, bagikan, atau ekspor koleksi dzikir Anda.
            </div>
            <div className="grid flex-1 grid-cols-3 items-center gap-2">
              <div className="flex cursor-pointer flex-col items-center gap-1.5 rounded bg-white/5 p-2 transition-colors hover:bg-white/10">
                <Download className="h-4 w-4 text-blue-400" />
                <span className="text-center text-[8px] text-white">
                  Sinkronisasi
                  <br />
                  Cloud
                </span>
              </div>
              <div className="flex cursor-pointer flex-col items-center gap-1.5 rounded bg-white/5 p-2 transition-colors hover:bg-white/10">
                <Smartphone className="h-4 w-4 text-emerald-400" />
                <span className="text-center text-[8px] text-white">
                  Bagikan
                  <br />
                  QR / Link
                </span>
              </div>
              <div className="flex cursor-pointer flex-col items-center gap-1.5 rounded bg-white/5 p-2 transition-colors hover:bg-white/10">
                <Printer className="h-4 w-4 text-amber-400" />
                <span className="text-center text-[8px] text-white">
                  Ekspor
                  <br />
                  PDF / TXT
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
