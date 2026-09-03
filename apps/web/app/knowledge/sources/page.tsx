import Link from "next/link"
import { ErrorNotice, PublicFrame, PublicHeader } from "@/components/knowledge/public-content"
import { displaySource, field, getSources } from "@/lib/knowledge-api"

export const dynamic = "force-dynamic"
export default async function SourcesPage() {
  try {
    const sources = await getSources()
    return <PublicFrame><div className="space-y-8"><PublicHeader eyebrow="Transparency" title="Sources" description="Public source and edition metadata returned by the Witness API." /><div className="space-y-3">{sources.length === 0 ? <p className="rounded-xl border border-border bg-card p-5 text-sm text-muted-foreground">No source metadata is available.</p> : sources.map((source: any) => <Link key={field(source, "id")} href={`/knowledge/sources/${field(source, "id")}`} className="block rounded-xl border border-border bg-card p-5 shadow-sm hover:border-primary"><h2 className="font-semibold">{displaySource(source)}</h2><p className="mt-2 text-sm text-muted-foreground">{[field(source, "publisher"), field(source, "edition"), field(source, "revision"), field(source, "language")].filter(Boolean).join(" · ") || "Metadata supplied by the source registry."}</p></Link>)}</div></div></PublicFrame>
  } catch { return <PublicFrame><ErrorNotice message="Source metadata is temporarily unavailable." /></PublicFrame> }
}
