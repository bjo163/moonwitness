import Link from "next/link"
import { apiGet } from "@moon/client"
import { ErrorNotice, PublicFrame, PublicHeader, SearchEntry } from "@/components/knowledge/public-content"

type Props = { searchParams: Promise<{ q?: string; filter?: string; page?: string }> }

export const dynamic = "force-dynamic"

export default async function SearchPage({ searchParams }: Props) {
  const params = await searchParams
  const query = params.q?.trim() || ""
  const filter = params.filter || "ALL"
  const page = Math.max(Number(params.page || 1), 1)
  let response: any = null
  let error = false
  if (query) {
    try { response = await apiGet(`/api/witness/search?q=${encodeURIComponent(query)}&filter=${encodeURIComponent(filter)}&page=${page}&limit=20`) } catch { error = true }
  }
  const results = response?.results || []
  return <PublicFrame><div className="space-y-8"><PublicHeader eyebrow="Public knowledge" title="Search the corpus" description="Searches are served by the MoonWitness Witness API and return only records available to the public portal." /><SearchEntry initialQuery={query} />
    <div className="flex flex-wrap gap-2" aria-label="Search filters">{["ALL", "SCRIPTURE", "HADITH", "LEXICAL"].map((value) => <Link key={value} href={`/knowledge/search?q=${encodeURIComponent(query)}&filter=${value}`} className={`rounded-full border px-3 py-1 text-xs ${filter === value ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground"}`}>{value}</Link>)}</div>
    {!query && <p className="rounded-xl border border-border bg-card p-6 text-sm text-muted-foreground">Enter a reference such as <code>quran:1:1</code>, <code>bukhari:1</code>, or a term from the corpus.</p>}
    {error && <ErrorNotice />}
    {query && !error && <div className="space-y-3"><p className="text-sm text-muted-foreground">{response?.total ?? 0} result{response?.total === 1 ? "" : "s"} for <span className="font-medium text-foreground">{query}</span></p>{results.length === 0 ? <p className="rounded-xl border border-border bg-card p-6 text-sm text-muted-foreground">No content is available for this search.</p> : results.map((result: any) => <article key={result.id} className="rounded-xl border border-border bg-card p-5 shadow-sm"><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="font-mono text-xs text-muted-foreground">{result.type} · {result.reference}</p><h2 className="mt-1 text-lg font-semibold"><Link href={result.link || `/s/${encodeURIComponent(result.reference)}`} className="hover:text-primary hover:underline">{result.title || result.reference}</Link></h2></div>{result.language && <span className="rounded-full border border-border px-2 py-1 text-xs text-muted-foreground">{result.language}</span>}</div><p className="mt-3 text-sm leading-6 text-muted-foreground">{result.snippet}</p>{result.source && <p className="mt-3 text-xs text-muted-foreground">Source: {result.source}</p>}</article>)}</div>}
  </div></PublicFrame>
}
