"use client"

import { useState, useEffect } from "react"
import {
  UserProfileModal,
  type UserProfile,
} from "../../auth/components/modals/user-profile-modal"
import { useLanguage } from "@core/contexts"
import { useMoonStore } from "@core/store/moon-store"
import { queueOfflineSync } from "@core/utils/offline-sync"
import { useUserProfile } from "@core/hooks"

type CommentItem = {
  id: string
  period_code: string
  date_str: string
  item_type: string
  item_id: number
  user_email?: string
  user_name: string
  user_role?: string
  user_avatar: string
  comment_text: string
  likes_count: number
  created_at: string
}

type InspirationCommentsProps = {
  periodCode: string
  dateStr: string
  itemId: number
  itemTitle?: string
}

export function InspirationCommentsClient({
  periodCode,
  dateStr,
  itemId,
  itemTitle = "Ayat Pilihan Ini",
}: InspirationCommentsProps) {
  const { t } = useLanguage()
  const [comments, setComments] = useState<CommentItem[]>([])
  const [loading, setLoading] = useState(true)
  const { profile: userProfile, saveProfile } = useUserProfile()
  const [isModalOpen, setIsModalOpen] = useState(false)

  const [commentText, setCommentText] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [submittedMessage, setSubmittedMessage] = useState("")

  async function fetchComments() {
    setLoading(true)
    try {
      const res = await fetch(
        `/api/comments?period_code=${periodCode}&date_str=${dateStr}`
      )
      if (res.ok) {
        const json = await res.json()
        if (json && json.comments) {
          setComments(json.comments)
        }
      }
    } catch (err) {
      console.warn("Failed to fetch comments:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchComments()

    // Set up real-time listener via MoonStore
    const unsubscribe = useMoonStore
      .getState()
      .subscribe("fx.msg", (msgData) => {
        // Refresh comments when a new message is broadcasted
        fetchComments()
      })

    return () => {
      unsubscribe()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [periodCode, dateStr])

  async function handleSubmitComment(e: React.FormEvent) {
    e.preventDefault()

    if (!userProfile) {
      setIsModalOpen(true)
      return
    }

    if (!commentText.trim()) return

    setSubmitting(true)
    setSubmittedMessage("")

    try {
      const payload = {
        period_code: periodCode,
        date_str: dateStr,
        item_type: "AYAH",
        item_id: itemId,
        user_email: userProfile.email,
        user_name: userProfile.name,
        user_role: userProfile.role,
        user_avatar: userProfile.avatar,
        comment_text: commentText.trim(),
      }

      if (!navigator.onLine) {
        queueOfflineSync("/api/comments", "POST", payload)
        setCommentText("")
        setSubmittedMessage(
          t(
            "📡 SAVED OFFLINE. WILL SYNC LATER.",
            "📡 TERSIMPAN OFFLINE. AKAN DISINKRON SAAT ONLINE."
          )
        )
        setTimeout(() => setSubmittedMessage(""), 4000)
        setSubmitting(false)
        return
      }

      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        setCommentText("")
        setSubmittedMessage(
          t(
            "✅ REFLEKSI HIKMAH BERHASIL DIKIRIM SEBAGAI HOLOGRAM FEED!",
            "✅ REFLEKSI HIKMAH BERHASIL DIKIRIM SEBAGAI HOLOGRAM FEED!"
          )
        )
        fetchComments()
        setTimeout(() => setSubmittedMessage(""), 4000)
      } else {
        const errJson = await res.json()
        alert(errJson.error || "Gagal mengirim komentar")
      }
    } catch {
      alert("Terjadi kesalahan koneksi.")
    } finally {
      setSubmitting(false)
    }
  }

  function handleSaveProfile(newProfile: UserProfile) {
    saveProfile(newProfile)
  }

  return (
    <div className="space-y-4 border-t border-primary/20 pt-6 font-mono">
      <UserProfileModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSaveProfile={handleSaveProfile}
      />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="tag-clip tag-clip text-[10px]">
            💬 HOLOGRAM COMMUNITY CHAT
          </span>
          <span className="text-[10px] font-black text-primary">
            ({comments.length})
          </span>
        </div>

        {!userProfile ? (
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="btn-primary btn-primary-ghost flex items-center gap-1 px-3 py-1 text-[10px] btn-clip"
          >
            <span className="text-primary">⎔</span>
            <span>{t("SETUP USER ID", "PROFILKAN NAMA")}</span>
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-success text-[10px] font-bold">
              ● ACTIVE: {userProfile.avatar} {userProfile.name}
            </span>
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="text-[9px] font-bold text-primary underline hover:text-white"
            >
              [{t("EDIT", "UBAH")}]
            </button>
          </div>
        )}
      </div>

      {/* Write Comment Form */}
      <form
        onSubmit={handleSubmitComment}
        className="bg-panel/90 space-y-3 panel-glass p-4 card-clip"
      >
        {!userProfile ? (
          <div className="space-y-2 py-4 text-center">
            <p className="text-xs text-primary">
              &gt;{" "}
              {t(
                "// WRITE YOUR CONTEMPLATION, REFLECTION, OR PRAYER FOR GLOBAL TRANSMISSION.",
                "// TULISKAN TADABBUR, PERENUNGAN HIKMAH, ATAU DOA ANDA UNTUK DIPILIH DI ROTASI GLOBAL."
              )}
            </p>
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="btn-primary mt-1 px-5 py-2 text-xs btn-clip"
            >
              <span>
                ⎔{" "}
                {t(
                  "SET UP YOUR USER ID FIRST",
                  "PROFILKAN NAMA / USER ID ANDA DULU"
                )}
              </span>
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between gap-2 border-b border-primary/15 pb-2">
              <div className="flex items-center gap-2">
                <span className="truncate text-xs font-bold text-foreground">
                  {userProfile.avatar} {userProfile.name}
                </span>
                <span
                  className={`tag-clip px-2 py-0.5 text-[9px] font-black uppercase ${
                    userProfile.role === "admin"
                      ? "tag-clip-purple"
                      : "tag-clip-green"
                  }`}
                >
                  {userProfile.role === "admin"
                    ? "👑 ADMIN"
                    : "👥 JAMAAH (PUBLIC)"}
                </span>
              </div>
            </div>

            <textarea
              placeholder={t(
                `Write your reflection, contemplation, or prayer regarding ${itemTitle}...`,
                `Tuliskan perenungan, tadabbur, atau doa terkait ${itemTitle}...`
              )}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              required
              rows={2}
              className="tag-clip bg-space w-full border border-primary/30 p-3 text-xs text-foreground placeholder:text-primary focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
            />

            <div className="flex items-center justify-between pt-1">
              {submittedMessage ? (
                <span className="text-success text-xs font-bold">
                  {submittedMessage}
                </span>
              ) : (
                <span className="text-[9px] text-primary">
                  {t(
                    "// YOUR USER ID WILL BE LINKED TO THIS REFLECTION.",
                    "// USER ID ANDA AKAN TERHUBUNG DENGAN REFLEKSI HIKMAH INI."
                  )}
                </span>
              )}

              <button
                type="submit"
                disabled={submitting || !commentText.trim()}
                className="btn-primary px-4 py-2 text-[10px] btn-clip disabled:opacity-50"
              >
                <span>
                  {submitting
                    ? t("💬 SENDING...", "💬 MENGIRIM...")
                    : t(
                        "💬 SEND HIKMAH REFLECTION",
                        "💬 KIRIM REFLEKSI HIKMAH"
                      )}
                </span>
              </button>
            </div>
          </>
        )}
      </form>

      {/* Comments List */}
      {loading ? (
        <div className="space-y-2">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="h-16 w-full animate-pulse panel-glass card-clip"
            />
          ))}
        </div>
      ) : comments.length === 0 ? (
        <p className="py-4 text-center text-xs text-primary italic">
          {t(
            "// NO REFLECTIONS TRANSMITTED FOR THIS PRAYER PERIOD YET. BE THE FIRST TO TRANSMIT!",
            "// BELUM ADA REFLEKSI HIKMAH UNTUK WAKTU SHALAT INI. JADILAH YANG PERTAMA MENULISKAN PERENUNGAN!"
          )}
        </p>
      ) : (
        <div className="relative mt-2">
          {/* Holographic fade at the bottom */}
          <div className="pointer-events-none absolute right-0 bottom-0 left-0 z-10 h-12 bg-gradient-to-t from-[#040C1A] to-transparent" />

          <div
            className="hide-scrollbar max-h-[400px] space-y-2.5 overflow-y-auto pb-12"
            style={{
              maskImage:
                "linear-gradient(to bottom, black 85%, transparent 100%)",
              WebkitMaskImage:
                "linear-gradient(to bottom, black 85%, transparent 100%)",
            }}
          >
            {comments.map((c) => {
              const isAdmin = c.user_role === "admin" || c.user_avatar === "👑"

              return (
                <div
                  key={c.id}
                  className={`space-y-1.5 panel-glass p-3.5 card-clip ${
                    isAdmin
                      ? "border-secondary/40 bg-secondary/10"
                      : "bg-panel border-primary/20"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="badge-clip flex h-6 w-6 shrink-0 items-center justify-center bg-primary/20 text-xs">
                        {c.user_avatar || (isAdmin ? "👑" : "🌙")}
                      </span>
                      <span className="text-xs font-bold text-foreground">
                        {c.user_name}
                      </span>

                      {isAdmin && (
                        <span className="tag-clip tag-clip-purple tag-clip py-0 text-[8px]">
                          👑 ADMIN
                        </span>
                      )}
                    </div>

                    <span className="text-[9px] text-primary">
                      {new Date(c.created_at).toLocaleTimeString("id-ID", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}{" "}
                      WIB
                    </span>
                  </div>

                  <p className="pl-8 font-mono text-xs leading-relaxed text-foreground/90">
                    "{c.comment_text}"
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
