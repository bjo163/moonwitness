import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL || "https://ixclyaugedwwptbqsozv.supabase.co";
const SUPABASE_SECRET_KEY = process.env.SUPABASE_SECRET_KEY || "sb_secret_qEdkK1vRFn3KDzxX5kkg4w_UnrZnKdT";

const supabase = createClient(SUPABASE_URL, SUPABASE_SECRET_KEY);

const MASTER_SCRIPTURES = [
  {
    id: "quran",
    title_id: "Al-Qur'anul Karim",
    title_ar: "القرآن الكريم",
    title_original: "القرآن الكريم",
    messenger_id: "Nabi Muhammad SAW",
    language_original: "Bahasa Arab Uthmani",
    status: "Original Preserved (Kitab Penutup Terpelihara)",
    total_sections: 114,
  },
  {
    id: "taurat",
    title_id: "Kitab Taurat (Torah)",
    title_ar: "التوراة",
    title_original: "תּוֹרָה (Torah)",
    messenger_id: "Nabi Musa a.s.",
    language_original: "Ibrani Kuno (Biblical Hebrew)",
    status: "Wahyu Kepada Nabi Musa a.s.",
    total_sections: 5,
  },
  {
    id: "zabur",
    title_id: "Kitab Zabur (Psalms)",
    title_ar: "الزبور",
    title_original: "מִזְמוֹר (Mizmor / Psalms)",
    messenger_id: "Nabi Daud a.s.",
    language_original: "Ibrani Kuno (Biblical Hebrew)",
    status: "Wahyu Kepada Nabi Daud a.s.",
    total_sections: 3,
  },
  {
    id: "injil",
    title_id: "Kitab Injil (Gospel)",
    title_ar: "الإنجيل",
    title_original: "אֶוַנְגֶלִיּוֹן (Aramaic / Peshitta)",
    messenger_id: "Nabi Isa a.s.",
    language_original: "Aram Kuno / Syriac Peshitta",
    status: "Wahyu Kepada Nabi Isa a.s.",
    total_sections: 4,
  },
];

const SECTIONS_DATA = [
  // Taurat Sections
  { scripture_id: "taurat", section_number: 1, title_latin: "Keesaan Tuhan (Shema Tauhid)", title_original: "שְׁמַע יִשְׂרָאֵל", translation_id: "Ulangan 6:4-5 (Pernyataan Tauhid Utama)", total_verses: 2 },
  { scripture_id: "taurat", section_number: 2, title_latin: "Sepuluh Perintah Allah (Ten Commandments)", title_original: "عَשَرَةُ الأَوَامِرِ", translation_id: "Keluaran 20:2-17 (Hukum Utama)", total_verses: 5 },

  // Zabur Sections
  { scripture_id: "zabur", section_number: 1, title_latin: "Kemuliaan Pencipta Alam", title_original: "מִזְמוֹר 19", translation_id: "Zabur 19:1-4 (Pujian Kebesaran Allah)", total_verses: 2 },
  { scripture_id: "zabur", section_number: 2, title_latin: "Perlindungan Sang Pencipta", title_original: "מִזְמוֹר 23", translation_id: "Zabur 23:1-3 (Doa Perlindungan)", total_verses: 2 },

  // Injil Sections
  { scripture_id: "injil", section_number: 1, title_latin: "Ajaran Tauhid Utama dalam Injil", title_original: "Markus 12:29", translation_id: "Markus 12:29 (Perintah Utama Tauhid)", total_verses: 2 },
  { scripture_id: "injil", section_number: 2, title_latin: "Pengakuan Kepada Allah Yang Maha Esa", title_original: "Yohanes 17:3", translation_id: "Yohanes 17:3 (Doa Pengakuan Tauhid)", total_verses: 1 },
];

const VERSES_DATA = [
  // Taurat Verses
  {
    scripture_id: "taurat",
    section_number: 1,
    verse_number: 1,
    text_original: "שְׁמַע יִשְׂרָאֵל יְהוָה אֱלֹהֵינוּ יְהוָה אֶחָד",
    text_transliteration: "Shema Yisra'el YHWH Eloheinu YHWH 'Echad",
    translation_id: "Dengarlah, wahai Israil: TUHAN itu Allah kita, TUHAN itu Esa!",
    notes: "Teks murni dari gulungan manuskrip kuno Taurat (Deuteronomy 6:4) menegaskan prinsip luhur Tauhid (Keesaan Tuhan) di kalangan para Nabi.",
  },
  {
    scripture_id: "taurat",
    section_number: 1,
    verse_number: 2,
    text_original: "וְאָהַבְתָּ אֵת יְהוָה אֱלֹהֶיךָ בְּכָל־לְבָבְךָ וּבְכָל־נַפְשְׁךָ וּבְכָל־מְאֹדֶךָ",
    text_transliteration: "Ve'ahavta 'et YHWH Eloheikha bekhol-levavkha uvekhol-nafshekha uvekhol-me'odekha",
    translation_id: "Kasihilah TUHAN, Allahmu, dengan segenap hatimu dan dengan segenap jiwamu dan dengan segenap kekuatanmu.",
    notes: "Perintah mencintai Sang Pencipta dengan ketulusan jiwa yang terdapat dalam Kitab Taurat.",
  },

  // Zabur Verses
  {
    scripture_id: "zabur",
    section_number: 1,
    verse_number: 1,
    text_original: "הַשָּׁמַיִם מְסַפְּרִים כְּבוֹד־אֵל וּמַעֲשֵׂה יָדָיו מַגִּיד הָרָקִיעַ",
    text_transliteration: "Hashamayim mesaperim kevod-El uma'aseh yadav magid haraqia",
    translation_id: "Langit menceritakan kemuliaan Allah, dan cakrawala memberitakan buatan tangan-Nya.",
    notes: "Teks nyanyian pujian Nabi Daud a.s. dalam Zabur (Psalms 19:1) mengagungkan keagungan ciptaan Sang Pencipta.",
  },

  // Injil Verses
  {
    scripture_id: "injil",
    section_number: 1,
    verse_number: 1,
    text_original: "שְׁמַע יִשְׂרָאֵל מָרְיָא אַלָהַן מָרְיָא חַד הוּא",
    text_transliteration: "Sh'ma Yisra'el Morya Alahan Morya Chad Hu",
    translation_id: "Jawab Isa (Al-Masih): 'Hukum yang terutama ialah: Dengarlah, wahai Israil, Tuhan Allah kita, Tuhan itu Esa!'",
    notes: "Kutipan sabda Nabi Isa a.s. dalam bahasa Aram Kuno (Aramaic/Peshitta - Mark 12:29) menegaskan kembali ajaran Tauhid murni.",
  },
  {
    scripture_id: "injil",
    section_number: 2,
    verse_number: 1,
    text_original: "הָדֵא אִנִּין גֵּיר חַיֵּא דַּלְעָלַם דְּנֶדְּעוּנָךְ דַּאַנְתְּ הוּא אַלָהָא דַּשְׁרָרָא בַּלְחוֹדָיָךְ",
    text_transliteration: "Hade Enen Ger Hayye Dal'alam Dened'unakh Da'ant Hu Alaha Dashrara Balhodayakh",
    translation_id: "Inilah hidup yang kekal itu, yaitu bahwa mereka mengenal Engkau, satu-satunya Allah yang benar, dan mengenal Al-Masih yang telah Engkau utus.",
    notes: "Pengakuan Tauhid murni dalam Injil (John 17:3) membedakan antara Sang Pencipta Yang Maha Esa dan hamba utusan-Nya.",
  },
];

async function seedScriptures() {
  console.log("Seeding Master Scriptures data into Supabase Cloud...");

  // 1. Seed Scriptures Master
  const { error: err1 } = await supabase.from("scriptures").upsert(MASTER_SCRIPTURES, { onConflict: "id" });
  if (err1) {
    console.error("Error seeding master scriptures:", err1.message);
  } else {
    console.log("✅ Master Scriptures seeded successfully!");
  }

  // 2. Seed Sections
  const { error: err2 } = await supabase.from("scripture_sections").upsert(SECTIONS_DATA, { onConflict: "id" });
  if (err2) {
    console.warn("Notice seeding sections:", err2.message);
  } else {
    console.log("✅ Scripture Sections seeded successfully!");
  }

  // 3. Seed Verses
  const { error: err3 } = await supabase.from("scripture_verses").upsert(VERSES_DATA, { onConflict: "id" });
  if (err3) {
    console.warn("Notice seeding verses:", err3.message);
  } else {
    console.log("✅ Scripture Verses seeded successfully!");
  }

  console.log("🎉 Universal Scriptures seeding completed!");
}

seedScriptures().catch((err) => {
  console.error("Error seeding scriptures:", err);
  process.exit(1);
});
