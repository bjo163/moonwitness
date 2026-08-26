"use client"

import { ContextBlock } from "@core/ui"
import { QuranRootMatrix } from "@workspace/ui"

export function KamusAkarKataView() {
  return (
    <div
      className="theme-grid-bg min-h-screen py-10 font-mono text-foreground"
      suppressHydrationWarning
    >
      <div className="mx-auto max-w-5xl space-y-6 px-4 sm:px-6">
        <ContextBlock
          title="KAMUS MU'JAM AKAR KATA ARAB AL-QUR'AN"
          subtitle="Menemukan keindahan semantik Al-Qur'an dari akar kata tri-literal (Triliteral Roots), statistik frekuensi kemunculan, dan seluruh derivasi kata di 114 Surah."
          operation="ROOT-WORD-MORPHOLOGY"
          status="ONLINE"
          accentColor="knowledge"
        />

        {/* Interactive Triliteral Root Concordance Matrix */}
        <QuranRootMatrix />
      </div>
    </div>
  )
}
