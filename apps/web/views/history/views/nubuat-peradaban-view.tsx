"use client"

import { useLanguage } from "@workspace/state"
import { ContextBlock } from "@workspace/ui"

type EpochTimeline = {
  epochName: string
  eraTime: string
  mainEvent: string
  quranAyah: string
  quranRef: string
  civilizationNote: string
}

const CIVILIZATION_TIMELINE: EpochTimeline[] = [
  {
    epochName: "1. ERA AWAL PENCIPTAAN (KAPASITAS KHALIFAH ADAM A.S)",
    eraTime: "Awal Peradaban Manusia",
    mainEvent: "Pengajaran Asma' (Pengetahuan) & Amanah Pengelolaan Bumi",
    quranAyah: "وَعَلَّمَ آدَمَ الْأَسْمَاءَ كُلَّهَا",
    quranRef: "Q.S Al-Baqarah (2:31)",
    civilizationNote:
      "Titik mula manusia sebagai makhluk berilmu yang diberi kecerdasan mengidentifikasi realitas sains dan nama-nama objek.",
  },
  {
    epochName:
      "2. ERA PERADABAN PARA NABI & RASUL (NUH, IBRAHIM, MUSA, ISA A.S)",
    eraTime: "Masa Kejayaan Risalah Monoteisme",
    mainEvent: "Penyampaian Kitab-Kitab Suci & Mukjizat Peradaban",
    quranAyah:
      "كَانَ النَّاسُ أُمَّةً وَاحِدَةً فَبَعَثَ اللَّهُ النَّبِيِّينَ مُبَشِّرِينَ وَمُنذِرِينَ",
    quranRef: "Q.S Al-Baqarah (2:213)",
    civilizationNote:
      "Manusia awalnya satu umat, lalu Allah mengutus para Nabi membawa kitab suci sebagai pedoman keadilan dan moralitas.",
  },
  {
    epochName: "3. ERA KERUSAKAN EKOLOGI & DISRUPSI MODERN (SAAT INI)",
    eraTime: "Abad Ke-21 (Era Informasi & Sains)",
    mainEvent: "Kerusakan Ekosistem & Tantangan Ketimpangan Moril",
    quranAyah:
      "ظَهَرَ الْفَسَادُ فِي الْبَرِّ وَالْبَحْرِ بِمَا كَسَبَتْ أَيْدِي النَّاسِ",
    quranRef: "Q.S Ar-Rum (30:41)",
    civilizationNote:
      "Era modern di mana kemajuan sains manusia diuji dengan kerusakan ekosistem dan disrupsi informasi.",
  },
  {
    epochName:
      "4. ERA KEMENANGAN KEBENARAN & KEDAMAIAN ABADI (NUBUAT MASA DEPAN)",
    eraTime: "Eschatological Horizon",
    mainEvent: "Dominasi Keadilan Universal & Kemenangan Al-Haqq",
    quranAyah:
      "وَقُلْ جَاءَ الْحَقُّ وَزَهَقَ الْبَاطِلُ ۚ إِنَّ الْبَاطِلَ كَانَ زَهُوقًا",
    quranRef: "Q.S Al-Isra' (17:81) & Q.S An-Nur (24:55)",
    civilizationNote:
      "Nubuat Al-Qur'an dan Hadits Shahih akan janji Allah mengenai kemenangan kebenaran (*Al-Haqq*) atas kebatilan dan terwujudnya kedamaian abadi.",
  },
]

export function NubuatPeradabanView() {
  const { t } = useLanguage()

  return (
    <div
      className="theme-grid-bg min-h-screen py-10 font-mono text-foreground"
      suppressHydrationWarning
    >
      <div className="mx-auto max-w-5xl space-y-6 px-4 sm:px-6">
        <ContextBlock
          title="PETA GARIS WAKTU PERADABAN MANUSIA & NUBUAT PERADABAN MASA DEPAN"
          subtitle="Pemetaan timeline 4 babakan sejarah peradaban umat manusia berdasarkan teologi Islam dan nubuat eskatologis Rasulullah SAW mengenai masa depan."
          operation="CIVILIZATION-EPOCH-SYNC"
          status="ONLINE"
          accentColor="success"
        />

        {/* Timeline Nodes */}
        <div className="space-y-4 pt-2">
          <div className="text-success flex items-center justify-between text-xs font-bold">
            <span>{/* 4 EPOCH PERJALANAN PERADABAN MANUSIA */}</span>
            <span className="text-[10px] text-primary">
              PROPHETIC TIMELINE SYNC
            </span>
          </div>

          <div className="border-success/40 relative ml-4 space-y-6 border-l-2 pl-6">
            {CIVILIZATION_TIMELINE.map((ep, idx) => (
              <div key={idx} className="group relative">
                <div className="bg-background border-success absolute top-1.5 -left-[31px] flex h-3.5 w-3.5 items-center justify-center rounded-full border-2">
                  <span className="bg-success h-1 w-1 rounded-full" />
                </div>

                <div className="rounded-xl border border-border/40 bg-card/90 border-success/30 bg-background rounded-md space-y-3 border p-6">
                  <div className="border-success/20 flex flex-wrap items-center justify-between gap-2 border-b pb-2">
                    <h3 className="font-sans text-sm font-bold text-foreground">
                      {ep.epochName}
                    </h3>
                    <span className="rounded-md border border-emerald-500/40 bg-emerald-500/10 text-emerald-500 px-2 py-0.5 font-mono text-[9px] font-bold">
                      {ep.quranRef}
                    </span>
                  </div>

                  <div className="text-success arabic-text text-right text-lg leading-relaxed font-bold sm:text-xl">
                    {ep.quranAyah}
                  </div>

                  <div className="bg-panel border-success/20 space-y-1 border p-3 text-xs text-primary">
                    <span className="text-success block text-[8px] font-bold uppercase">
                      {/* SUBTANSI PERADABAN: */}
                    </span>
                    <p className="leading-relaxed text-foreground">
                      {ep.civilizationNote}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
