import fs from 'fs'
import { createClient } from '@supabase/supabase-js'

const env = fs.readFileSync('.env.local', 'utf-8')
const url = env.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/)?.[1]
const key = env.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.*)/)?.[1]

const sb = createClient(url, key)

async function run() {
  const { count: total } = await sb.from('hadiths').select('*', { count: 'exact', head: true })
  const { count: sahih } = await sb.from('hadiths').select('*', { count: 'exact', head: true }).ilike('grade', '%shahih%')
  const { count: hasan } = await sb.from('hadiths').select('*', { count: 'exact', head: true }).ilike('grade', '%hasan%')
  const { count: daif } = await sb.from('hadiths').select('*', { count: 'exact', head: true }).ilike('grade', '%dhaif%')
  
  console.log(`Total: ${total}, Sahih: ${sahih}, Hasan: ${hasan}, Daif: ${daif}`)
}
run()
