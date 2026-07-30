import { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getSupabaseClient } from "@workspace/quran-core"
import { InspirationCommentsClient } from "@modules/knowledge/components/inspiration-comments-client"
import { cleanHadithText } from "@core/utils/hadith-cleaner"
import { ContextBlock } from "@core/ui"

type PageProps = {
  params: Promise<{
    id: string
  }>
}

export async function generateStaticParams() {
  return [{ id: "1-1" }]
}

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

  const sb = getSupabaseClient()
  const { data: surahData } = await sb
    .from("surahs")
    .select("name_latin")
    .eq("number", surahNum)
    .single()

  const surahName = surahData?.name_latin || `Surah ${surahNum}`

  return {
    title: `Inspiration Q.S ${surahName} (${surahNum}:${ayahNum}) | MoonWitness Tactical Share`,
    description: `MoonWitness Short Link — Q.S ${surahName} Ayah ${ayahNum}, Prophetic Hadiths & Cosmic Lore Transmission.`,
    openGraph: {
      title: `Inspiration Q.S ${surahName} (${surahNum}:${ayahNum})`,
      description: `MoonWitness Short Link — Q.S ${surahName} Ayah ${ayahNum}, Prophetic Hadiths & Cosmic Lore Transmission.`,
      url: `http://localhost:3000/s/${id}`,
    },
  }
}

import { Suspense } from "react"

export default function ShortUrlInspirationSharePage({ params }: PageProps) {
  return (
    <div className="theme-grid-bg min-h-screen py-10 font-mono text-foreground">
      <Suspense fallback={<div className="flex h-64 items-center justify-center animate-pulse text-primary tracking-widest">LOADING TRANSMISSION...</div>}>
        <ShortUrlInspirationShareContent params={params} />
      </Suspense>
    </div>
  )
}

async function ShortUrlInspirationShareContent({
  params,
}: PageProps) {
  const { id } = await params
  const { surahNum, ayahNum, periodCode } = parseShortId(id)

  const sb = getSupabaseClient()

  // 1. Fetch Ayah Data from Supabase Cloud
  const { data: ayahData } = await sb
    .from("ayahs")
    .select(
      "id, surah_number, ayah_number, text_arabic, text_latin, translation_id, audio_url"
    )
    .eq("surah_number", surahNum)
    .eq("ayah_number", ayahNum)
    .single()

  if (!ayahData) {
    notFound()
  }

  // 2. Fetch Surah Name
  const { data: surahData } = await sb
    .from("surahs")
    .select("name_latin")
    .eq("number", surahNum)
    .single()

  const surahName = surahData?.name_latin || `Surah ${surahNum}`

  // 3. Fetch Asmaul Husna Pairs
  const { data: asmaulSurah } = await sb
    .from("asmaul_husna")
    .select("number, name_arabic, name_latin, translation_id")
    .eq("number", ((surahNum - 1) % 99) + 1)
    .single()

  const { data: asmaulAyah } = await sb
    .from("asmaul_husna")
    .select("number, name_arabic, name_latin, translation_id")
    .eq("number", ((ayahNum - 1) % 99) + 1)
    .single()

  // 4. Fetch Hadits
  const { data: hadithData } = await sb
    .from("hadith_collections")
    .select("book_id, number, text_id, grade")
    .limit(1)
    .single()

  let bookName = "Sunan At-Tirmidzi"
  if (hadithData?.book_id) {
    const { data: bookInfo } = await sb
      .from("hadith_books")
      .select("name")
      .eq("id", hadithData.book_id)
      .single()
    if (bookInfo?.name) bookName = bookInfo.name
  }

  // 5. Fetch Scripture Wisdom
  const { data: scriptureData } = await sb
    .from("scripture_verses")
    .select("book_name, chapter_number, verse_number, translation_id, notes")
    .limit(1)
    .single()

  const shortUrl = `http://localhost:3000/s/${id}`

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
        <div className="panel-glass card-clip corner-box relative space-y-6 overflow-hidden p-6 sm:p-10">
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
              <span className="tag-clip tag-clip-green tag-clip text-xs">
                📖 Q.S {surahName} ({surahNum}:{ayahNum})
              </span>
            </div>
          </div>

          {/* Ayah Card */}
          <div className="panel-glass card-clip bg-space/90 space-y-4 p-6">
            <div
              className="arabic-text py-2 text-right text-2xl leading-[2.3] font-bold text-foreground sm:text-4xl"
              style={{ textShadow: "0 0 10px rgba(0,240,255,0.15)" }}
            >
              {ayahData.text_arabic}
            </div>

            {ayahData.text_latin && (
              <p
                className="text-success font-serif text-xs font-bold italic sm:text-sm"
                style={{ textShadow: "0 0 5px rgba(0,255,102,0.3)" }}
              >
                &ldquo;{ayahData.text_latin}&rdquo;
              </p>
            )}

            <div className="bg-panel tag-clip border border-primary/20 p-4">
              <p className="font-mono text-xs leading-relaxed text-foreground/90">
                &ldquo;{ayahData.translation_id}&rdquo;
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

          {/* Asmaul Husna Pairs */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {asmaulSurah && (
              <div className="panel-glass card-clip corner-box flex items-center justify-between p-4">
                <div>
                  <span className="block text-[9px] font-black text-primary uppercase">
                    ✨ SURAH PAIR RUNIC #{surahNum}
                  </span>
                  <h4 className="text-xs font-bold text-foreground">
                    {asmaulSurah.name_latin}
                  </h4>
                  <p className="text-[10px] text-primary">
                    &ldquo;{asmaulSurah.translation_id}&rdquo;
                  </p>
                </div>
                <div className="font-serif text-xl font-bold text-primary">
                  {asmaulSurah.name_arabic}
                </div>
              </div>
            )}

            {asmaulAyah && (
              <div className="panel-glass card-clip corner-secondary flex items-center justify-between p-4">
                <div>
                  <span className="block text-[9px] font-black text-primary uppercase">
                    ✨ AYAH PAIR RUNIC #{ayahNum}
                  </span>
                  <h4 className="text-xs font-bold text-foreground">
                    {asmaulAyah.name_latin}
                  </h4>
                  <p className="text-[10px] text-primary">
                    &ldquo;{asmaulAyah.translation_id}&rdquo;
                  </p>
                </div>
                <div className="font-serif text-xl font-bold text-primary">
                  {asmaulAyah.name_arabic}
                </div>
              </div>
            )}
          </div>

          {/* Hadits Nabawi & Hikmah Grid */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {hadithData && (
              <div className="panel-glass card-clip corner-secondary space-y-2 p-5">
                <div className="flex items-center justify-between">
                  <span className="tag-clip tag-clip-purple tag-clip text-[9px]">
                    📜 HADITS NABAWI
                  </span>
                  <span className="tag-clip tag-clip-green tag-clip py-0 text-[8px]">
                    {hadithData.grade || "SHAHIH"}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-foreground">
                  {bookName} (NO. {hadithData.number})
                </h4>
                <p className="bg-space tag-clip border border-secondary/20 p-3 text-xs text-foreground/90 italic">
                  &ldquo;{cleanHadithText(hadithData.text_id)}&rdquo;
                </p>
              </div>
            )}

            {scriptureData && (
              <div className="panel-glass card-clip corner-accent flex flex-col justify-between space-y-2 p-5">
                <div>
                  <span className="tag-clip tag-clip-yellow tag-clip mb-1 text-[9px]">
                    💎 ANCIENT WISDOM &amp; SACRED LORE
                  </span>
                  <h4 className="text-xs font-bold text-foreground">
                    Khazanah Taurat &amp; Injil
                  </h4>
                  <p className="text-xs text-primary italic">
                    &ldquo;{scriptureData.translation_id}&rdquo;
                  </p>
                </div>
                <p className="border-t border-primary/15 pt-2 text-[10px] font-bold text-primary">
                  —{" "}
                  {scriptureData.notes ||
                    "ANCIENT SCRIPTURES & DIVINE LORE ARCHIVE"}
                </p>
              </div>
            )}
          </div>

          {/* INTERACTIVE COMMENTS & REFLECTIONS SECTION */}
          <InspirationCommentsClient
            periodCode={periodCode}
            dateStr="2026-07-26"
            itemId={ayahData.id}
            itemTitle={`Surah ${surahName} (${surahNum}:${ayahNum})`}
          />

          {/* Footer Share Links */}
          <div className="flex flex-col items-center justify-between gap-4 border-t border-primary/20 pt-4 font-mono sm:flex-row">
            <div className="text-xs font-extrabold text-foreground">
              🔗 SHORT LINK RESMI:{" "}
              <span className="text-primary underline">{shortUrl}</span>
            </div>

            <Link href="/">
              <button className="btn-primary btn-clip px-6 py-2.5 text-xs">
                ✨ RETURN TO MAIN PORTAL
              </button>
            </Link>
          </div>
        </div>
      </div>
  )
}
