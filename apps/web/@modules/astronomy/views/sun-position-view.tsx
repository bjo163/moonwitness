"use client"

import React, { useEffect, useState, useCallback, useRef } from "react"
import {
  Sun,
  Clock,
  MapPin,
  Sunrise,
  Sunset,
  Sparkles,
  Target,
  ArrowUp,
  AlertTriangle,
} from "lucide-react"

// ── Types ──────────────────────────────────────────────────────────

interface SunPositionResponse {
  timestamp: string
  coordinates: { lat: number; lng: number }
  sunPosition: {
    altitude: number
    azimuth: number
    declination: number
    isAboveHorizon: boolean
    positionLabel: string
  }
  duhaTime: {
    isyraq: string
    isyraqFormatted: string
    zawal: string
    zawalFormatted: string
    afdhal: string
    afdhalFormatted: string
    currentProgress: number
    isInDuhaWindow: boolean
    status: "BEFORE" | "ACTIVE" | "AFDHAL_ZONE" | "ENDED"
    totalDurationMinutes: number
    remainingMinutes: number
  }
  prayerContext: {
    sunrise: string
    dhuhr: string
  }
}

type GeoState = {
  lat: number | null
  lng: number | null
  loading: boolean
  error: string | null
}

// ── Helpers ────────────────────────────────────────────────────────

const STATUS_CONFIG = {
  BEFORE: {
    label: "MENUNGGU DUHA",
    color: "text-zinc-400",
    bg: "bg-zinc-500/10",
    border: "border-zinc-500/30",
    glow: "",
    desc: "Waktu Duha belum masuk. Tunggu setelah Isyraq.",
  },
  ACTIVE: {
    label: "WAKTU DUHA",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/30",
    glow: "shadow-[0_0_20px_rgba(52,211,153,0.3)]",
    desc: "Waktu Duha sudah masuk. Sholat Duha boleh ditunaikan.",
  },
  AFDHAL_ZONE: {
    label: "WAKTU AFDHAL ✦",
    color: "text-amber-400",
    bg: "bg-amber-500/15",
    border: "border-amber-500/50",
    glow: "shadow-[0_0_30px_rgba(251,191,36,0.4)]",
    desc: "Waktu terbaik Sholat Duha — saat panas terik mulai terasa.",
  },
  ENDED: {
    label: "DUHA SELESAI",
    color: "text-rose-400",
    bg: "bg-rose-500/10",
    border: "border-rose-500/30",
    glow: "",
    desc: "Waktu Duha telah berakhir. Akan kembali besok insyaAllah.",
  },
}

// ── Solar Arc SVG ──────────────────────────────────────────────────

function SolarArc({
  altitude,
  azimuth,
  progress,
  isAboveHorizon,
  status,
}: {
  altitude: number
  azimuth: number
  progress: number
  isAboveHorizon: boolean
  status: string
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    const w = 400
    const h = 220
    canvas.width = w * dpr
    canvas.height = h * dpr
    canvas.style.width = `${w}px`
    canvas.style.height = `${h}px`
    ctx.scale(dpr, dpr)

    // Clear
    ctx.clearRect(0, 0, w, h)

    const cx = w / 2
    const horizonY = h - 40
    const arcRadius = 150

    // ── Horizon line ──
    ctx.strokeStyle = "rgba(255, 255, 255, 0.1)"
    ctx.lineWidth = 1
    ctx.setLineDash([4, 4])
    ctx.beginPath()
    ctx.moveTo(20, horizonY)
    ctx.lineTo(w - 20, horizonY)
    ctx.stroke()
    ctx.setLineDash([])

    // Labels
    ctx.fillStyle = "rgba(255, 255, 255, 0.3)"
    ctx.font = "10px monospace"
    ctx.textAlign = "left"
    ctx.fillText("E", 25, horizonY + 15)
    ctx.textAlign = "right"
    ctx.fillText("W", w - 25, horizonY + 15)
    ctx.textAlign = "center"
    ctx.fillText("HORIZON", cx, horizonY + 15)

    // ── Solar Arc Path (semicircle from E to W) ──
    const arcGrad = ctx.createLinearGradient(cx - arcRadius, 0, cx + arcRadius, 0)
    arcGrad.addColorStop(0, "rgba(251, 191, 36, 0.05)")
    arcGrad.addColorStop(0.3, "rgba(251, 191, 36, 0.15)")
    arcGrad.addColorStop(0.5, "rgba(251, 191, 36, 0.25)")
    arcGrad.addColorStop(0.7, "rgba(251, 191, 36, 0.15)")
    arcGrad.addColorStop(1, "rgba(251, 191, 36, 0.05)")

    ctx.strokeStyle = arcGrad
    ctx.lineWidth = 1.5
    ctx.beginPath()
    ctx.arc(cx, horizonY, arcRadius, Math.PI, 0)
    ctx.stroke()

    // ── Duha zone highlight (from ~15% to 100% of arc) ──
    if (status !== "ENDED") {
      // Duha window roughly maps to the middle portion of the arc
      const duhaStart = Math.PI * 0.85 // ~15min after sunrise
      const duhaEnd = Math.PI * 0.5 // noon (top of arc)

      ctx.strokeStyle = "rgba(52, 211, 153, 0.3)"
      ctx.lineWidth = 6
      ctx.beginPath()
      ctx.arc(cx, horizonY, arcRadius, duhaStart, duhaEnd, true)
      ctx.stroke()

      // Afdhal zone highlight (¾ mark)
      const afdhalStart = Math.PI * 0.59
      const afdhalEnd = Math.PI * 0.5
      ctx.strokeStyle = "rgba(251, 191, 36, 0.4)"
      ctx.lineWidth = 8
      ctx.beginPath()
      ctx.arc(cx, horizonY, arcRadius, afdhalStart, afdhalEnd, true)
      ctx.stroke()
    }

    // ── Sun position dot ──
    if (isAboveHorizon) {
      // Map altitude (0-90) to arc angle (PI to 0)
      const sunAngle = Math.PI * (1 - altitude / 90)
      const sunX = cx + arcRadius * Math.cos(sunAngle)
      const sunY = horizonY - arcRadius * Math.sin(sunAngle)

      // Glow
      const glowGrad = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, 30)
      glowGrad.addColorStop(0, "rgba(251, 191, 36, 0.6)")
      glowGrad.addColorStop(0.5, "rgba(251, 191, 36, 0.15)")
      glowGrad.addColorStop(1, "rgba(251, 191, 36, 0)")
      ctx.fillStyle = glowGrad
      ctx.beginPath()
      ctx.arc(sunX, sunY, 30, 0, Math.PI * 2)
      ctx.fill()

      // Core dot
      ctx.fillStyle = status === "AFDHAL_ZONE" ? "#fbbf24" : "#fcd34d"
      ctx.beginPath()
      ctx.arc(sunX, sunY, 6, 0, Math.PI * 2)
      ctx.fill()

      // Outer ring
      ctx.strokeStyle = "rgba(251, 191, 36, 0.8)"
      ctx.lineWidth = 1.5
      ctx.beginPath()
      ctx.arc(sunX, sunY, 10, 0, Math.PI * 2)
      ctx.stroke()

      // Altitude label
      ctx.fillStyle = "#fbbf24"
      ctx.font = "bold 11px monospace"
      ctx.textAlign = "center"
      ctx.fillText(`${altitude.toFixed(1)}°`, sunX, sunY - 18)
    }

    // ── Zenith marker ──
    ctx.fillStyle = "rgba(255, 255, 255, 0.2)"
    ctx.font = "9px monospace"
    ctx.textAlign = "center"
    ctx.fillText("ZENITH (90°)", cx, horizonY - arcRadius - 10)

    // Small cross at zenith
    ctx.strokeStyle = "rgba(255, 255, 255, 0.15)"
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(cx - 4, horizonY - arcRadius)
    ctx.lineTo(cx + 4, horizonY - arcRadius)
    ctx.moveTo(cx, horizonY - arcRadius - 4)
    ctx.lineTo(cx, horizonY - arcRadius + 4)
    ctx.stroke()
  }, [altitude, azimuth, progress, isAboveHorizon, status])

  return (
    <canvas
      ref={canvasRef}
      className="mx-auto"
      style={{ width: 400, height: 220 }}
    />
  )
}

// ── Duha Progress Bar ──────────────────────────────────────────────

function DuhaProgressBar({
  progress,
  status,
  isyraq,
  afdhal,
  zawal,
}: {
  progress: number
  status: string
  isyraq: string
  afdhal: string
  zawal: string
}) {
  const afdhalPos = 75 // ¾ mark

  return (
    <div className="space-y-2">
      {/* Time labels */}
      <div className="flex justify-between font-mono text-[10px]">
        <span className="text-emerald-400/70">ISYRAQ {isyraq}</span>
        <span className="text-amber-400/70">AFDHAL {afdhal}</span>
        <span className="text-rose-400/70">ZAWAL {zawal}</span>
      </div>

      {/* Progress bar */}
      <div className="relative h-3 rounded-full bg-black/60 border border-white/10 overflow-hidden">
        {/* Duha active zone */}
        <div
          className="absolute inset-y-0 left-0 rounded-full transition-all duration-1000 ease-linear"
          style={{
            width: `${Math.min(progress, 100)}%`,
            background:
              status === "AFDHAL_ZONE"
                ? "linear-gradient(90deg, rgba(52,211,153,0.6) 0%, rgba(251,191,36,0.8) 70%, rgba(251,191,36,1) 100%)"
                : status === "ACTIVE"
                  ? "linear-gradient(90deg, rgba(52,211,153,0.4) 0%, rgba(52,211,153,0.8) 100%)"
                  : status === "ENDED"
                    ? "linear-gradient(90deg, rgba(107,114,128,0.3) 0%, rgba(107,114,128,0.5) 100%)"
                    : "rgba(63, 63, 70, 0.3)",
          }}
        />

        {/* Afdhal marker line */}
        <div
          className="absolute inset-y-0 w-0.5 bg-amber-400/80"
          style={{ left: `${afdhalPos}%` }}
        />

        {/* Current position indicator */}
        {progress > 0 && progress < 100 && (
          <div
            className="absolute top-1/2 -translate-y-1/2 h-4 w-4 rounded-full border-2 border-white bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.8)] transition-all duration-1000 ease-linear"
            style={{ left: `calc(${progress}% - 8px)` }}
          />
        )}
      </div>

      {/* Progress percentage */}
      <div className="flex justify-between items-center">
        <span className="font-mono text-[10px] text-white/40">0%</span>
        <span className="font-mono text-xs font-bold text-white/60">
          {progress.toFixed(1)}%
        </span>
        <span className="font-mono text-[10px] text-white/40">100%</span>
      </div>
    </div>
  )
}

// ── Stat Card ──────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  unit,
  icon: Icon,
  color = "text-amber-400",
}: {
  label: string
  value: string | number
  unit?: string
  icon: React.ComponentType<{ className?: string }>
  color?: string
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/40 p-4 backdrop-blur-xl">
      <div className="flex items-center justify-between mb-2">
        <span className="font-mono text-[10px] font-bold tracking-wider text-white/50 uppercase">
          {label}
        </span>
        <Icon className={`h-4 w-4 ${color}/60`} />
      </div>
      <div className="font-mono text-xl font-black text-white tabular-nums">
        {value}
        {unit && (
          <span className="ml-1 text-xs font-normal text-white/40">{unit}</span>
        )}
      </div>
    </div>
  )
}

// ── Main View ──────────────────────────────────────────────────────

export function SunPositionView() {
  const [data, setData] = useState<SunPositionResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [currentTime, setCurrentTime] = useState(new Date())
  const [geo, setGeo] = useState<GeoState>({
    lat: null,
    lng: null,
    loading: true,
    error: null,
  })

  // Get geolocation
  useEffect(() => {
    if (typeof window === "undefined" || !("geolocation" in navigator)) {
      setGeo({ lat: -6.2088, lng: 106.8456, loading: false, error: "Not supported" })
      return
    }

    const cached = localStorage.getItem("mw_last_location")
    if (cached) {
      try {
        const { lat, lng, timestamp } = JSON.parse(cached)
        if (Date.now() - timestamp < 86400000) {
          setGeo({ lat, lng, loading: false, error: null })
        }
      } catch {}
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude
        const lng = pos.coords.longitude
        localStorage.setItem("mw_last_location", JSON.stringify({ lat, lng, timestamp: Date.now() }))
        setGeo({ lat, lng, loading: false, error: null })
      },
      () => {
        setGeo({ lat: -6.2088, lng: 106.8456, loading: false, error: "Permission denied" })
      },
      { timeout: 5000, enableHighAccuracy: false, maximumAge: 3600000 }
    )
  }, [])

  // Clock tick
  useEffect(() => {
    const t = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  // Fetch data
  const fetchData = useCallback(async () => {
    if (geo.loading || !geo.lat) return
    try {
      setLoading(true)
      const res = await fetch(`/api/sun-position?lat=${geo.lat}&lng=${geo.lng}`)
      if (!res.ok) throw new Error("Failed to fetch sun position")
      const json = await res.json()
      setData(json)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [geo.lat, geo.lng, geo.loading])

  useEffect(() => {
    fetchData()
    // Refresh every 30 seconds
    const interval = setInterval(fetchData, 30000)
    return () => clearInterval(interval)
  }, [fetchData])

  // Loading state
  if (loading && !data) {
    return (
      <div className="space-y-6 p-6 sm:p-8">
        <div className="flex flex-col gap-2">
          <div className="h-8 w-64 animate-pulse rounded bg-amber-500/20" />
          <div className="h-4 w-96 animate-pulse rounded bg-amber-500/10" />
        </div>
        <div className="h-60 w-full animate-pulse rounded-2xl border border-amber-500/20 bg-black/40" />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-xl bg-black/40 border border-white/5" />
          ))}
        </div>
      </div>
    )
  }

  // Error state
  if (error && !data) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-16 text-rose-400">
        <AlertTriangle className="h-10 w-10" />
        <p className="font-mono text-sm">{error}</p>
        <button
          onClick={fetchData}
          className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-4 py-2 font-mono text-xs text-rose-400 hover:bg-rose-500/20 transition-colors"
        >
          RETRY
        </button>
      </div>
    )
  }

  if (!data) return null

  const { sunPosition, duhaTime, prayerContext } = data
  const statusCfg = STATUS_CONFIG[duhaTime.status]

  // Format countdown
  const countdownStr =
    duhaTime.status === "BEFORE"
      ? (() => {
          const isyraqDate = new Date(duhaTime.isyraq)
          const diff = isyraqDate.getTime() - currentTime.getTime()
          if (diff <= 0) return "00:00"
          const m = Math.floor(diff / 60000)
          const s = Math.floor((diff % 60000) / 1000)
          return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`
        })()
      : duhaTime.status === "ENDED"
        ? "00:00"
        : (() => {
            const zawalDate = new Date(duhaTime.zawal)
            const diff = zawalDate.getTime() - currentTime.getTime()
            if (diff <= 0) return "00:00"
            const h = Math.floor(diff / 3600000)
            const m = Math.floor((diff % 3600000) / 60000)
            const s = Math.floor((diff % 60000) / 1000)
            return h > 0
              ? `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`
              : `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`
          })()

  return (
    <div className="space-y-6 p-6 sm:p-8">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="flex items-center gap-3 text-2xl font-black tracking-widest text-white uppercase sm:text-3xl">
          <Sun className="h-7 w-7 text-amber-400 sm:h-8 sm:w-8" />
          Sun Position & Duha
        </h1>
        <p className="font-mono text-xs text-amber-500/70 sm:text-sm">
          Kalkulasi posisi matahari real-time dan panduan waktu terbaik Sholat
          Duha berdasarkan lokasi GPS Anda.
        </p>
        <p className="flex items-center gap-1 font-mono text-[10px] text-white/40">
          <MapPin className="h-3 w-3" />
          {geo.lat?.toFixed(4)}, {geo.lng?.toFixed(4)}
          {geo.error && <span className="ml-1 text-amber-500/50">(default JKT)</span>}
        </p>
      </div>

      {/* Status Banner */}
      <div
        className={`relative overflow-hidden rounded-2xl border ${statusCfg.border} ${statusCfg.bg} p-5 backdrop-blur-xl ${statusCfg.glow} transition-all duration-500`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {duhaTime.status === "AFDHAL_ZONE" ? (
              <Sparkles className="h-6 w-6 text-amber-400 animate-pulse" />
            ) : (
              <Target className="h-6 w-6 text-white/40" />
            )}
            <div>
              <div
                className={`font-mono text-sm font-black tracking-widest ${statusCfg.color}`}
              >
                {statusCfg.label}
              </div>
              <p className="font-mono text-[10px] text-white/50 mt-0.5">
                {statusCfg.desc}
              </p>
            </div>
          </div>

          {/* Countdown */}
          <div className="text-right">
            <div className="font-mono text-[10px] text-white/40">
              {duhaTime.status === "BEFORE"
                ? "T-MINUS ISYRAQ"
                : duhaTime.status === "ENDED"
                  ? "COMPLETED"
                  : "REMAINING"}
            </div>
            <div className="font-mono text-2xl font-black tabular-nums text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">
              {countdownStr}
            </div>
          </div>
        </div>

        {/* Hadits reference */}
        {(duhaTime.status === "ACTIVE" || duhaTime.status === "AFDHAL_ZONE") && (
          <div className="mt-4 border-t border-white/5 pt-3">
            <p className="font-arabic text-right text-base leading-loose text-amber-200/80">
              حِينَ تَرْمَضُ الْفِصَالُ
            </p>
            <p className="font-mono text-[10px] text-white/40 italic mt-1">
              &quot;Ketika anak unta terbakar kakinya oleh panasnya pasir&quot; —
              HR. Muslim
            </p>
          </div>
        )}
      </div>

      {/* Solar Arc Visualization */}
      <div className="rounded-2xl border border-amber-500/15 bg-black/40 p-5 backdrop-blur-xl">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-mono text-xs font-bold tracking-wider text-amber-400/80 uppercase">
            Solar Arc Trajectory
          </h3>
          <span className="font-mono text-[10px] text-white/30">
            {currentTime.toLocaleTimeString("en-US", { hour12: false })}
          </span>
        </div>

        <div className="flex justify-center overflow-x-auto">
          <SolarArc
            altitude={sunPosition.altitude}
            azimuth={sunPosition.azimuth}
            progress={duhaTime.currentProgress}
            isAboveHorizon={sunPosition.isAboveHorizon}
            status={duhaTime.status}
          />
        </div>
      </div>

      {/* Duha Progress */}
      <div className="rounded-2xl border border-amber-500/15 bg-black/40 p-5 backdrop-blur-xl">
        <h3 className="mb-4 font-mono text-xs font-bold tracking-wider text-amber-400/80 uppercase">
          Duha Window Progress
        </h3>
        <DuhaProgressBar
          progress={duhaTime.currentProgress}
          status={duhaTime.status}
          isyraq={duhaTime.isyraqFormatted}
          afdhal={duhaTime.afdhalFormatted}
          zawal={duhaTime.zawalFormatted}
        />
      </div>

      {/* Telemetry Stats */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
        <StatCard
          label="Altitude"
          value={sunPosition.altitude.toFixed(1)}
          unit="°"
          icon={ArrowUp}
          color="text-amber-400"
        />
        <StatCard
          label="Azimuth"
          value={sunPosition.azimuth.toFixed(1)}
          unit="°"
          icon={Target}
          color="text-cyan-400"
        />
        <StatCard
          label="Status"
          value={sunPosition.positionLabel}
          icon={Sun}
          color="text-amber-400"
        />
        <StatCard
          label="Remaining"
          value={duhaTime.remainingMinutes}
          unit="min"
          icon={Clock}
          color="text-emerald-400"
        />
      </div>

      {/* Time Reference Cards */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
        <div className="flex items-center gap-4 rounded-xl border border-amber-500/10 bg-black/30 p-4 backdrop-blur-xl">
          <Sunrise className="h-5 w-5 shrink-0 text-amber-400/60" />
          <div>
            <div className="font-mono text-[10px] text-white/40 uppercase tracking-wider">
              Sunrise
            </div>
            <div className="font-mono text-sm font-bold text-white tabular-nums">
              {prayerContext.sunrise}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4 rounded-xl border border-emerald-500/10 bg-black/30 p-4 backdrop-blur-xl">
          <Sparkles className="h-5 w-5 shrink-0 text-emerald-400/60" />
          <div>
            <div className="font-mono text-[10px] text-white/40 uppercase tracking-wider">
              Isyraq (Duha Start)
            </div>
            <div className="font-mono text-sm font-bold text-white tabular-nums">
              {duhaTime.isyraqFormatted}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4 rounded-xl border border-rose-500/10 bg-black/30 p-4 backdrop-blur-xl">
          <Sunset className="h-5 w-5 shrink-0 text-rose-400/60" />
          <div>
            <div className="font-mono text-[10px] text-white/40 uppercase tracking-wider">
              Zawal / Dhuhr
            </div>
            <div className="font-mono text-sm font-bold text-white tabular-nums">
              {prayerContext.dhuhr}
            </div>
          </div>
        </div>
      </div>

      {/* Hadits Section */}
      <div className="rounded-2xl border border-amber-500/10 bg-black/30 p-6 backdrop-blur-xl">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="h-4 w-4 text-amber-400/60" />
          <h3 className="font-mono text-xs font-bold tracking-wider text-amber-400/60 uppercase">
            Dalil Sholat Duha
          </h3>
        </div>

        <div className="space-y-4">
          <div className="border-l-2 border-amber-500/30 pl-4">
            <p className="font-arabic text-right text-lg leading-loose text-amber-200/70">
              يُصْبِحُ عَلَى كُلِّ سُلَامَى مِنْ أَحَدِكُمْ صَدَقَةٌ...
              وَيُجْزِئُ مِنْ ذَلِكَ رَكْعَتَانِ يَرْكَعُهُمَا مِنَ
              الضُّحَى
            </p>
            <p className="mt-2 font-sans text-xs text-zinc-400 italic">
              &quot;Setiap ruas tulang dari kalian ada sedekahnya setiap pagi...
              Dan dua rakaat Duha sudah mencukupi semua itu.&quot;
            </p>
            <p className="mt-1 font-mono text-[10px] text-zinc-500">
              — HR. Muslim No. 720
            </p>
          </div>

          <div className="border-l-2 border-amber-500/20 pl-4">
            <p className="font-sans text-xs text-zinc-400 italic">
              &quot;Sholat Duha yang paling utama adalah ketika anak-anak unta
              sudah merasakan panasnya bumi (sepertiga akhir pagi).&quot;
            </p>
            <p className="mt-1 font-mono text-[10px] text-zinc-500">
              — HR. Muslim No. 748
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
