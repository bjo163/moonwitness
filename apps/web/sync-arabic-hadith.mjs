import fs from 'fs'
import { createClient } from '@supabase/supabase-js'

const env = fs.readFileSync('.env.local', 'utf-8')
const url = env.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/)?.[1]
const key = env.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.*)/)?.[1]

const sb = createClient(url, key)

const bookMapping = {
  'bukhari': 'ara-bukhari1',
  'muslim': 'ara-muslim1',
  'abudawud': 'ara-abudawud1',
  'tirmidzi': 'ara-tirmidhi1',
  'nasai': 'ara-nasai1',
  'ibnmajah': 'ara-ibnmajah1',
}

async function syncArabic() {
  console.log("Starting Hadith Arabic Sync via Fawaz Ahmed API...");
  
  for (const [dbSlug, apiSlug] of Object.entries(bookMapping)) {
    console.log(`\n--- Processing Book: ${dbSlug} ---`);
    try {
      const res = await fetch(`https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/${apiSlug}.json`);
      if (!res.ok) {
        console.log(`Failed to fetch ${apiSlug} - HTTP ${res.status}`);
        continue;
      }
      
      const data = await res.json();
      const hadiths = data.hadiths;
      console.log(`Fetched ${hadiths.length} hadiths for ${apiSlug} from API.`);
      
      const targetHadiths = hadiths; 
      console.log(`Syncing all ${targetHadiths.length} hadiths for ${dbSlug} concurrently...`);
      
      let updatedCount = 0;
      const concurrency = 20;
      
      for (let i = 0; i < targetHadiths.length; i += concurrency) {
        const chunk = targetHadiths.slice(i, i + concurrency);
        
        await Promise.all(chunk.map(async (h) => {
          const num = h.hadithnumber;
          const text_ar = h.text;
          
          if (text_ar && text_ar.length > 5) {
            const { error } = await sb.from('hadiths')
              .update({ text_ar: text_ar })
              .eq('book_slug', dbSlug)
              .eq('number', num)
              .is('text_ar', null); // Only update if null to be safe
              
            if (!error) updatedCount++;
          }
        }));
        
        if (i % 1000 === 0 && i > 0) {
           console.log(`... processed ${i} / ${targetHadiths.length}`);
        }
      }
      console.log(`Successfully synced ${updatedCount} Arabic texts for ${dbSlug}.`);
      
    } catch (err) {
      console.log(`Error processing ${dbSlug}: ${err.message}`);
    }
  }
  
  console.log("\nSync Process Completed!");
}

syncArabic();
