import Link from "next/link"
import { fetchHadithList } from "@moon/client"
import { ErrorNotice, Pagination, PublicFrame, PublicHeader, field } from "@/components/knowledge/public-content"

type Props = { params: Promise<{ slug: string }>; searchParams: Promise<{ page?: string }> }
export const dynamic = "force-dynamic"
export default async function HadithCollectionPage({ params, searchParams }: Props) {
  const { slug } = await params
  const page = Math.max(Number((await searchParams).page || 1), 1)
  try {
    const data: any = await fetchHadithList(slug, page, 20)
    const items = data.items || []
    const total = Number(data.book?.totalItems || 0)
    return <PublicFrame><div className="space-y-8"><Link href="/knowledge/hadits" className="text-sm text-muted-foreground hover:text-foreground">← All collections</Link><PublicHeader eyebrow="Hadith collection" title={data.book?.name || slug} description={`${total || items.length} records reported by the Witness API.`} /><div className="space-y-3">{items.length === 0 ? <p className="rounded-xl border border-border bg-card p-5 text-sm text-muted-foreground">No content is available.</p> : items.map((item: any) => <article key={item.number} className="rounded-xl border border-border bg-card p-5 shadow-sm"><div className="flex items-center justify-between"><h2 className="font-mono text-sm text-muted-foreground">{slug}:{item.number}</h2><Link href={`/s/${slug}:${item.number}`} className="text-xs text-primary hover:underline">Open</Link></div><p lang="ar" dir="rtl" className="mt-3 font-arabic text-right text-xl leading-[2.1]">{field(item, "textArabic", "text_ar") || "Original text unavailable."}</p><p className="mt-3 leading-7">{field(item, "textId", "text_id", "textEn", "text_en") || "Translation not available."}</p></article>)}</div><Pagination page={page} hasNext={items.length === 20 && (!total || page * 20 < total)} makeHref={(next) => `/knowledge/hadits/${slug}?page=${next}`} /></div></PublicFrame>
  } catch { return <PublicFrame><ErrorNotice message="This hadith collection is temporarily unavailable." /></PublicFrame> }
}
