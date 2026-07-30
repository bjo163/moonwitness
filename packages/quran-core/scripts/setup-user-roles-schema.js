import { createClient } from "@supabase/supabase-js"

const SUPABASE_URL = "https://ixclyaugedwwptbqsozv.supabase.co"
const SUPABASE_SECRET_KEY = process.env.SUPABASE_SECRET_KEY || "sb_secret_qEdkK1vRFn3KDzxX5kkg4w_UnrZnKdT"

const sb = createClient(SUPABASE_URL, SUPABASE_SECRET_KEY)

async function setupUserRolesSchema() {
  console.log("🚀 Setting up user_profiles (roles: public/admin) & comments in Supabase Cloud DB...")

  // Seed default admin and public user profile
  const seedProfiles = [
    {
      email: "admin@moonwitness.com",
      name: "Ustadz Administrator",
      role: "admin",
      avatar_url: "👑",
    },
    {
      email: "hamba@moonwitness.com",
      name: "Hamba Allah",
      role: "public",
      avatar_url: "🌙",
    },
  ]

  const { data: profiles, error: pErr } = await sb
    .from("user_profiles")
    .upsert(seedProfiles, { onConflict: "email" })
    .select()

  if (pErr) {
    console.warn("Notice upserting user profiles:", pErr.message)
  } else {
    console.log("✅ Seed User Profiles (Admin & Public) created in Supabase Cloud DB!", profiles.length, "profiles")
  }
}

setupUserRolesSchema().catch(console.error)
