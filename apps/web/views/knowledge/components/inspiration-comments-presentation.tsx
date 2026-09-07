"use client"

import type { FormEvent } from "react"
import {
  UserProfileModal,
  type UserProfile,
} from "../../auth/components/modals/user-profile-modal"
import type { UserProfile as WorkspaceUserProfile } from "@workspace/types"
import { Button, Textarea } from "@workspace/ui"

export type CommentItem = {
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

type Translate = (english: string, indonesian: string) => string

export function InspirationCommentsPresentation({
  comments,
  loading,
  userProfile,
  isModalOpen,
  commentText,
  submitting,
  submittedMessage,
  itemTitle,
  t,
  onOpenProfile,
  onCloseProfile,
  onSaveProfile,
  onSubmitComment,
  onCommentTextChange,
}: {
  comments: CommentItem[]
  loading: boolean
  userProfile: WorkspaceUserProfile | null | undefined
  isModalOpen: boolean
  commentText: string
  submitting: boolean
  submittedMessage: string
  itemTitle: string
  t: Translate
  onOpenProfile: () => void
  onCloseProfile: () => void
  onSaveProfile: (profile: UserProfile) => void
  onSubmitComment: (event: FormEvent<HTMLFormElement>) => void
  onCommentTextChange: (value: string) => void
}) {
  return (
    <div className="space-y-4 border-t border-primary/20 pt-6 font-mono">
      <UserProfileModal
        isOpen={isModalOpen}
        onClose={onCloseProfile}
        onSaveProfile={onSaveProfile}
      />

      <InspirationCommentsHeader
        commentCount={comments.length}
        userProfile={userProfile}
        t={t}
        onOpenProfile={onOpenProfile}
      />

      <form
        onSubmit={onSubmitComment}
        className="bg-panel/90 space-y-3 rounded-xl border border-border/40 bg-card/90 p-4"
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
            <Button
              variant="ghost"
              type="button"
              onClick={onOpenProfile}
              className="btn-primary mt-1 px-5 py-2 text-xs"
            >
              ⎔{" "}
              {t(
                "SET UP YOUR USER ID FIRST",
                "PROFILKAN NAMA / USER ID ANDA DULU"
              )}
            </Button>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2 border-b border-primary/15 pb-2">
              <span className="truncate text-xs font-bold text-foreground">
                {userProfile.avatar} {userProfile.name}
              </span>
              <span
                className={`rounded-md border px-2 py-0.5 font-mono text-[9px] font-black uppercase ${userProfile.role === "admin" ? "border-border bg-muted text-primary" : "border-emerald-500/40 bg-success/10 text-success"}`}
              >
                {userProfile.role === "admin"
                  ? "👑 ADMIN"
                  : "👥 JAMAAH (PUBLIC)"}
              </span>
            </div>
            <Textarea
              placeholder={t(
                `Write your reflection, contemplation, or prayer regarding ${itemTitle}...`,
                `Tuliskan perenungan, tadabbur, atau doa terkait ${itemTitle}...`
              )}
              value={commentText}
              onChange={(event) => onCommentTextChange(event.target.value)}
              required
              rows={2}
              className="w-full rounded-md border border-primary/30 bg-background p-3 text-xs text-foreground placeholder:text-primary focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
            />
            <div className="flex items-center justify-between pt-1">
              {submittedMessage ? (
                <span className="text-xs font-bold text-success">
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
              <Button
                variant="default"
                type="submit"
                disabled={submitting || !commentText.trim()}
                className="btn-primary px-4 py-2 text-[10px] disabled:opacity-50"
              >
                {submitting
                  ? t("💬 SENDING...", "💬 MENGIRIM...")
                  : t("💬 SEND HIKMAH REFLECTION", "💬 KIRIM REFLEKSI HIKMAH")}
              </Button>
            </div>
          </>
        )}
      </form>

      {loading ? (
        <div className="space-y-2">
          {[1, 2].map((item) => (
            <div
              key={item}
              className="h-16 w-full animate-pulse rounded-xl border border-border/40 bg-card/90"
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
          <div className="-background pointer-events-none absolute right-0 bottom-0 left-0 z-10 h-12 bg-gradient-to-t to-transparent" />
          <div
            className="hide-scrollbar max-h-[400px] space-y-2.5 overflow-y-auto pb-12"
            style={{
              maskImage:
                "linear-gradient(to bottom, black 85%, transparent 100%)",
              WebkitMaskImage:
                "linear-gradient(to bottom, black 85%, transparent 100%)",
            }}
          >
            {comments.map((comment) => (
              <InspirationCommentCard key={comment.id} comment={comment} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function InspirationCommentsHeader({
  commentCount,
  userProfile,
  t,
  onOpenProfile,
}: {
  commentCount: number
  userProfile: WorkspaceUserProfile | null | undefined
  t: Translate
  onOpenProfile: () => void
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="rounded-md text-[10px]">💬 HOLOGRAM COMMUNITY CHAT</span>
        <span className="text-[10px] font-black text-primary">({commentCount})</span>
      </div>
      {!userProfile ? (
        <Button variant="ghost" type="button" onClick={onOpenProfile} className="btn-primary btn-primary-ghost flex items-center gap-1 px-3 py-1 text-[10px]">
          <span className="text-primary">⎔</span><span>{t("SETUP USER ID", "PROFILKAN NAMA")}</span>
        </Button>
      ) : (
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-success">● ACTIVE: {userProfile.avatar} {userProfile.name}</span>
          <Button variant="ghost" type="button" onClick={onOpenProfile} className="text-[9px] font-bold text-primary underline hover:text-foreground">[{t("EDIT", "UBAH")}]</Button>
        </div>
      )}
    </div>
  )
}

function InspirationCommentCard({
  comment,
}: {
  comment: CommentItem
}) {
  const isAdmin =
    comment.user_role === "admin" || comment.user_avatar === "👑"

  return (
    <div
      className={`space-y-1.5 rounded-xl border border-border/40 bg-card/90 p-3.5 ${isAdmin ? "border-secondary/40 bg-secondary/10" : "bg-panel border-primary/20"}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="badge-clip flex h-6 w-6 shrink-0 items-center justify-center bg-primary/20 text-xs">
            {comment.user_avatar || (isAdmin ? "👑" : "🌙")}
          </span>
          <span className="text-xs font-bold text-foreground">
            {comment.user_name}
          </span>
          {isAdmin && (
            <span className="rounded-md border border-border bg-muted px-1.5 py-0 font-mono text-[8px] text-primary">
              👑 ADMIN
            </span>
          )}
        </div>
        <span className="text-[9px] text-primary">
          {new Date(comment.created_at).toLocaleTimeString("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
          })} {" "}
          WIB
        </span>
      </div>
      <p className="pl-8 font-mono text-xs leading-relaxed text-foreground/90">
        &quot;{comment.comment_text}&quot;
      </p>
    </div>
  )
}
