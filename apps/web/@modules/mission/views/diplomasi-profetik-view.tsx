"use client"

import { useState } from "react"
import { useLanguage } from "@core/contexts"
import { ContextBlock } from "@core/ui"

type ScenarioStep = {
  id: string
  title: string
  context: string
  options: {
    label: string
    isPropheticChoice: boolean
    explanation: string
  }[]
}

const DIPLOMACY_SCENARIOS: ScenarioStep[] = [
  {
    id: "hudaibiyyah",
    title: "1. NEGOSIASI PERJANJIAN HUDAIBIYYAH (SOFT DIPLOMACY)",
    context:
      "Pihak lawan menolak tulisan 'Bismillahirrahmanirrahim' dan 'Muhammad Rasulullah' dalam naskah perjanjian damai. Apa langkah diplomasi terbaik?",
    options: [
      {
        label:
          "Hapus gelar dan ganti dengan 'Muhammad bin Abdullah' demi tercapainya gencatan senjata dan perdamaian jangka panjang.",
        isPropheticChoice: true,
        explanation:
          "Pilihan Profetik Shahih! Rasulullah SAW menghapus sendiri kalimat tersebut demi tujuan strategis perdamaian jangka panjang yang kemudian melahirkan Fathu Makkah.",
      },
      {
        label:
          "Menolak bernegosiasi dan membatalkan seluruh isi perjanjian damai.",
        isPropheticChoice: false,
        explanation:
          "Kurang Tepat. Membatalkan negosiasi hanya akan menutup pintu dialog damai.",
      },
    ],
  },
  {
    id: "madinah",
    title: "2. KONSENSUS PIAGAM MADINAH (INKLUSIVITAS LINTAS IMAN)",
    context:
      "Bagaimana mengatur konstitusi hak dan kewajiban antara kaum Muslimin, kaum Yahudi, dan suku-suku Arab di Madinah?",
    options: [
      {
        label:
          "Menjadikan seluruh warga Madinah sebagai satu umat (Ummah Wahidah) yang saling membela dari serangan luar dan bebas menjalankan agama masing-masing.",
        isPropheticChoice: true,
        explanation:
          "Pilihan Profetik Shahih! Ini adalah Pasal Utama Piagam Madinah yang menjamin kebebasan beragama dan pertahanan bersama.",
      },
      {
        label:
          "Memaksa seluruh warganya untuk mengikuti satu mazhab keyakinan saja.",
        isPropheticChoice: false,
        explanation:
          "Kurang Tepat. Al-Qur'an dan Sunnah melarang paksaan dalam beragama (Q.S Al-Baqarah: 256).",
      },
    ],
  },
]

export function DiplomasiProfetikView() {
  const { t } = useLanguage()
  const [selectedScenarioIdx, setSelectedScenarioIdx] = useState(0)
  const [chosenOption, setChosenOption] = useState<number | null>(null)

  const scenario =
    DIPLOMACY_SCENARIOS[selectedScenarioIdx] || DIPLOMACY_SCENARIOS[0]!

  return (
    <div
      className="theme-grid-bg min-h-screen py-10 font-mono text-foreground"
      suppressHydrationWarning
    >
      <div className="mx-auto max-w-4xl space-y-6 px-4 sm:px-6">
        <ContextBlock
          title="SIMULATOR DIPLOMASI & PERJANJIAN PROFETIK"
          subtitle="Pelajari cara diplomasi lembut (Soft Diplomacy), teknik negosiasi tingkat tinggi, dan penandatanganan perjanjian damai yang dilakukan oleh Rasulullah SAW (e.g. Piagam Madinah, Perjanjian Hudaibiyyah)."
          operation="PROPHETIC-DIPLOMACY-SIM"
          status="ONLINE"
          accentColor="knowledge"
        />

        {/* Scenario Card */}
        <div className="panel-box bg-space space-y-4 border border-primary/40 p-6 font-mono">
          <div className="flex items-center justify-between border-b border-primary/20 pb-2">
            <span className="text-xs font-bold text-primary">
              {scenario.title}
            </span>
            <span className="tag-clip tag-clip-purple tag-clip text-[9px]">
              SKENARIO {selectedScenarioIdx + 1} / {DIPLOMACY_SCENARIOS.length}
            </span>
          </div>

          <p className="bg-panel tag-clip border border-primary/20 p-4 text-xs leading-relaxed text-foreground">
            &ldquo;{scenario.context}&rdquo;
          </p>

          <div className="space-y-3 pt-2">
            {scenario.options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => setChosenOption(idx)}
                className={`tag-clip w-full cursor-pointer space-y-2 border p-4 text-left text-xs transition-all ${
                  chosenOption === idx
                    ? opt.isPropheticChoice
                      ? "border-success bg-success/15 text-success"
                      : "border-danger bg-danger/15 text-danger"
                    : "bg-space border-primary/30 hover:border-primary"
                }`}
              >
                <div className="flex items-center gap-2 font-bold">
                  <span>{opt.label}</span>
                </div>

                {chosenOption === idx && (
                  <p className="border-t border-current/20 pt-2 text-[10px] text-foreground italic">
                    {opt.explanation}
                  </p>
                )}
              </button>
            ))}
          </div>

          {selectedScenarioIdx + 1 < DIPLOMACY_SCENARIOS.length && (
            <button
              onClick={() => {
                setSelectedScenarioIdx((prev) => prev + 1)
                setChosenOption(null)
              }}
              className="btn-primary mt-2 w-full py-2.5 text-xs font-bold btn-clip"
            >
              <span>SKENARIO DIPLOMASI BERIKUTNYA →</span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
