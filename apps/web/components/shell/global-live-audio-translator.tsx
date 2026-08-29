"use client"

import { useState } from "react"
import { Languages, Check } from "lucide-react"

type LanguageOption = {
  code: string
  name: string
  flag: string
}

const GLOBAL_LANGUAGES: LanguageOption[] = [
  { code: "id", name: "Bahasa Indonesia", flag: "🇮🇩" },
  { code: "en", name: "English (US/UK)", flag: "🇬🇧" },
  { code: "ar", name: "العربية (Arabic)", flag: "🇸🇦" },
  { code: "ur", name: "اردو (Urdu)", flag: "🇵🇰" },
  { code: "tr", name: "Türkçe (Turkish)", flag: "🇹🇷" },
  { code: "fr", name: "Français (French)", flag: "🇫🇷" },
  { code: "es", name: "Español (Spanish)", flag: "🇪🇸" },
  { code: "ru", name: "Русский (Russian)", flag: "🇷🇺" },
  { code: "ms", name: "Bahasa Melayu", flag: "🇲🇾" },
  { code: "zh", name: "中文 (Mandarin)", flag: "🇨🇳" },
]

export function GlobalLiveAudioTranslator() {
  const [selectedLang, setSelectedLang] = useState<LanguageOption>(
    GLOBAL_LANGUAGES[0]!
  )
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative font-sans">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="clip-tag flex cursor-pointer items-center gap-1 border border-cyber-cyan/40 px-2 py-1 text-xs font-medium text-cyber-cyan transition-colors hover:border-cyber-cyan hover:bg-cyber-cyan/10"
        title="Choose audio translation language"
      >
        <Languages className="h-3.5 w-3.5" />
        <span>Audio · {selectedLang.code.toUpperCase()} {selectedLang.flag}</span>
      </button>

      {isOpen && (
        <div className="clip-card theme-scrollbar absolute bottom-full left-0 z-50 mb-2 max-h-56 w-52 space-y-1 overflow-y-auto border border-cyber-cyan/40 bg-cyber-panel p-2 text-sm">

          {GLOBAL_LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                setSelectedLang(lang)
                setIsOpen(false)
              }}
              className={`flex w-full items-center justify-between rounded px-2 py-1.5 text-left transition-colors ${
                selectedLang.code === lang.code
                  ? "bg-cyber-cyan/10 font-medium text-cyber-cyan"
                  : "text-foreground hover:bg-accent"
              }`}
            >
              <span>
                {lang.flag} {lang.name}
              </span>
              {selectedLang.code === lang.code && (
                <Check className="h-3 w-3 text-primary" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
