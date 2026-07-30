import { createClient } from "@supabase/supabase-js"
import crypto from "crypto"

const SUPABASE_URL = "https://ixclyaugedwwptbqsozv.supabase.co"
const SUPABASE_SECRET_KEY = process.env.SUPABASE_SECRET_KEY || "sb_secret_qEdkK1vRFn3KDzxX5kkg4w_UnrZnKdT"

const sb = createClient(SUPABASE_URL, SUPABASE_SECRET_KEY)

export function hashPassword(plainTextPassword) {
  const salt = "mw_salt_2026_quran_app"
  return crypto.createHash("sha256").update(plainTextPassword + salt).digest("hex")
}

async function seedAdminRocksoul() {
  console.log("🔐 Encrypting password & Seeding Admin Rocksoul in Supabase Cloud DB...")

  const adminEmail = "rocksoul@moonwitness.com"
  const adminRawPassword = "M3@ALLAHSWT"
  const hashedPassword = hashPassword(adminRawPassword)

  const adminUser = {
    email: adminEmail,
    name: "Admin Rocksoul",
    password: hashedPassword,
    role: "admin",
    avatar_url: "👑",
  }

  let { data, error } = await sb
    .from("user_profiles")
    .upsert([adminUser], { onConflict: "email" })
    .select()

  if (error && error.message && error.message.includes("password")) {
    console.warn("⚠️ Kolom 'password' belum ada di Supabase. Menandai akun sebagai admin (tanpa kolom password sementara)...")
    const fallbackUser = {
      email: adminEmail,
      name: "Admin Rocksoul",
      role: "admin",
      avatar_url: "👑",
    }
    const res = await sb.from("user_profiles").upsert([fallbackUser], { onConflict: "email" }).select()
    data = res.data
    error = res.error
    console.log("\n========================================================")
    console.log("💡 TIPS MIGRASI SUPABASE:")
    console.log("Untuk mengaktifkan penyimpanan kolom hash password di Supabase Cloud DB, silakan salin dan jalankan isi file packages/quran-core/supabase/schema-008.sql di SQL Editor Supabase Anda!")
    console.log("========================================================\n")
  }

  if (error) {
    console.error("Notice upserting admin rocksoul:", error.message)
  } else {
    console.log("✅ Admin user rocksoul@moonwitness.com berhasil didaftarkan sebagai ADMIN di Supabase Cloud DB!", data)
  }
}

seedAdminRocksoul().catch(console.error)
