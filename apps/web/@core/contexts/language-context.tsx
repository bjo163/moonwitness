"use client"

import React, { createContext, useContext, useEffect, useState } from "react"

export type Language = "en" | "id" | "ar" | "fr"

type LanguageContextType = {
  lang: Language
  setLang: (lang: Language) => void
  toggleLang: () => void
  t: (en: string, idStr?: string, arStr?: string, frStr?: string) => string
}

const LanguageContext = createContext<LanguageContextType>({
  lang: "en",
  setLang: () => {},
  toggleLang: () => {},
  t: (en: string) => en,
})

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>("en") // Default FULL ENGLISH

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("mw_language") as Language
      if (["en", "id", "ar", "fr"].includes(saved)) {
        setTimeout(() => {
          setLangState(saved)
          if (saved === "ar") document.documentElement.dir = "rtl"
          else document.documentElement.dir = "ltr"
        }, 0)
      } else {
        localStorage.setItem("mw_language", "en")
      }
    }
  }, [])

  const setLang = (newLang: Language) => {
    setLangState(newLang)
    if (typeof window !== "undefined") {
      localStorage.setItem("mw_language", newLang)
      document.documentElement.dir = newLang === "ar" ? "rtl" : "ltr"
    }
  }

  const toggleLang = () => {
    const nextLangMap: Record<Language, Language> = { en: "id", id: "ar", ar: "fr", fr: "en" }
    setLang(nextLangMap[lang])
  }

  const t = (enText: string, idText?: string, arText?: string, frText?: string): string => {
    if (lang === "id" && idText) return idText
    if (lang === "ar" && arText) return arText
    if (lang === "fr" && frText) return frText
    return enText
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  return useContext(LanguageContext)
}
