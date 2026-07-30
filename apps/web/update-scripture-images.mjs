import fs from 'fs'
import { createClient } from '@supabase/supabase-js'

const env = fs.readFileSync('.env.local', 'utf-8')
const url = env.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/)?.[1]
const key = env.match(/SUPABASE_SERVICE_ROLE_KEY=(.*)/)?.[1]

const sb = createClient(url, key)

const canonicalUpdates = [
  { name: "Al-Qur'an", cover_image_url: "/cover_quran.png" },
  { name: "Taurat", cover_image_url: "/cover_taurat.png" },
  { name: "Zabur", cover_image_url: "/cover_zabur.png" },
  { name: "Injil", cover_image_url: "/cover_injil.png" }
]

const additionalUpdates = [
  // Eastern/Dharmic
  { match: "Veda", url: "/cover_eastern.png" },
  { match: "Tripitaka", url: "/cover_eastern.png" },
  { match: "Guru Granth", url: "/cover_eastern.png" },
  { match: "Bhagavad Gita", url: "/cover_eastern.png" },
  { match: "Upanishad", url: "/cover_eastern.png" },
  { match: "Dhammapada", url: "/cover_eastern.png" },
  // Taoist/Confucian
  { match: "Dao De Jing", url: "/cover_tao.png" },
  { match: "Zhuangzi", url: "/cover_tao.png" },
  { match: "Analects", url: "/cover_tao.png" },
  { match: "Mencius", url: "/cover_tao.png" },
  // Apocrypha/Occult
  { match: "Book of Mormon", url: "/cover_apocrypha.png" },
  { match: "Enoch", url: "/cover_apocrypha.png" },
  { match: "Thomas", url: "/cover_apocrypha.png" },
  // Persian/Middle Eastern
  { match: "Avesta", url: "/cover_persian.png" },
  { match: "Zend-Avesta", url: "/cover_persian.png" },
  { match: "Ginza", url: "/cover_persian.png" },
  // Default fallback for any remaining
  { match: "", url: "/cover_eastern.png" } // matches everything as fallback if needed, but we'll use a blanket update
]

async function updateImages() {
  console.log("Updating canonical cover images...");
  for (const item of canonicalUpdates) {
    const { error } = await sb
      .from('divine_scriptures')
      .update({ cover_image_url: item.cover_image_url })
      .eq('name', item.name);
    
    if (error) console.error(`Error updating ${item.name}:`, error.message);
    else console.log(`Updated ${item.name} cover image.`);
  }

  console.log("Setting default cover for all additionals...");
  await sb.from('divine_scriptures').update({ cover_image_url: "/cover_eastern.png" }).eq('type', 'Additional').is('cover_image_url', null);

  console.log("Updating specific additional scripture images...");
  for (const item of additionalUpdates) {
    if (!item.match) continue;
    const { error } = await sb
      .from('divine_scriptures')
      .update({ cover_image_url: item.url })
      .ilike('name', `%${item.match}%`);
    
    if (error) console.error(`Error updating image for ${item.match}:`, error.message);
    else console.log(`Updated image for ${item.match}.`);
  }
  
  console.log("✅ All image URLs updated successfully!");
}

updateImages();
