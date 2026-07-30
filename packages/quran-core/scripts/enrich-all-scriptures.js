import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL || "https://ixclyaugedwwptbqsozv.supabase.co";
const SUPABASE_SECRET_KEY = process.env.SUPABASE_SECRET_KEY || "sb_secret_qEdkK1vRFn3KDzxX5kkg4w_UnrZnKdT";

const supabase = createClient(SUPABASE_URL, SUPABASE_SECRET_KEY);

const ADDITIONAL_VERSES = [
  // TAURAT (TORAH / OLD TESTAMENT SCRIPTURES)
  {
    scripture_id: "taurat",
    section_number: 1,
    verse_number: 3,
    text_original: "בְּרֵאשִׁית בָּרָא אֱלֹהִים אֵת הַשָּׁמַיִם וְאֵת הָאָרֶץ",
    text_transliteration: "Bereshit bara Elohim 'et hashamayim ve'et ha'aretz",
    translation_id: "Pada mulanya Allah menciptakan langit dan bumi.",
    notes: "Kejadian 1:1 — Ayat pertama dalam naskah Ibrani Taurat yang menegaskan Allah sebagai Pencipta tunggal alam semesta.",
  },
  {
    scripture_id: "taurat",
    section_number: 1,
    verse_number: 4,
    text_original: "וַיֹּאמֶר אֱלֹהִים יְהִי אוֹר וַיְהִי־אוֹר",
    text_transliteration: "Vayomer Elohim yehi 'or vayehi-'or",
    translation_id: "Berfirmanlah Allah: 'Jadilah terang.' Lalu terang itu jadi.",
    notes: "Kejadian 1:3 — Penciptaan melalui Firman Allah.",
  },
  {
    scripture_id: "taurat",
    section_number: 2,
    verse_number: 1,
    text_original: "אָנֹכִי יְהוָה אֱלֹהֶיךָ אֲשֶׁר הוֹצֵאתִיךָ מֵאֶרֶץ מִצְרַיִם מִבֵּית עֲבָדִים",
    text_transliteration: "Anochi YHWH Eloheikha asher hotzetikha me'eretz Mitzrayim mibeit avadim",
    translation_id: "Akulah TUHAN, Allahmu, yang membawa engkau keluar dari tanah Mesir, dari tempat perbudakan.",
    notes: "Keluaran 20:2 — Perintah Pertama dalam Sepuluh Hukum Taurat.",
  },
  {
    scripture_id: "taurat",
    section_number: 2,
    verse_number: 2,
    text_original: "לֹא יִהְיֶה־לְךָ אֱלֹהִים אֲחֵרִים עַל־פָּנָי",
    text_transliteration: "Lo yihyeh-lekha elohim acherim al-panay",
    translation_id: "Jangan ada padamu allah lain di hadapan-Ku.",
    notes: "Keluaran 20:3 — Perintah Tauhid murni melarang penyembahan tandingan selain Allah.",
  },
  {
    scripture_id: "taurat",
    section_number: 2,
    verse_number: 3,
    text_original: "לֹא תַעֲשֶׂה־לְךָ פֶסֶל וְכָל־תְּמוּנָה אֲשֶׁר בַּשָּׁמַיִם מִמַּעַל וַאֲשֶׁר בָּאָרֶץ מִתַָּחַת",
    text_transliteration: "Lo ta'aseh-lekha fesel vekhol-temunah asher bashamayim mima'al va'asher ba'aretz mitachat",
    translation_id: "Jangan membuat bagimu patung yang menyerupai apa pun yang ada di langit di atas, atau yang ada di bumi di bawah.",
    notes: "Keluaran 20:4 — Larangan pembuat patung sembahan.",
  },

  // ZABUR (PSALMS OF DAVID)
  {
    scripture_id: "zabur",
    section_number: 1,
    verse_number: 2,
    text_original: "יَوْם לְיוֹם יַבִּיעַ אֹמֶר וְלַיְלָה לְּלַיְלָה יְחַוֶּה־דָּעַת",
    text_transliteration: "Yom leyom yabi'a omer velaylah lelaylah yechaveh-da'at",
    translation_id: "Hari meneruskan berita itu kepada hari, dan malam menyampaikan pengetahuan itu kepada malam.",
    notes: "Zabur 19:2 — Tasbih dan tanda keagungan Pencipta di alam raya.",
  },
  {
    scripture_id: "zabur",
    section_number: 2,
    verse_number: 1,
    text_original: "יְהוָה רֹעִי לֹא אֶחְסָר",
    text_transliteration: "YHWH ro'i lo echsar",
    translation_id: "TUHAN adalah gembalaku, takkan kekurangan aku.",
    notes: "Zabur 23:1 — Nyanyian tawakal dan kepasrahan Nabi Daud a.s. kepada Allah.",
  },
  {
    scripture_id: "zabur",
    section_number: 2,
    verse_number: 2,
    text_original: "בִּנְאוֹת דֶּשֶׁא יַרְבִּיצֵנִי עַל־מֵי מְנֻחוֹת יְנַהֲלֵנִי",
    text_transliteration: "Bin'ot deshe yarbitzeni al-mei menuchot yenahaleni",
    translation_id: "Ia membaringkan aku di padang yang berumput hijau, Ia membimbing aku ke air yang tenang.",
    notes: "Zabur 23:2 — Ketenangan jiwa dalam naungan Sang Pencipta.",
  },

  // INJIL (GOSPEL OF JESUS / ISA A.S.)
  {
    scripture_id: "injil",
    section_number: 1,
    verse_number: 2,
    text_original: "וְתַרְחֵם לְמָרְיָא אַלָהָךְ מִן כֻּלֵּהּ לִבָּךְ וּמִן כֻּלָּהּ נַפְשָׁךְ",
    text_transliteration: "Vetarkhem leMorya Alahakh min kuleh libakh umin kulah nafsakh",
    translation_id: "Dan kasihilah Tuhan Allahmu dengan segenap hatimu dan dengan segenap jiwamu.",
    notes: "Markus 12:30 (Aram Kuno Peshitta) — Perintah utama kasih kepada Allah.",
  },
  {
    scripture_id: "injil",
    section_number: 2,
    verse_number: 2,
    text_original: "טוּבַיהוֹן לַמְסְכֵּנֵא בְּרוּחַ דִּלְהוֹן הִי מַלְכוּתָא דִּשְׁמַיָּא",
    text_transliteration: "Tubayhon lamsakene beruh dilhon hi malkuta dishmaya",
    translation_id: "Berbahagialah orang yang rendah hati di hadapan Allah, karena merekalah yang empunya Kerajaan Surga.",
    notes: "Matius 5:3 (Khotbah di Bukit / Aram Kuno) — Ajaran kesucian hati Nabi Isa a.s.",
  },
];

async function enrichAllScriptures() {
  console.log("Adding additional rich verses for Taurat, Zabur, and Injil into Supabase Cloud Database...");

  const { error } = await supabase.from("scripture_verses").upsert(ADDITIONAL_VERSES, { onConflict: "id" });

  if (error) {
    console.error("Error inserting verses:", error.message);
  } else {
    console.log("🎉 Additional authentic verses for Taurat, Zabur, and Injil successfully added to Supabase!");
  }
}

enrichAllScriptures();
