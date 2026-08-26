"use client"

import { useState } from "react"
import Link from "next/link"
import { Search, Hash } from "lucide-react"
import { ContextBlock } from "@core/ui"

type RootWordEntry = {
  rootArabic: string
  rootLatin: string
  meaningId: string
  meaningEn: string
  frequency: number
  derivedWords: string[]
  sampleAyah: {
    surahName: string
    surahNum: number
    ayahNum: number
    textArabic: string
    translationId: string
  }
}

const ROOT_DICTIONARY: RootWordEntry[] = [
  {
    rootArabic: "ر - ح - م",
    rootLatin: "R - H - M",
    meaningId: "Kasih Sayang, Rahmat, Pengasihan, Pengampunan",
    meaningEn: "Mercy, Compassion, Loving-kindness",
    frequency: 339,
    derivedWords: [
      "الرَّحْمَٰنُ (Ar-Rahman)",
      "الرَّحِيمُ (Ar-Rahim)",
      "رَحْمَةً (Rahmah)",
      "مَرْحَمَةٍ (Marhamah)",
    ],
    sampleAyah: {
      surahName: "Al-Fatihah",
      surahNum: 1,
      ayahNum: 3,
      textArabic: "الرَّحْمَٰنِ الرَّحِيمِ",
      translationId: "Maha Pengasih, Maha Penyayang.",
    },
  },
  {
    rootArabic: "ع - ل - م",
    rootLatin: "'- L - M",
    meaningId: "Ilmu, Pengetahuan, Mengajar, Mengetahui, Alam Semesta",
    meaningEn: "Knowledge, Science, Universe, Learning",
    frequency: 854,
    derivedWords: [
      "الْعَلِيمُ (Al-'Alim)",
      "عَلَّمَ ('Allama)",
      "يَعْلَمُونَ (Ya'lamun)",
      "الْعَالَمِينَ (Al-'Alamin)",
    ],
    sampleAyah: {
      surahName: "Al-Alaq",
      surahNum: 96,
      ayahNum: 5,
      textArabic: "عَلَّمَ الْإِنسَانَ مَا لَمْ يَعْلَمْ",
      translationId: "Dia mengajarkan manusia apa yang tidak diketahuinya.",
    },
  },
  {
    rootArabic: "ح - ك - م",
    rootLatin: "H - K - M",
    meaningId: "Hikmah, Kebijaksanaan, Hukum, Keputusan, Keadilan",
    meaningEn: "Wisdom, Judgment, Law, Governance",
    frequency: 210,
    derivedWords: [
      "الْحَكِيمُ (Al-Hakim)",
      "حُكْمًا (Hukman)",
      "الْحِكْمَةَ (Al-Hikmah)",
      "يَحْكُمُ (Yahkumu)",
    ],
    sampleAyah: {
      surahName: "Al-Baqarah",
      surahNum: 2,
      ayahNum: 269,
      textArabic: "يُؤْتِي الْحِكْمَةَ مَن يَشَاءُ",
      translationId: "Dia memberikan hikmah kepada siapa yang Dia kehendaki.",
    },
  },
  {
    rootArabic: "ن - و - ر",
    rootLatin: "N - W - R",
    meaningId: "Cahaya, Sinar, Petunjuk, Penerangan",
    meaningEn: "Light, Illumination, Guidance",
    frequency: 194,
    derivedWords: [
      "النُّورُ (An-Nur)",
      "مُنِيرًا (Munira)",
      "نُورُهُمْ (Nuruhum)",
      "يُنَوِّرُ (Yunawwiru)",
    ],
    sampleAyah: {
      surahName: "An-Nur",
      surahNum: 24,
      ayahNum: 35,
      textArabic: "اللَّهُ نُورُ السَّمَاوَاتِ وَالْأَرْضِ",
      translationId: "Allah (Pemberi) cahaya (kepada) langit dan bumi.",
    },
  },
  {
    rootArabic: "ق - د - س",
    rootLatin: "Q - D - S",
    meaningId: "Kesucian, Kebersihan Dari Cacat, Keterkaitan Ilahi",
    meaningEn: "Holiness, Sanctity, Purity",
    frequency: 10,
    derivedWords: [
      "الْقُدُّوسُ (Al-Quddus)",
      "الْمُقَدَّسِ (Al-Muqaddas)",
      "رُوحِ الْقُدُسِ (Ruhul Qudus)",
    ],
    sampleAyah: {
      surahName: "Al-Hasyr",
      surahNum: 59,
      ayahNum: 23,
      textArabic: "الْمَلِكُ الْقُدُّوسُ السَّلاَمُ",
      translationId: "Maharaja, Yang Mahasuci, Yang Mahasuci.",
    },
  },
]

export function KamusAkarKataView() {
  const [query, setQuery] = useState("")

  const filteredRoots =
    query.trim() === ""
      ? ROOT_DICTIONARY
      : ROOT_DICTIONARY.filter(
          (r) =>
            r.rootArabic.includes(query) ||
            r.rootLatin.toLowerCase().includes(query.toLowerCase()) ||
            r.meaningId.toLowerCase().includes(query.toLowerCase())
        )

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

        {/* Search Bar */}
        <div className="panel-box bg-space/90 flex items-center gap-3 border border-primary/40 p-4">
          <Search className="h-5 w-5 text-primary" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari akar kata (misal: R-H-M, Rahmat, Kasih Sayang, ر ح م)..."
            className="w-full bg-transparent font-mono text-sm text-foreground placeholder-[#8B9BB0] focus:outline-none"
          />
        </div>

        {/* Root Word Cards List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs font-bold text-primary">
            <span>
              {/* HASIL ENSIKLOPEDIA AKAR KATA ({filteredRoots.length}) */}
            </span>
            <span className="text-[10px] text-primary">
              LEMBAR SEMANTIK ARAB PRIMORDIAL
            </span>
          </div>

          <div className="space-y-4">
            {filteredRoots.map((entry, idx) => (
              <div
                key={idx}
                className="panel-box bg-space tag-clip space-y-4 border border-primary/30 p-6"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-primary/20 pb-3">
                  <div className="flex items-center gap-3">
                    <span className="arabic-text bg-panel rounded border border-primary/30 px-3 py-1 text-2xl font-black text-primary">
                      {entry.rootArabic}
                    </span>
                    <div>
                      <h3 className="font-display text-sm font-bold text-foreground">
                        AKAR: {entry.rootLatin}
                      </h3>
                      <p className="text-[10px] text-primary">
                        {entry.meaningId}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="tag-clip tag-clip-yellow tag-clip flex items-center gap-1 px-2 py-1 text-[9px] font-bold">
                      <Hash className="h-3 w-3 text-accent" />
                      <span>{entry.frequency} KALI DI AL-QUR&apos;AN</span>
                    </span>
                  </div>
                </div>

                {/* Derivations */}
                <div className="space-y-1.5 text-xs">
                  <span className="text-[9px] font-bold text-primary uppercase">
                    {/* DERIVASI BENTUK KATA: */}
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {entry.derivedWords.map((d, dIdx) => (
                      <span
                        key={dIdx}
                        className="bg-panel rounded border border-primary/20 px-2.5 py-1 text-xs font-bold text-primary"
                      >
                        {d}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Sample Ayah */}
                <div className="bg-panel space-y-2 rounded border border-primary/20 p-3.5">
                  <div className="flex items-center justify-between text-[10px] font-bold text-primary">
                    <span>
                      {/* CONTOH AYAT (Q.S {entry.sampleAyah.surahName} {entry.sampleAyah.surahNum}:{entry.sampleAyah.ayahNum}) */}
                    </span>
                    <Link
                      href={`/kitab/quran/${entry.sampleAyah.surahNum}`}
                      className="text-success hover:underline"
                    >
                      BUKA SURAH →
                    </Link>
                  </div>
                  <div className="arabic-text text-right text-base leading-relaxed font-bold text-foreground">
                    {entry.sampleAyah.textArabic}
                  </div>
                  <p className="text-xs text-primary italic">
                    &ldquo;{entry.sampleAyah.translationId}&rdquo;
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
