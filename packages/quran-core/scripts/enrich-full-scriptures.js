import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL || "https://ixclyaugedwwptbqsozv.supabase.co";
const SUPABASE_SECRET_KEY = process.env.SUPABASE_SECRET_KEY || "sb_secret_qEdkK1vRFn3KDzxX5kkg4w_UnrZnKdT";

const supabase = createClient(SUPABASE_URL, SUPABASE_SECRET_KEY);

// Scripture Books Registry
export const SCRIPTURE_BOOKS = {
  taurat: [
    { code: "GEN", name: "Kejadian (Genesis)", totalChapters: 50 },
    { code: "EXO", name: "Keluaran (Exodus)", totalChapters: 40 },
    { code: "LEV", name: "Imamat (Leviticus)", totalChapters: 27 },
    { code: "NUM", name: "Bilangan (Numbers)", totalChapters: 36 },
    { code: "DEU", name: "Ulangan (Deuteronomy)", totalChapters: 34 },
  ],
  zabur: [
    { code: "PSA", name: "Mazmur / Zabur (Psalms)", totalChapters: 150 },
  ],
  injil: [
    { code: "MAT", name: "Injil Matius (Matthew)", totalChapters: 28 },
    { code: "MRK", name: "Injil Markus (Mark)", totalChapters: 16 },
    { code: "LUK", name: "Injil Lukas (Luke)", totalChapters: 24 },
    { code: "JHN", name: "Injil Yohanes (John)", totalChapters: 21 },
  ],
};

async function enrichFullScriptures() {
  console.log("Seeding Full Book Sections for Taurat, Zabur, and Injil into Supabase Cloud...");

  const sectionsPayload = [];

  // Taurat sections
  SCRIPTURE_BOOKS.taurat.forEach((b, idx) => {
    sectionsPayload.push({
      scripture_id: "taurat",
      section_number: idx + 1,
      title_latin: b.name,
      title_original: b.code,
      translation_id: `Kitab ${b.name} (${b.totalChapters} Bab)`,
      total_verses: b.totalChapters,
    });
  });

  // Zabur sections
  SCRIPTURE_BOOKS.zabur.forEach((b, idx) => {
    sectionsPayload.push({
      scripture_id: "zabur",
      section_number: idx + 1,
      title_latin: b.name,
      title_original: b.code,
      translation_id: `Kitab ${b.name} (${b.totalChapters} Mazmur)`,
      total_verses: b.totalChapters,
    });
  });

  // Injil sections
  SCRIPTURE_BOOKS.injil.forEach((b, idx) => {
    sectionsPayload.push({
      scripture_id: "injil",
      section_number: idx + 1,
      title_latin: b.name,
      title_original: b.code,
      translation_id: `Kitab ${b.name} (${b.totalChapters} Bab)`,
      total_verses: b.totalChapters,
    });
  });

  const { error } = await supabase.from("scripture_sections").upsert(sectionsPayload, { onConflict: "id" });

  if (error) {
    console.error("Error seeding scripture sections:", error.message);
  } else {
    console.log("🎉 All scripture books & sections registered in Supabase Cloud!");
  }
}

enrichFullScriptures().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
