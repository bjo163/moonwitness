"use client"

import { useLanguage } from "@workspace/state"
import { Atom } from "lucide-react"
import { ContextBlock, Panel, PanelHeader } from "@workspace/ui"

type ScienceMiracle = {
  id: string
  title: string
  quranAyah: string
  quranRef: string
  scientificDiscovery: string
  discoveryYear: string
  description: string
}

const SCIENCE_MIRACLES: ScienceMiracle[] = [
  {
    id: "s1",
    title: "Peluasan Alam Semesta (Expanding Universe)",
    quranAyah: "وَالسَّمَاءَ بَنَيْنَاهَا بِأَيْيدٍ وَإِنَّا لَمُوسِعُونَ",
    quranRef: "Q.S Adz-Dzariyat (51:47)",
    scientificDiscovery: "Hukum Hubble & Peluasan Metrik Ruang Angkasa",
    discoveryYear: "Abad Ke-20 (1929 M)",
    description:
      "Al-Qur'an menegaskan bahwa langit (alam semesta) dibina oleh Allah dan senantiasa dimluaskan (lamūsi'ūn). Sains modern membenarkan bahwa galaksi-galaksi saling menjauh dengan kecepatan tinggi.",
  },
  {
    id: "s2",
    title: "Besi Berasal dari Luar Angkasa (Meteoric Iron)",
    quranAyah:
      "وَأَنزَلْنَا الْحَدِيدَ فِيهِ بَأْسٌ شَدِيدٌ وَمَنَافِعُ لِلنَّاسِ",
    quranRef: "Q.S Al-Hadid (57:25)",
    scientificDiscovery: "Nukleosintesis Supernova & Hujan Meteorik Besi",
    discoveryYear: "Sains Astrofisika Modern",
    description:
      "Al-Qur'an menggunakan kata 'Waanzalna' (Dan Kami turunkan besi). Astrofisika membuktikan bahwa atom besi tidak diciptakan di Bumi, melainkan terbentuk di bintang raksasa supernova lalu jatuh ke Bumi.",
  },
  {
    id: "s3",
    title: "Gelombang & Kegelapan Laut Dalam (Internal Waves)",
    quranAyah:
      "أَوْ كَظُلُمَاتٍ فِي بَحْرٍ لُّجِّيٍّ يَغْشَاهُ مَوْجٌ مِّن فَوْقِهِ مَوْجٌ",
    quranRef: "Q.S An-Nur (24:40)",
    scientificDiscovery: "Internal Waves & Kegelapan Foton Kedalaman Laut",
    discoveryYear: "Oseanografi Abad Ke-20",
    description:
      "Al-Qur'an menyebutkan 'gelombang di atas gelombang' di laut dalam. Oseanografi membuktikan adanya gelombang internal (internal waves) di batas densitas lapisan laut bawah.",
  },
]

export function MukjizatSainsView() {
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
          title={t("QURANIC SCIENTIFIC MIRACLES", "MUKJIZAT SAINS AL-QUR'AN")}
          subtitle={t(
            "Scientific miracles in Holy Qur'an: Cosmology, Embryology, Meteoric Iron & Deep Sea internal waves.",
            "Pembuktian sains Al-Qur'an: Kosmologi, Embriologi, Besi Meteor, & Gelombang Laut Dalam."
          )}
          operation="QURAN-SCIENCE-MATRIX"
          status="ONLINE"
          accentColor="knowledge"
        />

        {/* Science Miracles Catalog */}
        <Panel level="level2" accentColor="knowledge">
          <PanelHeader
            title="// QURANIC SCIENTIFIC PROOF MATRIX"
            status="VERIFIED"
            icon={Atom}
            accentColor="knowledge"
            subtitle="Harmonization of divine revelations revealed 1,400+ years ago with modern astrophysics & oceanography."
          />

          <div className="mt-4 space-y-4">
            {SCIENCE_MIRACLES.map((sm) => (
              <div
                key={sm.id}
                className="bg-background rounded-md space-y-3 border border-secondary/30 p-5"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-secondary/20 pb-2">
                  <h4 className="text-sm font-bold text-foreground">
                    {sm.title}
                  </h4>
                  <span className="rounded-md border border-purple-500/40 bg-purple-500/10 text-purple-500 px-2 py-0.5 font-mono text-[9px] font-bold">
                    {sm.quranRef}
                  </span>
                </div>

                <div className="arabic-text text-right text-xl leading-loose font-bold text-primary">
                  {sm.quranAyah}
                </div>

                <div className="grid grid-cols-1 gap-3 pt-1 text-xs sm:grid-cols-2">
                  <div className="bg-background rounded-md border border-secondary/20 p-3">
                    <p className="text-[9px] font-bold text-primary uppercase">
                      {/* PENEMUAN SAINS MODERN ({sm.discoveryYear}): */}
                    </p>
                    <p className="mt-1 text-[11px] font-bold text-primary">
                      {sm.scientificDiscovery}
                    </p>
                  </div>

                  <div className="bg-background rounded-md border border-secondary/20 p-3">
                    <p className="text-[9px] font-bold text-primary uppercase">
                      {/* ANALISIS HARMONISASI WAHYU & SAINS: */}
                    </p>
                    <p className="mt-1 text-[11px] leading-relaxed text-foreground">
                      {sm.description}
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
