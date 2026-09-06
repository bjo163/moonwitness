import {
  BookOpen,
  Globe2,
  Network,
  Search,
  Sparkles,
  User,
  Bookmark,
} from "lucide-react"
import type { SemanticSearchHit } from "@workspace/types"
import {
  KitabAdditionalGrid,
  type AdditionalScriptureItem,
} from "../components/kitab/kitab-additional-grid"
import {
  KitabCanonicalGrid,
  type CanonicalScriptureCard,
} from "../components/kitab/kitab-canonical-grid"

type KitabPortalToolbarProps = {
  searchQuery: string
  onSearchQueryChange: (value: string) => void
}

export function KitabPortalToolbar({
  searchQuery,
  onSearchQueryChange,
}: KitabPortalToolbarProps) {
  return (
    <div className="flex flex-col items-center justify-between gap-4 border-b border-border pt-2 pb-4 md:flex-row">
      <div className="flex w-full items-center gap-3 rounded-lg border border-border bg-muted/30 px-4 py-2 md:w-auto">
        <BookOpen className="h-4 w-4 text-warning" />
        <span className="text-[10px] font-black tracking-widest uppercase">
          4 MAJOR CANONICAL SCRIPTURES
        </span>
        <Bookmark className="ml-auto h-3 w-3 text-foreground/30 md:ml-4" />
      </div>

      <div className="relative w-full max-w-2xl flex-1">
        <Search className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-foreground/30" />
        <input
          type="text"
          value={searchQuery}
          onChange={(event) => onSearchQueryChange(event.target.value)}
          placeholder="Search verses, keywords, topic across all scriptures..."
          className="w-full rounded-full border border-border bg-card py-2.5 pr-16 pl-11 text-xs text-foreground shadow-inner transition-all outline-none focus:border-blue-500/50"
        />
        <div className="absolute top-1/2 right-4 flex -translate-y-1/2 gap-1">
          <kbd className="rounded border border-border bg-muted/30 px-1.5 py-0.5 text-[9px] text-foreground/50">
            Ctrl
          </kbd>
          <span className="text-[9px] text-foreground/30">+</span>
          <kbd className="rounded border border-border bg-muted/30 px-1.5 py-0.5 text-[9px] text-foreground/50">
            K
          </kbd>
        </div>
      </div>

      <button
        type="button"
        className="group flex w-full items-center justify-center gap-2 rounded-full border border-border bg-primary/10 px-6 py-2.5 text-[10px] font-black text-primary transition-all hover:bg-primary/30 md:w-auto"
      >
        <Sparkles className="h-3.5 w-3.5" /> AI COMPARE
      </button>
    </div>
  )
}

type KitabPortalResultsProps = {
  searchQuery: string
  visibleCanonicalCards: CanonicalScriptureCard[]
  visibleAdditionalScriptures: AdditionalScriptureItem[]
  semanticHits: SemanticSearchHit[]
  totalProphets: number
  onClearSearch: () => void
}

export function KitabPortalResults({
  searchQuery,
  visibleCanonicalCards,
  visibleAdditionalScriptures,
  semanticHits,
  totalProphets,
  onClearSearch,
}: KitabPortalResultsProps) {
  const resourceCount =
    visibleCanonicalCards.length + visibleAdditionalScriptures.length

  return (
    <div className="flex min-w-0 flex-1 flex-col space-y-6">
      <div className="flex items-center justify-between gap-3 border-b border-border pb-3">
        <p className="font-mono text-[10px] tracking-widest text-foreground/40 uppercase">
          {resourceCount} resources in view
        </p>
        {searchQuery && (
          <button
            type="button"
            onClick={onClearSearch}
            className="text-[10px] font-bold tracking-widest text-primary uppercase hover:text-foreground"
          >
            Clear search
          </button>
        )}
      </div>

      {semanticHits.length > 0 && (
        <div className="rounded-xl border border-primary/20 bg-card p-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="font-mono text-xs font-semibold text-foreground uppercase">
                Semantic Search Results ({semanticHits.length})
              </span>
            </div>
            <span className="font-mono text-[10px] text-muted-foreground">
              BM25 Normalized
            </span>
          </div>
          <div className="mt-3 space-y-3">
            {semanticHits.map((hit) => (
              <div
                key={hit.id}
                className="rounded-lg border border-border/60 bg-muted/20 p-3"
              >
                <div className="flex items-center justify-between font-mono text-[10px] font-bold text-primary">
                  <span>
                    {hit.collection.toUpperCase()} · {hit.id}
                  </span>
                  <span>Score: {hit.score.toFixed(2)}</span>
                </div>
                <p className="arabic-text mt-1 text-right text-base text-foreground">
                  {hit.text_ar}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {hit.text_en}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {visibleCanonicalCards.length > 0 && (
        <KitabCanonicalGrid cards={visibleCanonicalCards} />
      )}
      {visibleAdditionalScriptures.length > 0 && (
        <KitabAdditionalGrid
          scriptures={visibleAdditionalScriptures}
          totalProphets={totalProphets}
        />
      )}
      {resourceCount === 0 && (
        <div className="rounded-xl border border-border bg-card p-10 text-center">
          <p className="font-mono text-sm text-muted-foreground">
            No scripture resources match this search.
          </p>
          <p className="mt-2 text-xs text-muted-foreground/70">
            Try a title, tradition, or collection filter.
          </p>
        </div>
      )}
    </div>
  )
}

export function KitabPortalFooter() {
  const features = [
    {
      icon: Globe2,
      title: "Interfaith Dialogue",
      description: "Understanding, not Debating",
      color: "text-blue-400",
    },
    {
      icon: Network,
      title: "Text Comparison Lab",
      description: "AI-Powered Analysis",
      color: "text-primary",
    },
    {
      icon: BookOpen,
      title: "Digital Library",
      description: "120+ Language Translation",
      color: "text-success",
    },
    {
      icon: User,
      title: "Community Research",
      description: "Collaborate & Share Insight",
      color: "text-warning",
    },
  ]

  return (
    <>
      <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-6">
        {features.map(({ icon: Icon, title, description, color }) => (
          <div
            key={title}
            className="group flex cursor-pointer items-center gap-3"
          >
            <Icon
              className={`h-5 w-5 text-foreground/30 transition-colors group-hover:${color}`}
            />
            <div>
              <div className="text-[9px] font-black tracking-widest text-foreground uppercase">
                {title}
              </div>
              <div className="text-[8px] text-foreground/50">{description}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="w-full pt-8 pb-4 text-center">
        <div className="text-[8px] font-black tracking-[0.3em] text-blue-500/50 uppercase">
          ★ WHEN THE MOON WITNESSES, WE SHARE MESSAGES. ★
        </div>
      </div>
    </>
  )
}
