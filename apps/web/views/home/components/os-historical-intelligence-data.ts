import {
  Book,
  BookOpen,
  Database,
  Droplets,
  Globe,
  Milestone,
  Scroll,
  Wind,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

export type HistoricalProphet = {
  num: string
  name: string
  era: string
  title: string
  sub: string
  icon: LucideIcon
  color: string
  img: string
}

export type HistoricalCivilization = {
  name: string
  era: string
  color: string
}

export type HistoricalEvent = {
  title: string
  date: string
}

export type HistoricalScriptureReference = {
  name: string
  value: string
  color: string
}

type HistoricalFigureRecord = {
  name?: unknown
  lifeStart?: unknown
  lifeEnd?: unknown
  notes?: unknown
}

const DEFAULT_PROPHETS: readonly HistoricalProphet[] = [
  {
    num: "01",
    name: "ĀDAM AS",
    era: "-4000 BCE",
    title: "FIRST HUMAN",
    sub: "FIRST PROPHET",
    icon: Globe,
    color: "#10B981",
    img: "/assets/history_adam.png",
  },
  {
    num: "02",
    name: "NUH AS",
    era: "-3100 BCE",
    title: "THE FLOOD",
    sub: "THE GREAT ARK",
    icon: Droplets,
    color: "#00F0FF",
    img: "/assets/history_nuh.png",
  },
  {
    num: "03",
    name: "IBRAHIM AS",
    era: "-2000 BCE",
    title: "FATHER OF",
    sub: "MONOTHEISM",
    icon: Database,
    color: "#F59E0B",
    img: "/assets/history_ibrahim.png",
  },
  {
    num: "04",
    name: "MUSA AS",
    era: "-1300 BCE",
    title: "DELIVERER FROM",
    sub: "TYRANNY",
    icon: Scroll,
    color: "#3B82F6",
    img: "/assets/history_musa.png",
  },
  {
    num: "05",
    name: "ISA AS",
    era: "~30 CE",
    title: "SPIRIT & WORD",
    sub: "FROM ALLAH",
    icon: Wind,
    color: "#A855F7",
    img: "/assets/history_isa.png",
  },
  {
    num: "06",
    name: "MUHAMMAD ﷺ",
    era: "610 CE",
    title: "THE SEAL OF",
    sub: "PROPHETS",
    icon: BookOpen,
    color: "#10B981",
    img: "/assets/history_muhammad.png",
  },
  {
    num: "07",
    name: "RIGHTLY GUIDED",
    era: "632 - 661 CE",
    title: "JUST LEADERSHIP",
    sub: "& EXPANSION",
    icon: Milestone,
    color: "#F59E0B",
    img: "/assets/history_caliphs.png",
  },
]

export const HISTORICAL_CIVILIZATIONS: readonly HistoricalCivilization[] = [
  { name: "ANCIENT EGYPT", era: "-3100 - 30 BCE", color: "#F59E0B" },
  { name: "BABYLONIAN", era: "-1894 - 539 BCE", color: "#F59E0B" },
  { name: "PERSIAN", era: "-550 - 330 BCE", color: "#F59E0B" },
  { name: "ROMAN", era: "-27 BCE - 476 CE", color: "#3B82F6" },
  { name: "BYZANTINE", era: "330 - 1453 CE", color: "#3B82F6" },
  { name: "UMAYYAD", era: "661 - 750 CE", color: "#10B981" },
  { name: "ABBASID", era: "750 - 1258 CE", color: "#10B981" },
  { name: "OTTOMAN", era: "1299 - 1922 CE", color: "#10B981" },
]

export const HISTORICAL_EVENTS: readonly HistoricalEvent[] = [
  { title: "The Creation of Ādam AS", date: "-4000 BCE" },
  { title: "The Great Flood (Nuh AS)", date: "-3100 BCE" },
  { title: "Prophet Ibrahim AS Born", date: "-2000 BCE" },
  { title: "The Exodus (Musa AS)", date: "-1250 BCE" },
  { title: "The Birth of Isa AS", date: "~0 CE" },
  { title: "The First Revelation", date: "610 CE" },
  { title: "The Hijrah to Madinah", date: "622 CE" },
  { title: "Conquest of Makkah", date: "630 CE" },
  { title: "The Farewell Hajj", date: "632 CE" },
  { title: "End of Prophethood", date: "632 CE" },
]

export const HISTORICAL_SCRIPTURE_REFERENCES: readonly HistoricalScriptureReference[] =
  [
    { name: "QUR'AN", value: "632", color: "#10B981" },
    { name: "HADITH", value: "1,284", color: "#A855F7" },
    { name: "TAURAH", value: "578", color: "#3B82F6" },
    { name: "INJIL", value: "427", color: "#F59E0B" },
    { name: "ZABUR", value: "73", color: "#EC4899" },
  ]

function toText(value: unknown) {
  return typeof value === "string" ? value : value == null ? "" : String(value)
}

export function resolveHistoricalProphets(
  records: readonly HistoricalFigureRecord[]
): HistoricalProphet[] {
  if (records.length === 0) return [...DEFAULT_PROPHETS]

  return records.slice(0, 7).map((record, index) => {
    const fallback = DEFAULT_PROPHETS[index]!
    const name = toText(record.name)
    const lifeStart = toText(record.lifeStart)
    const lifeEnd = toText(record.lifeEnd)
    const notes = toText(record.notes)
    const [title, sub] = notes.split(".")

    return {
      num: String(index + 1).padStart(2, "0"),
      name: name.toUpperCase(),
      era: lifeStart
        ? `${lifeStart}${lifeEnd ? ` – ${lifeEnd}` : ""}`
        : fallback.era,
      title: title ? title.toUpperCase() : fallback.title,
      sub: sub ? sub.trim().toUpperCase() : fallback.sub,
      icon: fallback.icon,
      color: fallback.color,
      img: fallback.img,
    }
  })
}

export { DEFAULT_PROPHETS }
