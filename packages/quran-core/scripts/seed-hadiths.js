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

const HADITHS_CORE_SEED = [
  {
    book_slug: "bukhari",
    number: 1,
    text_id: "Telah menceritakan kepada kami Al Humaidi Abdullah bin Az Zubair, ia berkata: Telah menceritakan kepada kami Sufyan... Saya mendengar Rasulullah SAW bersabda: 'Bahwasanya amalan-amalan itu tergantung pada niatnya, dan bahwasanya masing-masing orang mendapatkan apa yang ia niatkan...'",
    text_ar: "إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى",
    grade: "SHAHIH",
  },
  {
    book_slug: "muslim",
    number: 1,
    text_id: "Dari Umar bin Khaththab r.a., ia berkata: 'Ketika kami sedang duduk di sisi Rasulullah SAW pada suatu hari, tiba-tiba muncul seorang laki-laki yang berpakaian sangat putih... Lalu ia bertanya tentang Islam, Iman, dan Ihsan...'",
    text_ar: "فَأَخْبِرْنِي عَنِ الإِيمَانِ قَالَ أَنْ تُؤْمِنَ بِاللَّهِ وَمَلاَئِكَتِهِ وَكُتُبِهِ وَرُسُلِهِ",
    grade: "SHAHIH",
  },
];

async function seedHadiths() {
  console.log("Seeding Master Hadith Books & Core Hadiths into Supabase Cloud...");

  // 1. Seed Books
  const { error: err1 } = await supabase.from("hadith_books").upsert(HADITH_BOOKS_SEED, { onConflict: "slug" });
  if (err1) {
    console.error("Error seeding hadith books:", err1.message);
  } else {
    console.log("✅ Master Hadith Books (9 Kitab / 38.527 Hadits) registered in Supabase Cloud!");
  }

  // 2. Seed Core Hadiths
  const { error: err2 } = await supabase.from("hadiths").upsert(HADITHS_CORE_SEED, { onConflict: "id" });
  if (err2) {
    console.warn("Notice seeding core hadiths:", err2.message);
  } else {
    console.log("✅ Core Hadiths synced to Supabase Cloud Database!");
  }
}

seedHadiths().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
