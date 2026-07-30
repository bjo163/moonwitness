"use client"

import { useState } from "react"
import { useLanguage } from "@core/contexts"
import { ContextBlock } from "@core/ui"

type DoaItem = {
  id: string
  title: string
  arabic: string
  latin: string
  translationId: string
  reference: string
  category: string
}

const DOA_LIST: DoaItem[] = [
  {
    id: "doa-pagi",
    title: "Doa Memohon Rahmat & Ilmu (Dzikir Pagi)",
    arabic:
      "اللَّهُمَّ إِنِّي أَسْأَلُكَ عِلْمًا نَافِعًا وَرِزْقًا طَيِّبًا وَعَمَلاً مُتَقَبَّلاً",
    latin:
      "Allahumma inni as-aluka 'ilman nafi'an, wa rizqan thayyiban, wa 'amalan mutaqabbala.",
    translationId:
      "Ya Allah, sesungguhnya aku memohon kepada-Mu ilmu yang bermanfaat, rezeki yang baik, dan amalan yang diterima.",
    reference: "HR. Ibnu Majah & An-Nasa'i",
    category: "PAGI & SORE",
  },
  {
    id: "doa-tidur",
    title: "Doa Sebelum Tidur",
    arabic: "بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا",
    latin: "Bismikallahumma amutu wa ahya.",
    translationId: "Dengan nama-Mu ya Allah aku mati dan aku hidup.",
    reference: "HR. Al-Bukhari & Muslim",
    category: "HARIAN",
  },
  {
    id: "doa-keluar-rumah",
    title: "Doa Keluar Rumah (Perlindungan)",
    arabic:
      "بِسْمِ اللَّهِ تَوَكَّلْتُ عَلَى اللَّهِ وَلاَ حَوْلَ وَلاَ قُوَّةَ إِلاَّ بِاللَّهِ",
    latin:
      "Bismillahi tawakkaltu 'alallah, wa la haula wa la quwwata illa billah.",
    translationId:
      "Dengan nama Allah, aku bertawakal kepada Allah. Tiada daya dan kekuatan melainkan dengan pertolongan Allah.",
    reference: "HR. Abu Daud & At-Tirmidzi",
    category: "PERJALANAN",
  },
  {
    id: "doa-perlindungan",
    title: "Doa Perlindungan Dari Segala Bahaya",
    arabic:
      "بِسْمِ اللَّهِ الَّذِي لاَ يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الأَرْضِ وَلاَ فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ",
    latin:
      "Bismillahilladzi la yadhurru ma'asmihi syai-un fil ardhi wa la fis-sama-i wa huwas-sami'ul 'alim.",
    translationId:
      "Dengan nama Allah yang bila disebut, segala sesuatu di bumi dan di langit tidak akan berbahaya. Dialah Yang Maha Mendengar lagi Maha Mengetahui.",
    reference: "HR. Abu Daud & At-Tirmidzi",
    category: "PERLINDUNGAN",
  },
]

export function DoaHarianView() {
  const { t } = useLanguage()
  const [activeCategory, setActiveCategory] = useState("ALL")

  const filteredDoa =
    activeCategory === "ALL"
      ? DOA_LIST
      : DOA_LIST.filter((d) => d.category === activeCategory)

  return (
    <div
      className="theme-grid-bg min-h-screen py-10 font-mono text-foreground"
      suppressHydrationWarning
    >
      <div className="mx-auto max-w-5xl space-y-6 px-4 sm:px-6">
        <ContextBlock
          title="PROPHETIC ADHKAR & SUPPLICATIONS"
          subtitle="Kumpulan doa dan dzikir shahih harian dari Rasulullah SAW sebagai benteng taktis perlindungan jiwa dan raga dalam setiap helaan nafas."
          operation="ADHKAR-SYNC-ROUTINE"
          status="ONLINE"
          accentColor="astronomy"
        />

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2">
          {["ALL", "PAGI & SORE", "HARIAN", "PERJALANAN", "PERLINDUNGAN"].map(
            (cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`tag-clip border px-3 py-1.5 text-xs font-bold transition-all ${
                  activeCategory === cat
                    ? "border-accent bg-accent/20 text-accent"
                    : "bg-space border-primary/20 text-primary"
                }`}
              >
                ◆ {cat}
              </button>
            )
          )}
        </div>

        {/* Doa List */}
        <div className="space-y-4">
          {filteredDoa.map((item) => (
            <div
              key={item.id}
              className="panel-box bg-space tag-clip space-y-3 border border-primary/30 p-6"
            >
              <div className="flex items-center justify-between border-b border-primary/20 pb-2">
                <h3 className="font-display text-sm font-bold text-foreground">
                  {item.title}
                </h3>
                <span className="tag-clip tag-clip-yellow tag-clip px-2 py-0.5 text-[8px] font-bold">
                  {item.reference}
                </span>
              </div>

              <div className="arabic-text py-1 text-right text-xl leading-loose font-bold text-accent sm:text-2xl">
                {item.arabic}
              </div>

              <div className="text-xs font-bold text-primary">{item.latin}</div>
              <p className="text-xs text-primary italic">
                &ldquo;{item.translationId}&rdquo;
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

