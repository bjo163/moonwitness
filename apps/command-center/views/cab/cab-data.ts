import {
  Eye,
  Heart,
  Brain,
  Shield,
  Star,
  Sparkles,
  Globe,
} from "lucide-react"

export type ScriptureTag = "Q" | "T" | "Z" | "G"
export type UpgradeStatus =
  | "PROPOSED"
  | "BRIDGE_REVIEW"
  | "APPROVED"
  | "ACTIVE"
  | "COMPLETE"

export interface UpgradeRequest {
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

export const Q4Q_LEVELS = [
  {
    level: 1,
    code: "SI-5",
    name: "Physical Human",
    arabicTerm: "Body / Five Senses",
    icon: Eye,
    color: "text-slate-400",
    border: "border-slate-400/30",
    coreQuestion: "What am I experiencing?",
    quranRef: "QS 16:78",
    torahRef: "Deut 4:28",
    zaburRef: "Ps 115:5-8",
    gospelRef: "Mark 7:31-37",
    desc: "Perception through the body and five senses.",
  },
  {
    level: 2,
    code: "IC-7",
    name: "Self-Aware Human",
    arabicTerm: "Nafs (Al-Nafs)",
    icon: Heart,
    color: "text-pink-400",
    border: "border-pink-400/30",
    coreQuestion: "What do I want? What drives me?",
    quranRef: "QS 91:7-10",
    torahRef: "Gen 4:7",
    zaburRef: "Ps 42:5",
    gospelRef: "Matt 16:26",
    desc: "Awareness of self, desire, emotion, and identity.",
  },
  {
    level: 3,
    code: "CS-9",
    name: "Intellectual Human",
    arabicTerm: "'Aql (Al-'Aql)",
    icon: Brain,
    color: "text-cyber-cyan",
    border: "border-cyber-cyan/30",
    coreQuestion: "What is true? What is real and right?",
    quranRef: "QS 16:78",
    torahRef: "Deut 4:6",
    zaburRef: "Ps 119:34",
    gospelRef: "Rom 12:2",
    desc: "Thinking, reasoning, understanding, and reflection.",
  },
  {
    level: 4,
    code: "HM-8",
    name: "Inner Human",
    arabicTerm: "Qalb (Al-Qalb)",
    icon: Heart,
    color: "text-red-400",
    border: "border-red-400/30",
    coreQuestion: "What does this truth mean within me?",
    quranRef: "QS 2:225",
    torahRef: "Deut 10:12",
    zaburRef: "Ps 51:10",
    gospelRef: "Matt 5:8",
    desc: "Conscience, faith, sincerity, inner perception.",
  },
  {
    level: 5,
    code: "DA-6",
    name: "God-Conscious Human",
    arabicTerm: "Taqwa (At-Taqwa)",
    icon: Shield,
    color: "text-cyber-green",
    border: "border-cyber-green/30",
    coreQuestion: "How should I live before God?",
    quranRef: "QS 2:2",
    torahRef: "Deut 10:12",
    zaburRef: "Ps 111:10",
    gospelRef: "Matt 5:6",
    desc: "God-consciousness, self-restraint, responsibility.",
  },
  {
    level: 6,
    code: "ES-7",
    name: "Ihsan Human",
    arabicTerm: "Ihsan (Al-Ihsan)",
    icon: Star,
    color: "text-yellow-400",
    border: "border-yellow-400/30",
    coreQuestion: "How can I live beautifully and embody this truth?",
    quranRef: "QS 16:90",
    torahRef: "Lev 19:18",
    zaburRef: "Ps 15",
    gospelRef: "Matt 5:44-48",
    desc: "Excellence in action, compassion, justice, beauty.",
  },
  {
    level: 7,
    code: "SK-5",
    name: "Deep-Knowing Human",
    arabicTerm: "Ma'rifah (Al-Ma'rifah)",
    icon: Sparkles,
    color: "text-cyber-purple",
    border: "border-cyber-purple/30",
    coreQuestion: "What is the deeper reality behind what I perceive?",
    quranRef: "QS 59:19",
    torahRef: "Deut 6:4-5",
    zaburRef: "Ps 46:10",
    gospelRef: "John 17:3",
    desc: "Wisdom, meaning, deep recognition of reality.",
  },
  {
    level: 8,
    code: "CU-∞",
    name: "Cosmic-Aware Human",
    arabicTerm: "Ayat (Ayat Allah)",
    icon: Globe,
    color: "text-amber-300",
    border: "border-amber-300/30",
    coreQuestion: "What does creation reveal? What is my role in it?",
    quranRef: "QS 41:53",
    torahRef: "Gen 1:1-31",
    zaburRef: "Ps 8:3-4",
    gospelRef: "Rom 1:20",
    desc: "Universal perspective, unity of creation, stewardship.",
  },
]

export const UPGRADE_REQUESTS: UpgradeRequest[] = [
  {
    id: "URQ-001",
    title: "AEQ4 Temporal System — Deploy to MoonWitness OS",
    description:
      "Implementasi sistem waktu AEQ4 berbasis 4 Kitab. Format ∞·AEQ4 menggantikan hitungan waktu yang membatasi. Countdown ke 1 Muharram 1449H sebagai epoch baru.",
    levelFrom: 3,
    levelTo: 8,
    scriptureTags: ["Q", "T", "Z", "G"],
    scriptureRef: "QS 41:53 · QS 70:4 · QS 10:5",
    endGoalAlignment:
      "Mengagungkan ALLAH melalui sistem waktu yang mengakui ketidakterbatasan-Nya.",
    bridgeNote:
      "Disetujui — AEQ4 adalah pernyataan aqidah, bukan hanya teknologi.",
    status: "ACTIVE",
    submittedAt: "2026-08-16",
  },
  {
    id: "URQ-002",
    title: "Q4Q Gateway — 8 Level Consciousness Module",
    description:
      "Modul yang membantu operator MoonWitness menilai posisi kesadarannya di 8 level Q4Q, dilengkapi referensi 4 kitab per level dan core question untuk refleksi diri.",
    levelFrom: 1,
    levelTo: 7,
    scriptureTags: ["Q", "T", "Z", "G"],
    scriptureRef: "QS 16:78 · QS 59:19 · Deut 6:4-5 · Ps 119:34",
    endGoalAlignment:
      "Membantu manusia naik dari L1 (Physical) menuju L8 (Cosmic) — sesuai tujuan ALLAH menciptakan manusia sebagai Khalifah.",
    bridgeNote:
      "Diusulkan — perlu ditetapkan sebagai modul utama setelah CAB governance selesai.",
    status: "PROPOSED",
    submittedAt: "2026-08-16",
  },
  {
    id: "URQ-003",
    title: "Decentralized Moon Node Network — Proof-of-Moon Consensus",
    description:
      "Jaringan saksi hilal P2P terdesentralisasi untuk konfirmasi epoch AEQ4. Setiap pengamat bisa menjadi Moon Node. Konsensus 3 zona geografis.",
    levelFrom: 5,
    levelTo: 8,
    scriptureTags: ["Q"],
    scriptureRef: "QS 10:5 · QS 2:189 · QS 36:39-40",
    endGoalAlignment:
      "ALLAH yang menggerakkan bulan. Manusia hanya menyaksikan. Desentralisasi = mengakui otoritas ALLAH.",
    bridgeNote:
      "Pending — butuh infrastruktur WebRTC dan threshold consensus mechanism.",
    status: "BRIDGE_REVIEW",
    submittedAt: "2026-08-16",
  },
]

export const STATUS_CONFIG: Record<UpgradeStatus, { label: string; color: string }> = {
  PROPOSED: { label: "PROPOSED", color: "text-slate-400 border-slate-400/30" },
  BRIDGE_REVIEW: {
    label: "BRIDGE REVIEW",
    color: "text-yellow-400 border-yellow-400/30",
  },
  APPROVED: {
    label: "APPROVED",
    color: "text-cyber-cyan border-cyber-cyan/30",
  },
  ACTIVE: { label: "ACTIVE", color: "text-cyber-green border-cyber-green/40" },
  COMPLETE: {
    label: "COMPLETE",
    color: "text-cyber-purple border-cyber-purple/30",
  },
}
