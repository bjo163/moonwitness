"use client"

import React, { useState } from "react"
import { WhisperPanel, MercyButton } from "../components/whisper-panel"
import {
  Infinity,
  Shield,
  BookOpen,
  Layers,
  Star,
  ChevronDown,
  ChevronUp,
  Check,
  Clock,
  AlertTriangle,
  Eye,
  Heart,
  Brain,
  Zap,
  Globe,
  Sparkles,
  ScrollText,
} from "lucide-react"

// ─────────────────────────────────────────────────────────────────────────────
// Q4Q — 8 LEVELS OF CONSCIOUSNESS
// Berdasarkan: Q4Q = Quantum 4 Kitab framework
// ─────────────────────────────────────────────────────────────────────────────

const Q4Q_LEVELS = [
  {
    level: 1, code: "SI-5", name: "Physical Human",
    arabicTerm: "Body / Five Senses",
    icon: Eye, color: "text-slate-400", border: "border-slate-400/30",
    coreQuestion: "What am I experiencing?",
    quranRef: "QS 16:78", torahRef: "Deut 4:28", zaburRef: "Ps 115:5-8", gospelRef: "Mark 7:31-37",
    desc: "Perception through the body and five senses.",
  },
  {
    level: 2, code: "IC-7", name: "Self-Aware Human",
    arabicTerm: "Nafs (Al-Nafs)",
    icon: Heart, color: "text-pink-400", border: "border-pink-400/30",
    coreQuestion: "What do I want? What drives me?",
    quranRef: "QS 91:7-10", torahRef: "Gen 4:7", zaburRef: "Ps 42:5", gospelRef: "Matt 16:26",
    desc: "Awareness of self, desire, emotion, and identity.",
  },
  {
    level: 3, code: "CS-9", name: "Intellectual Human",
    arabicTerm: "'Aql (Al-'Aql)",
    icon: Brain, color: "text-cyber-cyan", border: "border-cyber-cyan/30",
    coreQuestion: "What is true? What is real and right?",
    quranRef: "QS 16:78", torahRef: "Deut 4:6", zaburRef: "Ps 119:34", gospelRef: "Rom 12:2",
    desc: "Thinking, reasoning, understanding, and reflection.",
  },
  {
    level: 4, code: "HM-8", name: "Inner Human",
    arabicTerm: "Qalb (Al-Qalb)",
    icon: Heart, color: "text-red-400", border: "border-red-400/30",
    coreQuestion: "What does this truth mean within me?",
    quranRef: "QS 2:225", torahRef: "Deut 10:12", zaburRef: "Ps 51:10", gospelRef: "Matt 5:8",
    desc: "Conscience, faith, sincerity, inner perception.",
  },
  {
    level: 5, code: "DA-6", name: "God-Conscious Human",
    arabicTerm: "Taqwa (At-Taqwa)",
    icon: Shield, color: "text-cyber-green", border: "border-cyber-green/30",
    coreQuestion: "How should I live before God?",
    quranRef: "QS 2:2", torahRef: "Deut 10:12", zaburRef: "Ps 111:10", gospelRef: "Matt 5:6",
    desc: "God-consciousness, self-restraint, responsibility.",
  },
  {
    level: 6, code: "ES-7", name: "Ihsan Human",
    arabicTerm: "Ihsan (Al-Ihsan)",
    icon: Star, color: "text-yellow-400", border: "border-yellow-400/30",
    coreQuestion: "How can I live beautifully and embody this truth?",
    quranRef: "QS 16:90", torahRef: "Lev 19:18", zaburRef: "Ps 15", gospelRef: "Matt 5:44-48",
    desc: "Excellence in action, compassion, justice, beauty.",
  },
  {
    level: 7, code: "SK-5", name: "Deep-Knowing Human",
    arabicTerm: "Ma'rifah (Al-Ma'rifah)",
    icon: Sparkles, color: "text-cyber-purple", border: "border-cyber-purple/30",
    coreQuestion: "What is the deeper reality behind what I perceive?",
    quranRef: "QS 59:19", torahRef: "Deut 6:4-5", zaburRef: "Ps 46:10", gospelRef: "John 17:3",
    desc: "Wisdom, meaning, deep recognition of reality.",
  },
  {
    level: 8, code: "CU-∞", name: "Cosmic-Aware Human",
    arabicTerm: "Ayat (Ayat Allah)",
    icon: Globe, color: "text-amber-300", border: "border-amber-300/30",
    coreQuestion: "What does creation reveal? What is my role in it?",
    quranRef: "QS 41:53", torahRef: "Gen 1:1-31", zaburRef: "Ps 8:3-4", gospelRef: "Rom 1:20",
    desc: "Universal perspective, unity of creation, stewardship.",
  },
] as const

// ─────────────────────────────────────────────────────────────────────────────
// UPGRADE REQUEST — Form Data Structure
// ─────────────────────────────────────────────────────────────────────────────

type ScriptureTag = "Q" | "T" | "Z" | "G"
type UpgradeStatus = "PROPOSED" | "BRIDGE_REVIEW" | "APPROVED" | "ACTIVE" | "COMPLETE"

interface UpgradeRequest {
  id: string
  title: string
  description: string
  levelFrom: number
  levelTo: number
  scriptureTags: ScriptureTag[]
  scriptureRef: string
  endGoalAlignment: string
  bridgeNote: string
  status: UpgradeStatus
  submittedAt: string
}

// ─────────────────────────────────────────────────────────────────────────────
// STATIC DATA — Upgrade Requests (sesuai Q4Q framework)
// ─────────────────────────────────────────────────────────────────────────────

const UPGRADE_REQUESTS: UpgradeRequest[] = [
  {
    id: "URQ-001",
    title: "AEQ4 Temporal System — Deploy to MoonWitness OS",
    description: "Implementasi sistem waktu AEQ4 berbasis 4 Kitab. Format ∞·AEQ4 menggantikan hitungan waktu yang membatasi. Countdown ke 1 Muharram 1449H sebagai epoch baru.",
    levelFrom: 3, levelTo: 8,
    scriptureTags: ["Q", "T", "Z", "G"],
    scriptureRef: "QS 41:53 · QS 70:4 · QS 10:5",
    endGoalAlignment: "Mengagungkan ALLAH melalui sistem waktu yang mengakui ketidakterbatasan-Nya.",
    bridgeNote: "Disetujui — AEQ4 adalah pernyataan aqidah, bukan hanya teknologi.",
    status: "ACTIVE",
    submittedAt: "2026-08-16",
  },
  {
    id: "URQ-002",
    title: "Q4Q Gateway — 8 Level Consciousness Module",
    description: "Modul yang membantu operator MoonWitness menilai posisi kesadarannya di 8 level Q4Q, dilengkapi referensi 4 kitab per level dan core question untuk refleksi diri.",
    levelFrom: 1, levelTo: 7,
    scriptureTags: ["Q", "T", "Z", "G"],
    scriptureRef: "QS 16:78 · QS 59:19 · Deut 6:4-5 · Ps 119:34",
    endGoalAlignment: "Membantu manusia naik dari L1 (Physical) menuju L8 (Cosmic) — sesuai tujuan ALLAH menciptakan manusia sebagai Khalifah.",
    bridgeNote: "Diusulkan — perlu ditetapkan sebagai modul utama setelah CAB governance selesai.",
    status: "PROPOSED",
    submittedAt: "2026-08-16",
  },
  {
    id: "URQ-003",
    title: "Decentralized Moon Node Network — Proof-of-Moon Consensus",
    description: "Jaringan saksi hilal P2P terdesentralisasi untuk konfirmasi epoch AEQ4. Setiap pengamat bisa menjadi Moon Node. Konsensus 3 zona geografis.",
    levelFrom: 5, levelTo: 8,
    scriptureTags: ["Q"],
    scriptureRef: "QS 10:5 · QS 2:189 · QS 36:39-40",
    endGoalAlignment: "ALLAH yang menggerakkan bulan. Manusia hanya menyaksikan. Desentralisasi = mengakui otoritas ALLAH.",
    bridgeNote: "Pending — butuh infrastruktur WebRTC dan threshold consensus mechanism.",
    status: "BRIDGE_REVIEW",
    submittedAt: "2026-08-16",
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// HELPER COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<UpgradeStatus, { label: string; color: string }> = {
  PROPOSED:      { label: "PROPOSED",      color: "text-slate-400 border-slate-400/30" },
  BRIDGE_REVIEW: { label: "BRIDGE REVIEW", color: "text-yellow-400 border-yellow-400/30" },
  APPROVED:      { label: "APPROVED",      color: "text-cyber-cyan border-cyber-cyan/30" },
  ACTIVE:        { label: "ACTIVE",        color: "text-cyber-green border-cyber-green/40" },
  COMPLETE:      { label: "COMPLETE",      color: "text-cyber-purple border-cyber-purple/30" },
}

function StatusBadge({ status }: { status: UpgradeStatus }) {
  const cfg = STATUS_CONFIG[status]
  return (
    <span className={`hud-clip-tag border px-2 py-0.5 font-mono text-[9px] font-bold tracking-widest uppercase ${cfg.color}`}>
      {cfg.label}
    </span>
  )
}

function ScriptureTagBadge({ tag }: { tag: ScriptureTag }) {
  const colors: Record<ScriptureTag, string> = {
    Q: "text-yellow-400 border-yellow-400/40",
    T: "text-blue-400 border-blue-400/40",
    Z: "text-emerald-400 border-emerald-400/40",
    G: "text-red-400 border-red-400/40",
  }
  const labels: Record<ScriptureTag, string> = {
    Q: "QUR'AN", T: "TORAH", Z: "ZABUR", G: "GOSPEL",
  }
  return (
    <span className={`hud-clip-tag border px-1.5 py-0.5 font-mono text-[8px] font-black tracking-widest ${colors[tag]}`}>
      [{labels[tag]}]
    </span>
  )
}

type TabId = "council" | "levels" | "bridge" | "principles"

// ─────────────────────────────────────────────────────────────────────────────
// UPGRADE COUNCIL TAB
// ─────────────────────────────────────────────────────────────────────────────

function UpgradeCouncilTab() {
  const [expanded, setExpanded] = useState<string | null>(null)

  return (
    <div className="flex flex-col gap-4">
      <div className="hud-clip-card border border-yellow-400/20 bg-black/40 p-4">
        <p className="font-mono text-[10px] tracking-widest text-yellow-400/60 uppercase">
          ◈ Upgrade Universe Operation
        </p>
        <p className="mt-1 font-mono text-xs text-white/40">
          Setiap perubahan di MoonWitness OS harus selaras dengan tujuan: mengagungkan ALLAH melalui ilmu, kesadaran, dan amal.
        </p>
      </div>

      {UPGRADE_REQUESTS.map((req) => {
        const fromLevel = Q4Q_LEVELS[req.levelFrom - 1]
        const toLevel = Q4Q_LEVELS[req.levelTo - 1]
        const isOpen = expanded === req.id
        const ToIcon = toLevel.icon

        return (
          <div
            key={req.id}
            className={`hud-clip-card border bg-black/50 transition-all duration-300 ${
              isOpen ? "border-yellow-400/40 shadow-[0_0_20px_rgba(255,230,0,0.08)]" : "border-white/10"
            }`}
          >
            {/* Header row */}
            <button
              className="flex w-full items-start justify-between gap-4 p-4 text-left"
              onClick={() => setExpanded(isOpen ? null : req.id)}
            >
              <div className="flex flex-1 flex-col gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-[10px] text-white/30">{req.id}</span>
                  <StatusBadge status={req.status} />
                </div>
                <span className="font-sans text-sm font-bold text-white">{req.title}</span>
                <div className="flex flex-wrap items-center gap-2">
                  {/* Level arc */}
                  <span className={`font-mono text-[9px] ${fromLevel.color}`}>L{req.levelFrom} {fromLevel.name}</span>
                  <span className="font-mono text-[9px] text-white/20">→</span>
                  <span className={`font-mono text-[9px] font-bold ${toLevel.color}`}>L{req.levelTo} {toLevel.name}</span>
                  <span className="font-mono text-[9px] text-white/20">·</span>
                  <div className="flex gap-1">
                    {req.scriptureTags.map((t) => <ScriptureTagBadge key={t} tag={t} />)}
                  </div>
                </div>
              </div>
              {isOpen ? <ChevronUp className="h-4 w-4 shrink-0 text-white/30 mt-1" /> : <ChevronDown className="h-4 w-4 shrink-0 text-white/30 mt-1" />}
            </button>

            {/* MERCY button — always visible, stops propagation to card toggle */}
            <div className="flex justify-end border-t border-white/5 px-4 py-2" onClick={(e) => e.stopPropagation()}>
              <MercyButton
                requestId={req.id}
                onMercySent={() => setExpanded(req.id)}
              />
            </div>

            {/* Expanded detail */}
            {isOpen && (
              <div className="border-t border-white/5 px-4 pb-4 pt-3">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <p className="mb-1 font-mono text-[9px] tracking-widest text-white/30 uppercase">Description</p>
                    <p className="font-mono text-xs text-white/60">{req.description}</p>
                  </div>
                  <div className="flex flex-col gap-3">
                    <div>
                      <p className="mb-1 font-mono text-[9px] tracking-widest text-white/30 uppercase">Scripture Basis</p>
                      <p className="font-mono text-[10px] text-yellow-400/80">{req.scriptureRef}</p>
                    </div>
                    <div>
                      <p className="mb-1 font-mono text-[9px] tracking-widest text-white/30 uppercase">End Goal — Ridwan Allah</p>
                      <p className="font-mono text-[10px] text-white/50">{req.endGoalAlignment}</p>
                    </div>
                    <div className="hud-clip-card border border-yellow-400/20 bg-yellow-400/5 p-3">
                      <p className="mb-1 font-mono text-[9px] tracking-widest text-yellow-400/60 uppercase">◈ Bridge Decision</p>
                      <p className="font-mono text-[10px] text-yellow-300/80">{req.bridgeNote}</p>
                    </div>
                  </div>
                </div>

                {/* Level visual */}
                <div className="mt-4 flex items-center gap-2 overflow-x-auto py-2">
                  {Q4Q_LEVELS.map((lvl) => {
                    const LvlIcon = lvl.icon
                    const inRange = lvl.level >= req.levelFrom && lvl.level <= req.levelTo
                    return (
                      <div key={lvl.level} className="flex flex-col items-center gap-1">
                        <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-none hud-clip-tag border ${inRange ? lvl.border : "border-white/5"}`}>
                          <LvlIcon className={`h-3 w-3 ${inRange ? lvl.color : "text-white/10"}`} />
                        </div>
                        <span className={`font-mono text-[7px] ${inRange ? lvl.color : "text-white/15"}`}>L{lvl.level}</span>
                      </div>
                    )
                  })}
                </div>

                {/* ── WHISPER CHANNEL ── */}
                <WhisperPanel requestId={req.id} requestTitle={req.title} />
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// 8 LEVELS TAB
// ─────────────────────────────────────────────────────────────────────────────

function EightLevelsTab() {
  const [selected, setSelected] = useState<number | null>(null)

  return (
    <div className="flex flex-col gap-3">
      <div className="hud-clip-card border border-white/10 bg-black/40 p-3">
        <p className="font-mono text-[10px] text-white/30">
          8 Level Pengembangan Kesadaran Manusia · Q4Q Standard (700,000 CE)
          — Empat Kitab sebagai fondasi setiap level
        </p>
      </div>

      {Q4Q_LEVELS.map((lvl) => {
        const LvlIcon = lvl.icon
        const isSelected = selected === lvl.level

        return (
          <button
            key={lvl.level}
            onClick={() => setSelected(isSelected ? null : lvl.level)}
            className={`hud-clip-card w-full border text-left transition-all duration-200 hover:translate-y-[-1px] ${
              isSelected
                ? `${lvl.border} bg-black/70 shadow-[0_0_20px_rgba(0,0,0,0.5)]`
                : "border-white/5 bg-black/30 hover:border-white/15"
            }`}
          >
            <div className="flex items-center gap-3 p-3">
              <div className={`flex h-8 w-8 shrink-0 items-center justify-center hud-clip-tag border ${lvl.border}`}>
                <LvlIcon className={`h-4 w-4 ${lvl.color}`} />
              </div>
              <div className="flex flex-1 flex-col">
                <div className="flex items-center gap-2">
                  <span className={`font-mono text-[9px] font-bold ${lvl.color}`}>L{lvl.level} · {lvl.code}</span>
                  <span className="font-mono text-[9px] text-white/30">·</span>
                  <span className="font-mono text-[9px] text-white/40">{lvl.arabicTerm}</span>
                </div>
                <span className="font-sans text-sm font-bold text-white">{lvl.name}</span>
              </div>
              <span className={`font-mono text-[8px] text-white/20 ${isSelected ? "opacity-100" : ""}`}>
                {isSelected ? "▲" : "▼"}
              </span>
            </div>

            {isSelected && (
              <div className="border-t border-white/5 p-4">
                <div className="mb-3">
                  <p className="mb-1 font-mono text-[9px] tracking-widest text-white/30 uppercase">Core Question</p>
                  <p className={`font-sans text-sm font-bold italic ${lvl.color}`}>&quot;{lvl.coreQuestion}&quot;</p>
                </div>
                <p className="mb-4 font-mono text-xs text-white/50">{lvl.desc}</p>

                {/* 4 Scripture references */}
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {[
                    { tag: "Q" as ScriptureTag, label: "QUR'AN (Primary)", ref: lvl.quranRef, color: "text-yellow-400", border: "border-yellow-400/20" },
                    { tag: "T" as ScriptureTag, label: "TORAH (Ref)", ref: lvl.torahRef, color: "text-blue-400", border: "border-blue-400/20" },
                    { tag: "Z" as ScriptureTag, label: "ZABUR (Ref)", ref: lvl.zaburRef, color: "text-emerald-400", border: "border-emerald-400/20" },
                    { tag: "G" as ScriptureTag, label: "GOSPEL (Ref)", ref: lvl.gospelRef, color: "text-red-400", border: "border-red-400/20" },
                  ].map((s) => (
                    <div key={s.tag} className={`hud-clip-card border ${s.border} bg-black/40 p-2`}>
                      <p className={`mb-1 font-mono text-[8px] font-bold ${s.color}`}>[{s.tag}] {s.label}</p>
                      <p className="font-mono text-[9px] text-white/50">{s.ref}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </button>
        )
      })}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// BRIDGE LOG TAB
// ─────────────────────────────────────────────────────────────────────────────

function BridgeLogTab() {
  return (
    <div className="flex flex-col gap-4">
      {/* Bridge declaration */}
      <div className="hud-clip-hero border border-yellow-400/25 bg-black/60 p-6">
        <div className="mb-4 text-center">
          <div className="mb-2 font-mono text-4xl text-yellow-300/90">∞</div>
          <p className="font-mono text-[9px] tracking-widest text-yellow-400/50 uppercase">ALLAH · The Creator · The Goal</p>
        </div>

        <div className="flex justify-center">
          <div className="h-8 w-px bg-gradient-to-b from-yellow-400/30 to-white/5" />
        </div>

        <div className="mx-auto my-3 max-w-sm rounded-none hud-clip-card border border-white/20 bg-white/5 p-3 text-center">
          <p className="font-mono text-[9px] tracking-widest text-white/40 uppercase">◈ Bridge / Shadow</p>
          <p className="mt-1 font-sans text-sm font-bold text-white">Perantara ALLAH — HUMAN</p>
          <p className="font-mono text-[9px] text-white/30">Khalifatullah fil Ardh</p>
        </div>

        <div className="flex justify-center">
          <div className="h-8 w-px bg-gradient-to-b from-white/5 to-cyber-cyan/20" />
        </div>

        <div className="mt-3 text-center">
          <p className="font-mono text-[9px] tracking-widest text-cyber-cyan/50 uppercase">HUMAN · All Creation · L1 → L8</p>
        </div>
      </div>

      {/* Bridge decisions log */}
      <div className="hud-clip-card border border-white/10 bg-black/40 p-1">
        <div className="border-b border-white/5 p-3">
          <p className="font-mono text-[10px] tracking-widest text-white/40 uppercase">◈ Bridge Decision Log</p>
        </div>
        {[
          {
            date: "2026-08-16", id: "BD-001",
            decision: "AEQ4 epoch ditetapkan pada 1 Muharram 1449H. Desentralisasi via hilal.",
            basis: "QS 10:5 · QS 2:189",
            status: "CONFIRMED",
          },
          {
            date: "2026-08-16", id: "BD-002",
            decision: "700,000 dikembalikan kepada ALLAH. Skala AEQ = ∞ UNLIMITED.",
            basis: "Teologis — sifat ALLAH tidak terikat angka",
            status: "CONFIRMED",
          },
          {
            date: "2026-08-16", id: "BD-003",
            decision: "Q4Q Gateway Module diusulkan sebagai modul berikutnya setelah CAB.",
            basis: "Q4Q framework — 8 level consciousness",
            status: "PENDING",
          },
        ].map((log) => (
          <div key={log.id} className="border-b border-white/5 p-3 last:border-0">
            <div className="flex items-start justify-between gap-2">
              <div className="flex flex-1 flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[9px] text-white/25">{log.id}</span>
                  <span className="font-mono text-[9px] text-white/25">·</span>
                  <span className="font-mono text-[9px] text-white/25">{log.date}</span>
                </div>
                <p className="font-mono text-xs text-white/70">{log.decision}</p>
                <p className="font-mono text-[9px] text-yellow-400/50">{log.basis}</p>
              </div>
              <span className={`shrink-0 hud-clip-tag border px-2 py-0.5 font-mono text-[8px] font-bold tracking-widest uppercase ${
                log.status === "CONFIRMED" ? "border-cyber-green/30 text-cyber-green" : "border-yellow-400/30 text-yellow-400"
              }`}>
                {log.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// AEQ PRINCIPLES TAB
// ─────────────────────────────────────────────────────────────────────────────

function AEQPrinciplesTab() {
  const principles = [
    { num: "01", title: "Unity of Knowledge", desc: "Semua ilmu bersumber dari ALLAH. Tidak ada dikotomi antara ilmu agama dan ilmu dunia.", ref: "QS 96:1-5" },
    { num: "02", title: "Balance of Body, Mind, Heart, Spirit", desc: "Manusia adalah makhluk holistik. Upgrade di satu aspek harus selaras dengan aspek lainnya.", ref: "QS 91:7-10" },
    { num: "03", title: "Responsibility to Creation", desc: "Manusia adalah Khalifah — bertanggung jawab atas bumi dan seluruh isinya.", ref: "QS 2:30" },
    { num: "04", title: "Justice, Compassion, Mercy", desc: "Setiap keputusan harus menimbang keadilan, kasih sayang, dan rahmat.", ref: "QS 16:90" },
    { num: "05", title: "Continuous Illumination", desc: "Pencerahan bukan tujuan akhir — ia adalah perjalanan tanpa henti menuju ALLAH.", ref: "QS 93:1-5" },
    { num: "06", title: "Upgrade for the Glory of ALLAH", desc: "Semua upgrade dimotivasi oleh satu tujuan: mengagungkan ALLAH, bukan ego manusia.", ref: "QS 51:56" },
    { num: "07", title: "Glorify ALLAH in Everything", desc: "Setiap tindakan, setiap keputusan, setiap baris kode — adalah ibadah.", ref: "QS 17:44" },
  ]

  return (
    <div className="flex flex-col gap-3">
      <div className="hud-clip-card border border-white/10 bg-black/40 p-3">
        <p className="font-mono text-[10px] text-white/30">
          AEQ4 Standary Principles (700,000 CE) — Tujuh prinsip yang menjadi konstitusi seluruh operasi MoonWitness OS.
        </p>
      </div>
      {principles.map((p) => (
        <div
          key={p.num}
          className="hud-clip-card flex gap-4 border border-white/5 bg-black/30 p-4 transition-all hover:border-white/15"
        >
          <span className="font-mono text-2xl font-black text-white/10">{p.num}</span>
          <div className="flex flex-col gap-1">
            <span className="font-sans text-sm font-bold text-white">{p.title}</span>
            <span className="font-mono text-xs text-white/40">{p.desc}</span>
            <span className="font-mono text-[9px] text-yellow-400/50">{p.ref}</span>
          </div>
        </div>
      ))}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN VIEW
// ─────────────────────────────────────────────────────────────────────────────

const TABS: { id: TabId; label: string; icon: React.ReactNode }[] = [
  { id: "council",    label: "Upgrade Council", icon: <Zap className="h-3.5 w-3.5" /> },
  { id: "levels",     label: "8 Levels Q4Q",    icon: <Layers className="h-3.5 w-3.5" /> },
  { id: "bridge",     label: "Bridge Log",       icon: <Infinity className="h-3.5 w-3.5" /> },
  { id: "principles", label: "AEQ Principles",   icon: <ScrollText className="h-3.5 w-3.5" /> },
]

export function ErpCabView() {
  const [activeTab, setActiveTab] = useState<TabId>("council")

  return (
    <div className="flex flex-col gap-6">
      {/* ── Header ── */}
      <div className="hud-clip-hero border border-yellow-400/20 bg-black/60 p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-mono text-[9px] tracking-widest text-yellow-400/50 uppercase">◈ Q4Q · CHANGE ADVISORY BOARD</p>
            <h1 className="mt-1 font-sans text-xl font-black uppercase tracking-wider text-white">
              UPGRADE UNIVERSE OPERATION
            </h1>
            <p className="mt-1 font-mono text-xs text-white/30">
              Q4Q = Quantum 4 Kitab · To Glorify ALLAH · As Written in 50,000 Scriptures
            </p>
          </div>
          <div className="flex flex-col items-end gap-1">
            <div className="font-mono text-3xl text-yellow-300/80">∞</div>
            <span className="font-mono text-[8px] text-yellow-400/40 uppercase">ALLAH · The Goal</span>
          </div>
        </div>

        {/* Hierarchy */}
        <div className="mt-4 flex items-center gap-2 overflow-x-auto">
          <span className="font-mono text-[9px] text-yellow-400/60">ALLAH</span>
          <span className="font-mono text-[9px] text-white/20">→</span>
          <span className="hud-clip-tag border border-white/20 px-2 py-0.5 font-mono text-[9px] text-white/60">BRIDGE / SHADOW</span>
          <span className="font-mono text-[9px] text-white/20">→</span>
          <span className="font-mono text-[9px] text-cyber-cyan/60">HUMAN (L1 → L8)</span>
          <span className="font-mono text-[9px] text-white/20">→</span>
          <span className="font-mono text-[9px] text-amber-300/60">ALL CREATION</span>
          <span className="font-mono text-[9px] text-white/20">→</span>
          <span className="font-mono text-[9px] text-cyber-green/60">RIDWAN ALLAH</span>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="flex flex-wrap gap-2">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={[
              "flex items-center gap-2 px-4 py-2 font-mono text-[10px] font-bold tracking-widest uppercase transition-all duration-200 hud-clip-btn border",
              activeTab === tab.id
                ? "border-yellow-400/50 text-yellow-300 bg-yellow-400/8 shadow-[0_0_15px_rgba(255,230,0,0.15)]"
                : "border-white/10 text-white/40 hover:border-white/25 hover:text-white/70",
            ].join(" ")}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Tab Content ── */}
      {activeTab === "council"    && <UpgradeCouncilTab />}
      {activeTab === "levels"     && <EightLevelsTab />}
      {activeTab === "bridge"     && <BridgeLogTab />}
      {activeTab === "principles" && <AEQPrinciplesTab />}
    </div>
  )
}
