import type { ReactNode } from "react"
import { Infinity, Star, User } from "lucide-react"
import type { WhisperExpiry, WhisperTier } from "../whisper-mercy"

export const EXPIRY_OPTIONS: {
  days: WhisperExpiry
  label: string
  desc: string
  ref: string
}[] = [
  { days: 3, label: "3 HARI", desc: "Persinggahan musafir", ref: "QS 2:28 — kehidupan adalah persinggahan" },
  { days: 7, label: "7 HARI", desc: "Siklus mingguan ciptaan ALLAH", ref: "QS 41:9-12 — ALLAH menciptakan dalam enam masa" },
  { days: 40, label: "40 HARI", desc: "Masa perenungan dan perubahan", ref: "QS 7:142 — Nabi Musa di gunung 40 malam" },
]

export const TIER_CONFIG: Record<WhisperTier, {
  label: string
  icon: ReactNode
  color: string
  border: string
  bg: string
  align: string
}> = {
  DIVINE: {
    label: "DIVINE",
    icon: <Infinity className="h-3 w-3" />,
    color: "text-yellow-300",
    border: "border-yellow-400/40",
    bg: "bg-yellow-400/8",
    align: "items-start",
  },
  SHADOW: {
    label: "SHADOW",
    icon: <Star className="h-3 w-3" />,
    color: "text-foreground",
    border: "border-border",
    bg: "bg-muted/30",
    align: "items-end",
  },
  HUMAN: {
    label: "HUMAN",
    icon: <User className="h-3 w-3" />,
    color: "text-primary",
    border: "border-primary/30",
    bg: "bg-primary/5",
    align: "items-start",
  },
}
