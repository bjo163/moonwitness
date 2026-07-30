import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const SUPABASE_URL =
  process.env.SUPABASE_URL || "https://ixclyaugedwwptbqsozv.supabase.co"
const SUPABASE_SECRET_KEY =
  process.env.SUPABASE_SECRET_KEY || "sb_secret_qEdkK1vRFn3KDzxX5kkg4w_UnrZnKdT"

function getAdminSupabaseClient() {
  return createClient(SUPABASE_URL, SUPABASE_SECRET_KEY)
}

export async function GET(req: NextRequest) {
  const sb = getAdminSupabaseClient()
  const { searchParams } = new URL(req.url)

  const fetchAll = searchParams.get("all") === "true"
  const periodCode = searchParams.get("period_code") || "zuhur"
  const dateStr = searchParams.get("date_str") || "2026-07-26"

  try {
    let query = sb.from("inspiration_comments").select("*")

    if (!fetchAll) {
      query = query.eq("date_str", dateStr).eq("period_code", periodCode)
    }

    const { data: comments, error } = await query.order("created_at", {
      ascending: false,
    })

    if (error) throw error

    return NextResponse.json({
      period_code: fetchAll ? "ALL" : periodCode,
      date_str: fetchAll ? "ALL" : dateStr,
      count: comments ? comments.length : 0,
      comments: comments || [],
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const sb = getAdminSupabaseClient()

  try {
    const body = await req.json()
    const {
      period_code,
      date_str,
      item_type,
      item_id,
      user_email,
      user_name,
      user_role,
      user_avatar,
      comment_text,
    } = body

    if (!comment_text || !user_name || !user_email) {
      return NextResponse.json(
        { error: "Email, Nama, dan Teks komentar wajib diisi." },
        { status: 400 }
      )
    }

    const cleanEmail = user_email.trim().toLowerCase()
    const role =
      user_role ||
      (cleanEmail.includes("admin") || cleanEmail.includes("rocksoul")
        ? "admin"
        : "public")

    const newComment = {
      period_code: period_code || "zuhur",
      date_str: date_str || new Date().toISOString().split("T")[0],
      item_type: item_type || "AYAH",
      item_id: item_id || 1,
      user_email: cleanEmail,
      user_name: user_name.trim(),
      user_role: role,
      user_avatar: user_avatar || (role === "admin" ? "👑" : "🌙"),
      comment_text: comment_text.trim(),
      likes_count: 0,
    }

    const { data, error } = await sb
      .from("inspiration_comments")
      .insert([newComment])
      .select()
      .single()

    if (error) {
      // Fallback response if user_email or user_role column cache is pending
      const fallbackComment = {
        period_code: period_code || "zuhur",
        date_str: date_str || new Date().toISOString().split("T")[0],
        item_type: item_type || "AYAH",
        item_id: item_id || 1,
        user_name: user_name.trim(),
        user_avatar: user_avatar || (role === "admin" ? "👑" : "🌙"),
        comment_text: comment_text.trim(),
        likes_count: 0,
      }

      const { data: fbData, error: fbErr } = await sb
        .from("inspiration_comments")
        .insert([fallbackComment])
        .select()
        .single()

      if (fbErr) throw fbErr
      return NextResponse.json({
        success: true,
        comment: { ...fbData, user_email: cleanEmail, user_role: role },
      })
    }

    return NextResponse.json({ success: true, comment: data })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  const sb = getAdminSupabaseClient()
  const { searchParams } = new URL(req.url)
  const id = searchParams.get("id")

  if (!id) {
    return NextResponse.json(
      { error: "ID komentar wajib disertakan." },
      { status: 400 }
    )
  }

  try {
    const { error } = await sb
      .from("inspiration_comments")
      .delete()
      .eq("id", id)

    if (error) throw error

    return NextResponse.json({
      success: true,
      message: `Komentar ID ${id} berhasil dihapus.`,
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
