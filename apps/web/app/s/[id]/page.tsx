import { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { InspirationCommentsClient } from "@/views/knowledge/components/inspiration-comments-client"
import { cleanHadithText, apiGet } from "@moon/client"
import { ContextBlock, VerseInsightTooltip } from "@workspace/ui"

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
    title: `Inspiration Q.S ${surahName} (${surahNum}:${ayahNum}) | MoonWitness Cosmic Inspiration`,
    description: `MoonWitness Short Link — Q.S ${surahName} Ayah ${ayahNum}, Prophetic Hadiths & Cosmic Lore Transmission.`,
    openGraph: {
      title: `Inspiration Q.S ${surahName} (${surahNum}:${ayahNum})`,
      description: `MoonWitness Short Link — Q.S ${surahName} Ayah ${ayahNum}, Prophetic Hadiths & Cosmic Lore Transmission.`,
      url: `/s/${id}`,
    },
  }
}

import { Suspense } from "react"

export default function ShortUrlInspirationSharePage({ params }: PageProps) {
  return (
    <div className="theme-grid-bg min-h-screen py-10 font-mono text-foreground">
      <Suspense
        fallback={
          <div className="flex h-64 animate-pulse items-center justify-center tracking-widest text-primary">
            LOADING TRANSMISSION...
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
  // MOCK FOR NOW UNTIL WE ADD A SPECIFIC WITNESS ENDPOINT
  const scriptureData = {
    translation_id: "Sungguh petunjuk Allah adalah sebaik-baik petunjuk.",
    notes: "Khazanah Kitab Suci Global",
  }

  const shortUrl = `${process.env.NEXT_PUBLIC_APP_URL || ""}/s/${id}`

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 sm:px-6">
      <ContextBlock
        title={`INSPIRATION Q.S ${surahName} (${surahNum}:${ayahNum})`}
        subtitle="MoonWitness Short Link — Prophetic Hadiths & Cosmic Lore Transmission."
        operation="TACTICAL-SHARE"
        status="ONLINE"
        accentColor="knowledge"
      />

      {/* FULL SHORT SHARE CARD */}
      <div className=" relative space-y-6 overflow-hidden panel-glass p-6 card-clip sm:p-10">
        <div className="holo-scan-bar" />

        {/* Header Branding */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-primary/20 pb-4">
          <div className="flex items-center gap-3">
            <div className="tag-clip flex h-10 w-10 items-center justify-center border border-secondary/50 bg-secondary/20 text-xl font-bold">
              🌙
            </div>
            <div>
              <h1 className="text-base font-black tracking-widest text-foreground uppercase">
                MOONWITNESS SHORT TRANSMISSION
              </h1>
              <p className="text-[10px] font-bold tracking-wider text-secondary uppercase">
                // DIVINE SCRIPTURES & SACRED LORE REPOSITORY
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="rounded-md border border-emerald-500/40 bg-emerald-500/10 text-emerald-500 px-2 py-0.5 font-mono text-xs">
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
          <div className="bg-background/90 space-y-4 panel-glass p-6 card-clip">
            <div
              className="arabic-text py-2 text-right text-2xl leading-[2.3] font-bold text-foreground sm:text-4xl"
              style={{ textShadow: "0 0 10px rgba(0,240,255,0.15)" }}
            >
              {ayahData.textArabic}
            </div>

            {ayahData.textLatin && (
              <p
                className="text-success font-serif text-xs font-bold italic sm:text-sm"
                style={{ textShadow: "0 0 5px rgba(0,255,102,0.3)" }}
              >
                &ldquo;{ayahData.textLatin}&rdquo;
              </p>
            )}

            <div className="bg-panel tag-clip border border-primary/20 p-4">
              <p className="font-mono text-xs leading-relaxed text-foreground/90">
                &ldquo;{ayahData.textId || ayahData.textEn}&rdquo;
              </p>
            </div>

            <div className="tag-clip border border-accent/30 bg-accent/5 p-4 text-xs">
              <div className="mb-1 flex items-center gap-2 font-bold text-accent">
                <span>💡</span>
                <span>DIVINE TAFSIR & LORE NOTES:</span>
              </div>
              <p className="text-foreground/90 italic">
                &ldquo;Tadabbur tentang ketaatan semesta alam kepada Sang Maha
                Pencipta dan keagungan tauhid.&rdquo;
              </p>
            </div>
          </div>
        </VerseInsightTooltip>

        {/* Asmaul Husna Pairs */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {asmaulSurah && (
            <div className=" flex items-center justify-between panel-glass p-4 card-clip">
              <div>
                <span className="block text-[9px] font-black text-primary uppercase">
                  ✨ SURAH PAIR RUNIC #{surahNum}
                </span>
                <h4 className="text-xs font-bold text-foreground">
                  {asmaulSurah.latin}
                </h4>
                <p className="text-[10px] text-primary">
                  &ldquo;{asmaulSurah.meaning}&rdquo;
                </p>
              </div>
              <div className="arabic-text text-2xl text-secondary">
                {asmaulSurah.arabic}
              </div>
            </div>
          )}

          {asmaulAyah && (
            <div className=" flex items-center justify-between panel-glass p-4 card-clip">
              <div>
                <span className="block text-[9px] font-black text-primary uppercase">
                  ✨ AYAH PAIR RUNIC #{ayahNum}
                </span>
                <h4 className="text-xs font-bold text-foreground">
                  {asmaulAyah.latin}
                </h4>
                <p className="text-[10px] text-primary">
                  &ldquo;{asmaulAyah.meaning}&rdquo;
                </p>
              </div>
              <div className="arabic-text text-2xl text-secondary">
                {asmaulAyah.arabic}
              </div>
            </div>
          )}
        </div>

        {/* Hadith Block */}
        {hadithData && (
          <div className=" space-y-3 panel-glass p-5 card-clip">
            <div className="flex items-center gap-2 text-[10px] font-bold text-destructive">
              <span>⚔️</span>
              <span className="uppercase">
                PROPHETIC COMMAND (HADITH {bookName.toUpperCase()} #
                {hadithData.number})
              </span>
              <span className="tag-clip bg-destructive/20 px-1 text-[8px] text-destructive">
                {"SHAHIH"}
              </span>
            </div>
            <p className="border-l-2 border-destructive/50 pl-3 font-serif text-sm leading-relaxed text-foreground/80 italic">
              &ldquo;{cleanHadithText(hadithData.textId || hadithData.textEn)}
              &rdquo;
            </p>
          </div>
        )}

        {/* Universal Wisdom Block */}
        <div className=" space-y-3 panel-glass p-5 card-clip">
          <div className="flex items-center gap-2 text-[10px] font-bold text-secondary">
            <span>📜</span>
            <span className="uppercase">
              UNIVERSAL SCRIPTURE CROSS-REFERENCE
            </span>
          </div>
          <p className="border-l-2 border-secondary/50 pl-3 font-serif text-sm leading-relaxed text-foreground/80 italic">
            &ldquo;{scriptureData.translation_id}&rdquo;
          </p>
          <div className="text-right text-[10px] font-bold text-secondary">
            — {scriptureData.notes}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-4 flex flex-col justify-between gap-4 border-t border-primary/20 pt-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2">
            <div className="bg-success h-2 w-2 animate-pulse" />
            <span className="text-success text-[10px] font-bold tracking-widest uppercase">
              TRANSMISSION VERIFIED
            </span>
          </div>

          <div className="flex gap-2">
            <Link
              href="/"
              className="tag-clip inline-flex h-8 items-center justify-center bg-secondary/10 px-4 text-xs font-bold text-secondary transition-colors hover:bg-secondary hover:text-secondary-foreground"
            >
              LAUNCH COMMAND CENTER
            </Link>
          </div>
        </div>
      </div>

      <div className="pt-8">
        <InspirationCommentsClient
          periodCode="shared"
          dateStr={new Date().toISOString().split("T")[0] || ""}
          itemId={parseInt(id) || 1}
        />
      </div>
    </div>
  )
}
