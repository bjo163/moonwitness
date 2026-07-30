import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })
dotenv.config({ path: '.env' })

const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

async function check() {
  const { data, error } = await sb.from('hadith').select('*').limit(1)
  console.log('hadith table:', error ? error.message : 'EXISTS, count: ' + data.length)
  
  const { data: d2, error: e2 } = await sb.from('hadits').select('*').limit(1)
  console.log('hadits table:', e2 ? e2.message : 'EXISTS, count: ' + d2.length)
}

check()
