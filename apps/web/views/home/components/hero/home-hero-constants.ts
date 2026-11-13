export type DailyTransmissionData = {
  ayah?: {
    surahNumber: number | string
    surahName: string
    ayahNumber: number | string
    textArabic: string
    translationId: string
  }
}

export type ExtraDivineData = {
  bookQuote: { book: string; text: string }
  hadith: string
  asmaulLeft: string
  asmaulRight: string
}

export const HERO_BACKGROUNDS = [
  "/blueprint/BG-HERO-01.png",
  "/blueprint/BG-HERO-02.png",
  "/blueprint/BG-HERO-03.png",
  "/blueprint/BG-HERO-04.png",
  "/blueprint/BG-HERO-05.png",
  "/blueprint/BG-HERO-06.png",
  "/blueprint/BG-HERO-07.png",
  "/blueprint/BG-HERO-08.png",
]

export const HISTORY_EVENTS = [
  "THE CREATION",
  "THE GREAT FLOOD",
  "PARTING OF THE SEA",
  "THE REVELATION",
  "THE NIGHT JOURNEY",
  "HOUSE OF WISDOM",
  "GOLDEN AGE OF ISLAM",
  "THE RENAISSANCE",
  "PRINTING PRESS",
  "ABOLITION OF SLAVERY",
  "MOON LANDING",
  "INFORMATION AGE",
  "THE SINGULARITY",
  "QUANTUM AWAKENING",
  "FIRST CONTACT",
  "THE ENLIGHTENMENT",
]

export const TRAITS = [
  "PATIENCE",
  "SINCERITY",
  "GRATITUDE",
  "TRUST",
  "CERTAINTY",
  "EXCELLENCE",
  "PIETY",
  "CONTENTMENT",
  "PEACE",
  "LOVE",
  "JUSTICE",
  "MERCY",
  "WISDOM",
  "TRUTH",
  "COMPASSION",
  "HUMILITY",
  "COURAGE",
  "INTEGRITY",
]

export const AYAH_WORDS = [
  "BISMILLAH",
  "ALHAMDULILLAH",
  "SUBHANALLAH",
  "ALLAHU AKBAR",
  "LA ILAHA ILLALLAH",
  "MASYA ALLAH",
  "TABARAKALLAH",
  "ASTAGHFIRULLAH",
  "HASBUNALLAH",
  "INNA LILLAH",
  "FI AMANILLAH",
  "BARAKALLAH",
]

export const PROPHETS = [
  "مُحَمَّد",
  "إِبْرَاهِيم",
  "مُوسَى",
  "عِيسَى",
  "نُوح",
  "آدَم",
  "يُوسُف",
  "دَاوُد",
  "سُلَيْمَان",
  "يُونُس",
  "يَحْيَى",
  "زَكَرِيَّا",
  "إِسْمَاعِيل",
  "إِسْحَاق",
  "يَعْقُوب",
  "أَيُّوب",
  "إِدْرِيس",
  "هُود",
  "صَالِح",
  "شُعَيْب",
]

export const NAMES_OF_ALLAH = [
  "اللَّهُ",
  "الرَّحْمَن",
  "الرَّحِيم",
  "الْمَلِك",
  "الْقُدُّوس",
  "الْعَزِيز",
  "الْجَبَّار",
  "الْخَالِق",
  "الْقَهَّار",
  "النُّور",
  "الْحَقّ",
  "الْوَهَّاب",
  "الرَّزَّاق",
  "الْفَتَّاح",
  "الْعَلِيم",
  "الْقَابِض",
  "الْبَاسِط",
  "الْخَافِض",
  "الرَّافِع",
  "الْمُعِزّ",
  "الْمُذِلّ",
  "السَّمِيع",
  "الْبَصِير",
  "الْحَكَم",
  "الْعَدْل",
  "اللَّطِيف",
  "الْخَبِير",
]

export const DIVINE_BOOKS_QUOTES = [
  { book: "TAURAT (TORAH)", text: "Love your neighbor as yourself." },
  {
    book: "TAURAT (TORAH)",
    text: "Justice, and only justice, you shall pursue.",
  },
  { book: "ZABUR (PSALMS)", text: "The Lord is my shepherd, I lack nothing." },
  {
    book: "ZABUR (PSALMS)",
    text: "Your word is a lamp for my feet, a light on my path.",
  },
  {
    book: "INJIL (GOSPEL)",
    text: "Blessed are the peacemakers, for they will be called children of God.",
  },
  {
    book: "INJIL (GOSPEL)",
    text: "Ask and it will be given to you; seek and you will find.",
  },
]

export const HADITH_SNIPPETS = [
  '"The best among you are those who have the best manners and character." (Sahih Bukhari)',
  '"God does not look at your forms and possessions but he looks at your hearts and your deeds." (Sahih Muslim)',
  '"A good word is a charity." (Sahih Bukhari)',
  '"He who is not merciful to others, will not be treated mercifully." (Sahih Bukhari)',
  '"The strong is not the one who overcomes the people by his strength, but the strong is the one who controls himself while in anger." (Sahih Bukhari)',
]
