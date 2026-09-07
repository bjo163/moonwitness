import type { ElementType } from "react"
import { Users, X, BookOpen, Book, Map, Globe2, Lightbulb } from "lucide-react"
import { useKnowledgeGraph } from "@workspace/hooks"
import { Button } from "../../components/button"

const iconMap: Record<string, ElementType> = { Users, BookOpen, Book, Map, Globe2, Lightbulb }
type ConnectionItem = { i: string; col: string; n: string; c: number | string }
type VerseItem = { arabic: string; reference: string; translation: string }
type HadithItem = { text: string; reference: string }
type EntityData = { name?: string; type?: string; description?: string; connections?: { total?: number | string; breakdown?: ConnectionItem[] }; verses?: VerseItem[]; hadiths?: HadithItem[] }

function GraphEntityHeader({ loading, entity, onClear }: { loading: boolean; entity?: EntityData; onClear: () => void }) {
  return <div className="flex items-start justify-between border-b border-border p-4"><div><div className="mb-4 text-sm font-medium text-primary">Selected entity</div>{loading ? <div className="text-sm text-muted-foreground">Loading entity…</div> : <div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-full border border-primary bg-primary/10 text-primary"><Users className="h-5 w-5" /></div><div><div className="text-lg font-semibold text-foreground">{entity?.name || "No entity"}</div><div className="text-xs font-medium text-primary">{entity?.type || "-"}</div></div></div>}</div><Button type="button" variant="ghost" onClick={onClear} className="flex items-center gap-1 text-xs text-primary hover:text-foreground"><X className="h-3 w-3" /> Clear</Button></div>
}

function GraphEntityTabs({ connectionCount }: { connectionCount: number | string }) {
  return <div className="flex border-b border-border text-xs font-medium text-primary"><Button type="button" variant="ghost" className="flex-1 border-b-2 border-primary py-2.5 text-primary">Overview</Button><Button type="button" variant="ghost" className="flex-1 py-2.5 hover:text-foreground">Connections <span className="ml-1 rounded bg-muted px-1 py-0.5 text-xs">{connectionCount}</span></Button><Button type="button" variant="ghost" className="flex-1 py-2.5 hover:text-foreground">Timeline</Button><Button type="button" variant="ghost" className="flex-1 py-2.5 hover:text-foreground">Insights</Button></div>
}

function GraphEntityContent({ loading, entity }: { loading: boolean; entity?: EntityData }) {
  const sections = [
    { title: "Description", content: loading ? <LoadingText label="Loading description…" /> : <p className="text-sm leading-relaxed text-foreground">{entity?.description || "-"}</p> },
    { title: "Key connections", content: loading ? <LoadingText label="Loading connections…" /> : <div className="space-y-1.5 text-sm">{entity?.connections?.breakdown?.map((connection, index) => { const Icon = iconMap[connection.i] || Map; return <div key={`${connection.i}-${index}`} className="flex items-center justify-between rounded p-1 hover:bg-muted"><span className="flex items-center gap-2"><Icon className={`h-3.5 w-3.5 ${connection.col}`} />{connection.n}</span><span className="font-mono text-primary">{connection.c}</span></div> })}</div> },
    { title: "Related verses", content: loading ? <LoadingText label="Loading verses…" /> : <div>{entity?.verses?.map((verse, index) => <article key={`${verse.reference}-${index}`} className="mb-2 space-y-2 rounded-md border border-border bg-background p-3"><div className="arabic-text text-right text-base font-semibold leading-relaxed text-primary" dir="rtl">{verse.arabic}</div><div className="text-xs font-medium text-primary">{verse.reference}</div><p className="text-sm italic leading-relaxed">{verse.translation}</p></article>)}</div> },
    { title: "Related hadith", content: loading ? <LoadingText label="Loading hadith…" /> : <div>{entity?.hadiths?.map((hadith, index) => <article key={`${hadith.reference}-${index}`} className="mb-2 space-y-2 rounded-md border border-border bg-background p-3"><p className="text-sm italic leading-relaxed">{hadith.text}</p><div className="text-xs font-medium text-primary">{hadith.reference}</div></article>)}</div> },
  ]
  return <div className="hide-scrollbar flex-1 space-y-5 overflow-y-auto p-4">{sections.map((section) => <section key={section.title}><h3 className="mb-2 text-sm font-medium text-primary">{section.title}</h3>{section.content}</section>)}</div>
}

function LoadingText({ label }: { label: string }) { return <div className="text-sm text-muted-foreground">{label}</div> }

export function GraphEntityPanelWidget() {
  const { data, loading, setSelectedNode } = useKnowledgeGraph()
  const entity = data?.selectedEntity as EntityData | undefined
  return <aside className="flex w-full shrink-0 flex-col overflow-hidden rounded-md border border-border bg-card lg:w-80"><GraphEntityHeader loading={loading} entity={entity} onClear={() => setSelectedNode(null)} /><div className="px-4 pt-2 pb-3 text-sm italic leading-relaxed text-muted-foreground">{loading ? "Loading…" : "Selected knowledge graph entity."}</div><GraphEntityTabs connectionCount={loading ? "0" : entity?.connections?.total || "0"} /><GraphEntityContent loading={loading} entity={entity} /></aside>
}
