"use client"

import { useEffect, useState } from "react"
import { getAsmaulHusnaFromSupabase } from "@workspace/quran-core"
import { useLanguage } from "@core/contexts"
import { ContextBlock } from "@core/ui"

export function AsmaulHusnaView() {
  const { t } = useLanguage()
  const [items, setItems] = useState<any[]>([])

  useEffect(() => {
    getAsmaulHusnaFromSupabase().then((res) => {
      if (res) setItems(res)
    })
  }, [])

  return (
    <div
      className="theme-grid-bg min-h-screen py-8 font-mono text-foreground"
      suppressHydrationWarning
    >
      <div className="mx-auto max-w-5xl space-y-6 px-4 sm:px-6">
        <ContextBlock
          title={t(
            "DIVINE ATTRIBUTES — 99 SACRED NAMES",
            "ASMAUL HUSNA — 99 NAMA ILAHI"
          )}
          subtitle={t(
            "Explore the 99 Divine Names and Attributes of Allah SWT — represented as cosmic runic archetypes with Calligraphy Arabic, Latin Transliteration, Translations, and Quranic References.",
            "Menyelami keagungan dan keindahan 99 Nama Allah SWT (Asmaul Husna) lengkap dengan teks Arab, cara membaca Latin, terjemahan Indonesia, dan rujukan ayat Al-Qur'anul Karim."
          )}
          operation="DIVINE-ATTRIBUTES-SCAN"
          status="ONLINE"
          accentColor="knowledge"
        />

        <div className="rounded-2xl border border-blue-500/20 bg-black/40 p-8 backdrop-blur-xl flex items-center justify-center h-64 text-blue-500/50">
          DATA STREAM INITIALIZING... {items.length} LOADED
        </div>
      </div>
    </div>
  )
}
