import Link from "next/link"
import { ArrowLeft, ArrowRight, ExternalLink, Search } from "lucide-react"
import { CitationBox, ProvenanceCard } from "@workspace/ui"
import { contentLanguage, contentText, contentType, displaySource, field, type WitnessContent } from "@/lib/knowledge-api"
import type { ReactNode } from "react"

export { field }

export function PublicHeader({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return (
    <header className="space-y-2 border-b border-border pb-4">
      <p className="text-xs font-medium text-muted-foreground">{eyebrow}</p>
      <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">{title}</h1>
      <p className="max-w-3xl leading-7 text-muted-foreground">{description}</p>
    </header>
  )
}

export function PublicFrame({ children }: { children: ReactNode }) {
  return <div className="min-h-screen bg-background px-4 pb-8 pt-24 text-foreground sm:px-8"><div className="mx-auto max-w-6xl">{children}</div></div>
}

export function ErrorNotice({ message = "Content is temporarily unavailable." }: { message?: string }) {
  return <div role="alert" className="rounded-xl border border-destructive/30 bg-destructive/10 p-5 text-sm text-destructive">{message}</div>
}

export function SearchEntry({ initialQuery = "" }: { initialQuery?: string }) {
  return <form action="/knowledge/search" className="flex flex-col gap-2 sm:flex-row" role="search">
    <label htmlFor="knowledge-query" className="sr-only">Search the public knowledge corpus</label>
    <input id="knowledge-query" name="q" defaultValue={initialQuery} placeholder="Try quran:1:1 or a word from the corpus" className="h-11 min-w-0 flex-1 rounded-lg border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring" />
    <button className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground hover:opacity-90"><Search className="h-4 w-4" aria-hidden="true" />Search</button>
  </form>
}

export function SourceSummary({ source }: { source: WitnessContent | null }) {
  if (!source) return <p className="text-sm text-muted-foreground">Source metadata unavailable.</p>
  const id = field(source, "id")
  return <div className="space-y-1 text-sm"><p className="font-medium text-foreground">{displaySource(source)}</p><p className="text-muted-foreground">{[field(source, "publisher"), field(source, "edition"), field(source, "revision")].filter(Boolean).join(" · ") || "Metadata supplied by the Witness API."}</p>{id && <Link href={`/knowledge/sources/${id}`} className="inline-flex items-center gap-1 text-primary hover:underline">View source <ExternalLink className="h-3.5 w-3.5" /></Link>}</div>
}

export function ContentBlock({ content, label }: { content: WitnessContent; label: string }) {
  const language = contentLanguage(content)
  const isArabic = language === "ar" || field(content, "script") === "Arab"
  return <section className="space-y-3 border-b border-border py-4" aria-labelledby={`content-${label}`}>
    <div className="flex flex-wrap items-center justify-between gap-2"><h2 id={`content-${label}`} className="text-sm font-semibold text-foreground">{label}</h2><span className="rounded-full border border-border px-2 py-1 font-mono text-[11px] text-muted-foreground">{language || "language unavailable"}</span></div>
    <p lang={isArabic ? "ar" : language || undefined} dir={isArabic ? "rtl" : undefined} className={isArabic ? "arabic-text text-2xl" : "max-w-prose text-base leading-relaxed"}>{contentText(content)}</p>
  </section>
}

export function ProvenanceSection({ content, source, reference }: { content?: WitnessContent; source: WitnessContent | null; reference: string }) {
  const sourceName = displaySource(source)
  const edition = field(source, "edition") || field(content, "edition") || undefined
  const revision = field(source, "revision") || field(content, "revision") || undefined
  return <div className="grid gap-4 md:grid-cols-2"><CitationBox title={sourceName} sourceName={sourceName} edition={edition} revision={revision} reference={reference} language={content ? contentLanguage(content) : undefined} publisher={field(source, "publisher")} /><ProvenanceCard provenance={{ sourceName, sourceKey: field(source, "stableKey", "stable_key"), edition, revision, publisher: field(source, "publisher"), language: content ? contentLanguage(content) : undefined, license: field(source, "license"), checksum: field(content, "checksum") || field(source, "artifactChecksum", "artifact_checksum"), contentKind: content ? contentType(content) : undefined }} /></div>
}

export function BackLink({ href = "/knowledge/hub", children = "Back to knowledge" }: { href?: string; children?: ReactNode }) { return <Link href={href} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" />{children}</Link> }

export function Pagination({ page, hasNext, makeHref }: { page: number; hasNext: boolean; makeHref: (page: number) => string }) { return <nav className="flex justify-between border-t border-border pt-4" aria-label="Pagination"><span>{page > 1 ? <Link href={makeHref(page - 1)} className="inline-flex items-center gap-2 text-sm text-primary hover:underline"><ArrowLeft className="h-4 w-4" />Previous</Link> : null}</span><span>{hasNext ? <Link href={makeHref(page + 1)} className="inline-flex items-center gap-2 text-sm text-primary hover:underline">Next<ArrowRight className="h-4 w-4" /></Link> : null}</span></nav> }
