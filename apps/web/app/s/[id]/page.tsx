import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ContentBlock, ErrorNotice, PublicFrame, PublicHeader, ProvenanceSection, SourceSummary } from "@/components/knowledge/public-content"
import { field, getLookup, getSource } from "@/lib/knowledge-api"

type Props = { params: Promise<{ id: string }>; searchParams: Promise<{ translation?: string }> }
export const dynamic = "force-dynamic"

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  return { title: `${id} · MoonWitness`, description: `Public source content and provenance for ${id}.` }
}

export default async function PassagePage({ params, searchParams }: Props) {
  const { id } = await params
  const query = await searchParams
  let lookup: any
  try { lookup = await getLookup(id) } catch { return <PublicFrame><ErrorNotice message="The Witness API is temporarily unavailable." /></PublicFrame> }
  if (!lookup?.resolved) notFound()

  const original = (lookup.content || [])[0]
  const translations = lookup.translations || []
  const selectedLanguage = query.translation || field(translations[0], "languageCode", "language_code", "language")
  const selectedTranslation = translations.find((item: any) => String(field(item, "languageCode", "language_code", "language")) === String(selectedLanguage)) || translations[0]
  let source: any = null
  try {
    const sourceId = field(original, "sourceId", "source_id") || field(selectedTranslation, "sourceId", "source_id")
    if (sourceId) source = await getSource(String(sourceId))
  } catch { /* Source metadata is optional to the reader. */ }
  const typeLabel = lookup.type === "HADITH" ? "Hadith" : "Scripture passage"
  const traditionUnit = lookup.tradition?.unit
  const hadithText = field(traditionUnit, "textOriginal", "text_original", "textArabic")
  return <PublicFrame><div className="space-y-8"><Link href="/knowledge/search" className="text-sm text-muted-foreground hover:text-foreground">← Search</Link><PublicHeader eyebrow={typeLabel} title={lookup.reference} description="A public record resolved through the MoonWitness Witness API." />
    {lookup.type === "HADITH" ? <section className="space-y-4 rounded-xl border border-border bg-card p-5 shadow-sm"><h2 className="text-sm font-semibold">Original text</h2><p lang="ar" dir="rtl" className="font-arabic text-right text-2xl leading-[2.2]">{hadithText || "Original text unavailable."}</p>{traditionUnit && <p className="border-t border-border pt-4 leading-7">{field(traditionUnit, "translationId", "translation_id", "textId", "text_id", "translationEn", "translation_en") || "Translation not available."}</p>}</section> : <><ContentBlock content={original || { text: "Original text unavailable." }} label="Original source text" />{translations.length > 0 ? <section className="space-y-4 rounded-xl border border-border bg-card p-5 shadow-sm"><div className="flex flex-wrap items-center justify-between gap-3"><h2 className="text-sm font-semibold">Translation</h2><form><label htmlFor="translation" className="sr-only">Choose translation</label><select id="translation" name="translation" defaultValue={String(selectedLanguage || "")} className="rounded-md border border-input bg-background px-3 py-2 text-sm">{translations.map((item: any, index: number) => { const lang = String(field(item, "languageCode", "language_code", "language") || `translation-${index + 1}`); return <option key={`${lang}-${index}`} value={lang}>{lang}</option> })}</select><button className="ml-2 rounded-md bg-secondary px-3 py-2 text-sm text-secondary-foreground">Apply</button></form></div><ContentBlock content={selectedTranslation} label="Attributed translation" /></section> : <p className="rounded-xl border border-border bg-card p-5 text-sm text-muted-foreground">Translation not available.</p>}</>}
    <section className="rounded-xl border border-border bg-card p-5 shadow-sm"><h2 className="mb-3 text-sm font-semibold">Source</h2><SourceSummary source={source} /></section><ProvenanceSection content={original} source={source} reference={lookup.reference} />
  </div></PublicFrame>
}
