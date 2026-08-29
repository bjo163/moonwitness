import Link from "next/link"
import { ErrorNotice, PublicFrame, PublicHeader, SourceSummary } from "@/components/knowledge/public-content"
import { displaySource, field, getSource } from "@/lib/knowledge-api"

type Props = { params: Promise<{ id: string }> }
export const dynamic = "force-dynamic"
const sourceFields: Array<[string, string]> = [["Provider", "publisher"], ["Domain", "scriptureFamily"], ["Edition", "edition"], ["Language", "language"], ["License", "license"], ["Revision", "revision"], ["Corpus", "corpus"]]
export default async function SourcePage({ params }: Props) {
  const { id } = await params
  try {
    const source = await getSource(id)
    if (!source || !field(source, "id")) return <PublicFrame><ErrorNotice message="Source not found." /></PublicFrame>
    return <PublicFrame><div className="space-y-8"><Link href="/knowledge/sources" className="text-sm text-muted-foreground hover:text-foreground">← All sources</Link><PublicHeader eyebrow="Source registry" title={displaySource(source)} description="Source metadata as recorded by the public Witness registry." /><div className="rounded-xl border border-border bg-card p-5 shadow-sm"><SourceSummary source={source} /><dl className="mt-6 grid gap-4 border-t border-border pt-5 sm:grid-cols-2">{sourceFields.map(([label, key]) => <div key={key}><dt className="text-xs text-muted-foreground">{label}</dt><dd className="mt-1 text-sm">{field(source, key) || "Not provided"}</dd></div>)}</dl></div></div></PublicFrame>
  } catch { return <PublicFrame><ErrorNotice message="Source metadata is temporarily unavailable." /></PublicFrame> }
}
