"use client"

import { useState } from "react"
import { BookOpen, Scroll, ShieldCheck, Compass } from "lucide-react"
import { ContextBlock } from "@workspace/ui"

type ParallelPassage = {
  theme: string
  themeDesc: string
  quran: { ref: string; arabic: string; text: string }
  torah: { ref: string; text: string }
  psalms: { ref: string; text: string }
  gospel: { ref: string; text: string }
}

const MATRIX_DATA: ParallelPassage[] = [
  {
    theme: "KEESAAN ILAHI (TAUHID PRIMORDIAL)",
    themeDesc:
      "Seluruh wahyu dan kitab suci menegaskan keesaan mutlak Pencipta tanpa sekutu.",
    quran: {
      ref: "Q.S Al-Ikhlas (112:1-4)",
      arabic:
        "قُلْ هُوَ اللَّهُ أَحَدٌ ﴿١﴾ اللَّهُ الصَّمَدُ ﴿٢﴾ لَمْ يَلِدْ وَلَمْ يُولَدْ ﴿٣﴾ وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ ﴿٤﴾",
      text: "Katakanlah: Dia-lah Allah, Yang Maha Esa. Allah adalah Tuhan yang bergantung kepada-Nya segala sesuatu. Dia tiada beranak dan tidak pula diperanakkan, dan tidak ada seorang pun yang setara dengan Dia.",
    },
    torah: {
      ref: "Taurat (Ulangan 6:4)",
      text: "Dengarlah, hai orang Israel: TUHAN itu Allah kita, TUHAN itu Esa!",
    },
    psalms: {
      ref: "Zabur (Mazmur 86:10)",
      text: "Sebab Engkau besar dan melakukan perbuatan-perbuatan yang ajaib; Engkau sendiri saja Allah.",
    },
    gospel: {
      ref: "Injil (Markus 12:29)",
      text: "Jawab Yesus: Hukum yang terutama ialah: Dengarlah, hai orang Israel, Tuhan Allah kita, Tuhan itu Esa.",
    },
  },
  {
    theme: "PENCIPTAAN MANUSIA & KEMULIAANNYA",
    themeDesc:
      "Manusia diciptakan sebagai makhluk termulia yang diberi amanah di bumi.",
    quran: {
      ref: "Q.S At-Tin (95:4) & Al-Isra (17:70)",
      arabic: "لَقَدْ خَلَقْنَا الْإِنسَانَ فِي أَحْسَنِ تَقْوِيمٍ",
      text: "Sungguh, Kami telah menciptakan manusia dalam bentuk yang sebaik-baiknya. Dan sungguh Kami telah memuliakan anak-cucu Adam.",
    },
    torah: {
      ref: "Taurat (Kejadian 1:27)",
      text: "Maka Allah menciptakan manusia itu menurut gambaran-Nya, menurut gambar Allah diciptakan-Nya dia.",
    },
    psalms: {
      ref: "Zabur (Mazmur 8:5-6)",
      text: "Namun Engkau telah membuatnya hampir sama seperti Allah, dan telah memahkotainya dengan kemuliaan dan hormat.",
    },
    gospel: {
      ref: "Injil (Matius 10:31)",
      text: "Sebab itu janganlah kamu takut, karena kamu lebih berharga daripada banyak burung pipit.",
    },
  },
  {
    theme: "RAHMAT & KASIH SAYANG ILAHI",
    themeDesc:
      "Rahmat dan kasih sayang Pencipta mendahului dan meliputi segala ciptaan-Nya.",
    quran: {
      ref: "Q.S Al-A'raf (7:156) & Al-Anbiya (21:107)",
      arabic: "وَرَحْمَتِي وَسِعَتْ كُلَّ شَيْءٍ",
      text: "Dan Rahmat-Ku meliputi segala sesuatu... Dan Kami tidak mengutus engkau (Muhammad) melainkan untuk menjadi rahmat bagi semesta alam.",
    },
    torah: {
      ref: "Taurat (Keluaran 34:6)",
      text: "TUHAN, TUHAN, Allah penyayang dan pengasih, panjang sabar, berlimpah kasih-Nya dan setia-Nya.",
    },
    psalms: {
      ref: "Zabur (Mazmur 145:9)",
      text: "TUHAN itu baik kepada semua orang, dan penuh rahmat terhadap segala yang dijadikan-Nya.",
    },
    gospel: {
      ref: "Injil (Lukas 6:36)",
      text: "Hendaklah kamu murah hati, sama seperti Bapamu adalah murah hati.",
    },
  },
]

export function MatriksKitabView() {
  const [activeTab, setActiveTab] = useState(0)

  const activePassage = MATRIX_DATA[activeTab] ?? MATRIX_DATA[0]!

  return (
    <div
      className="theme-grid-bg min-h-screen py-10 font-mono text-foreground"
      suppressHydrationWarning
    >
      <div className="mx-auto max-w-6xl space-y-6 px-4 sm:px-6">
        <ContextBlock
          title="MATRIKS KOMPARATIF MANUSKRIP SUCI PARALEL"
          subtitle="Menampilkan keselarasan ayat-ayat pembawa kebenaran tauhid dari Al-Qur'anul Karim, Taurat, Zabur, dan Injil dalam satu matriks komparatif ilmiah."
          operation="CROSS-SCRIPTURE-ANALYSIS"
          status="ONLINE"
          accentColor="primary"
        />

        {/* Theme Selectors */}
        <div className="flex flex-wrap gap-2">
          {MATRIX_DATA.map((item, idx) => (
            <button
              key={idx}
              onClick={() => setActiveTab(idx)}
              className={`rounded-md border px-4 py-2.5 text-xs font-extrabold tracking-wider transition-all ${
                activeTab === idx
                  ? "border-primary bg-primary/20 text-primary shadow-sm"
                  : "bg-background border-primary/20 text-primary hover:text-white"
              }`}
            >
              ◆ {item.theme}
            </button>
          ))}
        </div>

        {/* Comparative Matrix Display Grid */}
        <div className="space-y-4">
          <div className="bg-panel rounded-md space-y-1 border border-primary/30 p-4">
            <span className="text-[10px] font-bold text-primary uppercase">
              {/* FOKUS TEMA MATRIKS: */}
            </span>
            <h3 className="font-sans text-base font-black text-foreground">
              {activePassage.theme}
            </h3>
            <p className="text-xs text-primary">{activePassage.themeDesc}</p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* Al-Qur'an Card */}
            <div className="rounded-xl border border-border/40 bg-card/90 bg-background/95 space-y-3 border border-primary/60 p-5 shadow-sm">
              <div className="flex items-center justify-between border-b border-primary/20 pb-2">
                <span className="font-sans flex items-center gap-1.5 text-xs font-bold text-primary">
                  <BookOpen className="h-4 w-4 text-primary" />
                  AL-QUR'ANUL KARIM
                </span>
                <span className="rounded-md rounded-md px-2 py-0.5 text-[8px]">
                  {activePassage.quran.ref}
                </span>
              </div>
              <div className="arabic-text text-right text-lg leading-loose font-bold text-foreground">
                {activePassage.quran.arabic}
              </div>
              <p className="text-xs leading-relaxed text-primary italic">
                &ldquo;{activePassage.quran.text}&rdquo;
              </p>
            </div>

            {/* Taurat Card */}
            <div className="rounded-xl border border-border/40 bg-card/90 bg-background/95 space-y-3 border border-accent/40 p-5">
              <div className="flex items-center justify-between border-b border-accent/20 pb-2">
                <span className="font-sans flex items-center gap-1.5 text-xs font-bold text-accent">
                  <Scroll className="h-4 w-4 text-accent" />
                  TAURAT (TORAH)
                </span>
                <span className="rounded-md border border-amber-500/40 bg-amber-500/10 text-amber-500 px-2 py-0.5 font-mono text-[8px]">
                  {activePassage.torah.ref}
                </span>
              </div>
              <p className="pt-2 text-xs leading-relaxed text-foreground/90 italic">
                &ldquo;{activePassage.torah.text}&rdquo;
              </p>
            </div>

            {/* Zabur Card */}
            <div className="rounded-xl border border-border/40 bg-card/90 border-success/40 bg-background/95 space-y-3 border p-5">
              <div className="border-success/20 flex items-center justify-between border-b pb-2">
                <span className="text-success font-sans flex items-center gap-1.5 text-xs font-bold">
                  <ShieldCheck className="text-success h-4 w-4" />
                  ZABUR (PSALMS)
                </span>
                <span className="rounded-md border border-emerald-500/40 bg-emerald-500/10 text-emerald-500 px-2 py-0.5 font-mono text-[8px]">
                  {activePassage.psalms.ref}
                </span>
              </div>
              <p className="pt-2 text-xs leading-relaxed text-foreground/90 italic">
                &ldquo;{activePassage.psalms.text}&rdquo;
              </p>
            </div>

            {/* Injil Card */}
            <div className="rounded-xl border border-border/40 bg-card/90 bg-background/95 space-y-3 border border-primary/40 p-5">
              <div className="flex items-center justify-between border-b border-primary/20 pb-2">
                <span className="font-sans flex items-center gap-1.5 text-xs font-bold text-primary">
                  <Compass className="h-4 w-4 text-primary" />
                  INJIL (GOSPEL)
                </span>
                <span className="rounded-md border border-border bg-muted text-primary px-2 py-0.5 font-mono text-[8px]">
                  {activePassage.gospel.ref}
                </span>
              </div>
              <p className="pt-2 text-xs leading-relaxed text-foreground/90 italic">
                &ldquo;{activePassage.gospel.text}&rdquo;
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
