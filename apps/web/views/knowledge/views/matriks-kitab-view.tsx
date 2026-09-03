"use client"

import { useState } from "react"
import { BookOpen, Scroll, ShieldCheck, Compass } from "lucide-react"
import { ContextBlock, CitationBox, EpistemicBadge } from "@workspace/ui"

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
    theme: "KEADILAN & TIMBANGAN SOSIAL",
    themeDesc:
      "Menegakkan neraca keadilan dan membela kaum mustadh'afin (lemah/tertindas).",
    quran: {
      ref: "Q.S Ar-Rahman (55:9) & An-Nisa (4:135)",
      arabic: "وَأَقِيمُوا الْوَزْنَ بِالْقِسْطِ وَلَا تُخْسِرُوا الْمِيزَانَ",
      text: "Dan tegakkanlah timbangan itu dengan adil dan janganlah kamu mengurangi neraca itu.",
    },
    torah: {
      ref: "Taurat (Imamat 19:35-36)",
      text: "Janganlah kamu berbuat curang dalam hukum, dalam ukuran panjang, timbangan dan sukat. Neraca yang betul, batu timbangan yang betul haruslah kamu miliki.",
    },
    psalms: {
      ref: "Zabur (Mazmur 82:3)",
      text: "Berilah keadilan kepada orang yang lemah dan kepada anak yatim, belalah hak orang yang tertindas dan orang yang miskin!",
    },
    gospel: {
      ref: "Injil (Lukas 6:38)",
      text: "Berilah dan kamu akan diberi: suatu takaran yang baik, yang dipadatkan, yang digoncang dan yang tumpah ke luar akan dicurahkan ke dalam ribaanmu.",
    },
  },
]

export function MatriksKitabView() {
  const [selectedIdx, setSelectedIdx] = useState(0)
  const activePassage = MATRIX_DATA[selectedIdx] || MATRIX_DATA[0]!

  return (
    <div
      className="min-h-screen py-10 font-sans text-foreground bg-background"
      suppressHydrationWarning
    >
      <div className="mx-auto max-w-6xl space-y-6 px-4 sm:px-6">
        <ContextBlock
          title="MATRIKS KONSISTENSI KITAB SUCI GLOBAL"
          subtitle="Komparasi tematik lintas teks suci abrahamik: Al-Qur'an, Taurat, Zabur, dan Injil untuk melihat benang merah wahyu Ilahi."
          operation="CROSS-REVELATION-MATRIX"
          status="ONLINE"
          accentColor="primary"
        />

        {/* Theme Selection Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-border pb-4">
          {MATRIX_DATA.map((item, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedIdx(idx)}
              className={`rounded-lg px-4 py-2 text-xs font-semibold transition-colors ${
                selectedIdx === idx
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              }`}
            >
              {item.theme}
            </button>
          ))}
        </div>

        {/* Comparative Matrix Display Grid */}
        <div className="space-y-4">
          <div className="rounded-lg border border-border bg-card p-4 space-y-1">
            <h3 className="font-sans text-base font-semibold text-foreground">
              {activePassage.theme}
            </h3>
            <p className="text-xs text-muted-foreground">{activePassage.themeDesc}</p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* Al-Qur'an Card */}
            <div className="rounded-xl border border-border bg-card space-y-3 p-5 shadow-sm">
              <div className="flex items-center justify-between border-b border-border pb-2">
                <span className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                  <BookOpen className="h-4 w-4 text-primary" />
                  Al-Qur&apos;anul Karim
                </span>
                <EpistemicBadge authority="REVELATION" contentKind="ORIGINAL_TEXT" />
              </div>
              <div lang="ar" dir="rtl" className="font-arabic text-right text-xl leading-loose text-foreground">
                {activePassage.quran.arabic}
              </div>
              <p className="text-xs leading-relaxed text-muted-foreground italic">
                &ldquo;{activePassage.quran.text}&rdquo;
              </p>
              <div className="text-right text-[11px] font-mono text-primary">
                {activePassage.quran.ref}
              </div>
            </div>

            {/* Taurat Card */}
            <div className="rounded-xl border border-border bg-card space-y-3 p-5 shadow-sm">
              <div className="flex items-center justify-between border-b border-border pb-2">
                <span className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                  <Scroll className="h-4 w-4 text-primary" />
                  Taurat (Torah)
                </span>
                <EpistemicBadge authority="REVELATION" contentKind="TRANSLATION" />
              </div>
              <p className="pt-2 text-xs leading-relaxed text-muted-foreground italic">
                &ldquo;{activePassage.torah.text}&rdquo;
              </p>
              <div className="text-right text-[11px] font-mono text-muted-foreground">
                {activePassage.torah.ref}
              </div>
            </div>

            {/* Zabur Card */}
            <div className="rounded-xl border border-border bg-card space-y-3 p-5 shadow-sm">
              <div className="flex items-center justify-between border-b border-border pb-2">
                <span className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                  <ShieldCheck className="h-4 w-4 text-primary" />
                  Zabur (Psalms)
                </span>
                <EpistemicBadge authority="REVELATION" contentKind="TRANSLATION" />
              </div>
              <p className="pt-2 text-xs leading-relaxed text-muted-foreground italic">
                &ldquo;{activePassage.psalms.text}&rdquo;
              </p>
              <div className="text-right text-[11px] font-mono text-muted-foreground">
                {activePassage.psalms.ref}
              </div>
            </div>

            {/* Injil Card */}
            <div className="rounded-xl border border-border bg-card space-y-3 p-5 shadow-sm">
              <div className="flex items-center justify-between border-b border-border pb-2">
                <span className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                  <Compass className="h-4 w-4 text-primary" />
                  Injil (Gospel)
                </span>
                <EpistemicBadge authority="REVELATION" contentKind="TRANSLATION" />
              </div>
              <p className="pt-2 text-xs leading-relaxed text-muted-foreground italic">
                &ldquo;{activePassage.gospel.text}&rdquo;
              </p>
              <div className="text-right text-[11px] font-mono text-muted-foreground">
                {activePassage.gospel.ref}
              </div>
            </div>
          </div>

          {/* Citation Box */}
          <div className="pt-4">
            <CitationBox
              title="Abrahamic Scripture Concordance"
              sourceName="Cross-Tradition Scripture Dataset"
              edition="Thematic Parallel Passages"
              reference={activePassage.theme}
              language="Multi-language (ar, he, id)"
              revision="1.0.0"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
