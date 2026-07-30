"use client"

import React, { createContext, useContext, useEffect, useState } from "react"

export type Language = "en" | "id"

type LanguageContextType = {
  lang: Language
  setLang: (lang: Language) => void
  toggleLang: () => void
  t: (en: string, idStr?: string) => string
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
      if (saved === "en" || saved === "id") {
        setTimeout(() => setLangState(saved), 0)
      } else {
        localStorage.setItem("mw_language", "en")
      }
    }
  }, [])

  const setLang = (newLang: Language) => {
    setLangState(newLang)
    if (typeof window !== "undefined") {
      localStorage.setItem("mw_language", newLang)
    }
  }

  const toggleLang = () => {
    const nextLang = lang === "en" ? "id" : "en"
    setLang(nextLang)
  }

  const t = (enText: string, idText?: string): string => {
    if (lang === "id" && idText) {
      return idText
    }
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
