import { Users, X, BookOpen, Book, Map, Globe2, Lightbulb } from "lucide-react"
import { useKnowledgeGraph } from "../../hooks/use-knowledge-graph"

const iconMap: Record<string, React.ElementType> = {
  Users, BookOpen, Book, Map, Globe2, Lightbulb
};

type ConnectionItem = { i: string; col: string; n: string; c: number | string }
type VerseItem = { arabic: string; reference: string; translation: string }
type HadithItem = { text: string; reference: string }

export function GraphEntityPanelWidget() {
  const { data, loading } = useKnowledgeGraph();
  return (
    <div className="bg-space flex w-full shrink-0 flex-col overflow-hidden rounded-xl border border-primary/30 shadow-[0_0_20px_rgba(0,240,255,0.05)] lg:w-80">
      {/* Header */}
      <div className="flex items-start justify-between border-b border-white/10 p-4">
        <div>
          <div className="mb-4 text-[9px] font-black tracking-widest text-primary uppercase">
            SELECTED ENTITY
          </div>
          {loading ? (
             <div className="text-white/50 text-xs animate-pulse">Loading entity...</div>
          ) : (
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-primary bg-primary/10 text-primary">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <div className="text-lg leading-tight font-bold text-white">
                {data?.selectedEntity?.name || "No Entity"}
              </div>
              <div className="text-[10px] font-bold text-primary uppercase">
                {data?.selectedEntity?.type || "-"}
              </div>
            </div>
          </div>
          )}
        </div>
        <button className="flex items-center gap-1 text-[8px] text-primary hover:text-white">
          <X className="h-3 w-3" /> Clear
        </button>
      </div>

      <div className="px-4 pt-2 pb-3">
        <div className="font-sans text-[9px] leading-relaxed text-primary italic">
          {loading ? "..." : "One of the greatest prophets of Allah."}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/10 text-[9px] font-bold text-primary">
        <button className="flex-1 border-b-2 border-primary py-2.5 text-primary">
          OVERVIEW
        </button>
        <button className="flex-1 py-2.5 transition-colors hover:text-white">
          CONNECTIONS{" "}
          <span className="ml-1 rounded bg-white/10 px-1 py-0.5 text-[8px]">
            {loading ? "0" : data?.selectedEntity?.connections?.total || "0"}
          </span>
        </button>
        <button className="flex-1 py-2.5 transition-colors hover:text-white">
          TIMELINE
        </button>
        <button className="flex-1 py-2.5 transition-colors hover:text-white">
          INSIGHTS
        </button>
      </div>

      <div className="hide-scrollbar flex-1 space-y-5 overflow-y-auto p-4">
        {/* Description */}
        <div>
          <div className="mb-2 text-[9px] font-black tracking-widest text-primary uppercase">
            DESCRIPTION
          </div>
          <div className="font-sans text-[10px] leading-relaxed text-white/80">
            {loading ? <div className="text-white/50 text-xs animate-pulse">Loading description...</div> : (data?.selectedEntity?.description || "-")}
          </div>
        </div>

        {/* Key Connections */}
        <div>
          <div className="mb-2 text-[9px] font-black tracking-widest text-primary uppercase">
            KEY CONNECTIONS
          </div>
          <div className="space-y-1.5 text-[9px]">
            {loading ? (
               <div className="text-white/50 text-xs animate-pulse">Loading connections...</div>
            ) : (
              (data?.selectedEntity as { connections?: { breakdown?: ConnectionItem[] } } | undefined)?.connections?.breakdown?.map((conn: ConnectionItem, i: number) => {
                const IconComponent = iconMap[conn.i] || Map;
                return (
                  <div key={i} className="group flex cursor-pointer items-center justify-between rounded p-1 hover:bg-white/5">
                    <span className="flex items-center gap-2 text-white/80">
                      <IconComponent className={`h-3.5 w-3.5 ${conn.col}`} /> {conn.n}
                    </span>
                    <span className="font-mono text-primary">{conn.c}</span>
                  </div>
                )
              })
            )}
          </div>
        </div>

        {/* Related Verses */}
        <div>
          <div className="mb-2 text-[9px] font-black tracking-widest text-primary uppercase">
            RELATED VERSES
          </div>
          {loading ? (
             <div className="text-white/50 text-xs animate-pulse">Loading verses...</div>
          ) : (
            (data?.selectedEntity as { verses?: VerseItem[] } | undefined)?.verses?.map((verse: VerseItem, i: number) => (
              <div key={i} className="space-y-2 rounded-lg border border-primary/20 bg-primary/10 p-3 mb-2">
                <div
                  className="font-arabic text-right text-[14px] leading-relaxed font-bold text-primary"
                  dir="rtl"
                >
                  {verse.arabic}
                </div>
                <div className="text-[8px] font-bold text-primary uppercase">
                  {verse.reference}
                </div>
                <div className="font-sans text-[9px] leading-relaxed text-white/70 italic">
                  {verse.translation}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Related Hadith */}
        <div>
          <div className="mb-2 text-[9px] font-black tracking-widest text-primary uppercase">
            RELATED HADITH
          </div>
          {loading ? (
             <div className="text-white/50 text-xs animate-pulse">Loading hadith...</div>
          ) : (
            (data?.selectedEntity as { hadiths?: HadithItem[] } | undefined)?.hadiths?.map((hadith: HadithItem, i: number) => (
              <div key={i} className="bg-space space-y-2 rounded-lg border border-white/5 p-3 mb-2">
                <div className="font-sans text-[9px] leading-relaxed text-white/80 italic">
                  {hadith.text}
                </div>
                <div className="text-[8px] font-bold text-primary uppercase">
                  {hadith.reference}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
