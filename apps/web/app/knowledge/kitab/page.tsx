import Link from "next/link"
import { fetchSurahList } from "@moon/client"
import { ErrorNotice, PublicFrame, PublicHeader } from "@/components/knowledge/public-content"

export const dynamic = "force-dynamic"

export default async function ScriptureIndexPage() {
  try {
    const data: any = await fetchSurahList()
    const surahs = data.surahs || []
    return <PublicFrame><div className="space-y-8"><PublicHeader eyebrow="Scripture" title={data.scripture?.name || "Qur'an"} description="Browse the available surah structure in the canonical order supplied by the Witness API." /><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{surahs.map((surah: any) => <Link key={surah.number} href={`/knowledge/kitab/${surah.number}`} className="rounded-xl border border-border bg-card p-4 shadow-sm hover:border-primary"><div className="flex items-baseline justify-between gap-3"><span className="font-mono text-sm text-muted-foreground">{surah.number}</span><span className="text-xs text-muted-foreground">{surah.versesCount ?? "—"} ayahs</span></div><h2 className="mt-2 font-semibold">{surah.name}</h2>{surah.nameOriginal && <p lang="ar" dir="rtl" className="mt-1 font-arabic text-lg text-muted-foreground">{surah.nameOriginal}</p>}</Link>)}</div></div></PublicFrame>
  } catch { return <PublicFrame><ErrorNotice message="Scripture is temporarily unavailable." /></PublicFrame> }
}
