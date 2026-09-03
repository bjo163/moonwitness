import Link from "next/link"
import { fetchSurahDetail } from "@moon/client"
import { ErrorNotice, PublicFrame, PublicHeader } from "@/components/knowledge/public-content"

type Props = { params: Promise<{ number: string }> }
export const dynamic = "force-dynamic"

export default async function ScriptureWorkPage({ params }: Props) {
  const { number } = await params
  try {
    const data: any = await fetchSurahDetail(Number(number))
    const surah = data.surah
    const ayahs = data.ayahs || []
    return <PublicFrame><div className="space-y-8"><Link href="/knowledge/kitab" className="text-sm text-muted-foreground hover:text-foreground">← All surahs</Link><PublicHeader eyebrow={`Scripture · ${number}`} title={surah.name} description={`${surah.revelationType || ""} · ${surah.versesCount ?? ayahs.length} ayahs`} /><div className="space-y-4">{ayahs.map((ayah: any) => <article key={ayah.number} id={`ayah-${ayah.number}`} className="rounded-xl border border-border bg-card p-5 shadow-sm"><div className="flex items-center justify-between gap-3"><h2 className="font-mono text-sm text-muted-foreground">{number}:{ayah.number}</h2><Link href={`/s/quran:${number}:${ayah.number}`} className="text-xs text-primary hover:underline">Open passage</Link></div><p lang="ar" dir="rtl" className="mt-4 font-arabic text-right text-2xl leading-[2.2]">{ayah.textArabic}</p>{ayah.textLatin && <p className="mt-3 text-sm italic text-muted-foreground">{ayah.textLatin}</p>}</article>)}</div></div></PublicFrame>
  } catch { return <PublicFrame><ErrorNotice message="This scripture work is not available." /></PublicFrame> }
}
