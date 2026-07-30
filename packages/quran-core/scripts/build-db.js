import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataDir = path.join(__dirname, "../data");
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, "quran.db");

// Hapus DB lama jika ada untuk rebuild ulang dari nol
if (fs.existsSync(dbPath)) {
  fs.unlinkSync(dbPath);
}

const db = new Database(dbPath);
db.pragma("journal_mode = WAL");

console.log("Initializing SQLite schema...");

db.exec(`
  CREATE TABLE IF NOT EXISTS surahs (
    number INTEGER PRIMARY KEY,
    name_arabic TEXT NOT NULL,
    name_latin TEXT NOT NULL,
    translation_id TEXT NOT NULL,
    translation_en TEXT NOT NULL,
    number_of_ayahs INTEGER NOT NULL,
    revelation_type TEXT NOT NULL,
    audio_full TEXT
  );

  CREATE TABLE IF NOT EXISTS ayahs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    surah_number INTEGER NOT NULL,
    ayah_number INTEGER NOT NULL,
    text_arabic TEXT NOT NULL,
    translation_id TEXT NOT NULL,
    translation_en TEXT,
    audio_url TEXT,
    juz INTEGER,
    page INTEGER,
    FOREIGN KEY (surah_number) REFERENCES surahs (number)
  );

  CREATE INDEX IF NOT EXISTS idx_ayahs_surah ON ayahs(surah_number);
  CREATE INDEX IF NOT EXISTS idx_ayahs_surah_ayah ON ayahs(surah_number, ayah_number);
  CREATE INDEX IF NOT EXISTS idx_ayahs_trans ON ayahs(translation_id);
`);

const insertSurah = db.prepare(`
  INSERT INTO surahs (number, name_arabic, name_latin, translation_id, translation_en, number_of_ayahs, revelation_type, audio_full)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`);

const insertAyah = db.prepare(`
  INSERT INTO ayahs (surah_number, ayah_number, text_arabic, translation_id, translation_en, audio_url, juz, page)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`);

async function seedDatabase() {
  console.log("Fetching 114 Surahs data from Equran API...");
  const res = await fetch("https://equran.id/api/v2/surat");
  if (!res.ok) throw new Error("Failed to fetch surah list");
  const json = await res.json();
  const surahs = json.data;

  console.log(`Found ${surahs.length} surahs. Seeding database...`);

  for (let i = 0; i < surahs.length; i++) {
    const s = surahs[i];
    const surahNum = s.nomor;

    // Fetch detail surah
    const detailRes = await fetch(`https://equran.id/api/v2/surat/${surahNum}`);
    if (!detailRes.ok) {
      console.error(`Failed to fetch detail for Surah ${surahNum}`);
      continue;
    }
    const detailJson = await detailRes.json();
    const detail = detailJson.data;

    const audioFull = detail.audioFull ? detail.audioFull["05"] || detail.audioFull["01"] : null;

    const insertSurahBatch = db.transaction(() => {
      insertSurah.run(
        detail.nomor,
        detail.nama,
        detail.namaLatin,
        detail.arti,
        "",
        detail.jumlahAyat,
        detail.tempatTurun === "Mekah" ? "MAKKIYAH" : "MADANIYAH",
        audioFull
      );

      for (const a of detail.ayat) {
        const audioUrl = a.audio ? a.audio["05"] || a.audio["01"] : null;
        insertAyah.run(
          detail.nomor,
          a.nomorAyat,
          a.teksArab,
          a.teksIndonesia,
          "",
          audioUrl,
          null,
          null
        );
      }
    });

    insertSurahBatch();
    process.stdout.write(`\rProgress: Surah ${surahNum}/114 (${detail.namaLatin}) seeded.`);
  }

  console.log("\nDatabase seeded successfully!");
  console.log(`SQLite Database saved to: ${dbPath}`);
  db.close();
}

seedDatabase().catch((err) => {
  console.error("\nError seeding database:", err);
  process.exit(1);
});
