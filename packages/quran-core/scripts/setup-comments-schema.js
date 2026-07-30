import { createClient } from "@supabase/supabase-js"

const SUPABASE_URL = "https://ixclyaugedwwptbqsozv.supabase.co"
const SUPABASE_SECRET_KEY = process.env.SUPABASE_SECRET_KEY || "sb_secret_qEdkK1vRFn3KDzxX5kkg4w_UnrZnKdT"

const sb = createClient(SUPABASE_URL, SUPABASE_SECRET_KEY)

async function setupSchema() {
  console.log("🚀 Setting up user_profiles & inspiration_comments tables in Supabase Cloud...")

  const seedComments = [
    {
      period_code: "zuhur",
      date_str: "2026-07-26",
      item_type: "AYAH",
      item_id: 5690,
      user_name: "Hamba Allah",
      user_avatar: "🌙",
      comment_text: "Masya Allah, ayat ini sangat menyentuh hati di waktu Zuhur hari ini. Semoga kita selalu berada dalam bimbingan Allah SWT.",
      likes_count: 5,
    },
    {
      period_code: "zuhur",
      date_str: "2026-07-26",
      item_type: "AYAH",
      item_id: 5690,
      user_name: "Penuntut Ilmu",
      user_avatar: "✨",
      comment_text: "Pasangan Asmaul Husna Al-Fattah & Al-Muta'ali membuat makna ayat ini semakin terasa dalam. Alhamdulillah.",
      likes_count: 3,
    },
  ]

  const { data, error } = await sb.from("inspiration_comments").insert(seedComments).select()

  if (error) {
    console.warn("Notice inserting seed comments:", error.message)
  } else {
    console.log("✅ Seed comments successfully inserted into Supabase Cloud DB!", data.length, "rows")
  }
}

setupSchema().catch(console.error)
