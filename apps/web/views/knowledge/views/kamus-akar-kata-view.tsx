"use client"

import { ContextBlock, QuranRootMatrix, CitationBox, ProvenanceCard } from "@workspace/ui"

export function KamusAkarKataView() {
  return (
    <div
      className="min-h-screen py-10 font-sans text-foreground bg-background"
      suppressHydrationWarning
    >
      <div className="mx-auto max-w-5xl space-y-6 px-4 sm:px-6">
        <ContextBlock
          title="KAMUS MU'JAM AKAR KATA ARAB AL-QUR'AN"
          subtitle="Menemukan keindahan semantik Al-Qur'an dari akar kata tri-literal (Triliteral Roots), statistik frekuensi kemunculan, dan seluruh derivasi kata di 114 Surah."
          operation="ROOT-WORD-MORPHOLOGY"
          status="ONLINE"
          accentColor="primary"
        />

        {/* Interactive Triliteral Root Concordance Matrix */}
        <QuranRootMatrix />

        {/* Source Citation & Lexical Provenance */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
          <CitationBox
            title="Mu'jam Roots of the Holy Qur'an"
            sourceName="Quranic Arabic Lexicon & Morphology Concordance"
            edition="Classical Lexicographical Dataset"
            reference="root:ar"
            language="ar"
            revision="1.0.0"
          />

          <ProvenanceCard
            provenance={{
              sourceName: "Quranic Arabic Corpus & Classical Lexicons",
              sourceKey: "source:lexical-roots",
              edition: "quran-roots-v1",
              revision: "1.0.0",
              language: "Arabic (Classical)",
              authority: "RESEARCH",
              contentKind: "DERIVED"
            }}
          />
        </div>
      </div>
    </div>
  )
}
