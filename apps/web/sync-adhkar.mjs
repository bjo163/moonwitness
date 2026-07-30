import fs from 'fs'
import { createClient } from '@supabase/supabase-js'

const env = fs.readFileSync('.env.local', 'utf-8')
const url = env.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/)?.[1]
const key = env.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.*)/)?.[1]

const sb = createClient(url, key)

function enrich(item) {
  let cat = 'Harian';
  let timing = 'Semua';
  let benefit = 'Ketenangan Hati & Perlindungan';
  let source = item.tentang || 'Hisnul Muslim';

  const tags = item.tag || [];
  const grup = (item.grup || '').toLowerCase();
  
  if (tags.includes('pagi') || grup.includes('pagi')) { cat = 'Pagi'; timing = 'Pagi'; }
  else if (tags.includes('sore') || tags.includes('petang') || grup.includes('sore')) { cat = 'Sore'; timing = 'Sore'; }
  else if (tags.includes('malam') || tags.includes('tidur') || grup.includes('tidur')) { cat = 'Malam'; timing = 'Malam'; }
  else if (tags.includes('perjalanan') || grup.includes('musafir') || grup.includes('kendaraan')) { cat = 'Perjalanan'; }
  else if (tags.includes('lindung') || grup.includes('takut') || grup.includes('bencana')) { cat = 'Perlindungan'; }
  else if (grup.includes('makan') || grup.includes('pakaian') || grup.includes('rumah')) { cat = 'Rumah & Keluarga'; }
  else if (grup.includes('shalat') || grup.includes('wudhu') || grup.includes('azan')) { cat = 'Shalat & Ibadah'; }
  else if (tags.includes('sakit') || grup.includes('musibah') || grup.includes('marah')) { cat = 'Darurat & Kesulitan'; }

  // Extract a shorter benefit from the 'tentang' text if possible
  const lines = source.split('\\n').filter(l => l.trim().length > 0);
  if (lines.length > 1) {
    source = lines[0].replace('Sumber: Hisnul Muslim.', '').trim();
    benefit = lines[lines.length - 1].replace('Sumber: Hisnul Muslim.', '').trim();
    if (benefit.length < 5) benefit = 'Ketenangan Hati & Perlindungan';
  }

  // Cap source length
  if (source.length > 100) source = source.substring(0, 97) + '...';
  if (benefit.length > 100) benefit = benefit.substring(0, 97) + '...';

  return {
    title: item.nama,
    arabic: item.ar,
    latin: item.tr,
    translation: item.idn,
    category: cat,
    timing: timing,
    source: source || 'Hisnul Muslim',
    benefit: benefit || 'Ketenangan Hati'
  };
}

async function syncEQuran() {
  try {
    const res = await fetch('https://equran.id/api/doa');
    const json = await res.json();
    const data = json.data;
    
    console.log(`Fetched ${data.length} Hisnul Muslim Doas from EQuran API.`);
    
    const enrichedData = data.map(enrich);
    
    console.log("Emptying old database...");
    await sb.from('adhkar').delete().neq('id', 0);
    
    console.log("Injecting into Supabase...");
    
    const chunkSize = 25;
    let inserted = 0;
    
    for (let i = 0; i < enrichedData.length; i += chunkSize) {
      const chunk = enrichedData.slice(i, i + chunkSize);
      const { error } = await sb.from('adhkar').insert(chunk);
      if (error) {
        console.error("Error inserting chunk:", error);
      } else {
        inserted += chunk.length;
        console.log(`Inserted ${inserted} / ${enrichedData.length}...`);
      }
    }
    
    console.log(`✅ Successfully synced ${inserted} Hisnul Muslim authentic doas to Supabase!`);
    
  } catch (e) {
    console.log("Error:", e.message);
  }
}

syncEQuran();
