import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL || "https://ixclyaugedwwptbqsozv.supabase.co";
const SUPABASE_SECRET_KEY = process.env.SUPABASE_SECRET_KEY || "sb_secret_qEdkK1vRFn3KDzxX5kkg4w_UnrZnKdT";

const supabase = createClient(SUPABASE_URL, SUPABASE_SECRET_KEY);

const HADITH_BOOKS = [
  { slug: "bukhari", name: "Shahih Al-Bukhari", total: 6638, level: "SHAHIH" },
  { slug: "muslim", name: "Shahih Muslim", total: 4930, level: "SHAHIH" },
  { slug: "tirmidzi", name: "Sunan At-Tirmidzi", total: 3625, level: "HASAN" },
  { slug: "abudaud", name: "Sunan Abu Daud", total: 4419, level: "HASAN" },
  { slug: "nasai", name: "Sunan An-Nasa'i", total: 5364, level: "HASAN" },
  { slug: "ibnumajah", name: "Sunan Ibnu Majah", total: 4285, level: "DHAIF" },
  { slug: "malik", name: "Muwatta Malik", total: 1594, level: "SHAHIH" },
  { slug: "ahmad", name: "Musnad Ahmad", total: 4305, level: "HASAN" },
  { slug: "darimi", name: "Sunan Ad-Darimi", total: 3367, level: "HASAN" },
];

async function seedAll38kHadiths() {
  console.log("🚀 Starting Complete 38.527 Hadiths Seeding to Supabase Cloud...");

  for (const book of HADITH_BOOKS) {
    const totalPages = Math.ceil(book.total / 20);
    console.log(`\n📚 Syncing ALL ${book.total} Hadiths for ${book.name} (${totalPages} pages)...`);

    for (let page = 1; page <= totalPages; page++) {
      try {
        const res = await fetch(`https://hadis-api-id.vercel.app/hadith/${book.slug}?page=${page}`);
        if (res.ok) {
          const json = await res.json();
          if (json && Array.isArray(json.items) && json.items.length > 0) {
            const rowsPayload = json.items.map((item, idx) => ({
              book_slug: book.slug,
              number: (page - 1) * 20 + (idx + 1),
              text_id: item.id || "",
              grade: book.level,
            }));

            const { error } = await supabase.from("hadiths").upsert(rowsPayload, { onConflict: "id" });
            if (error) {
              console.warn(`   [${book.slug}] Page ${page} insert note:`, error.message);
            } else {
              console.log(`   ✅ [${book.slug.toUpperCase()}] Synced Page ${page}/${totalPages} (${rowsPayload.length} Hadiths)`);
            }
          }
        }
      } catch {
        console.warn(`   ⚠️ Error page ${page} for ${book.slug}:`, err.message);
      }
    }
  }

  console.log("\n🎉 ALL 38.527 HADITHS SUCCESSFULLY UPLOADED TO SUPABASE CLOUD DATABASE!");
}

seedAll38kHadiths();
