"use client"

import { useEffect, useState } from "react"
import { getPropheticTraditionsFromSupabase } from "@workspace/quran-core"
import { useLanguage } from "@core/contexts"
import { ContextBlock } from "@core/ui"

export function HaditsPortalView() {
  const { t } = useLanguage()
  const [traditions, setTraditions] = useState<any[]>([])

  useEffect(() => {
    getPropheticTraditionsFromSupabase().then((res) => {
      if (res) setTraditions(res)
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
            "PROPHETIC TRADITIONS & HADITH COMPENDIUMS",
            "KHAZANAH HADITS & TRANSMISI PROFETIK"
          )}
          subtitle={t(
            "Explore authentic Hadiths of Prophet Muhammad PBUH (14 Canonical Compendiums) and Oral Traditions clarifying divine scriptures from Torah (Mishna), Psalms (Tasbih), and Gospel (Didache of 12 Apostles).",
            "Eksplorasi Hadits Sahih Nabi Muhammad SAW (Kutubut Tis'ah & 14 Kitab Utama) dan Catatan Tradisi Lisan Penjelas Wahyu Setara Hadits dari Taurat (Mishna), Zabur (Tasbih), dan Injil (Didache 12 Rasul)."
          )}
          operation="HADITH-COMPENDIUM-SCAN"
          status="ONLINE"
          accentColor="knowledge"
        />

        <div className="rounded-2xl border border-blue-500/20 bg-black/40 p-8 backdrop-blur-xl flex items-center justify-center h-64 text-blue-500/50">
          HADITH DATA STREAM INITIALIZING... {traditions.length} LOADED
        </div>
      </div>
    </div>
  )
}
