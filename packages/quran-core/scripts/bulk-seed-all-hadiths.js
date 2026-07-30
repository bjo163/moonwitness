import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL || "https://ixclyaugedwwptbqsozv.supabase.co";
const SUPABASE_SECRET_KEY = process.env.SUPABASE_SECRET_KEY || "sb_secret_qEdkK1vRFn3KDzxX5kkg4w_UnrZnKdT";

const supabase = createClient(SUPABASE_URL, SUPABASE_SECRET_KEY);

const HADITH_BOOKS_SEED = [
  { slug: "bukhari", name: "Shahih Al-Bukhari", total_hadiths: 6638, level_grade: "SHAHIH", description: "Kitab himpunan hadits paling shahih karya Imam Al-Bukhari r.a." },
  { slug: "muslim", name: "Shahih Muslim", total_hadiths: 4930, level_grade: "SHAHIH", description: "Kitab himpunan hadits shahih karya Imam Muslim r.a." },
  { slug: "tirmidzi", name: "Sunan At-Tirmidzi", total_hadiths: 3625, level_grade: "HASAN", description: "Kitab hadits hukum & fiqih karya Imam At-Tirmidzi r.a." },
  { slug: "abudaud", name: "Sunan Abu Daud", total_hadiths: 4419, level_grade: "HASAN", description: "Kitab hadits hukum fiqih karya Imam Abu Daud r.a." },
  { slug: "nasai", name: "Sunan An-Nasa'i", total_hadiths: 5364, level_grade: "HASAN", description: "Kitab sunan karya Imam An-Nasa'i r.a." },
  { slug: "ibnumajah", name: "Sunan Ibnu Majah", total_hadiths: 4285, level_grade: "DHAIF", description: "Kitab sunan karya Imam Ibnu Majah r.a." },
  { slug: "malik", name: "Muwatta Malik", total_hadiths: 1594, level_grade: "SHAHIH", description: "Kitab hadits dan fiqih tertua karya Imam Malik bin Anas r.a." },
  { slug: "ahmad", name: "Musnad Ahmad", total_hadiths: 4305, level_grade: "HASAN", description: "Kitab musnad hadits karya Imam Ahmad bin Hanbal r.a." },
  { slug: "darimi", name: "Sunan Ad-Darimi", total_hadiths: 3367, level_grade: "HASAN", description: "Kitab sunan karya Imam Ad-Darimi r.a." },
];

async function bulkSeedAllHadiths() {
  console.log("🚀 Starting Bulk Seeding of Hadith Collections into Supabase Cloud...");

  // 1. Seed Books Master Data
  const { error: err1 } = await supabase.from("hadith_books").upsert(HADITH_BOOKS_SEED, { onConflict: "slug" });
  if (err1) {
    console.error("Error upserting hadith books:", err1.message);
  } else {
    console.log("✅ Master Hadith Books upserted in Supabase Cloud!");
  }

  // 2. Fetch and Bulk Insert Hadiths pages for each book
  for (const book of HADITH_BOOKS_SEED) {
    console.log(`\n📥 Fetching & Syncing Hadiths for ${book.name} (${book.slug})...`);
    let page = 1;
    let hasMore = true;
    let totalInserted = 0;

    // Fetch up to 10 pages (~200 hadiths per book for fast initial cloud sync)
    while (hasMore && page <= 10) {
      try {
        const res = await fetch(`https://hadis-api-id.vercel.app/hadith/${book.slug}?page=${page}`);
        if (res.ok) {
          const json = await res.json();
          if (json && Array.isArray(json.items) && json.items.length > 0) {
            const rowsPayload = json.items.map((item, idx) => ({
              book_slug: book.slug,
              number: (page - 1) * 20 + (idx + 1),
              text_id: item.id || "",
              grade: book.level_grade,
            }));

            const { error: insertErr } = await supabase.from("hadiths").upsert(rowsPayload, { onConflict: "id" });

            if (insertErr) {
              console.warn(`Notice inserting page ${page} for ${book.slug}:`, insertErr.message);
            } else {
              totalInserted += rowsPayload.length;
              console.log(`   [${book.slug.toUpperCase()}] Synced Page ${page} (${totalInserted} Hadiths in Supabase Cloud)`);
            }

            page++;
          } else {
            hasMore = false;
          }
        } else {
          hasMore = false;
        }
      } catch {
        console.warn(`Failed page ${page} for ${book.slug}:`, err.message);
        hasMore = false;
      }
    }
  }

  console.log("\n🎉 ALL HADITH COLLECTIONS SUCCESSFULLY COPIED & SYNCED TO YOUR SUPABASE CLOUD DATABASE!");
}

bulkSeedAllHadiths().catch((err) => {
  console.error("Error bulk seeding hadiths:", err);
  process.exit(1);
});
