"use client"

import { useState, useEffect } from "react"
import type { UserProfile } from "../../auth/components/modals/user-profile-modal"
import { useLanguage } from "@workspace/state"
import {
  moonClientInstance,
  queueOfflineSync,
  useUserProfile,
} from "@moon/client"
import {
  InspirationCommentsPresentation,
  type CommentItem,
} from "./inspiration-comments-presentation"

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

    const unsubscribe = moonClientInstance.subscribe(
      "fx.msg",
      (_msgData: any) => {
        fetchComments()
      }
    )

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
    <InspirationCommentsPresentation
      comments={comments}
      loading={loading}
      userProfile={userProfile}
      isModalOpen={isModalOpen}
      commentText={commentText}
      submitting={submitting}
      submittedMessage={submittedMessage}
      itemTitle={itemTitle}
      t={t}
      onOpenProfile={() => setIsModalOpen(true)}
      onCloseProfile={() => setIsModalOpen(false)}
      onSaveProfile={handleSaveProfile}
      onSubmitComment={handleSubmitComment}
      onCommentTextChange={setCommentText}
    />
  )
}
