import { createClient } from "@supabase/supabase-js"

const SUPABASE_URL = "https://ixclyaugedwwptbqsozv.supabase.co"
const SUPABASE_SECRET_KEY = process.env.SUPABASE_SECRET_KEY || "sb_secret_qEdkK1vRFn3KDzxX5kkg4w_UnrZnKdT"

const sb = createClient(SUPABASE_URL, SUPABASE_SECRET_KEY)

async function disableRLS() {
  console.log("🔓 Enabling public access policy on inspiration_comments table...")

  // Insert using service secret key in API route
  const { data, error } = await sb.from("inspiration_comments").insert({
    period_code: "zuhur",
    date_str: "2026-07-26",
    item_type: "AYAH",
    item_id: 5690,
    user_name: "Pengunjung Web",
    user_avatar: "🤲",
    comment_text: "Fitur komentar dan refleksi hikmah jamaah ini sangat indah! Bismillah.",
  }).select()

  if (error) {
    console.error("Error inserting via secret key:", error.message)
  } else {
    console.log("✅ Comment successfully inserted into Supabase Cloud DB!", data)
  }
}

disableRLS()
