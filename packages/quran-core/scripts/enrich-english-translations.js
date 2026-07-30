import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from apps/web/.env.local
const envPath = path.join(__dirname, '../../../apps/web/.env.local');
if (fs.existsSync(envPath)) {
  const envConfig = fs.readFileSync(envPath, 'utf8');
  envConfig.split('\n').forEach((line) => {
    const [key, ...value] = line.split('=');
    if (key && value) {
      process.env[key.trim()] = value.join('=').trim();
    }
  });
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Supabase URL or Anon Key is missing!");
  process.exit(1);
}

async function enrichEnglishTranslations() {
  console.log("🚀 STARTING ENGLISH TRANSLATION ENRICHMENT PROCESS...");

  // 1. Enrich Ayahs English Translation (including 16:75, 2:255, 1:1, etc.)
  console.log("📦 Enriching ayahs translation_en...");
  const ayahsEnMap = [
    {
      surah_number: 16,
      ayah_number: 75,
      translation_en: "Allah presents an example: a slave [who is] owned, unable to do a thing, and one to whom We have provided from Us good provision, so he spends from it secretly and publicly. Are they equal? Praise be to Allah! But most of them do not know."
    },
    {
      surah_number: 2,
      ayah_number: 255,
      translation_en: "Allah - there is no deity except Him, the Ever-Living, the Sustainer of all existence. Neither drowsiness overtakes Him nor sleep. To Him belongs whatever is in the heavens and whatever is on the earth."
    },
    {
      surah_number: 1,
      ayah_number: 1,
      translation_en: "In the name of Allah, the Entirely Merciful, the Especially Merciful."
    }
  ];

  for (const item of ayahsEnMap) {
    try {
      await fetch(`${supabaseUrl}/rest/v1/ayahs?surah_number=eq.${item.surah_number}&ayah_number=eq.${item.ayah_number}`, {
        method: 'PATCH',
        headers: {
          'apikey': supabaseKey,
          'authorization': `Bearer ${supabaseKey}`,
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          translation_en: item.translation_en
        })
      });
      console.log(`  ✅ Updated ayah translation_en Q.S ${item.surah_number}:${item.ayah_number}`);
    } catch {
      console.warn(`  ⚠️ Failed to update ayah Q.S ${item.surah_number}:${item.ayah_number}:`, e.message);
    }
  }

  // 2. Enrich Scripture Verses English Translation
  console.log("📦 Enriching scripture_verses translation_en...");
  const scriptureEnMap = [
    {
      id: 1,
      translation_en: "Blessed are the poor in spirit and humble before God, for theirs is the kingdom of heaven.",
      notes_en: "Matthew 5:3 (Sermon on the Mount) — Teachings of Messiah Jesus (PBUH)"
    },
    {
      id: 2,
      translation_en: "Hear, O Israel: The LORD our God, the LORD is One.",
      notes_en: "Deuteronomy 6:4 (Shema Yisrael) — Torah of Moses (PBUH)"
    },
    {
      id: 3,
      translation_en: "The LORD is my shepherd; I shall not want. He makes me lie down in green pastures.",
      notes_en: "Psalm 23:1 (Tehillim) — Psalms of Prophet David (PBUH)"
    },
    {
      id: 4,
      translation_en: "Verily, with hardship comes ease. Indeed, with hardship comes ease.",
      notes_en: "Surah Ash-Sharh 94:5-6 — Holy Qur'an"
    },
    {
      id: 5,
      translation_en: "O mankind, indeed We have created you from male and female and made you peoples and tribes that you may know one another.",
      notes_en: "Surah Al-Hujurat 49:13 — Holy Qur'an"
    },
    {
      id: 15,
      translation_en: "Blessed are the poor in spirit and humble before God, for theirs is the kingdom of heaven.",
      notes_en: "Matthew 5:3 (Sermon on the Mount) — Teachings of Messiah Jesus (PBUH)"
    }
  ];

  for (const item of scriptureEnMap) {
    try {
      await fetch(`${supabaseUrl}/rest/v1/scripture_verses?id=eq.${item.id}`, {
        method: 'PATCH',
        headers: {
          'apikey': supabaseKey,
          'authorization': `Bearer ${supabaseKey}`,
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          translation_en: item.translation_en,
          notes_en: item.notes_en
        })
      });
      console.log(`  ✅ Updated scripture_verse id ${item.id}`);
    } catch {
      console.warn(`  ⚠️ Failed to update scripture_verse id ${item.id}:`, e.message);
    }
  }

  // 3. Enrich Hadiths text_en
  console.log("📦 Enriching hadiths text_en...");
  const hadithEnMap = [
    {
      id: 1,
      text_en: "Actions are judged according to intentions, and every person will get what was intended. Thus he whose migration was for Allah and His Messenger, his migration is for Allah and His Messenger; but he whose migration was for some worldly advantage or to marry a woman, his migration is for that for which he migrated. (Sahih Bukhari No. 1)"
    },
    {
      id: 28959,
      text_en: "Narrated by 'Ubaidullah bin Abdul Majid from Malik, from Ibn Shihab, from Abdurrahman bin Hurmuz Al-A'raj, from Ibn Buhainah who said: 'The Messenger of Allah (peace and blessings be upon him) led us in two rak'ahs of prayer, then stood up for the third rak'ah without sitting for the first tashahhud, and the people stood up with him. When he finished the prayer and we awaited his final salutation (taslim), he pronounced Takbir while sitting and performed two prostrations of forgetfulness (Sujud as-Sahw) before delivering the final salutation, then he concluded with the salutation.' (Sunan Ad-Darimi No. 1108)"
    }
  ];

  for (const item of hadithEnMap) {
    try {
      await fetch(`${supabaseUrl}/rest/v1/hadiths?id=eq.${item.id}`, {
        method: 'PATCH',
        headers: {
          'apikey': supabaseKey,
          'authorization': `Bearer ${supabaseKey}`,
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          text_en: item.text_en
        })
      });
      console.log(`  ✅ Updated hadith id ${item.id}`);
    } catch {
      console.warn(`  ⚠️ Failed to update hadith id ${item.id}:`, e.message);
    }
  }

  console.log("🎉 ENGLISH TRANSLATION ENRICHMENT COMPLETED SUCCESSFULLY!");
}

enrichEnglishTranslations().catch(console.error);
