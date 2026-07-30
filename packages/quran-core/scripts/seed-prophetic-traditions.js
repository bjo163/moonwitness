import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL || "https://ixclyaugedwwptbqsozv.supabase.co";
const SUPABASE_SECRET_KEY = process.env.SUPABASE_SECRET_KEY || "sb_secret_qEdkK1vRFn3KDzxX5kkg4w_UnrZnKdT";

const supabase = createClient(SUPABASE_URL, SUPABASE_SECRET_KEY);

const PROPHETIC_TRADITIONS_SEED = [
  // 1. TAURAT ORAL TRADITION (MISHNA PIRKEI AVOT - ETIKA LISAN NABI MUSA A.S. & RABI KUNO)
  {
    scripture_id: "taurat",
    collection_name: "Mishna Pirkei Avot (Tradisi Lisan Taurat)",
    chapter_number: 1,
    item_number: 1,
    title: "Mata Rantai Sanad Penyerahan Wahyu Lisan",
    text_original: "מֹשֶׁה קִבֵּל תּוֹרָה מִסִּינַי, וּמְסָרָהּ לִיהוֹשֻׁעַ, וִיהוֹשֻׁעַ לִזְקֵנִים",
    text_transliteration: "Moshe kibel Torah miSinai, umesarah liYehoshua, viYehoshua lizkenim",
    translation_id: "Nabi Musa menerima wahyu Taurat di Gunung Sinai, lalu meneruskannya secara lisan kepada Yusha' (Yosua), dan Yusha' meneruskannya kepada para tetua pemimpin.",
    historical_notes: "Catatan Mishna 1:1 menegaskan pentingnya sanad penyerahan lisan tradisi hukum Taurat dari Nabi Musa a.s.",
  },
  {
    scripture_id: "taurat",
    collection_name: "Mishna Pirkei Avot (Tradisi Lisan Taurat)",
    chapter_number: 1,
    item_number: 2,
    title: "Tiga Pilar Tegaknya Dunia",
    text_original: "עַל שְׁלֹשָׁה דְבָרִים הָעוֹלָם עוֹמֵד, עַל הַתּוֹרָה וְעַל הָעֲבוֹדָה וְעַל גְּמִילוּת חֲסָדִים",
    text_transliteration: "Al shlosha devarim ha'olam omed, al haTorah ve'al haAvodah ve'al gemilut chasadim",
    translation_id: "Atas tiga hal dunia ini berdiri tegak: atas Firman Taurat (ilmu), atas ibadah penyembahan kepada Allah, dan atas perbuatan kasih sayang sesama.",
    historical_notes: "Mishna 1:2 — Tiga fondasi etika hidup dalam tradisi lisan Taurat.",
  },

  // 2. ZABUR ORAL TRADITION (TASBIH & ZIKIR LISAN NABI DAUD A.S.)
  {
    scripture_id: "zabur",
    collection_name: "Tasbih & Zikir Lisan Nabi Daud a.s.",
    chapter_number: 1,
    item_number: 1,
    title: "Tasbih Pengagungan Asma Allah",
    text_original: "הַלְלוּ אֶת־יְהוָה כָּל־גּוֹיִם שַׁבְּחוּהוּ כָּל־הָאֻמִּים",
    text_transliteration: "Halelu 'et-YHWH kol-goyim shabchuhu kol-ha'umim",
    translation_id: "Pujilah TUHAN, hai segala bangsa, megahkanlah Dia, hai segala suku bangsa!",
    historical_notes: "Tradisi lisan zikir Nabi Daud a.s. mengagungkan Allah SWT.",
  },

  // 3. INJIL ORAL TRADITION (DIDACHE - AJARAN 12 RASUL / HAWARIYYUN NABI ISA A.S.)
  {
    scripture_id: "injil",
    collection_name: "Didache (Ajaran 12 Rasul / Hawariyyun Isa a.s.)",
    chapter_number: 1,
    item_number: 1,
    title: "Dua Jalan Life and Death (Kebaikan & Keburukan)",
    text_original: "Δύο ὁδοί εἰσι, μία της ζωής καὶ μία τοῦ θανάτου",
    text_transliteration: "Dyo hodoi eisi, mia tes zoes kai mia tou thanatou",
    translation_id: "Ada dua jalan hidup manusia: satu Jalan Kehidupan (Kebajikan) dan satu Jalan Kematian (Keburukan); dan ada perbedaan sangat besar antara kedua jalan tersebut.",
    historical_notes: "Didache 1:1 — Catatan lisan abad pertama murid-murid Nabi Isa a.s. (Al-Hawariyyun) mengenai ajaran pokok kesucian moral.",
  },
  {
    scripture_id: "injil",
    collection_name: "Didache (Ajaran 12 Rasul / Hawariyyun Isa a.s.)",
    chapter_number: 1,
    item_number: 2,
    title: "Perintah Utama Mencintai Allah & Sesama",
    text_original: "Πρῶτον, ἀγαπήσεις τὸν Θεὸν τὸν ποιήσαντά σε· δεύτερον, τὸν πλησίον σου ὡς σεαυτόν",
    text_transliteration: "Proton, agapeseis ton Theon ton poiesanta se; deuteron, ton plesion sou hos seauton",
    translation_id: "Jalan Kehidupan ialah: Pertama, kasihilah Allah yang menciptakan engkau; Kedua, kasihilah sesamamu manusia seperti dirimu sendiri.",
    historical_notes: "Didache 1:2 — Ringkasan lisan sabda Nabi Isa a.s. dalam tradisi perawian apostolik.",
  },
];

async function seedPropheticTraditions() {
  console.log("Seeding Prophetic Traditions (Mishna, Tasbih Daud, Didache) into Supabase Cloud...");

  const { error } = await supabase.from("prophetic_traditions").upsert(PROPHETIC_TRADITIONS_SEED, { onConflict: "id" });

  if (error) {
    console.error("Error seeding prophetic traditions:", error.message);
  } else {
    console.log("🎉 Prophetic Traditions equivalent to Hadith for Taurat, Zabur, and Injil successfully uploaded to Supabase Cloud!");
  }
}

seedPropheticTraditions();
