import { NextRequest, NextResponse } from "next/server"
import { MoonClient } from "@moon/client"

const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:4000"
const commentRateWindowMs = 60_000
const commentRateLimit = 10
const commentRate = new Map<number, { count: number; startedAt: number }>()

function getBearerToken(req: NextRequest): string | null {
  const authorization = req.headers.get("authorization")
  if (authorization?.startsWith("Bearer ")) return authorization.slice(7).trim() || null
  return req.cookies.get("moon_token")?.value || null
}

async function getSession(req: NextRequest) {
  const token = getBearerToken(req)
  if (!token) return null
  const client = new MoonClient({ baseUrl: apiBaseUrl, token })
  try {
    const response = await client.request("GET", "/auth/me")
    return { client, user: response.user }
  } catch {
    return null
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const session = await getSession(req)
  const client = session?.client || new MoonClient({ baseUrl: apiBaseUrl })

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

    let comments = []
    try {
      const json = await client.request(
        "GET",
        `/api/fx.msg?resModel=${resModel}`
      )
      if (json && !json.error) {
        comments = json.data || []
      }
    } catch (apiErr) {
      console.warn(
        "[MoonClient] Database connection timeout or API error, falling back to empty comments:",
        apiErr
      )
      comments = []
    }

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
    const session = await getSession(req)
    if (!session) return NextResponse.json({ error: "Authentication required", code: "AUTH_REQUIRED" }, { status: 401 })
    const body = await req.json()
    const {
      period_code,
      date_str,
      item_type,
      item_id,
      user_avatar,
      comment_text,
    } = body

    if (typeof comment_text !== "string" || !comment_text.trim()) {
      return NextResponse.json(
        { error: "Teks komentar wajib diisi." },
        { status: 400 }
      )
    }

    if (comment_text.trim().length > 2000) {
      return NextResponse.json({ error: "Teks komentar terlalu panjang." }, { status: 400 })
    }

    const itemId = Number(item_id)
    if (!Number.isSafeInteger(itemId) || itemId <= 0) {
      return NextResponse.json({ error: "item_id tidak valid." }, { status: 400 })
    }

    const userId = Number(session.user.id)
    const now = Date.now()
    const currentRate = commentRate.get(userId)
    const rate = currentRate && now - currentRate.startedAt < commentRateWindowMs
      ? currentRate
      : { count: 0, startedAt: now }
    if (rate.count >= commentRateLimit) {
      return NextResponse.json({ error: "Terlalu banyak komentar. Coba lagi nanti.", code: "RATE_LIMITED" }, { status: 429 })
    }
    rate.count += 1
    commentRate.set(userId, rate)

    const cleanEmail = String(session.user.email || "").trim().toLowerCase()
    const userName = String(session.user.name || cleanEmail.split("@")[0] || "User").trim()
    const role = userId === 1 ? "admin" : "user"

    const newCommentMeta = {
      period_code: period_code || "zuhur",
      date_str: date_str || new Date().toISOString().split("T")[0],
      item_type: item_type || "AYAH",
      user_id: userId,
      user_email: cleanEmail,
      user_name: userName,
      user_role: role,
      user_avatar: user_avatar || (role === "admin" ? "👑" : "🌙"),
      comment_text: comment_text.trim(),
      likes_count: 0,
    }

    const fxMsgPayload = {
      resModel: "wx.scripture.verse",
      resId: itemId,
      messageType: "comment",
      body: JSON.stringify(newCommentMeta),
    }

    const json = await session.client.request(
      "POST",
      "/api/fx.msg",
      fxMsgPayload
    )
    if (json.error) throw new Error(json.error)

    return NextResponse.json({
      success: true,
      comment: {
        ...newCommentMeta,
        id: json.data?.id,
        item_id: fxMsgPayload.resId,
      },
    })
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
    const session = await getSession(req)
    if (!session) return NextResponse.json({ error: "Authentication required", code: "AUTH_REQUIRED" }, { status: 401 })

    const commentResponse = await session.client.request("GET", `/api/fx.msg/${id}`)
    const comment = commentResponse.data?.data || commentResponse.data
    let metadata: any = {}
    try { metadata = JSON.parse(comment?.body || "{}") } catch { metadata = {} }
    const isOwner = Number(metadata.user_id) === Number(session.user.id)
      || String(metadata.user_email || "").toLowerCase() === String(session.user.email || "").toLowerCase()
    if (Number(session.user.id) !== 1 && !isOwner) {
      return NextResponse.json({ error: "You may only delete your own comments", code: "AUTH_FORBIDDEN" }, { status: 403 })
    }

    const json = await session.client.request("DELETE", `/api/fx.msg/${id}`)
    if (json.error) throw new Error(json.error)

    return NextResponse.json({
      success: true,
      message: `Komentar ID ${id} berhasil dihapus.`,
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
