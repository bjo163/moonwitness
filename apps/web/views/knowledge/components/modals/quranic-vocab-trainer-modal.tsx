"use client"

import { useState, useEffect } from "react"
import { BookOpen, RefreshCw } from "lucide-react"
import { Modal } from "@workspace/ui"
import { ModalTrigger } from "@workspace/ui"

type VocabCard = {
  arabic: string
  transliteration: string
  meaning: string
  quranOccurrence: number
  sampleAyah: string
}

const QURANIC_VOCABS: VocabCard[] = [
  {
    arabic: "رَحْمَة",
    transliteration: "Rahmat",
    meaning: "Kasih Sayang & Rahmat Ilahi",
    quranOccurrence: 114,
    sampleAyah: "وَمَا أَرْسَلْنَاكَ إِلَّا رَحْمَةً لِّلْعَالَمِينَ",
  },
  {
    arabic: "حِكْمَة",
    transliteration: "Hikmah",
    meaning: "Kebijaksanaan Mendalam",
    quranOccurrence: 20,
    sampleAyah: "يُؤْتِي الْحِكْمَةَ مَن يَشَاءُ",
  },
  {
    arabic: "تَقْوَىٰ",
    transliteration: "Taqwa",
    meaning: "Kesadaran & Ketakwaan Kepada Allah",
    quranOccurrence: 258,
    sampleAyah: "إِنَّ أَكْرَمَكُمْ عِندَ اللَّهِ أَتْقَاكُمْ",
  },
  {
    arabic: "صَبْر",
    transliteration: "Sabr",
    meaning: "Kesabaran & Keteguhan Jiwa",
    quranOccurrence: 103,
    sampleAyah: "إِنَّ اللَّهَ مَعَ الصَّابِرِينَ",
  },
]

export function QuranicVocabTrainerModal() {
  const [mounted, setMounted] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [cardIdx, setCardIdx] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)

  useEffect(() => {
    setTimeout(() => setMounted(true), 0)
  }, [])

  const currentCard = QURANIC_VOCABS[cardIdx] || QURANIC_VOCABS[0]!

  function nextCard() {
    setIsFlipped(false)
    setCardIdx((prev) => (prev + 1) % QURANIC_VOCABS.length)
  }

  return (
    <>
      <ModalTrigger
        icon={BookOpen}
        label="[ QURAN VOCAB TRAINER ]"
        onClick={() => {
          setIsFlipped(false)
          setIsOpen(true)
        }}
        title="Buka Pelatih Kosakata Al-Qur'an V5.0"
        color="cyan"
      />

      <Modal
        isOpen={isOpen && mounted}
        onClose={() => setIsOpen(false)}
        title="// HIGH-FREQUENCY QURANIC VOCAB TRAINER V5.0"
        icon={BookOpen}
        maxWidth="max-w-lg"
      >
        <div className="flex flex-col items-center space-y-4 p-6 text-center">
          <span className="text-[10px] text-muted">
            KARTU {cardIdx + 1} DARI {QURANIC_VOCABS.length} • TEREDUKSI{" "}
            {currentCard.quranOccurrence}x DI AL-QUR&apos;AN
          </span>

          {/* Flashcard Component */}
          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className="bg-space tag-clip flex min-h-48 w-full cursor-pointer flex-col items-center justify-center space-y-3 border-2 border-primary/50 p-8 transition-all hover:border-primary"
          >
            {!isFlipped ? (
              <>
                <span className="arabic-text text-4xl font-black text-primary">
                  {currentCard.arabic}
                </span>
                <span className="text-xs font-bold text-muted">
                  [ KLIK UNTUK MEMBUKA MAKNA ]
                </span>
              </>
            ) : (
              <>
                <span className="font-display text-xl font-bold text-accent">
                  {currentCard.transliteration}
                </span>
                <p className="text-sm font-bold text-foreground">
                  &ldquo;{currentCard.meaning}&rdquo;
                </p>
                <p className="text-success arabic-text pt-2 text-[10px] italic">
                  {currentCard.sampleAyah}
                </p>
              </>
            )}
          </div>

          <button
            onClick={nextCard}
            className="btn-primary flex items-center gap-2 border-primary px-6 py-2.5 text-xs font-bold text-primary btn-clip hover:bg-primary/10"
          >
            <RefreshCw className="h-4 w-4 text-primary" />
            <span>[ KARTU BERIKUTNYA ]</span>
          </button>
        </div>
      </Modal>
    </>
  )
}
