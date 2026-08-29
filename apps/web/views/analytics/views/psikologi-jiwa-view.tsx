"use client"

import { useLanguage } from "@workspace/state"
import { Heart } from "lucide-react"
import { ContextBlock, Panel, PanelHeader } from "@workspace/ui"

type NafsStage = {
  stageName: string
  quranAyah: string
  quranRef: string
  psychologicalMeaning: string
  therapyGuidance: string
}

const NAFS_PSYCHOLOGY_STAGES: NafsStage[] = [
  {
    stageName: "1. NAFS AMMARAH (JIWA YANG TERDORONG KEBURUKAN)",
    quranAyah:
      "إِنَّ النَّفْسَ لَأَمَّارَةٌ بِالسُّوءِ إِلَّا مَا رَحِمَ رَبِّي",
    quranRef: "Q.S Yusuf (12:53)",
    psychologicalMeaning:
      "Fase jiwa yang didominasi oleh impuls emosional bawah sadar, kecemasan liar, dan hawa nafsu yang belum terdorong disiplin spiritual.",
    therapyGuidance:
      "Tazkiyatun Nafs: Melakukan dzikir penyucian diri, mengontrol impuls emosional, dan memperbanyak istighfar.",
  },
  {
    stageName: "2. NAFS LAWWAMAH (JIWA YANG MENYESALI KESALAHAN)",
    quranAyah: "وَلَا أُقْسِمُ بِالنَّفْسِ اللَّوَّامَةِ",
    quranRef: "Q.S Al-Qiyamah (75:2)",
    psychologicalMeaning:
      "Fase jiwa yang memiliki kesadaran moral tinggi, merasa bersalah saat berbuat salah, dan berjuang menuju kebaikan.",
    therapyGuidance:
      "Muhasabah: Melakukan evaluasi diri harian, memperbaiki niat, dan membangun kebiasaan positif secara konsisten.",
  },
  {
    stageName: "3. NAFS MUTMA'INNAH (JIWA YANG TENANG & DAMAI)",
    quranAyah:
      "يَا أَيَّتُهَا النَّفْسُ الْمُطْمَئِنَّةُ • ارْجِعِي إِلَىٰ رَبِّكِ رَاضِيَةً مَّرْضِيَّةً",
    quranRef: "Q.S Al-Fajr (89:27-28)",
    psychologicalMeaning:
      "Fase puncak ketenangan jiwa absolut (Inner Peace), ridha atas segala takdir Allah, serta bebas dari kecemasan dan duka berlebihan.",
    therapyGuidance:
      "Dzikrullah & Ridha: Mengingat Allah secara mendalam (Q.S 13:28) dan berserah diri penuh kepada Sang Mahakasih.",
  },
]

export function PsikologiJiwaView() {
  const { t } = useLanguage()

  return (
    <div
      className="theme-grid-bg min-h-screen py-8 font-mono text-foreground"
      suppressHydrationWarning
    >
      <div className="mx-auto max-w-5xl space-y-6 px-4 sm:px-6">
        {/* System Breadcrumb */}

        {/* Tactical Context Block */}
        <ContextBlock
          title={t(
            "NAFS PSYCHOLOGY & MENTAL HEALTH",
            "PSIKOLOGI JIWA & KESEHATAN MENTAL AL-QUR'AN"
          )}
          subtitle={t(
            "Quranic mental health guide: Anxiety therapy, grief management, and the 3 stages of Nafs.",
            "Panduan kesehatan mental Al-Qur'an: Terapi kecemasan, duka, & 3 tingkatan Nafs."
          )}
          operation="NAFS-PSYCHOLOGY-MATRIX"
          status="ONLINE"
          accentColor="knowledge"
        />

        {/* 3 Nafs Stages */}
        <Panel level="level2" accentColor="knowledge">
          <PanelHeader
            title="// THE 3 STAGES OF NAFS PSYCHOLOGY IN AL-QUR'AN"
            status="ACTIVE"
            icon={Heart}
            accentColor="knowledge"
            subtitle="Spiritual evolution stages from emotional turmoil to absolute inner peace."
          />

          <div className="mt-4 space-y-4">
            {NAFS_PSYCHOLOGY_STAGES.map((st, idx) => (
              <div
                key={idx}
                className="bg-space tag-clip space-y-3 border border-secondary/30 p-5"
              >
                <div className="flex items-center justify-between border-b border-secondary/20 pb-2">
                  <h4 className="text-sm font-bold text-foreground">
                    {st.stageName}
                  </h4>
                  <span className="clip-tag border border-cyber-purple/40 bg-cyber-purple/10 text-cyber-purple px-2 py-0.5 font-mono text-[9px] font-bold">
                    {st.quranRef}
                  </span>
                </div>

                <div className="arabic-text text-right text-xl leading-loose font-bold text-primary">
                  {st.quranAyah}
                </div>

                <div className="grid grid-cols-1 gap-3 pt-1 text-xs sm:grid-cols-2">
                  <div className="bg-space tag-clip border border-secondary/20 p-3">
                    <p className="text-[9px] font-bold text-primary uppercase">
                      {/* MAKNA PSIKOLOGIS: */}
                    </p>
                    <p className="mt-1 text-[11px] leading-relaxed text-foreground">
                      {st.psychologicalMeaning}
                    </p>
                  </div>

                  <div className="bg-space tag-clip border border-secondary/20 p-3">
                    <p className="text-[9px] font-bold text-primary uppercase">
                      {/* TERAPI & OPERASIONAL: */}
                    </p>
                    <p className="text-success mt-1 text-[11px] leading-relaxed font-bold">
                      {st.therapyGuidance}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  )
}
