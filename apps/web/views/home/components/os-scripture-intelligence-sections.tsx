import {
  Activity,
  ArrowRight,
  Book,
  BookOpen,
  Bookmark,
  Brain,
  Cpu,
  Database,
  FileText,
  GitBranch,
  GitMerge,
  Navigation,
  Network,
  PieChart,
  Radar,
  Scroll,
  Search,
  Settings,
  Shield,
} from "lucide-react"
import { resolveVisualizationColor } from "@workspace/ui"

const SOURCES = [
  { name: "Qur'an", value: "6,236 ayat", icon: BookOpen, color: "#10B981" },
  { name: "Hadith", value: "75,234 riwayat", icon: Scroll, color: "#F59E0B" },
  { name: "Tafsir", value: "2,541 kitab", icon: Book, color: "#3B82F6" },
  {
    name: "Sirah",
    value: "1,256 Peristiwa",
    icon: Navigation,
    color: "#EC4899",
  },
  { name: "Asmaul Husna", value: "99 names", icon: Activity, color: "#00F0FF" },
  {
    name: "Root words",
    value: "3,012 Kata",
    icon: GitBranch,
    color: "#10B981",
  },
  { name: "Topics", value: "1,248 topics", icon: Database, color: "#3B82F6" },
  {
    name: "Chronology",
    value: "2,100 Timeline",
    icon: FileText,
    color: "#A855F7",
  },
] as const

type ScriptureSearchResult = {
  type: string
  source: string
  arabic?: string
  english: string
  relevance: string
  color: string
}

const SEARCH_RESULTS: readonly ScriptureSearchResult[] = [
  {
    type: "QUR'AN",
    source: "Surah 21:107",
    arabic: "وَمَا أَرْسَلْنَاكَ إِلَّا رَحْمَةً لِّلْعَالَمِينَ",
    english:
      "And We have not sent you, [O Muhammad], except as a mercy to the worlds.",
    relevance: "98%",
    color: "#10B981",
  },
  {
    type: "HADITH",
    source: "Sahih Bukhari 6018",
    english:
      'The Prophet ﷺ said: "Indeed, Allah is Merciful and loves mercy. He gives mercy to those who are merciful among His creation."',
    relevance: "97%",
    color: "#F59E0B",
  },
  {
    type: "TAFSIR",
    source: "Ibn Kathir",
    english:
      "This verse indicates that the mission of Prophet Muhammad ﷺ is a mercy encompassing all creation, not limited to any one people.",
    relevance: "95%",
    color: "#3B82F6",
  },
  {
    type: "TOPIC",
    source: "Ar-Rahmah",
    english:
      "Ar-Rahmah (The Most Merciful) is derived from the root (ر ح م) which indicates compassion, kindness, and tenderness.",
    relevance: "94%",
    color: "#A855F7",
  },
] as const

export type ScriptureSearchControls = {
  searchQuery: string
  activeFilter: string
  onSearchQueryChange: (value: string) => void
  onActiveFilterChange: (value: string) => void
}

export function ScriptureHeader() {
  return (
    <div className="flex flex-col justify-between gap-6 border-b border-border pb-6 xl:flex-row xl:items-start">
      <div className="max-w-2xl space-y-4">
        <div className="inline-flex items-center gap-3 rounded-md border border-border bg-card px-3.5 py-1.5 text-sm font-medium text-primary">
          <span className="rounded-xs bg-primary px-1.5 py-0.5 font-black text-foreground">
            08
          </span>
          <span>Scripture intelligence</span>
        </div>
        <h2 className="text-xl font-semibold text-foreground sm:text-3xl">
          The living knowledge database
        </h2>
      </div>

      <div className="max-w-lg border-l-2 border-primary bg-card p-4 text-center xl:text-left">
        <div
          className="mb-2 font-arabic text-sm font-bold text-foreground"
          dir="rtl"
        >
          أَفَلَا يَتَدَبَّرُونَ الْقُرْآنَ أَمْ عَلَىٰ قُلُوبٍ أَقْفَالُهَا
        </div>
        <div className="font-sans text-[11px] text-primary italic">
          "Then do they not reflect upon the Qur'an, or are there locks upon
          [their] hearts?"{" "}
          <span className="mt-1 ml-1 block font-mono font-black text-primary not-italic xl:mt-0 xl:inline">
            Qur&apos;an 47:24
          </span>
        </div>
      </div>

      <div className="hidden shrink-0 rounded-xl border border-primary/30 bg-background p-4 md:block">
        <div className="mb-3 text-center text-xs font-medium text-primary">
          Intelligence tools
        </div>
        <div className="flex items-center gap-4 text-center text-[9px] font-bold text-primary">
          {[
            { label: "SEMANTIC SEARCH", icon: Search },
            { label: "CROSS REFERENCE", icon: Network },
            { label: "ROOT ANALYZER", icon: GitMerge },
            { label: "TOPIC EXPLORER", icon: Brain },
            { label: "AI ASSISTANT", icon: Cpu },
          ].map((tool) => (
            <div
              key={tool.label}
              className="group flex cursor-pointer flex-col items-center gap-1.5"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background transition-all group-hover:border-primary group-hover:shadow-sm">
                <tool.icon className="h-4 w-4 text-primary group-hover:text-primary" />
              </div>
              <span className="max-w-[60px] leading-tight group-hover:text-foreground">
                {tool.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function ScriptureSourcesPanel() {
  return (
    <div className="space-y-4 lg:col-span-3">
      <div className="mb-2 text-xs font-black tracking-widest text-primary uppercase">
        KNOWLEDGE SOURCES
      </div>
      <div className="space-y-2">
        {SOURCES.map((source) => (
          <button
            key={source.name}
            type="button"
            className="group flex w-full items-center justify-between rounded-lg border border-border bg-background p-3 text-left shadow-lg transition-all hover:border-primary/50"
          >
            <div className="flex items-center gap-3">
              <source.icon
                className="h-5 w-5"
                style={{ color: resolveVisualizationColor(source.color) }}
              />
              <div>
                <div className="text-xs font-black text-foreground transition-colors group-hover:text-primary">
                  {source.name}
                </div>
                <div className="text-[10px] text-primary">{source.value}</div>
              </div>
            </div>
            <ArrowRight className="h-3.5 w-3.5 text-primary transition-all group-hover:translate-x-1 group-hover:text-primary" />
          </button>
        ))}
      </div>
      <button
        type="button"
        className="mt-2 flex w-full items-center justify-center gap-2 rounded border border-primary/30 bg-background py-2.5 text-[10px] font-black tracking-widest text-primary uppercase transition-colors hover:bg-primary/10"
      >
        VIEW ALL SOURCES <ArrowRight className="h-3 w-3" />
      </button>
    </div>
  )
}

export function ScriptureSearchPanel({
  searchQuery,
  activeFilter,
  onSearchQueryChange,
  onActiveFilterChange,
}: ScriptureSearchControls) {
  return (
    <div className="flex flex-col gap-4 lg:col-span-5">
      <div className="flex items-center rounded-lg border border-primary/50 bg-background p-1 shadow-sm">
        <div className="px-4">
          <Search className="h-5 w-5 text-primary" />
        </div>
        <input
          type="search"
          value={searchQuery}
          onChange={(event) => onSearchQueryChange(event.target.value)}
          className="w-full border-none bg-transparent py-3 font-mono text-lg text-foreground focus:outline-none"
          placeholder="Search database..."
          aria-label="Search scripture database"
        />
        <button
          type="button"
          aria-label="Clear search"
          onClick={() => onSearchQueryChange("")}
          className="px-4 text-primary hover:text-foreground"
        >
          ✕
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-2 text-[10px] font-bold tracking-wider uppercase">
        <span className="mr-2 text-primary">SEARCH IN:</span>
        {["ALL", "QUR'AN", "HADITH", "TAFSIR", "SIRAH", "TOPICS"].map(
          (filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => onActiveFilterChange(filter)}
              className={`flex items-center gap-1.5 rounded border px-3 py-1.5 transition-all ${
                activeFilter === filter
                  ? "border-primary bg-primary/10 text-primary shadow-sm"
                  : "border-border bg-background text-primary hover:border-primary/50"
              }`}
            >
              {activeFilter === filter && (
                <span className="h-1.5 w-1.5 animate-ping rounded-full bg-primary" />
              )}{" "}
              {filter}
            </button>
          )
        )}
        <button
          type="button"
          className="ml-auto flex items-center gap-1.5 rounded border border-border bg-background px-3 py-1.5 text-primary hover:text-foreground"
        >
          <Settings className="h-3 w-3" /> FILTERS
        </button>
      </div>

      <div className="hide-scrollbar flex max-h-[600px] flex-1 flex-col overflow-y-auto rounded-xl border border-primary/20 bg-background p-5 shadow-inner">
        <div className="mb-4 flex items-center justify-between border-b border-border pb-2 text-[10px] font-black tracking-widest text-primary uppercase">
          <span>FOUND 1,248 RESULTS</span>
          <span className="text-primary">SORT BY: RELEVANCE ∨</span>
        </div>

        <div className="space-y-4">
          {SEARCH_RESULTS.map((result) => (
            <div
              key={result.source}
              className="group flex gap-4 rounded-lg border border-border bg-background p-4 transition-colors hover:border-border"
            >
              <div className="flex shrink-0 flex-col items-center gap-2">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded border border-border bg-background"
                  style={{
                    borderColor: resolveVisualizationColor(result.color),
                  }}
                >
                  <BookOpen
                    className="h-5 w-5"
                    style={{ color: resolveVisualizationColor(result.color) }}
                  />
                </div>
                <div
                  className="text-[8px] font-black tracking-wider"
                  style={{ color: resolveVisualizationColor(result.color) }}
                >
                  {result.type}
                </div>
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex items-start justify-between">
                  <div className="text-[11px] font-bold text-primary uppercase">
                    {result.source}
                  </div>
                  <div className="text-right">
                    <div className="text-[8px] text-primary uppercase">
                      RELEVANCE
                    </div>
                    <div
                      className="text-xs font-black"
                      style={{ color: resolveVisualizationColor(result.color) }}
                    >
                      {result.relevance}
                    </div>
                  </div>
                </div>
                {result.arabic && (
                  <div
                    className="mb-2 text-right font-arabic text-lg text-foreground"
                    dir="rtl"
                  >
                    {result.arabic}
                  </div>
                )}
                <div className="font-sans text-xs leading-relaxed text-foreground">
                  {result.english}
                </div>
              </div>
              <button
                type="button"
                aria-label={`Bookmark ${result.source}`}
                className="shrink-0 text-primary transition-colors hover:text-primary"
              >
                <Bookmark className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>

        <button
          type="button"
          className="mt-4 flex w-full items-center justify-center gap-2 rounded border border-primary/30 bg-transparent py-3 text-[10px] font-black tracking-widest text-primary uppercase transition-colors hover:bg-primary/10"
        >
          VIEW MORE RESULTS <ArrowRight className="h-3 w-3" />
        </button>
      </div>
    </div>
  )
}

export function ScriptureInsightsPanel() {
  return (
    <div className="flex flex-col space-y-6 lg:col-span-4">
      <div className="flex-1 rounded-xl border-2 border-blue-500/40 bg-background p-5 shadow-sm">
        <div className="mb-4 flex items-center gap-2 text-[10px] font-black tracking-widest text-blue-400 uppercase">
          <Brain className="h-4 w-4" /> AI INSIGHTS
        </div>
        <div className="mb-2 text-[11px] font-bold tracking-wider text-foreground uppercase">
          CONTEXTUAL UNDERSTANDING
        </div>
        <div className="mb-6 font-sans text-[11px] leading-relaxed text-blue-100/80">
          The concept of mercy (رحمة) appears in the Qur&apos;an 114 times in 57
          verses. It is one of the core attributes of Allah and a fundamental
          principle in Islam.
        </div>
        <div className="mb-3 border-t border-border pt-4 text-[11px] font-bold tracking-wider text-foreground uppercase">
          KEY THEMES
        </div>
        <div className="space-y-2 font-sans text-[10px] text-primary">
          {[
            "Allah's Mercy is all-encompassing",
            "Mercy is the foundation of creation",
            "Believers are commanded to show mercy",
            "Mercy leads to forgiveness and guidance",
            "The Prophet ﷺ is a mercy to all worlds",
          ].map((theme) => (
            <div key={theme} className="flex items-start gap-2">
              <span className="font-bold text-blue-400">•</span> {theme}
            </div>
          ))}
        </div>
        <div className="mt-6 flex justify-center opacity-60 mix-blend-screen drop-shadow-sm filter">
          <Brain className="h-24 w-24 animate-pulse text-blue-500/50" />
        </div>
        <button
          type="button"
          className="mt-6 flex w-full items-center justify-center gap-2 rounded border border-blue-500/50 py-2.5 text-[10px] font-black tracking-widest text-blue-400 uppercase transition-colors hover:bg-blue-500/20"
        >
          EXPLORE AI ANALYSIS <ArrowRight className="h-3 w-3" />
        </button>
      </div>

      <div className="rounded-xl border border-emerald-500/40 bg-background p-5 shadow-sm">
        <div className="mb-4 flex items-center gap-2 text-[10px] font-black tracking-widest text-success uppercase">
          <Network className="h-4 w-4" /> CROSS REFERENCES
        </div>
        <div className="relative flex h-40 items-center justify-center">
          <div className="theme-grid-bg absolute inset-0 opacity-20" />
          <div className="absolute z-20 flex h-16 w-16 flex-col items-center justify-center rounded-full border-2 border-primary bg-background shadow-sm">
            <span className="text-[9px] font-black text-foreground">MERCY</span>
          </div>
          {[
            { label: "FORGIVENESS", position: "-left-2 top-2" },
            { label: "COMPASSION", position: "-right-4 top-4" },
            { label: "LOVE", position: "left-4 bottom-2" },
            { label: "GRACE", position: "right-6 bottom-4" },
          ].map((node) => (
            <div
              key={node.label}
              className={`absolute z-10 flex h-12 w-12 flex-col items-center justify-center rounded-full border border-border bg-background shadow-lg ${node.position}`}
            >
              <span className="text-center text-[7px] leading-tight font-bold text-foreground uppercase">
                {node.label}
              </span>
            </div>
          ))}
          <svg
            className="absolute inset-0 z-0 h-full w-full opacity-40"
            aria-hidden="true"
          >
            <line
              x1="50%"
              y1="50%"
              x2="20%"
              y2="30%"
              stroke="#10B981"
              strokeWidth="2"
              strokeDasharray="4 2"
            />
            <line
              x1="50%"
              y1="50%"
              x2="80%"
              y2="35%"
              stroke="#3B82F6"
              strokeWidth="2"
              strokeDasharray="4 2"
            />
            <line
              x1="50%"
              y1="50%"
              x2="30%"
              y2="80%"
              stroke="#EC4899"
              strokeWidth="2"
              strokeDasharray="4 2"
            />
            <line
              x1="50%"
              y1="50%"
              x2="75%"
              y2="75%"
              stroke="#F59E0B"
              strokeWidth="2"
              strokeDasharray="4 2"
            />
          </svg>
        </div>
        <button
          type="button"
          className="mt-4 flex w-full items-center justify-center gap-1 py-2.5 text-[10px] font-bold tracking-widest text-success uppercase transition-colors hover:text-foreground"
        >
          VIEW ALL CONNECTIONS <ArrowRight className="h-3 w-3" />
        </button>
      </div>
    </div>
  )
}

export function ScriptureBottomPanels() {
  return (
    <div className="grid grid-cols-1 gap-4 pt-2 md:grid-cols-2 lg:grid-cols-5">
      <div className="rounded-xl border border-border bg-background p-4">
        <div className="mb-3 text-[9px] font-black tracking-widest text-primary uppercase">
          MOST RELEVANT VERSES
        </div>
        <div className="space-y-3 font-mono text-[9px]">
          {[
            [
              "21:107",
              "And We have not sent you except as mercy to the worlds.",
            ],
            ["7:156", "And My mercy encompasses all things."],
            [
              "39:53",
              'Say, "O My servants who have transgressed against themselves...',
            ],
          ].map(([reference, verse]) => (
            <div key={reference} className="flex gap-2">
              <span className="shrink-0 font-bold text-primary">
                {reference}
              </span>
              <span className="truncate text-primary">{verse}</span>
            </div>
          ))}
        </div>
        <div className="mt-3 text-right">
          <span className="cursor-pointer text-[9px] font-bold text-primary hover:underline">
            VIEW ALL VERSES ➔
          </span>
        </div>
      </div>

      <div className="flex flex-col justify-between rounded-xl border border-success/30 bg-background p-4">
        <div className="mb-2 text-[9px] font-black tracking-widest text-success uppercase">
          DAILY INSPIRATION
        </div>
        <div className="flex items-start justify-between">
          <div>
            <div className="font-mono text-lg font-black text-success">
              Ar-Rahman
            </div>
            <div className="text-[10px] text-foreground">The Most Merciful</div>
          </div>
          <div className="font-arabic text-2xl text-success drop-shadow-sm">
            الرَّحْمَٰنُ
          </div>
        </div>
        <div className="mt-2 font-sans text-[10px] text-primary italic">
          "So which of the favors of your Lord would you deny?"
        </div>
      </div>

      <div className="relative flex flex-col items-center justify-center overflow-hidden rounded-xl border border-border bg-background p-4">
        <div className="absolute top-4 left-4 z-10 text-[9px] font-black tracking-widest text-foreground uppercase">
          KNOWLEDGE MAP
        </div>
        <Radar className="absolute z-0 h-24 w-24 text-primary/20" />
        <BookOpen className="relative z-10 h-8 w-8 text-primary" />
      </div>

      <div className="flex items-center justify-between rounded-xl border border-primary/30 bg-background p-4">
        <div>
          <div className="mb-1 text-[9px] font-black tracking-widest text-primary uppercase">
            READING PROGRESS
          </div>
          <div className="text-[8px] text-primary uppercase">
            OVERALL PROGRESS
          </div>
          <div className="mt-1 font-mono text-3xl font-black text-foreground">
            68%
          </div>
        </div>
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-4 border-primary/20 border-t-cyan-400 shadow-sm">
          <PieChart className="h-6 w-6 text-primary" />
        </div>
      </div>

      <div className="rounded-xl border border-border bg-background p-4">
        <div className="mb-3 text-[9px] font-black tracking-widest text-primary uppercase">
          POPULAR SEARCHES
        </div>
        <div className="space-y-1.5 font-mono text-[10px]">
          {[
            ["mercy", "1,248"],
            ["patience", "982"],
            ["forgiveness", "876"],
            ["gratitude", "765"],
          ].map(([term, count], index) => (
            <div key={term} className="flex justify-between">
              <span className="text-foreground">
                <span className="mr-2 text-primary">{index + 1}</span>
                {term}
              </span>
              <span className="text-primary">{count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function ScriptureStatusFooter() {
  return (
    <div className="mt-6 flex flex-col items-center justify-between gap-4 border-t border-border px-2 pt-4 font-mono text-[9px] font-bold tracking-widest text-primary uppercase sm:flex-row">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          DATABASE STATUS{" "}
          <span className="flex items-center gap-1 text-success">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />{" "}
            SYNCHRONIZED
          </span>
        </div>
        <div>LAST UPDATE: 25 MAY 2025 06:50 WIB</div>
      </div>
      <div className="hidden max-w-lg text-center font-sans text-foreground/50 normal-case italic md:block">
        "This is a blessed Book which We have revealed to you, [O Muhammad],
        that they might reflect upon its verses and that those of understanding
        would be reminded."{" "}
        <span className="ml-1 font-mono text-primary">Qur&apos;an 38:29</span>
      </div>
      <div className="flex items-center gap-2">
        DATA INTEGRITY 100% <Shield className="h-4 w-4 text-success" />
      </div>
    </div>
  )
}
