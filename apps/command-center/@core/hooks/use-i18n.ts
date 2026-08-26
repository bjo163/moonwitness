"use client"

import { create } from "zustand"

type Language = "en" | "id"

interface I18nStore {
  lang: Language
  setLang: (lang: Language) => void
}

export const useI18nStore = create<I18nStore>((set) => ({
  lang: "id", // default language
  setLang: (lang) => set({ lang }),
}))

// A lightweight dictionary
const dictionaries = {
  en: {
    "login.title": "IDENTITY MATRIX",
    "login.subtitle": "User profile and clearance levels.",
    "login.button": "LOGIN SYSTEM",
    "dashboard.title": "TELEMETRY DASHBOARD",
    "error.title": "SYSTEM FAULT DETECTED",
  },
  id: {
    "login.title": "MATRIKS IDENTITAS",
    "login.subtitle": "Profil pengguna dan tingkat izin akses.",
    "login.button": "MASUK SISTEM",
    "dashboard.title": "DASBOR TELEMETRI",
    "error.title": "KESALAHAN SISTEM TERDETEKSI",
  },
}

export function useI18n() {
  const { lang, setLang } = useI18nStore()

  const t = (key: keyof typeof dictionaries.en): string => {
    return dictionaries[lang][key] || key
  }

  return { lang, setLang, t }
}
