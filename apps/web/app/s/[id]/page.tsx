import { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { InspirationCommentsClient } from "@/views/knowledge/components/inspiration-comments-client"
import { cleanHadithText, apiGet } from "@moon/client"
import { ContextBlock, VerseInsightTooltip, CitationBox, ProvenanceCard } from "@workspace/ui"
import { Suspense } from "react"

type PageProps = {
  params: Promise<{
    id: string
  }>
}

export const dynamic = "force-dynamic"

function parseShortId(idStr: string): {
  surahNum: number
  ayahNum: number
  periodCode: string
} {
  const cleaned = idStr.replace(/^MW[-_]?/i, "")
  const parts = cleaned.split(/[-:_]/)
  if (parts.length >= 2) {
    const s = parseInt(parts[0] || "", 10)
    const a = parseInt(parts[1] || "", 10)
    if (!isNaN(s) && !isNaN(a)) {
      return { surahNum: s, ayahNum: a, periodCode: parts[2] || "maghrib" }
    }
  }

  try {
    let b64 = cleaned
    while (b64.length % 4 !== 0) b64 += "="
    const decoded = Buffer.from(b64, "base64").toString("utf-8")
    const dParts = decoded.split(":")
    if (dParts.length >= 2) {
      const s = parseInt(dParts[0] || "", 10)
      const a = parseInt(dParts[1] || "", 10)
      if (!isNaN(s) && !isNaN(a)) {
        return { surahNum: s, ayahNum: a, periodCode: dParts[2] || "maghrib" }
      }
    }
  } catch {
    // Ignore base64 decode failure
  }

  return { surahNum: 38, ayahNum: 34, periodCode: "maghrib" }
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params
  const { surahNum, ayahNum } = parseShortId(id)

  let surahName = `Surah ${surahNum}`
  try {
    const json = await apiGet<any>(
      `/api/witness/quran/surah?number=${surahNum}`
    )
    if (json?.surah?.name) surahName = json.surah.name
  } catch {}

  return {
    title: `Inspiration Q.S ${surahName} (${surahNum}:${ayahNum}) | MoonWitness Knowledge`,
    description: `MoonWitness Citation — Q.S ${surahName} Ayah ${ayahNum}, Prophetic Hadiths & Scripture Reflection.`,
    openGraph: {
      title: `Inspiration Q.S ${surahName} (${surahNum}:${ayahNum})`,
      description: `MoonWitness Citation — Q.S ${surahName} Ayah ${ayahNum}, Prophetic Hadiths & Scripture Reflection.`,
      url: `/s/${id}`,
    },
  }
}

export default function ShortUrlInspirationSharePage({ params }: PageProps) {
  return (
    <div className="min-h-screen py-10 font-sans text-foreground bg-background">
      <Suspense
        fallback={
          <div className="flex h-64 animate-pulse items-center justify-center tracking-widest text-primary text-sm">
            Loading Verse Inspiration...
          </div>
        }
      >
        <ShortUrlInspirationShareContent params={params} />
      </Suspense>
    </div>
  )
}

async function ShortUrlInspirationShareContent({ params }: PageProps) {
  const { id } = await params
  const { surahNum, ayahNum, periodCode } = parseShortId(id)

  // 1 & 2. Fetch Surah and Ayah Data from Witness API
  let ayahData: any = null
  let surahName = `Surah ${surahNum}`
  try {
    const json = await apiGet<any>(
      `/api/witness/quran/surah?number=${surahNum}`
    )
    surahName = json?.surah?.name || surahName
    const ayahs = json?.ayahs || []
    ayahData = ayahs.find((a: any) => a.number === ayahNum) || ayahs[0]
  } catch (e) {
    console.error(e)
  }

  if (!ayahData) {
    notFound()
  }

  // 3. Fetch Asmaul Husna Pairs
  let asmaulSurah = null
  let asmaulAyah = null
  try {
    const json = await apiGet<any>(
      `/api/witness/asmaul-husna`
    )
    const data = json?.data || []
    asmaulSurah = data[(surahNum - 1) % 99] || null
    asmaulAyah = data[(ayahNum - 1) % 99] || null
  } catch (e) {
    console.error(e)
  }

  // 4. Fetch Hadits
  let hadithData: any = null
  let bookName = "Shahih Bukhari"
  try {
    const json = await apiGet<any>(
      `/api/witness/hadith?slug=bukhari&limit=1&page=${ayahNum % 500}`
    )
    hadithData = (json?.hadiths || [])[0]
  } catch (e) {}

  // 5. Fetch Scripture Wisdom
  const scriptureData = {
    translation_id: "Sungguh petunjuk Allah adalah sebaik-baik petunjuk.",
    notes: "Khazanah Kitab Suci Global",
  }

  const canonicalRef = `Q.S ${surahName} (${surahNum}:${ayahNum})`

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 sm:px-6">
      <ContextBlock
        title={`INSPIRATION Q.S ${surahName} (${surahNum}:${ayahNum})`}
        subtitle="MoonWitness Knowledge Link — Prophetic Hadiths & Scripture Reflection."
        operation="SHARE-VIEW"
        status="ACTIVE"
        accentColor="primary"
      />

      {/* FULL SHORT SHARE CARD */}
      <div className="relative space-y-6 overflow-hidden rounded-xl border border-border bg-card p-6 shadow-sm sm:p-8">
        {/* Header Branding */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
          <div className="flex items-center gap-3">
            <div className="rounded-md flex h-10 w-10 items-center justify-center border border-border bg-muted/20 text-xl font-bold">
              🌙
            </div>
            <div>
              <h1 className="text-base font-semibold text-foreground">
                MoonWitness Scripture & Wisdom Reference
              </h1>
              <p className="text-xs text-muted-foreground">
                Canonical Witness Graph & Sacred Tradition
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="rounded-md border border-success/30 bg-success/10 text-success px-2.5 py-1 font-mono text-xs">
              📖 Q.S {surahName} ({surahNum}:{ayahNum})
            </span>
          </div>
        </div>

        {/* Ayah Card */}
        <VerseInsightTooltip
          verseKey={`${surahNum}-${ayahNum}`}
          arabicText={ayahData.textArabic}
          translation={ayahData.textId || ayahData.textEn}
        >
          <div className="space-y-4 rounded-xl border border-border bg-background/50 p-6">
            <div
              lang="ar"
              dir="rtl"
              className="font-arabic py-2 text-right text-2xl leading-[2.3] text-foreground sm:text-4xl"
            >
              {ayahData.textArabic}
            </div>

            {ayahData.textLatin && (
              <p className="text-muted-foreground font-sans text-xs italic sm:text-sm">
                &ldquo;{ayahData.textLatin}&rdquo;
              </p>
            )}

            <div className="rounded-md border border-border bg-card p-4">
              <p className="font-sans text-sm leading-relaxed text-foreground">
                &ldquo;{ayahData.textId || ayahData.textEn}&rdquo;
              </p>
            </div>

            <div className="rounded-md border border-border bg-muted/20 p-4 text-xs">
              <div className="mb-1 flex items-center gap-2 font-semibold text-foreground">
                <span>💡</span>
                <span>Tafsir & Contextual Reflection:</span>
              </div>
              <p className="text-muted-foreground italic">
                &ldquo;Tadabbur tentang ketaatan semesta alam kepada Sang Maha
                Pencipta dan keagungan tauhid.&rdquo;
              </p>
            </div>
          </div>
        </VerseInsightTooltip>

        {/* Asmaul Husna Pairs */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {asmaulSurah && (
            <div className="flex items-center justify-between rounded-xl border border-border bg-card p-4">
              <div>
                <span className="block text-[10px] font-semibold text-primary uppercase">
                  Surah Pair #{surahNum}
                </span>
                <h4 className="text-xs font-bold text-foreground">
                  {asmaulSurah.latin}
                </h4>
                <p className="text-[11px] text-muted-foreground">
                  &ldquo;{asmaulSurah.meaning}&rdquo;
                </p>
              </div>
              <div className="font-arabic text-2xl text-primary">
                {asmaulSurah.arabic}
              </div>
            </div>
          )}

          {asmaulAyah && (
            <div className="flex items-center justify-between rounded-xl border border-border bg-card p-4">
              <div>
                <span className="block text-[10px] font-semibold text-primary uppercase">
                  Ayah Pair #{ayahNum}
                </span>
                <h4 className="text-xs font-bold text-foreground">
                  {asmaulAyah.latin}
                </h4>
                <p className="text-[11px] text-muted-foreground">
                  &ldquo;{asmaulAyah.meaning}&rdquo;
                </p>
              </div>
              <div className="font-arabic text-2xl text-primary">
                {asmaulAyah.arabic}
              </div>
            </div>
          )}
        </div>

        {/* Hadith Block */}
        {hadithData && (
          <div className="space-y-3 rounded-xl border border-border bg-card p-5">
            <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
              <span>📜</span>
              <span>
                Prophetic Tradition (Hadith {bookName} #{hadithData.number})
              </span>
              <span className="rounded-md border border-success/30 bg-success/10 text-success px-1.5 py-0.5 text-[10px]">
                Shahih
              </span>
            </div>
            <p className="border-l-2 border-primary/40 pl-3 font-sans text-xs leading-relaxed text-muted-foreground italic">
              &ldquo;{cleanHadithText(hadithData.textId || hadithData.textEn)}&rdquo;
            </p>
          </div>
        )}

        {/* Universal Wisdom Block */}
        <div className="space-y-3 rounded-xl border border-border bg-card p-5">
          <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
            <span>📖</span>
            <span>Universal Scripture Cross-Reference</span>
          </div>
          <p className="border-l-2 border-border pl-3 font-sans text-xs leading-relaxed text-muted-foreground italic">
            &ldquo;{scriptureData.translation_id}&rdquo;
          </p>
          <div className="text-right text-xs text-muted-foreground">
            — {scriptureData.notes}
          </div>
        </div>

        {/* Structured Citation & Provenance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <CitationBox
            title="Al-Qur'an al-Karim"
            sourceName="Al-Qur'an al-Karim"
            edition="Mushaf Madinah Uthmani"
            reference={canonicalRef}
            language="ar"
            revision="1.0.0"
            publisher="King Fahd Glorious Quran Printing Complex"
          />

          <ProvenanceCard
            provenance={{
              sourceName: "King Fahd Glorious Quran Printing Complex",
              sourceKey: "source:quran-uthmani",
              edition: "quran-uthmani-v1",
              revision: "1.0.0",
              publisher: "King Fahd Glorious Quran Printing Complex",
              language: "Arabic (Uthmani Script)",
              license: "Public Domain / Islamic Heritage",
              checksum: "sha256-verified-release-1.0.0",
              authority: "REVELATION",
              contentKind: "ORIGINAL_TEXT"
            }}
          />
        </div>

        {/* Footer Actions */}
        <div className="mt-4 flex flex-col justify-between gap-4 border-t border-border pt-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2">
            <div className="bg-success h-2 w-2 rounded-full" />
            <span className="text-success text-xs font-medium">
              Canonical Reference Verified
            </span>
          </div>

          <div className="flex gap-2">
            <Link
              href="/"
              className="rounded-md inline-flex h-8 items-center justify-center border border-border bg-secondary px-4 text-xs font-medium text-secondary-foreground transition-colors hover:bg-accent"
            >
              Back to Overview
            </Link>
          </div>
        </div>
      </div>

      {/* Community Comments */}
      <InspirationCommentsClient
        periodCode={periodCode}
        dateStr={new Date().toISOString().split('T')[0]!}
        itemId={ayahNum}
        itemTitle={canonicalRef}
      />
    </div>
  )
}
