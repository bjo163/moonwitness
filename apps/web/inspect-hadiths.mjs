import fs from 'fs'
import { createClient } from '@supabase/supabase-js'

const env = fs.readFileSync('.env.local', 'utf-8')
const url = env.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/)?.[1]
const key = env.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.*)/)?.[1]

const sb = createClient(url, key)

async function run() {
  const { data } = await sb.from('hadiths').select('*').limit(2)
  console.log(JSON.stringify(data, null, 2))
}
run()
