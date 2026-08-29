"use client"

import { useState, useEffect } from "react"
import { Sparkles } from "lucide-react"
import { Modal } from "@workspace/ui"
import { ModalTrigger } from "@workspace/ui"

type DhikrStep = {
  title: string
  arabic: string
  latin: string
  translation: string
  targetCount: number
}

const POST_PRAYER_STEPS: DhikrStep[] = [
  {
    title: "1. ISTIGHFAR (MEMOHON AMPUNAN)",
    arabic: "أَسْتَغْفِرُ اللَّهَ (٣x)",
    latin: "Astaghfirullah (3x)",
    translation: "Aku memohon ampunan kepada Allah.",
    targetCount: 3,
  },
  {
    title: "2. DOA KESELAMATAN (ALLAHUMMA ANTAS SALAM)",
    arabic:
      "اللَّهُمَّ أَنْتَ السَّلَامُ وَمِنْكَ السَّلَامُ تَبَارَكْتَ يَا ذَا الْجَلَالِ وَالْإِكْرَامِ",
    latin:
      "Allahumma antas-salamu wa minkas-salam, tabarakta ya dhal-jalali wal-ikram",
    translation:
      "Ya Allah, Engkau adalah Maha Sejahtera dan dari-Mulah kesejahteraan.",
    targetCount: 1,
  },
  {
    title: "3. AYAT KURSI (BENTENG PERLINDUNGAN)",
    arabic: "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ...",
    latin: "Allahula ilaha illa huwal-hayyul-qayyum...",
    translation:
      "Allah, tidak ada tuhan selain Dia Yang Mahahidup lagi terus-menerus mengurus (makhluk-Nya).",
    targetCount: 1,
  },
  {
    title: "4. TASBIH (MENSUCIKAN ALLAH)",
    arabic: "سُبْحَانَ اللَّهِ (٣٣x)",
    latin: "Subhanallah (33x)",
    translation: "Maha Suci Allah.",
    targetCount: 33,
  },
  {
    title: "5. TAHMID (MEMUJI ALLAH)",
    arabic: "الْحَمْدُ لِلَّهِ (٣٣x)",
    latin: "Alhamdulillah (33x)",
    translation: "Segala puji bagi Allah.",
    targetCount: 33,
  },
  {
    title: "6. TAKBIR (MENGAGUNGKAN ALLAH)",
    arabic: "اللَّهُ أَكْبَرُ (٣٣x)",
    latin: "Allahu Akbar (33x)",
    translation: "Allah Maha Besar.",
    targetCount: 33,
  },
]

export function PostPrayerAdhkarModal() {
  const [mounted, setMounted] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [stepIdx, setStepIdx] = useState(0)
  const [currentCount, setCurrentCount] = useState(0)

  useEffect(() => {
    setTimeout(() => setMounted(true), 0)
  }, [])

  const currentStep = POST_PRAYER_STEPS[stepIdx] || POST_PRAYER_STEPS[0]!

  function handleTap() {
    if (currentCount + 1 >= currentStep.targetCount) {
      if (stepIdx + 1 < POST_PRAYER_STEPS.length) {
        setStepIdx((prev) => prev + 1)
        setCurrentCount(0)
      } else {
        // Finished
        setCurrentCount(currentStep.targetCount)
      }
    } else {
      setCurrentCount((prev) => prev + 1)
    }
  }

  function reset() {
    setStepIdx(0)
    setCurrentCount(0)
  }

  return (
    <>
      <ModalTrigger
        icon={Sparkles}
        label="[ DZIKIR BA'DA SHALAT ]"
        onClick={() => {
          reset()
          setIsOpen(true)
        }}
        title="Buka Asisten Dzikir Ba'da Shalat"
        color="yellow"
      />

      <Modal
        isOpen={isOpen && mounted}
        onClose={() => setIsOpen(false)}
        title="// POST-PRAYER ADHKAR COMPANION"
        icon={Sparkles}
        maxWidth="max-w-lg"
        borderColor="border-accent/60"
        glowColor="rgba(255,230,0,0.3)"
      >
        <div className="space-y-4 p-6 text-center">
          <div className="flex items-center justify-between text-[10px] text-muted">
            <span>
              LANGKAH {stepIdx + 1} DARI {POST_PRAYER_STEPS.length}
            </span>
            <span className="text-success font-bold">
              TARGET: {currentStep.targetCount}x
            </span>
          </div>

          <div className="rounded-md border border-amber-500/40 bg-amber-500/10 text-amber-500 w-full p-2 font-mono text-xs font-bold">
            {currentStep.title}
          </div>

          <div className="arabic-text py-2 text-2xl leading-loose font-black text-accent sm:text-3xl">
            {currentStep.arabic}
          </div>

          <p className="text-xs font-bold text-primary italic">
            &ldquo;{currentStep.latin}&rdquo;
          </p>
          <p className="text-[10px] text-muted">{currentStep.translation}</p>

          {/* Tap Counter Button */}
          <div className="pt-2">
            <button
              onClick={handleTap}
              className="mx-auto flex h-32 w-32 cursor-pointer flex-col items-center justify-center rounded-full border-4 border-accent bg-accent/15 shadow-[0_0_30px_rgba(255,230,0,0.3)] transition-all hover:bg-accent/30 active:scale-95"
            >
              <span className="text-3xl font-black text-accent">
                {currentCount}
              </span>
              <span className="text-[9px] font-bold text-muted">
                / {currentStep.targetCount} TAP
              </span>
            </button>
          </div>
        </div>
      </Modal>
    </>
  )
}
