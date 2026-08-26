"use client"
import { useMounted } from "@core/hooks"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import {
  Search,
  X,
  BookOpen,
  Scroll,
  Sparkles,
  ShieldCheck,
  Mic,
  Terminal,
} from "lucide-react"
import { Modal } from "@workspace/ui"

type SearchResultItem = {
  type: "quran" | "hadith" | "asmaul" | "tauhid"
  title: string
  subtitle: string
  href: string
  badge: string
}

const STATIC_SEARCH_DATA: SearchResultItem[] = [
  {
    type: "quran",
    title: "Surah Al-Fatihah (1)",
    subtitle: "Pembukaan • 7 Ayat • Makkiyah",
    href: "/kitab/quran/1",
    badge: "QURAN",
  },
  {
    type: "quran",
    title: "Surah Al-Baqarah (2)",
    subtitle: "Sapi Betina • 286 Ayat • Madaniyah",
    href: "/kitab/quran/2",
    badge: "QURAN",
  },
  {
    type: "quran",
    title: "Ayat Kursi (Q.S Al-Baqarah: 255)",
    subtitle: "Ayat Keagungan Allah • Mahahidup & Terus Menerus Mengurus",
    href: "/kitab/quran/2?verse=255",
    badge: "AYAT",
  },
  {
    type: "quran",
    title: "Surah Yasin (36)",
    subtitle: "Jantung Al-Qur'an • 83 Ayat",
    href: "/kitab/quran/36",
    badge: "QURAN",
  },
  {
    type: "quran",
    title: "Surah Ar-Rahman (55)",
    subtitle: "Maha Pengasih • 78 Ayat",
    href: "/kitab/quran/55",
    badge: "QURAN",
  },
  {
    type: "quran",
    title: "Surah Al-Waqi'ah (56)",
    subtitle: "Hari Kiamat • 96 Ayat",
    href: "/kitab/quran/56",
    badge: "QURAN",
  },
  {
    type: "quran",
    title: "Surah Al-Mulk (67)",
    subtitle: "Kerajaan • 30 Ayat • Penyelamat Siksa Kubur",
    href: "/kitab/quran/67",
    badge: "QURAN",
  },
  {
    type: "quran",
    title: "Surah Al-Ikhlas (112)",
    subtitle: "Memurnikan Keesaan Allah • 4 Ayat",
    href: "/kitab/quran/112",
    badge: "QURAN",
  },

  {
    type: "hadith",
    title: "Shahih Al-Bukhari",
    subtitle: "Kitab Niat & Iman • 7,563 Hadits Sahih",
    href: "/hadits?book=bukhari",
    badge: "HADITH",
  },
  {
    type: "hadith",
    title: "Shahih Muslim",
    subtitle: "Kitab Tauhid & Shalat • 7,453 Hadits Sahih",
    href: "/hadits?book=muslim",
    badge: "HADITH",
  },
  {
    type: "hadith",
    title: "Sunan At-Tirmidzi",
    subtitle: "Kompendium Sunan • 3,956 Hadits",
    href: "/hadits?book=tirmidzi",
    badge: "HADITH",
  },
  {
    type: "hadith",
    title: "Hadits Niat Arbain #1",
    subtitle: "Innamal a'malu bin-niyyat (Segala amal tergantung niat)",
    href: "/hadits",
    badge: "HADITH",
  },

  {
    type: "asmaul",
    title: "Ar-Rahman (الرَّحْمَٰنُ)",
    subtitle: "Maha Pengasih Bagi Seluruh Makhluk",
    href: "/asmaul-husna",
    badge: "ASMAUL",
  },
  {
    type: "asmaul",
    title: "Ar-Rahim (الرَّحِيمُ)",
    subtitle: "Maha Penyayang Bagi Orang Beriman",
    href: "/asmaul-husna",
    badge: "ASMAUL",
  },
  {
    type: "asmaul",
    title: "Al-Malik (الْمَلِكُ)",
    subtitle: "Maha Raja Penguasa Alam Semesta",
    href: "/asmaul-husna",
    badge: "ASMAUL",
  },
  {
    type: "asmaul",
    title: "Al-Quddus (الْقُدُّوسُ)",
    subtitle: "Maha Suci Dari Segala Kekurangan",
    href: "/asmaul-husna",
    badge: "ASMAUL",
  },
  {
    type: "asmaul",
    title: "As-Salam (السَّلاَمُ)",
    subtitle: "Maha Memberi Kesejahteraan",
    href: "/asmaul-husna",
    badge: "ASMAUL",
  },

  {
    type: "tauhid",
    title: "Tauhid Rububiyah",
    subtitle: "Meyakini Allah Sebagai Satu-Satunya Pencipta & Pemelihara Alam",
    href: "/tauhid",
    badge: "TAUHID",
  },
  {
    type: "tauhid",
    title: "Tauhid Uluhiyah",
    subtitle: "Mengesakan Allah Dalam Segala Bentuk Peribadahan",
    href: "/tauhid",
    badge: "TAUHID",
  },
  {
    type: "tauhid",
    title: "Tauhid Asma wa Shifat",
    subtitle: "Meyakini Nama & Sifat Allah Sesuai Al-Qur'an & As-Sunnah",
    href: "/tauhid",
    badge: "TAUHID",
  },
]

export function GlobalSearchModal() {
  const mounted = useMounted()
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState("")
  const inputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault()
        setIsOpen((prev) => !prev)
      }
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen])

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [isOpen])

  const filteredResults =
    query.trim() === ""
      ? STATIC_SEARCH_DATA.slice(0, 6)
      : STATIC_SEARCH_DATA.filter(
          (item) =>
            item.title.toLowerCase().includes(query.toLowerCase()) ||
            item.subtitle.toLowerCase().includes(query.toLowerCase())
        )

  function getIcon(type: SearchResultItem["type"]) {
    switch (type) {
      case "quran":
        return <BookOpen className="h-4 w-4 text-primary" />
      case "hadith":
        return <Scroll className="text-danger h-4 w-4" />
      case "asmaul":
        return <Sparkles className="h-4 w-4 text-accent" />
      case "tauhid":
        return <ShieldCheck className="h-4 w-4 text-secondary" />
    }
  }

  return (
    <>
      {/* Search Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="tag-clip flex cursor-pointer items-center gap-2 border border-primary/40 bg-primary/10 px-3 py-1.5 text-[10px] font-bold text-primary transition-all hover:bg-primary/25"
        title="Buka Mesin Pencari Universal (Ctrl + K)"
      >
        <Search className="h-3.5 w-3.5 text-primary" />
        <span className="hidden sm:inline">
          {/* SEARCH SCRIPTURES & HADITH */}
        </span>
        <kbd className="bg-space hidden rounded border border-primary/30 px-1.5 py-0.5 text-[8px] text-muted md:inline">
          CTRL + K
        </kbd>
      </button>

      {/* Global Search Modal Portal */}
      <Modal
        isOpen={isOpen && mounted}
        onClose={() => setIsOpen(false)}
        title="// MOONWITNESS SYSTEM WIDE SEARCH"
        icon={Terminal}
        maxWidth="max-w-3xl"
        borderColor="border-success/50"
        glowColor="rgba(0,255,102,0.15)"
      >
        {/* Terminal Header Sub */}
        <div className="bg-success/10 border-success/30 flex shrink-0 items-center justify-between border-b px-4 py-2">
          <div className="text-success font-mono text-[10px] font-bold tracking-widest">
            MOONWITNESS OS TERMINAL [VERSION 6.5]
          </div>
          <div className="text-success/70 text-[10px]">
            ADMIN_ROOT // SECURE_CONNECTION_ESTABLISHED
          </div>
        </div>

        {/* Input Bar (CLI Style) */}
        <div className="border-success/20 bg-space/90 flex shrink-0 items-center gap-2 border-b px-5 py-4">
          <div className="text-success text-sm font-bold tracking-wider whitespace-nowrap">
            root@moonwitness:~#
          </div>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="search_query..."
            className="text-success placeholder-success/30 caret-success w-full bg-transparent font-mono text-sm focus:outline-none"
            spellCheck={false}
            autoComplete="off"
          />

          {/* Voice Search Button (Web Speech API) */}
          <button
            type="button"
            onClick={() => {
              if (
                typeof window !== "undefined" &&
                ("SpeechRecognition" in window ||
                  "webkitSpeechRecognition" in window)
              ) {
                const SpeechRec =
                  (window as any).SpeechRecognition ||
                  (window as any).webkitSpeechRecognition
                const rec = new SpeechRec()
                rec.lang = "id-ID"
                rec.onresult = (event: any) => {
                  const transcript = event.results[0][0].transcript
                  setQuery(transcript)
                }
                rec.start()
              } else {
                alert("Browser Anda belum mendukung Web Speech Recognition.")
              }
            }}
            className="flex shrink-0 items-center gap-1 rounded border border-primary/40 bg-primary/10 p-1.5 text-xs font-bold text-primary transition-all hover:bg-primary/25"
            title="Pencarian Suara (Voice Search)"
          >
            <Mic className="h-3.5 w-3.5" />
            <span className="hidden text-[9px] sm:inline">VOICE</span>
          </button>

          {query && (
            <button
              onClick={() => setQuery("")}
              className="text-muted hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Results Body */}
        <div className="h-[400px] space-y-2 p-4 text-xs">
          <div className="text-success/70 border-success/20 mb-4 flex items-center justify-between border-b pb-2 text-[9px] tracking-widest uppercase">
            <span>
              {/* {query ? `EXECUTE QUERY: MATCHES_FOUND=${filteredResults.length}` : "SYSTEM_RECOMMENDATIONS"} */}
            </span>
            <span className="text-success animate-pulse">
              PRESS_ESC_TO_ABORT
            </span>
          </div>

          {filteredResults.length === 0 ? (
            <div className="text-success/50 space-y-2 py-12 text-center">
              <p className="text-sm font-bold">
                &gt; ERROR 404: DATA_NOT_FOUND_FOR_QUERY: &quot;{query}&quot;
              </p>
              <p className="text-xs">
                SUGGESTION: RETRY WITH KEYWORDS LIKE &apos;AL-BAQARAH&apos; OR
                &apos;NIAT&apos;
              </p>
            </div>
          ) : (
            filteredResults.map((item, idx) => (
              <Link
                key={idx}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="hover:border-success/40 hover:bg-success/10 group flex items-center justify-between border border-transparent p-2 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="text-success/70 group-hover:text-success">
                    {getIcon(item.type)}
                  </div>
                  <div>
                    <div className="text-success/90 group-hover:text-success text-xs font-bold transition-colors">
                      &gt; {item.title}
                    </div>
                    <div className="text-success/50 text-[10px]">
                      {item.subtitle}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-success border-success/30 border px-1 py-0.5 text-[9px] font-bold">
                    {item.badge}
                  </span>
                </div>
              </Link>
            ))
          )}
        </div>
      </Modal>
    </>
  )
}
