import { NextRequest, NextResponse } from "next/server"
import { moonClientInstance } from "@core/store/moon-store"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)

  const fetchAll = searchParams.get("all") === "true"
  const periodCode = searchParams.get("period_code") || "zuhur"
  const dateStr = searchParams.get("date_str") || "2026-07-26"

  try {
    // Determine the resModel mapped string. Currently mapping to "wx.scripture.verse"
    const resModel = "wx.scripture.verse" 
    
    // We map dateStr and periodCode to search filters.
    // However, since fx.msg doesn't have periodCode and dateStr native fields,
    // we assume the body is a stringified JSON containing these fields or we rely on 
    // the target resModel. For simplicity, we just fetch all comments and filter in JS 
    // if this is a small list, or better yet, MoonWitness might need a dedicated search
    // But since the user allowed keeping mocks if it's too complex, let's keep it simple.
    // Actually, we can just use `moonClientInstance.request` to search `fx.msg`.
    
    const json = await moonClientInstance.request("GET", `/api/fx.msg?resModel=${resModel}`)
    if (json.error) throw new Error(json.error)
      
    let comments = json.data || []
    
    // Convert fx.msg format back to the frontend shape
    let formattedComments = comments.map((msg: any) => {
      let meta: any = {}
      try {
        meta = JSON.parse(msg.body)
      } catch (e) {
        meta = { comment_text: msg.body }
      }
      return {
        id: msg.id,
        period_code: meta.period_code || "zuhur",
        date_str: meta.date_str || "2026-07-26",
        item_type: "AYAH",
        item_id: msg.resId,
        user_email: meta.user_email || "anonymous@moon.io",
        user_name: meta.user_name || "Anonymous",
        user_role: meta.user_role || "public",
        user_avatar: meta.user_avatar || "🌙",
        comment_text: meta.comment_text || msg.body,
        likes_count: meta.likes_count || 0,
        created_at: msg.createdAt,
      }
    })

    if (!fetchAll) {
      formattedComments = formattedComments.filter(
        (c: any) => c.date_str === dateStr && c.period_code === periodCode
      )
    }

    return NextResponse.json({
      period_code: fetchAll ? "ALL" : periodCode,
      date_str: fetchAll ? "ALL" : dateStr,
      count: formattedComments.length,
      comments: formattedComments,
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
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

    const newCommentMeta = {
      period_code: period_code || "zuhur",
      date_str: date_str || new Date().toISOString().split("T")[0],
      item_type: item_type || "AYAH",
      user_email: cleanEmail,
      user_name: user_name.trim(),
      user_role: role,
      user_avatar: user_avatar || (role === "admin" ? "👑" : "🌙"),
      comment_text: comment_text.trim(),
      likes_count: 0,
    }

    const fxMsgPayload = {
      resModel: "wx.scripture.verse",
      resId: item_id || 1,
      messageType: "comment",
      body: JSON.stringify(newCommentMeta)
    }

    const json = await moonClientInstance.request("POST", "/api/fx.msg", fxMsgPayload)
    if (json.error) throw new Error(json.error)

    return NextResponse.json({ success: true, comment: { ...newCommentMeta, id: json.data?.id, item_id: fxMsgPayload.resId } })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get("id")

  if (!id) {
    return NextResponse.json(
      { error: "ID komentar wajib disertakan." },
      { status: 400 }
    )
  }

  try {
    const json = await moonClientInstance.request("DELETE", `/api/fx.msg/${id}`)
    if (json.error) throw new Error(json.error)

    return NextResponse.json({
      success: true,
      message: `Komentar ID ${id} berhasil dihapus.`,
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
