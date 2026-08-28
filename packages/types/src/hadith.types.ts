// Hadith Compendiums & Sanad Graph Domain Types

export type HadithGrade =
  | "Shahih Utama"
  | "Shahih"
  | "Hasan"
  | "Dhaif"
  | "Maudhu"
  | "Shahih Verified"

export interface HadithEntry {
  id: string
  book: string
  number: number
  arabicText: string
  translation: string
  grade: HadithGrade | string
  topic: string
  narratorChain?: string[]
  explanation?: string
}

export interface NarratorBio {
  id: string
  name: string
  generation: "Sahabat" | "Tabi'in" | "Tabi'ut Tabi'in" | "Kibar Tabi'in" | "Rawi"
  reliability: "Tsiqah" | "Shaduq" | "Dhaif" | "Matruk"
  birthDeathHijri?: string
  teachersCount?: number
  studentsCount?: number
}

export interface SanadNode {
  id: string
  name: string
  role: string
  level: number
  status: "verified" | "neutral" | "unverified"
  children?: SanadNode[]
}

export interface SanadTree {
  hadithId: string
  rootNarrator: string
  chain: SanadNode[]
}

export interface CompendiumBook {
  slug: string
  name: string
  author: string
  totalHadiths: number
  description: string
  icon?: string
}
