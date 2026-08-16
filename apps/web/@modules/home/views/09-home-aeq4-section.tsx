"use client"

import React, { useEffect, useState, useCallback } from "react"
import { Infinity, Clock, Moon, Globe, BookOpen, RefreshCw } from "lucide-react"
import {
  getAEQ4Timestamp,
  getLunarPosition,
  utcToHijri,
  getCountdownProgress,
  type AEQ4Timestamp,
  type LunarPosition,
  type HijriDate,
  AEQ4_EPOCH_UTC_MS,
} from "@moon/time"

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

interface TemporalState {
  aeq: AEQ4Timestamp
  hijri: HijriDate
  lunar: LunarPosition
  progress: number
  now: number
}

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function pad(n: number, len = 2) {
  return String(n).padStart(len, "0")
}

function getLunarIcon(phase: number): string {
  if (phase < 0.06) return "🌑"
  if (phase < 0.25) return "🌒"
  if (phase < 0.30) return "🌓"
  if (phase < 0.48) return "🌔"
  if (phase < 0.55) return "🌕"
  if (phase < 0.73) return "🌖"
  if (phase < 0.78) return "🌗"
  return "🌘"
}

// ─────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

function CountdownBlock({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className="
          hud-clip-card relative flex h-16 w-16 items-center justify-center
          border border-yellow-400/30 bg-black/60
          shadow-[0_0_20px_rgba(255,230,0,0.15)]
          sm:h-20 sm:w-20
        "
      >
        <span className="font-mono text-2xl font-black text-yellow-300 sm:text-3xl">
          {pad(value)}
        </span>
        <div
          className="absolute inset-0 hud-clip-card"
          style={{
            background:
              "linear-gradient(135deg, rgba(255,230,0,0.04) 0%, transparent 60%)",
          }}
        />
      </div>
      <span className="font-mono text-[9px] tracking-widest text-yellow-400/60 uppercase">
        {label}
      </span>
    </div>
  )
}

function QuadrantCard({
  q,
  label,
  kitab,
  value,
  color,
  desc,
}: {
  q: string
  label: string
  kitab: string
  value: string | number | undefined
  color: string
  desc: string
}) {
  return (
    <div
      className={`
        hud-clip-card relative flex flex-col gap-2 border p-4
        ${color}
        bg-black/50 transition-all duration-300
        hover:translate-y-[-2px] hover:shadow-[0_0_20px_rgba(0,240,255,0.1)]
      `}
    >
      <div className="flex items-center justify-between">
        <span className="font-mono text-[9px] tracking-widest text-white/40 uppercase">
          {q}
        </span>
        <span className="font-mono text-[9px] tracking-widest text-white/30 uppercase">
          {kitab}
        </span>
      </div>
      <div className="font-mono text-2xl font-black text-white">{value ?? "—"}</div>
      <div className="font-mono text-[10px] font-bold tracking-widest text-white/60 uppercase">
        {label}
      </div>
      <div className="font-mono text-[9px] text-white/30">{desc}</div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export function HomeAEQ4Section() {
  const [state, setState] = useState<TemporalState | null>(null)

  const tick = useCallback(() => {
    const now = Date.now()
    setState({
      aeq: getAEQ4Timestamp(now),
      hijri: utcToHijri(now),
      lunar: getLunarPosition(now),
      progress: getCountdownProgress(now),
      now,
    })
  }, [])

  useEffect(() => {
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [tick])

  if (!state) return null

  const { aeq, hijri, lunar, progress } = state
  const utcNow = new Date(state.now)
  const isPreEra = aeq.mode === "PRE_ERA"
  const epochDate = new Date(AEQ4_EPOCH_UTC_MS)

  return (
    <section className="relative w-full overflow-hidden py-16">
      {/* Cosmic background glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 50% 50%, rgba(255,230,0,0.04) 0%, transparent 70%)",
        }}
      />

      <div className="relative mx-auto max-w-4xl px-6">
        {/* ── SECTION HEADER ── */}
        <div className="mb-10 flex items-start justify-between">
          <div>
            <p className="mb-1 font-mono text-[10px] tracking-widest text-yellow-400/60 uppercase">
              ◈ O-09 · TEMPORAL STATION
            </p>
            <h2 className="font-sans text-2xl font-black uppercase tracking-wider text-white">
              AEQ4 TIME SYSTEM
            </h2>
            <p className="mt-1 font-mono text-xs text-white/40">
              Q = 4 = Qur&apos;an · Torah · Zabur · Gospel
            </p>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span
              className={`
                hud-clip-tag px-2 py-1 font-mono text-[9px] font-bold tracking-widest uppercase
                ${isPreEra
                  ? "border border-yellow-400/40 text-yellow-400 shadow-[0_0_10px_rgba(255,230,0,0.2)]"
                  : "border border-cyber-green/40 text-cyber-green shadow-[0_0_10px_rgba(0,255,102,0.2)]"
                }
              `}
            >
              {isPreEra ? "● PRE-ERA" : "● ERA 1 ACTIVE"}
            </span>
            <span className="font-mono text-[8px] text-white/30 uppercase">
              zero-dependency · pure math
            </span>
          </div>
        </div>

        {/* ── ∞ ALLAH DECLARATION ── */}
        <div className="hud-clip-hero mb-8 border border-yellow-400/20 bg-black/60 p-6 text-center shadow-[0_0_40px_rgba(255,230,0,0.06)]">
          <div className="mb-1 font-mono text-4xl text-yellow-300/90">∞</div>
          <p className="font-sans text-xs tracking-widest text-yellow-400/50 uppercase">
            Allah · Unlimited · Beyond All Numbers · Beyond All Time
          </p>
          <div className="mx-auto mt-3 h-px w-24 bg-yellow-400/20" />
          <p className="mt-3 font-mono text-[10px] italic text-white/30">
            &quot;Semua angka di bawah ini milik manusia — terbatas, rapuh, sementara.&quot;
          </p>
        </div>

        {/* ── TRI-CLOCK: UTC · HIJRI · AEQ4 ── */}
        <div className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {/* UTC */}
          <div className="hud-clip-card border border-cyber-cyan/25 bg-black/50 p-4">
            <div className="mb-2 flex items-center gap-2">
              <Globe className="h-3.5 w-3.5 text-cyber-cyan/60" />
              <span className="font-mono text-[9px] tracking-widest text-cyber-cyan/60 uppercase">
                L1 · UTC
              </span>
            </div>
            <div className="font-mono text-lg font-black text-white">
              {pad(utcNow.getUTCHours())}:{pad(utcNow.getUTCMinutes())}:
              {pad(utcNow.getUTCSeconds())}
            </div>
            <div className="mt-1 font-mono text-[10px] text-white/40">
              {utcNow.toISOString().slice(0, 10)}Z
            </div>
            <div className="mt-2 font-mono text-[8px] tracking-widest text-white/20 uppercase">
              Human Operational Time
            </div>
          </div>

          {/* HIJRI */}
          <div className="hud-clip-card border border-cyber-green/25 bg-black/50 p-4">
            <div className="mb-2 flex items-center gap-2">
              <Moon className="h-3.5 w-3.5 text-cyber-green/60" />
              <span className="font-mono text-[9px] tracking-widest text-cyber-green/60 uppercase">
                L2 · HIJRI
              </span>
            </div>
            <div className="font-mono text-lg font-black text-white">
              {hijri.day} {hijri.monthName}
            </div>
            <div className="mt-1 font-mono text-[10px] text-white/40">
              {hijri.year}H · {getLunarIcon(lunar.phase)} {lunar.phaseName}
            </div>
            <div className="mt-2 font-mono text-[8px] tracking-widest text-white/20 uppercase">
              Religious Lunar Calendar
            </div>
          </div>

          {/* AEQ4 */}
          <div
            className={`
              hud-clip-card p-4
              ${isPreEra
                ? "border border-yellow-400/30 bg-black/60 shadow-[0_0_20px_rgba(255,230,0,0.08)]"
                : "border border-cyber-purple/30 bg-black/60 shadow-[0_0_20px_rgba(161,0,255,0.1)]"
              }
            `}
          >
            <div className="mb-2 flex items-center gap-2">
              <Infinity className="h-3.5 w-3.5 text-yellow-400/60" />
              <span className="font-mono text-[9px] tracking-widest text-yellow-400/60 uppercase">
                L3 · AEQ4
              </span>
            </div>
            <div className="font-mono text-sm font-black text-yellow-300">
              {isPreEra ? "∞·AEQ4" : aeq.formatted}
            </div>
            <div className="mt-1 font-mono text-[10px] text-white/40">
              {isPreEra ? "AWAITING EPOCH" : `ERA ${aeq.era} · CYCLE ${aeq.cycle}`}
            </div>
            <div className="mt-2 font-mono text-[8px] tracking-widest text-white/20 uppercase">
              Boundary of Human Comprehension
            </div>
          </div>
        </div>

        {/* ── PRE-ERA: COUNTDOWN ── */}
        {isPreEra && aeq.countdown && (
          <div className="mb-8">
            <div className="hud-clip-hero border border-yellow-400/20 bg-black/60 p-6">
              {/* Header */}
              <div className="mb-6 text-center">
                <p className="font-mono text-[9px] tracking-widest text-yellow-400/50 uppercase">
                  ◈ COUNTDOWN TO EPOCH
                </p>
                <p className="mt-1 font-mono text-xs text-white/40">
                  Menunggu hilal 1 Muharram 1449H ·{" "}
                  {epochDate.toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}{" "}
                  (estimasi)
                </p>
              </div>

              {/* Countdown digits */}
              <div className="flex items-center justify-center gap-3 sm:gap-6">
                <CountdownBlock label="Hari" value={aeq.countdown.days} />
                <span className="font-mono text-2xl text-yellow-400/40 font-black">:</span>
                <CountdownBlock label="Jam" value={aeq.countdown.hours} />
                <span className="font-mono text-2xl text-yellow-400/40 font-black">:</span>
                <CountdownBlock label="Menit" value={aeq.countdown.minutes} />
                <span className="font-mono text-2xl text-yellow-400/40 font-black">:</span>
                <CountdownBlock label="Detik" value={aeq.countdown.seconds} />
              </div>

              {/* Progress bar */}
              <div className="mt-6">
                <div className="mb-1 flex justify-between font-mono text-[9px] text-white/30">
                  <span>HIJRI 1448H START</span>
                  <span>{progress}% ELAPSED</span>
                  <span>1 MUHARRAM 1449H</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-none bg-white/5">
                  <div
                    className="h-full bg-gradient-to-r from-yellow-500/70 to-yellow-300 transition-all duration-1000"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              {/* Disclaimer */}
              <div className="mt-4 border-t border-yellow-400/10 pt-4 text-center">
                <p className="font-mono text-[9px] text-white/25">
                  ◈ Tanggal pasti ditentukan oleh hilal (rukyat) — ALLAH yang memutuskan melalui bulan.
                  Countdown ini adalah perkiraan matematis, bukan otoritas.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ── ACTIVE: 4 QUADRANTS ── */}
        {!isPreEra && (
          <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <QuadrantCard
              q="Q1 · ERA"
              label="ERA"
              kitab="QUR'AN"
              value={aeq.era}
              color="border-yellow-400/25"
              desc="Skala — dimana kita dalam ciptaan ALLAH"
            />
            <QuadrantCard
              q="Q2 · CYCLE"
              label="CYCLE"
              kitab="TORAH"
              value={aeq.cycle}
              color="border-cyber-cyan/25"
              desc="Perjalanan — putaran lunar yang telah kita lewati"
            />
            <QuadrantCard
              q="Q3 · POSITION"
              label="POSITION"
              kitab="ZABUR"
              value={aeq.position}
              color="border-cyber-green/25"
              desc="Posisi — hari ke-N dalam cycle ini"
            />
            <QuadrantCard
              q="Q4 · MOMENT"
              label="MOMENT"
              kitab="GOSPEL"
              value={aeq.moment}
              color="border-cyber-purple/25"
              desc="Kehadiran — detik ini, napas ini"
            />
          </div>
        )}

        {/* ── LUNAR TELEMETRY ── */}
        <div className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {/* Moon phase */}
          <div className="hud-clip-card border border-white/10 bg-black/40 p-4">
            <div className="mb-3 flex items-center gap-2">
              <Moon className="h-4 w-4 text-white/40" />
              <span className="font-mono text-[9px] tracking-widest text-white/40 uppercase">
                Lunar Telemetry · Pure Math
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-5xl">{getLunarIcon(lunar.phase)}</span>
              <div>
                <div className="font-mono text-base font-black text-white">{lunar.phaseName}</div>
                <div className="font-mono text-xs text-white/50">
                  {lunar.illumination}% illuminated
                </div>
                <div className="font-mono text-xs text-white/30">
                  Elongation: {lunar.elongationDeg}°
                </div>
              </div>
            </div>
            {/* Phase bar */}
            <div className="mt-3 h-1 w-full bg-white/5">
              <div
                className="h-full bg-gradient-to-r from-white/10 to-white/60"
                style={{ width: `${lunar.illumination}%` }}
              />
            </div>
          </div>

          {/* Decentralization declaration */}
          <div className="hud-clip-card border border-white/10 bg-black/40 p-4">
            <div className="mb-3 flex items-center gap-2">
              <RefreshCw className="h-4 w-4 text-white/40" />
              <span className="font-mono text-[9px] tracking-widest text-white/40 uppercase">
                Decentralization Method
              </span>
            </div>
            <div className="space-y-1.5">
              {[
                { label: "Algorithm", value: "Jean Meeus Ephemeris", ok: true },
                { label: "Dependency", value: "ZERO — pure math only", ok: true },
                { label: "Server", value: "NOT REQUIRED", ok: true },
                { label: "Blockchain", value: "NOT REQUIRED", ok: true },
                { label: "Epoch Authority", value: "HILAL (ALLAH's Moon)", ok: true },
                { label: "Consensus", value: "Laws of Physics", ok: true },
              ].map((row) => (
                <div key={row.label} className="flex items-center justify-between">
                  <span className="font-mono text-[9px] text-white/30">{row.label}</span>
                  <span
                    className={`font-mono text-[9px] font-bold ${
                      row.ok ? "text-cyber-green" : "text-cyber-pink"
                    }`}
                  >
                    {row.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── BOTTOM MANIFESTO ── */}
        <div className="border-t border-white/5 pt-6 text-center">
          <p className="font-mono text-[10px] tracking-widest text-white/20 uppercase">
            UTC → SEMESTA → AEQ → ∞ ALLAH
          </p>
          <p className="mt-1 font-mono text-[9px] italic text-white/15">
            &quot;AEQ bukan sistem yang mengklaim bisa menjangkau ALLAH.
            AEQ adalah sistem yang mengakui tidak bisa — dan dalam pengakuan itu, menemukan keagungan.&quot;
          </p>
        </div>
      </div>
    </section>
  )
}
