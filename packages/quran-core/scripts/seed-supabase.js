import { createClient } from "@supabase/supabase-js";
import Database from "better-sqlite3";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SUPABASE_URL = process.env.SUPABASE_URL || "https://ixclyaugedwwptbqsozv.supabase.co";
const SUPABASE_SECRET_KEY = process.env.SUPABASE_SECRET_KEY || "sb_secret_qEdkK1vRFn3KDzxX5kkg4w_UnrZnKdT";

const supabase = createClient(SUPABASE_URL, SUPABASE_SECRET_KEY);

const dbPath = path.join(__dirname, "../data/quran.db");
if (!fs.existsSync(dbPath)) {
  console.error("Local SQLite database quran.db not found. Please run build-db.js first.");
  process.exit(1);
}

const db = new Database(dbPath, { readonly: true });

async function seedSupabase() {
  console.log("Connecting to Supabase Cloud Database at:", SUPABASE_URL);

  // 1. Fetch surahs from local SQLite
  const surahs = db.prepare("SELECT * FROM surahs ORDER BY number ASC").all();
  console.log(`Found ${surahs.length} surahs in local DB. Uploading surahs to Supabase...`);

  const surahPayload = surahs.map((s) => ({
    number: s.number,
    name_arabic: s.name_arabic,
    name_latin: s.name_latin,
    translation_id: s.translation_id,
    translation_en: s.translation_en || "",
    number_of_ayahs: s.number_of_ayahs,
    revelation_type: s.revelation_type,
    audio_full: s.audio_full,
  }));

  const { error: surahErr } = await supabase.from("surahs").upsert(surahPayload, { onConflict: "number" });
  if (surahErr) {
    console.error("Failed to insert surahs to Supabase:", surahErr.message);
    console.log("\n⚠️ Hint: Please make sure you have run the schema.sql script in your Supabase SQL Editor first!");
    process.exit(1);
  }
  console.log("✅ 114 Surahs successfully uploaded to Supabase!");

  // 2. Fetch ayahs from local SQLite and batch upload in chunks of 500
  const ayahs = db.prepare("SELECT * FROM ayahs ORDER BY surah_number ASC, ayah_number ASC").all();
  console.log(`Found ${ayahs.length} ayahs. Uploading to Supabase in batches...`);

  const BATCH_SIZE = 500;
  for (let i = 0; i < ayahs.length; i += BATCH_SIZE) {
    const chunk = ayahs.slice(i, i + BATCH_SIZE).map((a) => ({
      surah_number: a.surah_number,
      ayah_number: a.ayah_number,
      text_arabic: a.text_arabic,
      translation_id: a.translation_id,
      translation_en: a.translation_en || "",
      audio_url: a.audio_url,
      juz: a.juz,
      page: a.page,
    }));

    const { error: ayahErr } = await supabase.from("ayahs").upsert(chunk, { onConflict: "id" });
    if (ayahErr) {
      console.error(`Failed to insert ayahs batch ${i}..${i + BATCH_SIZE}:`, ayahErr.message);
      process.exit(1);
    }

    process.stdout.write(`\rProgress: ${Math.min(i + BATCH_SIZE, ayahs.length)} / ${ayahs.length} ayahs uploaded.`);
  }

  console.log("\n🎉 All 6,236 Ayahs successfully uploaded to Supabase Cloud Database!");
  db.close();
}

seedSupabase().catch((err) => {
  console.error("Error seeding Supabase:", err);
  process.exit(1);
});
