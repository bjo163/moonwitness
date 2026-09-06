"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import { safeGetStorage, safeSetStorage } from "@workspace/hooks"

export type Language = "en" | "id" | "ar" | "fr"

export type LanguageContextType = {
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
  const [lang, setLangState] = useState<Language>("en")

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = safeGetStorage("mw_language") as Language
      if (["en", "id", "ar", "fr"].includes(saved)) {
        setLangState(saved)
        if (saved === "ar") document.documentElement.dir = "rtl"
        else document.documentElement.dir = "ltr"
      } else {
        safeSetStorage("mw_language", "en")
      }
    }
  }, [])

  const setLang = (newLang: Language) => {
    setLangState(newLang)
    if (typeof window !== "undefined") {
      safeSetStorage("mw_language", newLang)
      document.documentElement.dir = newLang === "ar" ? "rtl" : "ltr"
    }
  }

  const toggleLang = () => {
    const nextLangMap: Record<Language, Language> = {
      en: "id",
      id: "ar",
      ar: "fr",
      fr: "en",
    }
    setLang(nextLangMap[lang])
  }

  const t = (
    enText: string,
    idText?: string,
    arText?: string,
    frText?: string
  ): string => {
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
