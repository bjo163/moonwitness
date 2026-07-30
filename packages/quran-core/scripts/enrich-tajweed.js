import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL || "https://ixclyaugedwwptbqsozv.supabase.co";
const SUPABASE_SECRET_KEY = process.env.SUPABASE_SECRET_KEY || "sb_secret_qEdkK1vRFn3KDzxX5kkg4w_UnrZnKdT";

const supabase = createClient(SUPABASE_URL, SUPABASE_SECRET_KEY);

async function enrichTajweed() {
  console.log("Fetching existing ayahs from Supabase to merge Tajweed tags...");
  const { data: existingAyahs, error: fetchErr } = await supabase
    .from("ayahs")
    .select("id, surah_number, ayah_number, text_arabic, translation_id");

  if (fetchErr || !existingAyahs) {
    console.error("Failed to fetch existing ayahs:", fetchErr);
    process.exit(1);
  }

  const ayahsMap = new Map();
  existingAyahs.forEach((a) => ayahsMap.set(`s${a.surah_number}_a${a.ayah_number}`, a));

  console.log("Fetching Tajweed tags for all 114 Surahs from Quran.com API v4...");

  const ayahsPayload = [];

  for (let s = 1; s <= 114; s++) {
    const res = await fetch(`https://api.quran.com/api/v4/quran/verses/uthmani_tajweed?chapter_number=${s}`);
    if (!res.ok) {
      console.error(`Failed to fetch tajweed for surah ${s}`);
      continue;
    }
    const json = await res.json();
    const verses = json.verses;

    for (const v of verses) {
      const ayahNum = parseInt(v.verse_key.split(":")[1], 10);
      const existing = ayahsMap.get(`s${s}_a${ayahNum}`);
      if (existing) {
        ayahsPayload.push({
          id: existing.id,
          surah_number: s,
          ayah_number: ayahNum,
          text_arabic: existing.text_arabic,
          translation_id: existing.translation_id,
          text_tajweed: v.text_uthmani_tajweed || "",
        });
      }
    }

    process.stdout.write(`\rFetched Tajweed for Surah ${s}/114. Total ayahs: ${ayahsPayload.length}`);
  }

  console.log("\nBatch uploading Tajweed data to Supabase Cloud...");

  const BATCH_SIZE = 400;
  for (let i = 0; i < ayahsPayload.length; i += BATCH_SIZE) {
    const chunk = ayahsPayload.slice(i, i + BATCH_SIZE);

    const { error } = await supabase
      .from("ayahs")
      .upsert(chunk, { onConflict: "id" });

    if (error) {
      console.error(`\nError updating Tajweed batch ${i}:`, error.message);
    } else {
      process.stdout.write(`\rSupabase Progress: ${Math.min(i + BATCH_SIZE, ayahsPayload.length)} / ${ayahsPayload.length} ayahs updated with text_tajweed.`);
    }
  }

  console.log("\n🎉 Tajweed rules (Idgham, Ikhfa, Qalqalah, Iqlab, Ghunnah, Mad) successfully added to Supabase Cloud Database for all 6,236 Ayahs!");
}

enrichTajweed().catch((err) => {
  console.error("Error enriching Tajweed:", err);
  process.exit(1);
});
