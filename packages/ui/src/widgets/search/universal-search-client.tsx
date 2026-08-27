"use client"

import { useState, useTransition } from "react"
import Link from "next/link"

type SearchResult = {
  scriptureId: string
  scriptureName: string
  icon: string
  reference: string
  href: string
  textOriginal?: string
  textLatin?: string
  translation: string
}

export function UniversalSearchClient() {
  const [query, setQuery] = useState("")
  const [filter, setFilter] = useState<
    "ALL" | "quran" | "taurat" | "zabur" | "injil"
  >("ALL")
  const [results, setResults] = useState<SearchResult[]>([])
  const [hasSearched, setHasSearched] = useState(false)
  const [isPending, startTransition] = useTransition()

  async function handleSearch(keyword: string, activeFilter: string) {
    const q = keyword.trim()
    if (!q) {
      setResults([])
      setHasSearched(false)
      return
    }

    setHasSearched(true)
    startTransition(async () => {
      try {
        const res = await fetch(
          `/api/search?q=${encodeURIComponent(q)}&filter=${activeFilter}`
        )
        if (res.ok) {
          const json = await res.json()
          setResults(json.results || [])
        }
      } catch (err) {
        console.warn("Search error:", err)
      }
    })
  }

  function highlightKeyword(text: string, kw: string) {
    if (!kw.trim()) return text
    const parts = text.split(
      new RegExp(`(${kw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi")
    )
    return parts.map((part, i) =>
      part.toLowerCase() === kw.toLowerCase() ? (
        <mark
          key={i}
          className="rounded bg-amber-300 px-0.5 font-semibold text-foreground dark:bg-amber-500/40"
        >
          {part}
        </mark>
      ) : (
        part
      )
    )
  }

  return (
    <div>
      {/* Search Input Bar */}
      <div className="search-glow relative mb-6 rounded-2xl border border-border bg-card shadow-sm">
        <svg
          className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-muted-foreground"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
          />
        </svg>
        <input
          type="text"
          placeholder="Cari kata kunci lintas kitab... (misal: Tauhid, Isa, Musa, Allah, Kasih, Terang)"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            handleSearch(e.target.value, filter)
          }}
          className="w-full rounded-2xl bg-transparent py-4 pr-4 pl-12 text-sm outline-none placeholder:text-muted-foreground sm:text-base"
        />
      </div>

      {/* Filter Tabs */}
      <div className="mb-8 flex flex-wrap gap-2">
        {[
          { id: "ALL", label: "Semua Kitab" },
          { id: "quran", label: "📖 Al-Qur'an" },
          { id: "taurat", label: "📜 Taurat" },
          { id: "zabur", label: "🎶 Zabur" },
          { id: "injil", label: "🕊️ Injil" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              const f = tab.id as any
              setFilter(f)
              if (query) handleSearch(query, f)
            }}
            className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
              filter === tab.id
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-muted text-muted-foreground hover:bg-accent"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Loading state */}
      {isPending && (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="skeleton-shimmer h-24 rounded-2xl" />
          ))}
        </div>
      )}

      {/* Results List */}
      {!isPending && hasSearched && (
        <div>
          <p className="mb-4 text-xs font-semibold text-muted-foreground">
            Ditemukan {results.length} ayat yang cocok dengan kata kunci &ldquo;
            {query}&rdquo;:
          </p>

          <div className="space-y-4">
            {results.map((r, idx) => (
              <div
                key={idx}
                className="group animate-fade-in rounded-2xl border border-border/60 bg-card/60 p-5 shadow-sm backdrop-blur-sm transition-all hover:bg-accent/40 sm:p-6"
              >
                <div className="mb-3 flex items-center justify-between gap-2">
                  <span className="flex items-center gap-1.5 text-xs font-bold text-primary">
                    <span>{r.icon}</span>
                    <span>{r.scriptureName}</span>
                  </span>
                  <span className="rounded-full bg-muted px-2.5 py-0.5 text-[10px] font-semibold text-muted-foreground">
                    {r.reference}
                  </span>
                </div>

                {r.textOriginal && (
                  <div className="arabic-text mb-2 text-xl leading-relaxed text-foreground">
                    {r.textOriginal}
                  </div>
                )}

                {r.textLatin && (
                  <p className="mb-2 text-xs font-medium text-emerald-700 dark:text-emerald-400">
                    {r.textLatin}
                  </p>
                )}

                <p className="mb-4 text-sm leading-relaxed text-foreground/90">
                  {highlightKeyword(r.translation, query)}
                </p>

                <Link
                  href={r.href}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
                >
                  <span>Buka Kitab & Ayat Selengkapnya</span>
                  <svg
                    className="h-3.5 w-3.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </Link>
              </div>
            ))}
          </div>

          {results.length === 0 && (
            <div className="rounded-2xl border border-border bg-card py-16 text-center text-muted-foreground">
              <p className="mb-1 text-lg font-bold">Tidak Ditemukan Hasil</p>
              <p className="text-xs">
                Coba kata kunci lain seperti &ldquo;Tuhan&rdquo;,
                &ldquo;Musa&rdquo;, &ldquo;Isa&rdquo;, &ldquo;Kasih&rdquo;, atau
                &ldquo;Esa&rdquo;.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
