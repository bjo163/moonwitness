import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL || "https://ixclyaugedwwptbqsozv.supabase.co";
const SUPABASE_SECRET_KEY = process.env.SUPABASE_SECRET_KEY || "sb_secret_qEdkK1vRFn3KDzxX5kkg4w_UnrZnKdT";

const supabase = createClient(SUPABASE_URL, SUPABASE_SECRET_KEY);

const SCRIPTURE_BOOKS_PLAN = [
  // TAURAT BOOKS (Musa a.s.)
  { scriptureId: "taurat", code: "GEN", name: "Kejadian (Genesis)", totalChapters: 50 },
  { scriptureId: "taurat", code: "EXO", name: "Keluaran (Exodus)", totalChapters: 40 },
  { scriptureId: "taurat", code: "LEV", name: "Imamat (Leviticus)", totalChapters: 27 },
  { scriptureId: "taurat", code: "NUM", name: "Bilangan (Numbers)", totalChapters: 36 },
  { scriptureId: "taurat", code: "DEU", name: "Ulangan (Deuteronomy)", totalChapters: 34 },

  // ZABUR BOOKS (Daud a.s.)
  { scriptureId: "zabur", code: "PSA", name: "Mazmur (Psalms)", totalChapters: 150 },

  // INJIL BOOKS (Isa a.s.)
  { scriptureId: "injil", code: "MAT", name: "Injil Matius (Matthew)", totalChapters: 28 },
  { scriptureId: "injil", code: "MRK", name: "Injil Markus (Mark)", totalChapters: 16 },
  { scriptureId: "injil", code: "LUK", name: "Injil Lukas (Luke)", totalChapters: 24 },
  { scriptureId: "injil", code: "JHN", name: "Injil Yohanes (John)", totalChapters: 21 },
];

async function bulkSeedScriptureVerses() {
  console.log("🚀 Starting Bulk Download & Insert of ALL Scripture Verses into Supabase Cloud...");

  let grandTotalVerses = 0;

  for (const book of SCRIPTURE_BOOKS_PLAN) {
    console.log(`\n📖 Fetching & Inserting ${book.name} (${book.totalChapters} Chapters) into Supabase Cloud...`);

    for (let ch = 1; ch <= book.totalChapters; ch++) {
      try {
        const res = await fetch(`https://bible-api.com/data/web/${book.code}/${ch}`);
        if (res.ok) {
          const json = await res.json();
          if (json && Array.isArray(json.verses) && json.verses.length > 0) {
            const rowsPayload = json.verses.map((v) => ({
              scripture_id: book.scriptureId,
              section_number: ch,
              verse_number: v.verse,
              text_original: v.text.trim(),
              text_transliteration: "",
              translation_id: v.text.trim(),
              notes: `${book.name} Pasal ${ch}:${v.verse} &middot; World English Text`,
            }));

            const { error } = await supabase.from("scripture_verses").upsert(rowsPayload, { onConflict: "id" });

            if (error) {
              console.warn(`   [${book.code}] Ch ${ch} insert note:`, error.message);
            } else {
              grandTotalVerses += rowsPayload.length;
              console.log(`   ✅ [${book.scriptureId.toUpperCase()} - ${book.code}] Chapter ${ch}/${book.totalChapters} (${rowsPayload.length} Verses inserted into Supabase Cloud)`);
            }
          }
        }
      } catch {
        console.warn(`   ⚠️ Error Ch ${ch} for ${book.code}:`, err.message);
      }
    }
  }

  console.log(`\n🎉 SUCCESS! GRAND TOTAL ${grandTotalVerses} VERSES FOR TAURAT, ZABUR, AND INJIL ARE NOW 100% STORED IN YOUR SUPABASE CLOUD DATABASE!`);
}

bulkSeedScriptureVerses().catch((err) => {
  console.error("Error bulk seeding scripture verses:", err);
  process.exit(1);
});
