import fs from 'fs'
import { createClient } from '@supabase/supabase-js'

const env = fs.readFileSync('.env.local', 'utf-8')
const url = env.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/)?.[1]
const key = env.match(/SUPABASE_SERVICE_ROLE_KEY=(.*)/)?.[1]

const sb = createClient(url, key)

async function test() {
  const { data } = await sb.from('surahs').select('*').eq('number', 1).single()
  console.log(Object.keys(data))
  console.log(data)
}

test()
