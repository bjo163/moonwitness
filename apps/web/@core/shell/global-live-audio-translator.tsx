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
    <div className="relative font-mono">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="tag-clip flex cursor-pointer items-center gap-1 border border-primary/40 px-2 py-0.5 text-[8px] font-bold text-primary hover:border-primary"
        title="Pilih Bahasa Penerjemah Audio Global V4.0"
      >
        <Languages className="h-3 w-3 text-primary" />
        <span>
          [ AUDIO TRANSLATE: {selectedLang.code.toUpperCase()}{" "}
          {selectedLang.flag} ]
        </span>
      </button>

      {isOpen && (
        <div className="bg-space/95 tag-clip theme-scrollbar absolute bottom-full left-0 z-50 mb-2 max-h-56 w-52 space-y-1 overflow-y-auto border border-primary/50 p-2 text-xs shadow-[0_0_20px_rgba(0,240,255,0.2)] backdrop-blur-md">
          <div className="border-b border-primary/20 px-2 py-1 text-[8px] font-bold text-primary">
            {/* 10 BAHASA GLOBAL AUDIO: */}
          </div>

          {GLOBAL_LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                setSelectedLang(lang)
                setIsOpen(false)
              }}
              className={`flex w-full items-center justify-between rounded px-2 py-1.5 text-left text-xs transition-colors ${
                selectedLang.code === lang.code
                  ? "bg-primary/20 font-bold text-primary"
                  : "hover:bg-panel text-foreground"
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
