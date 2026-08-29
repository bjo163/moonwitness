"use client"

import React, { useState, useEffect, useCallback, useRef } from "react"
import { HomeHeroTitleWidget } from "../components/home-hero-title-widget"
import { HomeTelemetrySidebarWidget } from "../components/home-telemetry-sidebar-widget"
import { HomePlanetaryTelemetryWidget } from "../components/home-planetary-telemetry-widget"
import { HomeCelestialFeedWidget } from "../components/home-celestial-feed-widget"
import { HomeGlobalCoordinatesWidget } from "../components/home-global-coordinates-widget"
import { SYSTEM_CONSTANTS } from "@workspace/types"

type DailyTransmissionData = {
  ayah?: {
    surahNumber: number | string
    surahName: string
    ayahNumber: number | string
    textArabic: string
    translationId: string
  }
}

const HISTORY_EVENTS = [
  "THE CREATION",
  "THE GREAT FLOOD",
  "PARTING OF THE SEA",
  "THE REVELATION",
  "THE NIGHT JOURNEY",
  "HOUSE OF WISDOM",
  "GOLDEN AGE OF ISLAM",
  "THE RENAISSANCE",
  "PRINTING PRESS",
  "ABOLITION OF SLAVERY",
  "MOON LANDING",
  "INFORMATION AGE",
  "THE SINGULARITY",
  "QUANTUM AWAKENING",
  "FIRST CONTACT",
  "THE ENLIGHTENMENT",
]
const TRAITS = [
  "PATIENCE",
  "SINCERITY",
  "GRATITUDE",
  "TRUST",
  "CERTAINTY",
  "EXCELLENCE",
  "PIETY",
  "CONTENTMENT",
  "PEACE",
  "LOVE",
  "JUSTICE",
  "MERCY",
  "WISDOM",
  "TRUTH",
  "COMPASSION",
  "HUMILITY",
  "COURAGE",
  "INTEGRITY",
]
const AYAH_WORDS = [
  "BISMILLAH",
  "ALHAMDULILLAH",
  "SUBHANALLAH",
  "ALLAHU AKBAR",
  "LA ILAHA ILLALLAH",
  "MASYA ALLAH",
  "TABARAKALLAH",
  "ASTAGHFIRULLAH",
  "HASBUNALLAH",
  "INNA LILLAH",
  "FI AMANILLAH",
  "BARAKALLAH",
]
const PROPHETS = [
  "مُحَمَّد",
  "إِبْرَاهِيم",
  "مُوسَى",
  "عِيسَى",
  "نُوح",
  "آدَم",
  "يُوسُف",
  "دَاوُد",
  "سُلَيْمَان",
  "يُونُس",
  "يَحْيَى",
  "زَكَرِيَّا",
  "إِسْمَاعِيل",
  "إِسْحَاق",
  "يَعْقُوب",
  "أَيُّوب",
  "إِدْرِيس",
  "هُود",
  "صَالِح",
  "شُعَيْب",
]
const NAMES_OF_ALLAH = [
  "اللَّهُ",
  "الرَّحْمَن",
  "الرَّحِيم",
  "الْمَلِك",
  "الْقُدُّوس",
  "الْعَزِيز",
  "الْجَبَّار",
  "الْخَالِق",
  "الْقَهَّار",
  "النُّور",
  "الْحَقّ",
  "الْوَهَّاب",
  "الرَّزَّاق",
  "الْفَتَّاح",
  "الْعَلِيم",
  "الْقَابِض",
  "الْبَاسِط",
  "الْخَافِض",
  "الرَّافِع",
  "الْمُعِزّ",
  "الْمُذِلّ",
  "السَّمِيع",
  "الْبَصِير",
  "الْحَكَم",
  "الْعَدْل",
  "اللَّطِيف",
  "الْخَبِير",
]

const DIVINE_BOOKS_QUOTES = [
  { book: "TAURAT (TORAH)", text: "Love your neighbor as yourself." },
  {
    book: "TAURAT (TORAH)",
    text: "Justice, and only justice, you shall pursue.",
  },
  { book: "ZABUR (PSALMS)", text: "The Lord is my shepherd, I lack nothing." },
  {
    book: "ZABUR (PSALMS)",
    text: "Your word is a lamp for my feet, a light on my path.",
  },
  {
    book: "INJIL (GOSPEL)",
    text: "Blessed are the peacemakers, for they will be called children of God.",
  },
  {
    book: "INJIL (GOSPEL)",
    text: "Ask and it will be given to you; seek and you will find.",
  },
]

const HADITH_SNIPPETS = [
  '"The best among you are those who have the best manners and character." (Sahih Bukhari)',
  '"God does not look at your forms and possessions but he looks at your hearts and your deeds." (Sahih Muslim)',
  '"A good word is a charity." (Sahih Bukhari)',
  '"He who is not merciful to others, will not be treated mercifully." (Sahih Bukhari)',
  '"The strong is not the one who overcomes the people by his strength, but the strong is the one who controls himself while in anger." (Sahih Bukhari)',
]

const AudioWave = () => (
  <div className="flex items-center justify-center gap-1.5 opacity-80">
    <div className="h-4 w-1 animate-[audioWave_0.9s_ease-in-out_infinite] rounded-full bg-primary" />
    <div className="h-4 w-1 animate-[audioWave_1.2s_ease-in-out_infinite_0.2s] rounded-full bg-primary" />
    <div className="h-4 w-1 animate-[audioWave_0.8s_ease-in-out_infinite_0.4s] rounded-full bg-primary" />
    <div className="h-4 w-1 animate-[audioWave_1.1s_ease-in-out_infinite_0.1s] rounded-full bg-primary" />
    <div className="h-4 w-1 animate-[audioWave_1.3s_ease-in-out_infinite_0.3s] rounded-full bg-primary" />
  </div>
)

const MatrixLayer = ({
  words,
  delay,
  colorClass,
  shadowColor,
  colCount,
  speedMult,
  sizeClasses,
}: {
  words: string[]
  delay: number
  colorClass: string
  shadowColor: string
  colCount: number
  speedMult: number
  sizeClasses: string[]
}) => {
  return (
    <div
      className="pointer-events-none absolute inset-0 opacity-0"
      style={{ animation: `fadeInReveal 3s ease-in ${delay}s forwards` }}
    >
      {Array.from({ length: colCount }).map((_, i) => {
        const isUp = i % 2 === 0
        const duration = (6 + Math.random() * 8) * speedMult
        const offsetDelay = Math.random() * 20
        const itemCount = 3 + Math.floor(Math.random() * 3) // Optimized for performance
        const randomGap = [16, 24, 32][Math.floor(Math.random() * 3)] || 24

        // Shuffle words so each column is unique
        const shuffledWords = [...words].sort(() => Math.random() - 0.5)

        return (
          <div
            key={i}
            className={`absolute flex flex-col font-bold ${colorClass} opacity-70 will-change-transform ${isUp ? "animate-[matrixUp_var(--dur)_linear_infinite]" : "animate-[matrixDown_var(--dur)_linear_infinite]"}`}
            style={
              {
                left: `${(i / colCount) * 100}%`,
                gap: `${randomGap * 0.25}rem`,
                "--dur": `${duration}s`,
                animationDelay: `-${offsetDelay}s`,
                filter: `drop-shadow(0 0 8px ${shadowColor})`,
              } as React.CSSProperties
            }
          >
            {Array.from({ length: itemCount }).map((_, j) => {
              const randomSize =
                sizeClasses[Math.floor(Math.random() * sizeClasses.length)]
              return (
                <div
                  key={j}
                  className={randomSize}
                  style={{ opacity: 0.4 + Math.random() * 0.6 }}
                >
                  {shuffledWords[j % shuffledWords.length]}
                </div>
              )
            })}
          </div>
        )
      })}
    </div>
  )
}

const DivineMatrixRain = ({ active }: { active: boolean }) => {
  if (!active) return null

  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      {/* Phase 0: History / Deja Vu (Starts at 0s, fast, mysterious indigo) */}
      <MatrixLayer
        words={HISTORY_EVENTS}
        delay={0}
        colorClass="text-indigo-900/40 font-mono tracking-tight"
        shadowColor="rgba(49, 46, 129, 0.2)"
        colCount={6}
        speedMult={0.8}
        sizeClasses={["text-lg", "text-xl"]}
      />

      {/* Phase 1: Good Traits (Starts at 3s, slow, purple) */}
      <MatrixLayer
        words={TRAITS}
        delay={3}
        colorClass="text-primary/50 font-sans tracking-widest"
        shadowColor="rgba(192, 132, 252, 0.5)"
        colCount={5}
        speedMult={1.5}
        sizeClasses={["text-xl", "text-2xl"]}
      />

      {/* Phase 2: Ayah Words (Starts at 6s, medium speed, ambienting cyan) */}
      <MatrixLayer
        words={AYAH_WORDS}
        delay={6}
        colorClass="text-primary/60 font-mono tracking-widest"
        shadowColor="rgba(34, 211, 238, 0.8)"
        colCount={6}
        speedMult={1.2}
        sizeClasses={["text-2xl", "text-3xl"]}
      />

      {/* Phase 3: Prophets (Starts at 10s, intense emerald) */}
      <MatrixLayer
        words={PROPHETS}
        delay={10}
        colorClass="text-success/80 font-arabic"
        shadowColor="rgba(52, 211, 153, 1)"
        colCount={8}
        speedMult={0.8}
        sizeClasses={["text-3xl", "text-4xl"]}
      />

      {/* Phase 4: Names of ALLAH - Absolute Climax (Starts at 15s) */}
      <MatrixLayer
        words={NAMES_OF_ALLAH}
        delay={15}
        colorClass="text-primary font-arabic"
        shadowColor="rgba(165, 243, 252, 1)"
        colCount={10}
        speedMult={0.5}
        sizeClasses={["text-4xl", "text-5xl", "text-6xl"]}
      />
    </div>
  )
}

export function HomeHeroSection() {
  const [bgIndex, setBgIndex] = useState(0)
  const [dailyData, setDailyData] = useState<DailyTransmissionData | null>(null)
  const [isRevealed, setIsRevealed] = useState(false)
  const [isZapping, setIsZapping] = useState(false)
  const [isShaking, setIsShaking] = useState(false)
  const [isLevelUp, setIsLevelUp] = useState(false)
  const [xpData, setXpData] = useState({ iman: 500, taqwa: 250, ilm: 1000 })
  const [extraDivineData, setExtraDivineData] = useState<{
    bookQuote: { book: string; text: string }
    hadith: string
    asmaulLeft: string
    asmaulRight: string
  } | null>(null)
  const [dataReady, setDataReady] = useState(false)
  const alertFiredRef = useRef(false)
  const dataReadyRef = useRef(false)

  const backgrounds = [
    "/blueprint/BG-HERO-01.png",
    "/blueprint/BG-HERO-02.png",
    "/blueprint/BG-HERO-03.png",
    "/blueprint/BG-HERO-04.png",
    "/blueprint/BG-HERO-05.png",
    "/blueprint/BG-HERO-06.png",
    "/blueprint/BG-HERO-07.png",
    "/blueprint/BG-HERO-08.png",
  ]

  const playIncomingAlertSound = useCallback(() => {
    try {
      const AC = window.AudioContext || (window as any).webkitAudioContext
      if (!AC) return
      const ctx = new AC()
      const now = ctx.currentTime

      for (let i = 0; i < 3; i++) {
        const t = now + i * 0.6
        const ping = ctx.createOscillator()
        const pingGain = ctx.createGain()
        ping.type = "sine"
        ping.connect(pingGain)
        pingGain.connect(ctx.destination)
        ping.frequency.setValueAtTime(880, t)
        ping.frequency.exponentialRampToValueAtTime(440, t + 0.3)
        pingGain.gain.setValueAtTime(0, t)
        pingGain.gain.linearRampToValueAtTime(0.2, t + 0.02)
        pingGain.gain.exponentialRampToValueAtTime(0.001, t + 0.5)
        ping.start(t)
        ping.stop(t + 0.5)
      }

      const rumble = ctx.createOscillator()
      const rumbleGain = ctx.createGain()
      rumble.type = "sawtooth"
      rumble.connect(rumbleGain)
      rumbleGain.connect(ctx.destination)
      rumble.frequency.setValueAtTime(40, now)
      rumble.frequency.linearRampToValueAtTime(80, now + 2)
      rumbleGain.gain.setValueAtTime(0, now)
      rumbleGain.gain.linearRampToValueAtTime(0.08, now + 0.3)
      rumbleGain.gain.setValueAtTime(0.08, now + 1.5)
      rumbleGain.gain.exponentialRampToValueAtTime(0.001, now + 2.5)
      rumble.start(now)
      rumble.stop(now + 2.5)
    } catch (e) {
      console.warn("Alert audio failed", e)
    }
  }, [])

  const playZapSound = useCallback(async () => {
    try {
      const AC = window.AudioContext || (window as any).webkitAudioContext
      if (!AC) return
      const ctx = new AC()
      await ctx.resume()
      const now = ctx.currentTime

      const makeDistortionCurve = (amount = 400) => {
        const n_samples = 44100
        const curve = new Float32Array(n_samples)
        const deg = Math.PI / 180
        for (let i = 0; i < n_samples; ++i) {
          const x = (i * 2) / n_samples - 1
          curve[i] =
            ((3 + amount) * x * 20 * deg) / (Math.PI + amount * Math.abs(x))
        }
        return curve
      }

      const masterCompressor = ctx.createDynamicsCompressor()
      masterCompressor.threshold.setValueAtTime(-10, now)
      masterCompressor.knee.setValueAtTime(40, now)
      masterCompressor.ratio.setValueAtTime(12, now)
      masterCompressor.attack.setValueAtTime(0, now)
      masterCompressor.release.setValueAtTime(0.25, now)
      masterCompressor.connect(ctx.destination)

      const distNode = ctx.createWaveShaper()
      distNode.curve = makeDistortionCurve(800)
      distNode.oversample = "4x"
      distNode.connect(masterCompressor)

      const bufferSize = ctx.sampleRate * 4
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
      const output = noiseBuffer.getChannelData(0)
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1
      }
      const noise = ctx.createBufferSource()
      noise.buffer = noiseBuffer
      const noiseFilter = ctx.createBiquadFilter()
      noiseFilter.type = "bandpass"
      noiseFilter.frequency.setValueAtTime(3000, now)
      noiseFilter.frequency.exponentialRampToValueAtTime(8000, now + 1)
      noiseFilter.frequency.exponentialRampToValueAtTime(100, now + 4)
      const noiseGain = ctx.createGain()
      noiseGain.gain.setValueAtTime(0, now)
      noiseGain.gain.linearRampToValueAtTime(1, now + 0.05)
      noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 4)
      noise.connect(noiseFilter)
      noiseFilter.connect(distNode)

      const stutter = ctx.createOscillator()
      stutter.type = "square"
      stutter.frequency.setValueAtTime(20, now)
      stutter.frequency.linearRampToValueAtTime(60, now + 2)
      const stutterGain = ctx.createGain()
      stutter.connect(stutterGain.gain)
      noiseGain.connect(stutterGain)
      stutterGain.connect(distNode)

      noise.start(now)
      stutter.start(now)
      noise.stop(now + 4)
      stutter.stop(now + 4)

      const slash = ctx.createOscillator()
      const slashGain = ctx.createGain()
      slash.type = "sawtooth"
      slash.connect(slashGain)
      slashGain.connect(distNode)
      slash.frequency.setValueAtTime(5000, now)
      slash.frequency.exponentialRampToValueAtTime(100, now + 1.5)
      slashGain.gain.setValueAtTime(0, now)
      slashGain.gain.linearRampToValueAtTime(0.8, now + 0.01)
      slashGain.gain.exponentialRampToValueAtTime(0.01, now + 1.5)
      slash.start(now)
      slash.stop(now + 1.6)

      const sub = ctx.createOscillator()
      const subGain = ctx.createGain()
      sub.type = "sine"
      sub.connect(subGain)
      subGain.connect(distNode)
      sub.frequency.setValueAtTime(120, now)
      sub.frequency.exponentialRampToValueAtTime(15, now + 8)
      subGain.gain.setValueAtTime(0, now)
      subGain.gain.linearRampToValueAtTime(1, now + 0.1)
      subGain.gain.setValueAtTime(1, now + 4)
      subGain.gain.exponentialRampToValueAtTime(0.01, now + 12)
      sub.start(now)
      sub.stop(now + 12.1)

      const carrier = ctx.createOscillator()
      const modulator = ctx.createOscillator()
      const modGain = ctx.createGain()
      const fmGain = ctx.createGain()
      carrier.type = "square"
      modulator.type = "sawtooth"
      carrier.frequency.setValueAtTime(200, now + 3)
      carrier.frequency.linearRampToValueAtTime(1800, now + 12)
      carrier.frequency.linearRampToValueAtTime(50, now + 20)
      modulator.frequency.setValueAtTime(400, now + 3)
      modulator.frequency.linearRampToValueAtTime(50, now + 15)
      modGain.gain.setValueAtTime(1000, now + 3)
      modGain.gain.linearRampToValueAtTime(100, now + 18)
      modulator.connect(modGain)
      modGain.connect(carrier.frequency)
      carrier.connect(fmGain)
      fmGain.connect(masterCompressor)
      fmGain.gain.setValueAtTime(0, now + 3)
      fmGain.gain.linearRampToValueAtTime(0.15, now + 5)
      fmGain.gain.setValueAtTime(0.15, now + 16)
      fmGain.gain.exponentialRampToValueAtTime(0.001, now + 22)
      carrier.start(now + 3)
      modulator.start(now + 3)
      carrier.stop(now + 22.1)
      modulator.stop(now + 22.1)

      const drone = ctx.createOscillator()
      const droneFilter = ctx.createBiquadFilter()
      const droneGain = ctx.createGain()
      drone.type = "sawtooth"
      drone.frequency.setValueAtTime(55, now + 15)
      const lfo = ctx.createOscillator()
      const lfoGain = ctx.createGain()
      lfo.type = "sine"
      lfo.frequency.setValueAtTime(0.5, now + 15)
      lfo.frequency.linearRampToValueAtTime(2, now + 30)
      lfoGain.gain.value = 800
      droneFilter.type = "lowpass"
      droneFilter.frequency.value = 1000
      lfo.connect(lfoGain)
      lfoGain.connect(droneFilter.frequency)
      drone.connect(droneFilter)
      droneFilter.connect(droneGain)
      droneGain.connect(distNode)
      droneGain.gain.setValueAtTime(0, now + 15)
      droneGain.gain.linearRampToValueAtTime(0.4, now + 20)
      droneGain.gain.setValueAtTime(0.4, now + 28)
      droneGain.gain.exponentialRampToValueAtTime(0.001, now + 32)
      drone.start(now + 15)
      lfo.start(now + 15)
      drone.stop(now + 32.1)
      lfo.stop(now + 32.1)

      const freqs = [300, 315, 330, 800, 820]
      freqs.forEach((freq, index) => {
        const tear = ctx.createOscillator()
        const tearGain = ctx.createGain()
        tear.type = "triangle"
        tear.connect(tearGain)
        tearGain.connect(masterCompressor)
        tear.frequency.setValueAtTime(freq, now + 25)
        const resolveFreq = [220, 277.18, 329.63, 440, 659.25][index] || 440
        tear.frequency.exponentialRampToValueAtTime(resolveFreq, now + 34)
        tearGain.gain.setValueAtTime(0, now + 25)
        tearGain.gain.linearRampToValueAtTime(0.05, now + 30)
        tearGain.gain.setValueAtTime(0.05, now + 35)
        tearGain.gain.exponentialRampToValueAtTime(0.001, now + 38)
        tear.start(now + 25)
        tear.stop(now + 38.1)
      })

      const drill1 = ctx.createOscillator()
      const drill2 = ctx.createOscillator()
      const drillGain = ctx.createGain()
      drill1.type = "sine"
      drill2.type = "sine"
      drill1.frequency.setValueAtTime(7000, now + 32)
      drill2.frequency.setValueAtTime(7150, now + 32)
      drill1.frequency.exponentialRampToValueAtTime(432, now + 41)
      drill2.frequency.exponentialRampToValueAtTime(432, now + 41)
      drillGain.gain.setValueAtTime(0, now + 32)
      drillGain.gain.linearRampToValueAtTime(0.12, now + 32.5)
      drillGain.gain.setValueAtTime(0.12, now + 39)
      drillGain.gain.exponentialRampToValueAtTime(0.0001, now + 41)
      drill1.connect(drillGain)
      drill2.connect(drillGain)
      drillGain.connect(masterCompressor)
      drill1.start(now + 32)
      drill2.start(now + 32)
      drill1.stop(now + 41.1)
      drill2.stop(now + 41.1)

      const bowlMain = ctx.createOscillator()
      const bowlHarmonic = ctx.createOscillator()
      const bowlGain = ctx.createGain()
      bowlMain.type = "sine"
      bowlHarmonic.type = "sine"
      bowlMain.frequency.setValueAtTime(432, now + 41)
      bowlHarmonic.frequency.setValueAtTime(432 * 1.5, now + 41)
      bowlGain.gain.setValueAtTime(0, now + 41)
      bowlGain.gain.linearRampToValueAtTime(0.4, now + 41.05)
      bowlGain.gain.exponentialRampToValueAtTime(0.0001, now + 49)
      bowlMain.connect(bowlGain)
      bowlHarmonic.connect(bowlGain)
      bowlGain.connect(masterCompressor)
      bowlMain.start(now + 41)
      bowlHarmonic.start(now + 41)
      bowlMain.stop(now + 49.1)
      bowlHarmonic.stop(now + 49.1)
    } catch (e) {
      console.warn("Zap audio play failed", e)
    }
  }, [])

  const triggerReveal = useCallback(() => {
    setIsZapping(true)
    setIsShaking(true)
    playZapSound()

    setTimeout(() => {
      setIsZapping(false)
    }, 3000)

    setTimeout(() => {
      setExtraDivineData({
        bookQuote:
          DIVINE_BOOKS_QUOTES[
            Math.floor(Math.random() * DIVINE_BOOKS_QUOTES.length)
          ]!,
        hadith:
          HADITH_SNIPPETS[Math.floor(Math.random() * HADITH_SNIPPETS.length)]!,
        asmaulLeft:
          NAMES_OF_ALLAH[Math.floor(Math.random() * NAMES_OF_ALLAH.length)]!,
        asmaulRight:
          NAMES_OF_ALLAH[Math.floor(Math.random() * NAMES_OF_ALLAH.length)]!,
      })
      setIsShaking(false)
      setDataReady(true)
    }, 41000)
  }, [playZapSound])

  const dismissReveal = useCallback(() => {
    setIsRevealed(false)
    setIsLevelUp(false)
  }, [])

  const handleReset = useCallback(() => {
    setDataReady(false)
    setIsRevealed(false)
    setIsLevelUp(false)
  }, [])

  useEffect(() => {
    if (dataReady && dailyData?.ayah) {
      let isCancelled = false
      const { surahNumber, ayahNumber } = dailyData.ayah

      fetch(
        `https://api.alquran.cloud/v1/ayah/${surahNumber}:${ayahNumber}/ar.alafasy`
      )
        .then((res) => res.json())
        .then((data) => {
          if (!isCancelled && data?.data?.audio) {
            const ayahAudio = new Audio(data.data.audio)
            ayahAudio
              .play()
              .catch((e) => console.warn("Ayah audio auto-play blocked", e))

            ayahAudio.onended = () => {
              if (isCancelled) return
              const levelUpAudio = new Audio("/assets/audio/bgm/Level-Up.mp3")
              levelUpAudio
                .play()
                .catch((e) => console.warn("Level up audio failed", e))

              setXpData({
                iman: Math.floor(Math.random() * 800) + 200,
                taqwa: Math.floor(Math.random() * 500) + 100,
                ilm: Math.floor(Math.random() * 1200) + 300,
              })

              setIsLevelUp(true)
            }
          }
        })
        .catch((e) => console.warn("Failed to fetch Ayah audio", e))

      return () => {
        isCancelled = true
      }
    }
  }, [dataReady, dailyData])

  const fireAlertOnce = useCallback(() => {
    if (alertFiredRef.current || !dataReadyRef.current) return
    alertFiredRef.current = true
    setIsShaking(true)
    playIncomingAlertSound()
    setTimeout(() => setIsShaking(false), 2000)
  }, [playIncomingAlertSound])

  useEffect(() => {
    fetch("/api/daily")
      .then((res) => res.json())
      .then((data) => {
        setDailyData(data)
        dataReadyRef.current = true
      })
      .catch(() => {})

    const bgInterval = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % backgrounds.length)
    }, SYSTEM_CONSTANTS.POLL_INTERVAL)
    return () => clearInterval(bgInterval)
  }, [backgrounds.length])

  useEffect(() => {
    const handler = () => {
      fireAlertOnce()
      document.removeEventListener("click", handler)
      document.removeEventListener("touchstart", handler)
      document.removeEventListener("scroll", handler)
      document.removeEventListener("keydown", handler)
    }
    document.addEventListener("click", handler, { once: false })
    document.addEventListener("touchstart", handler, { once: false })
    document.addEventListener("scroll", handler, { once: false })
    document.addEventListener("keydown", handler, { once: false })
    return () => {
      document.removeEventListener("click", handler)
      document.removeEventListener("touchstart", handler)
      document.removeEventListener("scroll", handler)
      document.removeEventListener("keydown", handler)
    }
  }, [fireAlertOnce])

  return (
    <section
      id="hero"
      className={`bg-background relative flex min-h-screen w-full flex-col justify-center overflow-hidden pt-20 pb-10 font-sans text-foreground select-none ${
        isShaking ? "animate-[heroShake_1.2s_ease-in-out]" : ""
      }`}
    >
      {isShaking && (
        <div className="pointer-events-none fixed inset-0 z-[800] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 overflow-hidden opacity-50 mix-blend-screen">
            <div
              className="absolute inset-[-100%] animate-[matrixRain_2s_linear_infinite]"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(to bottom, transparent 0, transparent 40px, rgba(34, 211, 238, 0.4) 40px, rgba(52, 211, 153, 0.8) 42px, transparent 44px)",
                backgroundSize: "100% 200px",
              }}
            />
            <div
              className="absolute inset-[-100%] animate-[matrixRain_3s_linear_infinite]"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(to bottom, transparent 0, transparent 60px, rgba(250, 204, 21, 0.4) 60px, rgba(255, 255, 255, 0.8) 62px, transparent 64px)",
                backgroundSize: "20px 300px",
                marginLeft: "15px",
              }}
            />
          </div>

          <div className="absolute inset-0 animate-[pulse_0.5s_infinite] bg-[radial-gradient(ellipse_at_center,rgba(34,211,238,0.1)_0%,transparent_70%)]" />
          <div className="absolute inset-0 animate-pulse border-[4px] border-border shadow-sm" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(0,240,255,0.03)_1px,transparent_1px)] bg-[length:100%_4px]" />
          <div className="pointer-events-none absolute inset-0 flex animate-[smoothSubliminal_2s_infinite] items-center justify-center">
            <span className="font-sans text-5xl font-black tracking-[0.8em] text-foreground drop-shadow-sm md:text-8xl">
              OVERRIDE
            </span>
          </div>
        </div>
      )}

      {dataReady && dailyData && (
        <div
          className="fixed inset-0 z-[900] flex animate-in flex-col items-center justify-center bg-card/90 px-4 text-center backdrop-blur-md duration-1000 fade-in"
          onClick={handleReset}
        >
          {/* Matrix Rain will play as long as the modal is open */}
          <DivineMatrixRain active={true} />

          {/* Audio Recitation (Al-Fatihah) */}
          <audio
            src="https://server8.mp3quran.net/afs/001.mp3"
            autoPlay
            loop
            className="hidden"
          />

          {extraDivineData && (
            <>
              <div className="font-arabic pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 -rotate-90 animate-pulse text-4xl whitespace-nowrap text-primary/30 md:left-12 md:text-6xl">
                {extraDivineData.asmaulLeft}
              </div>
              <div className="font-arabic pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 rotate-90 animate-pulse text-4xl whitespace-nowrap text-primary/30 md:right-12 md:text-6xl">
                {extraDivineData.asmaulRight}
              </div>

              <div className="pointer-events-none absolute top-12 left-1/2 flex w-full max-w-2xl -translate-x-1/2 flex-col items-center gap-1 px-4 opacity-60">
                <div className="font-mono text-[10px] tracking-[0.3em] text-primary">
                  {extraDivineData.bookQuote.book}
                </div>
                <div className="font-sans text-xs tracking-widest text-primary italic">
                  "{extraDivineData.bookQuote.text}"
                </div>
              </div>

              <div className="pointer-events-none absolute bottom-28 left-1/2 flex w-full max-w-3xl -translate-x-1/2 flex-col items-center gap-1 px-4 opacity-60">
                <div className="font-mono text-[10px] tracking-[0.3em] text-primary">
                  PROPHETIC TRADITION (HADITH)
                </div>
                <div className="font-sans text-xs tracking-widest text-primary italic">
                  "{extraDivineData.hadith}"
                </div>
              </div>
            </>
          )}

          <div className="flex w-full max-w-4xl flex-col items-center gap-8">
            <div className="flex flex-col items-center gap-3">
              <AudioWave />
              <div className="font-mono text-[9px] tracking-[0.4em] text-primary/70 uppercase">
                Receiving Divine Frequency
              </div>
            </div>

            <h2
              className="font-arabic animate-[pulse_3s_ease-in-out_infinite] text-4xl leading-relaxed text-foreground drop-shadow-sm md:text-5xl lg:text-7xl lg:leading-loose"
              dir="rtl"
            >
              {dailyData.ayah?.textArabic}
            </h2>
            <div className="rounded-full border border-border bg-muted px-6 py-2 font-mono text-sm tracking-widest text-primary shadow-sm">
              Q.S {dailyData.ayah?.surahName?.toUpperCase()}{" "}
              {dailyData.ayah?.surahNumber}:{dailyData.ayah?.ayahNumber}
            </div>
            <p className="max-w-2xl font-sans text-sm leading-relaxed font-light tracking-wide text-primary italic opacity-90 md:text-base lg:text-lg">
              "{dailyData.ayah?.translationId}"
            </p>
          </div>

          <div className="absolute bottom-10 animate-pulse font-mono text-[10px] font-bold tracking-[0.5em] text-foreground/40">
            [ CLICK ANYWHERE TO DISMISS ]
          </div>
        </div>
      )}

      <div
        className={`pointer-events-none fixed inset-0 z-[999] transition-opacity duration-100 ${
          isZapping ? "opacity-100" : "opacity-0"
        }`}
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(34,211,238,0.25) 0%, rgba(0,0,0,0) 70%)",
        }}
      />

      <div
        className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
        style={{
          maskImage: "linear-gradient(to bottom, black 75%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, black 75%, transparent 100%)",
        }}
      >
        {backgrounds.map((bg, idx) => (
          <div
            key={bg}
            className={`absolute inset-0 bg-cover bg-[center_top] bg-no-repeat transition-opacity duration-[2000ms] ease-in-out ${
              idx === bgIndex ? "opacity-100" : "opacity-0"
            }`}
            style={{ backgroundImage: `url('${bg}')` }}
          />
        ))}
        <div className="pointer-events-none absolute top-[140px] right-[220px] z-10 font-mono text-[10px] tracking-[0.3em] text-foreground/40 uppercase">
          LUNA
        </div>
        <div className="pointer-events-none absolute top-[400px] right-[140px] z-10 font-mono text-[9px] tracking-[0.2em] text-primary/50 uppercase">
          ORBIT-7
        </div>
        <div className="from-background via-background/60 absolute inset-0 w-full bg-gradient-to-r to-transparent sm:w-2/3" />
        <div className="from-background absolute inset-0 bg-gradient-to-t via-transparent to-transparent" />

        <div className="theme-grid-bg absolute inset-0 opacity-15" />
      </div>

      {/* ═══ LEVEL UP display NOTIFICATION (Sleek, Minimalist, Top-Left) ═══ */}
      {isLevelUp && (
        <div className="pointer-events-none fixed top-24 left-10 z-[1000] flex flex-col items-start">
          <div className="relative flex w-[280px] animate-in flex-col gap-3 rounded-lg border border-border bg-card p-5 shadow-sm backdrop-blur-md duration-700 ease-out fill-mode-forwards slide-in-from-left-10 fade-in">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 animate-pulse rounded-full bg-primary shadow-sm" />
              <div className="font-mono text-[10px] font-bold tracking-[0.3em] text-primary">
                SYSTEM OVERRIDE COMPLETE
              </div>
            </div>

            <h1 className="text-xl font-light tracking-[0.2em] text-foreground">
              RANK ASCENDED
            </h1>

            <div className="mt-2 flex w-full flex-col gap-2 font-mono text-[11px] text-primary/70">
              <div className="flex animate-in justify-between border-b border-border pb-1 delay-[300ms] fill-mode-both fade-in slide-in-from-left-2">
                <span className="tracking-widest">FAITH SYNC</span>
                <span className="text-primary">+{xpData.iman} XP</span>
              </div>
              <div className="flex animate-in justify-between border-b border-border pb-1 delay-[600ms] fill-mode-both fade-in slide-in-from-left-2">
                <span className="tracking-widest">PIETY RESONANCE</span>
                <span className="text-primary">+{xpData.taqwa} XP</span>
              </div>
              <div className="flex animate-in justify-between border-b border-border pb-1 delay-[900ms] fill-mode-both fade-in slide-in-from-left-2">
                <span className="tracking-widest">KNOWLEDGE DB</span>
                <span className="text-primary">+{xpData.ilm} XP</span>
              </div>
            </div>

            {/* Futuristic Data Bar */}
            <div className="mt-2 w-full border border-border bg-card p-0.5">
              <div className="h-1 w-0 animate-[fillBar_2.5s_ease-out_forwards_1.2s] bg-primary shadow-sm" />
            </div>
          </div>
        </div>
      )}

      {/* Foreground Content */}
      <main className="relative z-20 mx-auto my-8 flex w-full max-w-7xl flex-1 flex-col justify-center px-6 sm:my-16 sm:px-10">
        <div className="mb-4">
          <h2 className="font-mono text-[10px] font-black tracking-[0.3em] text-primary/50 uppercase">
            [ SECTION 01 : HERO COMMAND ]
          </h2>
        </div>
        <div className="grid w-full grid-cols-1 items-center gap-8 lg:grid-cols-12">
          <div className="flex flex-col gap-6 lg:col-span-8">
            <HomeHeroTitleWidget
              dailyData={dailyData as any}
              onDecodeTransmission={triggerReveal}
            />
          </div>
          <div className="hidden flex-col items-end justify-center lg:col-span-4 lg:flex">
            <HomeTelemetrySidebarWidget />
          </div>
        </div>
      </main>

      {/* Restored Widgets Footer */}
      <footer className="relative z-20 mx-auto mt-auto grid w-full max-w-7xl grid-cols-1 gap-6 px-6 pb-10 sm:px-10 lg:grid-cols-12">
        <HomePlanetaryTelemetryWidget />

        <div className="flex h-full flex-col gap-5 lg:col-span-5">
          <HomeCelestialFeedWidget />
        </div>

        <HomeGlobalCoordinatesWidget />
      </footer>
    </section>
  )
}
