import fs from 'fs'
import { createClient } from '@supabase/supabase-js'

const env = fs.readFileSync('.env.local', 'utf-8')
const url = env.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/)?.[1]
const key = env.match(/SUPABASE_SERVICE_ROLE_KEY=(.*)/)?.[1]

const sb = createClient(url, key)

const scriptures = [
  // 1. ISLAMIC / ABRAHAMIC CANONICAL
  { name: "Al-Qur'an", original_name: "Kahf", religion: "Islam", type: "Canonical", books_count: 114, chapters_count: 114, verses_count: 6236, authenticity_status: "100% Authentic", revelation_era: "610-632 CE", prophet: "Muhammad ﷺ", description: "Final & Preserved", theme_color: "emerald" },
  { name: "Taurat", original_name: "Torah", religion: "Judaism", type: "Canonical", books_count: 5, chapters_count: 187, verses_count: 5856, authenticity_status: "Preserved (Partial)", revelation_era: "~1445 BCE", prophet: "Moses (a.s)", description: "Old Testament", theme_color: "amber" },
  { name: "Zabur", original_name: "Psalms", religion: "Judaism | Christianity", type: "Canonical", books_count: 1, chapters_count: 150, verses_count: 2461, authenticity_status: "Preserved (Partial)", revelation_era: "~1000 BCE", prophet: "David (a.s)", description: "Book of Psalms", theme_color: "blue" },
  { name: "Injil", original_name: "Gospel", religion: "Christianity", type: "Canonical", books_count: 4, chapters_count: 260, verses_count: 7957, authenticity_status: "Preserved (Partial)", revelation_era: "~30 CE", prophet: "Jesus (a.s)", description: "New Testament", theme_color: "purple" },

  // 2. DHARMIC (HINDUISM, BUDDHISM, JAINISM, SIKHISM)
  { name: "Rigveda", original_name: "Rigveda", religion: "Hinduism", type: "Additional", books_count: 10, chapters_count: 1028, verses_count: 10600, authenticity_status: "Ancient", revelation_era: "~1500 BCE", prophet: "Rishis", description: "Oldest Veda", theme_color: "orange" },
  { name: "Yajurveda", original_name: "Yajurveda", religion: "Hinduism", type: "Additional", books_count: 40, chapters_count: 0, verses_count: 0, authenticity_status: "Ancient", revelation_era: "~1200 BCE", prophet: "Rishis", description: "Mantras for rituals", theme_color: "orange" },
  { name: "Samaveda", original_name: "Samaveda", religion: "Hinduism", type: "Additional", books_count: 2, chapters_count: 0, verses_count: 1549, authenticity_status: "Ancient", revelation_era: "~1200 BCE", prophet: "Rishis", description: "Melodies and chants", theme_color: "orange" },
  { name: "Atharvaveda", original_name: "Atharvaveda", religion: "Hinduism", type: "Additional", books_count: 20, chapters_count: 730, verses_count: 6000, authenticity_status: "Ancient", revelation_era: "~1000 BCE", prophet: "Rishis", description: "Magical formulas", theme_color: "orange" },
  { name: "Upanishads", original_name: "Vedanta", religion: "Hinduism", type: "Additional", books_count: 108, chapters_count: 0, verses_count: 0, authenticity_status: "Ancient", revelation_era: "~800 BCE", prophet: "Various Sages", description: "Philosophical Concepts", theme_color: "orange" },
  { name: "Bhagavad Gita", original_name: "Gita", religion: "Hinduism", type: "Additional", books_count: 1, chapters_count: 18, verses_count: 700, authenticity_status: "Ancient", revelation_era: "~400 BCE", prophet: "Krishna / Vyasa", description: "The Song of God", theme_color: "orange" },
  { name: "Mahabharata", original_name: "Mahābhārata", religion: "Hinduism", type: "Additional", books_count: 18, chapters_count: 0, verses_count: 100000, authenticity_status: "Epic", revelation_era: "~400 BCE", prophet: "Vyasa", description: "Longest Epic Poem", theme_color: "orange" },
  { name: "Ramayana", original_name: "Rāmāyaṇa", religion: "Hinduism", type: "Additional", books_count: 7, chapters_count: 500, verses_count: 24000, authenticity_status: "Epic", revelation_era: "~500 BCE", prophet: "Valmiki", description: "Journey of Rama", theme_color: "orange" },
  { name: "Puranas", original_name: "Purāṇa", religion: "Hinduism", type: "Additional", books_count: 18, chapters_count: 0, verses_count: 400000, authenticity_status: "Mythological", revelation_era: "~300 CE", prophet: "Vyasa", description: "Histories of the Gods", theme_color: "orange" },
  { name: "Tripitaka", original_name: "Pali Canon", religion: "Buddhism", type: "Additional", books_count: 3, chapters_count: 0, verses_count: 0, authenticity_status: "Ancient", revelation_era: "~500 BCE", prophet: "Buddha", description: "The Three Baskets", theme_color: "yellow" },
  { name: "Dhammapada", original_name: "Dhammapada", religion: "Buddhism", type: "Additional", books_count: 1, chapters_count: 26, verses_count: 423, authenticity_status: "Ancient", revelation_era: "~300 BCE", prophet: "Buddha", description: "Path of Truth", theme_color: "yellow" },
  { name: "Lotus Sutra", original_name: "Saddharma Puṇḍarīka", religion: "Mahayana Buddhism", type: "Additional", books_count: 1, chapters_count: 28, verses_count: 0, authenticity_status: "Ancient", revelation_era: "~100 CE", prophet: "Unknown", description: "Ultimate Teaching", theme_color: "yellow" },
  { name: "Heart Sutra", original_name: "Prajñāpāramitā", religion: "Mahayana Buddhism", type: "Additional", books_count: 1, chapters_count: 1, verses_count: 14, authenticity_status: "Ancient", revelation_era: "~600 CE", prophet: "Avalokiteśvara", description: "Perfection of Wisdom", theme_color: "yellow" },
  { name: "Tibetan Book of the Dead", original_name: "Bardo Thodol", religion: "Tibetan Buddhism", type: "Additional", books_count: 1, chapters_count: 0, verses_count: 0, authenticity_status: "Ancient", revelation_era: "8th Century", prophet: "Padmasambhava", description: "Liberation through Hearing", theme_color: "yellow" },
  { name: "Jain Agamas", original_name: "Jain Agamas", religion: "Jainism", type: "Additional", books_count: 45, chapters_count: 0, verses_count: 0, authenticity_status: "Ancient", revelation_era: "~500 BCE", prophet: "Mahavira", description: "Jain Canonical Texts", theme_color: "emerald" },
  { name: "Kalpa Sutra", original_name: "Kalpa Sutra", religion: "Jainism", type: "Additional", books_count: 1, chapters_count: 0, verses_count: 0, authenticity_status: "Ancient", revelation_era: "~300 BCE", prophet: "Bhadrabahu", description: "Biographies of Tirthankaras", theme_color: "emerald" },
  { name: "Guru Granth", original_name: "Adi Granth", religion: "Sikhism", type: "Additional", books_count: 1, chapters_count: 31, verses_count: 5894, authenticity_status: "Preserved", revelation_era: "1469 CE", prophet: "Guru Nanak", description: "The Eternal Guru", theme_color: "amber" },
  { name: "Dasam Granth", original_name: "Dasam Granth", religion: "Sikhism", type: "Additional", books_count: 1, chapters_count: 0, verses_count: 1428, authenticity_status: "Historical", revelation_era: "1734 CE", prophet: "Guru Gobind Singh", description: "Second Scripture of Sikhs", theme_color: "amber" },

  // 3. TAOISM, CONFUCIANISM, SHINTO
  { name: "Dao De Jing", original_name: "Tao Te Ching", religion: "Taoism", type: "Additional", books_count: 1, chapters_count: 81, verses_count: 0, authenticity_status: "Ancient", revelation_era: "~400 BCE", prophet: "Laozi", description: "The Way and Its Power", theme_color: "slate" },
  { name: "Zhuangzi", original_name: "Zhuangzi", religion: "Taoism", type: "Additional", books_count: 33, chapters_count: 0, verses_count: 0, authenticity_status: "Ancient", revelation_era: "~300 BCE", prophet: "Zhuang Zhou", description: "Foundational Taoist Text", theme_color: "slate" },
  { name: "I Ching", original_name: "Book of Changes", religion: "Taoism/Confucianism", type: "Additional", books_count: 1, chapters_count: 64, verses_count: 0, authenticity_status: "Ancient", revelation_era: "~1000 BCE", prophet: "King Wen / Fu Xi", description: "Divination Text", theme_color: "slate" },
  { name: "Analects", original_name: "Lunyu", religion: "Confucianism", type: "Additional", books_count: 20, chapters_count: 0, verses_count: 0, authenticity_status: "Ancient", revelation_era: "~475 BCE", prophet: "Confucius", description: "Sayings of Confucius", theme_color: "rose" },
  { name: "Mencius", original_name: "Mengzi", religion: "Confucianism", type: "Additional", books_count: 7, chapters_count: 0, verses_count: 0, authenticity_status: "Ancient", revelation_era: "~300 BCE", prophet: "Mencius", description: "Confucian philosophy", theme_color: "rose" },
  { name: "Kojiki", original_name: "Kojiki", religion: "Shinto", type: "Additional", books_count: 3, chapters_count: 0, verses_count: 0, authenticity_status: "Historical", revelation_era: "712 CE", prophet: "O No Yasumaro", description: "Records of Ancient Matters", theme_color: "red" },
  { name: "Nihon Shoki", original_name: "Nihongi", religion: "Shinto", type: "Additional", books_count: 30, chapters_count: 0, verses_count: 0, authenticity_status: "Historical", revelation_era: "720 CE", prophet: "Prince Toneri", description: "Chronicles of Japan", theme_color: "red" },

  // 4. ANCIENT, MYTHOLOGICAL, AFRICAN, MESOAMERICAN
  { name: "Book of the Dead", original_name: "Pert Em Hru", religion: "Ancient Egyptian", type: "Additional", books_count: 1, chapters_count: 192, verses_count: 0, authenticity_status: "Archaeological", revelation_era: "~1550 BCE", prophet: "Egyptian Priests", description: "Spells for the Afterlife", theme_color: "yellow" },
  { name: "Pyramid Texts", original_name: "Pyramid Texts", religion: "Ancient Egyptian", type: "Additional", books_count: 1, chapters_count: 759, verses_count: 0, authenticity_status: "Archaeological", revelation_era: "~2400 BCE", prophet: "Unknown", description: "Oldest religious texts", theme_color: "yellow" },
  { name: "Enuma Elish", original_name: "Enuma Elish", religion: "Babylonian", type: "Additional", books_count: 7, chapters_count: 7, verses_count: 1000, authenticity_status: "Archaeological", revelation_era: "~1800 BCE", prophet: "Unknown", description: "Babylonian Creation Myth", theme_color: "stone" },
  { name: "Epic of Gilgamesh", original_name: "Gilgamesh", religion: "Mesopotamian", type: "Additional", books_count: 12, chapters_count: 0, verses_count: 0, authenticity_status: "Archaeological", revelation_era: "~2100 BCE", prophet: "Unknown", description: "Ancient Heroic Epic", theme_color: "stone" },
  { name: "Code of Hammurabi", original_name: "Hammurabi", religion: "Mesopotamian", type: "Additional", books_count: 1, chapters_count: 282, verses_count: 0, authenticity_status: "Archaeological", revelation_era: "~1750 BCE", prophet: "King Hammurabi", description: "Ancient Law Code", theme_color: "stone" },
  { name: "Popol Vuh", original_name: "Popol Vuh", religion: "Mayan", type: "Additional", books_count: 1, chapters_count: 4, verses_count: 0, authenticity_status: "Historical", revelation_era: "~1550 CE", prophet: "Mayan Elders", description: "Book of the Community", theme_color: "green" },
  { name: "Chilam Balam", original_name: "Chilam Balam", religion: "Mayan", type: "Additional", books_count: 9, chapters_count: 0, verses_count: 0, authenticity_status: "Historical", revelation_era: "17th Century", prophet: "Jaguar Priests", description: "Mayan Chronicles", theme_color: "green" },
  { name: "Odu Ifa", original_name: "Odu Ifa", religion: "Yoruba", type: "Additional", books_count: 256, chapters_count: 0, verses_count: 0, authenticity_status: "Oral Tradition", revelation_era: "Ancient", prophet: "Orunmila", description: "Yoruba divination corpus", theme_color: "rose" },
  { name: "Poetic Edda", original_name: "Elder Edda", religion: "Norse Paganism", type: "Additional", books_count: 31, chapters_count: 0, verses_count: 0, authenticity_status: "Mythological", revelation_era: "13th Century", prophet: "Unknown", description: "Old Norse Poems", theme_color: "blue" },
  { name: "Prose Edda", original_name: "Snorra Edda", religion: "Norse Paganism", type: "Additional", books_count: 4, chapters_count: 0, verses_count: 0, authenticity_status: "Mythological", revelation_era: "1220 CE", prophet: "Snorri Sturluson", description: "Norse Mythology Textbook", theme_color: "blue" },

  // 5. APOCRYPHA, GNOSTIC, AND MIDDLE EASTERN MINOR RELIGIONS
  { name: "Book of Enoch", original_name: "1 Enoch", religion: "Apocrypha", type: "Additional", books_count: 5, chapters_count: 108, verses_count: 0, authenticity_status: "Apocryphal", revelation_era: "~300 BCE", prophet: "Enoch (Idris)", description: "Visions of Angels & Demons", theme_color: "purple" },
  { name: "Book of Jubilees", original_name: "Jubilees", religion: "Apocrypha", type: "Additional", books_count: 1, chapters_count: 50, verses_count: 0, authenticity_status: "Apocryphal", revelation_era: "~150 BCE", prophet: "Unknown", description: "Lesser Genesis", theme_color: "purple" },
  { name: "Gospel of Thomas", original_name: "Thomas", religion: "Gnosticism", type: "Additional", books_count: 1, chapters_count: 0, verses_count: 114, authenticity_status: "Apocryphal", revelation_era: "~2nd Century", prophet: "Didymos Judas Thomas", description: "Secret Sayings of Jesus", theme_color: "purple" },
  { name: "Nag Hammadi Library", original_name: "Nag Hammadi", religion: "Gnosticism", type: "Additional", books_count: 52, chapters_count: 0, verses_count: 0, authenticity_status: "Archaeological", revelation_era: "~4th Century", prophet: "Gnostic Writers", description: "Secret Gnostic Gospels", theme_color: "purple" },
  { name: "Pistis Sophia", original_name: "Pistis Sophia", religion: "Gnosticism", type: "Additional", books_count: 4, chapters_count: 148, verses_count: 0, authenticity_status: "Apocryphal", revelation_era: "3rd Century", prophet: "Unknown", description: "Gnostic teachings of Jesus", theme_color: "purple" },
  { name: "Ginza Rabba", original_name: "Ginza Rabba", religion: "Mandaeism", type: "Additional", books_count: 2, chapters_count: 24, verses_count: 0, authenticity_status: "Ancient", revelation_era: "~2nd Century", prophet: "John the Baptist / Adam", description: "The Great Treasure", theme_color: "teal" },
  { name: "Arzhang", original_name: "Book of Pictures", religion: "Manichaeism", type: "Additional", books_count: 1, chapters_count: 0, verses_count: 0, authenticity_status: "Lost", revelation_era: "3rd Century", prophet: "Mani", description: "Illustrated Holy Book", theme_color: "teal" },
  { name: "Mishefa Resh", original_name: "Mishefa Resh", religion: "Yazidism", type: "Additional", books_count: 1, chapters_count: 0, verses_count: 0, authenticity_status: "Traditional", revelation_era: "Unknown", prophet: "Sheikh Adi", description: "The Black Book", theme_color: "slate" },
  { name: "Kitêba Cilwe", original_name: "Kitêba Cilwe", religion: "Yazidism", type: "Additional", books_count: 1, chapters_count: 5, verses_count: 0, authenticity_status: "Traditional", revelation_era: "Unknown", prophet: "Tawûsê Melek", description: "Book of Revelation", theme_color: "slate" },

  // 6. MODERN RELIGIONS / OTHERS
  { name: "Book of Mormon", original_name: "Mormon", religion: "Latter Day Saints", type: "Additional", books_count: 15, chapters_count: 239, verses_count: 6604, authenticity_status: "Modern", revelation_era: "1830 CE", prophet: "Joseph Smith", description: "Another Testament", theme_color: "blue" },
  { name: "Zend-Avesta", original_name: "Avesta", religion: "Zoroastrianism", type: "Additional", books_count: 5, chapters_count: 0, verses_count: 0, authenticity_status: "Ancient", revelation_era: "~1200 BCE", prophet: "Zoroaster", description: "Hymns and Laws", theme_color: "orange" },
  { name: "Kitab-i-Aqdas", original_name: "Aqdas", religion: "Baha'i", type: "Additional", books_count: 1, chapters_count: 1, verses_count: 190, authenticity_status: "Modern", revelation_era: "1873 CE", prophet: "Baha'u'llah", description: "The Most Holy Book", theme_color: "teal" },
  { name: "Kitab-i-Iqan", original_name: "Iqan", religion: "Baha'i", type: "Additional", books_count: 1, chapters_count: 2, verses_count: 0, authenticity_status: "Modern", revelation_era: "1861 CE", prophet: "Baha'u'llah", description: "The Book of Certitude", theme_color: "teal" },
  { name: "Dianetics", original_name: "Dianetics", religion: "Scientology", type: "Additional", books_count: 1, chapters_count: 0, verses_count: 0, authenticity_status: "Modern", revelation_era: "1950 CE", prophet: "L. Ron Hubbard", description: "The Modern Science of Mental Health", theme_color: "blue" },

  // 7. OCCULT / ESOTERIC / MAGIC / SATANIC (Comprehensive List)
  { name: "The Satanic Bible", original_name: "Satanic Bible", religion: "LaVeyan Satanism", type: "Occult", books_count: 4, chapters_count: 0, verses_count: 0, authenticity_status: "Modern Philosophy", revelation_era: "1969 CE", prophet: "Anton LaVey", description: "Essays & Satanic Rituals", theme_color: "red" },
  { name: "The Satanic Rituals", original_name: "Rituals", religion: "LaVeyan Satanism", type: "Occult", books_count: 1, chapters_count: 9, verses_count: 0, authenticity_status: "Modern", revelation_era: "1972 CE", prophet: "Anton LaVey", description: "Companion to Satanic Bible", theme_color: "red" },
  { name: "Lesser Key of Solomon", original_name: "Lemegeton", religion: "Demonology / Occult", type: "Occult", books_count: 5, chapters_count: 0, verses_count: 72, authenticity_status: "Grimoire", revelation_era: "~17th Century", prophet: "Anonymous (Attr. Solomon)", description: "Ars Goetia & Demonology", theme_color: "red" },
  { name: "Key of Solomon", original_name: "Clavicula Salomonis", religion: "Demonology / Occult", type: "Occult", books_count: 2, chapters_count: 0, verses_count: 0, authenticity_status: "Grimoire", revelation_era: "~14th Century", prophet: "Anonymous (Attr. Solomon)", description: "Renaissance Magic", theme_color: "red" },
  { name: "The Book of the Law", original_name: "Liber AL vel Legis", religion: "Thelema", type: "Occult", books_count: 1, chapters_count: 3, verses_count: 220, authenticity_status: "Modern Esoteric", revelation_era: "1904 CE", prophet: "Aleister Crowley", description: "Do what thou wilt...", theme_color: "red" },
  { name: "Liber 777", original_name: "777", religion: "Thelema", type: "Occult", books_count: 1, chapters_count: 0, verses_count: 0, authenticity_status: "Modern Esoteric", revelation_era: "1909 CE", prophet: "Aleister Crowley", description: "Qabalistic Dictionary", theme_color: "red" },
  { name: "Book of Thoth", original_name: "Thoth", religion: "Thelema", type: "Occult", books_count: 1, chapters_count: 0, verses_count: 0, authenticity_status: "Modern Esoteric", revelation_era: "1944 CE", prophet: "Aleister Crowley", description: "Tarot Philosophy", theme_color: "red" },
  { name: "Necronomicon", original_name: "Al Azif", religion: "Lovecraftian", type: "Occult", books_count: 1, chapters_count: 0, verses_count: 0, authenticity_status: "Fictional Grimoire", revelation_era: "1924 CE", prophet: "Abdul Alhazred", description: "Book of the Dead Names", theme_color: "green" },
  { name: "Corpus Hermeticum", original_name: "Hermetica", religion: "Hermeticism", type: "Occult", books_count: 18, chapters_count: 0, verses_count: 0, authenticity_status: "Ancient Esoteric", revelation_era: "~2nd Century", prophet: "Hermes Trismegistus", description: "Wisdom of Hermes", theme_color: "purple" },
  { name: "The Kybalion", original_name: "Kybalion", religion: "Hermeticism", type: "Occult", books_count: 1, chapters_count: 15, verses_count: 0, authenticity_status: "Modern Esoteric", revelation_era: "1908 CE", prophet: "Three Initiates", description: "Hermetic Philosophy", theme_color: "purple" },
  { name: "Book of Abramelin", original_name: "Abramelin", religion: "Kabbalah / Magic", type: "Occult", books_count: 3, chapters_count: 0, verses_count: 0, authenticity_status: "Grimoire", revelation_era: "~14th Century", prophet: "Abraham of Worms", description: "Holy Guardian Angel Magic", theme_color: "purple" },
  { name: "Liber Null & Psychonaut", original_name: "Liber Null", religion: "Chaos Magic", type: "Occult", books_count: 2, chapters_count: 0, verses_count: 0, authenticity_status: "Modern Magic", revelation_era: "1978 CE", prophet: "Peter J. Carroll", description: "Manual of Chaos Magic", theme_color: "stone" },
  { name: "Aradia", original_name: "Gospel of the Witches", religion: "Wicca / Paganism", type: "Occult", books_count: 1, chapters_count: 15, verses_count: 0, authenticity_status: "Folk Magic", revelation_era: "1899 CE", prophet: "Charles G. Leland", description: "Witches' Gospel", theme_color: "stone" },
  { name: "Malleus Maleficarum", original_name: "Hammer of Witches", religion: "Christian Demonology", type: "Occult", books_count: 3, chapters_count: 0, verses_count: 0, authenticity_status: "Historical Treatise", revelation_era: "1486 CE", prophet: "Heinrich Kramer", description: "Treatise on Witchcraft", theme_color: "slate" },
  { name: "Pseudomonarchia Daemonum", original_name: "Hierarchy of Demons", religion: "Demonology", type: "Occult", books_count: 1, chapters_count: 0, verses_count: 69, authenticity_status: "Grimoire", revelation_era: "1577 CE", prophet: "Johann Weyer", description: "Catalog of 69 Demons", theme_color: "red" },
  { name: "Book of Coming Forth by Night", original_name: "Temple of Set", religion: "Setianism", type: "Occult", books_count: 1, chapters_count: 0, verses_count: 0, authenticity_status: "Modern", revelation_era: "1975 CE", prophet: "Michael Aquino", description: "Founding Document", theme_color: "red" },
  { name: "The Black Book of Satan", original_name: "ONA", religion: "Order of Nine Angles", type: "Occult", books_count: 1, chapters_count: 0, verses_count: 0, authenticity_status: "Modern", revelation_era: "1984 CE", prophet: "Anton Long", description: "Satanic Rites", theme_color: "red" }
];

async function seed() {
  console.log("Emptying old divine scriptures...");
  await sb.from('divine_scriptures').delete().neq('id', 0);
  
  console.log(`Inserting colossal compendium of ${scriptures.length} world scriptures...`);
  
  // Batch insert
  const chunkSize = 15;
  let inserted = 0;
  for (let i = 0; i < scriptures.length; i += chunkSize) {
    const chunk = scriptures.slice(i, i + chunkSize);
    const { error } = await sb.from('divine_scriptures').insert(chunk);
    if (error) {
      console.error("Error inserting data:", error);
    } else {
      inserted += chunk.length;
    }
  }
  
  console.log(`✅ Successfully seeded ${inserted} texts globally!`);
}

seed();
