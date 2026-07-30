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
const db = new Database(dbPath);

async function enrichJuzAndPage() {
  console.log("Fetching complete Quran metadata (Juz 1-30, Pages 1-604) from API...");
  const res = await fetch("https://api.alquran.cloud/v1/quran/quran-uthmani");
  if (!res.ok) throw new Error("Failed to fetch Quran metadata");
  const json = await res.json();
  const surahs = json.data.surahs;

  console.log(`Fetched metadata for ${surahs.length} surahs. Updating SQLite quran.db...`);

  const updateAyahStmt = db.prepare(`
    UPDATE ayahs 
    SET juz = ?, page = ? 
    WHERE surah_number = ? AND ayah_number = ?
  `);

  const updateBatch = db.transaction(() => {
    for (const s of surahs) {
      for (const a of s.ayahs) {
        updateAyahStmt.run(a.juz, a.page, s.number, a.numberInSurah);
      }
    }
  });

  updateBatch();
  console.log("✅ Local SQLite quran.db updated with Juz and Page numbers!");

  // Now update Supabase Cloud ayahs table with full payload
  console.log("Updating Supabase Cloud Database with full Ayah records...");

  const ayahs = db.prepare("SELECT id, surah_number, ayah_number, text_arabic, translation_id, translation_en, audio_url, juz, page FROM ayahs ORDER BY id ASC").all();

  const BATCH_SIZE = 500;
  for (let i = 0; i < ayahs.length; i += BATCH_SIZE) {
    const chunk = ayahs.slice(i, i + BATCH_SIZE).map((a) => ({
      id: a.id,
      surah_number: a.surah_number,
      ayah_number: a.ayah_number,
      text_arabic: a.text_arabic,
      translation_id: a.translation_id,
      translation_en: a.translation_en || "",
      audio_url: a.audio_url,
      juz: a.juz,
      page: a.page,
    }));

    const { error } = await supabase.from("ayahs").upsert(chunk, { onConflict: "id" });
    if (error) {
      console.error(`Error updating Supabase batch ${i}:`, error.message);
    } else {
      process.stdout.write(`\rSupabase Progress: ${Math.min(i + BATCH_SIZE, ayahs.length)} / ${ayahs.length} ayahs updated with Juz & Page.`);
    }
  }

  console.log("\n🎉 Supabase Cloud Database successfully updated with Juz (1-30) and Page (1-604) numbers!");
  db.close();
}

enrichJuzAndPage().catch((err) => {
  console.error("Error enriching Juz and Page data:", err);
  process.exit(1);
});
