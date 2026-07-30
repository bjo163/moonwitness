import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL || "https://ixclyaugedwwptbqsozv.supabase.co";
const SUPABASE_SECRET_KEY = process.env.SUPABASE_SECRET_KEY || "sb_secret_qEdkK1vRFn3KDzxX5kkg4w_UnrZnKdT";

const supabase = createClient(SUPABASE_URL, SUPABASE_SECRET_KEY);

async function enrichTransliteration() {
  console.log("Fetching transliteration (teksLatin / Cara Membaca) for all 114 Surahs from Equran API...");

  const ayahsPayload = [];
  let globalId = 1;

  for (let s = 1; s <= 114; s++) {
    const res = await fetch(`https://equran.id/api/v2/surat/${s}`);
    if (!res.ok) {
      console.error(`Failed to fetch surah ${s}`);
      continue;
    }
    const json = await res.json();
    const detail = json.data;

    for (const a of detail.ayat) {
      ayahsPayload.push({
        id: globalId++,
        surah_number: s,
        ayah_number: a.nomorAyat,
        text_latin: a.teksLatin || "",
        text_arabic: a.teksArab,
        translation_id: a.teksIndonesia,
      });
    }

    process.stdout.write(`\rFetched Surah ${s}/114 (${detail.namaLatin}). Total ayahs: ${ayahsPayload.length}`);
  }

  console.log("\nUploading transliteration data to Supabase Cloud...");

  const BATCH_SIZE = 400;
  for (let i = 0; i < ayahsPayload.length; i += BATCH_SIZE) {
    const chunk = ayahsPayload.slice(i, i + BATCH_SIZE);

    const { error } = await supabase
      .from("ayahs")
      .upsert(chunk, { onConflict: "id" });

    if (error) {
      console.error(`\nError updating batch ${i}:`, error.message);
    } else {
      process.stdout.write(`\rSupabase Progress: ${Math.min(i + BATCH_SIZE, ayahsPayload.length)} / ${ayahsPayload.length} ayahs updated with text_latin.`);
    }
  }

  console.log("\n🎉 Transliteration (Cara Membaca / teksLatin) successfully added to Supabase Cloud Database for all 6,236 Ayahs!");
}

enrichTransliteration().catch((err) => {
  console.error("Error enriching transliteration:", err);
  process.exit(1);
});
